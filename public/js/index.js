var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (data) {
  var createdAt = moment(data.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(data.from + ' [' + createdAt + ']' + ': ' + data.text);
  jQuery('#messages').append(li);
});

socket.on('newLocation', function (data) {
  var createdAt = moment(data.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My location</a>');
  a.attr('href', data.url);
  li.text(data.from + ' [' + createdAt + ']' + ': ');
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var input = jQuery('[name=message]');
  if (input.val() === '') return;

  var button = jQuery('#send-message');
  button.attr('disabled', 'disabled').text('Sending...');

  socket.emit('createMessage', {
    from: 'Client',
    text: input.val()
  }, function (data) {
    button.removeAttr('disabled').text('Send');
    input.val('');
  });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending...');

  navigator.geolocation.getCurrentPosition(
    function (position) {
      socket.emit('createLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      locationButton.removeAttr('disabled').text('Send Location');
    },
    function () {
      alert('Unable to fetch location');
      locationButton.removeAttr('disabled').text('Send Location');
    }
  );
});
