/* ================================
   ABANDONMENT GARDEN - THEME JS
   Dark & Light Mode Toggle
   ================================ */

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        // Apply stored or system theme
        this.applyTheme(this.currentTheme);
        
        // Set up toggle button listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        this.watchSystemTheme();
    }

    /**
     * Get theme from localStorage
     * @returns {string|null}
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('abandonment-garden-theme');
        } catch (error) {
            console.warn('Could not access localStorage:', error);
            return null;
        }
    }

    /**
     * Save theme to localStorage
     * @param {string} theme - Theme name (dark or light)
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('abandonment-garden-theme', theme);
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    /**
     * Get system theme preference
     * @returns {string}
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        // Add transition class for smooth theme change
        document.body.classList.add('theme-changing');
        
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Update toggle button icon
        this.updateToggleIcon(theme);
        
        // Save to localStorage
        this.saveTheme(theme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 300);
        
        // Dispatch custom event for other scripts to listen to
        this.dispatchThemeChange(theme);
    }

    /**
     * Toggle between dark and light themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Add bounce animation to toggle button
        if (this.themeToggle) {
            this.themeToggle.style.animation = 'none';
            setTimeout(() => {
                this.themeToggle.style.animation = 'elasticBounce 0.8s ease';
            }, 10);
            
            setTimeout(() => {
                this.themeToggle.style.animation = '';
            }, 800);
        }
    }

    /**
     * Update toggle button icon
     * @param {string} theme - Current theme
     */
    updateToggleIcon(theme) {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('.theme-icon');
        if (icon) {
            // Icon is already set via CSS ::before pseudo-element
            // But we can add additional animations here if needed
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Only auto-switch if user hasn't manually set a preference
            darkModeQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                }
            });
        }
    }

    /**
     * Dispatch custom theme change event
     * @param {string} theme - New theme
     */
    dispatchThemeChange(theme) {
        const event = new CustomEvent('themeChange', {
            detail: { theme }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current theme
     * @returns {string}
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set specific theme
     * @param {string} theme - Theme to set (dark or light)
     */
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.applyTheme(theme);
        } else {
            console.warn('Invalid theme:', theme);
        }
    }
}

// ================================
// INITIALIZE THEME MANAGER
// ================================

let themeManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
    });
} else {
    themeManager = new ThemeManager();
}

// ================================
// EXPORT FOR USE IN OTHER FILES
// ================================

window.ThemeManager = ThemeManager;