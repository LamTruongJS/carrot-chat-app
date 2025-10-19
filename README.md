# 🥕 Carrot Chat App

A modern AI chat application built with Next.js 14, TypeScript, Tailwind CSS, and Anthropic Claude API.

![Carrot Chat](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎨 **Beautiful Carrot Theme** - Orange/carrot-themed UI with smooth animations
- 💬 **Real-time Chat** - Stream responses from Claude AI
- 💾 **Chat History** - Automatic save to localStorage
- 🌓 **Dark/Light Mode** - Toggle between themes with persistence
- 📝 **Markdown Support** - Full markdown rendering with syntax highlighting for code blocks
- ⚡ **Typing Indicator** - Visual feedback while AI is responding
- 📋 **Copy Messages** - Easy copy-to-clipboard functionality
- 🗑️ **Clear Chat** - Remove all messages with one click
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Secure** - API keys stored server-side only
- 🚀 **Fast** - Optimized with Next.js 14 App Router

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone or create the project:**

```bash
# If using this repository
git clone <your-repo-url>
cd carrot-chat-app

# Or create a new Next.js project
npx create-next-app@latest carrot-chat-app --typescript --tailwind --app
cd carrot-chat-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```bash
ANTHROPIC_API_KEY=key
```

⚠️ **IMPORTANT**: Never commit `.env.local` to version control!

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Dependencies

```json
{
  "@anthropic-ai/sdk": "^0.27.3",
  "next": "14.2.13",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "framer-motion": "^11.5.4",
  "react-markdown": "^9.0.1",
  "react-syntax-highlighter": "^15.5.0",
  "sonner": "^1.5.0",
  "lucide-react": "^0.441.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.2"
}
```

## 🏗️ Project Structure

```
carrot-chat-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint for Claude
│   ├── components/
│   │   ├── ChatContainer.tsx     # Main chat container
│   │   ├── ChatInput.tsx         # Message input component
│   │   ├── ChatMessage.tsx       # Individual message display
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with header
│   └── page.tsx                  # Home page
├── lib/
│   ├── anthropic.ts              # Anthropic client setup
│   └── utils.ts                  # Utility functions
├── types/
│   └── chat.ts                   # TypeScript types
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Example env file
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## 🔒 Security

This app implements several security best practices:

- ✅ API keys stored server-side only (never exposed to client)
- ✅ Input validation and sanitization
- ✅ Rate limiting on API routes
- ✅ XSS protection with React
- ✅ Environment variables properly configured

### Environment Variables

The app uses two environment files:

1. **`.env.local`** (NEVER commit this):
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

2. **`.env.example`** (Safe to commit):
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

Make sure `.env.local` is in your `.gitignore`!

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub (without `.env.local`)
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your actual API key
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Railway
- Fly.io

Just make sure to add the `ANTHROPIC_API_KEY` environment variable!

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  carrot: {
    500: "#FF6B35", // Change this to your color
    // ... other shades
  },
}
```

### Change AI Model

Edit `lib/anthropic.ts`:

```typescript
export const CLAUDE_MODEL = "claude-3-sonnet-20240229"; // Change model
```

Available models:
- `claude-3-5-sonnet-20241022` (Recommended)
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

## 📝 Features Breakdown

### Chat Container
- Auto-scrolls to latest message
- Saves chat history to localStorage
- Clear chat functionality
- Empty state with welcome message

### Chat Input
- Auto-resizing textarea
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Disabled state during AI response
- Loading indicator

### Chat Message
- User and AI avatars
- Timestamp display
- Markdown rendering
- Code syntax highlighting
- Copy to clipboard

### Theme Toggle
- Persists preference to localStorage
- Smooth transitions
- Respects system preference on first load

## 🐛 Troubleshooting

### API Key Issues

```bash
Error: Missing ANTHROPIC_API_KEY environment variable
```

**Solution**: Make sure `.env.local` exists with your API key.

### Rate Limit Error

```bash
Error: Too many requests
```

**Solution**: Wait a minute before trying again. The app has built-in rate limiting.

### Build Errors

```bash
npm run build
```

Check for TypeScript errors and fix them.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 💡 Tips

- Use Shift+Enter for multi-line messages
- The chat history is automatically saved
- Dark mode preference is remembered
- You can copy any message by clicking the copy button
- Clear chat removes all messages from localStorage

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the [Anthropic API docs](https://docs.anthropic.com/)
3. Check [Next.js documentation](https://nextjs.org/docs)

## 🎯 Roadmap

Future enhancements:
- [ ] Export chat history
- [ ] Multiple chat sessions
- [ ] Voice input
- [ ] Image upload support
- [ ] Custom system prompts
- [ ] User authentication
- [ ] Database persistence

---

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Anthropic Claude API.

**Happy Chatting! 🥕**

