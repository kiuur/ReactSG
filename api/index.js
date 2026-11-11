const { InstagramStoryBot } = require('../index.js');

module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.authorization;
    const authQuery = req.query ? req.query.key : null;
    const provided = authQuery || (authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null);

    if (provided !== secret) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  }

  try {
    const bot = new InstagramStoryBot();

    if (!bot.sessionId || !bot.userId) {
      return res.status(400).json({
        status: 'error',
        message: 'No active session found. Set IG_SESSION environment variable.',
      });
    }

    const result = await bot.runCycle();

    return res.status(200).json({
      status: 'ok',
      user: bot.username || bot.userId,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Internal server error',
    });
  }
};
