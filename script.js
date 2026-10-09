let currentScenes = [];
let currentSceneIndex = 0;
let isPlaying = false;
let currentAudio = null;
let speechVoices = [];
let selectedLanguage = "English";

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Load voices provided by the browser
function loadSpeechVoices() {
  if ("speechSynthesis" in window) {
    speechVoices = window.speechSynthesis.getVoices();
  }
}

if ("speechSynthesis" in window) {
  loadSpeechVoices();
  window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
}

function getSelectedVoice(language) {
  loadSpeechVoices();

  if (language === "Hindi") {
    return speechVoices.find(v => /^hi([-_]|$)/i.test(v.lang))
      || speechVoices.find(v => /hindi/i.test(v.name))
      || null;
  }

  return speechVoices.find(v => /^en([-_]|$)/i.test(v.lang))
    || speechVoices.find(v => /english/i.test(v.name))
    || null;
}

function generateLesson() {
  const topicInput = document.getElementById("topic");
  const languageInput = document.getElementById("language");
  const result = document.getElementById("result");

  if (!topicInput || !languageInput || !result) {
    alert("Topic, Language, or Result field is missing. Please check index.html.");
    return;
  }

  const topic = topicInput.value.trim();
  const language = languageInput.value;

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  selectedLanguage = language === "Hindi" ? "Hindi" : "English";

  if (selectedLanguage === "Hindi") {
    currentScenes = [
      {
        title: "परिचय",
        visual: `${topic} का परिचय`,
        text: `${topic} क्या है?`,
        narration: `नमस्कार विद्यार्थियों! आज हम ${topic} के बारे में सरल भाषा में सीखेंगे। इस पाठ में हम इसका परिचय, मुख्य अवधारणाएँ और उदाहरण समझेंगे।`
      },
      {
        title: "मुख्य अवधारणा",
        visual: `${topic} की मुख्य अवधारणा`,
        text: "मुख्य अवधारणाएँ समझें",
        narration: `${topic} को अच्छी तरह समझने के लिए इसकी मुख्य अवधारणाओं को जानना जरूरी है। ध्यान से समझें और महत्वपूर्ण बिंदुओं को अपनी नोटबुक में लिखें।`
      },
      {
        title: "उदाहरण",
        visual: `${topic} का उदाहरण`,
        text: "आसान उदाहरण से सीखें",
        narration: `अब ${topic} को एक आसान उदाहरण की मदद से समझते हैं। अपने आसपास के जीवन में इससे संबंधित उदाहरण खोजने की कोशिश करें। इससे विषय समझना आसान होगा।`
      },
      {
        title: "महत्वपूर्ण बिंदु",
        visual: `${topic} के उपयोग`,
        text: "मुख्य बिंदु और उपयोग",
        narration: `${topic} से संबंधित महत्वपूर्ण बिंदुओं को याद रखें। इसके उपयोग और विशेषताओं को समझना भी जरूरी है। अभ्यास करने से आपकी समझ बेहतर होगी।`
      },
      {
        title: "सारांश",
        visual: `${topic} का सारांश`,
        text: "आज हमने क्या सीखा?",
        narration: `आइए आज के पाठ को दोहराते हैं। हमने ${topic} का परिचय, मुख्य अवधारणाएँ, उदाहरण और महत्वपूर्ण बिंदु समझे। धन्यवाद विद्यार्थियों!`
      }
    ];
  } else {
    currentScenes = [
      {
        title: "Introduction",
        visual: `Introduction to ${topic}`,
        text: `What is ${topic}?`,
        narration: `Hello students! Today we will learn about ${topic} in simple language. In this lesson, we will explore the introduction, main concepts, and examples.`
      },
      {
        title: "Main Concept",
        visual: `Main concepts of ${topic}`,
        text: "Understand the main concepts",
        narration: `To understand ${topic}, we need to learn its main concepts. Listen carefully and write down the important points in your notebook.`
      },
      {
        title: "Example",
        visual: `An example of ${topic}`,
        text: "Learn with a simple example",
        narration: `Now let us understand ${topic} with a simple example. Try to find examples related to this topic in everyday life. This can make learning easier.`
      },
      {
        title: "Important Points",
        visual: `Important points about ${topic}`,
        text: "Key points and applications",
        narration: `Remember the important points related to ${topic}. Understanding its uses and features is also important. Regular practice can improve your understanding.`
      },
      {
        title: "Summary",
        visual: `Summary of ${topic}`,
        text: "What did we learn?",
        narration: `Let us review today's lesson. We learned the introduction, main concepts, examples, and important points about ${topic}. Thank you, students!`
      }
    ];
  }

  stopVideo();

  const safeTopic = escapeHTML(topic);

  result.style.display = "block";
  result.innerHTML = `
    <h2>${safeTopic} — ${selectedLanguage === "Hindi" ? "शैक्षिक पाठ" : "Educational Lesson"}</h2>

    <p>
      ${selectedLanguage === "Hindi"
        ? `${safeTopic} को सरल भाषा में समझें।`
        : `Learn about ${safeTopic} in a simple way.`}
    </p>

    <h3>${selectedLanguage === "Hindi" ? "सीखने के उद्देश्य" : "Learning Objectives"}</h3>

    <ul>
      <li>${selectedLanguage === "Hindi" ? "विषय की मूल अवधारणा समझना" : "Understand the basic concept"}</li>
      <li>${selectedLanguage === "Hindi" ? "महत्वपूर्ण बिंदु और उपयोग सीखना" : "Learn important points and applications"}</li>
      <li>${selectedLanguage === "Hindi" ? "पाठ का दोहराव करना" : "Review the lesson"}</li>
    </ul>

    <h3>🎬 Educational Video Storyboard</h3>
    <div id="storyboard"></div>

    <button
      onclick="createEducationalVideo()"
      style="margin-top:20px;background:#16a34a;color:white;border:none;padding:15px;border-radius:10px;font-size:17px;font-weight:bold;width:100%;cursor:pointer;"
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
    <div class="scene" style="padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:10px;">
      <b>Scene ${index + 1} — ${escapeHTML(scene.title)}</b>
      <p><strong>Visual:</strong> ${escapeHTML(scene.visual)}</p>
      <p><strong>On-screen text:</strong> ${escapeHTML(scene.text)}</p>
      <p><strong>Narration:</strong> ${escapeHTML(scene.narration)}</p>
      <button onclick="speakScene(${index})">🔊 ${selectedLanguage === "Hindi" ? "यह दृश्य सुनें" : "Listen to this scene"}</button>
    </div>
  `).join("");
}

