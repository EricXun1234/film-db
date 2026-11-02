// ===== Moodluma AI 猜電影挑戰 =====
// 獨立遊戲模組

(() => {
  "use strict";

  let gameMovies = [];
  let gameQuestionIndex = 0;
  let gameScore = 1000;
  let gameHintIndex = 0;

  // 初始化遊戲資料
  function initializeGame(movies) {
    if (!Array.isArray(movies)) {
      console.warn("遊戲：電影資料格式不正確");
      return;
    }

    const validMovies = movies.filter(movie =>
      movie &&
      typeof movie.title === "string" &&
      movie.title.trim() !== "" &&
      !movie.title.startsWith("未命名電影")
    );

    // 使用 Fisher-Yates 隨機洗牌
    const shuffled = [...validMovies];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]];
    }

    gameMovies = shuffled.slice(0, 10);
    gameQuestionIndex = 0;
    gameScore = 1000;

   console.log(
    "AI 猜電影題庫建立成功，共",
    gameMovies.length,
    "題"
  );

  showGameQuestion();
}

// 顯示目前題目的電影提示

let selectedGameAnswer = null;

function showGameQuestion() {
  gameHintIndex = 0;
  selectedGameAnswer = null;

  const movie = gameMovies[gameQuestionIndex];
  const clues = document.getElementById("gameClues");
  const options = document.getElementById("gameOptions");
  const submitBtn = document.getElementById("gameSubmit");
  const result = document.getElementById("gameResult");

  if (!movie || !clues || !options) return;

  clues.replaceChildren();
  options.replaceChildren();

  if (result) result.textContent = "";
  if (submitBtn) submitBtn.disabled = true;

  const hint = document.createElement("div");
  hint.textContent = movie.desc || "這部電影暫時沒有劇情介紹";
  clues.appendChild(hint);

  // 從目前載入的電影資料中抽取錯誤選項
  const pool = Array.isArray(window.allMovies)
    ? window.allMovies
    : gameMovies;

  const wrongMovies = pool.filter(m =>
    m &&
    typeof m.title === "string" &&
    m.title.trim() !== "" &&
    m.title !== movie.title &&
    !m.title.startsWith("未命名電影")
  );

  const uniqueTitles = [...new Set(wrongMovies.map(m => m.title))];

  for (let i = uniqueTitles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueTitles[i], uniqueTitles[j]] =
      [uniqueTitles[j], uniqueTitles[i]];
  }

  const answers = [
    movie.title,
    ...uniqueTitles.slice(0, 3)
  ];

  // 隨機排列四個答案
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] =
      [answers[j], answers[i]];
  }

  answers.forEach((title, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "game-option";
    btn.textContent = `${"ABCD"[index]}. ${title}`;
    btn.dataset.answer = title;

    btn.onclick = () => {
      options.querySelectorAll(".game-option").forEach(b => {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");
      selectedGameAnswer = title;

      if (submitBtn) submitBtn.disabled = false;
    };

    options.appendChild(btn);
  });
}

function unlockGameHint() {
  const movie = gameMovies[gameQuestionIndex];
  const clues = document.getElementById("gameClues");
  const scoreElement = document.getElementById("gameScore");

  if (!movie || !clues) return;

  const hints = [
    `電影類型：${movie.genre?.join("、") || "未知"}`,
    `上映年份：${movie.year || "未知"}`,
    `主要演員：${Array.isArray(movie.actors) ? movie.actors.join("、") : movie.actors || "未知"}`
  ];

  if (gameHintIndex >= hints.length) {
    return;
  }

  if (gameScore < 150) {
    alert("分數不足，無法解鎖提示！");
    return;
  }

  gameScore -= 150;

 const hint = document.createElement("div");
hint.className = "game-unlocked-hint";
hint.textContent = `💡 提示 ${gameHintIndex + 1}：${hints[gameHintIndex]}`;
clues.appendChild(hint);
  gameHintIndex++;

  if (scoreElement) {
    scoreElement.textContent = gameScore;
  }
}

function submitGameAnswer() {
  const movie = gameMovies[gameQuestionIndex];
  const result = document.getElementById("gameResult");

  if (!movie || !result) return;

if (!selectedGameAnswer) {
  result.textContent = "請先選擇一個答案！";
  return;
}
  const normalize = text =>
    String(text).normalize("NFKC")
      .toLowerCase()
      .replace(/[\s\p{P}\p{S}]/gu, "");
       // 提交後顯示選項的正確與錯誤狀態
  document.querySelectorAll(".game-option").forEach(btn => {
    const optionTitle = btn.dataset.answer;

    btn.classList.remove("correct", "wrong");

    if (optionTitle === undefined) return;

    if (normalize(optionTitle) === normalize(movie.title)) {
      btn.classList.add("correct");
    } else if (
      normalize(optionTitle) === normalize(selectedGameAnswer)
    ) {
      btn.classList.add("wrong");
    }
  });

 if (normalize(selectedGameAnswer) === normalize(movie.title)) {
    result.textContent = "🎉 答對了！";
    const scoreElement = document.getElementById("gameScore");

if (scoreElement) {
  scoreElement.textContent = gameScore;
}

    gameQuestionIndex++;
    selectedGameAnswer = null;

    if (gameQuestionIndex >= gameMovies.length) {
      result.textContent = `🎉 遊戲結束！總分：${gameScore}`;
      document.querySelectorAll("#gameOptions .game-option")
  .forEach(btn => btn.disabled = true);
      document.getElementById("gameSubmit").disabled = true;
      return;
    }

    document.getElementById("gameProgress").textContent =
      `${gameQuestionIndex + 1} / ${gameMovies.length}`;

    showGameQuestion();
  } else {
    gameScore = Math.max(0, gameScore - 50);

    const scoreElement = document.getElementById("gameScore");

if (scoreElement) {
  scoreElement.textContent = gameScore;
}
result.textContent = `❌ 答錯了！正確答案是：《${movie.title}》。扣除 50 分！目前得分：${gameScore}`;
  }
}
const submitBtn = document.getElementById("gameSubmit");

if (submitBtn) {
  submitBtn.onclick = submitGameAnswer;
}
const hintBtn = document.getElementById("gameNextHint");

if (hintBtn) {
  hintBtn.onclick = unlockGameHint;
}
  // 提供給其他程式呼叫
  window.MoodlumaGame = {
    initializeGame
  };
})();