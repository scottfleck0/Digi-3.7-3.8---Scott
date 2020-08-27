const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

// constant for the height of the floor
const FLOORHEIGHT = 3 * (CVS.height / 4);

// constant for gravity
const GRAVITY = 0.35;
const JUMPSTRENGTH = -6;

// variable for collision detection
var badCollision = false;

// array for the pipes
var pipes = [];

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
  MAXY: FLOORHEIGHT - 100 - 30,
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

// function for collision detection for the pipes
function collisionDetection() {
  for (var i = 0; i < pipes.length; i++) {

    if (character.x + character.radius > pipes[i].x && character.x - character.radius < pipes[i].x + PIPECONSTS.WIDTH) {
      if (character.y - character.radius < pipes[i].topY || character.y + character.radius > pipes[i].topY + PIPECONSTS.GAPHEIGHT) {
        badCollision = true;
      }
    } else {
      badCollision = false;
    }
  }
}


function randomValue(min, max) {
  return Math.random() * (max - min) + min;
}


function makePipe() {
  var pipe = {
    x: CVS.width,
    topY: randomValue(PIPECONSTS.MINY, PIPECONSTS.MAXY)
  }
  // unshift this new pipe into the front of the pipes array
  pipes.unshift(pipe);
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
      pipes[i].x -= 3;
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
  console.log(badCollision);
};


// event listeners for the controller
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

// making a pipe so that there is one ready for the game
makePipe();

// calling the draw function for the first time
window.requestAnimationFrame(draw);
