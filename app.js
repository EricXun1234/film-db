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
const ROOM_KEY = "moodluma-current-room";
const ROOM_PREFIX = "ROOM-";

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
  genre: [
    "genreKeywords", "genre_keywords", "genres", "genre", "categories", "category", "types", "type",
    "類型關鍵字", "類型", "電影類型", "分類", "電影分類", "片種", "風格"
  ],
  mood: [
    "mood", "emotion", "emotions", "atmosphere", "feel", "feeling", "vibe", "tone",
    "情感／氛圍", "情感/氛圍", "情感", "氛圍", "情緒", "情緒關鍵字", "氛圍關鍵字"
  ],
  year: ["year", "releaseYear", "release_year", "年份", "上映年份"],
  duration: ["duration", "runtime", "length", "片長", "時長"],
  views: ["views", "viewCount", "view_count", "clicks", "clickCount", "瀏覽次數", "點擊次數", "觀看次數"],
  actors: ["actors", "actor", "cast", "casts","演員", "演員名單", "主演", "卡司"],
  keywords: [
    "keywords", "keyword", "tags", "tag", "labels", "label",
    "關鍵字", "標籤", "電影關鍵字", "內容關鍵字", "主題", "題材"
  ],
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
  genre: ["恐怖", "愛情", "科幻", "犯罪", "喜劇", "動作", "劇情", "動畫", "紀錄", "懸疑", "驚悚", "青春", "冒險", "奇幻", "家庭", "戰爭", "歷史", "音樂", "傳記", "西部"]
};

/*
  熱門分類不只比對單一「類型」字串，也涵蓋常見子類型、題材與中英文別名。
  這些規則會同時套用到片名、簡介、類型、氛圍、場景與關鍵字欄位。
*/
const CATEGORY_RULES = {
  "喜劇": ["喜劇", "搞笑", "幽默", "歡樂", "爆笑", "荒謬", "詼諧", "黑色幽默", "諷刺", "惡搞", "脫口秀", "comedy", "comic", "satire"],
  "愛情": ["愛情", "浪漫", "戀愛", "愛戀", "戀人", "戀曲", "戀情", "感情", "初戀", "暗戀", "相愛", "愛上", "真愛", "情侶", "伴侶", "夫妻", "婚姻", "婚戀", "婚禮", "婚約", "約會", "分手", "前任", "情感糾葛", "關係探索", "love story", "romance", "romantic", "relationship", "rom-com", "romcom"],
  "驚悚": ["驚悚", "心理驚悚", "緊張", "追殺", "逃亡", "危險", "生存戰", "懾人", "懸命", "thriller", "suspense"],
  "科幻": ["科幻", "未來", "太空", "外星", "機器人", "人工智慧", "時空", "時間旅行", "多元宇宙", "高科技", "賽博龐克", "反烏托邦", "sci-fi", "scifi", "science fiction", "cyberpunk"],
  "動作": ["動作", "戰鬥", "武打", "功夫", "格鬥", "槍戰", "特務", "諜報", "英雄", "超級英雄", "追逐", "復仇", "傭兵", "action", "martial arts"],
  "動畫": ["動畫", "卡通", "動漫", "親子動畫", "童趣", "定格動畫", "animation", "animated", "anime"],
  "劇情": ["劇情", "人生", "家庭倫理", "成長", "勵志", "人性", "社會寫實", "救贖", "寫實", "職人", "drama", "dramatic"],
  "懸疑": ["懸疑", "推理", "謎團", "偵探", "解謎", "神秘", "命案", "陰謀", "查案", "反轉", "燒腦", "mystery", "detective", "whodunit"],
  "恐怖": ["恐怖", "心理恐怖", "鬼", "鬼屋", "靈異", "超自然", "詛咒", "惡魔", "惡靈", "驅魔", "血腥", "怪物", "殭屍", "喪屍", "horror", "supernatural"],
  "犯罪": ["犯罪", "黑幫", "警匪", "警察", "毒梟", "劫案", "謀殺案", "國際犯罪", "詐騙", "監獄", "緝毒", "crime", "gangster", "heist"],
  "冒險": ["冒險", "探險", "探索", "旅程", "尋寶", "奇遇", "遺跡", "遠征", "荒野", "adventure", "expedition"],
  "奇幻": ["奇幻", "魔法", "魔幻", "精靈", "神話", "黑暗奇幻", "異空間", "巫師", "龍族", "童話", "fantasy", "fairy tale"],
  "家庭": ["家庭", "家庭劇", "親子", "溫馨", "家人", "父子", "父女", "母子", "母女", "手足", "祖孫", "family"],
  "戰爭": ["戰爭", "軍事", "軍隊", "戰場", "核子", "歷史戰爭", "士兵", "空戰", "海戰", "war", "military"],
  "歷史": ["歷史", "歷史劇", "時代劇", "傳記", "古裝", "年代", "宮廷", "史詩", "真人真事", "history", "historical", "biography", "biopic"],
  "音樂": ["音樂", "音樂劇", "歌舞", "合唱團", "舞台", "樂團", "歌手", "演唱會", "舞蹈", "music", "musical", "concert"]
};

