// Authentication Module
class AuthManager {
    constructor() {
        this.apiKey = null;
        this.currentProfile = null;
    }
    
    async init() {
        // Check if already logged in
        this.apiKey = storage.getApiKey();
        this.currentProfile = storage.getCurrentProfile();
        
        return {
            isAuthenticated: !!this.apiKey,
            hasProfile: !!this.currentProfile
        };
    }
    
    // Google OAuth Login
    async loginWithGoogle() {
        try {
            console.log('🔐 [Google Auth] Starting Google Sign-In flow...');
            
            // Initialize and sign in with Google
            const googleUser = await googleAuth.signIn();
            console.log('✅ [Google Auth] Successfully signed in:', googleUser.email);
            
            // Show modal to collect API key
            return new Promise((resolve, reject) => {
                this.showApiKeyModal(googleUser, (apiKey) => {
                    if (apiKey && apiKey.trim()) {
                        this.apiKey = apiKey.trim();
                        storage.setApiKey(this.apiKey);
                        
                        // Create profile with Google account info
                        const profile = {
                            email: googleUser.email,
                            name: googleUser.name,
                            picture: googleUser.picture,
                            loginMethod: 'google',
                            avatar: googleUser.picture || this.getInitials(googleUser.name)
                        };
                        
                        const savedProfile = storage.addProfile(profile);
                        this.currentProfile = savedProfile;
                        storage.setCurrentProfile(savedProfile.id);
                        
                        console.log('✅ [Auth] Profile created for:', googleUser.email);
                        
                        resolve({
                            success: true,
                            profile: savedProfile
                        });
                    } else {
                        reject(new Error('API key is required'));
                    }
                }, reject);
            });
        } catch (error) {
            console.error('❌ [Google Auth] Sign-in failed:', error);
            console.log('💡 [Google Auth] Falling back to simplified method');
            
            // Fallback to manual entry
            return new Promise((resolve, reject) => {
                this.showSimplifiedGoogleModal((email, name, apiKey) => {
                    if (apiKey && apiKey.trim()) {
                        this.apiKey = apiKey.trim();
                        storage.setApiKey(this.apiKey);
                        
                        // Create profile with manual info
                        const profile = {
                            email: email,
                            name: name,
                            loginMethod: 'google',
                            avatar: this.getInitials(name)
                        };
                        
                        const savedProfile = storage.addProfile(profile);
                        this.currentProfile = savedProfile;
                        storage.setCurrentProfile(savedProfile.id);
                        
                        console.log('✅ [Auth] Profile created for:', email);
                        
                        resolve({
                            success: true,
                            profile: savedProfile
                        });
                    } else {
                        reject(new Error('API key is required'));
                    }
                }, reject);
            });
        }
    }
    
