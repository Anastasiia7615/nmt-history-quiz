let currentIndex = 0;
let filteredCards = [];
let currentMode = "topics"; // topics | sources | all
let currentTopic = "all";
let isFlipped = false;

const cardEl = document.getElementById("card");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const topicBadgeEl = document.getElementById("topicBadge");
const imageContainer = document.getElementById("imageContainer");
const counterEl = document.getElementById("counter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const topicFilters = document.getElementById("topicFilters");

function getBaseCards() {
  if (currentMode === "sources") {
    return cards.filter(c => c.topic === "sources");
  }
  if (currentMode === "all") {
    return cards;
  }
  // topics mode — exclude sources
  return cards.filter(c => c.topic !== "sources");
}

function applyFilter() {
  const base = getBaseCards();
  if (currentMode === "sources" || currentTopic === "all") {
    filteredCards = base;
  } else {
    filteredCards = base.filter(c => c.topic === currentTopic);
  }
  currentIndex = 0;
  isFlipped = false;
  cardEl.classList.remove("flipped");
  renderCard();
}

function renderCard() {
  if (filteredCards.length === 0) {
    questionEl.textContent = "Немає карток за цим фільтром";
    answerEl.textContent = "";
    topicBadgeEl.textContent = "";
    counterEl.textContent = "0 / 0";
    imageContainer.innerHTML = "";
    return;
  }

  const card = filteredCards[currentIndex];
  topicBadgeEl.textContent = card.topicName;
  questionEl.textContent = card.question;
  answerEl.textContent = card.answer;

  // Image support
  imageContainer.innerHTML = "";
  if (card.image) {
    const img = document.createElement("img");
    img.src = card.image;
    img.alt = "Ілюстрація";
    img.className = "card-image";
    imageContainer.appendChild(img);
  }

  counterEl.textContent = `${currentIndex + 1} / ${filteredCards.length}`;
}

// Flip
cardEl.addEventListener("click", () => {
  isFlipped = !isFlipped;
  cardEl.classList.toggle("flipped", isFlipped);
});

// Navigation
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentIndex > 0) {
    currentIndex--;
    isFlipped = false;
    cardEl.classList.remove("flipped");
    renderCard();
  }
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentIndex < filteredCards.length - 1) {
    currentIndex++;
    isFlipped = false;
    cardEl.classList.remove("flipped");
    renderCard();
  }
});

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    cardEl.click();
  }
});

// Mode buttons
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;

    // Show/hide topic filters
    if (currentMode === "sources") {
      topicFilters.style.display = "none";
    } else {
      topicFilters.style.display = "flex";
    }

    // Reset topic filter
    currentTopic = "all";
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('.filter-btn[data-topic="all"]').classList.add("active");

    applyFilter();
  });
});

// Topic filters
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTopic = btn.dataset.topic;
    applyFilter();
  });
});

// Init
applyFilter();
