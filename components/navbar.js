/**
 * Global Navbar Component JavaScript
 * Handles navbar interactions, dropdowns, and mobile menu functionality
 */

class NavbarComponent {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupDropdowns();
        this.setupMobileMenu();
        this.setupAccessibility();
    }

    /**
     * Setup scroll effects for navbar
     */
    setupScrollEffects() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class when scrolling down
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    /**
     * Setup dropdown functionality
     */
    setupDropdowns() {
        const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle');
        const megaDropdown = document.querySelector('.mega-dropdown');
        const dropdown = document.querySelector('.nav-item.dropdown');
        
        if (!dropdownToggle || !megaDropdown || !dropdown) return;

        let hideTimeout;
        
        // Desktop hover functionality
        if (window.innerWidth > 991) {
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                megaDropdown.classList.add('show');
                dropdown.classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    megaDropdown.classList.remove('show');
                    dropdown.classList.remove('show');
                }, 150);
            });
            
            megaDropdown.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
            });
            
            megaDropdown.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    megaDropdown.classList.remove('show');
                    dropdown.classList.remove('show');
                }, 150);
            });
        }

        // Mobile click functionality
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                megaDropdown.classList.toggle('show');
                dropdown.classList.toggle('show');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && window.innerWidth <= 991) {
                megaDropdown.classList.remove('show');
                dropdown.classList.remove('show');
            }
        });
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (!navbarToggler || !navbarCollapse) return;

        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && 
                !navbarCollapse.contains(e.target) && 
                window.innerWidth <= 991) {
                navbarCollapse.classList.remove('show');
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Keyboard navigation for dropdowns
        const dropdownToggle = document.querySelector('.nav-link.dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const megaDropdown = document.querySelector('.mega-dropdown');
                    const dropdown = document.querySelector('.nav-item.dropdown');
                    
                    if (megaDropdown && dropdown) {
                        const isOpen = megaDropdown.classList.contains('show');
                        megaDropdown.classList.toggle('show');
                        dropdown.classList.toggle('show');
                        
                        // Focus first dropdown item when opening
                        if (!isOpen) {
                            const firstLink = megaDropdown.querySelector('.dropdown-item');
                            if (firstLink) {
                                firstLink.focus();
                            }
                        }
                    }
                }
            });
        }

        // Escape key to close dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const megaDropdown = document.querySelector('.mega-dropdown');
                const dropdown = document.querySelector('.nav-item.dropdown');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                
                if (megaDropdown && dropdown) {
                    megaDropdown.classList.remove('show');
                    dropdown.classList.remove('show');
                }
                
                if (navbarCollapse) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });

        // Skip to main content link
        const skipLink = document.querySelector('.skip-to-main');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('#main-content');
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /**
     * Update navbar for different page contexts
     */
    updateForPage(pageType = 'default') {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Remove existing page classes
        navbar.classList.remove('home-navbar', 'service-navbar', 'about-navbar', 'contact-navbar');
        
        // Add page-specific class
        navbar.classList.add(`${pageType}-navbar`);
    }

    /**
     * Update active navigation item
     */
    updateActiveNavItem(currentPage) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage || 
                link.textContent.toLowerCase().includes(currentPage.toLowerCase())) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const megaDropdown = document.querySelector('.mega-dropdown');
        const dropdown = document.querySelector('.nav-item.dropdown');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        // Close mobile menu when resizing to desktop
        if (window.innerWidth > 991) {
            if (navbarCollapse) {
                navbarCollapse.classList.remove('show');
            }
        }
        
        // Reset dropdown state on resize
        if (megaDropdown && dropdown) {
            megaDropdown.classList.remove('show');
            dropdown.classList.remove('show');
        }
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navbar = new NavbarComponent();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        navbar.handleResize();
    });
    
    // Make navbar globally accessible
    window.NavbarComponent = navbar;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarComponent;
}

