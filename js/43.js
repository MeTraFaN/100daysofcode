var counterX = 0;
var counterO = 0;
var counterDraw = 0;
var ThisCell, CellHeight;
var arr = new Array(9);
var stat = document.getElementById('stat');
var canvas = document.getElementById('canvas');
CWidth = window.innerWidth;
CHeight = window.innerHeight;
stat.style.width = CWidth + 'px'
stat.style.height = CHeight * 0.04 + 'px';
canvas.style.width = CWidth  + 'px';
canvas.style.height = CHeight * 0.96 + 'px';
for (var i=0; i < 9; i++){
	divCell = document.createElement('div');
	divCell.className = "cell";
	divCell.id = i +"";
	divCell.setAttribute("onClick", "TakeElement(this.id)");
	divCell.setAttribute("ontouchend", "TakeElement(this.id)");
	divCell.style.width = CWidth / 3 - 35 + 'px';
	divCell.style.height = CHeight * 0.32 - 35 + 'px';
	canvas.appendChild(divCell);
}
var X = true;
function TakeElement(val){
	ThisCell = document.getElementById(val);
	CellHeight = ThisCell.style.height;
	if(X){	
		WriteElement("X",false, val);
	}
	else if(!X){
		WriteElement("O",true, val);
	}	
};
function WriteElement (first, second, id){
	if (!ThisCell.firstElementChild){
		ThisCell.innerHTML = "<div class='Value'>" + first + "</div>";
		Value = ThisCell.firstElementChild;
		Value.style.lineHeight = CellHeight;
		Value.style.fontSize = parseInt(CellHeight, 10) - 30 + 'px';
		X = second;
		arr[id] = first;
	}
        if (typeof(isitend()) != "undefined") { reset(isitend())};
}
function isitend(id){
	if (arr[0]=='X' && arr[1]=='X' && arr[2]=='X' || 
	    arr[3]=='X' && arr[4]=='X' && arr[5]=='X' ||
	    arr[6]=='X' && arr[7]=='X' && arr[8]=='X' ||
	    arr[0]=='X' && arr[3]=='X' && arr[6]=='X' ||
	    arr[1]=='X' && arr[4]=='X' && arr[7]=='X' ||
	    arr[2]=='X' && arr[5]=='X' && arr[8]=='X' ||
	    arr[0]=='X' && arr[4]=='X' && arr[8]=='X' ||
	    arr[2]=='X' && arr[4]=='X' && arr[6]=='X') return 'X';
	if (arr[0]=='O' && arr[1]=='O' && arr[2]=='O' ||
	    arr[3]=='O' && arr[4]=='O' && arr[5]=='O' ||
	    arr[6]=='O' && arr[7]=='O' && arr[8]=='O' ||
	    arr[0]=='O' && arr[3]=='O' && arr[6]=='O' ||
	    arr[1]=='O' && arr[4]=='O' && arr[7]=='O' ||
	    arr[2]=='O' && arr[5]=='O' && arr[8]=='O' ||
	    arr[0]=='O' && arr[4]=='O' && arr[8]=='O' ||
	    arr[2]=='O' && arr[4]=='O' && arr[6]=='O') return 'O';
	if (arr[0] && arr[1] && arr[2] && arr[3] && arr[4] && arr[5] && arr[6] && arr[7] && arr[8]) return 'draw';   	 
}

function reset(value){
  var date = new Date();
  var Cell = document.getElementsByClassName('cell');
  setTimeout(function(){
  	X = true;
    arr = []; 
    for (var i = 0; i < 9; i++){
    	if(Cell[i].hasChildNodes()){
    		Cell[i].removeChild(Cell[i].childNodes[0]);
    	}	
    }
    if(value == 'draw'){
		counterDraw += 1;
		stat.childNodes[5].innerHTML = "Игр с ничьёй: " + counterDraw;
	} 
	else if(value == "X"){
		counterX += 1;
		stat.childNodes[1].innerHTML = "Побед Х: " + counterX;
	}
	else {
		counterO += 1;
		stat.childNodes[3].innerHTML = "Побед O: " + counterO;
	}	
  }, 500);
}
