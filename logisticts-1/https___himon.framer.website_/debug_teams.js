const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/himon.framer.website/about-us.html', { waitUntil: 'networkidle0' });
    
    const result = await page.evaluate(() => {
        const teamHTML = window.teamHTML;
        const founderSection = document.querySelector('section[data-framer-name="Section: Meet The Founder"], .framer-17lku50');
        const main = document.querySelector('main') || document.querySelector('[class*="framer"]') || document.body;
        
        return {
            hasTeamHTML: !!teamHTML,
            founderSectionExists: !!founderSection,
            mainTagName: main ? main.tagName : null,
            mainClassName: main ? main.className : null,
            teamInjectedId: document.getElementById('knc-our-teams') ? true : false
        };
    });
    console.log("Evaluation Result:", result);
    await browser.close();
})();
