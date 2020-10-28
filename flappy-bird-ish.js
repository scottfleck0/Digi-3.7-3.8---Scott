
const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');


// variable for if the game is running or not
var gameRunning = true;


// function to get a random value
function randomValue(min, max) {

  return Math.random() * (max - min) + min;

}



// bringing in audio
const JUMP = new Audio();
JUMP.src = "Audio/jump.m4a";

const POINT = new Audio();
POINT.src = "Audio/point.m4a";

const HIT = new Audio();
HIT.src = "Audio/hitPipe.m4a";

const DIESOUND = new Audio();
DIESOUND.src = "Audio/die.mp3";

// bringing in images
const PIPESPRITE = new Image();
PIPESPRITE.src = "Images/pipeSpriteSheet.png";

const CHARACTERSPRITE = new Image();
CHARACTERSPRITE.src = "Images/birdSpriteSheet.png";

const COINSSPRITE = new Image();
COINSSPRITE.src = "Images/coinSpriteSheet.png";

// constant for the height of the floor
const FLOORHEIGHT = 3 * (CVS.height / 4);



// constants for jumping animation
const GRAVITY = 0.35;
const JUMPSTRENGTH = -6;


// vars for score and lives
var score = 0;
var lives = 3;


// array for the scores which will be used for the scoreboard
var scoreboard = [];
var scoreboardYPos = FLOORHEIGHT - 200; // making the y position variable for the scoreboard


// arrays for the pipes, coins and floating obstacles
var pipes = [];
var coins = [];
var obstacles = [];


// speed for all the objects in the game
const OBJSPEED = 3;


// constants for floating items
const FLOATCONSTS = {

  MINY: 50,
  MAXY: FLOORHEIGHT - 50

}


// variable containing colours
var colours = {

  skyColour: "#33CCFF",
  groundColour: "#009900",
  characterColour: "#ffff00",
  obsColour: "red"

}


// variable containing all the character information
var character = {

  source: CHARACTERSPRITE,
  sx: 0,
  sy: 0,
  sxd: 19,
  syd: 14,
  x: 100,
  y: 100,
  yVelocity: 0,
  jumping: false

};




const PIPECONSTS = {

  GAPHEIGHT: 100,
  MINY: 30,
  MAXY: FLOORHEIGHT - 100 - 30,// the 100 is the gapheight but it theoretically isn't defined yet so I need to put 100 instead of the variable
  DISTANCEBETWEEN: 250

};


var controller = {

  space: false,
  rKey: false,

  keyListener: function(event){

    'use strict';
    var keyState = (event.type === "keydown") ? true : false;

    switch (event.keyCode) {

    case 32: // spacebar
        controller.space = keyState;
        break;

    case 82: // r key
        controller.rKey = keyState;
        break;

    }
  }
};


// function for collision detection
function collisionDetection() {

  // collision detection for the pipes and the character
  for (var i = 0; i < pipes.length; i++) {

    if (character.x + character.sxd * 1.8 > pipes[i].x && character.x < pipes[i].x + PIPESPRITE.width * 1.8) {// x axis

      if (character.y < pipes[i].topY || character.y + character.syd * 1.8 > pipes[i].topY + PIPECONSTS.GAPHEIGHT) { // y axis

        HIT.play();
        DIESOUND.play();
        lives = 0;

      }
    }
  }

  // collision detection for the floating obstacles and the character
  for (var i = 0; i < obstacles.length; i++) {

    if (character.x + character.sxd * 1.8 > obstacles[i].x && character.x < obstacles[i].x + obstacles[i].width) {// x axis

      if (character.y < obstacles[i].y + obstacles[i].height && character.y + character.syd * 1.8 > obstacles[i].y) { // y axis

        lives -= 1;

        if (lives <= 0) {

          HIT.play();
          DIESOUND.play();

        }else if (lives > 0){

          HIT.play();

        }

        obstacles.splice(i,1);

      }
    }
  }

  // collision detection for the coins and the character
  for (var i = 0; i < coins.length; i++) {

    if (character.x + character.sxd * 1.8 > coins[i].x && character.x < coins[i].x + coins[i].sxd * 1.5) { // if the coin and character line up on the x axis

      if (character.y < coins[i].y + coins[i].syd * 1.5 && character.y + character.syd * 1.8 > coins[i].y) { // if they line up on the y

        score += coins[i].value;
        coins.splice(i,1);
        POINT.play();

      }
    }
  }

  // collision detection between the coins and obstacles
  for (var i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x < coins[0].x + coins[0].sxd * 1.5 && obstacles[i].x + obstacles[i].width > coins[0].x) {

      if (obstacles[i].y - 20 < coins[0].y + coins[0].syd * 1.5 && obstacles[i].y + obstacles[i].height + 20 > coins[0].y) {

        obstacles.splice(i,1);
        makeObstacle();

      }
    }
  }
}


// function to make a new pipe
function makePipe() {

  var pipe = {
    x: CVS.width,
    topY: randomValue(PIPECONSTS.MINY, PIPECONSTS.MAXY)
  }

  // unshift this new pipe into the front of the pipes array
  pipes.unshift(pipe);

};



