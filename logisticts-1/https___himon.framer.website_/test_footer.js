const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
        // Hide the big watermark
        const el = document.querySelector('.framer-9ul640');
        if (el) el.style.setProperty('display', 'none', 'important');
    });
    
    // Scroll to the bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    // Wait a bit for scroll and any lazy loading
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'footer_hidden_watermark.png' });
    await browser.close();
})();
