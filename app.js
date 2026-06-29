const FILMDB_BASE = "https://filmdb-68z4.onrender.com";

/*
  這裡會自動嘗試多個常見資料路徑。
  如果你們之後知道正式 API，例如 /api/movies，只要把它放在第一個即可。
*/
const API_CANDIDATES = [
  // 依照 Network 看到的結果，你的實際資料頁是 /db，所以優先讀這個
  `${FILMDB_BASE}/db`,

  // 下面是備用 API 路徑，如果之後後端有開 JSON API 也會自動嘗試
  `${FILMDB_BASE}/api/movies`,
  `${FILMDB_BASE}/api/films`,
  `${FILMDB_BASE}/api/movie`,
  `${FILMDB_BASE}/api/data`,
  `${FILMDB_BASE}/api/export`,
  `${FILMDB_BASE}/movies`,
  `${FILMDB_BASE}/films`,
  `${FILMDB_BASE}/data.json`,
  `${FILMDB_BASE}/movies.json`,
  `${FILMDB_BASE}/film-db.json`,
  `${FILMDB_BASE}/`
];

const AUTH_USERS_KEY = "moodluma-users";
const CURRENT_USER_KEY = "moodluma-current-user";
const HISTORY_PREFIX = "moodluma-history";
const FAVORITE_PREFIX = "moodluma-favorites";
const GUEST_ID = "guest";

/*
  支援中英文欄位名稱。
  資料庫若有「主要場景、次要場景、類型關鍵字、情感／氛圍」，
  這裡會自動抓來統整成圓圈標籤。
*/
const FIELD_MAP = {
  title: ["title", "name", "movieName", "movie_title", "電影名稱", "片名", "名稱"],
  desc: ["description", "desc", "overview", "plot", "summary", "story", "簡介", "介紹", "劇情簡介", "內容簡介"],
  poster: [
    "poster", "posterUrl", "poster_url",
    "thumbnail", "thumbnailUrl", "thumbnail_url",
    "image", "imageUrl", "image_url",
    "cover", "coverUrl", "cover_url",
    "img", "src",
    "youtubeThumbnail", "youtube_thumbnail",
    "縮圖", "海報", "圖片", "圖片網址", "封面", "封面圖片"
  ],
  trailer: ["youtubeUrl", "youtube_url", "trailer", "trailerUrl", "trailer_url", "url", "YouTube URL", "YouTube 網址", "預告片"],
  youtubeId: ["youtubeId", "youtube_id", "videoId", "video_id", "ytId", "yt_id", "YouTube ID", "影片ID", "影片 ID"],
  mainScene: ["mainScene", "primaryScene", "main_scene", "主要場景", "主場景"],
  subScene: ["subScene", "secondaryScene", "sub_scene", "次要場景", "副場景"],
  genre: ["genreKeywords", "genre_keywords", "genres", "genre", "類型關鍵字", "類型", "電影類型"],
  mood: ["mood", "emotion", "emotions", "atmosphere", "feel", "feeling", "vibe", "情感／氛圍", "情感/氛圍", "情感", "氛圍", "情緒"],
  year: ["year", "releaseYear", "release_year", "年份", "上映年份"],
  duration: ["duration", "runtime", "length", "片長", "時長"],
  views: ["views", "viewCount", "view_count", "clicks", "clickCount", "瀏覽次數", "點擊次數", "觀看次數"],
  actors: ["actors", "actor", "cast", "casts","演員", "演員名單", "主演", "卡司"],
};

const FALLBACK_MOVIES = [
  {
    id: "fallback-1",
    title: "Midnight Signal",
    desc: "一名工程系學生在深夜接收到來自禁區基地的神秘訊號，卻發現這段訊號會改變人的記憶。",
    poster: "assets/poster1.png",
    genre: ["科幻片", "懸疑"],
    mood: ["孤獨", "深夜感", "壓迫感"],
    mainScene: ["禁區", "雨夜"],
    subScene: ["山區", "實驗基地"],
    year: "2026",
    duration: "1 小時 58 分",
    trailer: ""
  },
  {
    id: "fallback-2",
    title: "Blue Harbor",
    desc: "失去方向的女孩回到海港小鎮，重新面對家庭、傷口與未完成的告別。",
    poster: "assets/poster2.png",
    genre: ["劇情片"],
    mood: ["療癒", "安靜", "海風感"],
    mainScene: ["海邊", "小鎮"],
    subScene: ["燈塔", "港口"],
    year: "2025",
    duration: "2 小時 04 分",
    trailer: ""
  },
  {
    id: "fallback-3",
    title: "Dark Roast",
    desc: "深夜咖啡館牽扯出連續失蹤案。每一杯咖啡背後都有交易，每位客人都可能是兇手。",
    poster: "assets/poster3.png",
    genre: ["犯罪片", "懸疑"],
    mood: ["壓迫感", "雨夜", "黑色幽默"],
    mainScene: ["咖啡館", "城市街道"],
    subScene: ["深夜", "雨中"],
    year: "2026",
    duration: "1 小時 46 分",
    trailer: ""
  },
  {
    id: "fallback-4",
    title: "Last Semester",
    desc: "大學最後一學期，一群學生面對畢業、夢想與分離，在最後一次專題中找到未來方向。",
    poster: "assets/poster4.png",
    genre: ["青春片"],
    mood: ["成長", "懷舊", "不捨"],
    mainScene: ["校園", "秋天"],
    subScene: ["教室", "畢業季"],
    year: "2025",
    duration: "1 小時 52 分",
    trailer: ""
  },
  {
    id: "fallback-5",
    title: "Sunset Letters",
    desc: "兩位陌生人因一封寄錯的信而相遇，在夕陽與海岸城市之間，重新相信愛情。",
    poster: "assets/poster5.png",
    genre: ["愛情片"],
    mood: ["浪漫", "溫柔", "夕陽感"],
    mainScene: ["海邊", "老街"],
    subScene: ["黃昏", "城市"],
    year: "2025",
    duration: "1 小時 49 分",
    trailer: ""
  },
  {
    id: "fallback-6",
    title: "Echoes of Tomorrow",
    desc: "在記憶可以被演算法重建的未來，一名研究員發現 AI 保存的不只是資料，而是人類選擇遺忘的真相。",
    poster: "assets/poster6.png",
    genre: ["科幻片"],
    mood: ["未來感", "疏離", "冷調"],
    mainScene: ["未來城市", "實驗室"],
    subScene: ["資料中心", "夜景"],
    year: "2026",
    duration: "2 小時 10 分",
    trailer: ""
  },
  {
    id: "fallback-7",
    title: "Hollow Frame",
    desc: "一名攝影師在老屋中發現每張照片都會出現不存在的人影，他越接近真相就越分不清現實。",
    poster: "assets/poster7.png",
    genre: ["懸疑"],
    mood: ["詭異", "心理壓迫", "孤獨"],
    mainScene: ["老屋", "暗房"],
    subScene: ["鏡子", "相片"],
    year: "2026",
    duration: "1 小時 55 分",
    trailer: ""
  }
];

const TAG_KIND_RULES = {
  mood: ["孤獨", "療癒", "浪漫", "放鬆", "歡樂", "壓迫", "不安", "溫柔", "懷舊", "熱血", "空虛", "疏離", "感人", "悲傷", "焦慮", "沉重", "自由", "安靜", "悵然", "心碎", "陰鬱", "愉快", "舒服", "夢幻", "治癒", "致鬱", "恐懼", "孤單", "寂寞", "失落", "希望"],
  atmosphere: ["深夜", "雨夜", "夕陽", "冷調", "暖色", "迷幻", "黑色幽默", "未來感", "復古", "慢節奏", "海風", "詭異", "神秘", "寧靜", "末日", "霓虹", "夜晚", "夏天", "冬天", "灰暗", "明亮"],
  scene: ["校園", "海邊", "小鎮", "城市", "老屋", "咖啡館", "醫院", "森林", "實驗室", "公路", "夜市", "辦公室", "家庭", "港口", "山區", "雨中", "餐廳", "酒吧", "房間", "車站"],
  genre: ["恐怖", "愛情", "科幻", "犯罪", "喜劇", "動作", "劇情", "動畫", "紀錄", "懸疑", "驚悚", "青春", "冒險"]
};

