// Environment variable loader
async function loadEnvironmentVariables() {
    try {
        const response = await fetch('/.env');
        const text = await response.text();
        const lines = text.split('\n');
        
        const env = {};
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    env[key.trim()] = value.trim();
                }
            }
        });
        
        return env;
    } catch (error) {
        console.error('Error loading environment variables:', error);
        return {};
    }
}

export { loadEnvironmentVariables }; 