const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const users = {};

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
  console.log('A user is connected');
  socket.on('chat message', (message) => {
    io.emit('chat message', message);
  });
  socket.on('sign-in', (user) => {
    users[socket.id] = user;
    io.emit('sign-in', users);
  });
  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log('User disconnected');
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
