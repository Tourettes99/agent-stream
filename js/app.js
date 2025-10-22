// Main Application Logic
class AgentStreamApp {
    constructor() {
        this.initialized = false;
        this.lastRefreshTime = 0;
        this.isLoadingMore = false;
        this.scrollListener = null;
    }
    
    async init() {
        console.log('🚀 [AgentStream] Initializing application...');
        console.log('📊 [Progress] 0% - Starting initialization');
        
        // Check if first time user
        const hasSeenWelcome = storage.hasSeenWelcome();
        
        if (!hasSeenWelcome) {
            console.log('👋 [Welcome] First time user detected');
            // Hide splash and show welcome screen
            ui.screens.splash.classList.remove('active');
            // Show welcome screen first time only
            this.showWelcomeScreen();
            this.setupEventListeners();
            this.initialized = true;
            console.log('✅ [Progress] 100% - Welcome screen ready');
            return;
        }
        
        // Show splash screen with progress
        ui.showSplashScreen();
        ui.updateSplashProgress(0, 'Initializing...');
        console.log('📊 [Progress] 10% - Splash screen displayed');
        
        await this.sleep(300);
        
        ui.updateSplashProgress(30, 'Loading storage...');
        console.log('💾 [Storage] Loading local data...');
        console.log('📊 [Progress] 30% - Storage initialized');
        
        await this.sleep(300);
        
        ui.updateSplashProgress(50, 'Checking authentication...');
        console.log('🔐 [Auth] Checking authentication state...');
        
        // Check authentication state
        const authState = await auth.init();
        console.log('📊 [Progress] 60% - Authentication checked');
        
        await this.sleep(300);
        
        ui.updateSplashProgress(80, 'Loading profile...');
        console.log('👤 [Profile] Loading user profile...');
        
        if (authState.isAuthenticated) {
            gemini.setApiKey(auth.getApiKey());
            console.log('✅ [Auth] User authenticated');
            
            if (authState.hasProfile) {
                console.log('✅ [Profile] Profile found');
                ui.updateSplashProgress(100, 'Ready!');
                console.log('📊 [Progress] 100% - Initialization complete');
                
                await this.sleep(500);
                
                // Go directly to app
                await this.loadApp();
            } else {
                console.log('⚠️ [Profile] No profile found');
                ui.updateSplashProgress(100, 'Ready!');
                await this.sleep(500);
                // Show profile selection
                this.showProfileSelection();
            }
        } else {
            console.log('⚠️ [Auth] User not authenticated');
            ui.updateSplashProgress(100, 'Ready!');
            console.log('📊 [Progress] 100% - Redirecting to login');
            await this.sleep(500);
            // Show login screen
            this.showLogin();
        }
        
        this.setupEventListeners();
        this.initialized = true;
        console.log('✅ [AgentStream] Application fully initialized');
    }
    
