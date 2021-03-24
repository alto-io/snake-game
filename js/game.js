import { 
  update as updateSnake, 
  draw as drawSnake,
  getSnakeHead,
  snakeIntersection
} from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';
import { RATE_INCREASE, ADD_SCORE } from './constants.js';
// import './op.js';

// DOM
const gameBoard = document.getElementById('gameBoard');
const scoreContainer = document.getElementById('score');
const playBtn = document.getElementById('play');
const instBtn = document.getElementById('instructions');
const backBtn = document.getElementById('back');
const switchBtn = document.getElementById('switch');
const instModal = document.getElementById('instModal');
const titleModal = document.getElementById('titleModal');
const overlayModal = document.getElementById('overlayModal');
const gameOverModal = document.getElementById('gameOverModal');
const mobileContainer = document.getElementById('mobileContainer');
const positionText = document.getElementById('position');
const modalScore = document.getElementById('modalScore');

// GAME LOOP
let deltaTime = 0;
let gameOver = false;
let snakeSpeed = 6; //how many times the snake moves per second
let score = 0;
let highScore =  0;
scoreContainer.innerHTML = score;


function main (currentTime) {
  if (gameOver) {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    gameOverModal.classList.remove('display-none');
    modalScore.innerHTML = score;
    submitScore();
  } else {
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - deltaTime) / 1000;
    
    // # of seconds between each move
    if (secondsSinceLastRender < 1 / snakeSpeed) return
    deltaTime = currentTime;

    update();
    draw();
  }
}

function startGame() {
  retrieveScore();
  overlayModal.style.display = 'none';
  window.requestAnimationFrame(main);
}

function instructions() {
  instModal.classList.remove('display-none');
  titleModal.classList.add('display-none');
}

function back() {
  instModal.classList.add('display-none');
  titleModal.classList.remove('display-none');
}

function update() {
  updateSnake();
  updateFood();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function compareScore(score, highScore) {
  if (score > highScore) {
    highScore = score;
  } return
}

function retrieveScore() {
  if (localStorage.getItem('highScore') !== null) {
    highScore = parseInt(localStorage.getItem('highScore'));
  }
}

function toggleSwitch() {
  mobileContainer.classList.toggle('row-reverse');
  if (positionText.innerHTML === "left") {
    positionText.innerHTML = "right"
  } else {
    positionText.innerHTML = "left"
  }
}

export function increaseSpeed() {
  snakeSpeed += RATE_INCREASE;
  if (snakeSpeed >= 7) {
    snakeSpeed += RATE_INCREASE * 5;
  }
}

export function addScore() {
  score += Math.floor(snakeSpeed) + ADD_SCORE;
  if (snakeSpeed >= 15) {
    score += Math.floor(snakeSpeed) + ADD_SCORE * 2;
  }
  scoreContainer.innerHTML = score;
}

function refreshPage() {
  score = 0;
  highScore = 0;
  setTimeout(
    function() {
      window.top.postMessage("refreshPage", '*');
    }
  , 3000);
}

async function submitScore() {
  const tournament_id = op.getTournamentId();
  const scorePassed = Number(score);

  const options = {
    tournament_id,
    metadata: '{"score": ' + scorePassed + '}'
  }

  console.log("options are", options);

  if (tournament_id !== null) {
    console.log("Inside submitScore")
    const post = await op.postScore(options);

    if (post.success) {
      alert("Successfully submitted score " + score);
    }
  } 

  refreshPage();
}

console.log("Prod");

playBtn.addEventListener('click', startGame);
instBtn.addEventListener('click', instructions);
backBtn.addEventListener('click', back);
switchBtn.addEventListener('click', toggleSwitch);