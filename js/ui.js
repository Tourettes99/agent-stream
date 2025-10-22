// UI Management
class UIManager {
    constructor() {
        this.screens = {
            splash: document.getElementById('splash-screen'),
            login: document.getElementById('login-screen'),
            profile: document.getElementById('profile-screen'),
            app: document.getElementById('app-screen')
        };
        
        this.elements = {
            workflowFeed: document.getElementById('workflow-feed'),
            loadingIndicator: document.getElementById('loading-indicator'),
            feedTitle: document.getElementById('feed-title'),
            profileList: document.getElementById('profile-list'),
            executionModal: document.getElementById('execution-modal'),
            executionTitle: document.getElementById('execution-title'),
            executionContent: document.getElementById('execution-content'),
            executionActions: document.getElementById('execution-actions'),
            preferenceModal: document.getElementById('preference-modal'),
            welcomeModal: document.getElementById('welcome-modal'),
            toastContainer: document.getElementById('toast-container')
        };
        
        this.currentScreen = null;
    }
    
    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }
    
    showSplashScreen() {
        this.screens.splash.classList.add('active');
    }
    
    updateSplashProgress(percent, message = '') {
        const progressBar = document.getElementById('splash-progress-bar');
        const progressText = document.getElementById('splash-progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (progressText) {
            progressText.textContent = message ? `${message} ${percent}%` : `Loading... ${percent}%`;
        }
    }
    
    // Profile UI
    renderProfiles(profiles) {
        if (!this.elements.profileList) return;
        
        this.elements.profileList.innerHTML = '';
        
        profiles.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'profile-card';
            card.innerHTML = `
                <button class="profile-delete-btn" data-profile-id="${profile.id}" title="Delete profile">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
                <div class="profile-avatar">${profile.avatar || profile.name.substring(0, 2).toUpperCase()}</div>
                <div class="profile-name">${profile.name}</div>
            `;
            
            // Profile selection handler
            card.addEventListener('click', (e) => {
                // Don't select if clicking delete button
                if (!e.target.closest('.profile-delete-btn')) {
                    this.onProfileSelect(profile.id);
                }
            });
            
            // Delete button handler
            const deleteBtn = card.querySelector('.profile-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onProfileDelete(profile.id, profile.name);
            });
            
            this.elements.profileList.appendChild(card);
        });
    }
    
    // Workflow Feed UI
    renderWorkflows(workflows) {
        if (!this.elements.workflowFeed) return;
        
        this.elements.workflowFeed.innerHTML = '';
        
        workflows.forEach(workflow => {
            const card = this.createWorkflowCard(workflow);
            this.elements.workflowFeed.appendChild(card);
        });
    }
    
    createWorkflowCard(workflow) {
        const card = document.createElement('div');
        card.className = 'workflow-card';
        
        const isSaved = storage.isWorkflowSaved(workflow.id);
        
        card.innerHTML = `
            <div class="workflow-header">
                <span class="workflow-category">${workflow.category}</span>
                <h3 class="workflow-title">${workflow.title}</h3>
            </div>
            <p class="workflow-description">${workflow.description}</p>
            <div class="workflow-tools">
                ${workflow.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
            </div>
            <div class="workflow-actions">
                <button class="btn-use ${isSaved ? 'saved' : ''}" data-workflow-id="${workflow.id}">
                    ${isSaved ? '✓ Saved' : 'Use Workflow'}
                </button>
            </div>
        `;
        
        // Add click handler to view/execute
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-use')) {
                this.showWorkflowExecution(workflow);
            }
        });
        
        // Add save/use handler
        const useBtn = card.querySelector('.btn-use');
        useBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSaveWorkflow(workflow, useBtn);
        });
        
        return card;
    }
    
    toggleSaveWorkflow(workflow, button) {
        const isSaved = storage.isWorkflowSaved(workflow.id);
        
        if (isSaved) {
            storage.unsaveWorkflow(workflow.id);
            button.classList.remove('saved');
            button.textContent = 'Use Workflow';
            this.showToast('Workflow removed from saved', 'info');
        } else {
            storage.saveWorkflow(workflow);
            button.classList.add('saved');
            button.textContent = '✓ Saved';
            this.showToast('Workflow saved!', 'success');
        }
    }
    
    // Workflow Execution UI
    showWorkflowExecution(workflow) {
        if (!this.elements.executionModal) return;
        
        this.elements.executionTitle.textContent = workflow.title;
        this.elements.executionContent.innerHTML = `
            <div class="workflow-details">
                <p><strong>Category:</strong> ${workflow.category}</p>
                <p><strong>Description:</strong> ${workflow.description}</p>
                <p><strong>Estimated Time:</strong> ${workflow.estimatedTime}</p>
                <p><strong>Difficulty:</strong> ${workflow.difficulty}</p>
                
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Tools & Technologies:</h4>
                <div class="workflow-tools">
                    ${workflow.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
                </div>
                
                <h4 style="margin-top: 20px; margin-bottom: 10px;">Execution Steps:</h4>
                <div class="execution-steps">
                    ${workflow.steps.map((step, i) => `
                        <div class="execution-step pending" data-step="${i}">
                            <strong>Step ${i + 1}:</strong> ${step}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.elements.executionModal.classList.add('active');
        this.currentExecutingWorkflow = workflow;
    }
    
    hideWorkflowExecution() {
        if (this.elements.executionModal) {
            this.elements.executionModal.classList.remove('active');
        }
        this.currentExecutingWorkflow = null;
    }
    
    async runWorkflow(workflow) {
        const runBtn = document.getElementById('run-workflow-btn');
        const stopBtn = document.getElementById('stop-workflow-btn');
        
        runBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        
        try {
            const result = await workflowManager.executeWorkflow(workflow, (progress) => {
                this.updateExecutionProgress(progress);
            });
            
            // Show completion state with final results
            this.showExecutionComplete(result);
            
            this.showToast('Workflow completed successfully!', 'success');
            
            // Automatically save completed workflow
            if (!storage.isWorkflowSaved(workflow.id)) {
                storage.saveWorkflow(workflow);
            }
            
        } catch (error) {
            this.showToast('Workflow execution failed: ' + error.message, 'error');
            console.error('Execution error:', error);
        } finally {
            runBtn.style.display = 'block';
            stopBtn.style.display = 'none';
        }
    }
    
    showExecutionComplete(result) {
        const detailsDiv = this.elements.executionContent.querySelector('.workflow-details');
        
        if (detailsDiv) {
            // Find or create results section
            let resultsDiv = this.elements.executionContent.querySelector('.execution-results');
            
            if (!resultsDiv) {
                resultsDiv = document.createElement('div');
                resultsDiv.className = 'execution-results';
                detailsDiv.appendChild(resultsDiv);
            }
            
            // Update with final results and actions
            resultsDiv.innerHTML = `
                <div class="results-header">
                    <h4>✅ Execution Complete</h4>
                    <div class="results-actions">
                        <button id="copy-results-btn" class="btn-icon-small" title="Copy results">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                        </button>
                        <button id="download-results-btn" class="btn-icon-small" title="View in Runner">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="results-content-final">
                    <pre id="final-results-text">${result.results}</pre>
                </div>
                <div class="results-footer">
                    <small>Completed: ${new Date(result.completedAt).toLocaleString()}</small>
                </div>
            `;
            
            // Add copy button handler
            const copyBtn = document.getElementById('copy-results-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(result.results).then(() => {
                        this.showToast('Results copied to clipboard!', 'success');
                    }).catch(() => {
                        this.showToast('Failed to copy results', 'error');
                    });
                });
            }
            
            // Add view in runner button handler
            const downloadBtn = document.getElementById('download-results-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    this.openFileViewer(result.results, result.workflow.title);
                });
            }
            
            // Mark all steps as completed
            const steps = this.elements.executionContent.querySelectorAll('.execution-step');
            steps.forEach(step => {
                step.classList.remove('pending', 'running');
                step.classList.add('completed');
            });
            
            // Scroll to results
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    updateExecutionProgress(progress) {
        const { currentStep, content, status } = progress;
        
        // Update execution content with streaming results
        const detailsDiv = this.elements.executionContent.querySelector('.workflow-details');
        
        if (detailsDiv) {
            // Add or update results section
            let resultsDiv = this.elements.executionContent.querySelector('.execution-results');
            
            if (!resultsDiv) {
                resultsDiv = document.createElement('div');
                resultsDiv.className = 'execution-results';
                resultsDiv.innerHTML = '<h4>Execution Progress:</h4><div class="results-content"></div>';
                detailsDiv.appendChild(resultsDiv);
            }
            
            const resultsContent = resultsDiv.querySelector('.results-content');
            resultsContent.innerHTML = `<pre style="white-space: pre-wrap; font-size: 14px;">${content}</pre>`;
            
            // Update step status
            const steps = this.elements.executionContent.querySelectorAll('.execution-step');
            steps.forEach((step, i) => {
                if (i < currentStep) {
                    step.classList.remove('pending', 'running');
                    step.classList.add('completed');
                } else if (i === currentStep) {
                    step.classList.remove('pending', 'completed');
                    step.classList.add('running');
                } else {
                    step.classList.remove('running', 'completed');
                    step.classList.add('pending');
                }
            });
            
            // Auto-scroll to bottom
            resultsContent.scrollTop = resultsContent.scrollHeight;
        }
    }
    
    // Welcome Screen
    showWelcomeScreen() {
        if (this.elements.welcomeModal) {
            this.elements.welcomeModal.classList.add('active');
        }
    }
    
    hideWelcomeScreen() {
        if (this.elements.welcomeModal) {
            this.elements.welcomeModal.classList.remove('active');
        }
    }
    
    // Preference Modal
    showPreferenceModal() {
        if (this.elements.preferenceModal) {
            this.elements.preferenceModal.classList.add('active');
        }
    }
    
    hidePreferenceModal() {
        if (this.elements.preferenceModal) {
            this.elements.preferenceModal.classList.remove('active');
        }
    }
    
    // Loading States
    showLoading() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.add('active');
            this.elements.loadingIndicator.style.position = 'relative';
        }
        if (this.elements.workflowFeed) {
            this.elements.workflowFeed.style.opacity = '0.5';
        }
    }
    
    hideLoading() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.remove('active');
        }
        if (this.elements.workflowFeed) {
            this.elements.workflowFeed.style.opacity = '1';
        }
    }
    
    updateLoadingProgress(percent, message = '') {
        const progressBar = document.getElementById('loading-progress-bar');
        const progressText = document.getElementById('loading-percentage');
        const loadingText = document.getElementById('loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percent}%`;
        }
        
        if (loadingText && message) {
            loadingText.textContent = message;
        }
    }
    
    showLoadingMore() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.add('active');
            this.elements.loadingIndicator.style.position = 'relative';
            const loadingText = document.getElementById('loading-text');
            if (loadingText) loadingText.textContent = 'Loading more workflows...';
        }
    }
    
    hideLoadingMore() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.remove('active');
            const loadingText = document.getElementById('loading-text');
            if (loadingText) loadingText.textContent = 'Generating workflows...';
            this.updateLoadingProgress(0, 'Generating workflows...');
        }
    }
    
    appendWorkflows(workflows) {
        if (!this.elements.workflowFeed) return;
        
        workflows.forEach(workflow => {
            const card = this.createWorkflowCard(workflow);
            this.elements.workflowFeed.appendChild(card);
        });
    }
    
    clearFeed() {
        if (this.elements.workflowFeed) {
            this.elements.workflowFeed.innerHTML = '';
        }
    }
    
    updateFeedTitle(personalized) {
        if (this.elements.feedTitle) {
            this.elements.feedTitle.textContent = personalized 
                ? 'Your Personalized Workflow Feed' 
                : 'Discovering Workflows for You';
        }
    }
    
    // Toast Notifications
    showToast(message, type = 'info') {
        if (!this.elements.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, CONFIG.TOAST_DURATION);
    }
    
    // File Viewer/Runner
    openFileViewer(content, title = 'Output') {
        const modal = document.getElementById('file-viewer-modal');
        const titleEl = document.getElementById('file-viewer-title');
        const contentEl = document.getElementById('file-viewer-content');
        
        if (!modal || !contentEl) return;
        
        if (titleEl) {
            titleEl.textContent = title;
        }
        
        // Store content for later use
        this.currentFileContent = content;
        
        // Detect content type
        const detectedType = this.detectFileType(content);
        const selector = document.getElementById('file-type-selector');
        if (selector) {
            selector.value = detectedType;
        }
        
        // Render content
        this.renderFileContent(content, detectedType);
        
        // Update stats
        this.updateFileStats(content);
        
        // Show modal
        modal.classList.add('active');
        
        console.log('📄 [Viewer] File viewer opened:', title);
    }
    
    detectFileType(content) {
        // Try to detect JSON
        try {
            JSON.parse(content);
            return 'json';
        } catch (e) {}
        
        // Check for markdown indicators
        if (content.includes('# ') || content.includes('## ') || content.includes('```')) {
            return 'markdown';
        }
        
        // Check for HTML
        if (content.includes('<html') || content.includes('<!DOCTYPE')) {
            return 'html';
        }
        
        // Check for code patterns
        if (content.includes('function ') || content.includes('def ') || content.includes('class ')) {
            return 'code';
        }
        
        return 'text';
    }
    
    renderFileContent(content, type) {
        const contentEl = document.getElementById('file-viewer-content');
        if (!contentEl) return;
        
        switch (type) {
            case 'json':
                this.renderJSON(content, contentEl);
                break;
            case 'code':
                this.renderCode(content, contentEl);
                break;
            case 'markdown':
                this.renderMarkdown(content, contentEl);
                break;
            case 'html':
                this.renderHTML(content, contentEl);
                break;
            default:
                this.renderText(content, contentEl);
        }
    }
    
    renderText(content, container) {
        container.innerHTML = `<pre>${this.escapeHtml(content)}</pre>`;
    }
    
    renderCode(content, container) {
        const highlighted = this.highlightCode(content);
        container.innerHTML = `<pre class="code-viewer">${highlighted}</pre>`;
    }
    
    renderJSON(content, container) {
        try {
            const parsed = JSON.parse(content);
            const formatted = JSON.stringify(parsed, null, 2);
            const highlighted = this.highlightJSON(formatted);
            container.innerHTML = `<pre class="json-viewer">${highlighted}</pre>`;
        } catch (e) {
            this.renderText(content, container);
        }
    }
    
    renderMarkdown(content, container) {
        // Simple markdown rendering
        let html = this.escapeHtml(content);
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        container.innerHTML = `<div class="markdown-preview">${html}</div>`;
    }
    
    renderHTML(content, container) {
        container.innerHTML = `<div class="html-preview">${content}</div>`;
    }
    
    highlightJSON(json) {
        return json
            .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
            .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
            .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
            .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/: null/g, ': <span class="json-null">null</span>');
    }
    
    highlightCode(code) {
        const escaped = this.escapeHtml(code);
        return escaped
            .replace(/\b(function|const|let|var|if|else|return|for|while|class|def|import|from)\b/g, '<span class="code-keyword">$1</span>')
            .replace(/"([^"]+)"/g, '<span class="code-string">"$1"</span>')
            .replace(/'([^']+)'/g, '<span class="code-string">\'$1\'</span>')
            .replace(/\/\/(.*?)$/gm, '<span class="code-comment">//$1</span>')
            .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span class="code-function">$1</span>(');
    }
    
    updateFileStats(content) {
        const charCount = document.getElementById('char-count');
        const lineCount = document.getElementById('line-count');
        const wordCount = document.getElementById('word-count');
        
        const chars = content.length;
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        
        if (charCount) charCount.textContent = `${chars.toLocaleString()} characters`;
        if (lineCount) lineCount.textContent = `${lines.toLocaleString()} lines`;
        if (wordCount) wordCount.textContent = `${words.toLocaleString()} words`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Event Handlers (to be set by app.js)
    onProfileSelect(profileId) {
        // Override in app.js
    }
    
    onProfileDelete(profileId, profileName) {
        // Override in app.js
    }
}

// Create global instance
const ui = new UIManager();

