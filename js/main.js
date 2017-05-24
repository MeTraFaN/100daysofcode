var canvas, LeftScore, RightScore, FPlayer, SPlayer;
var leftcounter = 0;
var rightcounter = 0;
var BName;
var delta = [ 0, 0 ];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

var themes = [ [ "#10222B", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0" ],
		[ "#362C2A", "#732420", "#BF734C", "#FAD9A0", "#736859" ],
		[ "#0D1114", "#102C2E", "#695F4C", "#EBBC5E", "#FFFBB8" ],
		[ "#2E2F38", "#FFD63E", "#FFB54B", "#E88638", "#8A221C" ],
		[ "#121212", "#E6F2DA", "#C9F24B", "#4D7B85", "#23383D" ],
		[ "#343F40", "#736751", "#F2D7B6", "#BFAC95", "#8C3F3F" ],
		[ "#000000", "#2D2B2A", "#561812", "#B81111", "#FFFFFF" ],
		[ "#333B3A", "#B4BD51", "#543B38", "#61594D", "#B8925A" ] ];
var theme;

var worldAABB, world, iterations = 1, timeStep = 1 / 15;

var walls = [];
var wall_thickness = 200;
var wallsSetted = false;

var bodies = [];
var elements = []; 
var ball = [];
var BallArr = [];
var  text, MainBall;


var createMode = false;
var destroyMode = false;

var isMouseDown = false;
var mouseJoint;
var mouse = { x: 0, y: 0 };
var gravity = { x: 0, y: 1 };

var PI2 = Math.PI * 2;

var timeOfLastTouch = 0;
var LeftSide, RightSide;
var socket = io();
//окно приветствия
      var create = document.getElementById('create');
      var join = document.getElementById('join');
      //
      var parent = document.getElementById('parent');
      var InputDiv;
      var SubmitDiv;
      var color;
      var size;
      create.addEventListener("mousedown", function(){
        ChangeParent("create")
      });
      join.addEventListener("mousedown", function(){
        ChangeParent("join")
      });
      function ChangeParent(value){
        var RoomInput = document.createElement('input');
  RoomInput.placeholder = "Enter room number";
        var SubmitButton = document.createElement('button');
  if (value == "create") {
          create.setAttribute("disabled",true);
          join.removeAttribute('disabled',true); 
    RoomInput.id = "InputCreate";
    SubmitButton.id = "SubmitCreate";
          SubmitButton.innerText = "Создать";
          SubmitButton.addEventListener("mousedown", function(evt){
             if (RoomInput.value == "")
          ShowErrore("Введите название доски","");
             else 
             socket.emit("board create37", RoomInput.value);
    });
  }
        else {
          create.removeAttribute("disabled",true);
          join.setAttribute("disabled",true);
    RoomInput.id = "InputJoin";
    SubmitButton.id = "SubmitJoin";
          SubmitButton.innerText = "Присоединиться";
          SubmitButton.addEventListener("mousedown", function(evt){
             if (RoomInput.value == "")
          ShowErrore("Введите название доски","");
             else 
    socket.emit("board join37", RoomInput.value);
    });
  }
        RoomInput.style.width = "115px";
  SubmitButton.style.width = "119px";     
        if (InputDiv != null){
          parent.removeChild(InputDiv);
          parent.removeChild(SubmitDiv);
  }
        InputDiv = document.createElement('div');
        InputDiv.className = "inputdiv navigate";
        SubmitDiv = document.createElement('div');
  SubmitDiv.className = "submitdiv navigate";
        
  		InputDiv.appendChild(RoomInput);
        SubmitDiv.appendChild(SubmitButton);
  		parent.appendChild(InputDiv);
        parent.appendChild(SubmitDiv);
      };

socket.on('user connected37', function(UserId, boardname, board37, PlayerNumb){
	BName = boardname;
	var RoomName = document.createElement('div');
	RoomName.className = "RoomName";
	RoomName.innerHTML = BName;
	DialogWindow = document.getElementsByClassName('DialogWindow')[0];
    if( typeof DialogWindow != 'undefined'){
      document.body.removeChild(DialogWindow);
    }
    init();
    MainBall = document.getElementById('ball');
	play();
 	canvas.appendChild(RoomName);
    canvas.style.visibility = "visible";
    createInstructions(PlayerNumb, UserId, boardname);
    socket.emit('user done37', bodies[0].m_position.x, bodies[0].m_position.y, boardname);
});
	
socket.on('user done37', function(PlayerNumb, UserId, boardname){
	createInstructions(PlayerNumb, UserId, boardname);
});

socket.on('users base37', function(UserId, boardname){
	createInstructions("FPlayer", UserId, boardname);      
});

socket.on('user disconnected37', function(UserId, boardname){
  console.log(boardname);
  canvas.removeChild(document.getElementById(UserId));
  socket.emit('final score', LeftScore.innerHTML, RightScore.innerHTML, boardname);
  LeftScore.innerHTML = "0";
  RightScore.innerHTML = "0"; 
  ball[0].m_position.x = stage[2] * 0.5;
  ball[0].m_position.y = stage[3] * 0.1;
  MainBall.style.left = stage[2] * 0.5 + 'px';
  MainBall.style.top = stage[3] * 0.1 + 'px';
  walls[5] = createBox(world, stage[2] / 2, stage[3] * 0.25, 20, 20);
});

/*socket.on('user change coord37', function(x,y, ID){
  MoovedObject = document.getElementById(ID);
  bodies[0].m_position.x = x;
  bodies[0].m_position.y = y;
  MoovedObject.style.left = x - 60+ 'px';
  MoovedObject.style.top = y -60 + 'px';
});*/



function init() {

	canvas = document.getElementById('canvas');
	LeftScore = document.getElementById('left');
	RightScore = document.getElementById('right');


	document.onmousedown = onDocumentMouseDown;
	document.onmouseup = onDocumentMouseUp;
	document.onmousemove = onDocumentMouseMove;
	//document.ondblclick = onDocumentDoubleClick;

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );

	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	// init box2d

	worldAABB = new b2AABB();
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( window.innerWidth + 200, window.innerHeight + 200 );

	world = new b2World( worldAABB, new b2Vec2( 0, 0 ), true );

	setWalls();
    createWall();
    createBall();
	reset();



}


