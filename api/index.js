
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, language } = req.body || {};

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY is not configured"
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content:
                "You are TeachGenAI, an educational content generator. Create simple, accurate educational lessons with learning objectives, explanation, examples, and 4 video scenes."
            },
            {
              role: "user",
              content:
                `Create an educational lesson about "${topic}" in ${language || "English"}.`
            }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Groq API request failed"
      });
    }

    return res.status(200).json({
      success: true,
      lesson: data.choices?.[0]?.message?.content || ""
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
