/**
 * CAAKE Chatbot - Simple Rule-Based Chatbot
 */

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chatbot-container');
    
    if (!container) {
        console.error('Chatbot container not found');
        return;
    }
    
    // Create chatbot structure
    container.innerHTML = `
        <div class="chatbot-toggle" aria-label="Open Chatbot" role="button" tabindex="0">
            <i class="fas fa-comment-dots"></i>
        </div>
        <div class="chatbot-window" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
            <header class="chatbot-header">
                <h2 id="chatbot-title">CAAKE AI Assistant</h2>
                <button class="chatbot-close" aria-label="Close Chatbot">&times;</button>
            </header>
            <div class="chatbot-messages" role="log" aria-live="polite"></div>
            <footer class="chatbot-input">
                <input type="text" placeholder="Type your message..." aria-label="Chat Input">
                <button aria-label="Send Message"><i class="fas fa-paper-plane"></i></button>
            </footer>
        </div>
    `;
    
    // Get chatbot elements
    const toggleButton = container.querySelector('.chatbot-toggle');
    const chatbotWindow = container.querySelector('.chatbot-window');
    const closeButton = container.querySelector('.chatbot-close');
    const messageArea = container.querySelector('.chatbot-messages');
    const inputField = container.querySelector('.chatbot-input input');
    const sendButton = container.querySelector('.chatbot-input button');
    
    let isOpen = false;
    
    // Open/close functionality
    toggleButton.addEventListener('click', toggleChatbot);
    closeButton.addEventListener('click', toggleChatbot);
    
    function toggleChatbot() {
        isOpen = !isOpen;
        chatbotWindow.style.display = isOpen ? 'flex' : 'none';
        toggleButton.style.display = isOpen ? 'none' : 'flex';
        
        if (isOpen) {
            addMessage('CAAKE Bot', 'Welcome to CAAKE! How can I help you today? Ask about our services, pricing, or get help with AI solutions.', true);
            inputField.focus();
        }
    }
    
    // Send message functionality
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '') return;
        
        addMessage('You', userMessage);
        inputField.value = '';
        
        // Simulate bot response delay
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            addMessage('CAAKE Bot', botResponse, true);
        }, 800);
    }
    
    // Add message to chat window
    function addMessage(sender, message, isBot = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isBot ? 'bot-message' : 'user-message');
        
        const senderElement = document.createElement('strong');
        senderElement.textContent = sender + ':';
        
        const textElement = document.createElement('p');
        textElement.textContent = message;
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(textElement);
        
        messageArea.appendChild(messageElement);
        
        // Scroll to bottom
        messageArea.scrollTop = messageArea.scrollHeight;
    }
    
    // Simple rule-based response logic
    function getBotResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        
        // Greeting
        if (msg.includes('hello') || msg.includes('hi')) {
            return 'Hello! How can I assist you with AI automation today?';
        }
        
        // Services
        if (msg.includes('services') || msg.includes('offer')) {
            return 'We offer AI Consulting, Automations, custom AI Solutions, AI Agents, AI Assistants, and Chatbots. Which service are you interested in? You can learn more here: <a href="pages/services.html">Our Services</a>';
        }
        
        // Pricing
        if (msg.includes('pricing') || msg.includes('cost')) {
            return 'Our pricing varies depending on the project complexity. We recommend starting with our free assessment to get a tailored estimate: <a href="pages/assessment.html">Free Assessment</a>';
        }
        
        // Consulting
        if (msg.includes('consulting')) {
            return 'Our AI consulting helps you strategize and implement AI effectively. More details: <a href="pages/services/consulting.html">AI Consulting</a>';
        }
        
        // Automations
        if (msg.includes('automation')) {
            return 'We build custom AI automations to streamline your workflows. Learn more: <a href="pages/services/automations.html">Automations</a>';
        }
        
        // Contact
        if (msg.includes('contact') || msg.includes('email') || msg.includes('phone')) {
            return 'You can contact us via our contact page: <a href="pages/contact.html">Contact Us</a> or call us at +1-480-364-1164.';
        }
        
        // About Us
        if (msg.includes('about') || msg.includes('company')) {
            return 'CAAKE specializes in cost avoidance through AI automation. Learn more about our mission here: <a href="pages/about.html">About Us</a>';
        }
        
        // Thanks
        if (msg.includes('thank you') || msg.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        // Default response
        return "I'm still learning! Can you please rephrase your question? For complex queries, please visit our <a href=\"pages/contact.html\">Contact Page</a>.";
    }
}); 