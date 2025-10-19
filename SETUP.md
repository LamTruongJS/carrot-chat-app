# 🛠️ Setup Guide - Carrot Chat App

## Step-by-Step Installation

### 1. Install Node.js

Make sure you have Node.js 18 or higher installed:

```bash
node --version
# Should show v18.x.x or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- Anthropic SDK
- Framer Motion
- React Markdown
- Tailwind CSS
- And more...

### 3. Create Environment File

**CRITICAL STEP**: You need to manually create the `.env.local` file because it's not included in the repository for security reasons.

Create a new file named `.env.local` in the root directory:

**On Windows:**
```cmd
type nul > .env.local
```

**On Mac/Linux:**
```bash
touch .env.local
```

Then open `.env.local` in your editor and add:

```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

⚠️ **IMPORTANT**: 
- This file should NEVER be committed to git
- It's already in `.gitignore`
- Each developer needs to create their own `.env.local`

### 4. Verify Setup

Check that your `.env.local` file exists and has the correct content:

**On Windows:**
```cmd
dir .env.local
type .env.local
```

**On Mac/Linux:**
```bash
ls -la .env.local
cat .env.local
```

You should see the API key starting with `sk-ant-api03-`

### 5. Run Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in Xs
```

### 6. Open Browser

Navigate to: **http://localhost:3000**

You should see the Carrot Chat interface with:
- 🥕 Logo in the header
- "Carrot Chat" title
- Theme toggle button
- Chat input at the bottom
- Welcome message in the center

### 7. Test the Chat

1. Type a message like "Hello!"
2. Press Enter or click Send
3. You should see:
   - Your message appear with a user avatar
   - A "Thinking..." indicator
   - Claude's response streaming in

## Troubleshooting

### Problem: "Missing ANTHROPIC_API_KEY"

**Cause**: The `.env.local` file is missing or incorrectly formatted.

**Solution**:
1. Make sure `.env.local` exists in the root directory (same level as `package.json`)
2. Check the file contains: `ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx`
3. No spaces around the `=` sign
4. No quotes around the key
5. Restart the dev server after creating the file

### Problem: Port 3000 Already in Use

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

Or kill the process using port 3000:

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Problem: Module Not Found Errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: TypeScript Errors

**Solution**:
```bash
# Check for errors
npm run build

# If errors persist, try:
rm -rf .next
npm run dev
```

### Problem: Styling Issues

**Solution**:
```bash
# Make sure Tailwind is properly configured
# Check that globals.css is imported in layout.tsx
# Clear cache and rebuild:
rm -rf .next
npm run dev
```

## Environment Variables Explained

### `.env.local` (NEVER commit)
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx  # Your actual API key
```

This file contains sensitive information and should NEVER be pushed to git.

### `.env.example` (Safe to commit)
```bash
ANTHROPIC_API_KEY=your-api-key-here
```

This is a template that shows what environment variables are needed.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## File Structure Verification

Make sure your project has this structure:

```
carrot-chat-app/
├── app/
│   ├── api/chat/route.ts
│   ├── components/
│   │   ├── ChatContainer.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ThemeToggle.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── anthropic.ts
│   └── utils.ts
├── types/
│   └── chat.ts
├── .env.local              ← YOU MUST CREATE THIS
├── .env.example
├── .gitignore
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Security Checklist

Before deploying or sharing your code:

- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` is NOT committed to git
- [ ] API keys are not hardcoded anywhere
- [ ] `.env.example` only contains placeholder text
- [ ] Environment variables are set in hosting platform (Vercel, etc.)

## Getting Help

If you're still having issues:

1. Check the main [README.md](./README.md)
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Check [Anthropic API docs](https://docs.anthropic.com/)
4. Search for similar issues on GitHub

## Next Steps

Once everything is working:

1. ✅ Customize the theme colors
2. ✅ Deploy to Vercel
3. ✅ Add custom features
4. ✅ Share with friends!

Happy coding! 🥕

