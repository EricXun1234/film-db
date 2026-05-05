function goSearch() {
  const keyword = document.getElementById("search").value.trim();
  window.location.href = `results.html?keyword=${encodeURIComponent(keyword)}`;
}