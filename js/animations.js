/* ================================
   ABANDONMENT GARDEN - ANIMATIONS JS
   Dynamic Animations & Effects
   ================================ */

class AnimationController {
    constructor() {
        this.particlesContainer = document.getElementById('particles-container');
        this.tearsContainer = document.getElementById('tearsContainer');
        this.logo = document.getElementById('mainLogo');
        this.statNumbers = document.querySelectorAll('.stat-number');
        
        this.init();
    }

    /**
     * Initialize all animations
     */
    init() {
        // Create particle system
        this.createParticles();
        
        // Start crying logo animation
        this.startTearAnimation();
        
        // Animate stat numbers on scroll
        this.observeStatNumbers();
        
        // Add scroll animations
        this.initScrollAnimations();
        
        // Add ripple effect to buttons
        this.initRippleEffects();
        
        // Add cursor trail effect (optional, can be heavy)
        // this.initCursorTrail();
        
        // Floating shapes parallax
        this.initParallax();
    }

    /**
     * Create floating particle system
     */
    createParticles() {
        if (!this.particlesContainer) return;
        
        // Adjust particle count based on screen size
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 20 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }
    }

    /**
     * Create individual particle
     */
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const sizeClass = ['particle-sm', 'particle-md', 'particle-lg'][Math.floor(Math.random() * 3)];
        particle.classList.add(sizeClass);
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation duration (15-30 seconds)
        const duration = 15 + Math.random() * 15;
        particle.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        // Random opacity
        particle.style.opacity = 0.3 + Math.random() * 0.5;
        
        this.particlesContainer.appendChild(particle);
    }

    /**
     * Start tear animation from logo
     */
    startTearAnimation() {
        if (!this.tearsContainer || !this.logo) return;
        
        // Create tears at intervals
        setInterval(() => {
            this.createTear();
        }, 2000); // New tear every 2 seconds
    }

    /**
     * Create individual tear
     */
    createTear() {
        const tear = document.createElement('div');
        tear.className = 'tear';
        
        // Get logo position
        const logoRect = this.logo.getBoundingClientRect();
        const containerRect = this.tearsContainer.getBoundingClientRect();
        
        // Random position along the logo text
        const randomX = Math.random() * logoRect.width;
        tear.style.left = (logoRect.left - containerRect.left + randomX) + 'px';
        tear.style.top = (logoRect.bottom - containerRect.top) + 'px';
        
        // Random animation duration (2-4 seconds)
        const duration = 2 + Math.random() * 2;
        tear.style.animationDuration = duration + 's';
        
        this.tearsContainer.appendChild(tear);
        
        // Remove tear after animation completes
        setTimeout(() => {
            tear.remove();
        }, duration * 1000);
    }

    /**
     * Animate stat numbers counting up
     */
    observeStatNumbers() {
        if (!this.statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateNumber(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.statNumbers.forEach(stat => observer.observe(stat));
    }

    /**
     * Animate number counting up
     * @param {Element} element - Stat number element
     */
    animateNumber(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target % 1 === 0 ? target : target.toFixed(1);
                clearInterval(timer);
                element.classList.add('counting');
            } else {
                element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
            }
        }, duration / steps);
    }

    /**
     * Initialize scroll-triggered animations
     */
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .card');
        
        if (!animatedElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('scroll-fade-in');
                    }, index * 100); // Stagger animation
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Add ripple effect to buttons
     */
    initRippleEffects() {
        const buttons = document.querySelectorAll('.btn, .btn-hero-primary, .btn-hero-secondary, .btn-cta, .btn-nav-primary');
        
        buttons.forEach(button => {
            button.classList.add('ripple-effect');
            button.addEventListener('click', (e) => {
                this.createRipple(button, e);
            });
        });
    }

    /**
     * Create ripple effect on element
     * @param {Element} element - Target element
     * @param {Event} event - Click event
     */
    createRipple(element, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-circle';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Initialize parallax effect for floating shapes
     */
    initParallax() {
        const shapes = document.querySelectorAll('.shape');
        if (!shapes.length) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    
                    shapes.forEach((shape, index) => {
                        const speed = 0.1 + (index * 0.05);
                        const yPos = -(scrolled * speed);
                        shape.style.transform = `translateY(${yPos}px)`;
                    });
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }

    /**
     * Initialize cursor trail effect (optional - can be performance heavy)
     */
    initCursorTrail() {
        const trail = [];
        const trailLength = 10;
        
        document.addEventListener('mousemove', (e) => {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.left = e.pageX + 'px';
            dot.style.top = e.pageY + 'px';
            
            document.body.appendChild(dot);
            trail.push(dot);
            
            if (trail.length > trailLength) {
                const oldDot = trail.shift();
                oldDot.remove();
            }
            
            setTimeout(() => {
                dot.style.opacity = '0';
                setTimeout(() => dot.remove(), 1000);
            }, 500);
        });
    }

    /**
     * Add hover animation to cards
     */
    addCardHoverEffects() {
        const cards = document.querySelectorAll('.feature-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.animation = 'levitate 2s ease-in-out infinite';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.animation = '';
            });
        });
    }

    /**
     * Destroy animations (cleanup)
     */
    destroy() {
        // Clear particles
        if (this.particlesContainer) {
            this.particlesContainer.innerHTML = '';
        }
        
        // Clear tears
        if (this.tearsContainer) {
            this.tearsContainer.innerHTML = '';
        }
    }
}

// ================================
// PAGE LOAD ANIMATIONS
// ================================

class PageLoadAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Fade in hero content
        this.animateHeroContent();
        
        // Animate navigation
        this.animateNavigation();
    }

    /**
     * Animate hero content on page load
     */
    animateHeroContent() {
        const heroElements = document.querySelectorAll('.hero-content > *');
        
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }

    /**
     * Animate navigation on page load
     */
    animateNavigation() {
        const nav = document.querySelector('.main-nav');
        
        if (nav) {
            nav.style.transform = 'translateY(-100%)';
            
            setTimeout(() => {
                nav.style.transition = 'transform 0.5s ease';
                nav.style.transform = 'translateY(0)';
            }, 200);
        }
    }
}

// ================================
// MOBILE MENU ANIMATION
// ================================

class MobileMenuAnimation {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.menu = document.querySelector('.nav-links');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menu.classList.add('active');
        this.toggle.classList.add('active');
        this.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// ================================
// INITIALIZE ALL ANIMATIONS
// ================================

let animationController;
let pageLoadAnimations;
let mobileMenuAnimation;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        animationController = new AnimationController();
        pageLoadAnimations = new PageLoadAnimations();
        mobileMenuAnimation = new MobileMenuAnimation();
    });
} else {
    animationController = new AnimationController();
    pageLoadAnimations = new PageLoadAnimations();
    mobileMenuAnimation = new MobileMenuAnimation();
}

// ================================
// EXPORT FOR USE IN OTHER FILES
// ================================

window.AnimationController = AnimationController;
window.MobileMenuAnimation = MobileMenuAnimation;