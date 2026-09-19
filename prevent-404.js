// Prevent 404 navigation to unimplemented pages and sanitize dead links
(function() {
    function sanitizeLinks() {
        document.querySelectorAll('a').forEach(function(link) {
            var href = link.getAttribute('href');
            if (!href) return;
            if (href.includes('blog') || href.includes('investor') || href.includes('career')) {
                // If it's not a valid internal page
                link.setAttribute('href', '#');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sanitizeLinks);
    } else {
        sanitizeLinks();
    }
    window.addEventListener('load', sanitizeLinks);

    // Also observe DOM in case Framer rehydrates links
    try {
        var obs = new MutationObserver(function() {
            sanitizeLinks();
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch(e) {}

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;

        // External links, mailto, tel
        if (href.startsWith('http') && !href.includes(window.location.host)) return;
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

        // Hash links
        if (href === '#') {
            e.preventDefault();
            if (window.location.hash !== '#') {
                history.pushState(null, '', '#');
            }
            return;
        }
        if (href.startsWith('#')) return;

        // Allowed pages based on existing files in this project
        const allowed = [
            '/', './', 
            'index.html', './index.html', '/index.html', 'index',
            'about-us.html', './about-us.html', '/about-us.html', 'about-us', './about-us', '/about-us',
            'contact.html', './contact.html', '/contact.html', 'contact', './contact', '/contact',
            'services.html', './services.html', '/services.html', 'services', './services', '/services',
            'solutions.html', './solutions.html', '/solutions.html', 'solution', './solution', '/solution', 'solutions', './solutions', '/solutions',
            'services/freight-trucking', 'services/container-transport', 'services/last-mile-delivery',
            'services/warehouse-and-storage', 'services/express-distribution',
            'legal/privacy-policy', 'legal/term-and-service'
        ];

        try {
            const url = new URL(link.href, window.location.origin);
            const pathStr = url.pathname;
            const pathSegments = pathStr.split('/').filter(Boolean);
            const lastSegment = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '/';
            
            const isRoot = pathStr === '/' || pathStr === '';
            
            let isAllowed = isRoot;
            if (!isAllowed) {
                isAllowed = allowed.some(function(a) {
                    return pathStr.endsWith(a) || lastSegment === a;
                });
            }
            
            if (!isAllowed) {
                e.preventDefault();
                console.log('Prevented 404 navigation, making hash #:', link.href);
                link.setAttribute('href', '#');
                if (window.location.hash !== '#') {
                    history.pushState(null, '', '#');
                }
            }
        } catch(err) {
            if (!allowed.includes(href)) {
                e.preventDefault();
                link.setAttribute('href', '#');
            }
        }
    }, true);
})();
