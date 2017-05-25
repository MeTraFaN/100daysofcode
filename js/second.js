var canvas = document.getElementById('canvas');
CWidth = window.innerWidth;
CHeight = window.innerHeight;
canvas.style.width = CWidth  + 'px';
canvas.style.height = CHeight + 'px';
console.log(CWidth);
for (var i=0; i < 9; i++){
	divCell = document.createElement('div');
	divCell.className = "cell cell" + i +"";
	divCell.style.width = CWidth / 3 - 35 + 'px';
	divCell.style.height = CHeight / 3 - 35 + 'px';
	canvas.appendChild(divCell);
}
