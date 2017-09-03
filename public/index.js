$(function () {
   const socket = io();
   let user = '';

   $('.sign-in-btn').on('click',function (e) {
     e.preventDefault();
     user = $('.sign-in-input').val();
     socket.emit('sign-in', user);
     $(this).parent().parent().addClass('logged');
     return false;
   })

   $('form').submit(function (e) {
     e.preventDefault();
     socket.emit('chat message', {
       user,
       message: $('#m').val()
     });
     $('#m').val('');
     return false;
   });

   socket.on('chat message', (message) => {
     $('#messages').append(`
       <li>
         <h4>${message.user}:</h4>
         <p>${message.message}</p>
       </li>
     `);
   })

   socket.on('sign-in', (users) => {
     const keys = Object.keys(users);
     $('.users').html('');
     for (let i = 0; i < keys.length; i++) {
       $('.users').append($('<li>').text(users[keys[i]]));
     }
   })
  });
