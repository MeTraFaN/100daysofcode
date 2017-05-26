var ThisCell, CellHeight;
var canvas = document.getElementById('canvas');
CWidth = window.innerWidth;
CHeight = window.innerHeight;
canvas.style.width = CWidth  + 'px';
canvas.style.height = CHeight + 'px';
for (var i=0; i < 9; i++){
	divCell = document.createElement('div');
	divCell.className = "cell";
	divCell.id = "cell" + i +"";
	divCell.setAttribute("onClick", "TakeElement(this.id)");
	divCell.style.width = CWidth / 3 - 35 + 'px';
	divCell.style.height = CHeight / 3 - 35 + 'px';
	canvas.appendChild(divCell);
}
var Cells = document.getElementsByClassName('cell');
var X = true;

function TakeElement(val){
	ThisCell = document.getElementById(val);
	CellHeight = ThisCell.style.height;
	if(X){	console.log(X);
		WriteElement("X",false);
	}
	else if(!X){
		WriteElement("0",true);
	}
};
function WriteElement (first, second){
	ThisCell.innerHTML = "<div class='Value'>" + first + "</div>";
	Value = ThisCell.firstElementChild;
	Value.style.lineHeight = CellHeight;
	Value.style.fontSize = parseInt(CellHeight, 10) - 30 + 'px';
	X = second;
	return 0;
}