const FALLBACK_BUBBLE_TAGS = [
  ["孤獨", "mood"], ["療癒", "mood"], ["浪漫", "mood"], ["壓迫感", "mood"], ["放空", "mood"],
  ["歡樂", "mood"], ["感人", "mood"], ["熱血", "mood"],
  ["深夜感", "atmosphere"], ["雨夜", "atmosphere"], ["夕陽感", "atmosphere"], ["冷調", "atmosphere"],
  ["復古", "atmosphere"], ["慢節奏", "atmosphere"],
  ["校園", "scene"], ["海邊", "scene"], ["咖啡館", "scene"], ["老屋", "scene"],
  ["公路", "scene"], ["小鎮", "scene"],
  ["恐怖片", "genre"], ["愛情片", "genre"], ["科幻片", "genre"], ["喜劇片", "genre"]
];

const KIND_META = {
  mood: { label: "情緒", icon: "♡", colors: ["#9b5cff", "#f06ba7"], glow: "rgba(240,107,167,0.45)" },
  atmosphere: { label: "氛圍", icon: "☾", colors: ["#406dff", "#7d5cff"], glow: "rgba(79,140,255,0.42)" },
  scene: { label: "場景", icon: "⌂", colors: ["#1eaeb8", "#6ccf91"], glow: "rgba(87,211,218,0.38)" },
  genre: { label: "類型", icon: "✦", colors: ["#dc633a", "#e8b553"], glow: "rgba(232,181,83,0.42)" }
};

const BUBBLE_LIMIT = 10;
const MAX_BUBBLE_HISTORY_ROUNDS = 3;
const BUBBLE_SIZE = 92;
const BUBBLE_COLOR_PALETTE = [
  { colors: ["#F08A3E", "#F5C04E"], glow: "rgba(245,192,78,0.42)" },
  { colors: ["#B45CFF", "#EA6FCB"], glow: "rgba(234,111,203,0.42)" },
  { colors: ["#4F6CFF", "#6C8CFF"], glow: "rgba(79,108,255,0.42)" },
  { colors: ["#35C6B0", "#5ED39A"], glow: "rgba(53,198,176,0.38)" }
];

let allMovies = [];
let bubbles = [];
let allTagCandidates = [];
let bubbleRoundHistory = [];
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

function getBubblePaletteByGroup(index, total) {
  const paletteCount = BUBBLE_COLOR_PALETTE.length;
  const baseSize = Math.floor(total / paletteCount);
  const extra = total % paletteCount;

  let start = 0;

  for (let i = 0; i < paletteCount; i++) {
    const groupSize = baseSize + (i < extra ? 1 : 0);
    const end = start + groupSize;

    if (index >= start && index < end) {
      return BUBBLE_COLOR_PALETTE[i];
    }

    start = end;
  }

  return BUBBLE_COLOR_PALETTE[paletteCount - 1];
}

function saveAppSettings() {
  saveJson("moodluma_settings", appSettings);
}

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindUI();
  allMovies = await loadMoviesFromFilmDB();

  updateRoomUI();
  groupMembers = loadGroupMembers();
  groupVotes = loadGroupVotes();
  activeMemberId = groupMembers[0]?.id || null;

  ensureDefaultMembers();
  buildDynamicBubbles();
  renderMembers();
  renderGroupTags();
  renderRoleOptions();
  renderSelectedTags();
  renderRecommendations();
  renderExploreResults();
  renderCollection();
  updateAuthUI();
  updateMemberStats();
  window.addEventListener("resize", debounceBubbleLayout);
}

let bubbleResizeTimer = null;
function debounceBubbleLayout() {
  clearTimeout(bubbleResizeTimer);
  bubbleResizeTimer = setTimeout(() => {
    if (bubbles.length) layoutBubbles();
  }, 120);
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

  $("feedbackTemperature")?.addEventListener("input", (e) => {
    updateTemperaturePreview(Number(e.target.value));
  });

  $("submitTempFeedback")?.addEventListener("click", () => {
    const value = Number($("feedbackTemperature")?.value || 50);
    setTemperatureFeedback(value);
  });

  $("trailerLink")?.addEventListener("click", () => {
    if (!currentModalMovie) return;
    markTrailerWatched(currentModalMovie);
    updateFeedbackUI(currentModalMovie);
  });

  $("focusMemberInputBtn")?.addEventListener("click", () => {
  $("memberNameInput")?.focus();
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

  $("newRoomBtn")?.addEventListener("click", () => {
    const newCode = generateRoomCode();
    setCurrentRoomCode(newCode);
  });

  $("joinRoomBtn")?.addEventListener("click", () => {
    const code = $("joinRoomInput")?.value || "";

    if (!code.trim()) {
      alert("請輸入房間代碼。");
      return;
    }

    setCurrentRoomCode(code);
  });

  $("joinRoomInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const code = $("joinRoomInput")?.value || "";
      if (!code.trim()) {
        alert("請輸入房間代碼。");
        return;
      }
      setCurrentRoomCode(code);
    }
  });

  // 點選角色圖片，套用到目前選中的成員
  document.querySelectorAll(".role-option").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!activeMemberId) return;

      const member = groupMembers.find(m => m.id === activeMemberId);
      if (!member) return;

      member.role = btn.dataset.role;

      saveGroupMembers();
      renderMembers();
      renderRoleOptions();
    });
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
  $("forgotPasswordBtn")?.addEventListener("click", openForgotPassword);
  $("forgotPasswordClose")?.addEventListener("click", closeForgotPassword);
  $("forgotPasswordBackdrop")?.addEventListener("click", closeForgotPassword);
  $("backToLoginBtn")?.addEventListener("click", () => {
    closeForgotPassword();
    openAuth("login");
  });
  $("resetPasswordSubmit")?.addEventListener("click", handlePasswordReset);
  $("resetConfirmPassword")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handlePasswordReset();
  });
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
        const uniqueList = dedupeMovies(list);
        const removedCount = list.length - uniqueList.length;
        const dedupeNote = removedCount > 0 ? `，已合併 ${removedCount} 筆重複資料` : "";
        $("dbStatus").textContent = `已連接 FilmDB：成功讀取 ${uniqueList.length} 部電影${dedupeNote}，圓圈與搜尋皆由資料庫生成。`;
        return uniqueList;
      }
    } catch (err) {
      console.warn("FilmDB 讀取失敗：", url, err);
    }
  }

  $("dbStatus").textContent = "FilmDB 目前無法由瀏覽器直接讀取，可能是 API 路徑或 CORS 尚未開放。現在先使用本地示範資料。";
  return dedupeMovies(FALLBACK_MOVIES.map((m, i) => normalizeMovie(m, i)));
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
    keywords: toArray(get("keywords")),
    raw
  };
}

