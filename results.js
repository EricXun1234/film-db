const FILMDB_BASE = "https://filmdb-68z4.onrender.com";
const CURRENT_USER_KEY = "moodluma-current-user";
const HISTORY_PREFIX = "moodluma-history";
const FAVORITE_PREFIX = "moodluma-favorites";
const GUEST_ID = "guest";

const API_CANDIDATES = [
  `${FILMDB_BASE}/db`,
  `${FILMDB_BASE}/api/movies`,
  `${FILMDB_BASE}/movies`,
  `${FILMDB_BASE}/`
];

const $ = (id) => document.getElementById(id);

let allMovies = [];
let currentKeyword = "";

document.addEventListener("DOMContentLoaded", initResults);

async function initResults() {
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  currentKeyword = keyword;

  $("resultSearchInput").value = keyword;
  $("keywordText").textContent = keyword ? `你搜尋的是：「${keyword}」` : "";

  $("resultSearchBtn").addEventListener("click", searchAgain);
  $("resultSearchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchAgain();
  });

  allMovies = await loadMoviesFromFilmDB();
  renderSearchResults(keyword);
}

function searchAgain() {
  const kw = $("resultSearchInput").value.trim();
  if (!kw) return;

  location.href = `results.html?keyword=${encodeURIComponent(kw)}`;
}

function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function loadMoviesFromFilmDB() {
  for (const url of API_CANDIDATES) {
    try {
      const res = await fetchWithTimeout(url, {
        cache: "no-store",
        mode: "cors"
      });

      if (!res.ok) continue;

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        const movies = normalizeMovieList(data);
        if (movies.length) return movies;
      }

      const html = await res.text();
      const movies = parseMoviesFromHtml(html, url);

      if (movies.length) return movies;
    } catch (err) {
      console.warn("讀取資料庫失敗：", url, err);
    }
  }

  return [];
}

function parseMoviesFromHtml(html, sourceUrl) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const movies = [];

  const tables = [...doc.querySelectorAll("table")];

  tables.forEach((table) => {
    const headers = [...table.querySelectorAll("thead th, tr:first-child th, tr:first-child td")]
      .map(th => th.textContent.trim());

    const rows = [...table.querySelectorAll("tbody tr")];
    const targetRows = rows.length ? rows : [...table.querySelectorAll("tr")].slice(1);

    targetRows.forEach((row, index) => {
      const cells = [...row.querySelectorAll("td")];
      if (!cells.length) return;

      const raw = {};

      cells.forEach((cell, i) => {
        const key = headers[i] || `欄位${i + 1}`;
        raw[key] = cell.textContent.trim();

        const img = cell.querySelector("img");
        if (img?.getAttribute("src")) {
          raw["海報"] = absolutize(img.getAttribute("src"), sourceUrl);
        }

        const link = cell.querySelector("a[href]");
        if (link?.href && /youtube|youtu\.be|trailer|watch/i.test(link.href)) {
          raw["預告片"] = link.href;
        }
      });

      movies.push(normalizeMovie(raw, index));
    });
  });

  return movies.filter(movie => movie.title);
}

function normalizeMovieList(data) {
  let arr = [];

  if (Array.isArray(data)) arr = data;
  else if (Array.isArray(data.movies)) arr = data.movies;
  else if (Array.isArray(data.films)) arr = data.films;
  else if (Array.isArray(data.data)) arr = data.data;
  else if (Array.isArray(data.items)) arr = data.items;
  else if (Array.isArray(data.results)) arr = data.results;

  return arr.map((item, index) => normalizeMovie(item, index)).filter(movie => movie.title);
}

