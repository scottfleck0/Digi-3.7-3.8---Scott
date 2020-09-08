const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

// function to get a random value
function randomValue(min, max) {
  return Math.random() * (max - min) + min;
}

// constant for the height of the floor
const FLOORHEIGHT = 3 * (CVS.height / 4);

// constants for jumping animation
const GRAVITY = 0.35;
const JUMPSTRENGTH = -6;

// vars for score and lives
var score = 0;
var lives = 3;

// array for the pipes and coins
var pipes = [];
var coins = [];

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
  pipesColour: "black"
}

// variable containing all the character information
var character = {
  x: 100,
  y: 100,
  radius: 15,
  yVelocity: 0,
  jumping: false
};

const PIPECONSTS = {
  WIDTH: 20,
  GAPHEIGHT: 100,
  MINY: 30,
  MAXY: FLOORHEIGHT - 100 - 30,// the 100 is the gapheight but it theoretically isn't defined yet so I need to put 100 instead of the variable
  DISTANCEBETWEEN: CVS.width / 2
};


var controller = {
  space: false,

  keyListener: function(event){

    'use strict';
    var keyState = (event.type === "keydown") ? true : false;

    switch (event.keyCode) {

    case 32: // spacebar
        controller.space = keyState;
        break;

    }
  }
};

// function for collision detection
function collisionDetection() {
  // collision detection for the pipes
  for (var i = 0; i < pipes.length; i++) {
    if (character.x + character.radius > pipes[i].x && character.x - character.radius < pipes[i].x + PIPECONSTS.WIDTH) {// y axis
      if (character.y - character.radius < pipes[i].topY || character.y + character.radius > pipes[i].topY + PIPECONSTS.GAPHEIGHT) { // x axis
        lives -= 3;
      }
    }
  }

  // collision detection for the coins
  for (var i = 0; i < coins.length; i++) {
    if (character.x + character.radius * 0.67 > coins[i].x - coins[i].radius * 0.67 && character.x - character.radius * 0.67 < coins[i].x + coins[i].radius * 0.67) { // if the coin and character line up on the x axis
      if (character.y - character.radius * 0.67 < coins[i].y + coins[i].radius * 0.67 && character.y + character.radius * 0.67 > coins[i].y - coins[i].radius * 0.67) { // if they line up on the y
        score += coins[i].value;
        coins.splice(i,1);
      }
    }
  }
}


function makePipe() {
  var pipe = {
    x: CVS.width,
    topY: randomValue(PIPECONSTS.MINY, PIPECONSTS.MAXY)
  }
  // unshift this new pipe into the front of the pipes array
  pipes.unshift(pipe);
};

function makeCoin() {
  var coinChoice = randomValue(0, 3);

  var coin1 = {
    value: 1,
    colour: "brown",
    radius: 20,
    x: CVS.width + 30,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };

  var coin2 = {
    value: 5,
    colour: "silver",
    radius: 15,
    x: CVS.width + 20,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };

  var coin3 = {
    value: 10,
    colour: "gold",
    radius: 10,
    x: CVS.width + 10,
    y: randomValue(FLOATCONSTS.MINY, FLOATCONSTS.MAXY)
  };

  // unshift the selected coin into the front of the coins array
  if (coinChoice >= 0 && coinChoice < 1) {

    coin1.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2 + coin1.radius;
    coins.unshift(coin1);

  } else if(coinChoice >= 1 && coinChoice < 2){

    coin2.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2 + coin2.radius;
    coins.unshift(coin2);

  }else if(coinChoice >= 2 && coinChoice <= 3){

    coin3.x = pipes[0].x + PIPECONSTS.DISTANCEBETWEEN / 2 + coin3.radius;
    coins.unshift(coin3);

  }
};


function draw() {
  // drawing the sky
  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);

  // drawing pipes
  for (var i = 0; i < pipes.length; i++) {
    CTX.fillStyle = colours.pipesColour;
    CTX.fillRect(pipes[i].x, pipes[i].topY, PIPECONSTS.WIDTH, - pipes[i].topY);

    CTX.fillStyle = colours.pipesColour;
    CTX.fillRect(pipes[i].x, pipes[i].topY + PIPECONSTS.GAPHEIGHT, PIPECONSTS.WIDTH, CVS.height - pipes[i].topY - PIPECONSTS.GAPHEIGHT);

    if (pipes[0].x < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {
      // making a pipe when the frontmost pipe is at the set distance
      makePipe();

    } else if (pipes[i].x < - PIPECONSTS.WIDTH){
      // pop removes the last item in an array, which seeing as the pipes are added to the front of the array, the pop will remove the leftmost pipe.
      pipes.pop();

    } else {
      // moving the pipe
      pipes[i].x -= OBJSPEED;
    }
  }

  // drawing the coins
  for (var i = 0; i < coins.length; i++) {
    CTX.beginPath();
    CTX.arc(coins[i].x, coins[i].y, coins[i].radius, 0, Math.PI * 2);
    CTX.fillStyle = coins[i].colour;
    CTX.fill();

    if (coins[0].x - coins[0].radius < CVS.width - PIPECONSTS.DISTANCEBETWEEN) {
      // making a pipe when the frontmost pipe is at the set distance
      makeCoin();

    } else if (coins[i].x < - PIPECONSTS.WIDTH){
      // pop removes the last item in an array, which seeing as the pipes are added to the front of the array, the pop will remove the leftmost pipe.
      coins.pop();

    } else {
      // moving the pipe
      coins[i].x -= OBJSPEED;
    }
  }



  //drawing the ground
  CTX.fillStyle = colours.groundColour;
  CTX.fillRect(0, FLOORHEIGHT, CVS.width, CVS.height / 4);

  // drawing the character
  CTX.beginPath();
  CTX.arc(character.x, character.y, character.radius, 0, Math.PI * 2);
  CTX.fillStyle = colours.characterColour;
  CTX.fill();

// if the spacebar has been pressed and not released, the character jumps
  if (controller.space && character.jumping === false) {

    character.jumping = true;
    character.yVelocity = JUMPSTRENGTH;

  // else if the spacebar has been release, the character is not jumping anymore
  } else if(controller.space === false){

    character.jumping = false;

  }

  character.yVelocity += GRAVITY; // gravity changing y velocity
  character.y += character.yVelocity; // y velocity changing the characters y

  // if rectangle is falling below floor line
  if (character.y + character.radius > FLOORHEIGHT) {

    character.y = FLOORHEIGHT - character.radius;
    character.yVelocity = 0;

  }

  collisionDetection();
  window.requestAnimationFrame(draw);
};


// event listeners for the controller
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

// making a pipe and coin so that there is one ready for the game
makePipe();
makeCoin();

// calling the draw function for the first time
window.requestAnimationFrame(draw);