const KIND_META = {
  mood: { label: "情緒", icon: "♡", colors: ["#9b5cff", "#f06ba7"], glow: "rgba(240,107,167,0.45)" },
  atmosphere: { label: "氛圍", icon: "☾", colors: ["#406dff", "#7d5cff"], glow: "rgba(79,140,255,0.42)" },
  scene: { label: "場景", icon: "⌂", colors: ["#1eaeb8", "#6ccf91"], glow: "rgba(87,211,218,0.38)" },
  genre: { label: "類型", icon: "✦", colors: ["#dc633a", "#e8b553"], glow: "rgba(232,181,83,0.42)" }
};

let allMovies = [];
let bubbles = [];
let allTagCandidates = [];
let selectedTags = new Map();
let searchKeyword = "";
let viewCounts = loadViews();
let feedbacks = loadFeedbacks();
let currentModalMovie = null;
let groupMode = false;
let groupMembers = loadGroupMembers();
let activeMemberId = groupMembers[0]?.id || null;
let groupVotes = loadGroupVotes();
let authMode = "login";
let libraryMode = "favorites";
let pendingMovie = null;
let currentTab = "全部收藏";
let appSettings = loadJson("moodluma_settings", {
  themeDark: true,
  anim: true,
  cardSize: "中",
  prefPop: false,
  prefNiche: false,
  noHorror: false,
  noSad: false
});

function saveAppSettings() {
  saveJson("moodluma_settings", appSettings);
}

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindUI();
  allMovies = await loadMoviesFromFilmDB();
  ensureDefaultMembers();
  buildDynamicBubbles();
  renderMembers();
  renderGroupTags();
  renderSelectedTags();
  renderRecommendations();
  renderExploreResults();
  renderCollection();
  updateAuthUI();
  updateMemberStats();
}

function bindUI() {
  $("searchBtn").addEventListener("click", handleSearch);
  $("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  $("resetBtn").addEventListener("click", () => {
    selectedTags.clear();
    searchKeyword = "";
    $("searchInput").value = "";
    bubbles.forEach((b) => {
      b.weight = 0;
      b.el.classList.remove("selected");
    });
    renderSelectedTags();
    renderRecommendations();
  });

  $("shuffleBtn").addEventListener("click", () => {
    if (!allTagCandidates || allTagCandidates.length === 0) return;
    
    const currentTags = bubbles.map(b => b.tag);
    const newSelected = pickBalancedTags(allTagCandidates, currentTags);
    createBubbles(newSelected);
  });

  $("rerollBtn").addEventListener("click", () => {
    const tags = bubbles.map(b => b.tag);
    if (!tags.length) return;
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    addSelectedTag(randomTag, 0.72, "random");
    renderRecommendations();
  });

  $("viewAllBtn").addEventListener("click", () => renderRecommendations(true));

  $("modalClose").addEventListener("click", closeModal);
  $("modalBackdrop").addEventListener("click", closeModal);

  $("likeBtn")?.addEventListener("click", () => setFeedback("like"));
  $("dislikeBtn")?.addEventListener("click", () => setFeedback("dislike"));

  $("trailerLink")?.addEventListener("click", () => {
    if (!currentModalMovie) return;
    markTrailerWatched(currentModalMovie);
    updateFeedbackUI(currentModalMovie);
  });

  $("addMemberBtn")?.addEventListener("click", addMemberFromInput);
  $("memberNameInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addMemberFromInput();
  });

  $("groupModeBtn")?.addEventListener("click", () => {
    groupMode = !groupMode;
    $("groupModeBtn").classList.toggle("active", groupMode);
    $("groupModeBtn").textContent = groupMode ? "多人模式已開啟" : "開啟多人模式";
    renderRecommendations();
  });

  $("groupWantBtn")?.addEventListener("click", () => setGroupVote("want"));
  $("groupNopeBtn")?.addEventListener("click", () => setGroupVote("nope"));

  $("favoriteBtn")?.addEventListener("click", () => {
    if (!currentModalMovie) return;
    toggleFavorite(currentModalMovie);
    updateFavoriteUI(currentModalMovie);
    updateMemberStats();
    renderCollection();
    renderExploreResults($("exploreSearchInput")?.value || "");
    renderRecommendations();
  });

  $("historyBtn")?.addEventListener("click", () => openLibrary("history"));
  bindPageNavigation();
  bindExploreUI();
  bindCollectionUI();
  bindSettingsUI();

  $("loginBtn")?.addEventListener("click", () => openAuth("login"));
  $("registerBtn")?.addEventListener("click", () => openAuth("register"));
  $("memberSpaceBtn")?.addEventListener("click", openMemberSpace);
  $("memberLoginFromSpace")?.addEventListener("click", () => {
    closeMemberSpace();
    openAuth("login");
  });
  $("logoutBtn")?.addEventListener("click", logoutUser);

  $("authClose")?.addEventListener("click", closeAuth);
  $("authBackdrop")?.addEventListener("click", closeAuth);
  $("authLoginTab")?.addEventListener("click", () => setAuthMode("login"));
  $("authRegisterTab")?.addEventListener("click", () => setAuthMode("register"));
  $("authSubmit")?.addEventListener("click", handleAuthSubmit);
  $("authPassword")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAuthSubmit();
  });

  $("libraryClose")?.addEventListener("click", closeLibrary);
  $("libraryBackdrop")?.addEventListener("click", closeLibrary);
  $("libraryClearBtn")?.addEventListener("click", clearCurrentLibrary);

  $("memberClose")?.addEventListener("click", closeMemberSpace);
  $("memberBackdrop")?.addEventListener("click", closeMemberSpace);
  $("memberHistoryBtn")?.addEventListener("click", () => openLibrary("history"));
  $("memberFavoriteBtn")?.addEventListener("click", () => openLibrary("favorites"));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeAuth();
      closeLibrary();
      closeMemberSpace();
      closeCollectionChoice();
    }
  });
}

function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function loadMoviesFromFilmDB() {
  $("dbStatus").textContent = "正在連接你的 FilmDB 資料庫...";

  for (const url of API_CANDIDATES) {
    try {
      const res = await fetchWithTimeout(url, {
        cache: "no-store",
        mode: "cors"
      });

      if (!res.ok) continue;

      const contentType = res.headers.get("content-type") || "";
      let list = [];

      if (contentType.includes("application/json")) {
        const data = await res.json();
        list = normalizeMovieList(data);
      } else {
        const text = await res.text();
        const jsonData = extractJsonFromText(text);
        if (jsonData) {
          list = normalizeMovieList(jsonData);
        }

        if (!list.length) {
          list = parseMoviesFromHtml(text, url);
        }
      }

      if (list.length) {
        $("dbStatus").textContent = `已連接 FilmDB：成功讀取 ${list.length} 部電影，圓圈與搜尋皆由資料庫生成。`;
        return list;
      }
    } catch (err) {
      console.warn("FilmDB 讀取失敗：", url, err);
    }
  }

  $("dbStatus").textContent = "FilmDB 目前無法由瀏覽器直接讀取，可能是 API 路徑或 CORS 尚未開放。現在先使用本地示範資料。";
  return FALLBACK_MOVIES.map((m, i) => normalizeMovie(m, i));
}

function extractJsonFromText(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {}
  }

  const nextMatch = text.match(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (nextMatch) {
    try {
      return JSON.parse(nextMatch[1]);
    } catch {}
  }

  const windowDataMatch = text.match(/window\.__(?:DATA|MOVIES|FILMS)__\s*=\s*([\s\S]*?);<\/script>/i);
  if (windowDataMatch) {
    try {
      return JSON.parse(windowDataMatch[1]);
    } catch {}
  }

  const arrayMatch = text.match(/(\[\s*\{[\s\S]*?\}\s*\])/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[1]);
    } catch {}
  }

  return null;
}


function getBackgroundImageUrl(el) {
  const style = el.getAttribute("style") || "";
  const m = style.match(/background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/i);
  return m ? m[1] : "";
}

