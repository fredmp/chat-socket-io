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

socket.on('newLocation', function (data) {
  console.log('A new location has come', data);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My location</a>');
  a.attr('href', data.url);
  li.text(data.from + ': ');
  li.append(a);
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

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      socket.emit('createLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function () {
      alert('Unable to fetch location');
    }
  )
});
