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
app.get('/day23', function(req, res){
  res.sendFile(__dirname + '/days/day23.html');
});
app.get('/day23-controler', function(req, res){
  res.sendFile(__dirname + '/days/day23-controler.html');
});
app.get('/day24', function(req, res){
  res.sendFile(__dirname + '/days/day24.html');
});
app.get('/day25', function(req, res){
  res.sendFile(__dirname + '/days/day25.html');
});
app.get('/day26', function(req, res){
  res.sendFile(__dirname + '/days/day26.html');
});
app.get('/main.css', function(req, res){
  res.sendFile(__dirname + '/public/stylesheets/main.css');
});

var users = {};
var users26 = {};
io.on('connection', function(client) {
  client.emit('users base', users);
  client.emit('user connected', client.id);
  client.on('user done26', function(style){
    users26[client.id] = {
      color: style[background-color],
      size: style[width],
      x: style[left],
      y: style[top]
    }
   client.broadcast.emit('user done26', style[left], style[top], style[background-color], style[width])
  });
  client.on('user done', function(coordx, coordy, ID, color, size){
    users[client.id] = {
      x: coordx,
      y: coordy,
      Id: ID,
      color: color,
      size: size
    }
    io.sockets.emit('user done', coordx, coordy, ID, color, size)
    client.broadcast.emit('user done24', coordx, coordy, ID, color, size)
  });
  client.on('move done', function(obj, ID){
    client.broadcast.emit('sprite change coord25', obj, users[ID].color, users[ID].size);
    client.broadcast.emit('sprite change coord',  ID,  obj);
    client.emit('move done', ID, obj);
    users[client.id].x =  obj.x;
    users[client.id].y =  obj.y;
  });
  client.on('disconnect', function(){
    client.broadcast.emit('user disconnected', client.id);
    delete users[client.id];
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
