
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;

    // Allow external links, mailto, tel, and hashes
    if (href.startsWith('http') && !href.includes(window.location.host)) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith('#')) return;

    // Allowed pages based on existing files in this project
    const allowed = [
        '/', './', 
        'index.html', './index.html', '/index.html', 'index',
        'about-us.html', './about-us.html', '/about-us.html', 'about-us', './about-us', '/about-us',
        'contact.html', './contact.html', '/contact.html', 'contact', './contact', '/contact',
        'services.html', './services.html', '/services.html', 'services', './services', '/services',
        'solutions.html', './solutions.html', '/solutions.html', 'solution', './solution', '/solution', 'solutions', './solutions', '/solutions'
    ];

    try {
        const url = new URL(link.href, window.location.origin);
        const pathStr = url.pathname;
        const pathSegments = pathStr.split('/').filter(Boolean);
        const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '/';
        
        // Also allow exactly root
        const isRoot = pathStr === '/' || pathStr === '';
        
        let isAllowed = isRoot;
        if (!isAllowed) {
            isAllowed = allowed.includes(lastSegment) || allowed.includes('/' + lastSegment) || allowed.includes('./' + lastSegment);
        }
        
        if (!isAllowed) {
            e.preventDefault();
            console.log('Prevented 404 navigation to:', link.href);
            // Optionally, scroll to top to simulate a page load to the same page if they expected a change
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch(err) {
        // Fallback for weird URLs
        if (!allowed.includes(href)) {
            e.preventDefault();
            console.log('Prevented 404 navigation to (fallback):', href);
        }
    }
});
