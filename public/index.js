$(function () {
   const socket = io();
   let user = `Anonymous${Math.floor(Math.random()* 1000)}`;
   let isConnected = false;

   $('#nickname').on('keyup', function() {
    user = $(this).val();
   })
    
    socket.on('usersConnected', ({ count, user: usr, users }) => {
      $('.users').html('');
      $('#user-count').text(`Connected Users: ${count}`);
      Object.values(users).forEach(e => {
      $('.users').append(`<li>${e}</li>`)
      });
      if (usr !== user) {
        $('#messages').append(`<li><p class="special-msg">${usr} Connected</p></li>`);
      }
    });

    socket.on('userDisconnected', ({ count, user, users }) => {
      $('.users').html('');
      $('#user-count').text(`Connected Users: ${count}`);
      Object.values(users).forEach(e => {
      $('.users').append(`<li>${e}</li>`)
      });
      $('#messages').append(`<li><p class="disconnect-msg">${user} Disconnected</p></li>`);
    })

    $('#message-input').on('keyup', function() {
      if ($(this).val() !== '') {
        socket.emit('user typing', { bool: true, user});
      } else {
        socket.emit('user typing', { bool: false, user});
      }
    });

    socket.on('user typing', ({ bool, user: usr }) => {
      if (bool && usr !== user) {
        $('#typing').text(`${usr} is typing...`)
      } else {
        $('#typing').text('')
      }
    })

    $('form').submit(function (e) {
      e.preventDefault();
      socket.emit('usersConnected', user);
      socket.emit('chat message', { message: $('#message-input').val(), user });
      socket.emit('user typing', { bool: false, user});
      $('#message-input').val('');
      return false;
    });

    socket.on('chat message', ({ message, user }) => {
      $('#messages').append(`<li><p><span>${user}: </span>${message}</p></li>`);
    });

  });
