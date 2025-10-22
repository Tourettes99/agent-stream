// AgentStream Configuration
const CONFIG = {
    APP_NAME: 'AgentStream',
    VERSION: '1.0.0',
    
    // Gemini API Configuration
    GEMINI_API_BASE: 'https://generativelanguage.googleapis.com/v1beta',
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: '1026434892217-k5bv3o1rj8ts3np3rj0qcb90g3ddpf6f.apps.googleusercontent.com', // Public Client ID for demo
    GOOGLE_SCOPES: 'profile email',
    GOOGLE_REDIRECT_URI: window.location.origin,
    
    // Local Storage Keys
    STORAGE_KEYS: {
        API_KEY: 'agentstream_api_key',
        PROFILES: 'agentstream_profiles',
        CURRENT_PROFILE: 'agentstream_current_profile',
        WORKFLOWS: 'agentstream_workflows',
        SAVED_WORKFLOWS: 'agentstream_saved_workflows',
        FEED_PREFERENCE: 'agentstream_feed_preference',
        WORKFLOW_HISTORY: 'agentstream_workflow_history',
        WELCOME_SHOWN: 'agentstream_welcome_shown'
    },
    
    // Workflow Categories
    CATEGORIES: [
        'Data Analysis',
        'Web Scraping',
        'Automation',
        'Research',
        'Content Creation',
        'Code Generation',
        'Document Processing',
        'API Integration',
        'Machine Learning',
        'Task Management',
        'Communication',
        'File Operations',
        'Database Operations',
        'Security & Privacy',
        'Creative Tools'
    ],
    
    // Common Tools/Libraries for workflows
    TOOLS: [
        'Python',
        'JavaScript',
        'Pandas',
        'NumPy',
        'BeautifulSoup',
        'Selenium',
        'Requests',
        'OpenAI API',
        'Google Search',
        'Wikipedia API',
        'CSV Processing',
        'JSON Parsing',
        'PDF Generation',
        'Email',
        'File System',
        'Database',
        'Web Scraping',
        'Data Visualization',
        'NLP',
        'Computer Vision',
        'Audio Processing',
        'Video Processing'
    ],
    
    // Feed Configuration
    INITIAL_FEED_SIZE: 3, // Number of workflows to generate initially
    BATCH_SIZE: 3, // Number of workflows to generate per scroll batch
    MAX_WORKFLOWS: 30, // Maximum workflows before requiring refresh
    REFRESH_COOLDOWN: 3000, // Cooldown between feed refreshes (ms)
    SCROLL_THRESHOLD: 500, // Pixels from bottom to trigger load
    
    // Timing
    SPLASH_DURATION: 2000,
    TOAST_DURATION: 3000
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

