const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    // Scroll to the bottom to trigger scripts
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 2000)); // wait for setInterval script
    
    const moved = await page.evaluate(() => {
        const el = document.querySelector('.knc-moved-watermark');
        return el ? el.outerHTML.substring(0, 500) : 'Not found';
    });
    console.log("Moved element HTML:", moved);
    await browser.close();
})();
