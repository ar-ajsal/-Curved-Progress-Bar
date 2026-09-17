const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Set mobile viewport width
    await page.setViewport({ width: 375, height: 667, isMobile: true });
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    // Scroll to the bottom to trigger scripts
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: 'footer_mobile.png' });
    await browser.close();
})();