function normalizeMovie(raw, index = 0) {
  const title = getField(raw, [
    "title", "name", "movieName", "movie_title",
    "電影名稱", "片名", "名稱"
  ]) || `未命名電影 ${index + 1}`;

  const desc = getField(raw, [
    "description", "desc", "overview", "plot", "summary", "story",
    "簡介", "介紹", "劇情簡介", "內容簡介"
  ]) || "目前沒有簡介";

  const genre = getField(raw, [
    "genre", "genres", "genreKeywords", "genre_keywords",
    "類型", "類型關鍵字", "電影類型"
  ]) || "";

  const mood = getField(raw, [
    "mood", "emotion", "emotions", "atmosphere", "feel", "feeling", "vibe",
    "情感／氛圍", "情感/氛圍", "情感", "氛圍", "情緒"
  ]) || "";

  const rawPoster = getField(raw, [
  "poster", "posterUrl", "poster_url",
  "thumbnail", "thumbnailUrl", "thumbnail_url",
  "image", "imageUrl", "image_url",
  "cover", "coverUrl", "cover_url",
  "poster_path",
  "backdrop_path",
  "海報", "圖片", "圖片網址", "封面", "封面圖片"
]) || "";

const ytId = getField(raw, [
  "ytId", "youtubeId", "youtube_id", "videoId", "video_id"
]) || "";

const poster = rawPoster
  ? (
      rawPoster.startsWith("/")
        ? `https://image.tmdb.org/t/p/w500${rawPoster}`
        : rawPoster
    )
  : ytId
    ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    : "assets/default-poster.png";

  const trailer = getField(raw, [
    "youtubeUrl", "youtube_url", "trailer", "trailerUrl", "trailer_url",
    "url", "YouTube URL", "YouTube 網址", "預告片"
  ]) || "";

  return {
  id: raw.id || raw._id || index,
  title: String(title).trim(),
  desc: String(desc).trim(),
  genre: String(genre).trim(),
  mood: String(mood).trim(),
  poster: String(poster || "").trim() || "assets/default-poster.png",
  trailer: String(trailer).trim(),
  actors: String(raw.actors || "").trim()
};
}

function getField(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
      return obj[key];
    }
  }

  const objKeys = Object.keys(obj);

  for (const wanted of keys) {
    const found = objKeys.find(k => normalizeKey(k) === normalizeKey(wanted));
    if (found && obj[found] !== undefined && obj[found] !== null && obj[found] !== "") {
      return obj[found];
    }
  }

  return "";
}

function normalizeKey(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s|_|-|\/|／|：|:/g, "");
}

