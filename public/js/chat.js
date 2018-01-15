var socket = io();

function scrollToBottom () {
  var messages = jQuery('#messages');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessage = messages.children('li:last-child');
  var newMessageHeight = newMessage.innerHeight();
  var prevMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + prevMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (error) {
    if (error) {
      alert(error);
      window.location.href = '/';
    } else {

    }
  });
});

socket.on('updateUserList', function (data) {
  var ol = jQuery('<ol></ol>');
  for (var i = 0; i < data.length; i++) {
    ol.append(jQuery('<li></li>').text(data[i]));
  }
  jQuery('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var input = jQuery('[name=message]');
  if (input.val() === '') return;

  var button = jQuery('#send-message');
  button.attr('disabled', 'disabled').text('Sending...');

  socket.emit('createMessage', {
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
