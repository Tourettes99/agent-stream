// Gemini API Integration
class GeminiClient {
    constructor() {
        this.apiKey = null;
        this.baseUrl = CONFIG.GEMINI_API_BASE;
        this.model = CONFIG.GEMINI_MODEL;
    }
    
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    
    async generateContent(prompt, systemInstruction = null) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }
        
        const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };
        
        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{
                    text: systemInstruction
                }]
            };
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
            
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }
    
    async streamContent(prompt, systemInstruction = null, onChunk = null) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }
        
        const url = `${this.baseUrl}/models/${this.model}:streamGenerateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };
        
        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{
                    text: systemInstruction
                }]
            };
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.substring(6);
                            const data = JSON.parse(jsonStr);
                            
                            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                                const text = data.candidates[0].content.parts[0].text;
                                fullText += text;
                                
                                if (onChunk) {
                                    onChunk(text, fullText);
                                }
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
            
            return fullText;
        } catch (error) {
            console.error('Gemini API streaming error:', error);
            throw error;
        }
    }
}

// Create global instance
const gemini = new GeminiClient();

