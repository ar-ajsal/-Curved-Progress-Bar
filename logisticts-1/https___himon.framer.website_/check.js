const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/index.html', { waitUntil: 'networkidle0' });
    
    const textData = await page.evaluate(() => {
        let results = [];
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
        let n;
        while(n = walk.nextNode()) {
            if (n.textContent && n.textContent.includes('Himon')) {
                results.push({ tag: n.tagName, text: n.textContent.trim().substring(0, 100) });
            }
        }
        return results;
    });
    console.log(JSON.stringify(textData, null, 2));
    await browser.close();
})();
