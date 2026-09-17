const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    const footerData = await page.evaluate(() => {
        const footer = document.querySelector('footer') || document.querySelector('[data-framer-name*="Footer"]');
        if (!footer) return "No footer found";
        
        // Find the huge KNC text
        const hugeTextNodes = Array.from(footer.querySelectorAll('p, h1, h2, span, div')).filter(n => n.textContent.trim() === 'KNC' && n.clientHeight > 100);
        
        return {
            footerHTML: footer.innerHTML.substring(0, 500) + '...',
            hugeTextFound: hugeTextNodes.length > 0,
            hugeTextClasses: hugeTextNodes.map(n => n.className),
            hugeTextTagNames: hugeTextNodes.map(n => n.tagName),
            hugeTextStyles: hugeTextNodes.map(n => window.getComputedStyle(n).cssText.substring(0, 200))
        };
    });
    console.log(JSON.stringify(footerData, null, 2));
    await browser.close();
})();
