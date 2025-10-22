// Google OAuth Integration
class GoogleAuthHelper {
    constructor() {
        this.isInitialized = false;
        this.user = null;
    }
    
    async init() {
        // Load Google Identity Services library
        return new Promise((resolve, reject) => {
            if (window.google?.accounts) {
                this.isInitialized = true;
                resolve(true);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                this.isInitialized = true;
                resolve(true);
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google Sign-In'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async signIn() {
        if (!this.isInitialized) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            try {
                // Initialize Google Sign-In with One Tap
                window.google.accounts.id.initialize({
                    client_id: CONFIG.GOOGLE_CLIENT_ID,
                    callback: async (response) => {
                        try {
                            // Decode JWT token to get user info
                            const userInfo = this.parseJwt(response.credential);
                            
                            this.user = {
                                id: userInfo.sub,
                                email: userInfo.email,
                                name: userInfo.name,
                                picture: userInfo.picture,
                                emailVerified: userInfo.email_verified
                            };
                            
                            console.log('✅ [Google Auth] User signed in:', this.user.email);
                            resolve(this.user);
                        } catch (error) {
                            console.error('❌ [Google Auth] Failed to parse user info:', error);
                            reject(error);
                        }
                    }
                });
                
                // Show the One Tap prompt
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // One Tap didn't show, fall back to button
                        console.log('⚠️ [Google Auth] One Tap not available, showing popup');
                        this.showPopupSignIn(resolve, reject);
                    }
                });
            } catch (error) {
                console.error('❌ [Google Auth] Sign-in error:', error);
                reject(error);
            }
        });
    }
    
    showPopupSignIn(resolve, reject) {
        // Create a temporary container for the Google button
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '10001';
        container.style.background = 'rgba(0, 0, 0, 0.9)';
        container.style.padding = '40px';
        container.style.borderRadius = '12px';
        container.style.backdropFilter = 'blur(20px)';
        
        const title = document.createElement('h3');
        title.textContent = 'Sign in with Google';
        title.style.color = '#fff';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        container.appendChild(title);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'google-signin-button-temp';
        container.appendChild(buttonContainer);
        
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '10000';
        
        document.body.appendChild(overlay);
        document.body.appendChild(container);
        
        // Render Google Sign-In button
        window.google.accounts.id.renderButton(
            buttonContainer,
            {
                theme: 'filled_black',
                size: 'large',
                text: 'signin_with',
                width: 300
            }
        );
        
        // Clean up function
        const cleanup = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(container);
        };
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            cleanup();
            reject(new Error('Sign-in cancelled'));
        });
        
        // Override callback to cleanup after sign-in
        const originalCallback = window.google.accounts.id.initialize;
        window.google.accounts.id.initialize({
            client_id: CONFIG.GOOGLE_CLIENT_ID,
            callback: async (response) => {
                cleanup();
                try {
                    const userInfo = this.parseJwt(response.credential);
                    this.user = {
                        id: userInfo.sub,
                        email: userInfo.email,
                        name: userInfo.name,
                        picture: userInfo.picture,
                        emailVerified: userInfo.email_verified
                    };
                    console.log('✅ [Google Auth] User signed in:', this.user.email);
                    resolve(this.user);
                } catch (error) {
                    console.error('❌ [Google Auth] Failed to parse user info:', error);
                    reject(error);
                }
            }
        });
    }
    
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to parse JWT:', error);
            throw error;
        }
    }
    
    getUser() {
        return this.user;
    }
    
    isSignedIn() {
        return !!this.user;
    }
}

// Create global instance
const googleAuth = new GoogleAuthHelper();

