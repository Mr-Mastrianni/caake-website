/**
 * CAAKE Chatbot Inclusion Script
 * This script automatically adds the chatbot to any page that includes it
 *
 * Usage: Add this script to any page where you want the chatbot to appear
 * <script src="path/to/include-chatbot.js"></script>
 */

(function() {
    // Execute immediately to avoid DOMContentLoaded delay
    addChatbotResources();

    // Also ensure it runs after DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Double-check in case the immediate execution was too early
        if (!document.getElementById('chatbot-container')) {
            addChatbotResources();
        }
    });

    function addChatbotResources() {
        // Check if chatbot container already exists
        if (!document.getElementById('chatbot-container')) {
            // Create chatbot container
            const chatbotContainer = document.createElement('div');
            chatbotContainer.id = 'chatbot-container';
            chatbotContainer.style.backgroundColor = 'transparent';
            chatbotContainer.style.boxShadow = 'none';
            chatbotContainer.style.border = 'none';

            // Add container to body
            document.body.appendChild(chatbotContainer);
        }

        // Check if chatbot CSS is loaded
        if (!document.querySelector('link[href*="chatbot-fix.css"]')) {
            // Add chatbot CSS
            const chatbotCSS = document.createElement('link');
            chatbotCSS.rel = 'stylesheet';
            chatbotCSS.href = getBasePath() + 'assets/css/chatbot-fix.css';
            document.head.appendChild(chatbotCSS);
        }

        // Load config and chatbot script
        loadConfigAndChatbot();
    }

    function loadConfigAndChatbot() {
        // Check if config is loaded
        if (!window.CAAKE_CONFIG) {
            // Load config first using a regular script
            const configScript = document.createElement('script');
            configScript.src = getBasePath() + 'assets/js/config.js';
            configScript.onload = function() {
                // Once config is loaded, load the chatbot
                if (window.CAAKE_CONFIG) {
                    loadChatbotScript();
                } else {
                    console.error('Config loaded but CAAKE_CONFIG not defined');
                }
            };
            configScript.onerror = function() {
                console.error('Failed to load config script');
            };
            document.body.appendChild(configScript);
        } else if (!document.querySelector('script[src*="chatbot.js"]')) {
            // Config already loaded, load chatbot directly
            loadChatbotScript();
        }
    }

    // Helper function to load the chatbot script
    function loadChatbotScript() {
        const chatbotScript = document.createElement('script');
        chatbotScript.src = getBasePath() + 'assets/js/chatbot.js';
        document.body.appendChild(chatbotScript);
    }

    // Helper function to get the base path relative to the current page
    function getBasePath() {
        const path = window.location.pathname;

        // Handle Windows backslashes in paths
        const normalizedPath = path.replace(/\\/g, '/');

        if (normalizedPath.includes('/pages/')) {
            if (normalizedPath.includes('/pages/services/')) {
                return '../../'; // For pages in /pages/services/
            }
            return '../'; // For pages in /pages/
        }
        return ''; // For root pages
    }
})();
