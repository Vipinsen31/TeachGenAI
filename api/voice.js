export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "ELEVENLABS_API_KEY is not configured in Vercel"
      });
    }

    const { action, audioBase64, voiceId, text } = req.body || {};

    // ACTION 1: Create voice clone
    if (action === "clone") {
      if (!audioBase64) {
        return res.status(400).json({
          success: false,
          error: "Please record or upload your voice first"
        });
      }

      const match = audioBase64.match(
        /^data:([^;]+);base64,(.+)$/
      );

      const mimeType = match ? match[1] : "audio/webm";
      const base64Data = match ? match[2] : audioBase64;

      const audioBuffer = Buffer.from(base64Data, "base64");

      if (!audioBuffer.length) {
        return res.status(400).json({
          success: false,
          error: "The voice recording is empty"
        });
      }

      const form = new FormData();

      form.append("name", "TeachGenAI My Voice");
      form.append(
        "description",
        "Voice for the user's TeachGenAI educational lessons"
      );

      form.append(
        "files",
        new Blob([audioBuffer], { type: mimeType }),
        mimeType.includes("wav")
          ? "my-voice.wav"
          : mimeType.includes("mpeg") || mimeType.includes("mp3")
          ? "my-voice.mp3"
          : "my-voice.webm"
      );

      const response = await fetch(
        "https://api.elevenlabs.io/v1/voices/add",
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey
          },
          body: form
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        return res.status(502).json({
          success: false,
          error: "ElevenLabs returned an unexpected response. Check your API endpoint and deployment."
        });
      }

      if (!response.ok) {
        const detail = data?.detail;
        const message =
          typeof detail === "string"
            ? detail
            : detail?.message ||
              data?.message ||
              "ElevenLabs voice cloning failed";

        return res.status(response.status).json({
          success: false,
          error: message
        });
      }

      if (!data.voice_id) {
        return res.status(502).json({
          success: false,
          error: "ElevenLabs did not return a voice ID"
        });
      }

      return res.status(200).json({
        success: true,
        voiceId: data.voice_id,
        message: "Voice clone created successfully"
      });
    }

    // ACTION 2: Generate speech using cloned voice
    if (action === "speech") {
      if (!voiceId || !text) {
        return res.status(400).json({
          success: false,
          error: "Voice ID and narration text are required"
        });
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2"
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        return res.status(response.status).json({
          success: false,
          error: errorText.slice(0, 1000) ||
            "Speech generation failed"
        });
      }

      const audioBuffer = Buffer.from(
        await response.arrayBuffer()
      );

      return res.status(200).json({
        success: true,
        audioBase64: audioBuffer.toString("base64"),
        mimeType: "audio/mpeg"
      });
    }

    return res.status(400).json({
      success: false,
      error: "Invalid action. Use clone or speech."
    });

  } catch (error) {
    console.error("TeachGenAI Voice API error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Voice server error"
    });
  }
}
