# Craigslist Hub - Sigma Soft AI

This directory contains the Craigslist landing page hub and city-specific service pages for Sigma Soft AI.

## 🚀 NEW: City-First Structure Implementation

**Status**: Hub archived, redirecting to NYC as primary city page

### Recent Changes (Feature Branch: `feature/city-first-nyc`)
- ✅ Hub page moved to `/craigslist/legacy/hub-index.html`
- ✅ Redirect implemented at `/craigslist/index.html` → `/craigslist/new-york/`
- ✅ New NYC landing page created with premium design
- ✅ NYC-specific CSS with mobile-first approach
- ✅ SEO-optimized content with structured data
- ✅ Phone-first UX with callback forms
- ✅ Case studies integration with metrics
- ✅ Local business schema and FAQ markup

### NYC Implementation Details
- **Design**: Clean, minimal layout with premium accents
- **Mobile-First**: Optimized for NYC's mobile-heavy users
- **SEO**: Local keywords, neighborhood mentions, GMB-ready markup
- **Performance**: Target ≤4s Time to Interactive on 3G
- **Accessibility**: WCAG AA compliant with skip links

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

## NYC Assets & Images

### Required Image Replacements
- **new-york-hero.jpg**: Manhattan skyline or NYC business district
- **nyc-street-1.jpg**: NYC storefront or business interior  
- **nyc-business-1.jpg**: NYC professional office or clinic

### Unsplash Search Queries for NYC Images
```
manhattan storefront
soho cafe interior
brooklyn small business
new york office building
manhattan medical clinic
nyc restaurant interior
queens business district
bronx local business
staten island commercial
new york professional services
manhattan tech startup
brooklyn creative agency
```

### Video Testimonials Needed
- **smile-enhancer-testimonial.mp4** - Dental clinic testimonial
- **rcm-automation-testimonial.mp4** - Medical billing testimonial
- **ai-coach-testimonial.mp4** - Business coaching testimonial

## URL Structure

### New City-First Structure
- **NYC Home**: `/craigslist/new-york/` (main landing page)
- **NYC Web Dev**: `/craigslist/new-york/web-development/` (service page)
- **Hub Redirect**: `/craigslist/` → `/craigslist/new-york/` (automatic redirect)

### Legacy Structure (Archived)
- Hub page moved to `/craigslist/legacy/hub-index.html`
- Old city pages remain in `/craigslist/legacy/` for reference

## NYC Page Features

### SEO Content
- **Title**: "New York Web Development | SigmasoftAI — Fast 7-day Websites & Local SEO"
- **Meta**: Optimized for NYC local search keywords
- **Schema**: LocalBusiness + FAQ structured data
- **Neighborhoods**: Manhattan, Brooklyn, Queens, Bronx, Staten Island mentions

### Phone-First UX
- **Header Phone**: "Call SigmasoftAI — Head Office (New York): +1-212-555-0123"
- **Support Hours**: "Mon–Fri 9am–6pm EST"
- **Sticky CTA**: Fixed call button on all pages
- **Callback Form**: "Request a callback (within 30–60 minutes)"

### Case Studies
- **Smile Enhancer**: +45% calls in 30 days
- **RCM Automation**: 80% reduction in processing time
- **AI Coach**: 300% increase in engagement

### Trust Signals
- **Reviews**: 4 Google review placeholders with NYC business names
- **Metrics**: Specific numbers and outcomes
- **Local Focus**: NYC-specific content and neighborhood targeting

## File Structure

```
craigslist/
├── index.html                    # Redirect to NYC
├── config.js                     # Configuration file
├── craigslist.css               # Legacy styles
├── README.md                    # This file
├── legacy/
│   ├── hub-index.html           # Archived hub page
│   └── [old city pages]         # Archived city pages
├── new-york/
│   ├── index.html               # NYC main landing page
│   ├── new-york.css             # NYC-specific styles
│   ├── web-development/
│   │   └── index.html           # NYC web development service
│   └── assets/
│       └── README.md            # NYC assets guide
├── case-studies/                # Case study pages
├── assets/local-images/         # Local business images
└── templates/                   # Page templates
```

## NYC Design Principles

### Aesthetic
- Clean, minimal layout with generous white space
- Refined typography with MuseoModerno + Nunito fonts
- Subtle luxury accents (thin metallic borders, dark-mode overlays)
- NYC brand colors with warmer CTA accent (`--nyc-cta-bg: #E67E22`)

### Mobile & Performance
- Mobile-first CSS with responsive breakpoints
- Target ≤4s Time to Interactive on 3G
- Optimized images with `srcset` and lazy loading
- Inline critical CSS for hero to avoid FOUC

### Interaction
- Subtle micro-animations with `prefers-reduced-motion` support
- IntersectionObserver for entrance effects
- Smooth transitions and hover states

## How to Update CONFIG Values

### Phone/Calendar/Intake Updates
1. Edit `craigslist/config.js`
2. Update the relevant values:
   ```javascript
   phone: "+1-212-555-0123", // Replace with actual number
   calendar_link: "https://calendly.com/your-link", // Replace with actual Calendly
   intake_form: "https://forms.gle/your-form", // Replace with actual Google Form
   ```
3. All pages automatically use these values

### Adding New Cities
1. Create new city directory: `/craigslist/[city-name]/`
2. Copy NYC structure and adapt content
3. Update navigation and sitemap
4. Add city-specific assets and images

## SEO Content Blocks (Copy/Paste)

### NYC Meta Tags
```html
<title>New York Web Development | SigmasoftAI — Fast 7-day Websites & Local SEO</title>
<meta name="description" content="SigmasoftAI builds high-converting websites & local SEO for New York small businesses. 7-day launches, AI chatbots, & conversion-first design. Call +1-212-555-0123.">
```

### NYC Hero H1
```html
<h1>New York Web Development & Local Growth — Fast, Reliable, Results-driven</h1>
```

### NYC Intro Paragraph
```html
<p>SigmasoftAI is a New York–headquartered web development and digital marketing team helping NYC small businesses grow. We design fast, mobile-first websites optimized for local search (New York web development, NYC web design, local SEO New York). From 7-day 5-page launches to AI chatbots and RCM automation, we deliver measurable results for clinics, retailers, and professional services.</p>
```

### NYC Neighborhoods (Local SEO)
```html
<p>Serving businesses throughout Manhattan, Brooklyn, Queens, the Bronx, and Staten Island — we localize content for neighborhood keywords (SoHo, Williamsburg, Upper East Side, Park Slope).</p>
```

## Performance & QA

### Mobile Testing
- Test at 375px/768px/1024px breakpoints
- Verify no overflow, readable text, CTAs visible
- Check sticky call button functionality

### Accessibility
- Skip-to-main link at top
- All images have alt text
- Respects `prefers-reduced-motion`
- WCAG AA color contrast compliance

### SEO Checklist
- ✅ Canonical URLs set
- ✅ Open Graph and Twitter Card tags
- ✅ JSON-LD LocalBusiness schema
- ✅ FAQ schema markup
- ✅ Local keywords naturally integrated
- ✅ Neighborhood mentions for local SEO

## Maintenance

- Update `config.js` for any contact information changes
- Monitor form submissions and analytics
- Regularly update case studies and testimonials
- Keep pricing and service details current
- Replace placeholder images with real NYC business photos
- Obtain client consent for real testimonials

## Support

For technical issues or questions about the Craigslist hub, contact the development team.

---

**Last Updated**: January 2025  
**Branch**: `feature/city-first-nyc`  
**Status**: NYC implementation complete, ready for image replacements and real testimonials 