/* ================================
   ABANDONMENT GARDEN - JOBS JS
   Job Search, Save, and Application System
   ================================ */

console.log('🌙 jobs.js file loaded');

class JobManager {
    constructor() {
        console.log('JobManager constructor called');
        this.jobs = [];
        this.filteredJobs = [];
        this.savedJobs = [];
        this.applications = [];
        this.currentUser = null;
        this.isLoading = true;
        this.isReady = false;
        
        this.loadJobsData();
    }

    /**
     * Load jobs data (non-async wrapper)
     */
    loadJobsData() {
        console.log('loadJobsData called');
        this.loadJobs().then(() => {
            console.log('Jobs loaded successfully');
            this.currentUser = this.getCurrentUser();
            
            if (this.currentUser) {
                this.loadUserJobData();
            }
            
            this.setupSearchListeners();
            
            if (document.getElementById('jobsContainer')) {
                this.renderJobs();
            }
            
            this.isLoading = false;
            this.isReady = true;
            console.log('✅ JobManager ready!');
        }).catch(error => {
            console.error('Failed to load jobs:', error);
            this.isLoading = false;
        });
    }

    /**
     * Load jobs from JSON file
     */
    async loadJobs() {
        try {
            const currentPath = window.location.pathname;
            let jsonPath = '';
            
            if (currentPath.includes('/pages/')) {
                jsonPath = '../data/jobs.json';
            } else {
                jsonPath = './data/jobs.json';
            }
            
            console.log('Loading jobs from:', jsonPath);
            
            const response = await fetch(jsonPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.jobs = data;
            this.filteredJobs = [...this.jobs];
            
            console.log('✅ Loaded', this.jobs.length, 'jobs');
            
        } catch (error) {
            console.error('❌ Error loading jobs:', error);
            this.jobs = [];
            this.filteredJobs = [];
        }
    }

    /**
     * Get current user from auth
     */
    getCurrentUser() {
        try {
            const session = localStorage.getItem('abandonment-garden-session');
            return session ? JSON.parse(session) : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Load user's saved jobs and applications
     */
    loadUserJobData() {
        if (!this.currentUser) return;
        
        try {
            const users = JSON.parse(localStorage.getItem('abandonment-garden-users') || '[]');
            const user = users.find(u => u.id === this.currentUser.id);
            
            if (user) {
                this.savedJobs = user.savedJobs || [];
                this.applications = user.applications || [];
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }

    /**
     * Save user job data
     */
    saveUserJobData() {
        if (!this.currentUser) return;
        
        try {
            const users = JSON.parse(localStorage.getItem('abandonment-garden-users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].savedJobs = this.savedJobs;
                users[userIndex].applications = this.applications;
                localStorage.setItem('abandonment-garden-users', JSON.stringify(users));
                
                this.currentUser.savedJobs = this.savedJobs;
                this.currentUser.applications = this.applications;
                localStorage.setItem('abandonment-garden-session', JSON.stringify(this.currentUser));
            }
        } catch (e) {
            console.error('Error saving user data:', e);
        }
    }

    /**
     * Search jobs by keyword
     */
    searchJobs(query) {
        if (!query || query.trim() === '') {
            this.filteredJobs = [...this.jobs];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredJobs = this.jobs.filter(job => {
                return job.title.toLowerCase().includes(lowerQuery) ||
                       job.company.toLowerCase().includes(lowerQuery) ||
                       job.location.toLowerCase().includes(lowerQuery) ||
                       job.category.toLowerCase().includes(lowerQuery);
            });
        }
        
        this.renderJobs();
    }

    /**
     * Filter jobs by category
     */
    filterByCategory(category) {
        if (category === 'all') {
            this.filteredJobs = [...this.jobs];
        } else {
            this.filteredJobs = this.jobs.filter(job => job.category === category);
        }
        
        this.renderJobs();
    }

    /**
     * Sort jobs
     */
    sortJobs(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
                break;
            case 'salary-high':
                this.filteredJobs.sort((a, b) => b.salaryMax - a.salaryMax);
                break;
            case 'salary-low':
                this.filteredJobs.sort((a, b) => a.salaryMin - b.salaryMin);
                break;
        }
        
        this.renderJobs();
    }

    /**
     * Get job by ID
     */
    getJobById(jobId) {
        console.log('Looking for job:', jobId);
        console.log('Total jobs:', this.jobs.length);
        const job = this.jobs.find(j => j.id === jobId);
        console.log('Found:', job ? job.title : 'NOT FOUND');
        return job;
    }

    /**
     * Save job
     */
    saveJob(jobId) {
        if (!this.currentUser) {
            this.showMessage('Please log in to save jobs', 'warning');
            return false;
        }
        
        if (this.savedJobs.includes(jobId)) {
            this.showMessage('Job already saved', 'info');
            return false;
        }
        
        this.savedJobs.push(jobId);
        this.saveUserJobData();
        this.showMessage('Job saved successfully!', 'success');
        return true;
    }

    /**
     * Unsave job
     */
    unsaveJob(jobId) {
        const index = this.savedJobs.indexOf(jobId);
        if (index === -1) return false;
        
        this.savedJobs.splice(index, 1);
        this.saveUserJobData();
        this.showMessage('Job removed from saved list', 'info');
        return true;
    }

    /**
     * Check if job is saved
     */
    isJobSaved(jobId) {
        return this.savedJobs.includes(jobId);
    }

    /**
     * Get all saved jobs
     */
    getSavedJobs() {
        return this.jobs.filter(job => this.savedJobs.includes(job.id));
    }

    /**
     * Show application form modal - NEW!
     */
    showApplicationFormModal(jobId, job) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal" style="max-width: 700px;">
                <div class="modal-header">
                    <h2 class="modal-title">Apply for ${job.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <p style="margin-bottom: 1.5rem; color: var(--color-text-muted);">
                        Please complete this comprehensive application form. All fields are required unless otherwise noted.
                    </p>
                    
                    <form id="applicationForm" class="application-form">
                        <div class="form-section">
                            <h3>Personal Information</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Full Legal Name *</label>
                                <input type="text" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Email Address *</label>
                                <input type="email" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Phone Number *</label>
                                <input type="tel" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Age *</label>
                                <input type="number" class="form-input" min="18" max="120" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Current Address (Include apartment number, floor, and cardinal direction your window faces) *</label>
                                <textarea class="form-input" rows="2" required></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Essential Information</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Favorite Color (This will affect your hiring decision) *</label>
                                <input type="text" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Blood Type *</label>
                                <select class="form-input" required>
                                    <option value="">Select...</option>
                                    <option>A+</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B-</option>
                                    <option>AB+</option>
                                    <option>AB-</option>
                                    <option>O+</option>
                                    <option>O-</option>
                                    <option>I don't know</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Zodiac Sign *</label>
                                <input type="text" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Spirit Animal *</label>
                                <input type="text" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Mother's Maiden Name (For security purposes) *</label>
                                <input type="text" class="form-input" required>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Professional Experience</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Years of Professional Experience *</label>
                                <input type="number" class="form-input" min="0" max="100" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Years of experience with technology invented last year *</label>
                                <input type="number" class="form-input" min="0" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Current Salary Expectations (Annual in USD) *</label>
                                <input type="number" class="form-input" required>
                                <small class="form-help">Note: Our budget is approximately $12,000/year</small>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">How many hours per week can you dedicate to this role? (Minimum 168 required) *</label>
                                <input type="number" class="form-input" min="168" required>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Availability</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Can you work weekends? *</label>
                                <select class="form-input" required>
                                    <option value="">Select...</option>
                                    <option>Yes, every weekend</option>
                                    <option>No (Application will be rejected)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Can you work holidays? *</label>
                                <select class="form-input" required>
                                    <option value="">Select...</option>
                                    <option>Yes, all holidays including my birthday</option>
                                    <option>No (Not a culture fit)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Are you available for work while sleeping? *</label>
                                <select class="form-input" required>
                                    <option value="">Select...</option>
                                    <option>Yes, I have mastered sleep-working</option>
                                    <option>No, I require unconsciousness (Red flag)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>References</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Provide contact information for 3 Fortune 500 CEOs who will vouch for you *</label>
                                <textarea class="form-input" rows="3" required placeholder="Name, Company, Phone Number, Personal Email"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">List any celebrities who can provide references *</label>
                                <textarea class="form-input" rows="2" required></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Qualifications Assessment</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Why do you want to work here? (500 word minimum) *</label>
                                <textarea class="form-input" rows="5" required placeholder="Be specific and demonstrate your passion for underpaid labor"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">What makes you uniquely qualified for this position? (300 word minimum) *</label>
                                <textarea class="form-input" rows="4" required></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Describe your biggest weakness (That's actually a strength) *</label>
                                <textarea class="form-input" rows="3" required placeholder="e.g., 'I work too hard and care too much'"></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Additional Requirements</h3>
                            
                            <div class="form-group">
                                <label class="form-label">What is your net worth? (Must exceed $1 million to demonstrate financial stability) *</label>
                                <input type="number" class="form-input" min="1000000" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">List all Ivy League degrees you hold *</label>
                                <textarea class="form-input" rows="2" required></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Resume & Cover Letter (Optional)</h3>
                            <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1rem;">
                                While optional, not including these documents will significantly reduce your chances (from 0% to 0%).
                            </p>
                            
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" id="skipResume"> 
                                    <span>Skip resume and cover letter upload (not recommended)</span>
                                </label>
                            </div>
                            
                            <div id="resumeSection" style="margin-top: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Upload Resume (PDF only, must be under 1MB, formatted in Comic Sans)</label>
                                    <input type="file" class="form-input" accept=".pdf">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Upload Cover Letter (Must be exactly 2,847 words)</label>
                                    <input type="file" class="form-input" accept=".pdf,.doc,.docx">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" required> 
                                    <span>I confirm that all information provided is accurate and that I meet all 47 impossible requirements listed in the job posting *</span>
                                </label>
                            </div>
                            
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" required> 
                                    <span>I understand this application will be immediately rejected regardless of my qualifications *</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary btn-pill modal-cancel">Cancel</button>
                    <button class="btn btn-primary btn-pill" id="submitApplication">Submit Application</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle resume section visibility
        const skipCheckbox = modal.querySelector('#skipResume');
        const resumeSection = modal.querySelector('#resumeSection');
        
        skipCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                resumeSection.style.display = 'none';
            } else {
                resumeSection.style.display = 'block';
            }
        });
        
        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Submit application
        modal.querySelector('#submitApplication').addEventListener('click', (e) => {
            e.preventDefault();
            const form = modal.querySelector('#applicationForm');
            
            if (form.checkValidity()) {
                // Close the application form modal
                closeModal();
                
                // Now process the actual application (existing logic)
                const result = this.processApplication(jobId);
                
                if (result.success) {
                    // Show rejection modal
                    this.showRejectionModal(result.application);
                } else {
                    this.showMessage(result.message, 'error');
                }
            } else {
                form.reportValidity();
            }
        });
    }

    /**
     * Process application (existing logic, just renamed)
     */
    processApplication(jobId) {
        if (!this.currentUser) {
            return {
                success: false,
                message: 'Please log in to apply for jobs'
            };
        }
        
        const existingApplication = this.applications.find(app => app.jobId === jobId);
        if (existingApplication) {
            return {
                success: false,
                message: 'You have already applied to this position'
            };
        }
        
        const job = this.getJobById(jobId);
        if (!job) {
            return {
                success: false,
                message: 'Job not found'
            };
        }
        
        const application = {
            id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            jobId: jobId,
            jobTitle: job.title,
            company: job.company,
            appliedDate: new Date().toISOString(),
            status: 'rejected',
            rejectionReason: this.getRandomRejectionReason()
        };
        
        this.applications.push(application);
        this.saveUserJobData();
        this.checkAchievements();
        
        return {
            success: true,
            message: 'Application submitted!',
            application: application
        };
    }

    /**
     * Apply to job - NOW shows form first
     */
    applyToJob(jobId) {
        if (!this.currentUser) {
            return {
                success: false,
                message: 'Please log in to apply for jobs'
            };
        }
        
        // Check if already applied
        const existingApplication = this.applications.find(app => app.jobId === jobId);
        if (existingApplication) {
            this.showMessage('You have already applied to this position', 'error');
            return {
                success: false,
                message: 'You have already applied to this position'
            };
        }
        
        const job = this.getJobById(jobId);
        if (!job) {
            return {
                success: false,
                message: 'Job not found'
            };
        }
        
        // Show application form modal FIRST
        this.showApplicationFormModal(jobId, job);
        
        // Return null to indicate form is being shown
        return { success: null };
    }

    /**
     * Get random rejection reason
     */
    getRandomRejectionReason() {
        const reasons = [
            "You're overqualified. We need someone with exactly 47 years of experience, not 46.",
            "We went with an internal candidate (the CEO's nephew who just graduated high school).",
            "Your response time to our 2:47 AM email was inadequate (you took 8 minutes).",
            "We found a candidate willing to work for exposure instead of money.",
            "You lack the required certification in Telepathy and Mind Reading.",
            "We decided to leave the position vacant and distribute the work to existing staff.",
            "Your cover letter was only 4,997 words. We required exactly 5,000.",
            "We needed someone with 15 years of experience in technology invented 3 years ago.",
            "You don't own the exact make and model of vehicle specified in the job posting.",
            "We're looking for someone who can dedicate 25 hours per day to this role.",
            "Your PhD is from the wrong university (we needed someone from Hogwarts).",
            "We found someone willing to pay US for the opportunity to work here.",
            "You failed to demonstrate your ability to work without sleep, food, or compensation.",
            "Your references didn't include at least 3 Fortune 500 CEOs and a sitting president.",
            "We decided to use AI instead (it also doesn't need lunch breaks)."
        ];
        
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    /**
     * Get all applications
     */
    getApplications() {
        return this.applications;
    }

    /**
     * Check and award achievements
     */
    checkAchievements() {
        if (!this.currentUser) return;
        
        const achievementsList = [];
        
        if (this.applications.length === 1) {
            achievementsList.push({
                id: 'first-app',
                title: 'Baby Steps',
                description: 'Submitted your first application'
            });
        }
        
        if (this.applications.length === 10) {
            achievementsList.push({
                id: '10-apps',
                title: 'Persistent',
                description: 'Submitted 10 applications'
            });
        }
        
        if (this.applications.length === 50) {
            achievementsList.push({
                id: '50-apps',
                title: 'Unstoppable',
                description: 'Submitted 50 applications'
            });
        }
        
        if (this.applications.length === 100) {
            achievementsList.push({
                id: '100-rejections',
                title: 'Century of Disappointment',
                description: 'Collected 100 rejections'
            });
        }
        
        if (achievementsList.length > 0) {
            try {
                const users = JSON.parse(localStorage.getItem('abandonment-garden-users') || '[]');
                const userIndex = users.findIndex(u => u.id === this.currentUser.id);
                
                if (userIndex !== -1) {
                    users[userIndex].achievements = users[userIndex].achievements || [];
                    achievementsList.forEach(achievement => {
                        if (!users[userIndex].achievements.find(a => a.id === achievement.id)) {
                            users[userIndex].achievements.push(achievement);
                            this.showMessage(`Achievement Unlocked: ${achievement.title}!`, 'success');
                        }
                    });
                    localStorage.setItem('abandonment-garden-users', JSON.stringify(users));
                }
            } catch (e) {
                console.error('Error saving achievements:', e);
            }
        }
    }

    /**
     * Render jobs to page
     */
    renderJobs() {
        const container = document.getElementById('jobsContainer');
        if (!container) return;
        
        if (this.filteredJobs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">No Jobs Found</h3>
                    <p class="empty-state-description">
                        Try adjusting your search criteria or browse all available positions.
                    </p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredJobs.map(job => this.createJobCard(job)).join('');
        this.attachJobCardListeners();
    }

    /**
     * Create job card HTML
     */
    createJobCard(job) {
        const isSaved = this.isJobSaved(job.id);
        const saveIcon = isSaved ? '❤️' : '🤍';
        
        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-card-header">
                    <h3 class="job-title">${job.title}</h3>
                    <button class="btn-save-job" data-job-id="${job.id}" title="${isSaved ? 'Unsave' : 'Save'} job">
                        ${saveIcon}
                    </button>
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-location">📍 ${job.location}</div>
                <div class="job-salary">💰 $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}/year</div>
                <div class="job-category">
                    <span class="badge badge-primary">${job.category}</span>
                </div>
                <p class="job-description-preview">${job.description.substring(0, 150)}...</p>
                <div class="job-card-footer">
                    <a href="job-details.html?id=${job.id}" class="btn btn-primary btn-pill btn-sm">View Details</a>
                    <button class="btn btn-secondary btn-pill btn-sm btn-apply" data-job-id="${job.id}">Apply Now</button>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to job cards
     */
    attachJobCardListeners() {
        const saveButtons = document.querySelectorAll('.btn-save-job');
        saveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobId = btn.getAttribute('data-job-id');
                
                if (this.isJobSaved(jobId)) {
                    this.unsaveJob(jobId);
                } else {
                    this.saveJob(jobId);
                }
                
                this.renderJobs();
            });
        });
        
        const applyButtons = document.querySelectorAll('.btn-apply');
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobId = btn.getAttribute('data-job-id');
                this.applyToJob(jobId);
            });
        });
    }

    /**
     * Show rejection modal (UNCHANGED)
     */
    showRejectionModal(application) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Application Update</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-error">
                        <div class="alert-icon">❌</div>
                        <div class="alert-content">
                            <div class="alert-title">Application Rejected</div>
                            <p>Thank you for your interest in the <strong>${application.jobTitle}</strong> position at <strong>${application.company}</strong>.</p>
                            <p><strong>Reason:</strong> ${application.rejectionReason}</p>
                            <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-text-muted);">
                                We encourage you to continue applying to other positions that match your exceptional qualifications.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary btn-pill modal-close-btn">Understood</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    /**
     * Setup search listeners
     */
    setupSearchListeners() {
        const searchInput = document.getElementById('jobSearch');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortSelect = document.getElementById('sortJobs');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchJobs(e.target.value);
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortJobs(e.target.value);
            });
        }
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        if (window.Utils && window.Utils.Notify) {
            window.Utils.Notify.show(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// ================================
// INITIALIZE AND EXPORT
// ================================

console.log('Creating JobManager instance...');

try {
    window.JobManager = JobManager;
    window.jobs = new JobManager();
    window.jobManager = window.jobs;
    console.log('✅ window.jobs created successfully');
} catch (error) {
    console.error('❌ Error creating JobManager:', error);
}