const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestionsList");

let allWords = [];
let currentSuggestions = [];
let activeIndex = -1; // which suggestion is highlighted


// 1) Load local dataset
async function loadWords() {
  const res = await fetch("words.json");
  if (!res.ok) throw new Error("Failed to load words.json");
  allWords = await res.json();
}

// 2) Get matching suggestions
function getSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (q === "") return [];


  return allWords
    .filter(word => word.toLowerCase().startsWith(q))

}

// 3) Render dropdown
function renderSuggestions(list) {
  suggestionsList.innerHTML = "";

  if (list.length === 0) {
    suggestionsList.classList.add("hidden");
    return;
  }

  suggestionsList.classList.remove("hidden");

  list.forEach((word, index) => {
    const li = document.createElement("li");

    li.textContent = word;

    if (index === activeIndex) {
      li.classList.add("active");
    }

   

    suggestionsList.appendChild(li);
  });
}

// 4) Select a suggestion
function selectSuggestion(word) {
  searchInput.value = word;
  currentSuggestions = [];
  activeIndex = -1;
  renderSuggestions(currentSuggestions);
}

// 5) Handle typing
function handleInput() {
  currentSuggestions = getSuggestions(searchInput.value);
  activeIndex = -1; // reset highlight when user types
  renderSuggestions(currentSuggestions);
}

// 6) Keyboard navigation (↑ ↓ Enter)
function handleKeyDown(e) {
  if (suggestionsList.classList.contains("hidden")) return;
  if (currentSuggestions.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % currentSuggestions.length;
    renderSuggestions(currentSuggestions);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
    renderSuggestions(currentSuggestions);
  }

  if (e.key === "Enter") {
    if (activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(currentSuggestions[activeIndex]);
    }
  }
}

// Wire up events
searchInput.addEventListener("input", handleInput);
searchInput.addEventListener("keydown", handleKeyDown);

// Start
loadWords().catch(err => console.error(err));