function parseMoviesFromHtml(html, sourceUrl) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const movies = [];
  const tables = [...doc.querySelectorAll("table")];
  for (const table of tables) {
    const headers = [...table.querySelectorAll("thead th, tr:first-child th, tr:first-child td")]
      .map(th => th.textContent.trim());

    const rows = [...table.querySelectorAll("tbody tr")];
    const targetRows = rows.length ? rows : [...table.querySelectorAll("tr")].slice(1);

    targetRows.forEach((row, idx) => {
      const cells = [...row.querySelectorAll("td")];
      if (!cells.length) return;

      const raw = {};
      cells.forEach((cell, i) => {
        const key = headers[i] || `欄位${i + 1}`;
        raw[key] = cell.textContent.trim();

        const img = cell.querySelector("img");
        if (img?.src) raw["海報"] = absolutize(img.getAttribute("src"), sourceUrl);

        const bgImage = getBackgroundImageUrl(cell);
        if (!raw["海報"] && bgImage) raw["海報"] = absolutize(bgImage, sourceUrl);

        const link = cell.querySelector("a[href]");
        if (link?.href && /youtube|youtu\.be|trailer|watch/i.test(link.href)) {
          raw["預告片"] = link.href;
        }
      });

      movies.push(normalizeMovie(raw, idx));
    });
  }

  if (!movies.length) {
    const cards = [...doc.querySelectorAll("[class*='card'], [class*='movie'], [class*='film'], article")];
    cards.forEach((card, idx) => {
      const titleEl = card.querySelector("h1,h2,h3,h4,[class*='title'],[class*='name']");
      if (!titleEl) return;

      const img = card.querySelector("img");
      const bgImage = getBackgroundImageUrl(card) || [...card.querySelectorAll("[style]")].map(getBackgroundImageUrl).find(Boolean);
      const link = [...card.querySelectorAll("a[href]")].find(a => /youtube|youtu\.be|trailer|watch/i.test(a.href));

      const text = card.textContent.trim().replace(/\s+/g, " ");
      const raw = {
        "片名": titleEl.textContent.trim(),
        "簡介": text,
        "海報": img ? absolutize(img.getAttribute("src"), sourceUrl) : (bgImage ? absolutize(bgImage, sourceUrl) : ""),
        "預告片": link ? link.href : ""
      };

      movies.push(normalizeMovie(raw, idx));
    });
  }

  return movies.filter(m => m.title);
}

function absolutize(url, baseUrl) {
  if (!url) return "";
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

function normalizeMovieList(data) {
  let arr = [];

  if (Array.isArray(data)) arr = data;
  else if (Array.isArray(data.movies)) arr = data.movies;
  else if (Array.isArray(data.films)) arr = data.films;
  else if (Array.isArray(data.data)) arr = data.data;
  else if (Array.isArray(data.items)) arr = data.items;
  else if (Array.isArray(data.results)) arr = data.results;
  else if (data.props?.pageProps) {
    const p = data.props.pageProps;
    arr = p.movies || p.films || p.data || p.items || [];
  }

  return arr.map((item, idx) => normalizeMovie(item, idx)).filter(m => m.title);
}


function getYoutubeIdFromUrl(url) {
  if (!url) return "";
  const s = String(url).trim();

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
    /\/vi\/([a-zA-Z0-9_-]{6,})\//
  ];

  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }

  if (/^[a-zA-Z0-9_-]{8,}$/.test(s) && !s.includes("/") && !s.includes(".")) return s;

  return "";
}

