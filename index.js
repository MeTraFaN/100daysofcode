var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/days/day22.html');
});
app.get('/day22-controler', function(req, res){
  res.sendFile(__dirname + '/days/day22-controler.html');
});


var users = {};
io.on('connection', function(client) {
  client.emit('users base', users);
  client.emit('user connected', client.id);
  client.on('user done', function(coordx, coordy){
    users[client.id] = {
      x: coordx,
      y: coordy
    }
    client.broadcast.emit('user done', coordx, coordy, client.id)
  });
  client.on('move done', function(obj){
    client.broadcast.emit('sprite change coord', client.id, obj.x, obj.y);
    client.emit('move done', client.id, obj.x, obj.y);
    users[client.id].x = +users[client.id].x + obj.x;
    users[client.id].y = +users[client.id].y + obj.y;
  });
  client.on('disconnect', function(){
    client.broadcast.emit('user disconnected', client.id);
    delete users[client.id];
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