function play() {

	setInterval( loop, 1000 / 40 );
}

function reset() {

	var i;


	//if ( ball.length != 0 ) {
		//console.log[ball];
	//	canvas.removeChild( ball[0].GetUserData().element );
		//world.DestroyBody( ball[0] );
	//}

	// color theme
	theme = themes[ Math.random() * themes.length >> 0 ];
	document.body.style[ 'backgroundColor' ] = theme[ 0 ];



}

socket.on('board errore', function(boardname, massage){
   ShowErrore(boardname, massage);
 }); 

function ShowErrore(first, second){
        ErroreWindow = document.createElement('div');
  ErroreWindow.className = "ErroreWindow";
  ErroreWindow.innerHTML = first + second;
        document.body.appendChild(ErroreWindow);
  deleteElement(ErroreWindow);
}
function deleteElement(Element){
  setTimeout(function(){ document.body.removeChild(Element)},5000);
};

//

function onDocumentMouseDown() {

	isMouseDown = true;
	return false;
}

function onDocumentMouseUp() {

	isMouseDown = false;
	return false;
}

function onDocumentMouseMove( event ) {

	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

function onDocumentDoubleClick() {

	reset();
}

function onDocumentTouchStart( event ) {

	if( event.touches.length == 1 ) {

		event.preventDefault();

		// Faking double click for touch devices

		var now = new Date().getTime();

		if ( now - timeOfLastTouch  < 250 ) {

			reset();
			return;
		}

		timeOfLastTouch = now;

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;

	}

}

function onDocumentTouchEnd( event ) {

	if ( event.touches.length == 0 ) {

		event.preventDefault();
		isMouseDown = false;

	}

}

function onWindowDeviceOrientation( event ) {

	if ( event.beta ) {

		gravity.x = Math.sin( event.gamma * Math.PI / 180 );
		gravity.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 );

	}

}

