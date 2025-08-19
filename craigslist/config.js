// Craigslist Hub Configuration
const CONFIG = {
  // Contact Information
  phone: "+1-212-555-0123", // Placeholder - update with actual US number
  email: "craigslist@sigmasoftai.com",
  
  // Phone-First Settings
  phone_first: {
    enabled: true,
    show_call_hours: true,
    call_hours: "Mon–Fri 9am–6pm EST",
    timezone: "EST",
    show_sms_option: true,
    sticky_call_button: true,
    phone_support_hours: "Mon–Fri 9am–6pm EST",
    supports_sms: true,
    city_labels: {
      "new-york": "NYC Support",
      "los-angeles": "LA Support", 
      "chicago": "Chicago Support",
      "houston": "Houston Support",
      "phoenix": "Phoenix Support",
      "philadelphia": "Philly Support"
    }
  },
  
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
  
  // Business Information
  company_name: "Sigma Soft AI",
  company_description: "Custom software development and AI solutions",
  service_description: "Fast 5-page websites for small businesses — Launch in 7 days",
  
  // Pricing Plans
  pricing: {
    standard: {
      name: "Standard",
      pages: 5,
      price: 2250,
      timeline: "7 business days",
      deposit: "30%",
      warranty: "14-day warranty",
      features: [
        "5 custom pages",
        "Mobile responsive design", 
        "Contact form",
        "Basic SEO optimization",
        "Hosting setup",
        "SSL certificate"
      ]
    },
    growth: {
      name: "Growth",
      pages: 8,
      price: 3800,
      timeline: "10 business days",
      deposit: "30%",
      warranty: "30-day warranty",
      features: [
        "Everything in Standard",
        "Booking integration",
        "GMB optimization",
        "30 days support",
        "Social media integration",
        "Analytics setup"
      ]
    },
    premium: {
      name: "Premium",
      pages: 12,
      price: 6500,
      timeline: "14 business days", 
      deposit: "30%",
      warranty: "60-day warranty",
      features: [
        "Everything in Growth",
        "Ads setup (FB/Google)",
        "AI chatbot integration",
        "Advanced analytics",
        "60 days support",
        "Content creation"
      ]
    }
  },
  
  // Case Study
  case_study: {
    client: "Auto Shop",
    location: "Chicago",
    result: "Increased online bookings by 40% in first month",
    timeline: "Completed in 6 days"
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} 