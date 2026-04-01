let currentPage = 1;
const totalPages = 2;

function updateControls() {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const indicator = document.getElementById("pageIndicator");
  const visibleSpread = Math.min(currentPage * 2 - 1, totalPages * 2);

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage > totalPages;
  indicator.textContent = `Page ${visibleSpread} of ${totalPages * 2}`;
}

function nextPage() {
  if (currentPage <= totalPages) {
    document.getElementById("p" + currentPage).classList.add("flipped");
    currentPage++;
    updateControls();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    document.getElementById("p" + currentPage).classList.remove("flipped");
    updateControls();
  }
}

updateControls();