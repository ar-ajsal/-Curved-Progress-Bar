const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Change website font theme to Arial
    const fontStyle = `<style> * { font-family: Arial, Helvetica, sans-serif !important; }
        div[data-framer-name="Hero"] {
            display: none !important;
        }
    </style>`;
    if (!content.includes('font-family: Arial, Helvetica, sans-serif !important')) {
        if (content.includes('</head>')) {
            content = content.replace('</head>', fontStyle + '</head>');
        } else if (content.includes('<!-- Start of headEnd -->')) {
            content = content.replace('<!-- Start of headEnd -->', fontStyle + '<!-- Start of headEnd -->');
        } else {
            content = content.replace('<style id="knc-framer-overrides">', fontStyle + '\n<style id="knc-framer-overrides">');
        }
    }

    // 2. Hide Framer's team section if any
    content = content.replace(/section\[data-framer-name="Section: Our Teams"\]\s*\{\s*display:\s*none\s*!important;\s*\}/g, 'section[data-framer-name="Section: Our Teams"] { display: none !important; }');
    
    // 3. Hide knc-our-teams section
    content = content.replace(/#knc-our-teams\s*\{\s*display:\s*block\s*!important;\s*visibility:\s*visible\s*!important;\s*opacity:\s*1\s*!important;\s*\}/g, '#knc-our-teams { display: none !important; }');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
