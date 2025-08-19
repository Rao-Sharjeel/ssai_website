// Case Studies Data and Functions
const CASE_STUDIES = {
  "smile-enhancer": {
    id: "smile-enhancer",
    title: "Smile Enhancer — Dental Clinic",
    client_type: "Dentist — Local Clinic",
    location: "Dental Practice",
    short_quote: "Smile Enhancer transformed our patient consultations — now patients see expected results before treatment. Bookings increased and conversion confidence is up.",
    problem: "Clinic struggled with treatment uptake — patients hesitant to commit to cosmetic dental work because they couldn't visualize outcomes.",
    solution: "Built an image-processing 'Smile Enhancer' tool that takes pre-treatment photos and generates a high-quality, realistic preview of results. Integrated tool into the clinic's booking funnel and created landing page that educates patients and collects leads.",
    outcome: "Significant uplift in appointment conversions and higher patient confidence during consults. The tool created a strong marketing asset for social media and paid campaigns.",
    testimonial: "Patients who used the Smile Enhancer were far more likely to book — this changed our consult flow.",
    image: "assets/case-studies/smile-enhancer-before-after.jpg",
    tags: ["healthcare", "dental", "visualization", "conversion"]
  },
  
  "rcm-automation": {
    id: "rcm-automation", 
    title: "RCM Automation — Medical Billing Company",
    client_type: "RCM Company — Healthcare Billing",
    location: "Medical Billing",
    short_quote: "We went from hundreds of manual billing tasks to an automated RCM workflow. Our team size dropped while throughput improved dramatically.",
    problem: "Large billing operation was heavily manual — high labor costs, delayed claims processing.",
    solution: "Implemented automated RCM workflows (claim status checks, denial management triage, auto-appeal drafts, and task orchestration). Integrated with existing EHR/EMR and clearinghouse connectors.",
    outcome: "Company moved from manual-heavy operations to automated workflows and was able to serve the same workload with ~20 staff instead of ~700, improving margins and turnaround time.",
    testimonial: "Automation saved us headcount and vastly improved cashflow.",
    image: "assets/case-studies/rcm-automation-dashboard.jpg",
    tags: ["healthcare", "automation", "billing", "efficiency"]
  },
  
  "ai-coach-assistant": {
    id: "ai-coach-assistant",
    title: "AI Coach Assistant — Business Coach", 
    client_type: "Business Coach — Service Professional",
    location: "Business Coaching",
    short_quote: "An AI assistant that speaks our coach's voice — more client touchpoints without adding hours to the schedule.",
    problem: "Coach had limited time for client follow-ups and basic Q&A.",
    solution: "Built and trained a bespoke AI chatbot to emulate the coach's style and answer common client questions, triage requests, and hand off to human when needed. Deployed it on website + WhatsApp.",
    outcome: "Coach regained hours each week, scaled client support without hiring staff, and preserved brand voice.",
    testimonial: "The AI assistant is like having a junior coach on staff.",
    image: "assets/case-studies/ai-coach-chatbot.jpg",
    tags: ["ai", "coaching", "automation", "service"]
  },
  
  "workforce-productivity": {
    id: "workforce-productivity",
    title: "Workforce Supervision & Productivity System — Tech Company HR",
    client_type: "Tech Company — HR",
    location: "Technology",
    short_quote: "A reliable productivity and attendance reporting system — we can reward productive workers accurately.",
    problem: "Company needed insight into workforce productivity across remote and on-prem users.",
    solution: "Built an employee activity monitoring & reporting system: captures usage metrics, productivity signals, and generates per-worker time/output reports. Integrates with payroll/performance review workflows.",
    outcome: "Improved transparency, better reward decisions for high-performers, and more accurate capacity planning.",
    testimonial: "We finally have trustable metrics for performance.",
    image: "assets/case-studies/workforce-dashboard.jpg",
    tags: ["productivity", "hr", "analytics", "remote-work"]
  },
  
  "tourism-marketplace": {
    id: "tourism-marketplace",
    title: "Tourism & Artisan Marketplace — Algeria",
    client_type: "Tourism — Marketplace",
    location: "Tourism",
    short_quote: "We launched a marketplace for artisans and connected them with tourists — idea to app to market-ready.",
    problem: "Artisans needed a platform to sell to tourists and export unique crafts.",
    solution: "Built a mobile-first app and admin panel for listings, payments, and shipping integration. Launched a marketing campaign focused on tourism channels and marketplaces.",
    outcome: "Launched MVP to market with initial merchant onboardings and traction from tourist channels.",
    testimonial: "The app turned ideas into customers.",
    image: "assets/case-studies/tourism-marketplace.jpg",
    tags: ["marketplace", "tourism", "mobile", "ecommerce"]
  },
  
  "ai-training": {
    id: "ai-training",
    title: "AI Training for US Company — Internal Upskilling",
    client_type: "Tech Company — Training",
    location: "Technology",
    short_quote: "We trained staff in AI fundamentals and integrated beginner projects into their workflow.",
    problem: "Employees lacked applied AI skills; company needed to upskill teams to adopt ML features in products.",
    solution: "Delivered training workshops and hands-on projects to move engineers into AI development, with mentorship and code reviews.",
    outcome: "Multiple employees shipped AI-enabled features and a knowledge base for future hires.",
    testimonial: "Our engineers now ship AI features with confidence.",
    image: "assets/case-studies/ai-training-workshop.jpg",
    tags: ["ai", "training", "upskilling", "technology"]
  },
  
  "erp-enhancement": {
    id: "erp-enhancement",
    title: "ERP Enhancement — Small-Biz ERP with AI",
    client_type: "Small Business — ERP",
    location: "Manufacturing",
    short_quote: "AI features extended the life of our ERP and reduced manual errors during invoicing and procurement.",
    problem: "Legacy ERP lacked intelligence for forecasting and anomaly detection, making manual reconciliation costly.",
    solution: "Implemented AI modules (forecasting demand, anomaly detection in spends, and smart procurement suggestions) that plug into the ERP.",
    outcome: "Reduced errors and improved decision-making, allowing the ERP to remain the company's central system.",
    testimonial: "AI kept our ERP relevant and smarter.",
    image: "assets/case-studies/erp-ai-dashboard.jpg",
    tags: ["erp", "ai", "automation", "manufacturing"]
  }
};

