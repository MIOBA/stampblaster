export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code from query');
  }

  return res.status(200).send(`Success! Your code is: ${code}`);
}