function normalizeIdentityText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

function getMovieYear(movie) {
  return String(movie?.year || "").match(/(?:19|20)\d{2}/)?.[0] || "";
}

function mergeUniqueTags(...lists) {
  const seen = new Set();
  const merged = [];

  lists.flat().forEach(tag => {
    const clean = cleanTag(tag);
    const key = canonicalTagKey(clean);
    if (!clean || !key || seen.has(key)) return;
    seen.add(key);
    merged.push(clean);
  });

  return merged;
}

function mergeMovieRecords(current, incoming) {
  const preferLonger = (a, b) => String(b || "").length > String(a || "").length ? b : a;

  return {
    ...incoming,
    ...current,
    id: current.id || incoming.id,
    title: current.title || incoming.title,
    desc: preferLonger(current.desc, incoming.desc),
    poster: current.poster || incoming.poster,
    trailer: current.trailer || incoming.trailer,
    year: current.year || incoming.year,
    duration: current.duration || incoming.duration,
    actors: preferLonger(current.actors, incoming.actors),
    views: Math.max(Number(current.views || 0), Number(incoming.views || 0)),
    genre: mergeUniqueTags(current.genre || [], incoming.genre || []),
    mood: mergeUniqueTags(current.mood || [], incoming.mood || []),
    mainScene: mergeUniqueTags(current.mainScene || [], incoming.mainScene || []),
    subScene: mergeUniqueTags(current.subScene || [], incoming.subScene || []),
    keywords: mergeUniqueTags(current.keywords || [], incoming.keywords || []),
    raw: { ...(incoming.raw || {}), ...(current.raw || {}) }
  };
}

/*
  FilmDB 的 HTML 或 API 有時會讓同一部片以不同資料列出現。
  預告片相同、資料庫 id 相同，或片名相同且年份不衝突時，視為同一部並合併欄位。
*/
function dedupeMovies(movies) {
  const unique = [];
  const idIndex = new Map();
  const trailerIndex = new Map();
  const titleIndex = new Map();

  (movies || []).filter(Boolean).forEach(movie => {
    const explicitId = movie.raw?.id || movie.raw?._id || movie.raw?.uuid || "";
    const idKey = normalizeIdentityText(explicitId);
    const trailerKey = getYoutubeIdFromUrl(movie.trailer);
    const titleKey = normalizeIdentityText(movie.title);
    const year = getMovieYear(movie);
    let matchIndex;

    if (trailerKey && trailerIndex.has(trailerKey)) {
      matchIndex = trailerIndex.get(trailerKey);
    } else if (idKey && idIndex.has(idKey)) {
      matchIndex = idIndex.get(idKey);
    } else if (titleKey && !titleKey.startsWith("未命名電影")) {
      const candidates = titleIndex.get(titleKey) || [];
      matchIndex = candidates.find(index => {
        const existingYear = getMovieYear(unique[index]);
        return !year || !existingYear || year === existingYear;
      });
    }

    if (matchIndex !== undefined) {
      unique[matchIndex] = mergeMovieRecords(unique[matchIndex], movie);
      if (idKey) idIndex.set(idKey, matchIndex);
      if (trailerKey) trailerIndex.set(trailerKey, matchIndex);
      if (titleKey && !(titleIndex.get(titleKey) || []).includes(matchIndex)) {
        titleIndex.set(titleKey, [...(titleIndex.get(titleKey) || []), matchIndex]);
      }
      return;
    }

    const nextIndex = unique.length;
    unique.push(movie);
    if (idKey) idIndex.set(idKey, nextIndex);
    if (trailerKey) trailerIndex.set(trailerKey, nextIndex);
    if (titleKey) titleIndex.set(titleKey, [...(titleIndex.get(titleKey) || []), nextIndex]);
  });

  return unique;
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
  if (Array.isArray(value)) return value.flatMap(toArray);
  if (typeof value === "object") return Object.values(value).flatMap(toArray);
  return String(value)
    .split(/[,，、|/／\n;；]+/)
    .map(cleanTag)
    .filter(Boolean);
}

