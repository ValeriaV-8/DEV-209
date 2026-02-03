// Moves will sync across tabs and default to 0 if first game for browser
// Used parseInt to change data to int
let moves = parseInt(localStorage.getItem('game-moves')) || 0;
// Defaults to 0 if new game
// Used parseInt to change data to int
let totalSeconds = parseInt(localStorage.getItem('game-timer')) || 0;
 
const timerElement = document.querySelector('.timer-container');
const moveLabel = document.getElementById("moves-label");

// Saves game stats
function saveStats() {
  localStorage.setItem('game-timer', totalSeconds);
  localStorage.setItem('game-moves', moves);
}

// Listens to other tab changes
window.addEventListener('storage', (e) => {
  // For clicks (moves)
  if (e.key === 'game-moves') {
    moves = parseInt(e.newValue) || 0;
    updateStats();
  }
  if (e.key === 'game-timer') {
    totalSeconds = parseInt(e.newValue) || 0;
    updateTimerDisplay();
  }
});

// Moved out of original function to allow storage event listner to call
function updateTimerDisplay() {
  if (!timerElement) return;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to make timer display seconds, minutes, hours
if (timerElement) {
  const runTimer = () => {
    totalSeconds++;
    saveStats();
    updateTimerDisplay();
  };

  // Initial Display
  updateTimerDisplay();
  // Starts timer
  setInterval(runTimer, 1000); 
}

// Sound consts with path
const flipSnd = new Audio("./flip.mp3");
const correctSnd = new Audio("./correct.mp3");
const wrongSnd = new Audio("./wrong.mp3");

// Flag links
var images = [
  "https://www.countryflags.com/wp-content/uploads/south-korea-flag-png-large.png",
  "https://www.countryflags.com/wp-content/uploads/spain-flag-png-large.png",
  "https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png",
  "https://www.countryflags.com/wp-content/uploads/china-flag-png-large.png",
  "https://www.countryflags.com/wp-content/uploads/europe-flag-jpg-xl-1024x683.jpg",
  "https://www.countryflags.com/wp-content/uploads/united-states-of-america-flag-png-large.png",
  "https://www.countryflags.com/wp-content/uploads/japan-flag-png-large.png",
  "https://www.countryflags.com/wp-content/uploads/russia-flag-png-large.png"
];

// Variables for functions
var firstCard = null;
var secondCard = null;

// Allows flip
var canFlip = true;

// Matched pairs, for game end
var matches = 0;

// Timer starter
var timerRunning = false;

// Ensures if page reloads, moves will not reset to 0
function updateStats() {
  if (moveLabel) moveLabel.textContent = moves;
}

// Starts game by getting gameboard from html and randomizing the card layout
function startGame() {
  var gameBoard = document.getElementById("cardContainer");
  // Added to make sure script runs after HTML loads
  if(!gameBoard) return;
  gameBoard.innerHTML = "";

  // Trys to get saved grid from localStorage
  let cardImages;
  const savedDeck = sessionStorage.getItem('game-deck');

  // Load matched cards or empty array if none
  const matchedCards = sessionStorage.getItem('game-matched-positions') || "";
  const matchedPositions = matchedCards.split(',').filter(x => x !== "");

  // Added because when refreshing page the number of matches is 
  // the number of cards matched, not the number of pairs matched
  matches = matchedPositions.length / 2;

  if (savedDeck) {
    // Use the exisitng deck by splitting string back into array
    cardImages = savedDeck.split(',');
  } else {
    // If no deck is found, create a new grid
    cardImages = images.concat(images);
    cardImages.sort(function() {
      return Math.random() - 0.5;
    });
    // Save this grid as a string
    sessionStorage.setItem('game-deck', cardImages.join(','));
  }

  // Makes the cards and puts them in array
  for (var i = 0; i < cardImages.length; i++) {
    var card = document.createElement('div');
    card.className = "card";

    // Stores the index
    card.dataset.index = i;
    card.dataset.image = cardImages[i];

    // If the cards match, keep it facing up
    if (matchedPositions.includes(i.toString())) {
      // If already matched, adds class flipped and matched
      card.classList.add("flipped", "matched");
      matches++;
    }

    // Adds images to cards
    card.innerHTML = '<div class="card-front"></div><div class="card-back"><img src="' + cardImages[i] + '"></div>';
    
    // Allows user to flip cards
    card.onclick = flipCard;
    gameBoard.appendChild(card);
  }

  // Variables made before 
  // Null to allow matching
  firstCard = null;
  secondCard = null;

  // Can flip the cards to show images
  canFlip = true;

  // Update Stas from localStorage if any
  updateStats();
}

// Function to allow card flipping
function flipCard() {
  if (!canFlip) return;
  // Changed to combine if statements and prevent ghost moves
  if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

  flipSnd.play();
  timerRunning = true;
  this.classList.add("flipped")

  if(firstCard == null) {
    firstCard = this;
  } else {
    secondCard = this;
    canFlip = false;
    moves++;
    // Saves stats to localStorage
    saveStats();
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  var match = firstCard.dataset.image == secondCard.dataset.image;
  // If matched, cards stay up and total matches (matches needed to end game) increase
  if (match) {
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      // Checks memory for already matched cards
      // If found, it grabs it
      // If not, starts empty string
      const matchedCards = sessionStorage.getItem('game-matched-positions') || "";
      
      // Converts the saved string into array
      const newMatches = matchedCards ? matchedCards.split(',') : [];
      
      // If new matched cards are made, saves to memory
      newMatches.push(firstCard.dataset.index, secondCard.dataset.index);
      sessionStorage.setItem('game-matched-positions', newMatches.join(','));

      // If matched, plays sound
      correctSnd.play();
      matches++;
      // Added as a check if match is ended
      if (matches == 8) endGame();
      resetCards();
    }, 500);
  // If not matching, resets cards
  }else {
    // If wrong, wrong sound effect plays
    wrongSnd.play();
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetCards()
    }, 1000);
  }
}

// Resets card if not matched
function resetCards() {
  firstCard = null;
  secondCard = null;
  canFlip = true;
}

// Made it so if you win, shows total moves across all tabs
function endGame() {
  const winElement = document.getElementById("winGame");
  const totalMovesDisp = document.getElementById("totalMoves");
  // Checks if element exists before updating
  if(totalMovesDisp) totalMovesDisp.textContent = moves;
  if(winElement) winElement.classList.add("show");
}

// Restarts all moves and timers
function restart() {
  totalSeconds = 0;
  moves = 0;
  matches = 0;

  // Removes the saved deck from memory (the tab) so new game will start a complete new game
  sessionStorage.removeItem('game-deck');
  sessionStorage.removeItem('game-matched-positions');
  // Saves stats to local Storage
  saveStats();
  updateStats();
  updateTimerDisplay();

  // Checks if won and if won removes the display before starting new game
  const winElement = document.getElementById("winGame");
  if(winElement) winElement.classList.remove("show");
  startGame();
}

// Needed because new game button calls this function
function newGame() {
  restart();
}

startGame();