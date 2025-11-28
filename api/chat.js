// ===============================================
// API Chat usando OpenRouter (modelo gratuito Mistral-7B)
// Lee la API Key desde Vercel: OPENROUTER_API_KEY
// Configurado para ESM y captura correcta de output
// ===============================================

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Falta el campo 'message'" });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API Key de OpenRouter no configurada" });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "system", content: "Sos una IA útil." },
          { role: "user", content: message }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) return res.status(500).json({ error: data });

    // Captura preferente: output_text si existe, sino fallback
    const reply = data.output_text?.trim() || 
                  data?.choices?.[0]?.message?.content || 
                  data?.choices?.[0]?.content || 
                  "No hay respuesta";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("ERROR SERVER:", error);
    res.status(500).json({ error: "Server error" });
  }
}
