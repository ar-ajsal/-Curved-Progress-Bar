const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const htmlFiles = ['index.html', 'about-us.html', 'contact.html', 'services.html', 'solutions.html'];

for (const file of htmlFiles) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove head snippets
    content = content.replace(/\s*<link rel="preload" as="image" href="\.\/knc-logo\.png" fetchpriority="high">\s*<link rel="stylesheet" href="\.\/knc-loader\.css">/gi, '');
    
    // Remove the loader div
    content = content.replace(/<div id="knc-loader" class="knc-loader" role="status" aria-live="polite">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');
    
    // Remove the script
    content = content.replace(/\s*<script src="\.\/knc-loader\.js" defer><\/script>/gi, '');

    fs.writeFileSync(filePath, content);
    console.log(`Successfully removed from ${file}`);
}
