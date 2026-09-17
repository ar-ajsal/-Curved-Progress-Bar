const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    const layout = await page.evaluate(() => {
        const servicesEl = Array.from(document.querySelectorAll('*')).find(el => el.textContent === 'Services' && el.closest('footer'));
        if (!servicesEl) return 'Services not found';
        
        let container = servicesEl.parentElement;
        while (container && container.children.length < 5) {
            container = container.parentElement;
        }
        
        const watermark = document.querySelector('.framer-9ul640');
        
        return {
            containerClass: container ? container.className : null,
            watermarkExists: !!watermark,
            watermarkHTML: watermark ? watermark.outerHTML.substring(0, 200) : null
        };
    });
    console.log(JSON.stringify(layout, null, 2));
    await browser.close();
})();
