var CVS = document.getElementById("canvas");
var CTX = CVS.getContext('2d');

const COINSSPRITE = new Image();
COINSSPRITE.src = "js images/coinSpriteSheet.png";


CTX.drawImage(COINSSPRITE, 0, 0, COINSSPRITE.height, COINSSPRITE.height, 0, 0, COINSSPRITE.height, COINSSPRITE.height);

CTX.fillStyle = "red";
CTX.fillRect(0, 0, CVS.height, CVS.width);
