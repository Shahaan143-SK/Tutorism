# AI Tutor - Your Personal Learning Assistant**(TUTORISM)**

An intelligent AI-powered tutoring platform with voice and text interaction capabilities, built with Next.js and Groq AI API.

## 🌟 Features

### Core Functionality
- **Interactive AI Chat**: Real-time conversational AI tutor powered by Groq's GPT model
- **Voice Interaction**: 
  - Speech-to-Text using Whisper large v3 turbo
  - Text-to-Speech with PlayAI TTS (falls back to browser TTS)
  - Voice recording and playback
- **Multi-Domain Learning**: Support for 20+ subjects including:
  - Programming (Web Dev, App Dev, Game Dev, Data Science, AI, Cybersecurity)
  - Sciences (Physics, Chemistry, Biology)
  - Mathematics & Statistics
  - Business, Finance, Trading
  - Languages, Design, Music, and more
- **Adaptive Learning Levels**: 
  - Beginner (simple explanations)
  - Intermediate (moderate technical depth)
  - Advanced (professional level)

### User Management
- **Authentication System**: Login and signup functionality
- **Role-Based Access**: Support for both students and tutors
- **User Profiles**: Personalized profiles with avatars, bio, and subject interests
- **Demo Accounts**:
  - Student: `alex@student.com`
  - Tutor: `sarah@tutor.com`
  - Password: any 6+ characters

### Pages
- **Home**: Main AI chat interface
- **Students**: Showcase of learning community with student profiles
- **Tutors**: Featured expert tutors with ratings and specializations
- **Login**: Comprehensive authentication with tabs for sign in/sign up

### UI/UX Features
- **Dark/Light Mode**: Theme toggle support
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Glassmorphism Effects**: Modern backdrop blur and gradient designs
- **Formatted Responses**: Clean markdown-style formatting with headings, lists, and sections
- **Auto-play Audio**: Optional automatic playback of AI responses
- **Real-time Status**: Loading indicators for speech processing and AI generation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (React 19.2.0)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + Custom shadcn/ui components
- **Icons**: Lucide React
- **Fonts**: Geist & Geist Mono (Google Fonts)

### Backend & AI
- **AI Provider**: Groq API
- **Models**:
  - Chat: `openai/gpt-oss-20b`
  - Speech-to-Text: `whisper-large-v3-turbo`
  - Text-to-Speech: `playai-tts` (Fritz-PlayAI voice)
- **API Base**: `https://api.groq.com/openai/v1`

### State Management
- **Context API**: Custom AuthContext for user state
- **Theme**: next-themes for dark mode
- **Local Storage**: Client-side data persistence

### Development Tools
- **Build Tool**: Next.js built-in compiler
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Analytics**: Vercel Analytics

## 📦 Project Structure

```
Tutorism/
├── app/
│   ├── login/page.tsx          # Authentication page
│   ├── students/page.tsx       # Students showcase
│   ├── tutors/page.tsx         # Tutors showcase
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page (AI chat)
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # 50+ Radix UI components
│   ├── ai-tutor-chat.tsx       # Main chat interface
│   ├── navbar.tsx              # Navigation bar
│   ├── footer.tsx              # Footer component
│   └── theme-provider.tsx      # Theme context provider
├── lib/
│   ├── auth-context.tsx        # Authentication context
│   ├── groq-client.ts          # Groq API integration
│   └── utils.ts                # Utility functions
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notifications hook
└── styles/
    └── globals.css             # Additional global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tutorism
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure API Key**
   
   The Groq API key is currently hardcoded in `lib/groq-client.ts`. For production, move it to environment variables:
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
   ```
   
   Update `lib/groq-client.ts`:
   ```typescript
   const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY
   ```

4. **Run development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
pnpm build
pnpm start
```

## 💡 Usage Guide

### Using the AI Tutor

1. **Select Your Subject**: Choose from 20+ domains (e.g., Web Development, Physics)
2. **Set Your Level**: Pick Beginner, Intermediate, or Advanced
3. **Ask Questions**: 
   - Type in the text area and press Enter or click Send
   - OR click the microphone icon to speak your question
4. **Listen to Responses**: 
   - Auto-play enabled by default
   - Click Play button on individual messages to replay
   - Toggle auto-play in the header

### Authentication

- **Login**: Use demo accounts or create your own
- **Signup**: Choose role (Student/Tutor), provide name, email, and password (6+ chars)
- **Logout**: Available in navbar (when not simplified)

### Voice Features

- **Recording**: Click microphone button, speak, click again to stop
- **Transcription**: Automatic conversion to text
- **TTS Playback**: 
  - High-quality Groq TTS (limited by rate limits)
  - Falls back to browser's built-in TTS
  - Manual controls available on each message

## 🎨 Customization

### Themes
The app supports dark and light modes. Toggle using the sun/moon icon in the navbar.

### Styling
- Global styles: `app/globals.css`
- Tailwind config: Uses Tailwind CSS 4 with PostCSS
- Custom gradients and glassmorphism effects defined in CSS

### Adding New Subjects
Edit `DOMAINS` array in `components/ai-tutor-chat.tsx`:
```typescript
{ value: "your-subject", label: "Your Subject Name" }
```

### Modifying AI Behavior
Customize system prompts in `generateResponse()` function in `components/ai-tutor-chat.tsx`.

## 🔒 Security Notes

⚠️ **Important**: The current implementation includes a hardcoded API key for demonstration purposes. For production:

1. Move API key to environment variables
2. Implement server-side API routes to protect the key
3. Add rate limiting
4. Implement proper authentication/authorization
5. Use secure session management instead of localStorage

## 📱 Responsive Design

- **Mobile**: Optimized for small screens with collapsible navigation
- **Tablet**: Adaptive grid layouts
- **Desktop**: Full-featured interface with multi-column layouts

## 🤝 Contributing

Created with ❤️ by **Salar Shah**

## 📄 License

This project is private and not currently open-sourced.

## 🐛 Known Issues

1. **TTS Rate Limiting**: Groq's TTS API has rate limits; app falls back to browser TTS
2. **Audio Length**: TTS is limited to ~900 characters; longer responses are truncated for speech
3. **TypeScript Build**: Build errors are ignored (see `next.config.mjs`)

## 🔮 Future Enhancements

- [ ] User progress tracking and analytics
- [ ] Course creation and management
- [ ] Real-time tutor-student matching
- [ ] Video call integration
- [ ] Assignment submission and grading
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Payment integration for premium features

## 📞 Support

For questions or support, please contact the development team.

---

**Version**: 0.1.0  
**Last Updated**: December 2024  
**Framework**: Next.js 16 with React 19
