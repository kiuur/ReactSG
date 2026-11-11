const path = require('path');
const dns = require('dns');
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const { encryptPassword } = require('instagram-password-encryption');

try {
  if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

class InstagramStoryBot {
  constructor() {
    this.sessionsDir = path.join(__dirname, 'sessions');
    this.username = '';
    this.password = '';
    this.userId = '';
    this.sessionId = '';
    this.csrfToken = '';
    this.fullCookie = '';
    this.deviceId = crypto.randomUUID();
    this.androidId = 'android-' + crypto.randomBytes(8).toString('hex');

    this.processedStories = new Set();
    this.friends = new Map();

    if (!fs.existsSync(this.sessionsDir)) {
      try {
        fs.mkdirSync(this.sessionsDir, { recursive: true });
      } catch (e) {}
    }

    this.loadSession();
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  askQuestion(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    });
  }

  async fetchUsername() {
    try {
      const res = await fetch(`https://i.instagram.com/api/v1/users/${this.userId}/info/`, {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user && data.user.username) {
          this.username = data.user.username;
        }
      }
    } catch (e) {}
  }

  async applySessionInput(input) {
    if (!input) return false;
    let sid = '';
    let uid = '';
    let csrf = '';

    if (input.includes('sessionid=')) {
      const matchSid = input.match(/sessionid=([^;]+)/);
      if (matchSid) sid = matchSid[1];
      const matchUid = input.match(/ds_user_id=([^;]+)/);
      if (matchUid) uid = matchUid[1];
      const matchCsrf = input.match(/csrftoken=([^;]+)/);
      if (matchCsrf) csrf = matchCsrf[1];
    } else {
      sid = input.trim();
    }

    if (!uid && sid) {
      const decoded = decodeURIComponent(sid);
      const parts = decoded.split(':');
      if (parts[0] && /^\d+$/.test(parts[0])) {
        uid = parts[0];
      }
    }

    if (sid && uid) {
      this.sessionId = sid;
      this.userId = uid;
      if (csrf) this.csrfToken = csrf;
      this.fullCookie = `sessionid=${this.sessionId}; ds_user_id=${this.userId}${this.csrfToken ? `; csrftoken=${this.csrfToken}` : ''}`;
      await this.fetchUsername();
      this.saveSession();
      return true;
    }
    return false;
  }

  promptCredentials() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question('乂 - Username: ', (u) => {
        rl.question('乂 - Password: ', (p) => {
          rl.close();
          resolve({
            username: u.replace(/^@/, '').trim(),
            password: p.trim(),
          });
        });
      });
    });
  }

  loadSession() {
    try {
      if (process.env.IG_SESSION) {
        let envData = null;
        try {
          envData = JSON.parse(process.env.IG_SESSION);
        } catch (e) {
          envData = { sessionId: process.env.IG_SESSION };
        }
        if (envData && envData.sessionId) {
          if (envData.username) this.username = envData.username;
          if (envData.userId) this.userId = String(envData.userId);
          this.sessionId = envData.sessionId;
          this.csrfToken = envData.csrfToken || '';
          this.fullCookie = envData.fullCookie || `sessionid=${this.sessionId}; ds_user_id=${this.userId}`;
          if (envData.deviceId) this.deviceId = envData.deviceId;
          if (envData.androidId) this.androidId = envData.androidId;
          return true;
        }
      }

      if (!fs.existsSync(this.sessionsDir)) return false;

      let targetFile = null;
      if (this.username) {
        const namedPath = path.join(this.sessionsDir, `${this.username}.json`);
        if (fs.existsSync(namedPath)) {
          targetFile = namedPath;
        }
      }

      if (!targetFile) {
        const files = fs.readdirSync(this.sessionsDir).filter((f) => f.endsWith('.json'));
        if (files.length > 0) {
          targetFile = path.join(this.sessionsDir, files[0]);
        }
      }

      if (!targetFile || !fs.existsSync(targetFile)) return false;

      const raw = fs.readFileSync(targetFile, 'utf8');
      const data = JSON.parse(raw);

      if (data.sessionId && data.userId) {
        if (data.username) this.username = data.username;
        this.userId = String(data.userId);
        this.sessionId = data.sessionId;
        this.csrfToken = data.csrfToken || '';
        this.fullCookie = data.fullCookie || '';
        if (data.deviceId) this.deviceId = data.deviceId;
        if (data.androidId) this.androidId = data.androidId;
        return true;
      }
    } catch (e) {}
    return false;
  }

  saveSession() {
    try {
      if (!fs.existsSync(this.sessionsDir)) {
        fs.mkdirSync(this.sessionsDir, { recursive: true });
      }

      const data = {
        username: this.username,
        userId: this.userId,
        sessionId: this.sessionId,
        csrfToken: this.csrfToken,
        fullCookie: this.fullCookie,
        deviceId: this.deviceId,
        androidId: this.androidId,
        savedAt: new Date().toISOString(),
      };
      const jsonStr = JSON.stringify(data, null, 2);
      const filename = `${this.username || this.userId || 'session'}.json`;
      fs.writeFileSync(path.join(this.sessionsDir, filename), jsonStr, 'utf8');
    } catch (e) {}
  }

  async login() {
    try {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
      const initRes = await fetch('https://www.instagram.com/accounts/login/', {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
        },
      });

      const html = await initRes.text();
      const setCookies = initRes.headers.getSetCookie
        ? initRes.headers.getSetCookie()
        : initRes.headers.get('set-cookie')
        ? [initRes.headers.get('set-cookie')]
        : [];

      let pageCsrf = '';
      const initialCookies = [];
      for (const c of setCookies) {
        if (!c) continue;
        initialCookies.push(c.split(';')[0]);
        const mCsrf = c.match(/csrftoken=([^;]+)/);
        if (mCsrf) pageCsrf = mCsrf[1];
      }

      const mHash = html.match(/"rollout_hash":"([^"]+)"/) || html.match(/"client_revision":(\d+)/);
      const rolloutHash = mHash ? mHash[1] : '1053981060';

      const encMatch = html.match(
        /\["InstagramPasswordEncryption",\[\],\{"key_id":"(\d+)","public_key":"([a-f0-9]{64})","version":"(\d+)"\}/
      );
      if (!encMatch) {
        console.log('— gagal mengambil enkripsi login');
        return false;
      }

      const [, keyId, publicKey, version] = encMatch;
      const encPass = await encryptPassword(this.password, version, keyId, publicKey);

      const body = new URLSearchParams({
        enc_password: encPass,
        optIntoOneTap: 'false',
        queryParams: '{}',
        trustedDeviceRecords: '{}',
        username: this.username,
      });

      const cookieHeader = initialCookies.join('; ');
      const loginRes = await fetch('https://www.instagram.com/api/v1/web/accounts/login/ajax/', {
        method: 'POST',
        headers: {
          'User-Agent': ua,
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': pageCsrf,
          'X-Requested-With': 'XMLHttpRequest',
          'X-IG-App-ID': '936619743392459',
          'X-ASBD-ID': '129477',
          'X-Instagram-AJAX': rolloutHash,
          'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          Referer: 'https://www.instagram.com/accounts/login/',
          Origin: 'https://www.instagram.com',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          Cookie: cookieHeader,
        },
        body: body.toString(),
      });

      const data = await loginRes.json();
      const loginCookies = loginRes.headers.getSetCookie
        ? loginRes.headers.getSetCookie()
        : loginRes.headers.get('set-cookie')
        ? [loginRes.headers.get('set-cookie')]
        : [];

      let newSessionId = '';
      let newUserId = '';
      let newCsrf = pageCsrf;
      const cookieMap = new Map();

      for (const c of [...setCookies, ...loginCookies]) {
        if (!c) continue;
        const main = c.split(';')[0];
        const idx = main.indexOf('=');
        if (idx !== -1) {
          const k = main.substring(0, idx).trim();
          const v = main.substring(idx + 1).trim();
          cookieMap.set(k, v);
          if (k === 'sessionid') newSessionId = v;
          if (k === 'ds_user_id') newUserId = v;
          if (k === 'csrftoken') newCsrf = v;
        }
      }

      if (data.authenticated && newSessionId) {
        this.sessionId = newSessionId;
        this.userId = newUserId || String(data.userId);
        this.csrfToken = newCsrf;
        const fullCookieArr = [];
        cookieMap.forEach((v, k) => fullCookieArr.push(`${k}=${v}`));
        this.fullCookie = fullCookieArr.join('; ');

        this.saveSession();
        return true;
      }

      if (data.error_type === 'UserInvalidCredentials' || data.error_type === 'FakeIncorrectPassword') {
        console.log('— password atau username salah');
        return false;
      }

      if (data.message === 'checkpoint_required') {
        this.lastCheckpointUrl = data.checkpoint_url ? `https://www.instagram.com${data.checkpoint_url}` : '';
        console.log('— verifikasi checkpoint diperlukan');
        if (this.lastCheckpointUrl) {
          console.log(`— link verifikasi: ${this.lastCheckpointUrl}`);
        }
        return false;
      }

      console.log('— login gagal:', data.message || 'unknown error');
    } catch (err) {
      console.log(`— gagal login: ${err.message}`);
    }

    return false;
  }

  getHeaders() {
    const authPayload = Buffer.from(
      JSON.stringify({
        ds_user_id: this.userId,
        sessionid: this.sessionId,
        should_use_header_over_cookies: true,
      })
    ).toString('base64');

    return {
      'User-Agent':
        'Instagram 448.0.0.0.20 Android (34/14; 480dpi; 1344x2992; Google/google; Pixel 8 Pro; husky; husky; en_US; 1065560286)',
      'X-IG-App-ID': '567067343352427',
      'X-IG-Device-ID': this.deviceId,
      'X-IG-Android-ID': this.androidId,
      'X-IG-Capabilities': '3brTv10=',
      'X-CSRFToken': this.csrfToken,
      'IG-INTENDED-USER-ID': this.userId,
      'IG-U-DS-USER-ID': this.userId,
      Authorization: `Bearer IGT:2:${authPayload}`,
      Cookie: this.fullCookie,
    };
  }

  async fetchMutualFriends() {
    const followingMap = new Map();
    const followersSet = new Set();
    const mutualFriends = new Map();

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        let maxId = '';
        do {
          const url = `https://i.instagram.com/api/v1/friendships/${this.userId}/following/?count=200${maxId ? `&max_id=${maxId}` : ''}`;
          const res = await fetch(url, { method: 'GET', headers: this.getHeaders() });
          if (res.ok) {
            const data = await res.json();
            for (const u of data.users || []) {
              followingMap.set(String(u.pk || u.id), u.username);
            }
            maxId = data.next_max_id || '';
          } else {
            break;
          }
        } while (maxId);
        if (followingMap.size > 0) break;
      } catch (err) {
        if (attempt < 3) await this.sleep(1000);
      }
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        let maxId = '';
        do {
          const url = `https://i.instagram.com/api/v1/friendships/${this.userId}/followers/?count=200${maxId ? `&max_id=${maxId}` : ''}`;
          const res = await fetch(url, { method: 'GET', headers: this.getHeaders() });
          if (res.ok) {
            const data = await res.json();
            for (const u of data.users || []) {
              followersSet.add(String(u.pk || u.id));
            }
            maxId = data.next_max_id || '';
          } else {
            break;
          }
        } while (maxId);
        if (followersSet.size > 0) break;
      } catch (err) {
        if (attempt < 3) await this.sleep(1000);
      }
    }

    for (const [id, username] of followingMap.entries()) {
      if (followersSet.has(id)) {
        mutualFriends.set(id, username);
      }
    }

    return mutualFriends;
  }

  async fetchReelsMedia(userIds) {
    if (!userIds || userIds.length === 0) return {};
    try {
      const params = new URLSearchParams({
        user_ids: JSON.stringify(userIds),
        _uid: this.userId,
      });

      const res = await fetch('https://i.instagram.com/api/v1/feed/reels_media/', {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        return data.reels || {};
      }
    } catch (err) {}
    return {};
  }

  async markStorySeen(item, friendUserId) {
    try {
      const storyMediaId = String(item.id || item.pk);
      const parts = storyMediaId.split('_');
      const mediaPk = parts[0];
      const authorId = String(friendUserId || (item.user && (item.user.pk || item.user.id)) || parts[1] || this.userId);

      const end = Math.floor(Date.now() / 1000);
      const begin = end - 3;

      const data = {
        container_module: 'feed_timeline',
        live_vods_skipped: {},
        nuxes_skipped: {},
        nuxes: {},
        reels: {
          [`${mediaPk}_${authorId}_${authorId}`]: [`${begin}_${end}`],
          [`${mediaPk}_${authorId}`]: [`${begin}_${end}`],
        },
        live_vods: {},
        reel_media_skipped: {},
        _uuid: this.deviceId,
        device_id: this.androidId,
      };

      const jsonStr = JSON.stringify(data);
      const body = `signed_body=SIGNATURE.${encodeURIComponent(jsonStr)}`;

      const res = await fetch('https://i.instagram.com/api/v2/media/seen/?reel=1&live_vod=0', {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: body,
      });

      if (res.ok) {
        const respData = await res.json();
        return respData.status === 'ok';
      }
    } catch (e) {}
    return false;
  }

  async sendStoryLike(storyMediaId, traySessionId, viewerSessionId) {
    const mediaPk = String(storyMediaId).split('_')[0];

    const params = new URLSearchParams({
      media_id: mediaPk,
      _uid: this.userId,
      source_of_like: 'button',
      tray_session_id: traySessionId || crypto.randomUUID(),
      viewer_session_id: viewerSessionId || crypto.randomUUID(),
      container_module: 'reel_feed_timeline',
    });

    try {
      const res = await fetch('https://i.instagram.com/api/v1/story_interactions/send_story_like/', {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        return data.status === 'ok';
      }
    } catch (err) {}
    return false;
  }

  async runCycle() {
    if (!this.sessionId || !this.userId) {
      return { friendsCount: 0, viewedCount: 0, likedCount: 0 };
    }

    this.friends = await this.fetchMutualFriends();
    const traySessionId = crypto.randomUUID();
    const viewerSessionId = crypto.randomUUID();

    const friendIds = Array.from(this.friends.keys()).filter((id) => id !== this.userId);
    const reels = await this.fetchReelsMedia(friendIds);

    let viewedCount = 0;
    let likedCount = 0;

    for (const [friendId, reelData] of Object.entries(reels)) {
      const items = reelData.items || [];

      for (const item of items) {
        const storyId = String(item.id || item.pk);

        if (!this.processedStories.has(storyId)) {
          this.processedStories.add(storyId);

          await this.markStorySeen(item, friendId);
          viewedCount++;
          await this.sleep(1500);

          if (!item.has_liked) {
            await this.sendStoryLike(storyId, traySessionId, viewerSessionId);
            likedCount++;
          }

          await this.sleep(1000);
        }
      }
    }

    return {
      friendsCount: this.friends.size,
      viewedCount,
      likedCount,
    };
  }

  async start() {
    if (!this.sessionId || !this.userId) {
      const input = await this.askQuestion('乂 - Masukkan Session ID: ');
      if (!input) return;

      const applied = await this.applySessionInput(input);
      if (!applied) {
        console.log('— session id tidak valid');
        return;
      }
    }

    console.log(`— berhasil terhubung ke: @${this.username || this.userId}`);

    let cycleCount = 0;

    while (true) {
      cycleCount++;
      await this.runCycle();
      await this.sleep(15000);
    }
  }
}

if (require.main === module) {
  const bot = new InstagramStoryBot();
  bot.start().catch((err) => {
    console.error('— error:', err.message || err);
    process.exit(1);
  });
}

module.exports = { InstagramStoryBot };