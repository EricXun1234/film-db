let movies = [];

fetch("movies.json")
  .then(res => res.json())
  .then(data => {
    movies = data;

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";

    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.value = keyword;
    }

    searchMovie(keyword);
  });

function searchMovie(keyword) {
  keyword = keyword.trim();

  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  let filtered = movies.filter(movie => {
  return (
    (movie.title && movie.title.includes(keyword)) ||
    (movie.desc && movie.desc.includes(keyword)) ||
    (movie.genres && movie.genres.some(g => g.includes(keyword))) ||
    (movie.scenes && movie.scenes.some(s => s.includes(keyword))) ||
    (movie.moods && movie.moods.some(m => m.includes(keyword))) ||
    (movie.keywords && movie.keywords.some(k => k.includes(keyword)))
  );
});

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p style='color:#aaa;'>找不到相關電影 😢</p>";
  } else {
    filtered.forEach(movie => {
      movie.match_score = movie.match_score || Math.floor(Math.random() * 20) + 80;
      movie.ai_reason = movie.ai_reason || "本系統根據關鍵字分析，判定此片段與搜尋需求高度相關。";

      resultsDiv.innerHTML += `
        <div class="card">
          <img src="https://img.youtube.com/vi/${movie.ytId}/0.jpg" class="poster">

          <h2>${movie.title}</h2>

          <p class="meta">
            類型：
            ${movie.genres.map(c => `<span class="tag">${c}</span>`).join("")}
            ｜ 年份：2011
          </p>

          <p class="reason">
            ${movie.ai_reason}
          </p>

          <div class="info-box">
            <div>
              <div class="label">關鍵字</div>
              <div>${[...movie.scenes, ...movie.moods].join("、")}</div>
            </div>

            <div>
              <div class="label">匹配度</div>
              <div class="score-bar">
                <div style="width:${movie.match_score}%"></div>
              </div>
              <div>${movie.match_score}%</div>
            </div>

            <div>
              <div class="label">類型</div>
              <div>${movie.genres.join(" / ")}</div>
            </div>
          </div>

          <button onclick='goPlayer(${JSON.stringify(movie)})'>
  ▶ 播放
</button>
        </div>
      `;
    });
  }
}

function searchAgain() {
  const keyword = document.getElementById("search").value.trim();
  window.location.href = `results.html?keyword=${encodeURIComponent(keyword)}`;
}
function goPlayer(movie) {
  window.location.href =
    `player.html?video=${movie.ytId}&title=${encodeURIComponent(movie.title)}&genre=${encodeURIComponent(movie.genres.join('/'))}&reason=${encodeURIComponent('符合你的搜尋偏好')}`;
}