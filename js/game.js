var pageX = $(document).width();
var pageY = $(document).height();
var mouseY = 0;
var mouseX = 0;

$(document).mousemove(function (event) {
  //verticalAxis
  mouseY = event.pageY;
  yAxis = ((pageY / 2 - mouseY) / pageY) * 300;
  //horizontalAxis
  mouseX = event.pageX / -pageX;
  xAxis = -mouseX * 100 - 100;

  $(".box__ghost-eyes").css({
    transform: "translate(" + xAxis + "%,-" + yAxis + "%)",
  });

  //console.log('X: ' + xAxis);
});

//UI Elements
const wordInput = document.getElementById("word-input");
const currentWord = document.querySelector("#current-word");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");
const message = document.querySelector("#message");
const seconds = document.querySelector("#seconds");
const level = document.querySelector("#level");
const load = document.querySelector(".loading-container");
const boxDesc = document.querySelector(".box__description");
const boxGhost = document.querySelector(".box__ghost");
const gameArea = document.querySelector("#game-area");
const modalScore = document.querySelector("#modal-score");
const gameScoreModal = document.querySelector(".game-over-modal");
const playAgain = document
  .querySelector("#play-again")
  .addEventListener("click", function (e) {
    window.location.reload();
    backgroundMusic.play();
    e.preventDefault();
  });

const modal = document.querySelector(".inst-modal");
const instructions = document.querySelector(".fa");

const backgroundMusic = document.querySelector("#bg-music");
//Initialize game
document
  .querySelector(".box__button")
  .addEventListener("click", function init(e) {
    initialize();
    e.preventDefault();
  });

function initialize() {
  backgroundMusic.play();
  boxDesc.style.display = "none";
  boxGhost.style.display = "none";
  instructions.style.display = "none";
  load.style.display = "block";

  fetch("words.json") // .all to get all words
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      load.style.display = "none";
      gameArea.style.display = "block";
      words = data;
      //call countdown
      setInterval(countdown, 1000); //this will repeat countdown every 1s
      showWords(words);
    });

  seconds.innerHTML = time - 1 + "s";
  level.innerHTML = "Easy Round";
  //Start matching on the user input
  wordInput.addEventListener("input", startGame);
  //check status of game
  setInterval(checkStatus, 50);
}

//Levels
const levels = {
  easy: 6,
  medium: 4,
  hard: 3,
};

//changing levels
let currentLevel = levels.easy;

//Globals
let time = currentLevel;
let score = 0;
let isPlaying;

let words = {};

//startGame
function startGame() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel;
    showWords(words);
    wordInput.value = "";
    score++;
    changeLevel(time, score);
  }

  if (score === -1) {
    scoreDisplay.innerHTML = 0;
    modalScore.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
    modalScore.innerHTML = score;
  }
}

//match words
function matchWords() {
  if (wordInput.value === currentWord.textContent) {
    wordInput.classList.remove("is-invalid");
    wordInput.classList.add("is-valid");
    message.innerHTML = '<span class="text-success">Correct!</span>';
    return true;
  } else {
    wordInput.classList.remove("is-valid");
    wordInput.classList.add("is-invalid");
    return false;
  }
}

//pick random word
function showWords(words) {
  //generate random index
  const randIdx = Math.floor(Math.random() * words.length);
  wordSingle = words[randIdx];
  words.forEach(function (word, idx) {
    if (wordSingle === word) {
      words.splice(idx, 1);
    }
  });
  //output random word
  currentWord.innerHTML = words[randIdx];
}

//Countdown timer
function countdown() {
  //check if time is running
  if (time > 0) {
    time--;
  } else if (time === 0) {
    //Game is over
    isPlaying = false;
  }

  //show time
  timeDisplay.innerHTML = time;
}

//check status
function checkStatus() {
  wordInput.focus();
  if (!isPlaying && time === 0) {
    gameScoreModal.style.display = "block";
    currentLevel = levels.easy;
    message.innerHTML = '<span class="game-over">Game Over</span>';
    score = -1;
    level.innerHTML = "Easy Round";
  }
}

function remove() {
  gameScoreModal.style.display = "none";
}

//chnange levek
function changeLevel(time, score) {
  if (score < 10) {
    currentLevel = levels.easy;
    level.innerHTML = "Easy Round";
    seconds.innerHTML = time - 1 + "s";
  } else if (score >= 10 && score < 20) {
    currentLevel = levels.medium;
    level.innerHTML = "Medium Round";
    seconds.innerHTML = time - 1 + "s";
  } else {
    currentLevel = levels.hard;
    level.innerHTML = "Hard Round";
    seconds.innerHTML = time - 1 + "s";
  }
}
