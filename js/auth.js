/* ================================
   ABANDONMENT GARDEN - AUTH JS
   User Authentication System
   ================================ */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    /**
     * Initialize authentication manager
     */
    init() {
        // Check if user is already logged in
        this.checkAuthStatus();
        
        // Set up form listeners if on auth pages
        this.setupFormListeners();
    }

    /**
     * Load users from localStorage
     * @returns {Array}
     */
    loadUsers() {
        const users = localStorage.getItem('abandonment-garden-users');
        return users ? JSON.parse(users) : [];
    }

    /**
     * Save users to localStorage
     */
    saveUsers() {
        localStorage.setItem('abandonment-garden-users', JSON.stringify(this.users));
    }

    /**
     * Check if user is logged in
     */
    checkAuthStatus() {
        const sessionUser = localStorage.getItem('abandonment-garden-session');
        if (sessionUser) {
            this.currentUser = JSON.parse(sessionUser);
            this.updateUIForLoggedInUser();
        }
    }

    /**
     * Sign up new user
     * @param {Object} userData - User data (email, password, name)
     * @returns {Object} Result object
     */
    signup(userData) {
        const { email, password, name } = userData;
        
        // Validation
        if (!email || !password || !name) {
            return {
                success: false,
                message: 'All fields are required.'
            };
        }
        
        if (!this.validateEmail(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address.'
            };
        }
        
        if (password.length < 8) {
            return {
                success: false,
                message: 'Password must be at least 8 characters long.'
            };
        }
        
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            return {
                success: false,
                message: 'An account with this email already exists.'
            };
        }
        
        // Create new user
        const newUser = {
            id: this.generateUserId(),
            name,
            email,
            password: this.hashPassword(password), // Simple hash (not production-ready)
            createdAt: new Date().toISOString(),
            savedJobs: [],
            applications: [],
            achievements: []
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        // Auto login after signup
        this.login({ email, password });
        
        return {
            success: true,
            message: 'Account created successfully!',
            user: this.sanitizeUser(newUser)
        };
    }

    /**
     * Login user
     * @param {Object} credentials - Email and password
     * @returns {Object} Result object
     */
    login(credentials) {
        const { email, password } = credentials;
        
        // Validation
        if (!email || !password) {
            return {
                success: false,
                message: 'Email and password are required.'
            };
        }
        
        // Find user
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password.'
            };
        }
        
        // Check password
        const hashedPassword = this.hashPassword(password);
        if (user.password !== hashedPassword) {
            return {
                success: false,
                message: 'Invalid email or password.'
            };
        }
        
        // Set current user
        this.currentUser = user;
        
        // Save session
        localStorage.setItem('abandonment-garden-session', JSON.stringify(this.sanitizeUser(user)));
        
        // Update UI
        this.updateUIForLoggedInUser();
        
        return {
            success: true,
            message: 'Login successful!',
            user: this.sanitizeUser(user)
        };
    }

    /**
     * Logout current user
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('abandonment-garden-session');
        
        // Redirect to home
        window.location.href = '../index.html';
    }

    /**
     * Get current logged-in user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Update user data
     * @param {Object} updates - Data to update
     * @returns {boolean}
     */
    updateUser(updates) {
        if (!this.currentUser) return false;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) return false;
        
        // Update user
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.currentUser = this.users[userIndex];
        
        // Save changes
        this.saveUsers();
        localStorage.setItem('abandonment-garden-session', JSON.stringify(this.sanitizeUser(this.currentUser)));
        
        return true;
    }

    /**
     * Generate unique user ID
     * @returns {string}
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Simple password hashing (NOT for production use)
     * @param {string} password - Plain password
     * @returns {string}
     */
    hashPassword(password) {
        // This is a simple hash for demo purposes only
        // In production, use proper hashing like bcrypt on the backend
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Remove sensitive data from user object
     * @param {Object} user - User object
     * @returns {Object}
     */
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    /**
     * Update UI for logged-in user
     */
    updateUIForLoggedInUser() {
        // Update navigation
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && this.currentUser) {
            // Find Sign In and Get Started links
            const signInLink = navLinks.querySelector('a[href*="login"]');
            const getStartedLink = navLinks.querySelector('a[href*="signup"]');
            
            if (signInLink) {
                signInLink.textContent = 'Dashboard';
                signInLink.href = 'pages/dashboard.html';
            }
            
            if (getStartedLink) {
                getStartedLink.textContent = 'Logout';
                getStartedLink.href = '#';
                getStartedLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        }
    }

    /**
     * Set up form listeners
     */
    setupFormListeners() {
        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(signupForm);
            });
        }
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }
        
        // Logout buttons
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    }

    /**
     * Handle signup form submission
     * @param {HTMLFormElement} form - Signup form
     */
    handleSignup(form) {
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        const result = this.signup(userData);
        
        if (result.success) {
            // Show success message
            this.showMessage('Success! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Show error message
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Handle login form submission
     * @param {HTMLFormElement} form - Login form
     */
    handleLogin(form) {
        const formData = new FormData(form);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        const result = this.login(credentials);
        
        if (result.success) {
            // Show success message
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Show error message
            this.showMessage(result.message, 'error');
        }
    }

    /**
     * Show message to user
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, info)
     */
    showMessage(message, type = 'info') {
        // Check if Utils is available
        if (window.Utils && window.Utils.Notify) {
            window.Utils.Notify.show(message, type);
        } else {
            // Fallback to alert
            alert(message);
        }
    }

    /**
     * Require authentication (redirect if not logged in)
     * @param {string} redirectUrl - URL to redirect if not authenticated
     */
    requireAuth(redirectUrl = '../pages/login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
        }
    }

    /**
     * Prevent access if already logged in
     * @param {string} redirectUrl - URL to redirect if authenticated
     */
    preventAuthAccess(redirectUrl = 'dashboard.html') {
        if (this.isAuthenticated()) {
            window.location.href = redirectUrl;
        }
    }
}

// ================================
// INITIALIZE AUTH MANAGER
// ================================

let authManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authManager = new AuthManager();
    });
} else {
    authManager = new AuthManager();
}

// ================================
// EXPORT FOR USE IN OTHER FILES
// ================================

window.AuthManager = AuthManager;
window.auth = authManager;