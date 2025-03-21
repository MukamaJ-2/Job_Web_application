// Format date to a readable string
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

// Validate email format
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return errors;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

// Generate random avatar color based on name
export const getAvatarColor = (name) => {
    const colors = [
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
        '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
        '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
        '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Parse query string parameters
export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
};

// Create query string from object
export const createQueryString = (params) => {
    return Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
        .map(key => `${encodeURIComponent(key)} = ${encodeURIComponent(params[key])} `)
        .join('&');
};