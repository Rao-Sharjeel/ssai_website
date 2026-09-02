// Testimonials Dynamic Loader
class TestimonialsLoader {
    constructor() {
        this.testimonials = [];
        this.carouselContainer = null;
        this.init();
    }

    async init() {
        try {
            await this.loadTestimonials();
            this.renderTestimonials();
        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.showFallbackContent();
        }
    }

    async loadTestimonials() {
        const response = await fetch('assets/data/testimonials.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.testimonials = await response.json();
    }

    renderTestimonials() {
        this.carouselContainer = document.querySelector('.auto-scroll-carousel');
        if (!this.carouselContainer) {
            console.error('Carousel container not found');
            return;
        }

        // Clear existing content
        this.carouselContainer.innerHTML = '';

        // Create testimonial cards
        this.testimonials.forEach(testimonial => {
            const card = this.createTestimonialCard(testimonial);
            this.carouselContainer.appendChild(card);
        });

        // Duplicate cards for seamless loop
        this.testimonials.forEach(testimonial => {
            const card = this.createTestimonialCard(testimonial);
            this.carouselContainer.appendChild(card);
        });
    }

    createTestimonialCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimonial-card-modern';
        
        const stars = this.generateStars(testimonial.rating);
        const services = testimonial.services.map(service => 
            `<span class="tag">${service}</span>`
        ).join('');

        card.innerHTML = `
            <div class="testimonial-card-inner">
                <div class="testimonial-header-card">
                    <div class="testimonial-avatar">
                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="avatar-image">
                        <div class="avatar-badge">
                            <i class="fa fa-check"></i>
                        </div>
                    </div>
                    <div class="testimonial-meta">
                        <h5 class="mb-1 fw-bold">${testimonial.name}</h5>
                        <p class="text-muted mb-2">${testimonial.title}</p>
                        <div class="rating-stars">
                            ${stars}
                        </div>
                    </div>
                    <div class="testimonial-stats">
                        <div class="stat-badge ${testimonial.statType}">
                            <span class="stat-number">${testimonial.statNumber}</span>
                            <span class="stat-label">${testimonial.statLabel}</span>
                        </div>
                    </div>
                </div>
                
                <div class="testimonial-content">
                    <div class="quote-mark">
                        <i class="fa fa-quote-left"></i>
                    </div>
                    <blockquote>
                        <p>"${testimonial.quote}"</p>
                    </blockquote>
                </div>
                
                <div class="testimonial-footer">
                    <div class="service-tags">
                        ${services}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<i class="fa fa-star"></i>';
            } else {
                stars += '<i class="fa fa-star-o"></i>';
            }
        }
        return stars;
    }

    showFallbackContent() {
        console.log('Showing fallback testimonial content');
        // You can add fallback content here if needed
    }

    // Method to add new testimonials dynamically
    addTestimonial(testimonial) {
        this.testimonials.push(testimonial);
        this.renderTestimonials();
    }

    // Method to filter testimonials by location
    filterByLocation(location) {
        return this.testimonials.filter(t => t.location === location);
    }

    // Method to filter testimonials by service
    filterByService(service) {
        return this.testimonials.filter(t => t.services.includes(service));
    }
}

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new TestimonialsLoader();
});

// Export for use in other scripts if needed
window.TestimonialsLoader = TestimonialsLoader;
