var socket = io();
var counterX = 0;
var counterO = 0;
var counterDraw = 0;
var ThisCell, CellHeight;
var arr1 = new Array(10);
for (var i=0; i<10;i++){   // cоздание двумерного массива
	arr1[i] = []; 
	for (var j=0; j<10;j++){
		arr1[i][j] = 0;
	}
};
var stat = document.getElementById('stat');
var canvas = document.getElementById('canvas');
var CWidth = window.innerWidth;
var CHeight = window.innerHeight;
var X;
function init(value){

	stat.style.width = CWidth + 'px'
	stat.style.height = CHeight * 0.04 + 'px';
	canvas.style.width = CWidth  + 'px';
	canvas.style.height = CHeight * 0.96 + 'px';
	for (var i=0; i < 100; i++){
		divCell = document.createElement('div');
		divCell.className = "cell";
		divCell.id = i +"";
		divCell.setAttribute("onClick", "ClickDone(this.id); TakeElement(this.id); ");
		divCell.style.width = CWidth / 10 - 20 + 'px';
		divCell.style.height = CHeight * 0.1 - 22 + 'px';
		canvas.appendChild(divCell);
	}
	if (value == "X"){X = true}
	else {X = false; EnemyTurn()}
}


function ClickDone(id){
	socket.emit('clickdone', X, id);
	EnemyTurn();
}
function EnemyTurn(){
	ShowErrore("Ход противника <br>", "Ожидайте...")
}

function TakeElement(id, val){ 
	ThisCell = document.getElementById(id);
	//CellHeight = ThisCell.style.height;
	if(X && typeof(val) == "undefined" ||  val == "X"){	
		WriteElement("X", id);
	}
	else if(!X && typeof(val) == "undefined" ||  val == "O"){
		WriteElement("O", id);
	}	
};
function WriteElement (value, id){
	if (!ThisCell.firstElementChild){
		ThisCell.innerHTML = "<div class='Value'>" + value + "</div>";
		Value = ThisCell.firstElementChild;
		Value.style.lineHeight = ThisCell.style.height;
		Value.style.fontSize = parseInt(ThisCell.style.height, 10) - 30 + 'px';
		arr1[Math.floor(id/10)][id%10] = value;
		isitend(value, id) // отправляем на проверку.
		//console.log(isitend);
	}
    // if (typeof(isitend(value, id)) != "undefined") { 
    // 	reset(isitend()); 
    // 	deleteElement(ErroreWindow);
    // };
}

