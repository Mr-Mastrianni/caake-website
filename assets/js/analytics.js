/**
 * CAAKE Website Analytics Implementation
 * This script handles Google Tag Manager, cookie consent, and basic event tracking
 */

// Cookie consent management
const CaakeConsent = {
    cookieName: 'caake_consent',
    consentBanner: document.getElementById('cookie-consent-banner'),
    acceptButton: document.getElementById('accept-cookies'),
    rejectButton: document.getElementById('reject-cookies'),
    learnMoreLink: document.getElementById('learn-more-cookies'),
    
    init: function() {
        // Check if user has already given consent
        const consentValue = this.getConsentValue();
        
        if (consentValue === null) {
            // No decision has been made yet, show the banner
            if (this.consentBanner) {
                this.consentBanner.style.display = 'block';
                this.setupEventListeners();
            }
        } else if (consentValue === 'accepted') {
            // User has already accepted cookies, initialize analytics
            this.initializeAnalytics();
        }
    },
    
    setupEventListeners: function() {
        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', () => {
                this.setConsent('accepted');
                this.consentBanner.style.display = 'none';
                this.initializeAnalytics();
            });
        }
        
        if (this.rejectButton) {
            this.rejectButton.addEventListener('click', () => {
                this.setConsent('rejected');
                this.consentBanner.style.display = 'none';
            });
        }
    },
    
    getConsentValue: function() {
        return localStorage.getItem(this.cookieName);
    },
    
    setConsent: function(value) {
        localStorage.setItem(this.cookieName, value);
    },
    
    initializeAnalytics: function() {
        // Initialize Google Tag Manager
        this.initGTM();
        
        // Initialize other analytics tools if needed
    },
    
    initGTM: function() {
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-XXXXXXX'); // Replace GTM-XXXXXXX with your GTM ID
    }
};

// Event tracking helper
const CaakeTracker = {
    trackEvent: function(category, action, label, value) {
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
                event: 'caake_event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label,
                eventValue: value
            });
        }
    },
    
    trackPageView: function(pageTitle, pagePath) {
        if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
                event: 'caake_page_view',
                pageTitle: pageTitle || document.title,
                pagePath: pagePath || window.location.pathname
            });
        }
    },
    
    trackFormSubmission: function(formName, formData) {
        this.trackEvent('Form', 'Submit', formName);
    },
    
    trackDownload: function(resourceName, resourceType) {
        this.trackEvent('Download', resourceType, resourceName);
    },
    
    trackOutboundLink: function(url, linkText) {
        this.trackEvent('Outbound Link', 'Click', url);
    }
};

// Utility functions
const CaakeAnalyticsUtils = {
    // Get URL parameters
    getUrlParam: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    // Save UTM parameters to local storage
    saveUtmParams: function() {
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        let hasUtm = false;
        
        utmParams.forEach(param => {
            const value = this.getUrlParam(param);
            if (value) {
                localStorage.setItem(param, value);
                hasUtm = true;
            }
        });
        
        if (hasUtm) {
            localStorage.setItem('utm_timestamp', new Date().toISOString());
        }
    },
    
    // Get UTM parameters from local storage
    getUtmParams: function() {
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const result = {};
        
        utmParams.forEach(param => {
            const value = localStorage.getItem(param);
            if (value) {
                result[param] = value;
            }
        });
        
        return result;
    }
};

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Save UTM parameters if present
    CaakeAnalyticsUtils.saveUtmParams();
    
    // Initialize cookie consent
    CaakeConsent.init();
    
    // Setup form tracking
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const formName = this.getAttribute('name') || this.getAttribute('id') || 'unknown';
            CaakeTracker.trackFormSubmission(formName);
        });
    });
    
    // Setup download tracking
    document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"], a[href$=".ppt"], a[href$=".pptx"]').forEach(link => {
        link.addEventListener('click', function() {
            const filePath = this.getAttribute('href');
            const fileName = filePath.split('/').pop();
            const fileType = fileName.split('.').pop().toUpperCase();
            CaakeTracker.trackDownload(fileName, fileType);
        });
    });
    
    // Setup outbound link tracking
    document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').forEach(link => {
        link.addEventListener('click', function() {
            const url = this.getAttribute('href');
            const linkText = this.textContent || this.innerText;
            CaakeTracker.trackOutboundLink(url, linkText);
        });
    });
}); 