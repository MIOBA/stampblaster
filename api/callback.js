export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code");
  res.status(200).send(`✅ 認証成功！Code: ${code}`);
}
