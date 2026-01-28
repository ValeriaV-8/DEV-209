let totalSeconds = 0;
const timerElement = document.querySelector('.timer-container');

if (timerElement) {
  const updateTimer = () => {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.textContent = formattedTime;
  };

  // Initial display
  timerElement.textContent = "00:00";

  setInterval(updateTimer, 1000);
}

const flipSound = new Audio('.Sounds/flip.mp3')


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

var firstCard = null;
var secondCard = null;
var canFlip = true;
var matches = 0;
var moves = 0;
var timerRunning = false;

function startGame() {
  var gameBoard = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";

  var cardImages = images.concat(images);

  cardImages.sort(function() {
    return Math.random() - 0.5;
  });

  for (var i = 0; i < cardImages.length; i++) {
    var card = document.createElement('div');
    card.className = "card";
    card.innerHTML = '<div class="card-front"></div><div class="card-back"><img src="' + cardImages[i] + '"></div>';
    
    card.onclick = flipCard;
    card.onclick = 
    card.dataset.image = cardImages[i];
    gameBoard.appendChild(card);
  }

  firstCard = null;
  secondCard = null;
  canFlip = true;
  matches = 0;
  moves = 0;
  timerRunning = false;

  updateStats();
  clearInterval(timerElement);
}

function flipCard() {
  if (!canFlip) return;

  if (this.classList.contains("flipped")) return;
  if (this.classList.contains("matched")) return;

  if (!timerRunning) {
    startTimer();
  }

  this.classList.add("flipped")

  if(firstCard == null) {
    firstCard = this;
  } else {
    secondCard = this;
    canFlip = false;
    moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  var match = firstCard.dataset.image == secondCard.dataset.image;

  if (match) {
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;
      updateStats();
      resetCards();

      if(matches == 8) {
        endGame();
      }
    }, 500);
  }else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetCards()
    }, 1000);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  canFlip = true;
}

function startTimer () {
  timerRunning = true;
}

function updateStats() {
  document.getElementById("moves-label").textContent = moves;
}

function endGame() {
  clearInterval(timerElement);
  console.log(moves);
  document.getElementById("totalMoves").textContent = moves;
  document.getElementById("winGame").classList.add("show");
}

function newGame() {
  document.getElementById("winGame").classList.remove("show");
  totalSeconds = 0;
  startGame();
}

function restart() {
  totalSeconds = 0;
  moves = 0;
  startGame();
}

startGame();
