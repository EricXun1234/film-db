function goSearch() {
  const keyword = document.getElementById("search").value.trim();

  if (keyword === "") {
    alert("請輸入關鍵字");
    return;
  }

  window.location.href = `results.html?keyword=${encodeURIComponent(keyword)}`;
}

document.getElementById("search").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    goSearch();
  }
});