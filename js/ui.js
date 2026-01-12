// UI Utilities and Helpers

/**
 * Show a toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Get toast color based on type
 * @param {string} type - Toast type
 * @returns {string} Color value
 */
function getToastColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colors[type] || colors.info;
}

/**
 * Format confidence as percentage
 * @param {number} confidence - Confidence value (0-1)
 * @returns {string} Formatted percentage string
 */
function formatConfidence(confidence) {
    return (confidence * 100).toFixed(1) + '%';
}

/**
 * Disable button and show loading state
 * @param {HTMLElement} button - Button element
 * @param {string} loadingText - Text to show during loading
 */
function showButtonLoading(button, loadingText = 'Loading...') {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
}

/**
 * Enable button and restore original text
 * @param {HTMLElement} button - Button element
 */
function hideButtonLoading(button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Button';
}

/**
 * Check if device has webcam support
 * @returns {Promise<boolean>} True if webcam is supported
 */
async function hasWebcamSupport() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
        console.error('Error checking webcam support:', error);
        return false;
    }
}

/**
 * Check if device is mobile
 * @returns {boolean} True if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Copy to clipboard failed:', error);
        return false;
    }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Duration in milliseconds
 */
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    let opacity = 0;
    const step = 100 / duration;
    const interval = setInterval(() => {
        opacity += step;
        element.style.opacity = opacity / 100;
        if (opacity >= 100) {
            clearInterval(interval);
            element.style.opacity = '1';
        }
    }, 10);
}

/**
 * Fade out element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Duration in milliseconds
 */
function fadeOut(element, duration = 300) {
    let opacity = 1;
    const step = 100 / duration;
    const interval = setInterval(() => {
        opacity -= step;
        element.style.opacity = opacity / 100;
        if (opacity <= 0) {
            clearInterval(interval);
            element.style.display = 'none';
        }
    }, 10);
}

/**
 * Get browser storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Stored value or default
 */
function getStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error('Storage read error:', error);
        return defaultValue;
    }
}

/**
 * Set browser storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Storage write error:', error);
        return false;
    }
}

/**
 * Add CSS animations to styles if not already present
 */
function initializeAnimations() {
    if (document.getElementById('asl-animations')) return;

    const style = document.createElement('style');
    style.id = 'asl-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize performance monitoring
 */
function initializePerformanceMonitoring() {
    if (window.performance && window.performance.navigation) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializePerformanceMonitoring();

    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported in this browser');
    }

    console.log('UI utilities initialized');
});

// Handle visibility change for cleanup
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Stop webcam when page is hidden
        if (window.webcam && window.webcam.isRunning) {
            window.webcam.stopWebcam();
        }
    }
});
