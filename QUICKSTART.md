# ⚡ Quick Start - Carrot Chat App

Get up and running in 5 minutes!

## 🚀 Installation Commands

Copy and paste these commands:

```bash
# 1. Install dependencies (1-2 minutes)
npm install

# 2. Create environment file (REQUIRED!)
# You MUST do this step manually:
```

### ⚠️ CRITICAL STEP: Create `.env.local`

**Windows PowerShell:**
```powershell
New-Item -Path .env.local -ItemType File
```

**Windows Command Prompt:**
```cmd
type nul > .env.local
```

**Mac/Linux:**
```bash
touch .env.local
```

Then **open `.env.local` in your editor** and add:

```
ANTHROPIC_API_KEY=key
```

### ✅ Continue Installation

```bash
# 3. Run development server
npm run dev
```

## 🎉 Success!

Open your browser to: **http://localhost:3000**

You should see:
- 🥕 Carrot Chat header
- Beautiful orange/carrot themed UI
- Chat input at the bottom
- Theme toggle in top-right

## 🧪 Test It

1. Type: "Hello, what can you help me with?"
2. Press Enter
3. Watch the AI respond!

## 🛠️ Troubleshooting

### Error: "Missing ANTHROPIC_API_KEY"

**Solution**: You didn't create `.env.local` properly.

1. Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
2. Put it in the root folder (same level as `package.json`)
3. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Error: "Port 3000 is already in use"

**Solution**: Use a different port:

```bash
npm run dev -- -p 3001
```

### Error: Module not found

**Solution**: Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

Your folder should look like this:

```
carrot-chat-app/
├── .env.local          ⬅️ YOU CREATE THIS
├── .gitignore          ✅ Already created
├── package.json        ✅ Already created
├── app/                ✅ Already created
├── lib/                ✅ Already created
├── types/              ✅ Already created
└── ... other files
```

## 🎨 Features to Try

1. **Dark Mode**: Click the moon/sun icon
2. **Markdown**: Ask AI to write code
3. **Copy**: Click copy button on any message
4. **Clear Chat**: Click "Clear Chat" button
5. **Multi-line**: Use Shift+Enter for new lines

## 🚢 Deploy to Vercel (Optional)

Once it works locally:

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Deploy at vercel.com
# 1. Import your GitHub repo
# 2. Add ANTHROPIC_API_KEY to environment variables
# 3. Deploy!
```

## 📚 Need More Help?

- Full setup guide: [SETUP.md](./SETUP.md)
- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Main documentation: [README.md](./README.md)

---

**That's it! You're ready to chat with Carrot AI! 🥕✨**

