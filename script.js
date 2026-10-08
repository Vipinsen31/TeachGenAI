let currentScenes = [];
let currentSceneIndex = 0;
let isPlaying = false;
let playTimer = null;
let currentAudio = null;

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateLesson() {
  const topicInput = document.getElementById("topic");
  const languageInput = document.getElementById("language");
  const result = document.getElementById("result");

  const topic = topicInput.value.trim();
  const language = languageInput.value;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  const safeTopic = escapeHTML(topic);

  if (language === "Hindi") {
    currentScenes = [
      {
        title: "परिचय",
        visual: `${topic} का परिचय`,
        text: `${topic} क्या है और यह क्यों महत्वपूर्ण है?`,
        narration: `${topic} के बारे में आज हम सरल भाषा में सीखेंगे।`
      },
      {
        title: "मुख्य अवधारणा",
        visual: `${topic} की मुख्य अवधारणा`,
        text: `${topic} के मुख्य बिंदु`,
        narration: `${topic} को समझने के लिए इसकी मुख्य अवधारणा को समझना जरूरी है।`
      },
      {
        title: "उदाहरण",
        visual: `${topic} का सरल उदाहरण`,
        text: `एक आसान उदाहरण`,
        narration: `${topic} को एक सरल उदाहरण की सहायता से समझते हैं।`
      },
      {
        title: "महत्वपूर्ण बिंदु",
        visual: `${topic} के महत्वपूर्ण बिंदु`,
        text: `मुख्य तथ्य और उपयोग`,
        narration: `${topic} के कुछ महत्वपूर्ण तथ्य और इसके उपयोग याद रखना जरूरी है।`
      },
      {
        title: "सारांश",
        visual: `${topic} का सारांश`,
        text: `आज हमने क्या सीखा?`,
        narration: `आज हमने ${topic} की मुख्य अवधारणाओं को समझा।`
      }
    ];
  } else {
    currentScenes = [
      {
        title: "Introduction",
        visual: `Introduction to ${topic}`,
        text: `What is ${topic}?`,
        narration: `Today we will learn about ${topic} in a simple and easy way.`
      },
      {
        title: "Main Concept",
        visual: `Main concept of ${topic}`,
        text: `Key concepts`,
        narration: `To understand ${topic}, we first need to understand its main concept.`
      },
      {
        title: "Example",
        visual: `Simple example of ${topic}`,
        text: `An easy example`,
        narration: `Let us understand ${topic} with a simple example.`
      },
      {
        title: "Important Points",
        visual: `Important points about ${topic}`,
        text: `Key facts and applications`,
        narration: `There are several important facts and applications related to ${topic}.`
      },
      {
        title: "Summary",
        visual: `Summary of ${topic}`,
        text: `What did we learn?`,
        narration: `Today we learned the important concepts of ${topic}.`
      }
    ];
  }

  result.style.display = "block";

  result.innerHTML = `
    <h2>
      ${safeTopic} ${language === "Hindi" ? "— शैक्षिक पाठ" : "— Educational Lesson"}
    </h2>

    <p>
      ${
        language === "Hindi"
          ? `${safeTopic} को सरल भाषा में समझें।`
          : `Learn ${safeTopic} in a simple and easy-to-understand way.`
      }
    </p>

    <h3>Learning Objectives</h3>

    <ul>
      <li>Understand the basic concept of ${safeTopic}</li>
      <li>Learn important points and applications</li>
      <li>Review the topic through a structured lesson</li>
    </ul>

    <h3>🎬 Educational Video Storyboard</h3>

    <div id="storyboard"></div>

    <button
      onclick="createEducationalVideo()"
      style="
        margin-top:20px;
        background:#16a34a;
        color:white;
        border:none;
        padding:15px;
        border-radius:10px;
        font-size:17px;
        font-weight:bold;
        width:100%;
        cursor:pointer;
      "
    >
      🎥 Create Educational Video
    </button>

    <div id="videoArea"></div>
  `;

  renderStoryboard();
}

function renderStoryboard() {
  const storyboard = document.getElementById("storyboard");

  if (!storyboard) return;

  storyboard.innerHTML = currentScenes.map((scene, index) => `
    <div class="scene">
      <b>Scene ${index + 1} — ${escapeHTML(scene.title)}</b>

      <p>
        <strong>Visual:</strong>
        ${escapeHTML(scene.visual)}
      </p>

      <p>
        <strong>On-screen text:</strong>
        ${escapeHTML(scene.text)}
      </p>

      <p>
        <strong>Narration:</strong>
        ${escapeHTML(scene.narration)}
      </p>
    </div>
  `).join("");
}