//
function createWall() {
	var element = document.createElement( 'div' );
	element.style.width = 20 + 'px';
	element.style.height = stage[3]/2 + 200 + 'px';	
	element.style.position = 'absolute';
	element.style.left = stage[2] / 2 - 10 + 'px';
	element.style.top = stage[3] / 2 + 13 + 'px';
	element.style.cursor = "default";
	element.style.backgroundColor = "#fff";
	element.style.borderRadius = "10px";
	canvas.appendChild(element);
}

function createInstructions(value, Id, boardname) {

	var size = 120;

	window[value] = document.createElement( 'div' );
	window[value].width = size;
	window[value].height = size;	
	window[value].style.position = 'absolute';
	window[value].style.left = -200 + 'px';
	window[value].style.top = -200 + 'px';
	window[value].style.cursor = "default";
	window[value].id= Id;

	console.log(canvas);
	canvas.appendChild(window[value]);
	elements.push( window[value] );

	var circle = document.createElement( 'canvas' );
	circle.width = size;
	circle.height = size;

	var graphics = circle.getContext( '2d' );

	graphics.fillStyle = theme[ 3 ];
	graphics.beginPath();
	graphics.arc( size * .5, size * .5, size * .5, 0, PI2, true );
	graphics.closePath();
	graphics.fill();

	window[value].appendChild( circle );


	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = size / 2;
	circle.density = 1;
	circle.friction = 0;
	circle.restitution = 0.3;
	b2body.AddShape(circle);
	b2body.userData = {element: window[value]};
	if (value == "FPlayer") {b2body.position.Set( stage[2] * 0.25, stage[3] - 150);}
	else if (value == "SPlayer"){ b2body.position.Set( stage[2] * 0.75, stage[3] - 150);}

	bodies.push( world.CreateBody(b2body) );	

}

function createBall() {

	var size = 80;

	var element = document.createElement("canvas");
	element.width = size;
	element.height = size;
	element.style.position = 'absolute';
	element.style.left = stage[2] / 2  + 'px';
	element.style.top = stage[3] / 2 - 100 + 'px';	
	element.id = "ball";

	var graphics = element.getContext("2d");
		var img = new Image();
    	img.src = 'http://savepic.ru/14042820.png';
    	img.onload = function() {    
        graphics.drawImage(img, 0, 0, 80, 80);  
      }
		graphics.fillStyle = "#3f3f3f";
		graphics.beginPath();
		graphics.arc(size * .5, size * .5, size * .5, 0, PI2, true); 
		graphics.closePath();
		graphics.fill();

	canvas.appendChild(element);

	
	BallArr.push( element );

	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = size >> 1;
	circle.density = 1;
	circle.friction = 0;
	circle.restitution = 0.45;
	b2body.AddShape(circle);
	b2body.userData = {element: element};

	b2body.position.Set( stage[2] / 2 , stage[3] * 0.1 );
	//b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
	ball.push( world.CreateBody(b2body) );
}

//

