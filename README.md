# ReactSG

A lightweight, automated Instagram bot to watch (view) and react (like) to stories of mutual friends. Supports both standalone continuous mode (Termux/VPS) and serverless deployment (Vercel + Cron).

---

## Features

- **Auto View Story**: Automatically views friends' stories, officially registering your account in the story viewers list.
- **Auto Like / React Story**: Automatically likes new stories from mutual friends.
- **Mutual Friends Only**: Strictly targets accounts that follow you back (mutual followers). Non-mutual accounts are completely ignored.
- **Efficient Batch Requests**: Uses official batch reels media endpoints to avoid rate limits (no HTTP 429 errors).
- **Dual Mode Support**:
  - **Standalone Mode**: Runs continuously in terminal or background worker.
  - **Serverless API Mode**: Runs on Vercel as an on-demand serverless function triggered by a cron job.
- **Secure & Dynamic**: Device ID and Android ID are dynamically generated via Node.js native crypto module.
- **Minimalist Output**: Clean console output in CLI and clean JSON responses in API mode.

---

## Option 1: Running on Termux / VPS (Standalone)

### Prerequisites

- Node.js v18 or higher.
- Internet connection.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kiuur/ReactSG.git
   cd ReactSG
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the bot**:
   ```bash
   node index.js
   ```

4. **Login**:
   - On first run, enter your Username and Password when prompted.
   - The session will be saved in `sessions/<username>.json`.
   - On subsequent runs, it connects automatically using the saved session.

---

## Option 2: Deploying to Vercel (Serverless / 24 Hours)

You can run this bot serverless on Vercel without keeping your device turned on.

### 1. Deploy to Vercel

Push the repository to GitHub and import it into Vercel, or deploy using the Vercel CLI:
```bash
vercel
```

### 2. Set Environment Variables in Vercel

In your Vercel Project Dashboard (`Settings` -> `Environment Variables`), add:

- `IG_SESSION`: Copy and paste the entire JSON content of your saved session file (`sessions/<username>.json`).
- `CRON_SECRET` *(Optional but recommended)*: A private password/secret token to protect your endpoint (e.g. `mysecrettoken123`).

### 3. Setup Automated Cron Trigger

Because Vercel serverless functions execute on request, trigger your endpoint periodically using a free cron service (such as [cron-job.org](https://cron-job.org)):

- **URL**: `https://your-vercel-domain.vercel.app/api?key=mysecrettoken123`
- **Schedule**: Every 5 or 10 minutes.
- **Method**: GET

Each request will fetch mutual friends' stories, view and like any new stories, and return a summary in JSON.

---

## Directory Structure

```text
├── api/
│   └── index.js        # Vercel serverless function handler
├── sessions/           # Local saved account sessions (*.json)
├── index.js            # Bot core class & standalone runner
├── vercel.json         # Vercel deployment configuration
├── package.json        # Project dependencies
├── .gitignore          # Ignored files
└── README.md           # Documentation
```

---

## Privacy & Security

- **No Hardcoded Credentials**: No personal identifiers or account details are committed in the code.
- **Git Ignored Sessions**: The `sessions/` directory is excluded from git.
- **Private Endpoint**: When deploying to Vercel, use `CRON_SECRET` so only authorized requests can trigger the bot.

---

## Disclaimer

This project is created for educational and personal automation purposes only. Use it responsibly and in accordance with Instagram Community Guidelines and Terms of Service. The author is not responsible for any misuse or account restrictions imposed by Instagram.
