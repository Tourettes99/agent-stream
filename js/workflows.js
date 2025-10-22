// Workflow Generation and Management
class WorkflowManager {
    constructor() {
        this.currentWorkflows = [];
        this.executingWorkflow = null;
        this.isGenerating = false;
        this.hasMore = true;
    }
    
    // Generate workflows based on preferences
    async generateWorkflows(count = CONFIG.INITIAL_FEED_SIZE, personalized = false, onProgress = null) {
        this.isGenerating = true;
        console.log(`🤖 [Gemini] Generating ${count} workflows...`);
        
        if (onProgress) onProgress(0);
        
        const savedWorkflows = storage.getSavedWorkflows();
        const history = storage.getHistory();
        
        let prompt = '';
        
        if (personalized && savedWorkflows.length > 0) {
            // Analyze user preferences from saved workflows
            const categories = this.extractCategories(savedWorkflows);
            const tools = this.extractTools(savedWorkflows);
            
            prompt = this.buildPersonalizedPrompt(count, categories, tools, savedWorkflows);
        } else {
            prompt = this.buildStockPrompt(count);
        }
        
        const systemInstruction = `You are an AI workflow designer for AgentStream. 
Your job is to create diverse, creative, and practical AI agent workflows that leverage Gemini's capabilities.
Each workflow should be unique and actionable, combining various tools, libraries, and APIs.
Return workflows in valid JSON format only, no additional text.`;
        
        try {
            if (onProgress) onProgress(0.2);
            console.log('🔗 [API] Sending request to Gemini...');
            
            const response = await gemini.generateContent(prompt, systemInstruction);
            
            if (onProgress) onProgress(0.6);
            console.log('✅ [API] Response received');
            console.log('📝 [Parser] Parsing workflow JSON...');
            
            const workflows = this.parseWorkflows(response);
            
            if (onProgress) onProgress(0.8);
            console.log(`✅ [Parser] Parsed ${workflows.length} workflows`);
            
            // Add IDs and metadata
            workflows.forEach((w, i) => {
                w.id = storage.generateId();
                w.generatedAt = Date.now();
                console.log(`  ${i + 1}. ${w.title} [${w.category}]`);
            });
            
            if (onProgress) onProgress(1.0);
            
            // Add to current workflows instead of replacing
            this.currentWorkflows.push(...workflows);
            this.isGenerating = false;
            console.log(`✅ [Gemini] Generation complete! Total workflows: ${this.currentWorkflows.length}`);
            return workflows;
        } catch (error) {
            console.error('Workflow generation error:', error);
            this.isGenerating = false;
            throw error;
        }
    }
    
    buildStockPrompt(count) {
        return `Generate ${count} diverse AI agent workflows as JSON array. Each workflow should include:
- title: catchy, descriptive name
- description: clear explanation of what it does (2-3 sentences)
- category: one of [${CONFIG.CATEGORIES.join(', ')}]
- tools: array of technologies/libraries used (e.g., Python, APIs, libraries)
- steps: array of 3-5 execution steps with clear descriptions
- estimatedTime: estimated execution time
- difficulty: easy, medium, or hard

Make workflows diverse across categories. Include workflows for:
- Web scraping and data extraction
- Document analysis and summarization
- Automation tasks
- Research and information gathering
- Creative content generation
- Code generation and debugging
- Data analysis and visualization
- API integrations
- File processing
- And other creative applications

Return ONLY valid JSON array, no markdown or extra text.
Example format:
[
  {
    "title": "Smart News Aggregator",
    "description": "Scrapes top tech news from multiple sources, analyzes sentiment, and creates a personalized digest. Uses NLP to categorize and rank articles by relevance.",
    "category": "Research",
    "tools": ["Python", "BeautifulSoup", "Newspaper3k", "TextBlob", "Google Search API"],
    "steps": [
      "Search for tech news from specified sources",
      "Extract article content and metadata",
      "Analyze sentiment and relevance",
      "Generate personalized digest",
      "Format and present results"
    ],
    "estimatedTime": "2-3 minutes",
    "difficulty": "medium"
  }
]`;
    }
    
    buildPersonalizedPrompt(count, categories, tools, savedWorkflows) {
        const topCategories = categories.slice(0, 3).map(c => c.name).join(', ');
        const topTools = tools.slice(0, 5).join(', ');
        
        return `Generate ${count} personalized AI agent workflows based on user preferences.

User's favorite categories: ${topCategories}
Commonly used tools: ${topTools}

Generate workflows that:
1. Focus primarily on these categories but include some variety
2. Leverage these tools where appropriate
3. Introduce new related tools and techniques
4. Are similar in spirit but NOT identical to past workflows
5. Gradually increase in complexity and capability

Return workflows as JSON array with same structure:
- title: catchy, descriptive name
- description: clear explanation (2-3 sentences)
- category: one of [${CONFIG.CATEGORIES.join(', ')}]
- tools: array of technologies/libraries
- steps: array of 3-5 execution steps
- estimatedTime: estimated time
- difficulty: easy, medium, or hard

Make 60% of workflows align with user preferences, 40% explore new areas.
Return ONLY valid JSON array, no markdown or extra text.`;
    }
    
