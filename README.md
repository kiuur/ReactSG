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

## How to Get User ID and Session ID

### Method 1: Using Kiwi Browser on Android (Recommended for Mobile)

Standard mobile browsers hide `HttpOnly` cookies like `sessionid`. Using Kiwi Browser allows you to install browser extensions and view cookies directly on Android.

1. **Install Kiwi Browser**:
   - Download and install **Kiwi Browser** from the Google Play Store.

2. **Install Cookie-Editor Extension**:
   - Open Kiwi Browser and open the Chrome Web Store:
     `https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm`
   - Tap **Add to Chrome**.

3. **Get Your Credentials**:
   - Open `https://www.instagram.com` in Kiwi Browser and log in to your account.
   - Tap the **three dots menu (⋮)** in the top-right corner of Kiwi Browser.
   - Scroll down to the bottom and tap **Cookie-Editor**.
   - Look for the following cookies:
     - `ds_user_id`: Copy the numeric value for your **User ID** (e.g. `73356967687`).
     - `sessionid`: Copy the long alphanumeric value for your **Session ID** (e.g. `73356967687%3Af3Myu...`).

---

### Method 2: Using Desktop Browser (PC / Laptop)

1. Open `https://www.instagram.com` in your PC browser (Chrome, Edge, Brave, or Firefox) and log in.
2. Press `F12` on your keyboard (or right-click anywhere and select **Inspect**).
3. Navigate to the **Application** tab (named **Storage** in Firefox).
4. In the left panel, expand **Cookies** and click on `https://www.instagram.com`.
5. Locate the following entries in the table:
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
