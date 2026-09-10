from pathlib import Path
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET

root = Path(__file__).parents[2]
bad = []
for node in ET.parse(root / "sitemap.xml").getroot():
    url = next(child.text for child in node if child.tag.endswith("loc"))
    route = url.replace("https://metapacific.co/", "").strip("/")
    source = root / ("index.html" if not route else route + "/index.html")
    soup = BeautifulSoup(source.read_text(encoding="utf-8"), "html.parser")
    checks = {
        "title": len(soup.select("title")) == 1,
        "description": len(soup.select('meta[name="description"]')) == 1,
        "h1": len(soup.select("h1")) == 1,
        "canonical": len(soup.select('link[rel="canonical"]')) == 1,
        "og_description": len(soup.select('meta[property="og:description"]')) == 1,
        "og_type": len(soup.select('meta[property="og:type"]')) == 1,
        "footer_nav": len(soup.select('nav.foot-links[aria-label="Footer"]')) == 1,
    }
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        bad.append({"file": str(source), "failed": failed})

print({"pages": 37, "failed": bad})
raise SystemExit(1 if bad else 0)