    showSimplifiedGoogleModal(onSubmit, onCancel) {
        // Create modal for manual Google-style login
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content glass-panel" style="max-width: 500px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <svg viewBox="0 0 48 48" style="width: 60px; height: 60px; margin-bottom: 10px;">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    <h3 style="margin: 10px 0;">Google Account Setup</h3>
                </div>
                
                <div style="background: rgba(229, 9, 20, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                        Enter your Google account details and Gemini API key to continue.
                    </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Your Name:</label>
                    <input type="text" id="google-name-input" class="input-field" placeholder="John Doe" style="width: 100%; margin-bottom: 15px;">
                    
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Your Email:</label>
                    <input type="email" id="google-email-input" class="input-field" placeholder="you@gmail.com" style="width: 100%; margin-bottom: 15px;">
                    
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Gemini API Key:</label>
                    <input type="password" id="google-apikey-input" class="input-field" placeholder="AIza..." style="width: 100%; margin-bottom: 10px;">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #e50914; text-decoration: none; font-size: 14px;">
                        → Get your API key from Google AI Studio
                    </a>
                </div>
                
                <div class="modal-actions">
                    <button id="google-simple-cancel-btn" class="btn btn-secondary">Cancel</button>
                    <button id="google-simple-submit-btn" class="btn btn-primary">Continue</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const nameInput = document.getElementById('google-name-input');
        const emailInput = document.getElementById('google-email-input');
        const apiKeyInput = document.getElementById('google-apikey-input');
        const submitBtn = document.getElementById('google-simple-submit-btn');
        const cancelBtn = document.getElementById('google-simple-cancel-btn');
        
        // Focus name input
        setTimeout(() => nameInput.focus(), 100);
        
        // Submit handler
        const submit = () => {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const apiKey = apiKeyInput.value.trim();
            
            if (!name) {
                nameInput.style.borderColor = '#e50914';
                nameInput.focus();
                return;
            }
            
            if (!email) {
                emailInput.style.borderColor = '#e50914';
                emailInput.focus();
                return;
            }
            
            if (!apiKey) {
                apiKeyInput.style.borderColor = '#e50914';
                apiKeyInput.focus();
                return;
            }
            
            document.body.removeChild(modal);
            onSubmit(email, name, apiKey);
        };
        
        submitBtn.addEventListener('click', submit);
        apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            onCancel(new Error('User cancelled'));
        });
    }
    
    showApiKeyModal(googleUser, onSubmit, onCancel) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content glass-panel" style="max-width: 500px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    ${googleUser.picture ? `<img src="${googleUser.picture}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">` : ''}
                    <h3 style="margin: 10px 0;">Welcome, ${googleUser.name}!</h3>
                    <p style="color: #b3b3b3; margin: 0;">${googleUser.email}</p>
                </div>
                
                <div style="background: rgba(229, 9, 20, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                        To use AgentStream, you need a <strong>Gemini API Key</strong> from Google AI Studio.
                    </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Enter your Gemini API Key:</label>
                    <input type="password" id="google-api-key-input" class="input-field" placeholder="AIza..." style="width: 100%; margin-bottom: 10px;">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #e50914; text-decoration: none; font-size: 14px;">
                        → Get your API key from Google AI Studio
                    </a>
                </div>
                
                <div class="modal-actions">
                    <button id="google-cancel-btn" class="btn btn-secondary">Cancel</button>
                    <button id="google-submit-btn" class="btn btn-primary">Continue</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const input = document.getElementById('google-api-key-input');
        const submitBtn = document.getElementById('google-submit-btn');
        const cancelBtn = document.getElementById('google-cancel-btn');
        
        // Focus input
        setTimeout(() => input.focus(), 100);
        
        // Submit handler
        const submit = () => {
            const apiKey = input.value.trim();
            if (apiKey) {
                document.body.removeChild(modal);
                onSubmit(apiKey);
            } else {
                input.style.borderColor = '#e50914';
                input.placeholder = 'API key is required';
            }
        };
        
        submitBtn.addEventListener('click', submit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            onCancel(new Error('User cancelled'));
        });
    }
    
    // Manual API Key Login
    loginWithApiKey(apiKey) {
        if (!apiKey || !apiKey.trim()) {
            throw new Error('API key is required');
        }
        
        this.apiKey = apiKey.trim();
        storage.setApiKey(this.apiKey);
        
        // Create default profile
        const profile = {
            name: 'User',
            loginMethod: 'manual',
            avatar: 'U'
        };
        
        const savedProfile = storage.addProfile(profile);
        this.currentProfile = savedProfile;
        storage.setCurrentProfile(savedProfile.id);
        
        return {
            success: true,
            profile: savedProfile
        };
    }
    
    // Profile Management
    switchProfile(profileId) {
        const profiles = storage.getProfiles();
        const profile = profiles.find(p => p.id === profileId);
        
        if (profile) {
            this.currentProfile = profile;
            storage.setCurrentProfile(profileId);
            return true;
        }
        
        return false;
    }
    
    getCurrentProfile() {
        return this.currentProfile;
    }
    
    getProfiles() {
        return storage.getProfiles();
    }
    
    // Logout
    logout() {
        this.apiKey = null;
        this.currentProfile = null;
        storage.logout();
    }
    
    // Check if authenticated
    isAuthenticated() {
        return !!this.apiKey;
    }
    
    // Get API key
    getApiKey() {
        return this.apiKey;
    }
    
    // Utility
    getInitials(name) {
        if (!name) return 'U';
        const parts = name.split(/[@\s]/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
}

// Create global instance
const auth = new AuthManager();

