// Prevent 404 navigation and completely remove removed navbar items
(function() {
    function removeNavbarItems() {
        // Hide and remove Investor, Blog, and Career navbar containers
        document.querySelectorAll('.framer-1h6fgh8-container, .framer-14f9sa7-container, .framer-1m9p5yz-container').forEach(function(el) {
            el.style.setProperty('display', 'none', 'important');
            el.remove();
        });

        // Also remove any nav/header links with text or href pointing to them
        document.querySelectorAll('header nav a, header a, nav a').forEach(function(a) {
            var text = (a.textContent || '').trim().toLowerCase();
            var href = (a.getAttribute('href') || '').toLowerCase();
            if (text === 'investor' || text === 'blog' || text === 'career' ||
                href === './investors' || href === './blog' || href === './career' ||
                href === '/investors' || href === '/blog' || href === '/career' ||
                href === '../investors' || href === '../blog' || href === '../career') {
                // Find the closest parent that is just a direct wrapper for this link, to avoid deleting the whole menu
                var container = a.parentElement;
                if (container && container.tagName !== 'NAV' && container.tagName !== 'HEADER' && container.classList.value.includes('-container')) {
                    container.style.setProperty('display', 'none', 'important');
                    container.remove();
                } else {
                    a.style.setProperty('display', 'none', 'important');
                    a.remove();
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeNavbarItems);
    } else {
        removeNavbarItems();
    }
    window.addEventListener('load', removeNavbarItems);

    // MutationObserver to ensure Framer rehydration never restores them
    try {
        var obs = new MutationObserver(function() {
            removeNavbarItems();
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch(e) {}

    // Click handler for 404 prevention
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
