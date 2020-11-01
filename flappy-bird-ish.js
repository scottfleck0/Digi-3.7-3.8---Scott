// creating the canvas and context variables
const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

// setting this for borders and words
CTX.textAlign = 'center';
CTX.lineWidth = 2;

// variable for if the game is running or not
var game = {
  started: false,
  running: false
};

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
CHARACTERSPRITE.src = "Images/batSpriteSheet.png";

const FRUITSPRITE = new Image();
FRUITSPRITE.src = "Images/fruitSprite.png";

const OBSTACLESPRITE = new Image();
OBSTACLESPRITE.src = "Images/obstacleSprite.png";



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


// arrays for the pipes, fruits and floating obstacles
var pipes = [];
var fruits = [];
var obstacles = [];


// speed for all the objects in the game
const OBJSPEED = 3;


// constants for floating items
const FLOATCONSTS = {

  MINY: 50,
  MAXY: FLOORHEIGHT - 50

};


// variable containing colours
var colours = {

  skyColour: "#33221f",
  groundColour: "#4e342e",
  characterColour: "#ffff00"

};


// variable containing all the character information for the sprite sheet and location on the canvas
var character = {

  source: CHARACTERSPRITE,
  sx: 0,
  sy: 0,
  sxd: 21,
  syd: 13,
  x: 100,
  y: 100,
  yVelocity: 0,
  jumping: false

};


// constants for the pipes
const PIPECONSTS = {

  GAPHEIGHT: 100,
  MINY: 30,
  MAXY: FLOORHEIGHT - 100 - 30,// the 100 is the gapheight but it theoretically isn't defined yet so I can't derive it
  DISTANCEBETWEEN: 250

};


// controller variable which reads when keys are pressed
var controller = {

  space: false, // space and r are false for a start as they haven't been pressed yet
  rKey: false,

  keyListener: function(event){

    'use strict';
    var keyState = (event.type === "keydown") ? true : false; // when a key has been pressed keystate is set to true

    switch (event.keyCode) {

    case 32: // keycode for spacebar
        controller.space = keyState; // setting space variable to the keystate which, if a key has been pressed will be true
        break;

    case 82: // keycode for r key
        controller.rKey = keyState; // setting r variable to the keystate which, if a key has been pressed will be true
        break;

    }
  }
};


