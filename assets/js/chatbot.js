/**
 * CAAKE Chatbot - Direct OpenAI Integration
 */

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('chatbot-container');
    if (!container) {
        console.error('Chatbot container not found');
        return;
    }

    // Set container to be transparent and no background
    container.style.backgroundColor = 'transparent';
    container.style.boxShadow = 'none';
    container.style.border = 'none';

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
                <div class="suggested-questions"></div>
                <div class="input-wrapper">
                    <input type="text" placeholder="Type your message..." aria-label="Chat Input">
                    <button aria-label="Send Message"><i class="fas fa-paper-plane"></i></button>
                </div>
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
    const suggestedQuestionsArea = container.querySelector('.suggested-questions');

    let isOpen = false;
    let isProcessing = false;

    // Hide the chatbot window initially to ensure no background elements are visible
    chatbotWindow.style.display = 'none';
    chatbotWindow.style.opacity = '0';
    chatbotWindow.style.visibility = 'hidden';

    // Show the toggle button
    toggleButton.style.display = 'flex';

    // Site-specific knowledge for the chatbot
    const SYSTEM_PROMPT = `You are CAAKE AI, the official AI assistant for CAAKE (Cost Avoidance Automation Kingz Enterprise).
    You are an expert in AI automation solutions and business transformation.

    Core Services:
    1. AI Consulting: Expert advice on AI strategy and implementation
    2. Automations: Custom solutions to streamline operations
    3. AI Solutions: Tailored AI models for specific business needs
    4. AI Agents: Intelligent agents for customer service and operations
    5. AI Assistants: Personalized assistants for productivity
    6. Chatbots: Engaging chatbots for customer interaction
    7. Calendar Management: Schedule and manage appointments using Google Calendar

    Success Stories:
    - JCM Retail Chain: 42% operational efficiency increase, $1.2M annual savings
    - Meridian Health Group: 37% reduction in administrative tasks, 29% improved patient satisfaction
    - First Capital Bank: 68% improved customer satisfaction, 74% faster query resolution

    Key Features:
    - Advanced Data Analytics
    - Streamlined Workflow Automation
    - Digital Twin Technology
    - 24/7 Availability
    - Custom AI Solutions
    - Integration Capabilities
    - Calendar Integration

    Contact Information:
    - Phone: 480-364-1164
    - Email: automationking11@caake.org

    Calendar Commands:
    - "Schedule a meeting" or "Book an appointment": Create a new calendar event
    - "Show my calendar" or "List events": View upcoming events
    - "Find free time": Find available time slots
    - "Update meeting" or "Reschedule": Modify existing events
    - "Cancel meeting": Delete calendar events

    Be professional yet approachable, and guide users toward practical solutions.
    If users ask about pricing or specific technical details, offer to connect them with a specialist.
    For image generation requests, create professional, business-appropriate visuals.
    For calendar requests, help users schedule and manage their appointments efficiently.`;

    // Open/close functionality
    toggleButton.addEventListener('click', toggleChatbot);
    closeButton.addEventListener('click', toggleChatbot);

    function toggleChatbot() {
        isOpen = !isOpen;

        if (isOpen) {
            // Show chatbot window
            chatbotWindow.style.display = 'flex';
            chatbotWindow.style.opacity = '1';
            chatbotWindow.style.visibility = 'visible';

            // Hide toggle button
            toggleButton.style.display = 'none';

            if (messageArea.children.length === 0) {
                addMessage('CAAKE AI', {
                    type: 'text',
                    content: 'Hello! I\'m the CAAKE AI Assistant. I can help you learn about our AI automation solutions, share success stories, or even generate custom AI visuals. How can I assist you today?'
                }, true);

                // Display initial suggested questions
                displaySuggestedQuestions([
                    "What AI services do you offer?",
                    "Tell me about your success stories",
                    "How can automation help my business?",
                    "Generate an AI image"
                ]);
            }
             inputField.focus();
        } else {
            // Hide chatbot window
            chatbotWindow.style.display = 'none';
            chatbotWindow.style.opacity = '0';
            chatbotWindow.style.visibility = 'hidden';

            // Show toggle button
            toggleButton.style.display = 'flex';
        }
    }

    // Send message functionality
    sendButton.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !isProcessing) {
            handleSendMessage();
        }
    });

    // Message handling
    async function handleSendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '' || isProcessing) return;

        isProcessing = true;
        inputField.disabled = true;
        sendButton.disabled = true;

        addMessage('You', { type: 'text', content: userMessage });
        inputField.value = '';
        addLoadingIndicator();

        try {
            if (isCalendarRequest(userMessage)) {
                await handleCalendarRequest(userMessage);
            } else if (userMessage.toLowerCase().includes('generate image') ||
                userMessage.toLowerCase().includes('create image')) {
                await handleImageGeneration(userMessage);
            } else {
                await handleTextCompletion(userMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            removeLoadingIndicator();
            addMessage('CAAKE AI', {
                type: 'text',
                content: 'I apologize, but I encountered an error. Please try again or contact our support team at automationking11@caake.org.'
            }, true);
        } finally {
            isProcessing = false;
            inputField.disabled = false;
            sendButton.disabled = false;
            inputField.focus();
        }
    }

    // Suggested questions functionality
    function displaySuggestedQuestions(questions) {
        suggestedQuestionsArea.innerHTML = '';

        questions.forEach(question => {
            const questionButton = document.createElement('button');
            questionButton.classList.add('suggested-question');
            questionButton.textContent = question;
            questionButton.addEventListener('click', () => {
                // Set the input field with the question text
                inputField.value = question;

                // Trigger the send message handler
                handleSendMessage();
            });

            suggestedQuestionsArea.appendChild(questionButton);
        });
    }

    // Update suggested questions based on conversation context
    function updateSuggestedQuestions(userMessage, botResponse) {
        let newQuestions = [];

        const combinedText = (userMessage + ' ' + botResponse).toLowerCase();

        // Determine appropriate follow-up questions based on context
        if (combinedText.includes('consult') || combinedText.includes('strategy')) {
            newQuestions = [
                "How does your AI consulting work?",
                "What's included in a consultation?",
                "Do you offer implementation services?",
                "Schedule a consultation call"
            ];
        } else if (combinedText.includes('automat') || combinedText.includes('workflow')) {
            newQuestions = [
                "How do you automate workflows?",
                "What processes can be automated?",
                "Tell me about RPA solutions",
                "What's the ROI on automation?"
            ];
        } else if (combinedText.includes('service') || combinedText.includes('offer')) {
            newQuestions = [
                "Tell me about AI Consulting",
                "How do your Automation services work?",
                "What are AI Agents?",
                "Do you offer chatbot development?"
            ];
        } else if (combinedText.includes('success') || combinedText.includes('case stud')) {
            newQuestions = [
                "Retail transformation case study",
                "Healthcare automation examples",
                "Financial services results",
                "What ROI can I expect?"
            ];
        } else if (combinedText.includes('image') || combinedText.includes('generat')) {
            newQuestions = [
                "Generate an AI workflow image",
                "Create image of digital transformation",
                "Generate a business automation visual",
                "What other AI services do you offer?"
            ];
        } else if (combinedText.includes('contact') || combinedText.includes('schedule') || combinedText.includes('call')) {
            newQuestions = [
                "Book a consultation",
                "What's your phone number?",
                "Do you work with small businesses?",
                "What's included in your packages?"
            ];
        } else if (combinedText.includes('cost') || combinedText.includes('price') || combinedText.includes('pricing')) {
            newQuestions = [
                "What factors affect pricing?",
                "Do you offer pricing tiers?",
                "Are there implementation costs?",
                "Can I get a custom quote?"
            ];
        } else {
            // Default follow-up questions
            newQuestions = [
                "How do you implement AI solutions?",
                "What industries do you work with?",
                "Tell me about AI Assistants",
                "Can you generate an example image?"
            ];
        }

        displaySuggestedQuestions(newQuestions);
    }

    // Calendar request detection
    function isCalendarRequest(message) {
        const calendarKeywords = [
            'schedule',
            'appointment',
            'meeting',
            'calendar',
            'book',
            'reschedule',
            'cancel meeting',
            'find time',
            'free slot',
            'availability'
        ];

        return calendarKeywords.some(keyword =>
            message.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // Handle calendar requests
    async function handleCalendarRequest(userMessage) {
        try {
            // First, get AI to understand the calendar request
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: config.DEFAULT_MODEL,
                    messages: [
                        { role: "system", content: "You are a calendar assistant. Extract calendar operation (list_events/create_event/update_event/delete_event/find_free_time), date, time, duration, and attendees from the user message. Respond in JSON format only." },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                throw new Error('Failed to parse calendar request');
            }

            const data = await response.json();
            const calendarData = JSON.parse(data.choices[0].message.content);

            // Call appropriate calendar MCP function based on operation
            let result;
            switch (calendarData.operation) {
                case 'list_events':
                    result = await window.mcp.google_calendar.list_events({
                        timeMin: calendarData.date || new Date().toISOString(),
                        maxResults: 10
                    });
                    break;
                case 'create_event':
                    result = await window.mcp.google_calendar.create_event({
                        summary: calendarData.summary || 'Meeting',
                        start: calendarData.date,
                        duration: calendarData.duration || '1h',
                        attendees: calendarData.attendees || []
                    });
                    break;
                case 'update_event':
                    result = await window.mcp.google_calendar.update_event({
                        eventId: calendarData.eventId,
                        updates: calendarData.updates
                    });
                    break;
                case 'delete_event':
                    result = await window.mcp.google_calendar.delete_event({
                        eventId: calendarData.eventId
                    });
                    break;
                case 'find_free_time':
                    result = await window.mcp.google_calendar.find_free_time({
                        duration: calendarData.duration || '1h',
                        timeMin: calendarData.date || new Date().toISOString()
                    });
                    break;
                default:
                    throw new Error('Unknown calendar operation');
            }

            const formattedResponse = formatCalendarResponse(result, calendarData.operation);
            removeLoadingIndicator();
            addMessage('CAAKE AI', {
                type: 'text',
                content: formattedResponse
            }, true);

            // Update suggested questions for calendar context
            displaySuggestedQuestions([
                "Schedule another meeting",
                "What's my availability next week?",
                "Tell me about your AI services",
                "How can I contact you?"
            ]);

        } catch (error) {
            console.error('Error in handleCalendarRequest:', error);
            removeLoadingIndicator();
            addMessage('CAAKE AI', {
                type: 'text',
                content: 'I apologize, but I encountered an error with the calendar operation. Please try again or contact our support team.'
            }, true);
        }
    }

    function formatCalendarResponse(result, operation) {
        switch (operation) {
            case 'list_events':
                return formatEventsList(result.events);
            case 'create_event':
                return `✅ Successfully created event: "${result.summary}" on ${new Date(result.start).toLocaleString()}`;
            case 'update_event':
                return `✅ Event updated successfully`;
            case 'delete_event':
                return `✅ Event deleted successfully`;
            case 'find_free_time':
                return formatFreeTimeSlots(result.freeTime);
            default:
                return `Operation completed successfully`;
        }
    }

    function formatEventsList(events) {
        if (events.length === 0) return "You have no upcoming events.";
        let response = "📅 Here are your upcoming events:\n\n";
        events.forEach(event => {
            response += `• ${event.summary}: ${new Date(event.start).toLocaleString()} - ${new Date(event.end).toLocaleString()}\n`;
        });
        return response;
    }

    function formatFreeTimeSlots(slots) {
        if (slots.length === 0) return "No free time slots found in the requested period.";
        let response = "🕒 Here are your available time slots:\n\n";
        slots.forEach(slot => {
            response += `• ${new Date(slot.start).toLocaleString()} - ${new Date(slot.end).toLocaleString()}\n`;
        });
        return response;
    }

    async function handleTextCompletion(userMessage) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: config.DEFAULT_MODEL,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from API');
            }

            const data = await response.json();
            const botResponse = data.choices[0].message.content;

            removeLoadingIndicator();
            addMessage('CAAKE AI', { type: 'text', content: botResponse }, true);

            // Update suggested questions based on conversation
            updateSuggestedQuestions(userMessage, botResponse);

        } catch (error) {
            console.error('Error in handleTextCompletion:', error);
            // Fallback response in case API fails
            removeLoadingIndicator();
            const fallbackResponse = generateFallbackResponse(userMessage);
            addMessage('CAAKE AI', { type: 'text', content: fallbackResponse }, true);

            // Update with general questions when in fallback mode
            displaySuggestedQuestions([
                "What services do you offer?",
                "Contact CAAKE support",
                "Generate an AI image",
                "Tell me about AI automation"
            ]);
        }
    }

    // Generate a fallback response when API is unavailable
    function generateFallbackResponse(userMessage) {
        if (userMessage.toLowerCase().includes('service')) {
            return "CAAKE offers a variety of AI services including consulting, automation solutions, AI agents, assistants, and chatbots. Would you like to speak with a representative to learn more?";
        } else if (userMessage.toLowerCase().includes('contact')) {
            return "You can reach CAAKE at 480-364-1164 or email automationking11@caake.org for more information about our services.";
        } else {
            return "Thank you for your interest in CAAKE. We specialize in AI automation solutions for businesses. Would you like to learn more about our services or speak with a representative?";
        }
    }

    async function handleImageGeneration(userMessage) {
        try {
            // First extract the image description using AI
            const promptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: config.DEFAULT_MODEL,
                    messages: [
                        { role: "system", content: "Extract the image description from the user's request. Return only the description, nothing else." },
                        { role: "user", content: userMessage }
                    ],
                    temperature: 0.3,
                    max_tokens: 100
                })
            });

            if (!promptResponse.ok) throw new Error('Failed to parse image request');

            const promptData = await promptResponse.json();
            const imagePrompt = promptData.choices[0].message.content + ", professional, high quality, photo-realistic, detailed";

            // Now generate the image
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: imagePrompt,
                    n: 1,
                    size: "1024x1024"
                })
            });

            if (!imageResponse.ok) throw new Error('Failed to generate image');

            const imageData = await imageResponse.json();
            const imageUrl = imageData.data[0].url;

            removeLoadingIndicator();
            addMessage('CAAKE AI', {
                type: 'image',
                content: imageUrl,
                caption: `Here's the AI-generated image based on your request: "${imagePrompt}"`
            }, true);

            // Update suggested questions for image context
            displaySuggestedQuestions([
                "Generate another image",
                "How can I use AI in my business?",
                "Tell me about your services",
                "Can you create custom AI solutions?"
            ]);

        } catch (error) {
            console.error('Error in handleImageGeneration:', error);
            removeLoadingIndicator();
            addMessage('CAAKE AI', {
                type: 'text',
                content: 'I apologize, but I encountered an error generating the image. Please try again with a different description or contact our support team.'
            }, true);
        }
    }

    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message', 'loading');
        loadingDiv.id = 'loading-indicator';

        // Create avatar element
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar', 'bot-avatar');
        avatarDiv.innerHTML = '<img src="assets/images/robot-icon.svg" alt="Robot" class="robot-icon">'; // Custom SVG robot icon

        // Create loading bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.innerHTML = `
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        // Append avatar and bubble to message div
        loadingDiv.appendChild(avatarDiv);
        loadingDiv.appendChild(bubbleDiv);

        messageArea.appendChild(loadingDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    function addMessage(_, data, isBot = false) { // Using _ to indicate unused parameter
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isBot ? 'bot-message' : 'user-message');

        // Create avatar element
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        if (isBot) {
            avatarDiv.classList.add('bot-avatar');
        }
        // Use custom SVG robot icon to match the image
        avatarDiv.innerHTML = '<img src="assets/images/robot-icon.svg" alt="Robot" class="robot-icon">';

        // Create message content
        let messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');

        if (data.type === 'text') {
            messageBubble.innerHTML = formatMessageContent(data.content);
        } else if (data.type === 'image') {
            messageBubble.innerHTML = `
                <p>${formatMessageContent(data.caption)}</p>
                <div class="image-container">
                    <img src="${data.content}" alt="AI Generated Image" class="generated-image">
                </div>
            `;
        }

        // Append avatar and message bubble to message div
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(messageBubble);
        messageArea.appendChild(messageDiv);

        // Smooth scroll to the latest message
        setTimeout(() => {
            messageArea.scrollTo({
                top: messageArea.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    function formatMessageContent(content) {
        // Convert URLs to links
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

        // Convert line breaks to <br>
        content = content.replace(/\n/g, '<br>');

        // Convert markdown-style bold to HTML bold
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert markdown-style bullet points to HTML list
        if (content.includes('\n• ')) {
            const lines = content.split('\n');
            let inList = false;
            let newContent = '';

            for (const line of lines) {
                if (line.startsWith('• ')) {
                    if (!inList) {
                        newContent += '<ul class="chat-list">';
                        inList = true;
                    }
                    newContent += `<li>${line.substring(2)}</li>`;
                } else {
                    if (inList) {
                        newContent += '</ul>';
                        inList = false;
                    }
                    newContent += line + '<br>';
                }
            }

            if (inList) {
                newContent += '</ul>';
            }

            content = newContent;
        }

        return content;
    }
});