function createEducationalVideo() {
  const videoArea = document.getElementById("videoArea");

  if (!videoArea || currentScenes.length === 0) {
    return;
  }

  currentSceneIndex = 0;
  isPlaying = false;
  stopAudio();

  videoArea.innerHTML = `
    <div
      style="
        margin-top:25px;
        padding:20px;
        background:white;
        border-radius:14px;
        border:2px solid #2563eb;
      "
    >

      <h2>🎥 Educational Video Preview</h2>

      <div
        id="videoScreen"
        style="
          min-height:220px;
          padding:25px;
          border-radius:12px;
          background:#eef4ff;
          display:flex;
          flex-direction:column;
          justify-content:center;
          text-align:center;
        "
      ></div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:15px;
        "
      >
        <button onclick="previousScene()">◀ Previous</button>
        <button onclick="togglePlay()">▶ / ⏸ Play</button>
        <button onclick="nextScene()">Next ▶</button>
        <button onclick="restartVideo()">🔄 Restart</button>
        <button onclick="speakCurrentScene()">🔊 My Voice</button>
      </div>

      <div
        style="
          margin-top:15px;
          background:#ddd;
          height:8px;
          border-radius:8px;
          overflow:hidden;
        "
      >
        <div
          id="progressBar"
          style="
            width:0%;
            height:100%;
            background:#2563eb;
            transition:width .3s;
          "
        ></div>
      </div>

      <p id="sceneCounter"></p>

      <p
        style="
          font-size:13px;
          color:#555;
          margin-top:15px;
        "
      >
        Voice narration uses your connected ElevenLabs voice.
      </p>

    </div>
  `;

  showScene(0);
}

function showScene(index) {
  if (index < 0) index = 0;

  if (index >= currentScenes.length) {
    stopVideo();
    index = currentScenes.length - 1;
  }

  currentSceneIndex = index;

  const scene = currentScenes[index];

  const screen = document.getElementById("videoScreen");
  const progress = document.getElementById("progressBar");
  const counter = document.getElementById("sceneCounter");

  if (!screen) return;

  screen.innerHTML = `
    <div style="font-size:14px;color:#2563eb;font-weight:bold;">
      SCENE ${index + 1}
    </div>

    <h2>${escapeHTML(scene.title)}</h2>

    <div
      style="
        font-size:55px;
        margin:10px;
      "
    >
      🎓
    </div>

    <h3>${escapeHTML(scene.text)}</h3>

    <p>${escapeHTML(scene.visual)}</p>
  `;

  if (progress) {
    progress.style.width =
      ((index + 1) / currentScenes.length * 100) + "%";
  }

  if (counter) {
    counter.textContent =
      `Scene ${index + 1} of ${currentScenes.length}`;
  }
}

/*
  ELEVENLABS VOICE
*/
async function speakCurrentScene() {
  const scene = currentScenes[currentSceneIndex];

  if (!scene || !scene.narration) {
    alert("Narration text is not available.");
    return;
  }

  try {
    stopAudio();

    const voiceId =
      localStorage.getItem("teachgenai_voice_id");

    if (!voiceId) {
      alert(
        "Your cloned voice is not connected yet. Please create your voice first."
      );
      return;
    }

    const response = await fetch("/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "speech",
        voiceId: voiceId,
        text: scene.narration
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
        "ElevenLabs speech generation failed"
      );
    }

    if (!data.audioBase64) {
      throw new Error("No audio was returned.");
    }

    currentAudio = new Audio(
      "data:audio/mpeg;base64," +
      data.audioBase64
    );

    currentAudio.onended = function () {
      if (isPlaying) {
        moveToNextScene();
      }
    };

    await currentAudio.play();

  } catch (error) {
    console.error("Voice error:", error);

    alert(
      "Voice generation failed: " +
      (error?.message || "Unknown error")
    );
  }
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function moveToNextScene() {
  clearTimeout(playTimer);

  if (currentSceneIndex < currentScenes.length - 1) {
    currentSceneIndex++;
    showScene(currentSceneIndex);

    if (isPlaying) {
      speakCurrentScene();
    }
  } else {
    stopVideo();
  }
}

function nextScene() {
  stopAudio();

  if (currentSceneIndex < currentScenes.length - 1) {
    showScene(currentSceneIndex + 1);

    if (isPlaying) {
      speakCurrentScene();
    }
  } else {
    stopVideo();
  }
}

function previousScene() {
  stopAudio();

  if (currentSceneIndex > 0) {
    showScene(currentSceneIndex - 1);
  }
}

function restartVideo() {
  stopVideo();
  showScene(0);
}

function togglePlay() {
  if (isPlaying) {
    stopVideo();
    return;
  }

  isPlaying = true;

  speakCurrentScene();
}

function startSceneTimer() {
  clearTimeout(playTimer);

  playTimer = setTimeout(() => {
    if (!isPlaying) return;

    moveToNextScene();
  }, 6000);
}

function stopVideo() {
  isPlaying = false;

  clearTimeout(playTimer);

  stopAudio();
}
