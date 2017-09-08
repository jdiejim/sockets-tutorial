const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
});

const users = {};

io.on('connection', (socket) => {
  console.log('A user is connected');
  // socket.broadcast.emit('usersConnected', { count: io.engine.clientsCount, users });

  socket.on('user typing', ({ bool, user }) => {
    io.emit('user typing', { bool, user });
  });
  
  socket.on('chat message', ({ message, user }) => {
    io.emit('chat message', { message, user });
  });

  socket.on('usersConnected', user => {
    if (!users[socket.id]) {
      users[socket.id] = user;
      io.emit('usersConnected', { count: io.engine.clientsCount, user, users });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    let user = users[socket.id];
    delete users[socket.id];
    io.emit('userDisconnected', { count: io.engine.clientsCount, user, users });
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