    setupEventListeners() {
        // Welcome screen button
        const startExploringBtn = document.getElementById('start-exploring-btn');
        if (startExploringBtn) {
            startExploringBtn.addEventListener('click', async () => {
                storage.markWelcomeAsSeen();
                ui.hideWelcomeScreen();
                
                // Show splash screen
                ui.showSplashScreen();
                await this.sleep(CONFIG.SPLASH_DURATION);
                
                // Continue to login
                this.showLogin();
            });
        }
        
        // Login with API key
        const manualLoginBtn = document.getElementById('manual-login-btn');
        const manualApiKeyInput = document.getElementById('manual-api-key');
        
        if (manualLoginBtn) {
            manualLoginBtn.addEventListener('click', () => {
                const apiKey = manualApiKeyInput.value.trim();
                this.handleApiKeyLogin(apiKey);
            });
        }
        
        if (manualApiKeyInput) {
            manualApiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const apiKey = manualApiKeyInput.value.trim();
                    this.handleApiKeyLogin(apiKey);
                }
            });
        }
        
        // Hamburger Menu
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const closeMenuBtn = document.getElementById('close-menu-btn');
        const menuOverlay = document.querySelector('.hamburger-menu-overlay');
        
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => this.openMenu());
        }
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => this.closeMenu());
        }
        
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Menu items
        document.getElementById('menu-switch-profile')?.addEventListener('click', () => {
            this.closeMenu();
            this.showProfileSelection();
        });
        
        document.getElementById('menu-add-profile')?.addEventListener('click', () => {
            this.closeMenu();
            this.showLogin();
        });
        
        document.getElementById('menu-saved-workflows')?.addEventListener('click', () => {
            this.closeMenu();
            this.showSavedWorkflows();
        });
        
        document.getElementById('menu-clear-feed')?.addEventListener('click', () => {
            this.closeMenu();
            this.clearCurrentFeed();
        });
        
        document.getElementById('menu-reset-preferences')?.addEventListener('click', () => {
            this.closeMenu();
            this.resetFeedPreferences();
        });
        
        document.getElementById('menu-about')?.addEventListener('click', () => {
            this.closeMenu();
            this.showAbout();
        });
        
        document.getElementById('menu-logout')?.addEventListener('click', () => {
            this.closeMenu();
            this.handleLogout();
        });
        
        // Profile management
        const addProfileBtn = document.getElementById('add-profile-btn');
        if (addProfileBtn) {
            addProfileBtn.addEventListener('click', () => this.showLogin());
        }
        
        // Header refresh button
        const refreshHeaderBtn = document.getElementById('refresh-header-btn');
        if (refreshHeaderBtn) {
            refreshHeaderBtn.addEventListener('click', () => this.refreshFeed());
        }
        
        // Feed actions
        const refreshFeedBtn = document.getElementById('refresh-feed-btn');
        if (refreshFeedBtn) {
            refreshFeedBtn.addEventListener('click', () => this.refreshFeed());
        }
        
        // Preference modal
        const useSavedBtn = document.getElementById('use-saved-btn');
        const keepStockBtn = document.getElementById('keep-stock-btn');
        
        if (useSavedBtn) {
            useSavedBtn.addEventListener('click', () => {
                storage.setFeedPreference('personalized');
                ui.hidePreferenceModal();
                this.refreshFeed();
            });
        }
        
        if (keepStockBtn) {
            keepStockBtn.addEventListener('click', () => {
                ui.hidePreferenceModal();
            });
        }
        
        // Execution modal
        const closeExecutionBtn = document.getElementById('close-execution-btn');
        const runWorkflowBtn = document.getElementById('run-workflow-btn');
        const stopWorkflowBtn = document.getElementById('stop-workflow-btn');
        
        if (closeExecutionBtn) {
            closeExecutionBtn.addEventListener('click', () => ui.hideWorkflowExecution());
        }
        
        if (runWorkflowBtn) {
            runWorkflowBtn.addEventListener('click', () => {
                if (ui.currentExecutingWorkflow) {
                    ui.runWorkflow(ui.currentExecutingWorkflow);
                }
            });
        }
        
        if (stopWorkflowBtn) {
            stopWorkflowBtn.addEventListener('click', () => {
                // Stop workflow execution (would need abort controller in real implementation)
                ui.showToast('Workflow stopped', 'info');
            });
        }
        
        // Saved workflows modal
        const closeSavedWorkflowsBtn = document.getElementById('close-saved-workflows-btn');
        if (closeSavedWorkflowsBtn) {
            closeSavedWorkflowsBtn.addEventListener('click', () => {
                const modal = document.getElementById('saved-workflows-modal');
                if (modal) modal.classList.remove('active');
            });
        }
        
        // File viewer modal
        const closeFileViewerBtn = document.getElementById('close-file-viewer-btn');
        if (closeFileViewerBtn) {
            closeFileViewerBtn.addEventListener('click', () => {
                const modal = document.getElementById('file-viewer-modal');
                if (modal) modal.classList.remove('active');
            });
        }
        
        // File viewer controls
        const fileTypeSelector = document.getElementById('file-type-selector');
        if (fileTypeSelector) {
            fileTypeSelector.addEventListener('change', (e) => {
                if (ui.currentFileContent) {
                    ui.renderFileContent(ui.currentFileContent, e.target.value);
                }
            });
        }
        
        const formatBtn = document.getElementById('format-output-btn');
        if (formatBtn) {
            formatBtn.addEventListener('click', () => {
                const selector = document.getElementById('file-type-selector');
                if (selector && selector.value === 'json' && ui.currentFileContent) {
                    try {
                        const parsed = JSON.parse(ui.currentFileContent);
                        ui.currentFileContent = JSON.stringify(parsed, null, 2);
                        ui.renderFileContent(ui.currentFileContent, 'json');
                        ui.showToast('JSON formatted!', 'success');
                    } catch (e) {
                        ui.showToast('Not valid JSON', 'error');
                    }
                }
            });
        }
        
        const copyViewerBtn = document.getElementById('copy-viewer-btn');
        if (copyViewerBtn) {
            copyViewerBtn.addEventListener('click', () => {
                if (ui.currentFileContent) {
                    navigator.clipboard.writeText(ui.currentFileContent).then(() => {
                        ui.showToast('Content copied to clipboard!', 'success');
                    }).catch(() => {
                        ui.showToast('Failed to copy', 'error');
                    });
                }
            });
        }
        
        const fullscreenBtn = document.getElementById('fullscreen-viewer-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                const panel = document.querySelector('.file-viewer-panel');
                if (panel) {
                    panel.classList.toggle('fullscreen');
                }
            });
        }
        
        // Profile selection handler
        ui.onProfileSelect = (profileId) => {
            auth.switchProfile(profileId);
            this.loadApp();
        };
        
        // Profile deletion handler
        ui.onProfileDelete = (profileId, profileName) => {
            this.handleProfileDelete(profileId, profileName);
        };
    }
    
    showWelcomeScreen() {
        ui.showWelcomeScreen();
    }
    
    showLogin() {
        ui.showScreen('login');
    }
    
    showProfileSelection() {
        const profiles = auth.getProfiles();
        ui.renderProfiles(profiles);
        ui.showScreen('profile');
    }
    
    async handleApiKeyLogin(apiKey) {
        if (!apiKey) {
            ui.showToast('Please enter an API key', 'error');
            const input = document.getElementById('manual-api-key');
            if (input) {
                input.style.borderColor = 'var(--accent-red)';
                input.focus();
            }
            return;
        }
        
        console.log('🔐 [Auth] Starting API key login...');
        
        try {
            const result = auth.loginWithApiKey(apiKey);
            
            if (result.success) {
                gemini.setApiKey(auth.getApiKey());
                console.log('✅ [Auth] Login successful');
                ui.showToast('Successfully logged in!', 'success');
                await this.loadApp();
            }
        } catch (error) {
            console.error('❌ [Auth] Login failed:', error);
            ui.showToast('Login failed: ' + error.message, 'error');
        }
    }
    
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            auth.logout();
            ui.showToast('Logged out successfully', 'info');
            this.showLogin();
        }
    }
    
    handleProfileDelete(profileId, profileName) {
        // Show confirmation modal
        this.showDeleteConfirmation(profileName, () => {
            console.log(`🗑️ [Profile] Deleting profile: ${profileName}`);
            
            // Delete the profile
            const remainingProfiles = storage.deleteProfile(profileId);
            
            console.log(`✅ [Profile] Profile deleted. Remaining profiles: ${remainingProfiles.length}`);
            
            // Show success message
            ui.showToast(`Profile "${profileName}" deleted`, 'success');
            
            // If no profiles left, go to login
            if (remainingProfiles.length === 0) {
                console.log('⚠️ [Profile] No profiles remaining, returning to login');
                auth.logout();
                this.showLogin();
            } else {
                // Refresh profile list
                ui.renderProfiles(remainingProfiles);
            }
        });
    }
    
    showDeleteConfirmation(profileName, onConfirm) {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content glass-panel" style="max-width: 450px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <svg viewBox="0 0 24 24" width="60" height="60" style="color: var(--accent-red);">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    <h3 style="margin: 15px 0 10px;">Delete Profile?</h3>
                </div>
                
                <div style="background: rgba(229, 9, 20, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
                        Are you sure you want to delete the profile <strong style="color: var(--text-primary);">"${profileName}"</strong>?
                    </p>
                    <p style="margin: 10px 0 0; font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
                        This will permanently delete:
                    </p>
                    <ul style="margin: 10px 0 0 20px; font-size: 14px; color: var(--text-secondary);">
                        <li>Saved API key</li>
                        <li>Saved workflows</li>
                        <li>Workflow history</li>
                        <li>Feed preferences</li>
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button id="cancel-delete-btn" class="btn btn-secondary">Cancel</button>
                    <button id="confirm-delete-btn" class="btn btn-danger">Delete Profile</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const confirmBtn = document.getElementById('confirm-delete-btn');
        const cancelBtn = document.getElementById('cancel-delete-btn');
        
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            onConfirm();
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    async loadApp() {
        ui.showScreen('app');
        
        // Update menu with current profile info
        this.updateMenuProfile();
        
        // Check if should show preference modal
        const savedWorkflows = storage.getSavedWorkflows();
        const preference = storage.getFeedPreference();
        
        if (savedWorkflows.length > 0 && preference === 'stock') {
            ui.showPreferenceModal();
        }
        
        // Setup infinite scroll
        this.setupInfiniteScroll();
        
        // Load initial feed
        await this.loadInitialFeed();
    }
    
    openMenu() {
        const menu = document.getElementById('hamburger-menu');
        if (menu) {
            menu.classList.add('active');
            console.log('📱 [Menu] Hamburger menu opened');
        }
    }
    
    closeMenu() {
        const menu = document.getElementById('hamburger-menu');
        if (menu) {
            menu.classList.remove('active');
            console.log('📱 [Menu] Hamburger menu closed');
        }
    }
    
    updateMenuProfile() {
        const profile = auth.getCurrentProfile();
        if (!profile) return;
        
        const avatarEl = document.querySelector('.profile-avatar-small');
        const nameEl = document.querySelector('.profile-name-small');
        const emailEl = document.querySelector('.profile-email-small');
        
        if (avatarEl) {
            avatarEl.textContent = profile.avatar || profile.name.substring(0, 2).toUpperCase();
        }
        
        if (nameEl) {
            nameEl.textContent = profile.name || 'User';
        }
        
        if (emailEl) {
            emailEl.textContent = profile.email || 'No email';
        }
        
        // Update saved workflows count badge
        const savedWorkflows = storage.getSavedWorkflows();
        const badge = document.getElementById('saved-count-badge');
        if (badge) {
            badge.textContent = savedWorkflows.length;
        }
    }
    
    showSavedWorkflows() {
        console.log('📚 [Saved] Opening saved workflows');
        
        const savedWorkflows = storage.getSavedWorkflows();
        const modal = document.getElementById('saved-workflows-modal');
        const content = document.getElementById('saved-workflows-content');
        
        if (!modal || !content) return;
        
        if (savedWorkflows.length === 0) {
            content.innerHTML = `
                <div class="saved-workflows-empty">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
                    </svg>
                    <h4>No Saved Workflows</h4>
                    <p>Tap "Use Workflow" on any workflow in the feed to save it here.</p>
                </div>
            `;
        } else {
            const grid = document.createElement('div');
            grid.className = 'saved-workflows-grid';
            
            savedWorkflows.forEach(workflow => {
                const card = this.createSavedWorkflowCard(workflow);
                grid.appendChild(card);
            });
            
            content.innerHTML = '';
            content.appendChild(grid);
        }
        
        modal.classList.add('active');
    }
    
    createSavedWorkflowCard(workflow) {
        const card = document.createElement('div');
        card.className = 'saved-workflow-card';
        
        const savedDate = workflow.savedAt ? new Date(workflow.savedAt).toLocaleDateString() : 'Unknown';
        
        card.innerHTML = `
            <div class="saved-workflow-header">
                <span class="saved-workflow-category">${workflow.category}</span>
                <h4 class="saved-workflow-title">${workflow.title}</h4>
            </div>
            <p class="saved-workflow-description">${workflow.description}</p>
            <p class="saved-workflow-meta">Saved on ${savedDate}</p>
            <div class="saved-workflow-actions">
                <button class="btn btn-primary btn-run-saved" data-workflow-id="${workflow.id}">
                    Run
                </button>
                <button class="btn btn-unsave" data-workflow-id="${workflow.id}">
                    Unsave
                </button>
            </div>
        `;
        
        // Run button handler
        const runBtn = card.querySelector('.btn-run-saved');
        runBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = document.getElementById('saved-workflows-modal');
            if (modal) modal.classList.remove('active');
            ui.showWorkflowExecution(workflow);
        });
        
        // Unsave button handler
        const unsaveBtn = card.querySelector('.btn-unsave');
        unsaveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Unsave "${workflow.title}"?`)) {
                console.log(`🗑️ [Saved] Unsaving workflow: ${workflow.title}`);
                storage.unsaveWorkflow(workflow.id);
                ui.showToast('Workflow unsaved', 'success');
                this.showSavedWorkflows(); // Refresh the list
                this.updateMenuProfile(); // Update badge count
            }
        });
        
        // Card click to view details
        card.addEventListener('click', () => {
            const modal = document.getElementById('saved-workflows-modal');
            if (modal) modal.classList.remove('active');
            ui.showWorkflowExecution(workflow);
        });
        
        return card;
    }
    
    clearCurrentFeed() {
        if (confirm('Clear all workflows from the current feed?')) {
            console.log('🗑️ [Feed] Clearing current feed');
            workflowManager.resetFeed();
            ui.clearFeed();
            ui.showToast('Feed cleared', 'success');
            this.loadInitialFeed();
        }
    }
    
    resetFeedPreferences() {
        if (confirm('Reset feed to stock mode? This will stop personalizing based on saved workflows.')) {
            console.log('🔄 [Preferences] Resetting feed preferences');
            storage.setFeedPreference('stock');
            ui.showToast('Feed preferences reset to stock mode', 'success');
            this.refreshFeed();
        }
    }
    
    showAbout() {
        // Create about modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content glass-panel" style="max-width: 500px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <svg viewBox="0 0 200 200" width="80" height="80" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 15px;">
                        <defs>
                            <linearGradient id="aboutLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#b20710;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#aboutLogo)" stroke-width="4"/>
                        <path d="M 100 40 L 100 160 M 60 100 L 140 100" stroke="url(#aboutLogo)" stroke-width="4" stroke-linecap="round"/>
                        <circle cx="100" cy="100" r="15" fill="url(#aboutLogo)"/>
                    </svg>
                    <h2 style="margin: 0;">AgentStream</h2>
                    <p style="color: var(--text-secondary); margin: 5px 0;">Version 1.0.0</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="line-height: 1.8; color: var(--text-secondary);">
                        AgentStream is a personalized AI workflow discovery platform powered by <strong style="color: var(--text-primary);">Gemini 2.0 Flash</strong>.
                    </p>
                    <p style="line-height: 1.8; color: var(--text-secondary); margin-top: 15px;">
                        Discover, save, and execute intelligent workflows that adapt to your preferences over time.
                    </p>
                </div>
                
                <div style="background: rgba(229, 9, 20, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">
                        <strong style="color: var(--text-primary);">Created for:</strong> Rabbit R1<br>
                        <strong style="color: var(--text-primary);">Powered by:</strong> Google Gemini AI<br>
                        <strong style="color: var(--text-primary);">Design:</strong> Netflix-inspired UI
                    </p>
                </div>
                
                <div class="modal-actions">
                    <button id="close-about-btn" class="btn btn-primary" style="width: 100%;">Got it</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = document.getElementById('close-about-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    setupInfiniteScroll() {
        // Remove old listener if exists
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
        }
        
        // Create scroll listener
        this.scrollListener = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - CONFIG.SCROLL_THRESHOLD;
            
            if (scrollPosition >= threshold && !this.isLoadingMore) {
                this.loadMoreWorkflows();
            }
        };
        
        window.addEventListener('scroll', this.scrollListener);
    }
    
    async loadInitialFeed() {
        try {
            console.log('🔄 [Feed] Starting initial feed load...');
            console.log('📊 [Feed Progress] 0% - Preparing feed');
            
            ui.showLoading();
            ui.updateLoadingProgress(0, 'Preparing feed...');
            
            // Reset feed
            workflowManager.resetFeed();
            ui.clearFeed();
            
            console.log('📊 [Feed Progress] 20% - Feed cleared');
            ui.updateLoadingProgress(20, 'Connecting to AI...');
            
            const preference = storage.getFeedPreference();
            const personalized = preference === 'personalized';
            
            console.log(`🎯 [Feed] Mode: ${personalized ? 'Personalized' : 'Stock'}`);
            console.log('📊 [Feed Progress] 40% - Generating workflows...');
            ui.updateLoadingProgress(40, 'Generating workflows...');
            
            // Generate initial batch (fast!)
            const workflows = await workflowManager.generateWorkflows(
                CONFIG.INITIAL_FEED_SIZE,
                personalized,
                (progress) => {
                    const percent = 40 + Math.floor(progress * 50);
                    console.log(`📊 [Feed Progress] ${percent}% - AI generating...`);
                    ui.updateLoadingProgress(percent, `Generating workflows... ${Math.floor(progress * 100)}%`);
                }
            );
            
            console.log(`✅ [Feed] Generated ${workflows.length} workflows`);
            console.log('📊 [Feed Progress] 90% - Rendering feed...');
            ui.updateLoadingProgress(90, 'Rendering feed...');
            
            ui.updateFeedTitle(personalized);
            ui.renderWorkflows(workflows);
            
            console.log('📊 [Feed Progress] 100% - Feed ready!');
            ui.updateLoadingProgress(100, 'Complete!');
            
            await this.sleep(300);
            ui.hideLoading();
            
        } catch (error) {
            ui.hideLoading();
            ui.showToast('Failed to load workflows: ' + error.message, 'error');
            console.error('Feed load error:', error);
            
            // Show fallback workflows
            const fallbackWorkflows = workflowManager.getFallbackWorkflows();
            fallbackWorkflows.forEach(w => w.id = storage.generateId());
            ui.renderWorkflows(fallbackWorkflows);
        }
    }
    
    async loadMoreWorkflows() {
        if (!workflowManager.canLoadMore() || this.isLoadingMore) {
            return;
        }
        
        this.isLoadingMore = true;
        console.log('📜 [Scroll] Loading more workflows...');
        console.log('📊 [Scroll Progress] 0% - Starting batch generation');
        
        try {
            ui.showLoadingMore();
            ui.updateLoadingProgress(0, 'Loading more...');
            
            const preference = storage.getFeedPreference();
            const personalized = preference === 'personalized';
            
            console.log('📊 [Scroll Progress] 30% - Generating workflows...');
            ui.updateLoadingProgress(30, 'Generating...');
            
            // Generate next batch
            const newWorkflows = await workflowManager.generateWorkflows(
                CONFIG.BATCH_SIZE,
                personalized,
                (progress) => {
                    const percent = 30 + Math.floor(progress * 60);
                    console.log(`📊 [Scroll Progress] ${percent}%`);
                    ui.updateLoadingProgress(percent, `Generating... ${Math.floor(progress * 100)}%`);
                }
            );
            
            console.log(`✅ [Scroll] Generated ${newWorkflows.length} more workflows`);
            console.log('📊 [Scroll Progress] 90% - Adding to feed...');
            ui.updateLoadingProgress(90, 'Adding to feed...');
            
            // Append to feed
            ui.appendWorkflows(newWorkflows);
            
            console.log('📊 [Scroll Progress] 100% - Complete!');
            ui.updateLoadingProgress(100, 'Complete!');
            
            await this.sleep(300);
            ui.hideLoadingMore();
            
            this.isLoadingMore = false;
            
        } catch (error) {
            ui.hideLoadingMore();
            ui.showToast('Failed to load more workflows', 'error');
            console.error('❌ [Scroll] Load more error:', error);
            this.isLoadingMore = false;
        }
    }
    
    async refreshFeed() {
        // Check cooldown
        const now = Date.now();
        if (now - this.lastRefreshTime < CONFIG.REFRESH_COOLDOWN) {
            ui.showToast('Please wait before refreshing again', 'info');
            return;
        }
        
        this.lastRefreshTime = now;
        
        // Clear feed and reload
        await this.loadInitialFeed();
        ui.showToast('Feed refreshed!', 'success');
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new AgentStreamApp();
        app.init();
    });
} else {
    const app = new AgentStreamApp();
    app.init();
}