// function to make a new coin
function makeCoin() {

  var coinChoice = randomValue(0, 3);

  // variables for each type of coin
  var bronzeCoin = {
    value: 1,
    source: COINSSPRITE,
    sx: 0,
    sy: 0,
    sxd: COINSSPRITE.height,
    syd: COINSSPRITE.height,
    x: CVS.width,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };


  var silverCoin = {
    value: 5,
    source: COINSSPRITE,
    sx: 16,
    sy: 0,
    sxd: 12,
    syd: 13,
    x: CVS.width,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };


  var goldCoin = {
    value: 10,
    source: COINSSPRITE,
    sx: 29,
    sy: 0,
    sxd: 11,
    syd: 11,
    x: CVS.width,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };


  // unshift the selected coin into the front of the coins array
  if (coinChoice >= 0 && coinChoice < 1) {

    bronzeCoin.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2;
    coins.unshift(bronzeCoin);

  } else if(coinChoice >= 1 && coinChoice < 2){

    silverCoin.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2;
    coins.unshift(silverCoin);

  }else if(coinChoice >= 2 && coinChoice <= 3){

    goldCoin.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2;
    coins.unshift(goldCoin);

  }
};

// function to make a new obstacle
function makeObstacle() {

  // variables for each size obs
  var obs = {
    lifeLost: 1,
    width: randomValue(20, 30),
    height: randomValue(20, 30),
    x: pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };

  obstacles.unshift(obs);

};



