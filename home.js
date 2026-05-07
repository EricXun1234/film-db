function goSearch() {
  const keyword = document.getElementById("search").value.trim();

  if (keyword === "") {
    alert("請輸入關鍵字");
    return;
  }

  window.location.href = `results.html?keyword=${encodeURIComponent(keyword)}`;
}

const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      goSearch();
    }
  });
}

document.querySelectorAll(".quick-tags button, .small-card").forEach((item) => {
  item.addEventListener("click", () => {
    const keyword = item.dataset.keyword || item.textContent.trim();
    searchInput.value = keyword;
    goSearch();
  });
});


// ===== 點電影卡片後跳出內容簡介 =====
function openMovieModal(card) {
  const modal = document.getElementById("movieModal");
  if (!modal) return;

  const poster = document.getElementById("modalPoster");
  const title = document.getElementById("modalTitle");
  const rating = document.getElementById("modalRating");
  const year = document.getElementById("modalYear");
  const duration = document.getElementById("modalDuration");
  const genre = document.getElementById("modalGenre");
  const desc = document.getElementById("modalDesc");

  title.textContent = card.dataset.title || "電影名稱";
  rating.textContent = card.dataset.rating || "推薦";
  year.textContent = card.dataset.year || "2026";
  duration.textContent = card.dataset.duration || "片長";
  genre.textContent = card.dataset.genre || "類型";
  desc.textContent = card.dataset.desc || "這裡會顯示電影內容簡介。";

  const bg = window.getComputedStyle(card).backgroundImage;
  poster.style.backgroundImage = bg;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMovieModal() {
  const modal = document.getElementById("movieModal");
  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".movie-clickable").forEach((card) => {
  card.addEventListener("click", () => {
    openMovieModal(card);
  });
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeMovieModal();
  }
});
