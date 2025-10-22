# AgentStream - AI Workflow Feed

**AgentStream** is a personalized AI workflow discovery platform designed for the Rabbit R1. It uses Gemini 2.0 Flash to generate intelligent, actionable workflows that adapt to your preferences over time.

## 🎯 Overview

AgentStream presents a Netflix-style feed of AI agent workflows that you can discover, save, and execute. The more workflows you interact with, the more personalized your feed becomes. Each workflow combines various tools, libraries, and APIs to accomplish complex tasks through Gemini-powered AI agents.

## ✨ Features

### 🔐 Simple Authentication
- **API Key Login**: Enter your Gemini API key directly
- **Multiple Profiles**: Create unlimited profiles with different API keys
- **Profile Management**: Switch between profiles, each with personalized feeds
- **Profile Deletion**: Remove profiles and all associated data

### 🎨 Netflix-Inspired UI
- Sleek black background with white text and red accents
- Glass-morphism design with backdrop blur effects
- Touch-optimized interface for Rabbit R1
- Smooth animations and transitions
- Welcome screen on first launch

### 🍔 Hamburger Menu
Access all features from one convenient menu:
- **Current Profile**: See who's logged in
- **Switch Profile**: Change between different accounts
- **Add New Profile**: Create new profiles
- **Saved Workflows**: View and run your saved workflows
- **Clear Feed**: Start with fresh workflows
- **Reset Preferences**: Return to stock mode
- **About**: App information
- **Logout**: Sign out securely

### 🤖 Intelligent Workflow Generation
- **Stock Mode**: Discover diverse workflows across 15+ categories
- **Personalized Mode**: AI learns from your saved workflows and generates similar ones
- **Infinite Scroll**: Loads 3 workflows initially, generates 3 more as you scroll
- **Fast Loading**: Progressive generation for instant feedback
- Categories include:
  - Data Analysis
  - Web Scraping
  - Automation
  - Research
  - Content Creation
  - Code Generation
  - Document Processing
  - API Integration
  - Machine Learning
  - And more!

### 💾 Smart Personalization
- Save unlimited workflows you're interested in
- AI analyzes your preferences (categories, tools, complexity)
- Feed gradually adapts to match your interests
- History tracking for all executed workflows (last 100 per profile)
- Red badge shows saved workflow count

### ⚡ Workflow Execution
- View detailed workflow information
- See step-by-step execution plans
- Run workflows with live streaming results
- Track execution progress with real-time percentages
- Interactive results viewer
- Copy or view outputs in dedicated runner

### 📄 File Viewer/Runner (R1 Optimized)
Perfect for R1 - **no downloads required**!
- **In-App Viewer**: View all workflow outputs directly in the app
- **Multiple View Modes**:
  - Plain Text
  - Code (with syntax highlighting)
  - JSON (with formatting and colors)
  - Markdown (rendered preview)
  - HTML Preview
- **Interactive Features**:
  - Copy to clipboard
  - Format/pretty-print JSON
  - Fullscreen mode
  - File statistics (characters, lines, words)
- **Syntax Highlighting**: Color-coded for better readability

### 📊 Progress Tracking
- Splash screen with loading percentage
- Feed generation progress with detailed logs
- Workflow execution progress tracking
- Console logging with emojis for all actions
- Real-time status updates

## 🚀 Getting Started

### Prerequisites

1. A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. A modern web browser (Chrome, Edge, Safari, Firefox) or Rabbit R1
3. Internet connection

### Installation

1. **Download or clone** the app to your device:
   ```
   app_creations_22/
   ├── index.html
   ├── css/
   │   └── styles.css
   └── js/
       ├── config.js
       ├── storage.js
       ├── google-auth.js
       ├── auth.js
       ├── gemini.js
       ├── workflows.js
       ├── ui.js
       └── app.js
   ```

2. **Open `index.html`** in your browser or deploy to a web server

### First-Time Setup