function draw() {


  collisionDetection();


  // drawing the sky
  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);


  // drawing pipes
  for (var i = 0; i < pipes.length; i++) {

    CTX.drawImage(PIPESPRITE, 0, 0, PIPESPRITE.width, PIPESPRITE.height / 2, pipes[i].x, pipes[i].topY - PIPESPRITE.height / 2 - PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height);

    CTX.drawImage(PIPESPRITE, 0, PIPESPRITE.height / 2, PIPESPRITE.width, PIPESPRITE.height/2, pipes[i].x, pipes[i].topY + PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height);

    if (pipes[0].x < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {

      // making a pipe when the frontmost pipe is at the set distance
      makePipe();

    } else if (pipes[i].x < - PIPESPRITE.WIDTH){

      // pop removes the last item in an array, which seeing as the pipes are added to the front of the array, the pop will remove the leftmost pipe.
      pipes.pop();

    } else {

      // moving the pipe
      pipes[i].x -= OBJSPEED;

    }
  }

  // drawing the coins
  for (var i = 0; i < coins.length; i++) {

    CTX.drawImage(coins[i].source, coins[i].sx, coins[i].sy, coins[i].sxd, coins[i].syd, coins[i].x, coins[i].y, coins[i].sxd * 2, coins[i].syd * 2);

    if (coins[0].x - coins[0].sxd < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {

      // making a coin when the frontmost coin is at the set distance
      makeCoin();

    } else if (coins[i].x < - PIPECONSTS.WIDTH){

      // pop removes the last item in an array, which seeing as the coins are added to the front of the array, the pop will remove the leftmost coin.
      coins.pop();

    } else {

      // moving the coins
      coins[i].x -= OBJSPEED;

    }
  }

  // drawing the obstacles
  for (var i = 0; i < obstacles.length; i++) {

    CTX.fillStyle = colours.obsColour;
    CTX.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

    if (obstacles[0].x - obstacles[0].width < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {
      // making an obs when the frontmost obs is at the set distance
      makeObstacle();

    } else if (obstacles[i].x < - obstacles[i].width){

      // pop removes the last item in an array, which seeing as the obstacles are added to the front of the array, the pop will remove the leftmost obs.
      obstacles.pop();

    } else {

      // moving the obs
      obstacles[i].x -= OBJSPEED;

    }
  }


  //drawing the ground
  CTX.fillStyle = colours.groundColour;
  CTX.fillRect(0, FLOORHEIGHT, CVS.width, CVS.height / 4);


  // drawing the character
  CTX.drawImage(CHARACTERSPRITE, character.sx, character.sy, character.sxd, character.syd, character.x, character.y, character.sxd * 1.8, character.syd * 1.8);


  // writing the score
  CTX.font = "20px Arial";
  CTX.strokeStyle = "white";
  CTX.strokeText("Score: ", CVS.width - 170, 30);
  CTX.strokeText(score, CVS.width - 100, 30);
  CTX.fillStyle = "black";
  CTX.fillText("Score: ", CVS.width - 170, 30);
  CTX.fillText(score, CVS.width - 100, 30);


  // writing the score
  CTX.font = "20px Arial";
  CTX.strokeStyle = "white";
  CTX.strokeText("Lives: ", 30, 30);
  CTX.strokeText(lives, 100, 30);
  CTX.fillStyle = "black";
  CTX.fillText("Lives: ", 30, 30);
  CTX.fillText(lives, 100, 30);


  // if the spacebar has been pressed and not released, the character jumps
  if (controller.space && character.jumping === false) {

    JUMP.play();
    character.jumping = true;
    character.yVelocity = JUMPSTRENGTH;

    // next 3 if statements animate the flapping for the bird
    if (character.sx < CHARACTERSPRITE.width - character.sxd) {

      character.sx += character.sxd;
    }

    if (character.sx < CHARACTERSPRITE.width - character.sxd) {
      setTimeout(function () {
        character.sx += character.sxd;
      }, 100);
    }
    if (character.sx < CHARACTERSPRITE.width - character.sxd) {
      setTimeout(function () {
        character.sx = 0;
      }, 200);
    }

  // else if the spacebar has been release, the character is not jumping anymore
  } else if(controller.space === false){

    character.jumping = false;

  }

  character.yVelocity += GRAVITY; // gravity changing y velocity
  character.y += character.yVelocity; // y velocity changing the characters y

  // if character is falling below floor line
  if (character.y + character.syd * 1.8 > FLOORHEIGHT) {

    character.y = FLOORHEIGHT - character.syd * 1.8;
    character.yVelocity = 0;

  }

  // checking lives to see if game needs to stop
  if(lives <= 0) {

    scoreboard.push(score);
    score = 0;
    scoreboard.sort(function(a, b){return b - a});

    if (scoreboard.length > 5){

      scoreboard.pop();

    }

    gameRunning = false;

  }
};



function died(){


  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);


  // drawing pipes
  for (var i = 0; i < pipes.length; i++) {

    CTX.drawImage(PIPESPRITE, 0, 0, PIPESPRITE.width, PIPESPRITE.height / 2, pipes[i].x, pipes[i].topY - PIPESPRITE.height / 2 - PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height);

    CTX.drawImage(PIPESPRITE, 0, PIPESPRITE.height / 2, PIPESPRITE.width, PIPESPRITE.height/2, pipes[i].x, pipes[i].topY + PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height);

  }


  // drawing the coins
  for (var i = 0; i < coins.length; i++) {

    CTX.drawImage(coins[i].source, coins[i].sx, coins[i].sy, coins[i].sxd, coins[i].syd, coins[i].x, coins[i].y, coins[i].sxd * 2, coins[i].syd * 2);

  }


  // drawing the obstacles
  for (var i = 0; i < obstacles.length; i++) {

    CTX.fillStyle = colours.obsColour;
    CTX.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

  }

  // Writing up the scoreboard
  // "Scoreboard"
  CTX.font = "30px Arial";
  CTX.strokeStyle = "white";
  CTX.strokeText("Scoreboard", CVS.width / 2 - 110, scoreboardYPos - 40);
  CTX.fillStyle = "black";
  CTX.fillText("Scoreboard",  CVS.width / 2 - 110, scoreboardYPos - 40);

  // writing the scores
  for (var i = 0; i < scoreboard.length; i++) {

    CTX.font = "20px Arial";
    CTX.strokeStyle = "white";
    CTX.strokeText((i + 1) + ":   " + scoreboard[i],  CVS.width / 2 - 50, scoreboardYPos);
    CTX.fillStyle = "black";
    CTX.fillText((i + 1) + ":   " + scoreboard[i],  CVS.width / 2 - 50, scoreboardYPos);
    scoreboardYPos += 30;

  }

  // message to restart
  CTX.font = "25px Arial";
  CTX.strokeStyle = "white";
  CTX.strokeText("Press R to Restart", CVS.width / 2 - 135, scoreboardYPos + 30);
  CTX.fillStyle = "black";
  CTX.fillText("Press R to Restart",  CVS.width / 2 - 135, scoreboardYPos + 30);

  //drawing the ground
  CTX.fillStyle = colours.groundColour;
  CTX.fillRect(0, FLOORHEIGHT, CVS.width, CVS.height / 4);

  // drawing the character
  CTX.drawImage(CHARACTERSPRITE, character.sx, character.sy, character.sxd, character.syd, character.x, character.y, character.sxd * 1.8, character.syd * 1.8);

  if (character.y + character.syd * 1.8 < FLOORHEIGHT) {
    character.yVelocity += GRAVITY; // gravity changing y velocity
    character.y += character.yVelocity; // y velocity changing the characters y
  }

}


// reset function for starting up again after you die
function reset() {

  lives = 3;
  pipes.splice(0, pipes.length);
  coins.splice(0, coins.length);
  obstacles.splice(0, obstacles.length);

  makePipe();
  makeCoin();
  makeObstacle();
  gameRunning = true;

}

// loop function to allow the game to stop and start
function loop() {

  if (gameRunning === false && controller.rKey){ // if the r key is pressed while the game has stopped

    reset();

  }

  if (gameRunning) {

    draw(); // if the game is running then call draw

  } else if (gameRunning === false){

    died(); // if the game isn't running call the died function
    scoreboardYPos = FLOORHEIGHT - 200;
  }

  window.requestAnimationFrame(loop); // recalling the function to make it a loop
}



// event listeners for the controller
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);


// making a pipe and coin and an obstacle so that they are ready for the game
makePipe();
makeCoin();
makeObstacle();


// calling the loop function for the first time to start the loop
window.requestAnimationFrame(loop);
