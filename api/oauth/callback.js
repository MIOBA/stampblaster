// api/oauth/callback.js

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  // SlackのOAuthトークンを取得
  const tokenRes = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri: 'https://stampblaster.vercel.app/api/oauth/callback',
    })
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.ok) {
    return res.status(500).json({ error: 'Token exchange failed', details: tokenData });
  }

  const accessToken = tokenData.access_token;

  // 💬 スタンプ送信のテスト（任意の投稿に対して）
  const reactionRes = await fetch('https://slack.com/api/reactions.add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      name: 'clap', // ← ここを +1 / tada などに変えてOK
      channel: 'C02TNGTT2LB',
      timestamp: '1744615568.673089' // ← 対象メッセージの ts
    })
  });

  const reactionData = await reactionRes.json();

  if (!reactionData.ok) {
    return res.status(500).json({ error: 'Reaction failed', details: reactionData });
  }

  res.status(200).send('✅ スタンプ送信成功しました！');
}
