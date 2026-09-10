async (page) => {
  await page.setViewportSize({ width: 360, height: 844 });
  const routes = [
    "/", "/about/", "/contact/", "/disclosure/", "/field-notes/",
    "/field-notes/ai-effects-vs-traditional-vfx/", "/field-notes/fpv-vs-traditional-drone/",
    "/field-notes/virtual-tours-before-a-visit/", "/for-whom/", "/for-whom/enterprise/",
    "/pricing/", "/privacy/", "/resources/", "/services/", "/services/ai-media/",
    "/services/brand-design/", "/services/creative-tech/", "/services/drone-fpv/",
    "/services/growth/", "/services/social-content/", "/services/strategy/",
    "/services/virtual-tours/", "/services/visual-production/",
    "/services/web-landing-pages/", "/solutions/", "/terms/", "/tools/", "/values/",
    "/work/", "/work/01-anjuna-bay/", "/work/02-3d-renders/", "/work/03-sakti/",
    "/work/04-invest-island/", "/work/05-mini-map/", "/work/06-sardine-rote/",
    "/work/07-k-club-ubud/", "/work/08-villa-koh-samui/"
  ];
  const results = [];
  for (const route of routes) {
    await page.goto("http://127.0.0.1:4173" + route);
    results.push(await page.evaluate(() => ({
      route: location.pathname,
      title: document.title,
      h1s: document.querySelectorAll("h1").length,
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      brokenImages: Array.from(document.images).filter(img => img.complete && !img.naturalWidth).length,
      ogDescription: Boolean(document.querySelector('meta[property="og:description"]')),
      ogType: document.querySelector('meta[property="og:type"]').content
    })));
  }
  return results;
}