// Function to get case studies by tags
function getCaseStudiesByTags(tags) {
  return Object.values(CASE_STUDIES).filter(study => 
    tags.some(tag => study.tags.includes(tag))
  );
}

// Function to get case studies by city/service
function getCaseStudiesByCity(city, service) {
  const cityTags = {
    "new-york": ["healthcare", "service", "conversion"],
    "los-angeles": ["tourism", "service", "ai"],
    "chicago": ["service", "automation", "efficiency"],
    "houston": ["healthcare", "automation", "billing"],
    "phoenix": ["service", "productivity", "automation"],
    "philadelphia": ["healthcare", "service", "marketing"]
  };
  
  const serviceTags = {
    "websites": ["conversion", "service", "marketing"],
    "ai-chatbot": ["ai", "automation", "service"],
    "clinic-websites": ["healthcare", "conversion", "service"],
    "smallbiz": ["service", "productivity", "automation"],
    "marketing": ["marketing", "conversion", "service"]
  };
  
  const tags = [...(cityTags[city] || []), ...(serviceTags[service] || [])];
  return getCaseStudiesByTags(tags).slice(0, 4); // Return up to 4 relevant case studies
}

// Function to render case study card
function renderCaseStudyCard(study) {
  return `
    <div class="case-study-card" data-study-id="${study.id}">
      <div class="case-study-header">
        <h4 class="case-study-title">${study.title}</h4>
        <span class="case-study-tag">${study.client_type}</span>
      </div>
      <div class="case-study-content">
        <blockquote class="case-study-quote">
          "${study.short_quote}"
        </blockquote>
        <div class="case-study-details">
          <div class="case-study-section">
            <h5>Problem</h5>
            <p>${study.problem}</p>
          </div>
          <div class="case-study-section">
            <h5>Solution</h5>
            <p>${study.solution}</p>
          </div>
          <div class="case-study-section">
            <h5>Outcome</h5>
            <p>${study.outcome}</p>
          </div>
        </div>
        <div class="case-study-testimonial">
          <p><strong>${study.testimonial}</strong></p>
        </div>
      </div>
    </div>
  `;
}

