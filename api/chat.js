// api/chat.js
export default async function handler(req, res) {
  try {
    const { message } = req.method === "POST" ? JSON.parse(req.body) : { message: null };

    if (!message) return res.status(400).json({ error: "No message provided" });

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        max_tokens: 200
      }),
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "No reply";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