function cleanTag(s) {
  return String(s).trim().replace(/^#/, "").replace(/\s+/g, " ");
}

function canonicalTagKey(tag) {
  const key = normalizeIdentityText(tag);
  const genreRoot = TAG_KIND_RULES.genre.find(root => {
    const normalizedRoot = normalizeIdentityText(root);
    return key === `${normalizedRoot}片` || key === `${normalizedRoot}電影` || key === `${normalizedRoot}影片`;
  });
  return genreRoot ? normalizeIdentityText(genreRoot) : key;
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
      { list: movie.subScene, base: 2.2 },
      { list: movie.keywords, base: 1.8 }
    ];

    fieldGroups.forEach(({ list, base }) => {
      list.forEach(tag => {
        const key = canonicalTagKey(tag);
        if (!key) return;
        const kind = classifyTag(tag);
        const prev = counts.get(key) || { tag: cleanTag(tag), score: 0, kind, count: 0 };
        prev.score += base + (kind === "mood" ? 1.4 : 0);
        prev.count += 1;
        prev.kind = kind;
        counts.set(key, prev);
      });
    });
  });

  let candidates = [...counts.values()];

  // 至少準備兩輪不同標籤；資料庫候選不足時才使用低權重備用標籤。
  if (candidates.length < BUBBLE_LIMIT * 2) {
    FALLBACK_BUBBLE_TAGS.forEach(([tag, kind]) => {
      const key = canonicalTagKey(tag);
      if (counts.has(key) || candidates.some(item => canonicalTagKey(item.tag) === key)) return;
      candidates.push({ tag, score: 0.8, kind, count: 0 });
    });
  }

  allTagCandidates = candidates;
  bubbleRoundHistory = [];
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
  const uniqueCandidates = [];
  const candidateIndex = new Map();

  (candidates || []).forEach(item => {
    const key = canonicalTagKey(item.tag);
    if (!key) return;

    if (candidateIndex.has(key)) {
      const index = candidateIndex.get(key);
      const current = uniqueCandidates[index];
      current.score = Math.max(Number(current.score || 0), Number(item.score || 0));
      current.count = Math.max(Number(current.count || 0), Number(item.count || 0));
      return;
    }

    candidateIndex.set(key, uniqueCandidates.length);
    uniqueCandidates.push({ ...item, tag: cleanTag(item.tag), _key: key });
  });

  const excludedKeys = new Set(excludeTags.map(canonicalTagKey));
  const recentKeys = new Set(bubbleRoundHistory.flat());
  const buckets = { mood: [[], [], []], atmosphere: [[], [], []], scene: [[], [], []], genre: [[], [], []] };

  uniqueCandidates.forEach(item => {
    const kind = buckets[item.kind] ? item.kind : "mood";
    const freshness = !excludedKeys.has(item._key) && !recentKeys.has(item._key)
      ? 0
      : (!excludedKeys.has(item._key) ? 1 : 2);
    buckets[kind][freshness].push(item);
  });

  Object.values(buckets).forEach(tiers => {
    tiers.forEach((items, tier) => {
      tiers[tier] = weightedShuffle(items);
    });
  });

  const order = ["genre", "mood", "atmosphere", "scene", "genre", "mood", "atmosphere", "scene", "mood", "atmosphere"];
  const quotas = { genre: 2, mood: 3, atmosphere: 3, scene: 2 };
  const kindCounts = { genre: 0, mood: 0, atmosphere: 0, scene: 0 };
  const picked = [];
  const seen = new Set();

  for (let freshness = 0; freshness < 3 && picked.length < BUBBLE_LIMIT; freshness += 1) {
    order.forEach(kind => {
      if (picked.length >= BUBBLE_LIMIT || kindCounts[kind] >= quotas[kind]) return;
      const item = buckets[kind][freshness].find(candidate => !seen.has(candidate._key));
      if (!item) return;
      seen.add(item._key);
      kindCounts[kind] += 1;
      picked.push(item);
    });
  }

  // 若某一類候選不足，以其他類別補齊，但仍優先選近期未出現的標籤。
  for (let freshness = 0; freshness < 3 && picked.length < BUBBLE_LIMIT; freshness += 1) {
    weightedShuffle(uniqueCandidates.filter(item => {
      const itemFreshness = !excludedKeys.has(item._key) && !recentKeys.has(item._key)
        ? 0
        : (!excludedKeys.has(item._key) ? 1 : 2);
      return itemFreshness === freshness && !seen.has(item._key);
    })).forEach(item => {
      if (picked.length >= BUBBLE_LIMIT || seen.has(item._key)) return;
      seen.add(item._key);
      picked.push(item);
    });
  }

  return picked.slice(0, BUBBLE_LIMIT);
}

function weightedShuffle(items) {
  return [...items]
    .map(item => {
      const weight = Math.max(0.25, Number(item.score || 0) + 1);
      const random = Math.max(Number.EPSILON, Math.random());
      return { item, rank: -Math.log(random) / weight };
    })
    .sort((a, b) => a.rank - b.rank)
    .map(entry => entry.item);
}

function rememberBubbleRound(items) {
  const keys = items.map(item => canonicalTagKey(item.tag)).filter(Boolean);
  if (!keys.length) return;

  const possibleHistoryRounds = Math.max(1, Math.floor(allTagCandidates.length / BUBBLE_LIMIT) - 1);
  const historyLimit = Math.min(MAX_BUBBLE_HISTORY_ROUNDS, possibleHistoryRounds);
  bubbleRoundHistory = [keys, ...bubbleRoundHistory].slice(0, historyLimit);
}