// Function to render case study carousel item
function renderCaseStudyCarouselItem(study, index) {
  return `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="case-study-carousel-card">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="case-study-content">
              <div class="case-study-meta mb-3">
                <span class="badge bg-primary me-2">${study.client_type}</span>
                <span class="badge bg-secondary">${study.location}</span>
              </div>
              <h3 class="case-study-title mb-3">${study.title}</h3>
              <blockquote class="case-study-quote mb-4">
                <p class="fs-5 fst-italic">"${study.short_quote}"</p>
              </blockquote>
              <div class="case-study-highlights">
                <div class="highlight-item">
                  <i class="bi bi-check-circle text-success"></i>
                  <span>${study.problem.split(' ').slice(0, 8).join(' ')}...</span>
                </div>
                <div class="highlight-item">
                  <i class="bi bi-arrow-up-circle text-primary"></i>
                  <span>${study.outcome.split(' ').slice(0, 10).join(' ')}...</span>
                </div>
              </div>
              <div class="mt-4">
                <a href="../case-studies/${study.id}.html" class="btn btn-outline-primary me-2">Read Full Story</a>
                <a href="tel:+1-212-555-0123" class="btn btn-primary">Get Similar Solution</a>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="case-study-image">
              <div class="placeholder-image">
                <i class="bi bi-image display-1 text-muted"></i>
                <p class="text-muted mt-2">Case Study Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to render case studies carousel
function renderCaseStudiesSection(city, service) {
  const studies = getCaseStudiesByCity(city, service);
  const carouselItems = studies.map((study, index) => renderCaseStudyCarouselItem(study, index)).join('');
  const indicators = studies.map((study, index) => 
    `<button type="button" data-bs-target="#caseStudiesCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>`
  ).join('');
  
  return `
    <div id="caseStudiesCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
      <div class="carousel-indicators">
        ${indicators}
      </div>
      <div class="carousel-inner">
        ${carouselItems}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#caseStudiesCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#caseStudiesCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;
}

// Function to render hub carousel (different design)
function renderHubCarousel() {
  const studies = Object.values(CASE_STUDIES).slice(0, 4); // Show first 4 case studies
  const carouselItems = studies.map((study, index) => renderHubCarouselItem(study, index)).join('');
  const indicators = studies.map((study, index) => 
    `<button type="button" data-bs-target="#hubCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>`
  ).join('');
  
  return `
    <div id="hubCarousel" class="carousel slide hub-carousel" data-bs-ride="carousel" data-bs-interval="4000">
      <div class="carousel-indicators">
        ${indicators}
      </div>
      <div class="carousel-inner">
        ${carouselItems}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#hubCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#hubCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;
}

// Function to render hub carousel item (compact design)
function renderHubCarouselItem(study, index) {
  return `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="case-study-carousel-card">
        <div class="row align-items-center">
          <div class="col-lg-8 mx-auto text-center">
            <div class="case-study-meta mb-3">
              <span class="badge bg-light text-dark me-2">${study.client_type}</span>
              <span class="badge bg-light text-dark">${study.location}</span>
            </div>
            <h3 class="case-study-title mb-3">${study.title}</h3>
            <blockquote class="case-study-quote mb-4">
              <p class="fs-5">"${study.short_quote}"</p>
            </blockquote>
            <div class="case-study-highlights mb-4">
              <div class="highlight-item d-inline-block me-4">
                <i class="bi bi-check-circle"></i>
                <span>${study.problem.split(' ').slice(0, 6).join(' ')}...</span>
              </div>
              <div class="highlight-item d-inline-block">
                <i class="bi bi-arrow-up-circle"></i>
                <span>${study.outcome.split(' ').slice(0, 8).join(' ')}...</span>
              </div>
            </div>
            <div>
              <a href="case-studies/${study.id}.html" class="btn btn-outline-light me-2">Read Full Story</a>
              <a href="tel:+1-212-555-0123" class="btn btn-light">Get Similar Solution</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
} 