const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/about-us.html', { waitUntil: 'networkidle0' });
    
    const exists = await page.evaluate(() => {
        return !!document.getElementById('knc-our-teams');
    });
    console.log("Teams section exists:", exists);
    await browser.close();
})();
