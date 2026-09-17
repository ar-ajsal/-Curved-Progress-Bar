const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
        const footer = document.querySelector('footer') || document.querySelector('[data-framer-name*="Footer"]');
        if (footer) {
            const imgs = Array.from(footer.querySelectorAll('img'));
            imgs.forEach(img => {
                // If it's the knc logo in the footer, hide it
                if (img.src.includes('knclogo.png')) {
                    img.style.setProperty('display', 'none', 'important');
                    img.classList.add('hide-me-footer-logo');
                }
            });
        }
    });
    
    // Scroll to the bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'footer_fully_cleaned.png' });
    await browser.close();
})();