1. **Launch the app** - you'll see a welcome screen explaining features
2. **Tap "Start Exploring"** - goes to login screen
3. **Enter your Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. **Tap "Get Started"** - creates your profile automatically
5. **Browse the feed** - 3 workflows load instantly!

## 📖 How to Use

### Discovering Workflows

1. **Browse the feed** - scroll through AI-generated workflows
2. **Infinite scroll** - new workflows generate as you scroll down
3. **Tap any workflow card** to view details:
   - Category and title
   - Description and purpose
   - Tools and technologies involved
   - Step-by-step execution plan
   - Estimated time and difficulty

### Saving Workflows

- Tap the **"Use Workflow"** button on any workflow card
- Saved workflows help personalize your future feed
- Button changes to **"✓ Saved"** when workflow is saved
- Tap again to unsave
- View all saved workflows from hamburger menu

### Viewing Saved Workflows

1. **Open hamburger menu** (☰ icon)
2. **Tap "Saved Workflows"** - shows count badge
3. **Browse your collection** in grid layout
4. **Tap "Run"** to execute any saved workflow
5. **Tap "Unsave"** to remove from collection
6. **Tap card** to view full details

### Running Workflows

1. **Tap a workflow card** to open the execution modal
2. Review the workflow details and steps
3. Tap **"Run Workflow"** to execute
4. Watch as the AI agent works through each step
5. See real-time progress with percentages
6. View streaming results as they generate

### Viewing Workflow Results

After execution completes:
1. **See "✅ Execution Complete"** header
2. **Read full results** in formatted output box
3. **Copy results** to clipboard with one tap
4. **View in Runner** for interactive file viewing:
   - Choose view mode (Text/Code/JSON/Markdown/HTML)
   - Syntax highlighting for code
   - Pretty-print JSON
   - Render markdown
   - Preview HTML
   - Copy or fullscreen
5. **Run again** if needed
6. **Close modal** when done

### Personalizing Your Feed

**First Time:**
- When you return with saved workflows, AgentStream asks:
  - *"Would you like me to personalize your feed based on your preferences?"*
- Choose **"Yes, personalize my feed"** to activate AI personalization
- Or **"No, keep exploring"** to continue discovering randomly

**Personalized Mode:**
- ~60% of workflows match your saved preferences
- ~40% introduce new ideas and categories
- Workflows become more sophisticated over time
- Never see the exact same workflow twice

### Managing Profiles

1. **Open hamburger menu** (☰ icon)
2. **Switch Profile**: Choose from existing profiles
3. **Add New Profile**: Create profile with different API key
4. **Delete Profile**: 
   - Hover/tap profile card to see delete button
   - Confirms before deletion
   - Removes all data (API key, saved workflows, history)

Each profile has its own:
- API key
- Saved workflows
- Feed preferences
- Execution history
- Personalization settings

### Using the Hamburger Menu

**Profile Section:**
- View current profile info
- Switch between profiles
- Add new profiles

**Feed Options:**
- View saved workflows
- Clear current feed
- Reset feed preferences

**App Actions:**
- About AgentStream
- Logout

### Refreshing the Feed

- Tap the **🔄 Refresh button** in header or feed
- 3-second cooldown between refreshes
- Clears current feed and generates 3 new workflows
- More load as you scroll

## 🎮 Touch Controls

Designed exclusively for touch interaction on R1:

- **Tap** workflow cards to view details
- **Tap** buttons to activate actions
- **Scroll** through infinite feed
- **Tap** outside modals to close (or use × button)
- **Swipe** to scroll in file viewer
- **Pinch** zoom in fullscreen file viewer (browser-dependent)

## 🔧 Configuration

### API Settings

Edit `js/config.js` to customize:

```javascript
GEMINI_MODEL: 'gemini-2.0-flash-exp'  // Change model if needed
INITIAL_FEED_SIZE: 3                  // Workflows on initial load
BATCH_SIZE: 3                         // Workflows per scroll batch
MAX_WORKFLOWS: 30                     // Max before refresh required
REFRESH_COOLDOWN: 3000                // Milliseconds between refreshes
```