function youtubeThumb(videoId, quality = "mqdefault") {
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

function pickPosterFromMovie(raw, trailer, poster, idx) {
  if (poster) return poster;

  const getRaw = (keys) => {
    for (const key of keys) {
      if (raw && raw[key]) return raw[key];
    }
    const rawKeys = Object.keys(raw || {});
    for (const wanted of keys) {
      const found = rawKeys.find(k => normalizeKey(k) === normalizeKey(wanted));
      if (found && raw[found]) return raw[found];
    }
    return "";
  };

  const youtubeIdValue = getRaw(FIELD_MAP.youtubeId || []);
  const idFromField = getYoutubeIdFromUrl(youtubeIdValue);
  const idFromTrailer = getYoutubeIdFromUrl(trailer);

  const videoId = idFromField || idFromTrailer;
  if (videoId) return youtubeThumb(videoId, "mqdefault");

  return `assets/poster${(idx % 7) + 1}.png`;
}

function normalizeMovie(raw, idx = 0) {
  const get = (type) => {
    for (const key of FIELD_MAP[type]) {
      if (raw && raw[key] !== undefined && raw[key] !== null && raw[key] !== "") return raw[key];
    }

    // 支援大小寫或空白不同的欄位
    const rawKeys = Object.keys(raw || {});
    for (const wanted of FIELD_MAP[type]) {
      const found = rawKeys.find(k => normalizeKey(k) === normalizeKey(wanted));
      if (found && raw[found] !== undefined && raw[found] !== null && raw[found] !== "") return raw[found];
    }

    return "";
  };

  const title = String(get("title") || `未命名電影 ${idx + 1}`).trim();
  const id = raw.id || raw._id || raw.uuid || slug(title);
  const trailer = normalizeUrl(get("trailer"));
  const rawPoster = normalizeUrl(get("poster"));
  const poster = normalizeUrl(pickPosterFromMovie(raw, trailer, rawPoster, idx));

  return {
    id,
    title,
    desc: String(get("desc") || "目前資料庫尚未提供完整簡介。"),
    poster,
    trailer,
    year: String(get("year") || ""),
    duration: String(get("duration") || ""),
    views: Number(get("views") || 0),
    actors: String(get("actors") || ""),
    genre: toArray(get("genre")),
    mood: toArray(get("mood")),
    mainScene: toArray(get("mainScene")),
    subScene: toArray(get("subScene")),
    raw
  };
}

function normalizeKey(s) {
  return String(s).toLowerCase().replace(/\s|_|-|\/|／|：|:/g, "");
}

function normalizeUrl(url) {
  if (!url) return "";
  const s = String(url).trim();
  if (!s) return "";
  if (s.startsWith("http")) return s;
  if (s.startsWith("/")) return FILMDB_BASE + s;
  return s;
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(cleanTag).filter(Boolean);
  if (typeof value === "object") return Object.values(value).flatMap(toArray);
  return String(value)
    .split(/[,，、|/／\n;；]+/)
    .map(cleanTag)
    .filter(Boolean);
}

function cleanTag(s) {
  return String(s).trim().replace(/^#/, "").replace(/\s+/g, " ");
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-");
}

function buildDynamicBubbles() {
  const counts = new Map();

  allMovies.forEach(movie => {
    const fieldGroups = [
      { list: movie.mood, base: 5.2 },
      { list: movie.genre, base: 2.2 },
      { list: movie.mainScene, base: 3.1 },
      { list: movie.subScene, base: 2.2 }
    ];

    fieldGroups.forEach(({ list, base }) => {
      list.forEach(tag => {
        const kind = classifyTag(tag);
        const prev = counts.get(tag) || { tag, score: 0, kind, count: 0 };
        prev.score += base + (kind === "mood" ? 1.4 : 0);
        prev.count += 1;
        prev.kind = kind;
        counts.set(tag, prev);
      });
    });
  });

  let candidates = [...counts.values()];

  // 若資料庫標籤太少，補一些偏「感受型」的圓圈，避免畫面空。
  if (candidates.length < 10) {
    const fallbackTags = [
      ["孤獨", "mood"], ["療癒", "mood"], ["浪漫", "mood"], ["壓迫感", "mood"], ["放空", "mood"],
      ["深夜感", "atmosphere"], ["雨夜", "atmosphere"], ["夕陽感", "atmosphere"], ["冷調", "atmosphere"],
      ["校園", "scene"], ["海邊", "scene"], ["咖啡館", "scene"], ["老屋", "scene"],
      ["恐怖片", "genre"], ["愛情片", "genre"]
    ];
    fallbackTags.forEach(([tag, kind]) => {
      if (!counts.has(tag)) candidates.push({ tag, score: 1, kind, count: 1 });
    });
  }

  allTagCandidates = candidates;
  const selected = pickBalancedTags(allTagCandidates, []);
  createBubbles(selected);
}

function classifyTag(tag) {
  const t = String(tag);
  for (const [kind, words] of Object.entries(TAG_KIND_RULES)) {
    if (words.some(w => t.includes(w) || w.includes(t))) return kind;
  }
  return "mood";
}

function pickBalancedTags(candidates, excludeTags = []) {
  let available = candidates.filter(c => !excludeTags.includes(c.tag));
  if (available.length < 15) {
    available = candidates;
  }

  available.sort(() => Math.random() - 0.5);
  const buckets = { mood: [], atmosphere: [], scene: [], genre: [] };
  available.forEach(item => buckets[item.kind]?.push(item));
  const plan = [
    ["mood", 5],
    ["atmosphere", 4],
    ["scene", 4],
    ["genre", 2]
  ];

  const picked = [];
  const seen = new Set();

  plan.forEach(([kind, max]) => {
    buckets[kind].slice(0, max).forEach(item => {
      if (!seen.has(item.tag)) {
        seen.add(item.tag);
        picked.push(item);
      }
    });
  });

  available.forEach(item => {
    if (picked.length >= 15) return;
    if (!seen.has(item.tag)) {
      seen.add(item.tag);
      picked.push(item);
    }
  });

  return picked.slice(0, 15);
}

function createBubbles(items) {
  const stage = $("moodStage");
  stage.querySelectorAll(".mood-bubble").forEach(el => el.remove());

  bubbles = items.map((item) => {
    const meta = KIND_META[item.kind] || KIND_META.mood;
    const el = document.createElement("button");
    el.className = "mood-bubble";
    el.style.setProperty("--bubble-a", meta.colors[0]);
    el.style.setProperty("--bubble-b", meta.colors[1]);
    el.style.setProperty("--glow", meta.glow);
    el.innerHTML = `
      <span>
        <div class="icon">${meta.icon}</div>
        <div class="tag">${escapeHtml(item.tag)}</div>
        <div class="kind">${meta.label}</div>
      </span>
    `;
    el.dataset.tag = item.tag;
    el.dataset.kind = item.kind;
    stage.appendChild(el);

    const bubble = { ...item, el, x: 0, y: 0, weight: 0, size: 90 + Math.min(36, item.count * 7) };
    el.style.width = `${bubble.size}px`;
    el.style.height = `${bubble.size}px`;

    makeDraggable(bubble);
    el.addEventListener("click", () => {
      if (el.classList.contains("dragging")) return;
      addSelectedTag(item.tag, bubble.weight || 0.62, item.kind);
      renderRecommendations();
    });

    return bubble;
  });

  layoutBubbles();
}

function layoutBubbles() {
  const stage = $("moodStage");
  const rect = stage.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const radius = Math.min(rect.width, rect.height) * 0.40;

  bubbles.forEach((bubble, i) => {
    const angle = (Math.PI * 2 * i) / bubbles.length - Math.PI / 2;
    const r = radius; 
    bubble.x = cx + Math.cos(angle) * r - bubble.size / 2;
    bubble.y = cy + Math.sin(angle) * r - bubble.size / 2;
    setBubblePosition(bubble);
    updateBubbleWeight(bubble);
  });
}

function setBubblePosition(bubble) {
  bubble.el.style.left = `${bubble.x}px`;
  bubble.el.style.top = `${bubble.y}px`;
}

function makeDraggable(bubble) {
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let moved = false;

  bubble.el.addEventListener("pointerdown", (e) => {
    bubble.el.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    originX = bubble.x;
    originY = bubble.y;
    moved = false;
    bubble.el.classList.add("dragging");
  });

  bubble.el.addEventListener("pointermove", (e) => {
    if (!bubble.el.classList.contains("dragging")) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    bubble.x = originX + dx;
    bubble.y = originY + dy;
    setBubblePosition(bubble);
    updateBubbleWeight(bubble);
  });

  bubble.el.addEventListener("pointerup", (e) => {
    bubble.el.releasePointerCapture(e.pointerId);
    bubble.el.classList.remove("dragging");
    updateBubbleWeight(bubble);

    if (moved && bubble.weight > 0.34) {
      addSelectedTag(bubble.tag, bubble.weight, bubble.kind);
      renderRecommendations();
    }
  });
}

function updateBubbleWeight(bubble) {
  const stage = $("moodStage");
  const rect = stage.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const bx = bubble.x + bubble.size / 2;
  const by = bubble.y + bubble.size / 2;
  const dist = Math.hypot(bx - cx, by - cy);
  const maxDist = Math.min(rect.width, rect.height) * 0.46;
  bubble.weight = Math.max(0.15, Math.min(1, 1 - dist / maxDist));
  if (selectedTags.has(bubble.tag)) {
    selectedTags.get(bubble.tag).weight = Math.max(selectedTags.get(bubble.tag).weight, bubble.weight);
  }
}

function handleSearch() {
  const kw = $("searchInput").value.trim();

  if (!kw) return;

  location.href = `results.html?keyword=${encodeURIComponent(kw)}`;
}

function addSelectedTag(tag, weight = 0.7, kind = "mood") {
  const clean = cleanTag(tag);
  if (!clean) return;
  const prev = selectedTags.get(clean);
  selectedTags.set(clean, {
    tag: clean,
    weight: Math.max(prev?.weight || 0, weight),
    kind
  });

  if (groupMode && activeMemberId) {
    const member = groupMembers.find(m => m.id === activeMemberId);
    if (member) {
      const old = member.tags[clean]?.weight || 0;
      member.tags[clean] = { tag: clean, weight: Math.max(old, weight), kind };
      saveGroupMembers();
      renderMembers();
      renderGroupTags();
    }
  }

  bubbles.forEach(b => {
    if (b.tag === clean) b.el.classList.add("selected");
  });

  renderSelectedTags();
}

function removeSelectedTag(tag) {
  selectedTags.delete(tag);
  bubbles.forEach(b => {
    if (b.tag === tag) b.el.classList.remove("selected");
  });
  renderSelectedTags();
  renderRecommendations();
}

function renderSelectedTags() {
  const box = $("selectedTags");
  box.innerHTML = "";

  if (!selectedTags.size) {
    box.innerHTML = `<span class="chip">尚未選擇</span>`;
    return;
  }

  [...selectedTags.values()].forEach(item => {
    const chip = document.createElement("span");
    chip.className = "chip";
    const pct = Math.round(item.weight * 100);
    chip.innerHTML = `${escapeHtml(item.tag)} <small>${pct}%</small> <button aria-label="移除">×</button>`;
    chip.querySelector("button").addEventListener("click", () => removeSelectedTag(item.tag));
    box.appendChild(chip);
  });
}

function renderRecommendations(showAll = false) {
  const list = $("recommendList");
  const scored = allMovies
    .map(movie => ({ movie, score: computeScore(movie) }))
    .filter(x => getFeedback(x.movie) !== "dislike")
    .sort((a, b) => {
      const av = getViewCount(a.movie);
      const bv = getViewCount(b.movie);
      return b.score - a.score || bv - av;
    });

  const filtered = selectedTags.size || searchKeyword
    ? scored.filter(x => x.score > 0)
    : scored.sort((a, b) => getViewCount(b.movie) - getViewCount(a.movie) || b.score - a.score);

  const display = (showAll ? filtered : filtered.slice(0, 4));

  if (!display.length) {
    list.innerHTML = `<div class="empty-state">找不到完全符合的電影。可以把圓圈拉遠一點、減少標籤，或改搜更寬的感覺詞。</div>`;
    return;
  }

  list.innerHTML = "";
  display.forEach(({ movie, score }) => {
    const item = document.createElement("article");
    item.className = "movie-item";
    item.innerHTML = `
      <div class="poster" style="background-image:url('${safeAttr(movie.poster)}')"></div>
      <div>
        <h4>${escapeHtml(movie.title)}</h4>
        <div class="movie-meta">
          ${topTags(movie).slice(0, 3).map(t => `<span>${escapeHtml(t)}</span>`).join("")}
          ${renderFeedbackBadge(movie)}
          ${renderGroupMovieBadge(movie)}
        </div>
        <p class="movie-desc">${escapeHtml(movie.desc).slice(0, 72)}${movie.desc.length > 72 ? "..." : ""}</p>
        <p class="movie-actors">演員：${escapeHtml(movie.actors || "暫無演員資料")}</p>
      </div>
      <div class="movie-score">
        <button class="movie-fav-btn ${isFavorite(movie) ? "active" : ""}" type="button" aria-label="收藏電影">${isFavorite(movie) ? "♥" : "♡"}</button>
        ${Math.round(Math.max(score, 0.05) * 100)}%
        <small>適合度</small>
        <small>👁 ${getViewCount(movie)} 次</small>
        <button class="play-circle" type="button">▶</button>
      </div>
    `;
    item.querySelector(".movie-fav-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(movie);
      updateMemberStats();
      renderRecommendations();
    });
    item.addEventListener("click", () => openModal(movie, score));
    list.appendChild(item);
  });
}

function computeScore(movie) {
  const movieText = [
    movie.title,
    movie.desc,
    ...movie.genre,
    ...movie.mood,
    ...movie.mainScene,
    ...movie.subScene
  ].join(" ").toLowerCase();

  let score = 0;
  let max = 0;

  [...selectedTags.values()].forEach(({ tag, weight }) => {
    const t = tag.toLowerCase();
    const hitTag = fuzzyTagHit(movie, tag);
    const hitText = movieText.includes(t);

    max += weight;

    if (hitTag) {
      score += weight;
    } else if (hitText) {
      score += weight * 0.7;
    }
  });

  let finalScore = 0;

  if (max === 0) {
    finalScore = Math.min(1, 0.18 + getViewCount(movie) * 0.02);
  } else {
    finalScore = Math.min(1, score / max);
  }

  if (groupMode) {
    finalScore += computeGroupScore(movie) * 0.45;
    finalScore += computeGroupVoteScore(movie);
  }

  const feedback = getFeedback(movie);
  if (feedback === "like") finalScore += 0.22;
  if (feedback === "dislike") finalScore -= 0.35;

  return Math.max(0, Math.min(1, finalScore));
}

function fuzzyTagHit(movie, tag) {
  const all = topTags(movie);
  return all.some(t => t.includes(tag) || tag.includes(t));
}

function topTags(movie) {
  return [...movie.mood, ...movie.genre, ...movie.mainScene, ...movie.subScene].filter(Boolean);
}

function openModal(movie, score = 0) {
  currentModalMovie = movie;
  incrementView(movie);
  saveHistory(movie, score);
  updateMemberStats();
  $("modalTitle").textContent = movie.title;
  $("modalDesc").textContent = movie.desc;

const oldActors = document.getElementById("modalActors");
if (oldActors) oldActors.remove();

const actorsBox = document.createElement("p");
actorsBox.id = "modalActors";
actorsBox.className = "modal-actors";
actorsBox.textContent = `演員：${movie.actors || "暫無演員資料"}`;

$("modalDesc").insertAdjacentElement("afterend", actorsBox);
  $("modalCover").style.backgroundImage = `url('${movie.poster}')`;

  const meta = [
    movie.year,
    movie.duration,
    ...topTags(movie).slice(0, 4),
    `${Math.round(Math.max(score, 0.05) * 100)}% 適合`
  ].filter(Boolean);

  $("modalMeta").innerHTML = meta.map(m => `<span>${escapeHtml(m)}</span>`).join("");
  $("modalViewCount").textContent = `👁 ${getViewCount(movie)} 次瀏覽`;
  updateFeedbackUI(movie);
  updateGroupVoteUI(movie);
  updateFavoriteUI(movie);

  const trailer = $("trailerLink");
  if (movie.trailer) {
    trailer.href = movie.trailer;
    trailer.style.display = "inline-flex";
  } else {
    trailer.removeAttribute("href");
    trailer.style.display = "none";
  }

  $("movieModal").classList.add("active");
  $("movieModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderRecommendations();
}

function closeModal() {
  $("movieModal").classList.remove("active");
  $("movieModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}



function setActiveNav(id) {
  document.querySelectorAll(".side-nav button").forEach(btn => {
    const target = btn.getAttribute("data-target") || "";
    btn.classList.toggle("active", btn.id === id || target === id);
  });
}

function storageOwnerId() {
  const user = getCurrentUser();
  return user?.username || null;
}

function storageKey(type) {
  const owner = storageOwnerId();
  if (!owner) return null;

  const prefix = type === "history" ? HISTORY_PREFIX : FAVORITE_PREFIX;
  return `${prefix}-${owner}`;
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

function loadUsers() {
  const users = loadJson(AUTH_USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  saveJson(AUTH_USERS_KEY, users);
}

function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    return user && user.username ? user : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    username: user.username,
    email: user.email || "",
    createdAt: user.createdAt || new Date().toISOString()
  }));
}

function openAuth(mode = "login") {
  setAuthMode(mode);
  $("authModal")?.classList.add("active");
  $("authModal")?.setAttribute("aria-hidden", "false");
  $("authMessage").textContent = "";
  $("authPassword").value = "";
  setTimeout(() => $("authUsername")?.focus(), 50);
}

function closeAuth() {
  $("authModal")?.classList.remove("active");
  $("authModal")?.setAttribute("aria-hidden", "true");
}

function setAuthMode(mode) {
  authMode = mode === "register" ? "register" : "login";
  $("authTitle").textContent = authMode === "register" ? "會員註冊" : "會員登入";
  $("authSubmit").textContent = authMode === "register" ? "建立帳號" : "登入";
  $("authEmailWrap").style.display = authMode === "register" ? "grid" : "none";
  $("authLoginTab").classList.toggle("active", authMode === "login");
  $("authRegisterTab").classList.toggle("active", authMode === "register");
  $("authMessage").textContent = "";
}

function handleAuthSubmit() {
  const username = $("authUsername").value.trim();
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const msg = $("authMessage");

  if (!username || !password) {
    msg.textContent = "請輸入帳號與密碼。";
    msg.className = "auth-message error";
    return;
  }

  const users = loadUsers();

  if (authMode === "register") {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      msg.textContent = "此帳號已被註冊，請改用其他帳號。";
      msg.className = "auth-message error";
      return;
    }

    const user = { username, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    setCurrentUser(user);
    msg.textContent = "註冊成功，已自動登入。";
    msg.className = "auth-message success";
    updateAuthUI();
    updateMemberStats();
    setTimeout(closeAuth, 450);
    return;
  }

  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (!user) {
    msg.textContent = "帳號或密碼錯誤。";
    msg.className = "auth-message error";
    return;
  }

  setCurrentUser(user);
  msg.textContent = "登入成功。";
  msg.className = "auth-message success";
  updateAuthUI();
  updateMemberStats();
  setTimeout(closeAuth, 350);
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(`${HISTORY_PREFIX}-${GUEST_ID}`);
  localStorage.removeItem(`${FAVORITE_PREFIX}-${GUEST_ID}`);

  closeAuth();
  closeLibrary();
  closeCollectionChoice();
  document.querySelector('[data-target="page-home"]')?.click();

  updateAuthUI();
  updateMemberStats();
  renderRecommendations();
  renderExploreResults($("exploreSearchInput")?.value || "");
  renderCollection();
  syncCollectionButtonsUI();

  if (currentModalMovie) {
    updateFavoriteUI(currentModalMovie);
  }

  openMemberSpace();
}

function updateAuthUI() {
  const user = getCurrentUser();
  const loginBtn = $("loginBtn");
  const registerBtn = $("registerBtn");
  const memberBtn = $("memberSpaceBtn");

  if (!loginBtn || !registerBtn || !memberBtn) return;

  loginBtn.style.display = user ? "none" : "inline-flex";
  registerBtn.style.display = user ? "none" : "inline-flex";
  memberBtn.textContent = user ? user.username : "會員空間";
}

function openMemberSpace() {
  const user = getCurrentUser();
  const welcome = $("memberWelcome");
  if (welcome) {
    welcome.textContent = user
      ? `目前登入帳號：${user.username}${user.email ? `（${user.email}）` : ""}`
      : "目前尚未登入。登入後即可查看你的收藏與歷史紀錄。";
  }

  $("memberLoginFromSpace").style.display = user ? "none" : "inline-flex";
  $("logoutBtn").style.display = user ? "inline-flex" : "none";
  updateMemberStats();
  $("memberModal")?.classList.add("active");
  $("memberModal")?.setAttribute("aria-hidden", "false");
}

function closeMemberSpace() {
  $("memberModal")?.classList.remove("active");
  $("memberModal")?.setAttribute("aria-hidden", "true");
}

function updateMemberStats() {
  const history = loadCollection("history");
  const favorites = loadCollection("favorites");
  if ($("memberHistoryCount")) $("memberHistoryCount").textContent = history.length;
  if ($("memberFavoriteCount")) $("memberFavoriteCount").textContent = favorites.length;
}

function movieSnapshot(movie, score = 0) {
  return {
    id: movie.id,
    title: movie.title,
    desc: movie.desc,
    poster: movie.poster,
    trailer: movie.trailer,
    year: movie.year || "",
    duration: movie.duration || "",
    actors: movie.actors || "",
    genre: Array.isArray(movie.genre) ? movie.genre : toArray(movie.genre),
    mood: Array.isArray(movie.mood) ? movie.mood : toArray(movie.mood),
    mainScene: Array.isArray(movie.mainScene) ? movie.mainScene : toArray(movie.mainScene),
    subScene: Array.isArray(movie.subScene) ? movie.subScene : toArray(movie.subScene),
    score,
    savedAt: new Date().toISOString(),
    collectionType: movie.collectionType || "想看",
    addDate: movie.addDate || new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })
  };
}

