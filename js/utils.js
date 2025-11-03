/* ================================
   ABANDONMENT GARDEN - UTILS JS
   Helper Functions & Utilities
   ================================ */

// ================================
// LOCAL STORAGE UTILITIES
// ================================

const Storage = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @returns {*} Parsed value or null
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// ================================
// DOM UTILITIES
// ================================

const DOM = {
    /**
     * Query selector shorthand
     * @param {string} selector - CSS selector
     * @returns {Element|null}
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Query selector all shorthand
     * @param {string} selector - CSS selector
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Create element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes object
     * @param {string} content - Inner HTML content
     * @returns {Element}
     */
    create(tag, attrs = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attrs).forEach(key => {
            if (key === 'class') {
                element.className = attrs[key];
            } else if (key === 'dataset') {
                Object.keys(attrs[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attrs[key][dataKey];
                });
            } else {
                element.setAttribute(key, attrs[key]);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },

    /**
     * Add event listener to multiple elements
     * @param {NodeList|Array} elements - Elements to attach listener to
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     */
    onAll(elements, event, callback) {
        elements.forEach(element => {
            element.addEventListener(event, callback);
        });
    },

    /**
     * Remove element from DOM
     * @param {Element} element - Element to remove
     */
    remove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean}
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ================================
// STRING UTILITIES
// ================================

const Str = {
    /**
     * Capitalize first letter of string
     * @param {string} str - Input string
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Truncate string with ellipsis
     * @param {string} str - Input string
     * @param {number} length - Max length
     * @returns {string}
     */
    truncate(str, length = 100) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    /**
     * Generate random string
     * @param {number} length - Length of string
     * @returns {string}
     */
    random(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Generate URL-friendly slug from string
     * @param {string} str - Input string
     * @returns {string}
     */
    slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Escape HTML special characters
     * @param {string} str - Input string
     * @returns {string}
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ================================
// NUMBER UTILITIES
// ================================

const Num = {
    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string}
     */
    format(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Clamp number between min and max
     * @param {number} num - Number to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },

    /**
     * Round to specific decimal places
     * @param {number} num - Number to round
     * @param {number} decimals - Number of decimal places
     * @returns {number}
     */
    round(num, decimals = 2) {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
};

// ================================
// ARRAY UTILITIES
// ================================

const Arr = {
    /**
     * Shuffle array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array}
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /**
     * Get random element from array
     * @param {Array} array - Source array
     * @returns {*}
     */
    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Remove duplicates from array
     * @param {Array} array - Source array
     * @returns {Array}
     */
    unique(array) {
        return [...new Set(array)];
    },

    /**
     * Chunk array into smaller arrays
     * @param {Array} array - Source array
     * @param {number} size - Chunk size
     * @returns {Array}
     */
    chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
};

// ================================
// DATE UTILITIES (RENAMED FROM Date TO DateUtils)
// ================================

const DateUtils = {
    /**
     * Format date to readable string
     * @param {Date} date - Date object
     * @returns {string}
     */
    format(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Get time ago string (e.g., "2 hours ago")
     * @param {Date} date - Date object
     * @returns {string}
     */
    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        
        return 'just now';
    },

    /**
     * Check if date is today
     * @param {Date} date - Date object
     * @returns {boolean}
     */
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
};

// ================================
// VALIDATION UTILITIES
// ================================

const Validate = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} { valid: boolean, strength: string }
     */
    password(password) {
        if (password.length < 8) {
            return { valid: false, strength: 'too short' };
        }
        
        let strength = 0;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        const strengthMap = ['weak', 'fair', 'good', 'strong', 'very strong'];
        
        return {
            valid: strength >= 2,
            strength: strengthMap[strength]
        };
    },

    /**
     * Validate phone number (US format)
     * @param {string} phone - Phone number to validate
     * @returns {boolean}
     */
    phone(phone) {
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return regex.test(phone);
    },

    /**
     * Check if string is empty or whitespace
     * @param {string} str - String to check
     * @returns {boolean}
     */
    isEmpty(str) {
        return !str || str.trim().length === 0;
    }
};

// ================================
// ANIMATION UTILITIES
// ================================

const Animate = {
    /**
     * Smooth scroll to element
     * @param {Element|string} target - Target element or selector
     * @param {number} offset - Offset from top
     */
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? DOM.$(target) : target;
        if (!element) return;
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Fade in element
     * @param {Element} element - Element to fade in
     * @param {number} duration - Duration in ms
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    /**
     * Fade out element
     * @param {Element} element - Element to fade out
     * @param {number} duration - Duration in ms
     */
    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = initialOpacity - (initialOpacity * Math.min(progress / duration, 1));
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },

    /**
     * Add ripple effect to element on click
     * @param {Element} element - Target element
     * @param {Event} event - Click event
     */
    ripple(element, event) {
        const ripple = DOM.create('span', { class: 'ripple-circle' });
        const rect = element.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => DOM.remove(ripple), 600);
    }
};

// ================================
// DEBOUNCE & THROTTLE
// ================================

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ================================
// NOTIFICATION UTILITY
// ================================

const Notify = {
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Type: success, error, warning, info
     * @param {number} duration - Duration in ms
     */
    show(message, type = 'info', duration = 3000) {
        const notification = DOM.create('div', {
            class: `alert alert-${type}`,
            style: 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
        }, `
            <div class="alert-content">${Str.escapeHtml(message)}</div>
            <button class="alert-close">&times;</button>
        `);
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => notification.style.opacity = '1', 10);
        
        // Close button
        const closeBtn = notification.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            Animate.fadeOut(notification, 200);
            setTimeout(() => DOM.remove(notification), 200);
        });
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                Animate.fadeOut(notification, 200);
                setTimeout(() => DOM.remove(notification), 200);
            }, duration);
        }
    }
};

// ================================
// EXPORT FOR USE IN OTHER FILES
// ================================

window.Utils = {
    Storage,
    DOM,
    Str,
    Num,
    Arr,
    DateUtils,
    Validate,
    Animate,
    debounce,
    throttle,
    Notify
};