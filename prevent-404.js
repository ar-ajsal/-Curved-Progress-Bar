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
    
    function injectAggressiveCSS() {
        if (!document.getElementById('knc-aggressive-css')) {
            var style = document.createElement('style');
            style.id = 'knc-aggressive-css';
            style.innerHTML = `
                .framer-11d9d7g-container, 
                div[data-framer-name="Hero"],
                .framer-11d9d7g { 
                    display: none !important; 
                    height: 0 !important; 
                    min-height: 0 !important; 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    opacity: 0 !important;
                    position: absolute !important;
                    top: -9999px !important;
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectAggressiveCSS();
            removeNavbarItems();
        });
    } else {
        injectAggressiveCSS();
        removeNavbarItems();
    }
    window.addEventListener('load', function() {
        injectAggressiveCSS();
        removeNavbarItems();
    });

    // MutationObserver to ensure Framer rehydration never restores them
    try {
        var obs = new MutationObserver(function() {
            injectAggressiveCSS();
            removeNavbarItems();
            // Fix for large white space block on mobile and desktop
            // Aggressively target known Hero components by data-framer-name or known classes
            document.querySelectorAll('div[data-framer-name="Hero"], .framer-11d9d7g-container, .framer-11d9d7g, div[data-framer-name="Phone Hero"], div[data-framer-name="Mobile Hero"]').forEach(function(div) {
                // If we are on contact page, we want NO hero!
                if (window.location.href.includes('contact')) {
                    div.style.setProperty('display', 'none', 'important');
                    div.style.setProperty('height', '0', 'important');
                    div.style.setProperty('margin', '0', 'important');
                    div.style.setProperty('padding', '0', 'important');
                    
                    // Forcefully remove it from the DOM as well to be safe
                    // But maybe removing causes React to crash? Let's hide it instead.
                    div.innerHTML = ''; 
                }
            });
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
