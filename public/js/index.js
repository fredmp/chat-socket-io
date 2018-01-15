var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    text: data.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
});

socket.on('newLocation', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a');
  var template = jQuery('#location-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    url: data.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
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
