export default async function handler(req, res) {
// Allow your GitHub Pages website to access this API
res.setHeader(
"Access-Control-Allow-Origin",
"https://vipinsen31.github.io"
);
res.setHeader(
"Access-Control-Allow-Methods",
"POST, OPTIONS"
);
res.setHeader(
"Access-Control-Allow-Headers",
"Content-Type, Authorization"
);

// Handle browser CORS preflight
if (req.method === "OPTIONS") {
return res.status(200).end();
}

// Allow only POST requests for lesson generation
if (req.method !== "POST") {
return res.status(405).json({
success: false,
error: "Method not allowed. Please use POST."
});
}

try {
const { topic, language } = req.body || {};

// Check topic
if (!topic || !String(topic).trim()) {
  return res.status(400).json({
    success: false,
    error: "Please enter a lesson topic."
  });
}

// Check Groq API key
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  return res.status(500).json({
    success: false,
    error: "GROQ_API_KEY is missing in Vercel Environment Variables."
  });
}

// Generate educational lesson using Groq
const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `

You are TeachGenAI, an intelligent educational video lesson generator.

Create a well-organized educational lesson in the requested language.

Include:

1. Lesson title
2. Learning objectives
3. Introduction
4. Simple explanation of the topic
5. Important points
6. Examples
7. Four video scenes, each with a scene title, visual description, on-screen text, and narration
8. Summary
9. Conclusion

Use student-friendly language and accurate information.
Return the lesson as readable text with clear headings.
".trim() }, { role: "user", content: "Create an educational lesson about "${String(topic).trim()}" in ${language || "English"}.`
}
],
temperature: 0.7,
max_completion_tokens: 4000
})
}
);

const data = await response.json();

// Handle Groq API errors
if (!response.ok) {
  console.error("Groq API error:", data);

  return res.status(response.status).json({
    success: false,
    error:
      data?.error?.message ||
      "Groq could not generate the lesson. Please try again."
  });
}

const lesson = data?.choices?.[0]?.message?.content;

if (!lesson || !lesson.trim()) {
  return res.status(502).json({
    success: false,
    error: "The AI returned an empty lesson. Please try again."
  });
}

// Successful response
return res.status(200).json({
  success: true,
  lesson: lesson
});

} catch (error) {
console.error("TeachGenAI server error:", error);

return res.status(500).json({
  success: false,
  error: "Server error while generating the lesson. Please try again."
});

}
}
