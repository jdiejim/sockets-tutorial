const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
});

const users = [];

io.on('connection', (socket) => {
  console.log('A user is connected');
  socket.broadcast.emit('usersConnected', { count: io.engine.clientsCount, users });

  socket.on('nickname', user => {    
    users.push(user);
    io.emit('usersConnected', { count: io.engine.clientsCount, users });
  })

  socket.on('user typing', bool => {
    io.emit('user typing', bool);
  });
  
  socket.on('chat message', (message) => {
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    io.emit('userDisconnected', { count: io.engine.clientsCount, users });
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