### Categories

Modify `CONFIG.CATEGORIES` to add/remove workflow categories:

```javascript
CATEGORIES: [
    'Data Analysis',
    'Web Scraping',
    'Your Custom Category',
    // ...
]
```

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **AI**: Google Gemini 2.0 Flash API
- **Storage**: Browser LocalStorage
- **Design**: Netflix-inspired glass morphism
- **Authentication**: Simple API key-based

### File Structure

- **index.html** - Main HTML structure with all modals
- **css/styles.css** - Netflix-style visual design (1100+ lines)
- **js/config.js** - App configuration and constants
- **js/storage.js** - LocalStorage management
- **js/google-auth.js** - Google OAuth helper (legacy)
- **js/auth.js** - Authentication and profile management
- **js/gemini.js** - Gemini API integration
- **js/workflows.js** - Workflow generation and execution
- **js/ui.js** - UI rendering, file viewer, and interactions
- **js/app.js** - Main application logic and event handlers

### Data Flow

```
User Action → UI Manager → Workflow Manager → Gemini API
                ↓                              ↓
         Storage Manager ← Parse & Display ← File Viewer
```

### Key Components

1. **Splash Screen**: Loading animation with progress
2. **Welcome Modal**: First-time user introduction
3. **Login Screen**: API key entry
4. **Profile Selection**: Multi-profile support
5. **Hamburger Menu**: Side navigation panel
6. **Workflow Feed**: Infinite scroll grid
7. **Execution Modal**: Run and view workflows
8. **File Viewer**: Interactive output viewer
9. **Saved Workflows Modal**: Manage saved items
10. **About Modal**: App information

## 💡 Workflow Examples

AgentStream can generate workflows like:

- **Smart Email Digest Creator** - Analyzes emails and creates summaries
- **Research Paper Summarizer** - Extracts key findings from academic papers
- **Code Documentation Generator** - Auto-generates docs from your codebase
- **Social Media Content Planner** - Plans and schedules content campaigns
- **Data Analysis Pipeline** - Processes CSV/JSON data with visualizations
- **Web Scraping Bot** - Extracts structured data from websites
- **API Integration Helper** - Connects and syncs multiple APIs
- **JSON to CSV Converter** - Transforms data formats
- **Markdown Report Generator** - Creates formatted documentation
- **Python Script Builder** - Generates code for specific tasks
- **And thousands more possibilities!**

## 🔒 Privacy & Storage

### What's Stored Locally

- Gemini API key (in browser localStorage)
- User profiles (names, emails, login method)
- Saved workflows (full workflow data)
- Workflow execution history (last 100 per profile)
- Feed preference settings (stock/personalized)
- Welcome screen shown status

### Data Safety

- All data stays in your browser's LocalStorage
- No data sent to external servers (except Gemini API calls)
- API key stored locally, never shared
- Clear browser data to reset everything
- Profile deletion removes all associated data

### Storage Limits

- Browser LocalStorage typically allows 5-10MB
- Each workflow is ~1-2KB
- Can store hundreds of workflows per profile
- Execution history limited to last 100 runs

## 🐛 Troubleshooting

### "API request failed"
- Verify your API key is correct
- Check your internet connection
- Ensure API key has Gemini API access enabled
- Try generating a new API key from Google AI Studio

### Workflows won't generate
- Confirm API key is valid
- Check browser console for errors (F12)
- Try refreshing the page
- Clear LocalStorage and re-login
- Verify Gemini API quota hasn't been exceeded

### Feed not personalizing
- Save at least 3-5 workflows first
- Return to app and choose "personalize my feed" when prompted
- Check hamburger menu → current profile has saved workflows
- Try resetting preferences and re-enabling

