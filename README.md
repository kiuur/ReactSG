# ReactSG

A lightweight, automated Instagram bot to watch (view) and react (like) to stories of mutual friends.

---

## Features

- **Auto View Story**: Automatically views friends' stories, officially registering your account in the story viewers list.
- **Auto Like / React Story**: Automatically likes new stories from mutual friends.
- **Mutual Friends Only**: Strictly targets accounts that follow you back (mutual followers). Non-mutual accounts are completely ignored.
- **Efficient Batch Requests**: Uses official batch reels media endpoints to avoid rate limits (no HTTP 429 errors).
- **Automated Session Storage**: Saves authentication sessions to the `sessions/<username>.json` directory, eliminating the need to log in repeatedly.
- **Secure & Dynamic**: Device ID and Android ID are dynamically generated via Node.js native `crypto` module, leaving zero hardcoded identifiers in the codebase.
- **Minimalist Console Output**: Clean, unobtrusive terminal logs (`— berhasil terhubung ke: @username`).

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

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the bot**:
   ```bash
   node index.js
   ```
   *or*
   ```bash
   npm start
   ```

4. **Account Login (First run only)**:
   - When prompted in the terminal, enter your Instagram username and password.
   - Upon successful login, the session is saved in the `sessions/` folder.
   - On subsequent runs, the bot will automatically reconnect without prompting for credentials.

---

## Directory Structure

```text
├── index.js            # Main bot script
├── package.json        # Project dependency configuration
├── sessions/           # Saved account session storage (*.json)
├── .gitignore          # Files ignored by git
└── README.md           # Documentation
```

---

## Privacy & Security

- **No Hardcoded Credentials**: This project does not store or leak any personal identifiers or credentials.
- **Git Ignored Sessions**: The `sessions/` directory is listed in `.gitignore` to prevent committing private session tokens to public repositories.

---

## Disclaimer

This project is created for educational and personal automation purposes only. Use it responsibly and in accordance with Instagram Community Guidelines and Terms of Service. The author is not responsible for any misuse or account restrictions imposed by Instagram.
