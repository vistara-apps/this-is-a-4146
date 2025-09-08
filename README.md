# Diginer Plus

**Your AI growth partner for smarter business ideas and outreach.**

Diginer Plus is a comprehensive web application that helps entrepreneurs and marketers rapidly generate and refine business ideas, improve marketing copy, automate outreach, and gain community insights using AI.

## 🚀 Features

### Core Features
- **🧠 AI Idea Generation Engine**: Leverages AI to brainstorm niche-specific business ideas, marketing angles, and content topics based on user inputs and industry trends
- **📝 Copy Performance Analyzer**: Analyzes existing marketing copy, identifies weak phrases, suggests AI-driven improvements for better engagement and conversion rates
- **📧 Personalized Outreach Automator**: Automates personalized follow-up messages and engagement sequences based on user interaction history and predefined triggers
- **👥 Community Sentiment Insights**: Analyzes community discussion data (e.g., forums, social media) to identify trending topics, gauge sentiment, and highlight key engagement opportunities

### Additional Features
- **💬 AI Assistant Chat**: Interactive AI assistant for business growth advice
- **📊 Usage Analytics**: Track your monthly usage and subscription limits
- **🔐 Authentication System**: Secure login/registration with demo accounts
- **💳 Subscription Management**: Tiered subscription model (Free, Pro, Premium)
- **💾 Data Persistence**: Local storage for offline access to your data

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: OpenAI GPT-4 API
- **Community Data**: Reddit API
- **State Management**: React Context + useReducer
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Docker ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI features)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diginer-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Accounts

Try the app immediately with these demo accounts:

- **Free Plan Demo**: 
  - Email: `demo@diginerplus.com`
  - Password: `demo123`

- **Pro Plan Demo**: 
  - Email: `pro@diginerplus.com`
  - Password: `pro123`

## 💳 Subscription Tiers

### Free Tier
- 10 monthly credits
- Basic idea generation
- Limited copy analysis
- Community insights
- Email support

### Pro Tier ($29/month)
- 100 monthly credits
- Advanced AI idea generation
- Detailed copy analysis
- Automated outreach sequences
- Community sentiment analysis
- Priority support
- Export capabilities

### Premium Tier ($99/month)
- 500 monthly credits
- Everything in Pro
- Team collaboration
- Custom AI training
- Advanced analytics
- API access
- White-label options
- Dedicated support

## 🏗️ Architecture

### Design System
The app uses a comprehensive design system with:
- **Colors**: Primary (blue), Accent (green), neutral grays
- **Typography**: 5 text scales from display to caption
- **Spacing**: Consistent spacing scale (xs to xxl)
- **Components**: Reusable UI components with variants
- **Motion**: Smooth animations with cubic-bezier easing

### Data Model
```
User
├── Projects
│   ├── Generated Ideas
│   ├── Copy Analyses
│   └── Outreach Sequences
└── Community Insights
```

### API Services
- **OpenAI Service**: Handles all AI-powered features
- **Reddit Service**: Fetches community data and trends
- **Auth Service**: Manages authentication and sessions
- **Storage Service**: Handles local data persistence

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── views/        # Page components
│   ├── AppShell.jsx  # Main app layout
│   ├── Header.jsx    # App header
│   └── Sidebar.jsx   # Navigation sidebar
├── contexts/
│   └── AppContext.jsx # Global state management
├── services/
│   ├── api.js        # API service layer
│   └── auth.js       # Authentication services
├── App.jsx           # Root component
└── main.jsx          # App entry point
```

### Key Components

#### UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Elevated and default variants
- **Input**: Text inputs with error states
- **AgentChat**: AI chat interface with message history
- **FeatureCard**: Feature showcase cards with stats and actions

#### Views
- **Dashboard**: Overview with stats and quick actions
- **IdeaGeneration**: AI-powered business idea generation
- **CopyAnalysis**: Marketing copy analysis and optimization
- **OutreachAutomation**: Email sequence creation
- **CommunityInsights**: Social media trend analysis
- **Auth**: Login/registration with demo accounts

## 🚀 Deployment

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t diginer-plus .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:80 diginer-plus
   ```

### Environment Variables for Production

```bash
VITE_OPENAI_API_KEY=your_production_openai_key
VITE_ENABLE_REAL_API=true
VITE_ENABLE_REDDIT_API=true
```

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Client-side API calls**: In production, move OpenAI calls to backend
- **Authentication**: Implement proper JWT-based auth for production
- **Rate Limiting**: Add rate limiting for API calls
- **Input Validation**: Validate all user inputs on both client and server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Demo**: Use the demo accounts to explore all features

## 🔮 Roadmap

- [ ] Backend API implementation
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with more social platforms
- [ ] Custom AI model training
- [ ] White-label solutions
- [ ] API for third-party integrations

---

**Built with ❤️ for entrepreneurs and marketers who want to grow smarter, not harder.**
