const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

// constant for the height of the floor
const FLOORHEIGHT = 3 * (CVS.height / 4);

// constant for gravity
const GRAVITY = 0.8;
const JUMPSTRENGTH = -9;

// variable containing colours
var colours = {
  skyColour: "#33CCFF",
  groundColour: "#009900",
  characterColour: "#ffff00"
}

// variable containing all the character information
var character = {
  x: 100,
  y: 100,
  radius: 20,
  yVelocity: 0
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

function draw() {

  // drawing the sky
  CTX.fillStyle = colours.skyColour;
  CTX.fillRect(0, 0, CVS.width, CVS.height);

  //drawing the background
  CTX.fillStyle = colours.groundColour;
  CTX.fillRect(0, FLOORHEIGHT, CVS.width, CVS.height / 4);

  // drawing the character
  CTX.beginPath();
  CTX.arc(character.x, character.y, character.radius, 0, Math.PI * 2);
  CTX.fillStyle = colours.characterColour;
  CTX.fill();

  if (controller.space) {
    character.yVelocity = JUMPSTRENGTH;;
  }

  character.yVelocity += GRAVITY;// gravity
  character.y += character.yVelocity;

  // if rectangle is falling below floor line
  if (character.y + character.radius > FLOORHEIGHT) {
    character.y = FLOORHEIGHT - character.radius;
    character.yVelocity = 0;
  }

  window.requestAnimationFrame(draw);
};

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(draw);
