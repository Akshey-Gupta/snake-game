let inputDir={x:0 , y:0};
const foodSound=new Audio('music/food.mp3');
const gameOverSound=new Audio('music/gameover.mp3');
const moveSound=new Audio('music/move.mp3');
const musicSound=new Audio('music/music.mp3');
let speed=4;
let lastPaintTime=0;
let snakeArr=[
    { x: 8, y: 8 }
]

food={x:13,y:15}
let score=0;

// Check if high score exists in local storage
let highScore = localStorage.getItem('highScore');
if (!highScore) {
    // If it doesn't exist, set it to 0
    localStorage.setItem('highScore', 0);
}

// Update the high score if the current score is higher
if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
}

// Display the high score on the screen
document.getElementById('highScoreDisplay').innerText = "High Score: " + highScore;



window.requestAnimationFrame(main);

function main(ctime){
    window.requestAnimationFrame(main); 
    // console.log(ctime);
    if((ctime-lastPaintTime)/1000<1/speed){
        return;
    }
    lastPaintTime=ctime;
    gameEngine();
}

function isCollide(){
    //bumping into self
    for (let i = 1; i < snakeArr.length; i++) {
        if(snakeArr[i].x===snakeArr[0].x && snakeArr[i].y===snakeArr[0].y)
        return true;
    }
    if (
        snakeArr[0].x >= 25 ||
        snakeArr[0].x <= 0 ||
        snakeArr[0].y >= 25 ||
        snakeArr[0].y <= 0
    ){
        return true;
    }
    return false;
}

function gameEngine(){
    //updating snake length and randomizing food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir={x:0,y:0};
        alert('Game over, press any key to play again');
        snakeArr=[{x:8,y:8}];
        musicSound.play();
        score=0;
    }

    //randomizing food location and increasing snake length
    if (
        (snakeArr[0].y === food.y && snakeArr[0].x === food.x) ||
        (snakeArr[0].y === food.y && snakeArr[0].x % 25 === food.x) ||
        (snakeArr[0].y % 25 === food.y && snakeArr[0].x === food.x)
    ){
        snakeArr.unshift({x:snakeArr[0].x+inputDir.x, y: snakeArr[0].y+inputDir.y})
        let a=1;
        let b=24;
        food={
            x : Math.floor(Math.random()*(b-a+1)*a),
            y: Math.floor(Math.random()*(b-a+1)*a)  
        };
        score++;
        foodSound.play();
    }

    //moving the snake
    for(let i=snakeArr.length-2;i>=0;i--){
        snakeArr[i+1]={...snakeArr[i]}
    }
    snakeArr[0].x+=inputDir.x;
    snakeArr[0].y+=inputDir.y;

    //display snake
    board.innerHTML='';
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement('div');
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;
        if(index===0){
            snakeElement.classList.add('snakehead');
        }else{
            snakeElement.classList.add('snakebody');
        }
        board.appendChild(snakeElement);
    })


    //display the score
    document.getElementById('scoreDisplay').innerText = "Score: " + score;

    //display the food
    foodElement=document.createElement('div');
    foodElement.style.gridRowStart=food.y;
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    // Start the game and play background music on the first key press
    if (!inputDir.x && !inputDir.y) {
        inputDir = { x: 0, y: 1 }; // Initial direction, e.g., moving down
        moveSound.play();
        musicSound.play();
    }

    // Handle directional input only after the game has started
    switch (e.key) {
        case 'ArrowUp':
            if (inputDir.y !== 1) { // Allow only if not going down
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case 'ArrowDown':
            if (inputDir.y !== -1) { // Allow only if not going up
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case 'ArrowLeft':
            if (inputDir.x !== 1) { // Allow only if not going right
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case 'ArrowRight':
            if (inputDir.x !== -1) { // Allow only if not going left
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
    }
});

