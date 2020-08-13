const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

// constant for the height of the floor
const floorHeight = 3 * (CVS.height / 4);

// constant for gravity
const gravity = 0.5;

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
    keyListener: function (event) {

        'use strict';
        var key_state = (event.type === "keydown") ? true : false;

        switch (event.keyCode) {

        case 32: // keycode for spacebar
            controller.space = key_state;
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
  CTX.fillRect(0, floorHeight, CVS.width, CVS.height / 4);

  // drawing the character
  CTX.beginPath();
  CTX.arc(character.x, character.y, character.radius, 0, Math.PI * 2);
  CTX.fillStyle = colours.characterColour;
  CTX.fill();

  if (controller.space) {
    character.yVelocity = -10;
  }

  if (character.y + character.radius < floorHeight) {
    // changing the characters y velocity by gravity and then changing the characters y by the velocity
    character.yVelocity += gravity;
    character.y += character.yVelocity;
  } else {
    return;
  }

  window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