function hydrateMovie(item) {
  const found = allMovies.find(movie => String(movie.id) === String(item.id) || movie.title === item.title);
  if (found) return found;
  return {
    ...item,
    genre: Array.isArray(item.genre) ? item.genre : toArray(item.genre),
    mood: Array.isArray(item.mood) ? item.mood : toArray(item.mood),
    mainScene: Array.isArray(item.mainScene) ? item.mainScene : toArray(item.mainScene),
    subScene: Array.isArray(item.subScene) ? item.subScene : toArray(item.subScene),
    views: item.views || 0,
    raw: item.raw || {}
  };
}

function loadCollection(type) {
  const key = storageKey(type);
  if (!key) return [];

  const items = loadJson(key, []);
  return Array.isArray(items) ? items : [];
}

function saveCollection(type, items) {
  const key = storageKey(type);
  if (!key) return;

  saveJson(key, items);
}

function saveHistory(movie, score = 0) {
  if (!getCurrentUser()) return;

  const items = loadCollection("history");
  const snapshot = movieSnapshot(movie, score);
  const next = [snapshot, ...items.filter(item => String(item.id) !== String(movie.id))].slice(0, 30);
  saveCollection("history", next);
}

function isFavorite(movie) {
  return loadCollection("favorites").some(item => String(item.id) === String(movie.id));
}

