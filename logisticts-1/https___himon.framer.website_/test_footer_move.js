const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
        const servicesEl = Array.from(document.querySelectorAll('*')).find(el => el.textContent === 'Services' && el.closest('footer'));
        if (servicesEl) {
            let container = servicesEl.parentElement;
            // Go up until it's a layout column (SITEMAP, Home, etc)
            while (container && (!container.querySelector('nav') && container.children.length < 2)) {
                container = container.parentElement;
            }
            if (!container) container = servicesEl.parentElement.parentElement;
            let sitemapCol = container.parentElement;
            
            const watermark = document.querySelector('.framer-9ul640');
            if (watermark && sitemapCol) {
                // Remove original styling that makes it span the whole bottom
                watermark.style.position = 'relative';
                watermark.style.width = '140px';
                watermark.style.height = 'auto';
                watermark.style.marginTop = '40px';
                watermark.style.opacity = '1'; // make it more visible? The user asked to move it.
                // It's inside a column now, so we append it
                sitemapCol.appendChild(watermark);
            }
        }
    });
    
    // Scroll to the bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'footer_moved_font.png' });
    await browser.close();
})();
