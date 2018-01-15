var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (data) {
  console.log('A new message has come', data);
  var li = jQuery('<li></li>');
  li.text(data.from + ': ' + data.text);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'Client',
    text: jQuery('[name=message]').val()
  }, function (data) {
    console.log(data);
  });
});
