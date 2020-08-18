const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

// constant for the height of the floor
const FLOORHEIGHT = 3 * (CVS.height / 4);

// constant for gravity
const GRAVITY = 0.8;
const JUMPSTRENGTH = -9;

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

function makePipe() {
  var pipe = {
    x: CVS.width - 50,
    topY: 100,
    width: 20,
    gapHeight: 100
  }

  pipes.push(pipe);
};

function draw() {
  // drawing the sky
  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);

  // drawing pipes
  for (var i = 0; i < pipes.length; i++) {
    CTX.fillStyle = colours.pipesColour;
    CTX.fillRect(pipes[i].x, pipes[i].topY, pipes[i].width, - pipes[i].topY);

    CTX.fillStyle = colours.pipesColour;
    CTX.fillRect(pipes[i].x, pipes[i].topY + pipes[i].gapHeight, pipes[i].width, CVS.height - pipes[i].topY - pipes[i].gapHeight);

    if (pipes[i].x > -pipes[i].width) {
      pipes[i].x -= 3;
    } else{
    pipes[i].x = CVS.width;
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

  window.requestAnimationFrame(draw);
};



window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

makePipe();
window.requestAnimationFrame(draw);
