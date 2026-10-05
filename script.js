
function generateLesson() {
  const topic = document.getElementById("topic").value.trim();
  const language = document.getElementById("language").value;
  const result = document.getElementById("result");

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  result.style.display = "block";
  result.innerHTML = `
    <h2>${topic} — Educational Lesson</h2>
    <p>TeachGenAI is preparing an educational lesson about <b>${topic}</b>.</p>

    <h3>Learning Objectives</h3>
    <ul>
      <li>Understand the basic concept</li>
      <li>Learn important points</li>
      <li>Review the topic with examples</li>
    </ul>

    <h3>🎬 Video Storyboard</h3>

    <div class="scene">
      <b>Scene 1 — Introduction</b>
      <p>Introduction to ${topic}.</p>
    </div>

    <div class="scene">
      <b>Scene 2 — Main Concept</b>
      <p>Simple explanation of the main concept.</p>
    </div>

    <div class="scene">
      <b>Scene 3 — Example</b>
      <p>An easy example related to ${topic}.</p>
    </div>

    <div class="scene">
      <b>Scene 4 — Summary</b>
      <p>Key points are summarized for quick revision.</p>
    </div>
  `;
}