function absolutize(url, baseUrl) {
  if (!url) return "";

  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

function renderSearchResults(keyword) {
  const list = $("resultsList");
  const kw = keyword.toLowerCase().trim();

  const results = allMovies.filter(movie => {
    const text = `
      ${movie.title}
      ${movie.desc}
      ${movie.genre}
      ${movie.mood}
    `.toLowerCase();

    if (!kw) return true;
    return text.includes(kw);
  });

  if (!results.length) {
    list.innerHTML = `<div class="empty">找不到符合「${escapeHtml(keyword)}」的電影</div>`;
    return;
  }

  list.innerHTML = results.map(movie => {
    const score = getMatchScore(movie, keyword);
    const reason = `本系統根據關鍵字「${keyword}」分析，判定這部電影與搜尋需求相關。`;

    return `
      <article class="result-card">
        ${movie.poster ? `
          <img class="result-poster" src="${safeAttr(movie.poster)}" alt="${escapeHtml(movie.title)}">
        ` : `
          <div class="result-poster poster-empty">No Image</div>
        `}

        <h2>${escapeHtml(movie.title)}</h2>

        <div class="movie-meta">
          <span>類型：${escapeHtml(movie.genre || "未分類")}</span>
        </div>

        <p class="movie-desc">
          ${escapeHtml(reason)}
        </p>

        <div class="info-box">
          <small>關鍵字</small>
          <p>${escapeHtml(getKeywordText(movie))}</p>
        </div>

        <div class="info-box">
          <small>匹配度</small>
          <div class="score-bar">
            <div style="width:${score}%"></div>
          </div>
          <p>${score}%</p>
        </div>

        <div class="info-box">
          <small>類型</small>
          <p>${escapeHtml(movie.genre || "未分類")}</p>
        </div>

        <div class="info-box">
  <small>演員名單</small>
  <p>${escapeHtml(movie.actors || "暫無演員資料")}</p>
</div>
        

        <div class="result-actions">
          <button class="play-btn" onclick="goPlayer(
            '${encodeURIComponent(movie.title)}',
            '${encodeURIComponent(movie.trailer)}',
            '${encodeURIComponent(movie.genre)}',
            '${encodeURIComponent(movie.poster)}',
            '${encodeURIComponent(reason)}'
          )">
            ▶ 播放
          </button>
          <button class="fav-result-btn ${isFavorite(movie) ? "active" : ""}" onclick="toggleFavoriteFromResults('${safeJs(movie.id)}')">
            ${isFavorite(movie) ? "♥ 已收藏" : "♡ 收藏"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function getKeywordText(movie) {
  return [
    movie.mood,
    movie.genre
  ].filter(Boolean).join("、") || "暫無關鍵字";
}

function getMatchScore(movie, keyword) {
  const kw = keyword.toLowerCase().trim();

  const title = movie.title.toLowerCase();
  const genre = String(movie.genre).toLowerCase();
  const mood = String(movie.mood).toLowerCase();
  const desc = String(movie.desc).toLowerCase();

  if (!kw) return 70;
  if (title.includes(kw)) return 95;
  if (genre.includes(kw)) return 90;
  if (mood.includes(kw)) return 85;
  if (desc.includes(kw)) return 80;

  return 70;
}

function goPlayer(title, trailer, genre, poster, reason) {
  const trailerUrl = decodeURIComponent(trailer);
  const decodedTitle = decodeURIComponent(title);
  const decodedGenre = decodeURIComponent(genre);
  const decodedPoster = decodeURIComponent(poster);
  const decodedReason = decodeURIComponent(reason);
  const videoId = getYoutubeId(trailerUrl);

  saveHistory({
    id: decodedTitle,
    title: decodedTitle,
    trailer: trailerUrl,
    poster: decodedPoster,
    genre: decodedGenre,
    mood: "",
    desc: decodedReason
  }, 0.7);

  location.href =
    `player.html?title=${title}` +
    `&video=${encodeURIComponent(videoId)}` +
    `&genre=${genre}` +
    `&poster=${poster}` +
    `&reason=${reason}`;
}

function getYoutubeId(url) {
  if (!url) return "";

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return "";
}

function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    return user && user.username ? user : null;
  } catch {
    return null;
  }
}

function storageOwnerId() {
  return getCurrentUser()?.username || GUEST_ID;
}

function storageKey(type) {
  return `${type === "history" ? HISTORY_PREFIX : FAVORITE_PREFIX}-${storageOwnerId()}`;
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(/[,，、|\/／\n;；]+/).map(s => s.trim()).filter(Boolean);
}

function snapshot(movie, score = 0) {
  return {
    id: movie.id,
    title: movie.title,
    desc: movie.desc || "",
    poster: movie.poster || "",
    trailer: movie.trailer || "",
    genre: toList(movie.genre),
    mood: toList(movie.mood),
    mainScene: [],
    subScene: [],
    score,
    savedAt: new Date().toISOString()
  };
}

function saveHistory(movie, score = 0) {
  const items = loadJson(storageKey("history"), []);
  const next = [snapshot(movie, score), ...items.filter(item => String(item.id) !== String(movie.id))].slice(0, 30);
  saveJson(storageKey("history"), next);
}

function loadFavorites() {
  const items = loadJson(storageKey("favorites"), []);
  return Array.isArray(items) ? items : [];
}

function isFavorite(movie) {
  return loadFavorites().some(item => String(item.id) === String(movie.id));
}

function toggleFavoriteFromResults(id) {
  event?.stopPropagation?.();
  const movie = allMovies.find(item => String(item.id) === String(id));
  if (!movie) return;
  const items = loadFavorites();
  const exists = items.some(item => String(item.id) === String(movie.id));
  const next = exists
    ? items.filter(item => String(item.id) !== String(movie.id))
    : [snapshot(movie), ...items];
  saveJson(storageKey("favorites"), next);
  renderSearchResults(currentKeyword);
}

function safeJs(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function safeAttr(text) {
  return escapeHtml(text).replace(/`/g, "&#096;");
}