function toggleFavorite(movie, collectionType = null) {
  if (!getCurrentUser()) {
    openAuth("login");
    return;
  }

  const items = loadCollection("favorites");
  const exists = items.some(item => String(item.id) === String(movie.id));
  const next = exists
    ? items.filter(item => String(item.id) !== String(movie.id))
    : [movieSnapshot({ ...movie, collectionType: collectionType || movie.collectionType || "想看" }), ...items];

  saveCollection("favorites", next);
  renderCollection();
  syncCollectionButtonsUI();
}

function updateFavoriteUI(movie) {
  const btn = $("favoriteBtn");
  if (!btn || !movie) return;
  const active = isFavorite(movie);
  btn.classList.toggle("active", active);
  btn.textContent = active ? "♥ 已收藏" : "♡ 加入收藏";
}

function openLibrary(type = "favorites") {
  libraryMode = type === "history" ? "history" : "favorites";
  renderLibrary();
  $("libraryModal")?.classList.add("active");
  $("libraryModal")?.setAttribute("aria-hidden", "false");
}

function closeLibrary() {
  $("libraryModal")?.classList.remove("active");
  $("libraryModal")?.setAttribute("aria-hidden", "true");
}

function renderLibrary() {
  const title = $("libraryTitle");
  const label = $("libraryLabel");
  const desc = $("libraryDesc");
  const clearBtn = $("libraryClearBtn");
  const list = $("libraryList");
  if (!list) return;

  const isHistory = libraryMode === "history";
  const items = loadCollection(libraryMode);
  if (title) title.textContent = isHistory ? "歷史紀錄" : "收藏電影";
  if (label) label.textContent = isHistory ? "History" : "Favorites";
  if (desc) desc.textContent = isHistory ? "點擊歷史紀錄可以重新開啟電影詳細資料。" : "點擊收藏電影可以重新開啟電影詳細資料。";
  if (clearBtn) clearBtn.textContent = isHistory ? "清空歷史" : "清空收藏";

  if (!items.length) {
    list.innerHTML = `<div class="empty-state">目前沒有${isHistory ? "歷史紀錄" : "收藏電影"}。</div>`;
    return;
  }

  list.innerHTML = "";
  items.forEach(item => {
    const movie = hydrateMovie(item);
    const card = document.createElement("article");
    card.className = "library-card";
    const tags = topTags(movie).slice(0, 3).map(t => `<span>${escapeHtml(t)}</span>`).join("");
    const timeText = item.savedAt ? new Date(item.savedAt).toLocaleString("zh-TW") : "";
    card.innerHTML = `
      <div class="library-poster" style="background-image:url('${safeAttr(movie.poster)}')"></div>
      <div class="library-info">
        <h3>${escapeHtml(movie.title)}</h3>
        <p>${escapeHtml(movie.desc || "目前沒有簡介").slice(0, 86)}${movie.desc && movie.desc.length > 86 ? "..." : ""}</p>
        <div class="movie-meta">${tags}</div>
        <small>${timeText}</small>
      </div>
      ${!isHistory ? `<button class="library-remove" type="button">移除</button>` : ""}
    `;
    card.addEventListener("click", () => {
      closeLibrary();
      openModal(movie, item.score || 0.1);
    });
    card.querySelector(".library-remove")?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(movie);
      renderLibrary();
      updateMemberStats();
      renderRecommendations();
    });
    list.appendChild(card);
  });
}

function clearCurrentLibrary() {
  if (!confirm(`確定要清空${libraryMode === "history" ? "歷史紀錄" : "收藏電影"}嗎？`)) return;
  saveCollection(libraryMode, []);
  renderLibrary();
  updateMemberStats();
  renderRecommendations();
}


function bindPageNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const pageViews = document.querySelectorAll(".page-view");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;
      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      pageViews.forEach(page => page.classList.toggle("active", page.id === targetId));
      if (targetId === "page-explore") renderExploreResults($("exploreSearchInput")?.value.trim() || "");
      if (targetId === "page-collection") renderCollection();
      if (targetId === "page-party") {
        renderMembers();
        renderGroupTags();
      }
    });
  });
}

function bindExploreUI() {
  const exSearchInput = $("exploreSearchInput");
  const exSearchBtn = $("exploreSearchBtn");
  if (exSearchBtn && exSearchInput) {
    exSearchBtn.addEventListener("click", () => renderExploreResults(exSearchInput.value.trim()));
    exSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") renderExploreResults(exSearchInput.value.trim());
    });
  }

  document.querySelectorAll(".cat-btn, .tag-pills button").forEach(btn => {
    btn.addEventListener("click", () => {
      const rawText = btn.textContent || "";
      const cleanedText = rawText.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, "").trim();
      const intentMap = {
        "想放鬆一下": "放鬆",
        "想哭一場": "感人",
        "想看刺激的": "動作",
        "適合下雨天": "雨夜",
        "適合睡前看": "安靜",
        "適合跟朋友一起看": "歡樂"
      };
      const finalKeyword = intentMap[cleanedText] || cleanedText;
      if (exSearchInput) exSearchInput.value = finalKeyword;
      renderExploreResults(finalKeyword);
    });
  });
}

