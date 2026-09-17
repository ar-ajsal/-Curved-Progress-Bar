const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err));
    await page.goto('http://localhost:3000/himon.framer.website/about-us.html', { waitUntil: 'networkidle0' });
    
    const exists = await page.evaluate(() => {
        return !!document.getElementById('knc-our-teams');
    });
    console.log("Teams section exists:", exists);
    await browser.close();
})();
