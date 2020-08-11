const CVS = document.getElementById("gameCanvas");
const CTX = CVS.getContext('2d');

const floorHeight = 3 * (CVS.height / 4);

var colours = {
  skyColour: "#33CCFF",
  groundColour: "#009900",
  characterColour: "#ffff00"
}

CTX.fillStyle = colours.skyColour;
CTX.fillRect(0, 0, CVS.width, CVS.height);

CTX.fillStyle = colours.groundColour;
CTX.fillRect(0, floorHeight, CVS.width, CVS.height / 4);