function createBubbles(items) {
  const stage = $("moodStage");
  stage.querySelectorAll(".mood-bubble").forEach(el => el.remove());

  const displayItems = items.slice(0, BUBBLE_LIMIT);

  bubbles = displayItems.map((item, index) => {
    const meta = KIND_META[item.kind] || KIND_META.mood;
    const palette = getBubblePaletteByGroup(index, displayItems.length);
    const el = document.createElement("button");
    el.className = "mood-bubble";
    el.style.setProperty("--bubble-a", palette.colors[0]);
    el.style.setProperty("--bubble-b", palette.colors[1]);
    el.style.setProperty("--glow", palette.glow);
    el.style.setProperty("width", `${BUBBLE_SIZE}px`, "important");
    el.style.setProperty("height", `${BUBBLE_SIZE}px`, "important");
    el.style.setProperty("min-width", `${BUBBLE_SIZE}px`, "important");
    el.style.setProperty("min-height", `${BUBBLE_SIZE}px`, "important");
    el.style.setProperty("max-width", `${BUBBLE_SIZE}px`, "important");
    el.style.setProperty("max-height", `${BUBBLE_SIZE}px`, "important");
    el.style.setProperty("transform", "none", "important");
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

    const bubble = { ...item, el, x: 0, y: 0, weight: 0, size: BUBBLE_SIZE };

    makeDraggable(bubble);
    el.addEventListener("click", () => {
      if (el.classList.contains("dragging")) return;
      addSelectedTag(item.tag, bubble.weight || 0.62, item.kind);
      renderRecommendations();
    });

    return bubble;
  });

  rememberBubbleRound(displayItems);
  layoutBubbles();
}

function layoutBubbles() {
  const stage = $("moodStage");
  const rect = stage.getBoundingClientRect();
  const total = Math.max(bubbles.length, 1);
  const compact = rect.width < 620;
  const bubbleSize = compact ? Math.max(68, Math.min(82, rect.width * 0.17)) : BUBBLE_SIZE;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const innerSafeRadius = compact ? 112 : 145;
  const outerRadius = Math.max(innerSafeRadius, Math.min(rect.width, rect.height) * (compact ? 0.36 : 0.39));
  const rings = compact && total > 7 ? 2 : 1;

  bubbles.forEach((bubble, index) => {
    const ring = rings === 2 ? index % 2 : 0;
    const ringItems = bubbles.filter((_, i) => (rings === 2 ? i % 2 : 0) === ring).length;
    const ringIndex = rings === 2 ? Math.floor(index / 2) : index;
    const radius = rings === 2
      ? (ring === 0 ? outerRadius * 0.74 : outerRadius)
      : outerRadius;
    const angleOffset = ring === 1 ? Math.PI / Math.max(ringItems, 1) : 0;
    const angle = -Math.PI / 2 + angleOffset + (Math.PI * 2 * ringIndex) / Math.max(ringItems, 1);

    bubble.size = bubbleSize;
    bubble.x = cx + Math.cos(angle) * radius - bubbleSize / 2;
    bubble.y = cy + Math.sin(angle) * radius - bubbleSize / 2;
    clampBubbleToStage(bubble);
    bubble.el.style.setProperty("width", `${bubbleSize}px`, "important");
    bubble.el.style.setProperty("height", `${bubbleSize}px`, "important");
    bubble.el.style.setProperty("min-width", `${bubbleSize}px`, "important");
    bubble.el.style.setProperty("min-height", `${bubbleSize}px`, "important");
    bubble.el.style.setProperty("max-width", `${bubbleSize}px`, "important");
    bubble.el.style.setProperty("max-height", `${bubbleSize}px`, "important");
    bubble.el.style.setProperty("transform", "none", "important");
    setBubblePosition(bubble);
    updateBubbleWeight(bubble);
  });
}

