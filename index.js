var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/in', function(req, res){
  res.sendFile(__dirname + '/in.html');
});

app.get('/out', function(req, res){
  res.sendFile(__dirname + '/out.html');
});

app.get('/day21', function(req, res){
  res.sendFile(__dirname + '/days/day21.html');
});

io.sockets.on('connection', function (socket) {
  var name = 'U' + (socket.id).toString().substr(1,4);
  socket.emit('user connected', name);
  socket.on('button clicked', function(value){
    io.emit('button clicked', name, value);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