function loop() {	

		if(parseInt(MainBall.style.top,10) > stage[3]-85 ){
			if(parseInt(MainBall.style.left,10) < stage[2]/2){
				LeftSide = false;
				RightSide = true;
				Score('rigth');
				ball[0].m_position0.x = stage[2] * 0.7 ;
				ball[0].m_position.x = stage[2] * 0.7 ;
				ball[0].m_position0.y = stage[3] / 2 - 100;
				ball[0].m_position.y = stage[3] / 2 - 100;
				MainBall.style.left = stage[2] * 0.7 + 'px';
				MainBall.style.top = stage[3] / 2 - 100 + 'px';				
				if (walls[7]) {
					walls[7] = createBox(world, stage[2] * 0.7, stage[3] / 2 - 15, 20, 20);
				}
			}
			else {
				LeftSide = true;
				RightSide = false;
				Score('left');
				ball[0].m_position0.x = stage[2] * 0.3 ;
				ball[0].m_position.x = stage[2] * 0.3 ;
				ball[0].m_position0.y = stage[3] / 2 - 100;
				ball[0].m_position.y = stage[3] / 2 - 100;
				MainBall.style.left = stage[2] * 0.3 + 'px';
				MainBall.style.top = stage[3] / 2 - 100 + 'px';
				if (walls[6]) {
					walls[6] = createBox(world, stage[2] * 0.3, stage[3] / 2 - 15, 20, 20);
				}
			
						
			}
			ball[0].m_linearVelocity.x = 0;
			ball[0].m_linearVelocity.y = 0;					
		}

	if (getBrowserDimensions()) {

		setWalls();

	}

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = gravity.x * 350 + delta[0];
	world.m_gravity.y = gravity.y * 350 + delta[1];

	mouseDrag();
	world.Step(timeStep, iterations);
	//socket.emit("move done37", bodies[0].m_position.x, bodies[0].m_position.y, BName);
	for (i = 0; i < bodies.length; i++) {

		var body = bodies[i];
		var element = elements[i];

		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';

	}
	MainBall.style.left = (ball[0].m_position0.x - (BallArr[0].width >> 1)) + 'px';
	MainBall.style.top = (ball[0].m_position0.y - (BallArr[0].height >> 1)) + 'px';

}
	
function Score(value){
	if( value == 'left'){
		leftcounter += 1;
		LeftScore.innerHTML = leftcounter;
	}
	else {
		rightcounter += 1;
		RightScore.innerHTML = rightcounter;
	}

}
// .. BOX2D UTILS

function createBox(world, x, y, width, height, fixed) {

	if (typeof(fixed) == 'undefined') {

		fixed = true;

	}

	var boxSd = new b2BoxDef();

	if (!fixed) {

		boxSd.density = 1.0;

	}

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);

}

function mouseDrag()
{
	// mouse press
    if (isMouseDown && !mouseJoint) {    	

		var body = getBodyAtMouse();

		if (body) {

			world.DestroyBody(walls[5]);
			world.DestroyBody(walls[6]);
			world.DestroyBody(walls[7]);
			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouse.x, mouse.y);
			md.maxForce = 30000 * body.m_mass;
			// md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();

		} else {

			createMode = true;

		}

	}

	// mouse release
	if (!isMouseDown) {

		createMode = false;
		destroyMode = false;

		if (mouseJoint) {

			world.DestroyJoint(mouseJoint);
			mouseJoint = null;

		}

	}

	// mouse move
	if (mouseJoint) {
		var p2 = new b2Vec2(mouse.x, mouse.y);
		mouseJoint.SetTarget(p2);
	}
}

function getBodyAtMouse() {

	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {

		if (shapes[i].m_body.IsStatic() == false) {

			if ( shapes[i].TestPoint(mousePVec) ) {

				body = shapes[i].m_body;
				break;

			}

		}

	}

	return body;

}

function setWalls() {

	if (wallsSetted) {

		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);
		world.DestroyBody(walls[4]);


		walls[0] = null; 
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
		walls[4] = null;
		walls[5] = null;
		walls[6] = null;
		walls[7] = null;
	}

	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[4] = createBox(world, stage[2] / 2, stage[3] * 0.85, 10, stage[3] / 3);
	walls[5] = createBox(world, stage[2] / 2, stage[3] * 0.25, 20, 20);
	walls[6] = createBox(world, stage[2] * 0.3, stage[3] / 2 - 15, 20, 20);
	walls[7] = createBox(world, stage[2] * 0.7, stage[3] / 2 - 15, 20, 20);	

	wallsSetted = true;

}

// BROWSER DIMENSIONS

function getBrowserDimensions() {

	var changed = false;

	if (stage[0] != window.screenX) {

		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;

	}

	if (stage[1] != window.screenY) {

		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;

	}

	if (stage[2] != window.innerWidth) {

		stage[2] = window.innerWidth;
		changed = true;

	}

	if (stage[3] != window.innerHeight) {

		stage[3] = window.innerHeight;
		changed = true;

	}

	return changed;

}
