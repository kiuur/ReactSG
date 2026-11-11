# ReactSG

A lightweight, automated Instagram bot to watch (view) and react (like) to stories of mutual friends.

---

## Features

- **Auto View Story**: Automatically views friends' stories, officially registering your account in the story viewers list.
- **Auto Like / React Story**: Automatically likes new stories from mutual friends.
- **Mutual Friends Only**: Strictly targets accounts that follow you back (mutual followers). Non-mutual accounts are completely ignored.
- **Efficient Batch Requests**: Uses official batch reels media endpoints to avoid rate limits (no HTTP 429 errors).
- **Session-Based Authentication**: Uses direct Session ID input, completely bypassing login checkpoints, 2FA challenges, and anti-scripting blocks.
- **Zero External Dependencies**: Built entirely using native Node.js standard libraries.
- **Secure & Dynamic**: Device ID and Android ID are dynamically generated via Node.js native crypto module.
- **Minimalist Output**: Clean, unobtrusive console output (`— berhasil terhubung ke: @username`).

---

## Prerequisites

- **Node.js** v18 or higher (Compatible with Termux on Android, Linux, macOS, and Windows).
- Stable internet connection.

---

## Installation & Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kiuur/ReactSG.git
   cd ReactSG
   ```

2. **Run the bot**:
   ```bash
   node index.js
   ```

3. **Session Setup (First run only)**:
   - When prompted, enter your **User ID** and **Session ID**:
     ```text
     乂 - User ID: 73356967687
     乂 - Session ID: your_session_id_here
     ```
   - The bot will automatically verify the session, fetch your official username, and save it to `sessions/<username>.json`.
   - On subsequent runs, the bot connects automatically without asking for credentials again.

---

## Directory Structure

```text
├── sessions/           # Saved account sessions (*.json)
├── index.js            # Main bot script
├── package.json        # Project metadata
├── .gitignore          # Ignored files
└── README.md           # Documentation
```

---

## Privacy & Security

- **No Hardcoded Credentials**: No personal identifiers or account details are committed in the code.
- **Git Ignored Sessions**: The `sessions/` directory is excluded from git to prevent accidental commits of private session tokens.

---

## Disclaimer

This project is created for educational and personal automation purposes only. Use it responsibly and in accordance with Instagram Community Guidelines and Terms of Service. The author is not responsible for any misuse or account restrictions imposed by Instagram.
