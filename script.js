
let currentScenes = [];
let currentSceneIndex = 0;
let isPlaying = false;
let playTimer = null;

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
        <button onclick="speakCurrentScene()">🔊 Voice</button>
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
        Preview mode: narration uses your browser's built-in text-to-speech.
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

function speakCurrentScene() {
  if (!("speechSynthesis" in window)) {
    alert("Voice narration is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const scene = currentScenes[currentSceneIndex];

  const utterance = new SpeechSynthesisUtterance(scene.narration);

  const language = document.getElementById("language").value;

  utterance.lang =
    language === "Hindi"
      ? "hi-IN"
      : "en-US";

  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

function nextScene() {
  window.speechSynthesis.cancel();

  if (currentSceneIndex < currentScenes.length - 1) {
    showScene(currentSceneIndex + 1);

    if (isPlaying) {
      speakCurrentScene();
      startSceneTimer();
    }
  } else {
    stopVideo();
  }
}

function previousScene() {
  window.speechSynthesis.cancel();

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
  startSceneTimer();
}

function startSceneTimer() {
  clearTimeout(playTimer);

  playTimer = setTimeout(() => {
    if (!isPlaying) return;

    if (currentSceneIndex < currentScenes.length - 1) {
      currentSceneIndex++;
      showScene(currentSceneIndex);
      speakCurrentScene();
      startSceneTimer();
    } else {
      stopVideo();
    }
  }, 6000);
}

function stopVideo() {
  isPlaying = false;

  clearTimeout(playTimer);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
