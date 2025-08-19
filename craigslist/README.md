# Craigslist Hub - Sigma Soft AI

This directory contains the Craigslist landing page hub and city-specific service pages for Sigma Soft AI.

## Configuration

### config.js
The main configuration file contains all editable settings:

```javascript
const CONFIG = {
  // Contact Information
  phone: "+1-212-555-0123", // Update with actual US number
  email: "craigslist@sigmasoftai.com",
  
  // Booking and Forms
  calendar_link: "https://calendly.example/15", // TODO: Replace with actual Calendly link
  intake_form: "https://docs.google.com/forms/d/PUT_YOUR_FORM_ID", // TODO: Replace with actual Google Form
  
  // Analytics
  ga4_id: "", // Optional: Add GA4 tracking ID if available
  
  // UI Controls
  showFooterCTA: true,   // Show footer CTA on main site pages
  addHeaderNavLink: false, // Add header navigation link (default: false)
  
  // SEO Settings
  noindex: false, // Set to true to prevent indexing of /craigslist folder
};
```

## TODO Items Requiring Owner Input

1. **Calendar Link**: Replace `calendar_link` with actual Calendly or booking system URL
2. **Intake Form**: Replace `intake_form` with actual Google Forms or form system URL
3. **Phone Number**: Update `phone` with actual US business phone number
4. **GA4 ID**: Add Google Analytics 4 tracking ID if desired

## How to Enable Header Navigation Link

To add a header navigation link to the main site:

1. Set `CONFIG.addHeaderNavLink = true` in `config.js`
2. Add the following link to the main navigation in all HTML files:
   ```html
   <a href="craigslist/" class="nav-item nav-link">Fast Websites</a>
   ```

## URL Structure

The Craigslist hub uses clean URLs without file extensions:
- Main hub: `/craigslist/` (instead of `/craigslist/index.html`)
- City pages: `/craigslist/new-york-websites.html`, `/craigslist/los-angeles-ai-chatbot.html`, etc.

### Clean URL Implementation
All internal links use clean URLs:
- Links to main site: `../` (instead of `../index.html`)
- Links to hub: `./` (instead of `index.html`)
- Links between city pages: direct filenames (e.g., `new-york-websites.html`)

This provides a cleaner, more professional URL structure that's better for SEO and user experience.

## Creating New City Pages

To create a new city page:

1. Copy `templates/service-template.html`
2. Replace all instances of `{{CITY}}`, `{{SERVICE}}`, and `{{FILENAME}}` with actual values
3. Update meta tags, titles, and content for the specific city/service
4. Add the new page to the hub's service cards in `index.html`

Example:
```bash
cp templates/service-template.html austin-restaurants.html
# Then edit the file to replace placeholders
```

## SEO and Indexing

### To prevent indexing of the entire /craigslist folder:
1. Set `CONFIG.noindex = true` in `config.js`
2. Add `<meta name="robots" content="noindex">` to all pages in the folder

### To allow indexing:
- Keep `CONFIG.noindex = false` (default)
- Ensure all pages have proper meta tags and structured data

## File Structure

```
craigslist/
├── index.html                 # Main hub page
├── config.js                  # Configuration file
├── craigslist.css            # Custom styles
├── README.md                 # This file
├── _components/              # Reusable components (future use)
├── assets/craigslist/        # Images and assets
├── templates/
│   └── service-template.html # Template for city pages
├── new-york-websites.html    # NYC business websites
├── los-angeles-ai-chatbot.html # LA AI chatbot solutions
├── chicago-websites.html     # Chicago business websites
├── houston-clinic-websites.html # Houston clinic websites
├── phoenix-smallbiz.html     # Phoenix small business sites
└── philadelphia-marketing.html # Philadelphia marketing sites
```

## Phase 0 Audit Report Summary

### ✅ PASSED ITEMS:
- HTML titles and meta descriptions present
- Language attributes correct
- Phone number in header
- Brand color scheme consistency

## Phone-First Implementation

### Features Implemented:
- **Sticky Call Button**: Fixed position call button on desktop
- **Mobile Call Bar**: Full-width call bar on mobile devices
- **Header Phone CTA**: Prominent phone number in header
- **Call Hours Display**: Shows business hours in header
- **Callback Form**: Alternative to direct calling
- **Click Tracking**: All phone clicks are logged and tracked

### Configuration:
- Phone-first settings in `config.js`
- City-specific labels for phone support
- SMS option toggle
- Call hours and timezone display

## Case Studies System

