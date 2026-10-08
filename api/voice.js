
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action, audioBase64, voiceId, text } = req.body || {};

    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: "ELEVENLABS_API_KEY is not configured"
      });
    }

    /*
      ACTION 1:
      Create your voice clone from your recording
    */

    if (action === "clone") {
      if (!audioBase64) {
        return res.status(400).json({
          error: "Voice recording is required"
        });
      }

      const base64Data =
        audioBase64.replace(/^data:.*?;base64,/, "");

      const audioBuffer =
        Buffer.from(base64Data, "base64");

      const form = new FormData();

      form.append(
        "name",
        "TeachGenAI My Voice"
      );

      form.append(
        "description",
        "User's own voice for educational narration"
      );

      form.append(
        "files[]",
        new Blob(
          [audioBuffer],
          { type: "audio/webm" }
        ),
        "my-voice.webm"
      );

      const response = await fetch(
        "https://api.elevenlabs.io/v1/voices/add",
        {
          method: "POST",
          headers: {
            "xi-api-key":
              process.env.ELEVENLABS_API_KEY
          },
          body: form
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error:
            data?.detail?.message ||
            data?.detail ||
            "Voice cloning failed"
        });
      }

      return res.status(200).json({
        success: true,
        voiceId: data.voice_id
      });
    }


    /*
      ACTION 2:
      Generate speech using your cloned voice
    */

    if (action === "speech") {
      if (!voiceId) {
        return res.status(400).json({
          error: "Voice ID is required"
        });
      }

      if (!text) {
        return res.status(400).json({
          error: "Narration text is required"
        });
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key":
              process.env.ELEVENLABS_API_KEY,
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            text,
            model_id:
              "eleven_multilingual_v2"
          })
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        return res.status(response.status).json({
          error:
            errorText ||
            "Speech generation failed"
        });
      }

      const audioBuffer =
        Buffer.from(
          await response.arrayBuffer()
        );

      return res.status(200).json({
        success: true,
        audioBase64:
          audioBuffer.toString("base64")
      });
    }


    return res.status(400).json({
      error: "Invalid action"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        error?.message ||
        "Voice server error"
    });
  }
}
