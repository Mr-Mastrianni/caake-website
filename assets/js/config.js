// Configuration
const config = {
    OPENAI_API_KEY: 'your-api-key-here', // Replace with your actual API key
    OPENAI_API_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    DALLE_API_ENDPOINT: 'https://api.openai.com/v1/images/generations',
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    MAX_RETRY_DELAY: 10000,
    DEFAULT_MODEL: 'gpt-4',
    TEMPERATURE: 0.7,
    // Google Calendar MCP Configuration
    GOOGLE_CALENDAR: {
        CLIENT_ID: 'your-client-id-here',
        CLIENT_SECRET: 'your-client-secret-here',
        REDIRECT_URI: 'http://localhost',
        REFRESH_TOKEN: 'your-refresh-token-here'
    }
};

// Security measures
const security = {
    sanitizeInput: (input) => {
        return input.replace(/<[^>]*>/g, '');
    },
    validateImagePrompt: (prompt) => {
        return prompt.length <= 1000 && !prompt.match(/[<>]/g);
    }
};

export { config, security }; 