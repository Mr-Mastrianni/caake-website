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
            // Create a script element to load the config
            const configScript = document.createElement('script');
            configScript.type = 'module';

            // Set the script content to import and set the config
            configScript.textContent = `
                import { config, security } from '${getBasePath()}assets/js/config.js';
                window.CAAKE_CONFIG = config;
                window.CAAKE_SECURITY = security;

                // Load chatbot after config is loaded
                import('${getBasePath()}assets/js/chatbot.js');
            `;

            // Add the script to the document
            document.body.appendChild(configScript);
        } else if (!document.querySelector('script[src*="chatbot.js"]')) {
            // Config already loaded, load chatbot directly
            const chatbotScript = document.createElement('script');
            chatbotScript.type = 'module';
            chatbotScript.src = getBasePath() + 'assets/js/chatbot.js';
            document.body.appendChild(chatbotScript);
        }
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
