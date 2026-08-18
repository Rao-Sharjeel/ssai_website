# Global Components

This folder contains reusable components that can be used across the website to maintain consistency and reduce code duplication.

## Navbar Component

The navbar component provides a consistent navigation experience across all pages.

### Files:
- `navbar.html` - HTML structure for the navbar
- `navbar.css` - Styles for the navbar component
- `navbar.js` - JavaScript functionality for interactions

### Usage:

1. **Include the CSS** in your HTML head:
```html
<link href="components/navbar.css" rel="stylesheet">
```

2. **Include the JavaScript** before closing body tag:
```html
<script src="components/navbar.js"></script>
```

3. **Add the navbar container** in your HTML:
```html
<div id="navbar-container"></div>
```

4. **Load the navbar** with JavaScript:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            
            // Set active nav item for current page
            if (window.NavbarComponent) {
                window.NavbarComponent.updateActiveNavItem('current-page-name');
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
});
```

### Features:
- Responsive design (mobile and desktop)
- Mega dropdown menu for services
- Smooth animations and hover effects
- Accessibility support (keyboard navigation, screen readers)
- Scroll effects (navbar becomes more opaque when scrolling)
- Mobile hamburger menu

### Customization:
- Update links in `navbar.html` to match your site structure
- Modify colors and styles in `navbar.css`
- Extend functionality in `navbar.js`

### Dependencies:
- Bootstrap 5
- Font Awesome icons
- Bootstrap Icons

### Browser Support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

