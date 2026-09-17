const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    const footerImgs = await page.evaluate(() => {
        const footer = document.querySelector('footer') || document.querySelector('[data-framer-name*="Footer"]');
        if (!footer) return "No footer found";
        return Array.from(footer.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            className: img.className
        }));
    });
    console.log(JSON.stringify(footerImgs, null, 2));
    await browser.close();
})();