    parseWorkflows(response) {
        try {
            // Try to extract JSON from response
            let jsonStr = response.trim();
            
            // Remove markdown code blocks if present
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            }
            
            // Find JSON array
            const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
            
            const workflows = JSON.parse(jsonStr);
            
            if (!Array.isArray(workflows)) {
                throw new Error('Response is not an array');
            }
            
            // Validate workflow structure
            return workflows.filter(w => 
                w.title && w.description && w.category && w.tools && w.steps
            );
        } catch (error) {
            console.error('Failed to parse workflows:', error);
            // Return fallback workflows
            return this.getFallbackWorkflows();
        }
    }
    
    getFallbackWorkflows() {
        return [
            {
                title: "Smart Email Digest Creator",
                description: "Analyzes your email patterns and creates intelligent summaries of important messages. Groups by topic and priority.",
                category: "Automation",
                tools: ["Python", "Email API", "NLP", "TextBlob"],
                steps: [
                    "Connect to email inbox",
                    "Analyze recent emails",
                    "Categorize by topic and importance",
                    "Generate summary digest",
                    "Present formatted results"
                ],
                estimatedTime: "1-2 minutes",
                difficulty: "medium"
            },
            {
                title: "Research Paper Summarizer",
                description: "Takes academic papers or articles and generates concise, structured summaries with key findings and methodology.",
                category: "Research",
                tools: ["Python", "PDF Parser", "NLP", "Gemini API"],
                steps: [
                    "Upload or fetch research paper",
                    "Extract text and structure",
                    "Identify key sections",
                    "Generate intelligent summary",
                    "Create citation reference"
                ],
                estimatedTime: "2-3 minutes",
                difficulty: "easy"
            },
            {
                title: "Code Documentation Generator",
                description: "Analyzes your codebase and automatically generates comprehensive documentation with examples and usage guides.",
                category: "Code Generation",
                tools: ["Python", "AST Parser", "Markdown", "Gemini API"],
                steps: [
                    "Scan code files",
                    "Parse functions and classes",
                    "Generate descriptions",
                    "Create usage examples",
                    "Format as documentation"
                ],
                estimatedTime: "3-5 minutes",
                difficulty: "medium"
            }
        ];
    }
    
    // Execute a workflow
    async executeWorkflow(workflow, onProgress = null) {
        this.executingWorkflow = workflow;
        
        const prompt = `Execute this workflow step by step:

Title: ${workflow.title}
Description: ${workflow.description}
Tools: ${workflow.tools.join(', ')}

Steps:
${workflow.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

For each step:
1. Explain what you're doing
2. Show the process or code
3. Present the results

Be practical and show actual implementation details.`;

        const systemInstruction = `You are an AI agent executing workflows. 
Provide clear, step-by-step execution with code examples, results, and explanations.
Be practical and actionable.`;

        try {
            const results = [];
            let fullResponse = '';
            
            await gemini.streamContent(prompt, systemInstruction, (chunk, full) => {
                fullResponse = full;
                
                if (onProgress) {
                    // Parse current step from response
                    const stepMatch = full.match(/Step (\d+):/g);
                    const currentStep = stepMatch ? stepMatch.length : 0;
                    
                    onProgress({
                        currentStep,
                        totalSteps: workflow.steps.length,
                        content: full,
                        status: 'running'
                    });
                }
            });
            
            // Add to history
            storage.addToHistory(workflow);
            
            this.executingWorkflow = null;
            
            return {
                workflow,
                results: fullResponse,
                completedAt: Date.now(),
                status: 'completed'
            };
        } catch (error) {
            this.executingWorkflow = null;
            throw error;
        }
    }
    
    // Analyze user preferences
    extractCategories(workflows) {
        const categoryCount = {};
        
        workflows.forEach(w => {
            categoryCount[w.category] = (categoryCount[w.category] || 0) + 1;
        });
        
        return Object.entries(categoryCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    extractTools(workflows) {
        const toolCount = {};
        
        workflows.forEach(w => {
            if (w.tools && Array.isArray(w.tools)) {
                w.tools.forEach(tool => {
                    toolCount[tool] = (toolCount[tool] || 0) + 1;
                });
            }
        });
        
        return Object.entries(toolCount)
            .sort((a, b) => b[1] - a[1])
            .map(([tool]) => tool);
    }
    
    getCurrentWorkflows() {
        return this.currentWorkflows;
    }
    
    canLoadMore() {
        return this.hasMore && !this.isGenerating && this.currentWorkflows.length < CONFIG.MAX_WORKFLOWS;
    }
    
    resetFeed() {
        this.currentWorkflows = [];
        this.hasMore = true;
    }
}

// Create global instance
const workflowManager = new WorkflowManager();

