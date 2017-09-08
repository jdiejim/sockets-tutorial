$(function () {
   const socket = io();
   let user = `Anonymous${Math.floor(Math.random()* 1000)}`;
   let signedIn = false;

   $('#nickname-btn').on('click', function() {
     socket.emit('nickname', $('#nickname').val())
     signedIn = true;
     user = $('#nickname').val();
     run();
   })
    
   function run() {
     socket.on('usersConnected', ({ count, users }) => {
       $('#user-count').text(`Connected Users: ${count}`);
       users.forEach(e => {
       $('.users').append(`<li>${e}</li>`)
       });
       $('#messages').append(`<li><p class="special-msg">User Connected</p></li>`);
     });
   
     socket.on('userDisconnected', ({ count, users }) => {
       $('#user-count').text(`Connected Users: ${count}`);
       users.forEach(e => {
       $('.users').append(`<li>${e}</li>`)
       });
       $('#messages').append(`<li><p class="disconnect-msg">User Disconnected</p></li>`);
     })

     $('#message-input').on('keyup', function() {
        if ($(this).val() !== '') {
          socket.emit('user typing', true);
        } else {
          socket.emit('user typing', false);
        }
     });

     socket.on('user typing', (bool) => {
       if (bool) {
         $('#typing').text('Someon is typing')
        } else {
          $('#typing').text('')
       }
     })
   
     $('form').submit(function (e) {
       e.preventDefault();
       socket.emit('chat message', $('#message-input').val());
       $('#message-input').val('');
       return false;
     });
   
     socket.on('chat message', (message) => {
       $('#messages').append(`<li><p><span>${user}: </span>${message}</p></li>`);
     });
   }
  });