function renderExploreResults(keyword = "") {
  const list = $("exploreResultList");
  if (!list) return;

  let targetMovies = [...allMovies];
  const key = String(keyword || "").trim().toLowerCase();
  if (key) {
    targetMovies = targetMovies.filter(movie => {
      const movieText = [
        movie.title,
        movie.desc,
        movie.actors,
        ...(movie.genre || []),
        ...(movie.mood || []),
        ...(movie.mainScene || []),
        ...(movie.subScene || [])
      ].join(" ").toLowerCase();
      return movieText.includes(key);
    });
  }

  if (appSettings.noHorror) {
    targetMovies = targetMovies.filter(m => !m.genre.includes("恐怖") && !m.genre.includes("驚悚"));
  }
  if (appSettings.noSad) {
    targetMovies = targetMovies.filter(m => !m.genre.includes("悲劇") && !m.mood.includes("悲傷") && !m.mood.includes("心碎"));
  }
  if (appSettings.prefPop) {
    targetMovies.sort((a, b) => getViewCount(b) - getViewCount(a));
  } else if (appSettings.prefNiche) {
    targetMovies.sort((a, b) => getViewCount(a) - getViewCount(b));
  } else {
    targetMovies.sort(() => Math.random() - 0.5);
  }

  const displayMovies = targetMovies.slice(0, 18);
  if (!displayMovies.length) {
    list.innerHTML = `<div class="empty-state">找不到相關電影，試試其他分類吧！</div>`;
    return;
  }

  list.className = "explore-result-grid";
  list.innerHTML = "";
  displayMovies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "explore-movie-card";
    const tags = topTags(movie).slice(0, 2).map(t => `<span>${escapeHtml(t)}</span>`).join("");
    const mockScore = Math.floor(Math.random() * 20 + 80);
    const collected = isFavorite(movie);
    card.innerHTML = `
      <div class="explore-poster" style="background-image:url('${safeAttr(movie.poster)}')">
        <div class="explore-score-badge">${mockScore}% ♡</div>
      </div>
      <div class="explore-info">
        <h4>${escapeHtml(movie.title)}</h4>
        <div class="explore-meta">
          <div class="explore-tags">${tags}</div>
          <button class="add-col-card-btn ${collected ? "collected" : ""}" data-id="${safeAttr(movie.id)}" type="button" aria-label="收藏">${collected ? "✓ 已收藏" : "＋ 加入收藏"}</button>
        </div>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".add-col-card-btn")) {
        e.stopPropagation();
        if (isFavorite(movie)) {
          toggleFavorite(movie);
          updateMemberStats();
          renderExploreResults($("exploreSearchInput")?.value || "");
          renderRecommendations();
        } else {
          pendingMovie = movie;
          openCollectionChoice();
        }
        return;
      }
      openModal(movie, mockScore / 100);
    });
    list.appendChild(card);
  });
}

function bindCollectionUI() {
  $("colClose")?.addEventListener("click", closeCollectionChoice);
  $("colBackdrop")?.addEventListener("click", closeCollectionChoice);

  document.querySelectorAll(".col-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!pendingMovie) return;
      const type = btn.getAttribute("data-type") || "想看";
      toggleFavorite(pendingMovie, type);
      pendingMovie = null;
      closeCollectionChoice();
      renderCollection();
      renderExploreResults($("exploreSearchInput")?.value || "");
      renderRecommendations();
      updateMemberStats();
    });
  });

  document.querySelectorAll(".collection-tabs .tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".collection-tabs .tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentTab = tab.textContent.trim();
      renderCollection();
    });
  });

  $("goExploreBtn")?.addEventListener("click", () => {
    document.querySelector('[data-target="page-explore"]')?.click();
  });
}

function openCollectionChoice() {
  $("collectionModal")?.classList.add("active");
  $("collectionModal")?.setAttribute("aria-hidden", "false");
}

function closeCollectionChoice() {
  $("collectionModal")?.classList.remove("active");
  $("collectionModal")?.setAttribute("aria-hidden", "true");
}

function renderCollection() {
  const list = $("collectionList");
  const emptyState = $("collectionEmpty");
  if (!list || !emptyState) return;
  const favorites = loadCollection("favorites");
  const filteredCollections = currentTab === "全部收藏"
    ? favorites
    : favorites.filter(m => (m.collectionType || "想看") === currentTab);

  if (!filteredCollections.length) {
    list.style.display = "none";
    emptyState.style.display = "flex";
    return;
  }

  list.style.display = "grid";
  emptyState.style.display = "none";
  list.innerHTML = "";

  filteredCollections.forEach(item => {
    const movie = hydrateMovie(item);
    const card = document.createElement("article");
    card.className = "explore-movie-card";
    const tags = topTags(movie).slice(0, 2).map(t => `<span>${escapeHtml(t)}</span>`).join("");
    const type = item.collectionType || "想看";
    const date = item.addDate || (item.savedAt ? new Date(item.savedAt).toLocaleDateString("zh-TW") : "近期");
    card.innerHTML = `
      <div class="explore-poster" style="background-image:url('${safeAttr(movie.poster)}')"></div>
      <div class="explore-info">
        <div class="col-badge">${escapeHtml(type)}</div>
        <h4>${escapeHtml(movie.title)}</h4>
        <div class="explore-tags" style="margin-bottom: 12px;">${tags}</div>
        <div class="collection-footer">
          <span>收藏於 ${escapeHtml(date)}</span>
          <button class="delete-btn" type="button" title="移除收藏">🗑️</button>
        </div>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".delete-btn")) {
        e.stopPropagation();
        toggleFavorite(movie);
        renderCollection();
        renderExploreResults($("exploreSearchInput")?.value || "");
        renderRecommendations();
        updateMemberStats();
        return;
      }
      openModal(movie, item.score || 0.95);
    });
    list.appendChild(card);
  });
}

function syncCollectionButtonsUI() {
  document.querySelectorAll(".add-col-card-btn").forEach(btn => {
    const movieId = btn.getAttribute("data-id");
    if (!movieId) return;
    const collected = loadCollection("favorites").some(m => String(m.id) === String(movieId));
    btn.textContent = collected ? "✓ 已收藏" : "＋ 加入收藏";
    btn.classList.toggle("collected", collected);
  });
}

function bindSettingsUI() {
  const applyVisualSettings = () => {
    if ($("setThemeDark")) $("setThemeDark").checked = appSettings.themeDark;
    if ($("setAnim")) $("setAnim").checked = appSettings.anim;
    if ($("setPrefPop")) $("setPrefPop").checked = appSettings.prefPop;
    if ($("setPrefNiche")) $("setPrefNiche").checked = appSettings.prefNiche;
    if ($("setNoHorror")) $("setNoHorror").checked = appSettings.noHorror;
    if ($("setNoSad")) $("setNoSad").checked = appSettings.noSad;

    document.querySelectorAll(".seg-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-val") === appSettings.cardSize);
    });

    document.body.classList.toggle("light-mode", !appSettings.themeDark);
    document.body.classList.toggle("disable-animations", !appSettings.anim);
    document.body.classList.remove("card-size-small", "card-size-large");
    if (appSettings.cardSize === "小") document.body.classList.add("card-size-small");
    if (appSettings.cardSize === "大") document.body.classList.add("card-size-large");
  };

  applyVisualSettings();

  const toggleMap = {
    setThemeDark: "themeDark",
    setAnim: "anim",
    setPrefPop: "prefPop",
    setPrefNiche: "prefNiche",
    setNoHorror: "noHorror",
    setNoSad: "noSad"
  };

  Object.keys(toggleMap).forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("change", (e) => {
      appSettings[toggleMap[id]] = e.target.checked;
      saveAppSettings();
      applyVisualSettings();
      renderExploreResults($("exploreSearchInput")?.value || "");
      renderRecommendations();
    });
  });

  document.querySelectorAll(".seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      appSettings.cardSize = btn.getAttribute("data-val");
      saveAppSettings();
      applyVisualSettings();
    });
  });

  $("clearCollectionBtn")?.addEventListener("click", () => {
    if (confirm("確定要清除所有收藏嗎？")) {
      saveCollection("favorites", []);
      renderCollection();
      renderExploreResults($("exploreSearchInput")?.value || "");
      renderRecommendations();
      updateMemberStats();
      alert("收藏已清空！");
    }
  });

  $("resetAllDataBtn")?.addEventListener("click", () => {
    if (confirm("將清除所有記憶、會員登入狀態與設定，確定繼續？")) {
      localStorage.clear();
      location.reload();
    }
  });

  $("saveSettingsBtn")?.addEventListener("click", (e) => {
    e.target.textContent = "✓ 設定已儲存";
    e.target.style.background = "#6ccf91";
    setTimeout(() => {
      e.target.textContent = "儲存設定";
      e.target.style.background = "linear-gradient(90deg, #8e63ff, #f06ba7)";
    }, 1500);
  });
}

function ensureDefaultMembers() {
  if (groupMembers.length) return;

  groupMembers = [
    { id: "member-a", name: "成員 A", tags: {} },
    { id: "member-b", name: "成員 B", tags: {} },
    { id: "member-c", name: "成員 C", tags: {} }
  ];
  activeMemberId = "member-a";
  saveGroupMembers();
}

function loadGroupMembers() {
  try {
    return JSON.parse(localStorage.getItem("feelmovie-group-members") || "[]");
  } catch {
    return [];
  }
}

function saveGroupMembers() {
  localStorage.setItem("feelmovie-group-members", JSON.stringify(groupMembers));
}

function loadGroupVotes() {
  try {
    return JSON.parse(localStorage.getItem("feelmovie-group-votes") || "{}");
  } catch {
    return {};
  }
}

function saveGroupVotes() {
  localStorage.setItem("feelmovie-group-votes", JSON.stringify(groupVotes));
}

function addMemberFromInput() {
  const input = $("memberNameInput");
  const name = input.value.trim();
  if (!name) return;

  const id = `member-${Date.now()}`;
  groupMembers.push({ id, name, tags: {} });
  activeMemberId = id;
  input.value = "";
  saveGroupMembers();
  renderMembers();
  renderGroupTags();
  renderRecommendations();
}

function removeMember(id) {
  groupMembers = groupMembers.filter(m => m.id !== id);
  if (activeMemberId === id) {
    activeMemberId = groupMembers[0]?.id || null;
  }

  Object.keys(groupVotes).forEach(movieId => {
    delete groupVotes[movieId][id];
  });

  saveGroupMembers();
  saveGroupVotes();
  renderMembers();
  renderGroupTags();
  renderRecommendations();
}

function setActiveMember(id) {
  activeMemberId = id;
  renderMembers();
  updateGroupVoteUI(currentModalMovie);
}

function renameMember(id) {
  const member = groupMembers.find(m => m.id === id);
  if (!member) return;

  const newName = prompt("請輸入新的成員名稱", member.name);
  if (!newName) return;

  const cleanName = newName.trim();
  if (!cleanName) return;

  member.name = cleanName;
  saveGroupMembers();
  renderMembers();
  updateGroupVoteUI(currentModalMovie);
  renderRecommendations();
}

