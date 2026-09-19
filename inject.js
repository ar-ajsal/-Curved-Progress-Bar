const fs = require('fs');
const path = require('path');

// 1. Copy files
fs.copyFileSync('files/knc-loader.css', 'knc-loader.css');
fs.copyFileSync('files/knc-loader.js', 'knc-loader.js');

// 2. Fix paths in CSS
let css = fs.readFileSync('knc-loader.css', 'utf8');
css = css.replace(/url\([^)]*knc-logo\.png[^)]*\)/g, 'url(\'/knc-logo.png\')');
fs.writeFileSync('knc-loader.css', css);

// 3. Get loader HTML snippet and fix image path
let loaderHtml = fs.readFileSync('files/knc-loader.html', 'utf8');
loaderHtml = loaderHtml.replace(/src="[^"]*knc-logo\.png"/g, 'src="/knc-logo.png"');

const headInject = `
    <link rel="preload" as="image" href="/knc-logo.png" fetchpriority="high">
    <link rel="stylesheet" href="/knc-loader.css">
`;
const scriptInject = `<script src="/knc-loader.js" defer></script>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'preview.html');
for (const file of files) {
    let html = fs.readFileSync(file, 'utf8');
    
    if (html.includes('knc-loader.css')) {
        console.log(file + ' already has loader.');
        continue;
    }
    
    html = html.replace(/<head>/i, '<head>\n' + headInject);
    html = html.replace(/<body[^>]*>/i, match => match + '\n' + loaderHtml);
    html = html.replace(/<\/body>/i, scriptInject + '\n</body>');
    
    fs.writeFileSync(file, html);
    console.log('Injected into ' + file);
}