function isitend(value, id){
	winner = 0;
	row = Math.floor(id/10);
	cell = id%10;
	console.log(row,cell)

	console.time();
	
		//горизонталь
	if (arr1[row][cell - 1] == value || 
		arr1[row][cell + 1] == value){ // элемент Л или П.
		i = 1;
		while (arr1[row][cell - i] != value){
			winner += 1;
			i++;
			 if (typeof(arr1[row]) == "undefined") {
			 	break;
			 }
		}
		while (arr1[row][cell + i] != value){
			winner += 1;
			i++;
			// if (typeof(arr1[row]) == "undefined") {
			// 	break;
			// }
		}
		if (winner >= 5) {winner = 0; return value}
	}
	  
	//вертикаль
	if (arr1[row - 1][cell] == value ||
		arr1[row + 1][cell] == value){// элемент В или Н.
		i = 1;
		while (arr1[row - i][cell] != value){
			winner += 1;
			i++;
			if (typeof(arr1[row - i]) == "undefined") {
				break;
			}
		}
		while (arr1[row + i][cell] != value){
			winner += 1;
			i++;
			if (typeof(arr1[row + i]) == "undefined") {
				break;
			}
		}
		if (winner >= 5) {winner = 0; return value}
	}


	if (arr1[row - 1][cell - 1] == value ||
		arr1[row + 1][cell + 1] == value){// элемент ЛВ или ПН.
		i = 1;
		while (arr1[row - i][cell - i] != value){
			winner += 1;
			i++;
			if (typeof(arr1[row - i]) == "undefined") {
				break;
			}
		}
		while (arr1[row + i][cell + i] != value){
			winner += 1;
			i++;
			if (typeof(arr1[row + i]) == "undefined") {
				break;
			}
		}
		if (winner >= 5) {winner = 0; return value}
	}



	if (arr1[row - 1][cell + 1] == value ||
		arr1[row + 1][cell - 1] == value){// элемент ПВ или ЛН
		i = 1;
		while (arr1[row - i][cell + i] != value){
			winner += 1;
			i++;
			if (typeof(arr1[row - i]) == "undefined") {
				break;
			}
		}
		while (arr1[row + i][cell - i] != value){
			winner += 1;
			i++;
			if (typeof(arr1[row + i]) == "undefined") {
				break;
			}
		}
		if (winner >= 5) {winner = 0; return value}
	}
	console.timeEnd();





	// if (arr[0]=='X' && arr[1]=='X' && arr[2]=='X' || 
	//     arr[3]=='X' && arr[4]=='X' && arr[5]=='X' ||
	//     arr[6]=='X' && arr[7]=='X' && arr[8]=='X' ||
	//     arr[0]=='X' && arr[3]=='X' && arr[6]=='X' ||
	//     arr[1]=='X' && arr[4]=='X' && arr[7]=='X' ||
	//     arr[2]=='X' && arr[5]=='X' && arr[8]=='X' ||
	//     arr[0]=='X' && arr[4]=='X' && arr[8]=='X' ||
	//     arr[2]=='X' && arr[4]=='X' && arr[6]=='X') return 'X';
	// if (arr[0]=='O' && arr[1]=='O' && arr[2]=='O' ||
	//     arr[3]=='O' && arr[4]=='O' && arr[5]=='O' ||
	//     arr[6]=='O' && arr[7]=='O' && arr[8]=='O' ||
	//     arr[0]=='O' && arr[3]=='O' && arr[6]=='O' ||
	//     arr[1]=='O' && arr[4]=='O' && arr[7]=='O' ||
	//     arr[2]=='O' && arr[5]=='O' && arr[8]=='O' ||
	//     arr[0]=='O' && arr[4]=='O' && arr[8]=='O' ||
	//     arr[2]=='O' && arr[4]=='O' && arr[6]=='O') return 'O';
	// if (arr[0] && arr[1] && arr[2] && arr[3] && arr[4] && arr[5] && arr[6] && arr[7] && arr[8]) return 'draw';   	 
}

function reset(value){
  var Cell = document.getElementsByClassName('cell');
  	setTimeout(function(){
	  	for (var i = 0; i < 9; i++){
	  	  if(Cell[i].hasChildNodes()){
	           Cell[i].removeChild(Cell[i].childNodes[0]);
	  	  }	
	    }
	    arr = []; 
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

function ShowErrore(first, second){
    ErroreWindow = document.createElement('div');
	ErroreWindow.className = "ErroreWindow";
	ErroreText = document.createElement('div');
	ErroreText.className = "ErroreText";
	ErroreText.innerHTML = first + second;
	ErroreWindow.appendChild(ErroreText);
    document.body.appendChild(ErroreWindow);
}
function deleteElement(Element){
   		document.body.removeChild(Element)
};

socket.on('first user', function(){
	ShowErrore("Игра ещё не началась <br>", "Ждём подключения другого игрока");
});
socket.on('second user', function(val){
	reset();
	deleteElement(ErroreWindow);
	ShowErrore("Второй пользователь присоединился. <br>", "Вы будете играть Х");
	setTimeout(function(){ 
		deleteElement(ErroreWindow);
		init(val);
	},3000);
});
socket.on('gamestart', function(val){
	reset();
	ShowErrore("Игра начинается <br>", "Вы будете играть О");
	setTimeout(function(){ 
		deleteElement(ErroreWindow); 
		init(val);
	},3000);
});
socket.on('enemyclick', function(value, id){
	console.log(value, id);
	TakeElement(id, value);
	deleteElement(ErroreWindow);
})