function clampBubbleToStage(bubble) {
  const stage = $("moodStage");
  const padding = 8;
  bubble.x = Math.max(padding, Math.min(bubble.x, stage.clientWidth - bubble.size - padding));
  bubble.y = Math.max(padding, Math.min(bubble.y, stage.clientHeight - bubble.size - padding));
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
    clampBubbleToStage(bubble);
    setBubblePosition(bubble);
    updateBubbleWeight(bubble);
  });

  const finishDrag = (e) => {
    if (bubble.el.hasPointerCapture?.(e.pointerId)) bubble.el.releasePointerCapture(e.pointerId);
    bubble.el.classList.remove("dragging");
    updateBubbleWeight(bubble);

    if (moved && bubble.weight > 0.34) {
      addSelectedTag(bubble.tag, bubble.weight, bubble.kind);
      renderRecommendations();
    }
  };

  bubble.el.addEventListener("pointerup", finishDrag);
  bubble.el.addEventListener("pointercancel", finishDrag);
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
  const values = [
    ...(movie.genre || []),
    ...(movie.mood || []),
    ...(movie.mainScene || []),
    ...(movie.subScene || []),
    ...(movie.keywords || [])
  ];
  const seen = new Set();
  return values.filter(tag => {
    const clean = cleanTag(tag);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
    ...topTags(movie).slice(0, 12),
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
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username || !password) {
    msg.textContent = "請輸入帳號與密碼。";
    msg.className = "auth-message error";
    return;
  }

  const users = loadUsers();

  if (authMode === "register") {
    if (!emailPattern.test(email)) {
      msg.textContent = "請輸入正確的 Email 格式，例如：name@example.com";
      msg.className = "auth-message error";
      return;
    }
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

function openForgotPassword() {
  closeAuth();
  ["resetUsername", "resetEmail", "resetNewPassword", "resetConfirmPassword"].forEach(id => {
    if ($(id)) $(id).value = "";
  });
  const msg = $("resetPasswordMessage");
  if (msg) {
    msg.textContent = "";
    msg.className = "auth-message";
  }
  $("forgotPasswordModal")?.classList.add("active");
  $("forgotPasswordModal")?.setAttribute("aria-hidden", "false");
  setTimeout(() => $("resetUsername")?.focus(), 50);
}

function closeForgotPassword() {
  $("forgotPasswordModal")?.classList.remove("active");
  $("forgotPasswordModal")?.setAttribute("aria-hidden", "true");
}

function handlePasswordReset() {
  const username = $("resetUsername")?.value.trim() || "";
  const email = $("resetEmail")?.value.trim() || "";
  const newPassword = $("resetNewPassword")?.value || "";
  const confirmPassword = $("resetConfirmPassword")?.value || "";
  const msg = $("resetPasswordMessage");
  const fail = (text) => {
    msg.textContent = text;
    msg.className = "auth-message error";
  };

  if (!username || !email || !newPassword || !confirmPassword) {
    fail("請完整填寫所有必填欄位。");
    return;
  }
  if (newPassword.length < 6) {
    fail("新密碼至少需要 6 個字元。");
    return;
  }
  if (newPassword !== confirmPassword) {
    fail("兩次輸入的新密碼不一致。");
    return;
  }

  const users = loadUsers();
  const userIndex = users.findIndex(user =>
    user.username.toLowerCase() === username.toLowerCase() &&
    String(user.email || "").toLowerCase() === email.toLowerCase()
  );

  if (userIndex < 0) {
    fail("帳號與註冊 Email 不符合，請重新確認。");
    return;
  }

  users[userIndex].password = newPassword;
  users[userIndex].passwordUpdatedAt = new Date().toISOString();
  saveUsers(users);
  msg.textContent = "密碼重設成功，請使用新密碼登入。";
  msg.className = "auth-message success";
  setTimeout(() => {
    closeForgotPassword();
    openAuth("login");
    $("authUsername").value = username;
  }, 700);
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
    keywords: Array.isArray(movie.keywords) ? movie.keywords : toArray(movie.keywords),
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
    keywords: Array.isArray(item.keywords) ? item.keywords : toArray(item.keywords),
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

function resolveCategoryKey(keyword) {
  const key = normalizeIdentityText(keyword).replace(/(?:電影|影片|片)$/u, "");
  return Object.keys(CATEGORY_RULES).find(category => normalizeIdentityText(category) === key) || "";
}

function getExploreMovieText(movie) {
  return [
    movie.title,
    movie.desc,
    movie.actors,
    ...(movie.genre || []),
    ...(movie.mood || []),
    ...(movie.mainScene || []),
    ...(movie.subScene || []),
    ...(movie.keywords || [])
  ].join(" ").normalize("NFKC").toLowerCase();
}

function movieMatchesExploreKeyword(movie, keyword) {
  const rawKeyword = String(keyword || "").trim().normalize("NFKC").toLowerCase();
  if (!rawKeyword) return true;

  const categoryKey = resolveCategoryKey(rawKeyword);
  const aliases = categoryKey ? CATEGORY_RULES[categoryKey] : [rawKeyword];
  const movieText = getExploreMovieText(movie);
  return aliases.some(alias => movieText.includes(String(alias).normalize("NFKC").toLowerCase()));
}

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderExploreResults(keyword = "") {
  const list = $("exploreResultList");
  if (!list) return;

  let targetMovies = dedupeMovies(allMovies);
  const key = String(keyword || "").trim();
  if (key) {
    targetMovies = targetMovies.filter(movie => movieMatchesExploreKeyword(movie, key));
  }

  if (appSettings.noHorror) {
    targetMovies = targetMovies.filter(movie => (
      !movieMatchesExploreKeyword(movie, "恐怖") && !movieMatchesExploreKeyword(movie, "驚悚")
    ));
  }
  if (appSettings.noSad) {
    targetMovies = targetMovies.filter(m => !m.genre.includes("悲劇") && !m.mood.includes("悲傷") && !m.mood.includes("心碎"));
  }
  if (appSettings.prefPop) {
    targetMovies.sort((a, b) => getViewCount(b) - getViewCount(a));
  } else if (appSettings.prefNiche) {
    targetMovies.sort((a, b) => getViewCount(a) - getViewCount(b));
  } else {
    targetMovies = shuffleArray(targetMovies);
  }

  const displayMovies = targetMovies.slice(0, 24);
  if (!displayMovies.length) {
    list.innerHTML = `<div class="empty-state">找不到相關電影，試試其他分類吧！</div>`;
    return;
  }

  list.className = "explore-result-grid";
  list.innerHTML = "";
  displayMovies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "explore-movie-card";
    const tags = topTags(movie).slice(0, 5).map(t => `<span>${escapeHtml(t)}</span>`).join("");
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
        if (!getCurrentUser()) {
          openAuth("login");
          return;
        }
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
    const tags = topTags(movie).slice(0, 5).map(t => `<span>${escapeHtml(t)}</span>`).join("");
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

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${ROOM_PREFIX}${code}`;
}

function getCurrentRoomCode() {
  let code = localStorage.getItem(ROOM_KEY);

  if (!code) {
    code = generateRoomCode();
    localStorage.setItem(ROOM_KEY, code);
  }

  return code;
}

function setCurrentRoomCode(code) {
  const cleanCode = String(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

  if (!cleanCode) return;

  const finalCode = cleanCode.startsWith(ROOM_PREFIX)
    ? cleanCode
    : `${ROOM_PREFIX}${cleanCode}`;

  localStorage.setItem(ROOM_KEY, finalCode);
  updateRoomUI();

  groupMembers = loadGroupMembers();
  groupVotes = loadGroupVotes();
  activeMemberId = groupMembers[0]?.id || null;

  ensureDefaultMembers();

  renderMembers();
  renderGroupTags();
  renderRoleOptions();
  renderRecommendations();

  alert(`已切換到房間：${finalCode}`);
}

function getRoomMembersKey() {
  return `moodluma-group-members-${getCurrentRoomCode()}`;
}

function getRoomVotesKey() {
  return `moodluma-group-votes-${getCurrentRoomCode()}`;
}

function updateRoomUI() {
  const code = getCurrentRoomCode();

  if ($("roomCode")) {
    $("roomCode").textContent = code;
  }

  if ($("joinRoomInput")) {
    $("joinRoomInput").value = code;
  }
}

function ensureDefaultMembers() {
  if (groupMembers.length) {
    groupMembers = groupMembers.map((member, index) => ({
      ...member,
      role: member.role || `role-${Math.min(index + 1, 5)}`
    }));

    if (!activeMemberId || !groupMembers.some(member => member.id === activeMemberId)) {
      activeMemberId = groupMembers[0]?.id || null;
    }

    saveGroupMembers();
    return;
  }

  groupMembers = [
    { id: "member-a", name: "成員 A", tags: {}, role: "role-1" },
    { id: "member-b", name: "成員 B", tags: {}, role: "role-2" },
    { id: "member-c", name: "成員 C", tags: {}, role: "role-3" }
  ];

  activeMemberId = "member-a";
  saveGroupMembers();
}

function loadGroupMembers() {
  try {
    return JSON.parse(localStorage.getItem(getRoomMembersKey()) || "[]");
  } catch {
    return [];
  }
}

function saveGroupMembers() {
  localStorage.setItem(getRoomMembersKey(), JSON.stringify(groupMembers));
}

function loadGroupVotes() {
  try {
    return JSON.parse(localStorage.getItem(getRoomVotesKey()) || "{}");
  } catch {
    return {};
  }
}

function saveGroupVotes() {
  localStorage.setItem(getRoomVotesKey(), JSON.stringify(groupVotes));
}

function addMemberFromInput() {
  const input = $("memberNameInput");
  const name = input.value.trim();
  if (!name) return;

  const id = `member-${Date.now()}`;
  groupMembers.push({ id, name, tags: {}, role: `role-${Math.min(groupMembers.length + 1, 5)}` });
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

function renderRoleOptions() {
  document.querySelectorAll(".role-option").forEach(btn => {
    const role = btn.dataset.role;
    const activeMember = groupMembers.find(m => m.id === activeMemberId);

    btn.classList.toggle("active", activeMember?.role === role);
  });
}

function setActiveMember(id) {
  activeMemberId = id;
  renderMembers();
  renderRoleOptions();
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
      <div class="member-role-wrap">
        <img class="member-role-img" src="roles/${member.role || "role-1"}.png" alt="${escapeHtml(member.name)}的角色">
        <div>
          <h4>${escapeHtml(member.name)}</h4>
          <p>${tagNames.length ? tagNames.slice(0, 4).join("、") : "尚未選擇感覺"}</p>
        </div>
      </div>

      <div class="member-actions">
        <button data-action="active" type="button">切換</button>
        <button data-action="rename" type="button">改名</button>
        <button data-action="clear" type="button">清空</button>
        <button data-action="remove" type="button">移除</button>
      </div>
    `;

    // 點整張成員卡片，也可以切換目前選中的成員
    card.addEventListener("click", () => {
      setActiveMember(member.id);
    });

    card.querySelector('[data-action="active"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveMember(member.id);
    });

    card.querySelector('[data-action="rename"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      renameMember(member.id);
    });

    card.querySelector('[data-action="clear"]')?.addEventListener("click", (e) => {
      e.stopPropagation();

      member.tags = {};
      saveGroupMembers();

      renderMembers();
      renderGroupTags();
      renderRoleOptions();
      renderRecommendations();
    });

    card.querySelector('[data-action="remove"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      removeMember(member.id);
      renderRoleOptions();
    });

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

function updateTemperaturePreview(value) {
  const temperature = Math.max(0, Math.min(100, Number(value) || 0));
  const tempValue = $("feedbackTemperatureValue");
  const tempFill = $("feedbackTempFill");

  if (tempValue) {
    tempValue.textContent = `${temperature}°`;
  }

  if (tempFill) {
    tempFill.style.width = `${temperature}%`;
  }
}

function getNextRecommendedMovie(currentMovieId) {
  const currentKey = String(currentMovieId || "");

  const ratedKeys = new Set(
    Object.keys(feedbacks || {}).map(key => String(key))
  );

  const scored = allMovies
    .filter(movie => {
      const key = getMovieKey(movie);

      // 排除目前這一部
      if (key === currentKey) return false;

      // 排除已經評價過的電影
      if (ratedKeys.has(key)) return false;

      return true;
    })
    .map(movie => ({
      movie,
      score: computeScore(movie)
    }))
    .sort((a, b) => {
      const av = getViewCount(a.movie);
      const bv = getViewCount(b.movie);
      return b.score - a.score || bv - av;
    });

  // 優先找有分數的電影
  const next = scored.find(item => item.score > 0);

  // 如果沒有符合分數的，就拿第一部未評價電影
  return next || scored[0] || null;
}

function getMovieKey(movie) {
  return String(movie?.id || movie?.title || "").trim();
}

function setTemperatureFeedback(value) {
  if (!currentModalMovie) return;

  const movieId = getMovieKey(currentModalMovie);
  const temperature = Math.max(0, Math.min(100, Number(value) || 50));

  const type = temperature >= 50 ? "like" : "dislike";

  const prev = feedbacks[movieId] || {};
  feedbacks[movieId] = {
    ...prev,
    rating: type,
    temperature,
    ratedAt: new Date().toISOString()
  };

  saveFeedbacks();
  updateFeedbackUI(currentModalMovie);
  renderRecommendations();

  const nextBest = getNextRecommendedMovie(movieId);

  if (nextBest) {
    setTimeout(() => {
      openModal(nextBest.movie, nextBest.score);
    }, 500);
  } else {
    setTimeout(() => {
      closeModal();
      alert("目前已經沒有更多未評價的推薦電影。");
    }, 500);
  }
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
  const tempInput = $("feedbackTemperature");
  const status = $("feedbackStatus");

  if (!status) return;

  const feedback = feedbacks[getMovieKey(movie)] || {};
  const rating = feedback.rating || "";

  const temperature = typeof feedback.temperature === "number"
    ? feedback.temperature
    : rating === "like"
      ? 85
      : rating === "dislike"
        ? 25
        : 50;

  const watched = hasWatchedTrailer(movie);

  if (tempInput) {
    tempInput.value = temperature;
  }

  updateTemperaturePreview(temperature);

  if (rating === "like") {
    status.textContent = `你給了 ${temperature}° 高溫好評：之後會更常推薦相似氛圍的電影。`;
  } else if (rating === "dislike") {
    status.textContent = `你給了 ${temperature}° 低溫評價：之後會降低相似電影的推薦權重。`;
  } else if (watched) {
    status.textContent = "你已開啟預告片，可以拖曳溫度計留下評價。";
  } else {
    status.textContent = "尚未評分。看完預告後，可以拖曳溫度計留下回饋。";
  }
}

function renderFeedbackBadge(movie) {
  const feedback = feedbacks[movie.id] || {};
  const rating = feedback.rating || "";
  const temperature = typeof feedback.temperature === "number"
    ? feedback.temperature
    : rating === "like"
      ? 85
      : rating === "dislike"
        ? 20
        : "";

  if (rating === "like") {
    return `<span class="feedback-badge like">🌡 ${temperature}° 高溫好評</span>`;
  }

  if (rating === "dislike") {
    return `<span class="feedback-badge dislike">🌡 ${temperature}° 低溫評價</span>`;
  }

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

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sideNav = document.querySelector(".side-nav");

  if (!menuToggle || !sideNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = sideNav.classList.toggle("show");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  sideNav.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sideNav.classList.remove("show");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        console.log("Service Worker 註冊成功");
      })
      .catch((error) => {
        console.error("Service Worker 註冊失敗：", error);
      });
  });
}

