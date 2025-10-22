// Local Storage Management
class StorageManager {
    constructor() {
        this.initialized = false;
        this.init();
    }
    
    init() {
        // Initialize storage structure if not exists
        if (!this.get(CONFIG.STORAGE_KEYS.PROFILES)) {
            this.set(CONFIG.STORAGE_KEYS.PROFILES, []);
        }
        if (!this.get(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS)) {
            this.set(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS, {});
        }
        if (!this.get(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY)) {
            this.set(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY, {});
        }
        this.initialized = true;
    }
    
    // Generic storage operations
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
    
    get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    }
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
    
    // API Key Management
    setApiKey(apiKey) {
        return this.set(CONFIG.STORAGE_KEYS.API_KEY, apiKey);
    }
    
    getApiKey() {
        return this.get(CONFIG.STORAGE_KEYS.API_KEY);
    }
    
    // Profile Management
    getProfiles() {
        return this.get(CONFIG.STORAGE_KEYS.PROFILES) || [];
    }
    
    addProfile(profile) {
        const profiles = this.getProfiles();
        profile.id = this.generateId();
        profile.createdAt = Date.now();
        profiles.push(profile);
        this.set(CONFIG.STORAGE_KEYS.PROFILES, profiles);
        return profile;
    }
    
    getCurrentProfile() {
        const profileId = this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        if (!profileId) return null;
        
        const profiles = this.getProfiles();
        return profiles.find(p => p.id === profileId) || null;
    }
    
    setCurrentProfile(profileId) {
        return this.set(CONFIG.STORAGE_KEYS.CURRENT_PROFILE, profileId);
    }
    
    deleteProfile(profileId) {
        // Get all profiles
        const profiles = this.getProfiles();
        
        // Remove the profile
        const updatedProfiles = profiles.filter(p => p.id !== profileId);
        this.set(CONFIG.STORAGE_KEYS.PROFILES, updatedProfiles);
        
        // Clear all data for this profile
        this.clearProfileData(profileId);
        
        // If this was the current profile, clear it
        const currentProfileId = this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        if (currentProfileId === profileId) {
            this.remove(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        }
        
        // If no profiles left, clear API key too
        if (updatedProfiles.length === 0) {
            this.remove(CONFIG.STORAGE_KEYS.API_KEY);
        }
        
        return updatedProfiles;
    }
    
    // Workflow Management
    getSavedWorkflows(profileId = null) {
        const savedWorkflows = this.get(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        return savedWorkflows[pid] || [];
    }
    
    saveWorkflow(workflow, profileId = null) {
        const savedWorkflows = this.get(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        
        if (!savedWorkflows[pid]) {
            savedWorkflows[pid] = [];
        }
        
        // Add metadata
        workflow.savedAt = Date.now();
        workflow.id = workflow.id || this.generateId();
        
        // Check if already saved
        const exists = savedWorkflows[pid].find(w => w.id === workflow.id);
        if (!exists) {
            savedWorkflows[pid].push(workflow);
            this.set(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS, savedWorkflows);
        }
        
        return workflow;
    }
    
    unsaveWorkflow(workflowId, profileId = null) {
        const savedWorkflows = this.get(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        
        if (savedWorkflows[pid]) {
            savedWorkflows[pid] = savedWorkflows[pid].filter(w => w.id !== workflowId);
            this.set(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS, savedWorkflows);
        }
    }
    
    isWorkflowSaved(workflowId, profileId = null) {
        const savedWorkflows = this.getSavedWorkflows(profileId);
        return savedWorkflows.some(w => w.id === workflowId);
    }
    
    // Workflow History
    addToHistory(workflow, profileId = null) {
        const history = this.get(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        
        if (!history[pid]) {
            history[pid] = [];
        }
        
        history[pid].unshift({
            ...workflow,
            executedAt: Date.now()
        });
        
        // Keep only last 100 executions
        if (history[pid].length > 100) {
            history[pid] = history[pid].slice(0, 100);
        }
        
        this.set(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY, history);
    }
    
    getHistory(profileId = null) {
        const history = this.get(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        return history[pid] || [];
    }
    
    // Feed Preference
    getFeedPreference(profileId = null) {
        const preferences = this.get(CONFIG.STORAGE_KEYS.FEED_PREFERENCE) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        return preferences[pid] || 'stock'; // 'stock' or 'personalized'
    }
    
    setFeedPreference(preference, profileId = null) {
        const preferences = this.get(CONFIG.STORAGE_KEYS.FEED_PREFERENCE) || {};
        const pid = profileId || this.get(CONFIG.STORAGE_KEYS.CURRENT_PROFILE);
        preferences[pid] = preference;
        return this.set(CONFIG.STORAGE_KEYS.FEED_PREFERENCE, preferences);
    }
    
    // Utility
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Clear all data for a profile
    clearProfileData(profileId) {
        const savedWorkflows = this.get(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS) || {};
        const history = this.get(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY) || {};
        const preferences = this.get(CONFIG.STORAGE_KEYS.FEED_PREFERENCE) || {};
        
        delete savedWorkflows[profileId];
        delete history[profileId];
        delete preferences[profileId];
        
        this.set(CONFIG.STORAGE_KEYS.SAVED_WORKFLOWS, savedWorkflows);
        this.set(CONFIG.STORAGE_KEYS.WORKFLOW_HISTORY, history);
        this.set(CONFIG.STORAGE_KEYS.FEED_PREFERENCE, preferences);
    }
    
    // Welcome screen tracking
    hasSeenWelcome() {
        return this.get(CONFIG.STORAGE_KEYS.WELCOME_SHOWN) === true;
    }
    
    markWelcomeAsSeen() {
        return this.set(CONFIG.STORAGE_KEYS.WELCOME_SHOWN, true);
    }
    
    // Complete logout
    logout() {
        const keys = Object.values(CONFIG.STORAGE_KEYS);
        // Keep welcome_shown even after logout
        const welcomeShown = this.get(CONFIG.STORAGE_KEYS.WELCOME_SHOWN);
        keys.forEach(key => this.remove(key));
        if (welcomeShown) {
            this.set(CONFIG.STORAGE_KEYS.WELCOME_SHOWN, welcomeShown);
        }
        this.init();
    }
}

// Create global instance
const storage = new StorageManager();