// function for collision detection
function collisionDetection() {

  // collision detection for the pipes and the character
  for (var i = 0; i < pipes.length; i++) {

    if (character.x + character.sxd * 1.8 > pipes[i].x && character.x < pipes[i].x + PIPESPRITE.width * 1.8) {// lining up on x axis

      if (character.y < pipes[i].topY || character.y + character.syd * 1.8 > pipes[i].topY + PIPECONSTS.GAPHEIGHT) { // lining up on y axis

        HIT.play();
        DIESOUND.play();
        lives = 0;

      }
    }
  }

  // collision detection for the floating obstacles and the character
  for (var i = 0; i < obstacles.length; i++) {

    if (character.x + character.sxd * 1.8 > obstacles[i].x && character.x < obstacles[i].x + OBSTACLESPRITE.width * 0.8) {// lining up on x axis

      if (character.y < obstacles[i].y + OBSTACLESPRITE.height * 0.8 && character.y + character.syd * 1.8 > obstacles[i].y) { // lining up on y axis

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

  // collision detection for the fruit and the character
  for (var i = 0; i < fruits.length; i++) {

    if (character.x + character.sxd * 1.8 > fruits[i].x && character.x < fruits[i].x + fruits[i].sxd * 1.3) { // if the fruit and character line up on the x axis

      if (character.y < fruits[i].y + fruits[i].syd * 1.3 && character.y + character.syd * 1.8 > fruits[i].y) { // if they line up on the y

        score += fruits[i].value;
        fruits.splice(i,1);
        POINT.play();

      }
    }
  }

  // collision detection between the fruits and obstacles
  for (var i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x < fruits[0].x + fruits[0].sxd * 1.5 && obstacles[i].x + OBSTACLESPRITE.width > fruits[0].x) { // checking x axis

      if (obstacles[i].y - 20 < fruits[0].y + fruits[0].syd * 1.5 && obstacles[i].y + OBSTACLESPRITE.height + 20 > fruits[0].y) { // checking y axis

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

  // put this new pipe into the front of the pipes array
  pipes.unshift(pipe);

};



// function to make a new fruit
function makeFruit() {

  var fruitChoice = randomValue(0, 3);

  // variables for each type of fruit containing info for sprite sheet and location on canvas
  var oneFruit = {
    value: 1,
    source: FRUITSPRITE,
    sx: 0,
    sy: 0,
    sxd: 15,
    syd: 15,
    x: CVS.width,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };


  var twoFruits = {
    value: 2,
    source: FRUITSPRITE,
    sx: 0,
    sy: 15,
    sxd: 24,
    syd: 14,
    x: CVS.width,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };


  var threeFruits = {
    value: 3,
    source: FRUITSPRITE,
    sx: 0,
    sy: 30,
    sxd: 24,
    syd: 24,
    x: CVS.width,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };


  // unshift the selected fruit into the front of the fruits array
  if (fruitChoice >= 0 && fruitChoice < 1) {

    oneFruit.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2;
    fruits.unshift(oneFruit);

  } else if(fruitChoice >= 1 && fruitChoice < 2){

    twoFruits.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2;
    fruits.unshift(twoFruits);

  }else if(fruitChoice >= 2 && fruitChoice <= 3){

    threeFruits.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2;
    fruits.unshift(threeFruits);

  }
};

// function to make a new obstacle
function makeObstacle() {

  // variables for each size obs
  var obs = {
    lifeLost: 1,
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

    CTX.drawImage(PIPESPRITE, 0, PIPESPRITE.height / 2, PIPESPRITE.width, PIPESPRITE.height / 2, pipes[i].x, pipes[i].topY - PIPESPRITE.height / 2 - PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height);

    CTX.drawImage(PIPESPRITE, 0, 0, PIPESPRITE.width, PIPESPRITE.height/2, pipes[i].x, pipes[i].topY + PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height);

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

  // drawing the fruits
  for (var i = 0; i < fruits.length; i++) {

    CTX.drawImage(fruits[i].source, fruits[i].sx, fruits[i].sy, fruits[i].sxd, fruits[i].syd, fruits[i].x, fruits[i].y, fruits[i].sxd * 2, fruits[i].syd * 2);

    if (fruits[0].x - fruits[0].sxd < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {

      // making a fruit when the frontmost fruit is at the set distance
      makeFruit();

    } else if (fruits[i].x < - PIPECONSTS.WIDTH){

      // pop removes the last item in an array, which seeing as the fruits are added to the front of the array, the pop will remove the leftmost fruit.
      fruits.pop();

    } else {

      // moving the fruits
      fruits[i].x -= OBJSPEED;

    }
  }

  // drawing the obstacles
  for (var i = 0; i < obstacles.length; i++) {

    CTX.drawImage(OBSTACLESPRITE, 0, 0, OBSTACLESPRITE.width, OBSTACLESPRITE.height, obstacles[i].x, obstacles[i].y, OBSTACLESPRITE.width, OBSTACLESPRITE.height);

    if (obstacles[0].x - OBSTACLESPRITE.width < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {
      // making an obs when the frontmost obs is at the set distance
      makeObstacle();

    } else if (obstacles[i].x < - OBSTACLESPRITE.width){

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
  CTX.beginPath();
  CTX.moveTo(0, FLOORHEIGHT);
  CTX.lineTo(CVS.width, FLOORHEIGHT);
  CTX.strokeStyle = "black";
  CTX.lineWidth = 2;
  CTX.stroke();


  // drawing the character
  CTX.drawImage(CHARACTERSPRITE, character.sx, character.sy, character.sxd, character.syd, character.x, character.y, character.sxd * 1.8, character.syd * 1.8);


  // writing the score
  CTX.font = "20px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Score: ", CVS.width - 150, 30);
  CTX.strokeText(score, CVS.width - 100, 30);
  CTX.fillStyle = "white";
  CTX.fillText("Score: ", CVS.width - 150, 30);
  CTX.fillText(score, CVS.width - 100, 30);


  // writing the lives
  CTX.font = "20px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Lives: ", 40, 30);
  CTX.strokeText(lives, 100, 30);
  CTX.fillStyle = "white";
  CTX.fillText("Lives: ", 40, 30);
  CTX.fillText(lives, 100, 30);


  // if the spacebar has been pressed and not released, the character jumps
  if (controller.space && character.jumping === false) {

    JUMP.play();
    character.jumping = true;
    character.yVelocity = JUMPSTRENGTH;

    // next 3 if statements animate the flapping for the bird
    if (character.sy < CHARACTERSPRITE.height - character.syd) {

      character.sy += 13;
      character.syd += 3;

    }

    if (character.sy < CHARACTERSPRITE.height - character.syd) {
      setTimeout(function () {

        character.sy += 17;

      }, 100);
    }
    if (character.sy < CHARACTERSPRITE.height - character.syd) {
      setTimeout(function () {

        character.sy = 0;
        character.syd = 13;

      }, 200)
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

  //if character goes above roof
  if (character.y  < 0) {

    character.y = 0;
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

    game.running = false;

  }
};



function died(){


  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);


  // drawing pipes
  for (var i = 0; i < pipes.length; i++) {

    CTX.drawImage(PIPESPRITE, 0, PIPESPRITE.height / 2, PIPESPRITE.width, PIPESPRITE.height / 2, pipes[i].x, pipes[i].topY - PIPESPRITE.height / 2 - PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height); // top pipe

    CTX.drawImage(PIPESPRITE, 0, 0, PIPESPRITE.width, PIPESPRITE.height/2, pipes[i].x, pipes[i].topY + PIPECONSTS.GAPHEIGHT, PIPESPRITE.width * 2, PIPESPRITE.height); // bottom pipe

  }


  // drawing the fruits
  for (var i = 0; i < fruits.length; i++) {

    CTX.drawImage(fruits[i].source, fruits[i].sx, fruits[i].sy, fruits[i].sxd, fruits[i].syd, fruits[i].x, fruits[i].y, fruits[i].sxd * 2, fruits[i].syd * 2);

  }


  // drawing the obstacles
  for (var i = 0; i < obstacles.length; i++) {

    CTX.drawImage(OBSTACLESPRITE, 0, 0, OBSTACLESPRITE.width, OBSTACLESPRITE.height, obstacles[i].x, obstacles[i].y, OBSTACLESPRITE.width, OBSTACLESPRITE.height);

  }


  // Writing up the scoreboard
  // "Scoreboard"
  CTX.font = "30px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Scoreboard", CVS.width / 2, scoreboardYPos - 40);
  CTX.fillStyle = "white";
  CTX.fillText("Scoreboard",  CVS.width / 2, scoreboardYPos - 40);

  // writing the scores
  for (var i = 0; i < scoreboard.length; i++) {

    CTX.font = "20px Arial";
    CTX.strokeStyle = "black";
    CTX.strokeText((i + 1) + ":   " + scoreboard[i],  CVS.width / 2, scoreboardYPos);
    CTX.fillStyle = "white";
    CTX.fillText((i + 1) + ":   " + scoreboard[i],  CVS.width / 2, scoreboardYPos);
    scoreboardYPos += 30;

  }

  // message to restart
  CTX.font = "25px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Press R to Restart", CVS.width / 2, scoreboardYPos + 30);
  CTX.fillStyle = "white";
  CTX.fillText("Press R to Restart",  CVS.width / 2, scoreboardYPos + 30);

  //drawing the ground
  CTX.fillStyle = colours.groundColour;
  CTX.fillRect(0, FLOORHEIGHT, CVS.width, CVS.height / 4);
  CTX.beginPath();
  CTX.moveTo(0, FLOORHEIGHT);
  CTX.lineTo(CVS.width, FLOORHEIGHT);
  CTX.strokeStyle = "black";
  CTX.lineWidth = 2;
  CTX.stroke();

  // drawing the character
  CTX.drawImage(CHARACTERSPRITE, character.sx, character.sy, character.sxd, character.syd, character.x, character.y, character.sxd * 1.8, character.syd * 1.8);


  if (character.y + character.syd * 1.8 < FLOORHEIGHT) {
    character.yVelocity += GRAVITY; // gravity changing y velocity
    character.y += character.yVelocity; // y velocity changing the characters y
  }

}

function startScreen() {

  // drawing the sky
  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);

  // title
  CTX.font = "50px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Flappy Bird-ish", CVS.width / 2, 100);
  CTX.fillStyle = "white";
  CTX.fillText("Flappy Bird-ish",  CVS.width / 2, 100);

  // fruits
  CTX.font = "20px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Collect the fruits!", CVS.width / 2, 150);
  CTX.fillStyle = "white";
  CTX.fillText("Collect the fruits!",  CVS.width / 2, 150);

  CTX.drawImage(FRUITSPRITE, 0, 0, 15, 15, 170, 130, 30, 30);
  CTX.drawImage(FRUITSPRITE, 0, 0, 15, 15, 400, 130, 30, 30);

  // obstacles
  CTX.font = "20px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Don't Touch the Toxic Gas Bubbles!", CVS.width / 2, 200);
  CTX.fillStyle = "white";
  CTX.fillText("Don't Touch the Toxic Gas Bubbles!",  CVS.width / 2, 200);

  CTX.drawImage(OBSTACLESPRITE, 90, 178, 30, 30);
  CTX.drawImage(OBSTACLESPRITE, 480, 178, 30, 30);

  // controls message
  CTX.font = "20px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Use the Spacebar to Jump", CVS.width / 2, 250);
  CTX.fillStyle = "white";
  CTX.fillText("Use the Spacebar to Jump",  CVS.width / 2, 250);

  //drawing the ground
  CTX.fillStyle = colours.groundColour;
  CTX.fillRect(0, FLOORHEIGHT, CVS.width, CVS.height / 4);
  CTX.beginPath();
  CTX.moveTo(0, FLOORHEIGHT);
  CTX.lineTo(CVS.width, FLOORHEIGHT);
  CTX.strokeStyle = "black";
  CTX.lineWidth = 2;
  CTX.stroke();

  // start message
  CTX.font = "20px Arial";
  CTX.strokeStyle = "black";
  CTX.strokeText("Press Spacebar to Start", CVS.width / 2, FLOORHEIGHT + 50);
  CTX.fillStyle = "white";
  CTX.fillText("Press Spacebar to Start",  CVS.width / 2, FLOORHEIGHT + 50);


  if (controller.space === true) {

    game.running = true;
    game.started = true;

  }

}


// reset function for starting up again after you die
function reset() {

  lives = 3;
  pipes.splice(0, pipes.length);
  fruits.splice(0, fruits.length);
  obstacles.splice(0, obstacles.length);

  makePipe();
  makeFruit();
  makeObstacle();
  game.running = true;

}

// loop function to allow the game to stop and start
function loop() {

  if (game.running === false && game.started === false) {

    startScreen();

  }

  if (game.running === false && game.started && controller.rKey){ // if the r key is pressed while the game has stopped

    reset();

  }

  if (game.running && game.started) {

    draw(); // if the game is running then call draw

  } else if (game.running === false && game.started){

    died(); // if the game isn't running call the died function
    scoreboardYPos = FLOORHEIGHT - 200;
  }

  window.requestAnimationFrame(loop); // recalling the function to make it a loop
}



// event listeners for the controller
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);


// making a pipe and fruit and an obstacle so that they are ready for the game
makePipe();
makeFruit();
makeObstacle();


// calling the loop function for the first time to start the loop
window.requestAnimationFrame(loop);