function renderMembers() {
  const box = $("memberList");
  if (!box) return;

  box.innerHTML = "";
  groupMembers.forEach(member => {
    const tagNames = Object.keys(member.tags || {});
    const card = document.createElement("article");
    card.className = `member-card ${member.id === activeMemberId ? "active" : ""}`;
    card.innerHTML = `
      <h4>${escapeHtml(member.name)}</h4>
      <p>${tagNames.length ? tagNames.slice(0, 4).join("、") : "尚未選擇感覺"}</p>
      <div class="member-actions">
        <button data-action="active">切換</button>
        <button data-action="rename">改名</button>
        <button data-action="clear">清空</button>
        <button data-action="remove">移除</button>
      </div>
    `;

    card.querySelector('[data-action="active"]').addEventListener("click", () => setActiveMember(member.id));
    card.querySelector('[data-action="rename"]').addEventListener("click", () => renameMember(member.id));
    card.querySelector('[data-action="clear"]').addEventListener("click", () => {
      member.tags = {};
      saveGroupMembers();
      renderMembers();
      renderGroupTags();
      renderRecommendations();
    });
    card.querySelector('[data-action="remove"]').addEventListener("click", () => removeMember(member.id));
    box.appendChild(card);
  });
}

function getGroupTagMap() {
  const map = new Map();

  groupMembers.forEach(member => {
    Object.values(member.tags || {}).forEach(item => {
      const prev = map.get(item.tag) || { tag: item.tag, weight: 0, count: 0 };
      prev.weight += item.weight || 0.6;
      prev.count += 1;
      map.set(item.tag, prev);
    });
  });

  return map;
}

function renderGroupTags() {
  const box = $("groupTags");
  if (!box) return;

  const tags = [...getGroupTagMap().values()]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 10);

  if (!tags.length) {
    box.innerHTML = `<span class="group-tag">尚無共同感覺</span>`;
    return;
  }

  box.innerHTML = tags.map(t => `
    <span class="group-tag">${escapeHtml(t.tag)} <small>${t.count}人</small></span>
  `).join("");
}

function computeGroupScore(movie) {
  const tags = [...getGroupTagMap().values()];
  if (!tags.length) return 0;

  const movieText = [
    movie.title,
    movie.desc,
    ...movie.genre,
    ...movie.mood,
    ...movie.mainScene,
    ...movie.subScene
  ].join(" ").toLowerCase();

  let score = 0;
  let max = 0;

  tags.forEach(item => {
    const tag = item.tag.toLowerCase();
    const weight = item.weight || 0.6;
    max += weight;
    if (movieText.includes(tag) || fuzzyTagHit(movie, item.tag)) {
      score += weight;
    }
  });

  return max ? score / max : 0;
}

function computeGroupVoteScore(movie) {
  const votes = groupVotes[movie.id] || {};
  const values = Object.values(votes);
  if (!values.length) return 0;

  let score = 0;
  values.forEach(v => {
    if (v === "want") score += 0.18;
    if (v === "nope") score -= 0.22;
  });

  return score;
}

function setGroupVote(type) {
  if (!currentModalMovie || !activeMemberId) return;
  if (!groupVotes[currentModalMovie.id]) groupVotes[currentModalMovie.id] = {};
  groupVotes[currentModalMovie.id][activeMemberId] = type;
  saveGroupVotes();
  updateGroupVoteUI(currentModalMovie);
  renderRecommendations();
}

function updateGroupVoteUI(movie) {
  const status = $("groupVoteStatus");
  const wantBtn = $("groupWantBtn");
  const nopeBtn = $("groupNopeBtn");
  if (!status || !wantBtn || !nopeBtn || !movie) return;

  const member = groupMembers.find(m => m.id === activeMemberId);
  const vote = groupVotes[movie.id]?.[activeMemberId] || "";

  wantBtn.classList.toggle("active", vote === "want");
  nopeBtn.classList.toggle("active", vote === "nope");

  if (!groupMode) {
    status.textContent = "多人模式尚未開啟，開啟後可讓不同成員投票。";
    return;
  }

  if (!member) {
    status.textContent = "請先新增或選擇一位成員。";
    return;
  }

  if (vote === "want") {
    status.textContent = `${member.name} 已投票：想看這部。`;
  } else if (vote === "nope") {
    status.textContent = `${member.name} 已投票：不想看這部。`;
  } else {
    status.textContent = `目前投票成員：${member.name}`;
  }
}

function renderGroupMovieBadge(movie) {
  if (!groupMode) return "";
  const votes = groupVotes[movie.id] || {};
  const wants = Object.values(votes).filter(v => v === "want").length;
  const nopes = Object.values(votes).filter(v => v === "nope").length;
  const groupScore = Math.round(computeGroupScore(movie) * 100);

  const parts = [];
  if (groupScore > 0) parts.push(`<span class="group-badge">👥 共同 ${groupScore}%</span>`);
  if (wants > 0) parts.push(`<span class="feedback-badge like vote-badge">🙋 ${wants} 想看</span>`);
  if (nopes > 0) parts.push(`<span class="feedback-badge dislike vote-badge bad">🙅 ${nopes} 不想看</span>`);
  return parts.join("");
}


function loadFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem("feelmovie-feedbacks") || "{}");
  } catch {
    return {};
  }
}

function saveFeedbacks() {
  localStorage.setItem("feelmovie-feedbacks", JSON.stringify(feedbacks));
}

function getFeedback(movie) {
  return feedbacks[movie.id]?.rating || "";
}

function hasWatchedTrailer(movie) {
  return Boolean(feedbacks[movie.id]?.watchedTrailer);
}

function markTrailerWatched(movie) {
  const prev = feedbacks[movie.id] || {};
  feedbacks[movie.id] = {
    ...prev,
    watchedTrailer: true,
    watchedAt: new Date().toISOString()
  };
  saveFeedbacks();
}

function setFeedback(type) {
  if (!currentModalMovie) return;

  const movieId = currentModalMovie.id;

  const prev = feedbacks[movieId] || {};
  feedbacks[movieId] = {
    ...prev,
    rating: type,
    ratedAt: new Date().toISOString()
  };
  saveFeedbacks();
  updateFeedbackUI(currentModalMovie);

  if (type === "dislike") {
    const scored = allMovies
      .map(movie => ({ movie, score: computeScore(movie) }))
      .sort((a, b) => {
        const av = getViewCount(a.movie);
        const bv = getViewCount(b.movie);
        return b.score - a.score || bv - av;
      });
    const nextBest = scored.find(x => x.movie.id !== movieId);

    if (nextBest && nextBest.score > 0) {
      openModal(nextBest.movie, nextBest.score);
    } else {
      closeModal();
      renderRecommendations();
    }
    
  } else {
    renderRecommendations();
  }
}

function updateFeedbackUI(movie) {
  const likeBtn = $("likeBtn");
  const dislikeBtn = $("dislikeBtn");
  const status = $("feedbackStatus");
  if (!likeBtn || !dislikeBtn || !status) return;

  const rating = getFeedback(movie);
  const watched = hasWatchedTrailer(movie);

  likeBtn.classList.toggle("active", rating === "like");
  dislikeBtn.classList.toggle("active", rating === "dislike");

  if (rating === "like") {
    status.textContent = "你給了好評：之後會更常推薦相似氛圍的電影。";
  } else if (rating === "dislike") {
    status.textContent = "你給了差評：之後會降低相似電影的推薦權重。";
  } else if (watched) {
    status.textContent = "你已開啟預告片，可以給這部電影好評或差評。";
  } else {
    status.textContent = "尚未評分。你可以看完預告後再給回饋。";
  }
}

function renderFeedbackBadge(movie) {
  const rating = getFeedback(movie);
  if (rating === "like") return `<span class="feedback-badge like">👍 已好評</span>`;
  if (rating === "dislike") return `<span class="feedback-badge dislike">👎 已差評</span>`;
  return "";
}


function loadViews() {
  try {
    return JSON.parse(localStorage.getItem("feelmovie-view-counts") || "{}");
  } catch {
    return {};
  }
}

function saveViews() {
  localStorage.setItem("feelmovie-view-counts", JSON.stringify(viewCounts));
}

function getViewCount(movie) {
  return Number(viewCounts[movie.id] || 0) + Number(movie.views || 0);
}

function incrementView(movie) {
  viewCounts[movie.id] = Number(viewCounts[movie.id] || 0) + 1;
  saveViews();
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function safeAttr(s) {
  return String(s || "").replace(/'/g, "%27").replace(/\)/g, "%29");
}
