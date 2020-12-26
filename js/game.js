import { 
  update as updateSnake, 
  draw as drawSnake,
  getSnakeHead,
  snakeIntersection
} from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';
import { RATE_INCREASE } from './constants.js';

// GAME LOOP
const gameBoard = document.getElementById('gameBoard');
const scoreContainer = document.getElementById('score');
const playBtn = document.getElementById('play');
const overlayModal = document.getElementById('overlayModal');
let deltaTime = 0;
let gameOver = false;
let snakeSpeed = 5; //how many times the snake moves per second
let score = 0;
scoreContainer.innerHTML = score;

console.log(snakeSpeed)
console.log(score);

function main (currentTime) {
  if (gameOver) {
    if (confirm('You lost. Press ok to restart')) {
      window.location = '/';
      score = 0;
    }
    return 
  }
  
  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - deltaTime) / 1000;
  
  // # of seconds between each move
  if (secondsSinceLastRender < 1 / snakeSpeed) return
  deltaTime = currentTime;

  update();
  draw();
}

function startGame() {
  console.log("Play");
  overlayModal.style.display = 'none';
  window.requestAnimationFrame(main);
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

export function increaseSpeed() {
  snakeSpeed += RATE_INCREASE;
  if (snakeSpeed >= 6) {
    snakeSpeed += RATE_INCREASE * 4;
  }
  console.log(snakeSpeed);
}

export function addScore() {
  score += Math.floor(snakeSpeed) + 10;
  scoreContainer.innerHTML = score;
  console.log(score);
}

playBtn.addEventListener('click', startGame);