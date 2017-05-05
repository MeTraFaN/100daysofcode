var socket = io();
stage = new createjs.Stage("canvas");
canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
  var data = {
  	images: ["http://savepic.ru/13767000.png"],
    frames: {width: 120, height: 120, count: 24}
	};
var spriteSheet = new createjs.SpriteSheet(data);
var sprite = new createjs.Sprite(spriteSheet, 1);
stage.addChild(sprite);
  sprite.x = canvas.width/2 -60
  sprite.y = canvas.height/2 -60
  createjs.Ticker.addEventListener("tick", onTickHandler);
  
function onTickHandler(evt) {   
  stage.update();
};


window.addEventListener('resize', onResize, false);
  onResize();

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

function onMouseClick(val) {
  socket.emit('button clicked', val);
};

socket.on('button clicked', function(value){
  ChangeSpritePosition(value);	
});

function ChangeSpritePosition(val){
  sprite.x += val; 
};
