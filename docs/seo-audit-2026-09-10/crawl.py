import requests, json, csv, time, collections, concurrent.futures, pathlib
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlsplit, urldefrag
import xml.etree.ElementTree as ET
BASE='https://metapacific.co'
OUT=pathlib.Path(__file__).parent
def fetch(url):
    try:
        t=time.time(); r=requests.get(url,timeout=25,headers={'User-Agent':'MetaPacific-SEO-Audit/1.0'},allow_redirects=True)
        return {'url':url,'final':r.url,'status':r.status_code,'seconds':round(time.time()-t,3),'bytes':len(r.content),'headers':dict(r.headers),'redirects':[{'status':x.status_code,'url':x.url} for x in r.history],'text':r.text if 'text' in r.headers.get('Content-Type','') or 'xml' in r.headers.get('Content-Type','') else ''}
    except Exception as e:return {'url':url,'status':0,'error':str(e),'text':''}
def parse(r):
    s=BeautifulSoup(r['text'],'html.parser')
    meta=lambda k:[n.get('content','') for n in s.select('meta') if n.get('name',n.get('property',n.get('http-equiv',''))).lower()==k]
    schemas=[];errors=[]
    for n in s.select('script[type="application/ld+json"]'):
        try:schemas.append(json.loads(n.string or n.get_text()))
        except Exception as e:errors.append(str(e))
    links=[{'url':urljoin(r.get('final',r['url']),a['href']),'anchor':a.get_text(' ',strip=True)} for a in s.select('a[href]')]
    return {**{k:v for k,v in r.items() if k!='text'},'title':[n.get_text(' ',strip=True) for n in s.select('title')],'description':meta('description'),'h1':[n.get_text(' ',strip=True) for n in s.select('h1')],'headings':[{'level':n.name,'text':n.get_text(' ',strip=True)} for n in s.select('h1,h2,h3,h4,h5,h6')],'canonical':[urljoin(r['url'],n.get('href','')) for n in s.select('link[rel="canonical"]')],'robots':meta('robots'),'og':{k:meta(k) for k in ['og:title','og:description','og:url','og:image','og:type','twitter:card']},'viewport':meta('viewport'),'lang':s.html.get('lang') if s.html else None,'schemas':schemas,'schema_errors':errors,'links':links,'ids':[n['id'] for n in s.select('[id]')],'images':[dict(n.attrs) for n in s.select('img')],'scripts':[n.get('src','') for n in s.select('script[src]')],'ga4':list(set(__import__('re').findall(r'G-[A-Z0-9]{6,}',r['text']))),'gtm':list(set(__import__('re').findall(r'GTM-[A-Z0-9]+',r['text']))),'refresh':meta('refresh'),'words':len(s.get_text(' ',strip=True).split())}
robots=fetch(BASE+'/robots.txt');sm=fetch(BASE+'/sitemap.xml')
urls=[x.text for x in ET.fromstring(sm['text']).iter() if x.tag.endswith('loc')]
extra=[BASE+'/'+p.name for p in OUT.parents[1].glob('*.html')]+[BASE+'/preview/']
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex: raw=list(ex.map(fetch,sorted(set(urls+extra))))
pages=[parse(r) for r in raw]
targets=set()
for p in pages:
    for a in p['links']:
        u=urldefrag(a['url'])[0]
        if u.startswith(('https://','http://')):targets.add(u)
    for vals in [p['og'].get('og:image',[])]:
        for u in vals: targets.add(urljoin(p['url'],u))
    for im in p['images']:
        if im.get('src'):targets.add(urljoin(p['url'],im['src']))
known={r['url']:r for r in raw}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
    for r in ex.map(fetch,sorted(targets-set(known))):known[r['url']]=r
variants=['http://metapacific.co/','http://www.metapacific.co/','https://www.metapacific.co/',BASE+'/seo-audit-nonexistent-20260910/',BASE+'/services']
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex: variant_results=list(ex.map(fetch,variants))
broken_fragments=[]
for p in pages:
    for a in p['links']:
        u,frag=urldefrag(a['url'])
        if frag and urlsplit(u).netloc=='metapacific.co' and u in known and known[u]['status']==200:
            soup=BeautifulSoup(known[u]['text'],'html.parser')
            if not soup.find(id=frag) and not soup.find(attrs={'name':frag}):broken_fragments.append({'source':p['url'],**a})
data={'sitemap_urls':urls,'robots':robots,'sitemap':sm,'pages':pages,'checks':[{k:v for k,v in r.items() if k!='text'} for r in known.values()],'variants':[{k:v for k,v in r.items() if k!='text'} for r in variant_results],'broken_fragments':broken_fragments}
(OUT/'crawl.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
with (OUT/'pages.csv').open('w',newline='',encoding='utf-8-sig') as f:
    fields=['url','status','in_sitemap','title','title_length','description','description_length','h1','canonical','robots','schema_types','og_image','ga4','gtm','words']
    w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
    for p in pages:
        types=[]
        def walk(x):
            if isinstance(x,dict):
                if '@type' in x:types.append(str(x['@type']))
                for v in x.values():walk(v)
            elif isinstance(x,list):
                for v in x:walk(v)
        walk(p['schemas'])
        w.writerow({'url':p['url'],'status':p['status'],'in_sitemap':p['url'] in urls,'title':' | '.join(p['title']),'title_length':len(' | '.join(p['title'])),'description':' | '.join(p['description']),'description_length':len(' | '.join(p['description'])),'h1':' | '.join(p['h1']),'canonical':' | '.join(p['canonical']),'robots':' | '.join(p['robots']),'schema_types':', '.join(sorted(set(types))),'og_image':' | '.join(p['og']['og:image']),'ga4':','.join(p['ga4']),'gtm':','.join(p['gtm']),'words':p['words']})
print(json.dumps({'pages':len(pages),'sitemap':len(urls),'targets':len(known),'failed':[{'url':r['url'],'status':r['status']} for r in known.values() if r['status']>=400 or r['status']==0],'fragments':broken_fragments},indent=2))