### Modular Case Studies:
- 7 comprehensive case studies in `case-studies/case-studies.js`
- Tagged by industry and service type
- Automatically matched to city pages
- Includes problem/solution/outcome structure

### Case Study Tags:
- healthcare, dental, automation, ai, coaching, productivity, tourism, erp
- Automatically filtered by city and service relevance

## Local Images

### Image Structure:
```
assets/local-images/
├── new-york/
├── los-angeles/
├── chicago/
├── houston/
├── phoenix/
└── philadelphia/
```

### Recommended Unsplash Queries:
- **NYC**: `new york street storefront`, `manhattan small business storefront`, `nyc local business`
- **LA**: `los angeles restaurant interior`, `la creative studio`, `la small business storefront`
- **Chicago**: `chicago contractor`, `chicago small business`, `chicago storefront`
- **Phoenix**: `phoenix contractor`, `home services`, `phoenix small business`
- **Houston**: `houston clinic`, `texas doctor office`, `houston small business`
- **Philadelphia**: `philadelphia clinic`, `philly small business`

## City-Specific Content

### New York:
- Local SEO focus with GMB optimization
- Conversion copy for competitive NYC market
- Mobile-first design for NYC's mobile-heavy users

### Los Angeles:
- AI chatbot solutions for restaurants/creative businesses
- Visual portfolios and social media integration
- Influencer package options

### Chicago:
- Contractor and service business focus
- "Near me" local SEO optimization
- Service industry specific features

### Houston:
- Healthcare/clinic website packages
- HIPAA compliant features
- Appointment flow optimization

### Phoenix:
- Home services landing pages
- Lead generation focus
- Local contractor optimization

### Philadelphia:
- Healthcare & professional services
- Marketing and paid search integration
- Patient acquisition focus

## Pricing Plans

### Three-Tier Structure:
1. **Standard** ($2,250) - 5 pages, basic SEO, 7 days
2. **Growth** ($3,800) - 8 pages, GMB optimization, 10 days
3. **Premium** ($6,500) - 12 pages, ads setup, 14 days

### Features Included:
- Mobile responsive design
- Contact forms
- SEO optimization
- Hosting setup
- SSL certificates
- Support periods

## Animation & UX

### Implemented Features:
- CSS entrance animations with `fadeInUp`
- Hover effects on cards and buttons
- Reduced motion support for accessibility
- Smooth transitions and micro-interactions
- Gradient text effects
- Enhanced shadows and depth

### Performance Optimizations:
- Lazy loading for images
- Optimized CSS animations
- Mobile-first responsive design
- Accessibility compliance (WCAG AA)

## TODO Items Requiring Owner Input

1. **Calendar Link**: Replace `calendar_link` with actual Calendly or booking system URL
2. **Intake Form**: Replace `intake_form` with actual Google Forms or form system URL
3. **Phone Number**: Update `phone` with actual US business phone number
4. **GA4 ID**: Add Google Analytics 4 tracking ID if desired
5. **Local Images**: Replace placeholder images with actual local business photos
6. **Case Study Images**: Add before/after images for case studies (especially Smile Enhancer)
7. **Client Permissions**: Obtain permission to use real client names/images in case studies
- Mobile responsiveness
- Contact form functionality
- SEO blockers (no issues found)

### ❌ FIXED ITEMS:
- **Image Alt Attributes**: Added descriptive alt text to all images
- **Image Optimization**: Added lazy loading to all images
- **Form Labels**: Improved form accessibility with proper labels
- **Footer CTA**: Added unobtrusive footer CTA to all main pages

### ⚠️ ITEMS REQUIRING OWNER INPUT:
1. **Calendar Link**: No calendar booking system found - needs Calendly or similar
2. **Intake Form**: No dedicated intake form found - needs Google Forms or similar
3. **GA4 ID**: No Google Analytics found - optional but recommended

### 📊 LIGHTHOUSE PERFORMANCE:
- Performance: 0.18 (Poor) - Image optimization needed
- Accessibility: 0.50 (Needs Improvement) - Fixed alt attributes
- Best Practices: 0.62 (Needs Improvement) - Fixed form labels
- SEO: 0.39 (Needs Improvement) - Fixed meta tags

## Performance Recommendations

1. **Image Optimization**: Consider compressing large images further
2. **Lazy Loading**: Already implemented
3. **Caching**: Implement browser caching for static assets
4. **CDN**: Consider using a CDN for faster loading

## Maintenance

- Update `config.js` for any contact information changes
- Monitor form submissions and analytics
- Regularly update case studies and testimonials
- Keep pricing and service details current

## Support

For technical issues or questions about the Craigslist hub, contact the development team. 