function createEducationalVideo() {
  const videoArea = document.getElementById("videoArea");

  if (!videoArea || currentScenes.length === 0) {
    alert("Please generate a lesson first.");
    return;
  }

  stopVideo();
  currentSceneIndex = 0;

  videoArea.innerHTML = `
    <div style="margin-top:25px;padding:20px;background:white;border-radius:14px;border:2px solid #2563eb;">
      <h2>🎥 Educational Video Preview</h2>

      <div id="videoScreen" style="min-height:220px;padding:25px;border-radius:12px;background:#eef4ff;display:flex;flex-direction:column;justify-content:center;text-align:center;"></div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:15px;">
        <button onclick="previousScene()">◀ Previous</button>
        <button onclick="togglePlay()">▶ / ⏸ Play</button>
        <button onclick="nextScene()">Next ▶</button>
        <button onclick="restartVideo()">🔄 Restart</button>
        <button onclick="speakCurrentScene()">🔊 Listen</button>
      </div>

      <div style="margin-top:15px;background:#ddd;height:8px;border-radius:8px;overflow:hidden;">
        <div id="progressBar" style="width:0%;height:100%;background:#2563eb;transition:width .3s;"></div>
      </div>

      <p id="sceneCounter"></p>
      <p id="voiceStatus" role="status" style="font-size:14px;color:#555;"></p>

      <p style="font-size:13px;color:#555;">
        Voice uses your device's built-in browser speech service. This is not a clone of your own voice.
      </p>
    </div>
  `;

  showScene(0);
}

function showScene(index) {
  if (!currentScenes.length) return;

  currentSceneIndex = Math.max(0, Math.min(index, currentScenes.length - 1));

  const scene = currentScenes[currentSceneIndex];
  const screen = document.getElementById("videoScreen");
  const progress = document.getElementById("progressBar");
  const counter = document.getElementById("sceneCounter");

  if (!screen) return;

  screen.innerHTML = `
    <div style="font-size:14px;color:#2563eb;font-weight:bold;">
      SCENE ${currentSceneIndex + 1}
    </div>
    <h2>${escapeHTML(scene.title)}</h2>
    <div style="font-size:55px;margin:10px;">🎓</div>
    <h3>${escapeHTML(scene.text)}</h3>
    <p>${escapeHTML(scene.visual)}</p>
  `;

  if (progress) {
    progress.style.width =
      ((currentSceneIndex + 1) / currentScenes.length * 100) + "%";
  }

  if (counter) {
    counter.textContent = `Scene ${currentSceneIndex + 1} of ${currentScenes.length}`;
  }
}

function speakScene(index) {
  if (index < 0 || index >= currentScenes.length) return;

  stopAudio();
  currentSceneIndex = index;
  showScene(index);
  speakText(currentScenes[index].narration);
}

function speakCurrentScene() {
  const scene = currentScenes[currentSceneIndex];

  if (!scene) {
    alert("Please generate a lesson first.");
    return;
  }

  speakText(scene.narration);
}

function speakText(text) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    alert("Sorry, speech is not supported by this browser. Try opening the site in Chrome.");
    return;
  }

  stopAudio();

  const status = document.getElementById("voiceStatus");
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = selectedLanguage === "Hindi" ? "hi-IN" : "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = getSelectedVoice(selectedLanguage);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  utterance.onstart = () => {
    if (status) {
      status.textContent = selectedLanguage === "Hindi"
        ? "🔊 पाठ पढ़ा जा रहा है..."
        : "🔊 Reading the lesson...";
    }
  };

  utterance.onend = () => {
    if (status) status.textContent = "✅ Narration finished.";

    if (isPlaying) {
      if (currentSceneIndex < currentScenes.length - 1) {
        currentSceneIndex++;
        showScene(currentSceneIndex);
        speakText(currentScenes[currentSceneIndex].narration);
      } else {
        stopVideo();
        if (status) status.textContent = "✅ Lesson completed.";
      }
    }
  };

  utterance.onerror = (event) => {
    console.error("Speech error:", event);
    if (status) {
      status.textContent = "Voice playback failed. Check your browser's speech settings.";
    }
    isPlaying = false;
  };

  window.speechSynthesis.speak(utterance);
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

function nextScene() {
  stopAudio();

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

function previousScene() {
  stopAudio();

  if (currentSceneIndex > 0) {
    currentSceneIndex--;
    showScene(currentSceneIndex);

    if (isPlaying) {
      speakCurrentScene();
    }
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

  if (!currentScenes.length) {
    alert("Please generate a lesson first.");
    return;
  }

  isPlaying = true;
  speakCurrentScene();
}

function stopVideo() {
  isPlaying = false;
  stopAudio();
}

window.addEventListener("pagehide", stopVideo);
