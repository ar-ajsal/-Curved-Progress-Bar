const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    const result = await page.evaluate(() => {
        const pTags = Array.from(document.querySelectorAll('p'));
        const sitemapP = pTags.find(p => p.textContent.trim() === 'SITEMAP');
        if (!sitemapP) return 'SITEMAP not found';
        
        let col = sitemapP.parentElement;
        while(col && col.tagName !== 'BODY') {
            const style = window.getComputedStyle(col);
            if (style.display === 'flex' && style.flexDirection === 'column' && col.children.length > 2) {
                break;
            }
            col = col.parentElement;
        }
        
        return col ? col.className : 'Column not found';
    });
    console.log("Column class:", result);
    await browser.close();
})();