let deferredInstallPrompt = null;

const installAppBtn = document.getElementById("installAppBtn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;

  if (installAppBtn) {
    installAppBtn.style.display = "inline-flex";
  }
});

if (installAppBtn) {
  installAppBtn.addEventListener("click", async () => {
    const isIOS =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      alert("Moodluma 已經安裝在這台裝置上。");
      return;
    }

    if (isIOS) {
      alert(
        "iPhone 安裝方式：\n\n" +
        "1. 請使用 Safari 開啟網站\n" +
        "2. 點擊下方的「分享」按鈕\n" +
        "3. 選擇「加入主畫面」\n" +
        "4. 點擊「加入」完成安裝"
      );
      return;
    }

    if (!deferredInstallPrompt) {
      alert(
        "目前無法直接顯示安裝視窗。\n\n" +
        "請使用 Chrome 或 Edge 開啟網站，" +
        "並確認網站已透過 HTTPS 部署。"
      );
      return;
    }

    deferredInstallPrompt.prompt();

    const choice = await deferredInstallPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("使用者接受安裝 Moodluma");
    } else {
      console.log("使用者取消安裝 Moodluma");
    }

    deferredInstallPrompt = null;
  });
}

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;

  if (installAppBtn) {
    installAppBtn.textContent = "✓ Moodluma 已安裝";
    installAppBtn.disabled = true;
  }
});
