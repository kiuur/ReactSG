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

## How to Get User ID and Session ID via Kiwi Browser (Android)

Kiwi Browser has built-in Chrome Developer Tools (DevTools), allowing you to extract `HttpOnly` cookies directly without installing any browser extensions:

1. **Install Kiwi Browser**:
   - Download and install **Kiwi Browser** from the Google Play Store.

2. **Login to Instagram**:
   - Open Kiwi Browser, go to `https://www.instagram.com`, and log in to your account.

3. **Open Developer Tools**:
   - Tap the **three dots menu (⋮)** in the top-right corner of Kiwi Browser.
   - Scroll down and tap **Developer Tools**.

4. **Navigate to Cookies**:
   - In the top tab bar (*Elements, Console, Sources...*), scroll to the right and tap **Application** (or **Storage**).
   - In the left menu, expand **Cookies** and select `https://www.instagram.com`.

5. **Copy the Values**:
   - `ds_user_id`: Tap or double-tap the value column to copy your numeric **User ID** (e.g. `73356967687`).
   - `sessionid`: Tap or double-tap the value column to copy your **Session ID** (e.g. `73356967687%3Af3Myu...`).

---

## Alternative: Desktop Browser (PC / Laptop)

1. Open `https://www.instagram.com` in your PC browser (Chrome, Edge, Brave, or Firefox) and log in.
2. Press `F12` on your keyboard (or right-click anywhere and select **Inspect**).
3. Go to the **Application** tab (named **Storage** in Firefox).
4. In the left panel, expand **Cookies** and click on `https://www.instagram.com`.
5. Find:
   - `ds_user_id`: Copy its value for your **User ID**.
   - `sessionid`: Copy its value for your **Session ID**.

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
     乂 - Session ID: 73356967687%3Af3MyuLxE6DDNFM%3A16%3AAYlfj65Mz...
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
