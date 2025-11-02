/* ================================
   ABANDONMENT GARDEN - MAIN JS
   Main Application Initialization
   ================================ */

class AbandonmentGarden {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    /**
     * Called when DOM is ready
     */
    onDOMReady() {
        console.log('🌙 Abandonment Garden - Initializing...');
        
        // Initialize all managers
        this.initializeManagers();
        
        // Set up global event listeners
        this.setupGlobalListeners();
        
        // Set up navigation
        this.setupNavigation();
        
        // Handle page-specific initialization
        this.initializePage();
        
        // Mark as initialized
        this.isInitialized = true;
        
        console.log('✅ Abandonment Garden - Ready!');
    }

    /**
     * Initialize all manager classes
     */
    initializeManagers() {
        // Managers are already initialized in their respective files
        // This is just a reference point
        this.theme = window.themeManager;
        this.auth = window.authManager || window.auth;
        this.jobs = window.jobManager || window.jobs;
        this.animations = window.animationController;
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Handle smooth scroll for anchor links
        this.setupSmoothScroll();
        
        // Handle external links
        this.setupExternalLinks();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Handle window resize
        this.handleResize();
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80; // Account for fixed nav
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Setup external links to open in new tab
     */
    setupExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('jobSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + /: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                if (this.theme) {
                    this.theme.toggleTheme();
                }
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                    setTimeout(() => activeModal.remove(), 300);
                }
            }
        });
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.onResize();
            }, 250);
        });
    }

    /**
     * Called on window resize
     */
    onResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile', isMobile);
        
        // Dispatch resize event
        const event = new CustomEvent('appResize', {
            detail: { 
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile 
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        // Add active class to current page nav link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes(currentPage) || (currentPage === '' && href === 'index.html'))) {
                link.classList.add('active');
            }
        });
        
        // Handle scroll effect on navigation
        this.setupScrollNavEffect();
    }

    /**
     * Add scroll effect to navigation
     */
    setupScrollNavEffect() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Hide/show nav on scroll (optional)
            // Uncomment if you want this behavior
            /*
            if (currentScroll > lastScroll && currentScroll > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            */
            
            lastScroll = currentScroll;
        });
    }

    /**
     * Initialize page-specific functionality
     */
    initializePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
            case '':
                this.initHomePage();
                break;
            case 'jobs.html':
                this.initJobsPage();
                break;
            case 'job-details.html':
                this.initJobDetailsPage();
                break;
            case 'saved-jobs.html':
                this.initSavedJobsPage();
                break;
            case 'applications.html':
                this.initApplicationsPage();
                break;
            case 'dashboard.html':
                this.initDashboardPage();
                break;
            case 'profile.html':
                this.initProfilePage();
                break;
            case 'login.html':
                this.initLoginPage();
                break;
            case 'signup.html':
                this.initSignupPage();
                break;
            case 'company.html':
                this.initCompanyPage();
                break;
        }
    }

    /**
     * Initialize home page
     */
    initHomePage() {
        console.log('📄 Initializing Home Page');
        // Home page specific code
    }

    /**
     * Initialize jobs page
     */
    initJobsPage() {
        console.log('📄 Initializing Jobs Page');
        // Jobs are already handled by JobManager
    }

    /**
     * Initialize job details page
     */
    initJobDetailsPage() {
        console.log('📄 Initializing Job Details Page');
        this.loadJobDetails();
    }

    /**
     * Load job details from URL parameter
     */
    loadJobDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('id');
        
        if (!jobId) {
            window.location.href = 'jobs.html';
            return;
        }
        
        // Wait for jobs to load
        const checkJobs = setInterval(() => {
            if (this.jobs && this.jobs.jobs.length > 0) {
                clearInterval(checkJobs);
                const job = this.jobs.getJobById(jobId);
                
                if (job) {
                    this.renderJobDetails(job);
                } else {
                    window.location.href = 'jobs.html';
                }
            }
        }, 100);
    }

    /**
     * Render job details
     * @param {Object} job - Job object
     */
    renderJobDetails(job) {
        const container = document.getElementById('jobDetailsContainer');
        if (!container) return;
        
        const isSaved = this.jobs && this.jobs.isJobSaved(job.id);
        
        container.innerHTML = `
            <div class="job-details-header">
                <h1 class="job-details-title">${job.title}</h1>
                <div class="job-details-meta">
                    <span class="job-company">🏢 ${job.company}</span>
                    <span class="job-location">📍 ${job.location}</span>
                    <span class="job-salary">💰 $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}/year</span>
                </div>
                <div class="job-details-actions">
                    <button class="btn btn-primary btn-pill" id="applyBtn">Apply Now</button>
                    <button class="btn btn-secondary btn-pill" id="saveBtn">${isSaved ? 'Unsave' : 'Save'} Job</button>
                </div>
            </div>
            
            <div class="job-details-body">
                <section class="job-section">
                    <h2>Job Description</h2>
                    <p>${job.description}</p>
                </section>
                
                <section class="job-section">
                    <h2>Qualifications</h2>
                    <ul>
                        ${job.qualifications.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </section>
                
                <section class="job-section">
                    <h2>Responsibilities</h2>
                    <ul>
                        ${job.responsibilities.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </section>
                
                <section class="job-section">
                    <h2>Benefits</h2>
                    <ul>
                        ${job.benefits.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </section>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('applyBtn').addEventListener('click', () => {
            const result = this.jobs.applyToJob(job.id);
            if (result.success) {
                this.jobs.showRejectionModal(result.application);
            }
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            if (isSaved) {
                this.jobs.unsaveJob(job.id);
            } else {
                this.jobs.saveJob(job.id);
            }
            this.loadJobDetails();
        });
    }

    /**
     * Initialize saved jobs page
     */
    initSavedJobsPage() {
        console.log('📄 Initializing Saved Jobs Page');
        if (this.auth && !this.auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Initialize applications page
     */
    initApplicationsPage() {
        console.log('📄 Initializing Applications Page');
        if (this.auth && !this.auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Initialize dashboard page
     */
    initDashboardPage() {
        console.log('📄 Initializing Dashboard Page');
        if (this.auth && !this.auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Initialize profile page
     */
    initProfilePage() {
        console.log('📄 Initializing Profile Page');
        if (this.auth && !this.auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Initialize login page
     */
    initLoginPage() {
        console.log('📄 Initializing Login Page');
        if (this.auth && this.auth.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }

    /**
     * Initialize signup page
     */
    initSignupPage() {
        console.log('📄 Initializing Signup Page');
        if (this.auth && this.auth.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }

    /**
     * Initialize company page
     */
    initCompanyPage() {
        console.log('📄 Initializing Company Page');
    }
}

// ================================
// INITIALIZE APPLICATION
// ================================

const app = new AbandonmentGarden();

// ================================
// EXPORT FOR USE IN OTHER FILES
// ================================

window.AbandonmentGarden = AbandonmentGarden;
window.app = app;