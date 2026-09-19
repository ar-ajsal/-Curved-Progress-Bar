const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const filesDir = path.join(rootDir, 'files');

// Copy CSS and JS to root
let cssContent = fs.readFileSync(path.join(filesDir, 'knc-loader.css'), 'utf8');
cssContent = cssContent.replace(/url\("\.\/assets\/knc-logo\.png"\)/g, 'url("./knc-logo.png")');
fs.writeFileSync(path.join(rootDir, 'knc-loader.css'), cssContent);
fs.copyFileSync(path.join(filesDir, 'knc-loader.js'), path.join(rootDir, 'knc-loader.js'));

// Read HTML snippet
let loaderHtml = fs.readFileSync(path.join(filesDir, 'knc-loader.html'), 'utf8');
// remove the big comment block at the top
loaderHtml = loaderHtml.replace(/<!--[\s\S]*?-->\s*/, '');
// fix image path
loaderHtml = loaderHtml.replace(/src="\.\/assets\/knc-logo\.png"/, 'src="./knc-logo.png"');

const headSnippet = `
    <link rel="preload" as="image" href="./knc-logo.png" fetchpriority="high">
    <link rel="stylesheet" href="./knc-loader.css">
`;

const scriptSnippet = `
    <script src="./knc-loader.js" defer></script>
`;

const htmlFiles = ['index.html', 'about-us.html', 'contact.html', 'services.html', 'solutions.html'];

for (const file of htmlFiles) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already injected
    if (content.includes('knc-loader.css')) {
        console.log(`Skipping ${file}, already injected.`);
        continue;
    }

    // Inject into <head>
    content = content.replace(/<\/head>/i, `${headSnippet}</head>`);
    
    // Inject loader just inside <body>
    content = content.replace(/<body[^>]*>/i, `$&${loaderHtml}`);
    
    // Inject script just before </body>
    content = content.replace(/<\/body>/i, `${scriptSnippet}</body>`);

    fs.writeFileSync(filePath, content);
    console.log(`Successfully injected into ${file}`);
}