### App won't load
- Ensure JavaScript is enabled
- Use a modern browser (Chrome, Edge, Safari, Firefox)
- Check browser console for errors
- Try incognito/private mode
- Clear browser cache

### File viewer not working
- Ensure JavaScript is enabled
- Check if content type is supported
- Try switching view modes
- Copy content instead if viewer fails

### Progress stuck at 0%
- Refresh the page
- Check internet connection
- Verify API key is working
- Look at console for detailed errors

## 🎨 Customization

### Changing Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-bg: #141414;        /* Main background */
    --accent-red: #e50914;        /* Primary accent color */
    --text-primary: #ffffff;      /* Text color */
    --glass-bg: rgba(30, 30, 30, 0.8);  /* Glass panels */
}
```

### Adding Custom Workflows

Edit the fallback workflows in `js/workflows.js`:

```javascript
getFallbackWorkflows() {
    return [
        {
            title: "Your Custom Workflow",
            description: "What it does...",
            category: "Automation",
            tools: ["Python", "API"],
            steps: ["Step 1", "Step 2", "Step 3"],
            estimatedTime: "2 minutes",
            difficulty: "easy"
        }
    ];
}
```

### Customizing Workflow Categories

Add your own categories in `js/config.js`:

```javascript
CATEGORIES: [
    'Data Analysis',
    'Your Category',
    'Another Category'
]
```

## 🚀 Deployment

### Local Development
Simply open `index.html` in a browser.

### Web Hosting
Upload to any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect via Git
- **GitHub Pages**: Push to a repository
- **AWS S3**: Upload as static website
- **Cloudflare Pages**: Deploy from Git

### R1 Device
1. Host on a web server with HTTPS
2. Access via R1's browser
3. Add to home screen for app-like experience
4. Touch-optimized interface works perfectly
5. File viewer eliminates need for downloads

## 🔮 Current Features (Implemented!)

✅ Welcome screen on first launch  
✅ Progress tracking with percentages  
✅ Infinite scroll feed generation  
✅ Hamburger menu navigation  
✅ Saved workflows viewer  
✅ Interactive file viewer/runner  
✅ Profile deletion  
✅ Copy to clipboard  
✅ Fullscreen file viewer  
✅ Syntax highlighting  
✅ JSON formatting  
✅ Markdown rendering  
✅ HTML preview  
✅ Multiple profiles  
✅ Feed personalization  
✅ Workflow execution history  
✅ Real-time streaming results  

## 🎯 Future Enhancements

Potential features for future versions:

- [ ] Workflow templates library
- [ ] Share workflows with QR codes
- [ ] Execution history viewer
- [ ] Voice commands for R1
- [ ] Workflow scheduling
- [ ] Cloud sync between devices
- [ ] Workflow marketplace
- [ ] Advanced filtering and search
- [ ] Export saved workflows
- [ ] Import workflow collections
- [ ] Workflow ratings and favorites
- [ ] Collaborative workflows

## 📄 License

This is a Rabbit R1 Creation app. Free to use and modify for personal use.

## 🙏 Credits

- **AI Model**: Google Gemini 2.0 Flash
- **Design Inspiration**: Netflix
- **Platform**: Rabbit R1
- **Version**: 1.0.0

## 💬 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors (F12)
3. Verify your Gemini API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Ensure you're using a modern browser
5. Try clearing browser data and starting fresh

## 🎓 Tips & Tricks

- **Save diverse workflows** to get better personalization
- **Use fullscreen** in file viewer for better reading
- **Switch profiles** to separate work/personal workflows
- **Try different view modes** in file viewer for best results
- **Let the feed learn** by saving 5-10 workflows before personalizing
- **Refresh regularly** to discover new workflow types
- **Check console logs** for detailed progress information

---

**Made with ❤️ for Rabbit R1**

*AgentStream - Your AI Workflows, Personalized*

**Version 1.0.0** | Built with Gemini 2.0 Flash | Netflix-Inspired Design
