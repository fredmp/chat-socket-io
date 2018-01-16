var socket = io();

socket.on('connect', function () {

  socket.emit('getRooms', function (data) {
    var newRoom = jQuery('[name=room]');
    var select = jQuery('#existing-rooms');

    if (data.length > 0) {
      jQuery('#existing-rooms-div').show();

      populateDropdown(select, data);

      select.change(function () {
        if (this.value) {
          newRoom.val('');
        }
      });
      newRoom.change(function () {
        select.val('');
      });
    }
  });
});

jQuery('#join').click(function (e) {
  e.preventDefault();
  sendToChat();
});

function populateDropdown (dropdown, rooms) {
  dropdown.append(jQuery('<option>', { value: '', text : 'Choose one...' }));
  jQuery.each(rooms, function (i, room) {
    const option = jQuery('<option>', { value: room.name, text : room.name });
    dropdown.append(option);
  });
}

function sendToChat () {
  var name = jQuery('[name=name]').val();
  var room = jQuery('[name=room]').val();
  if (room === '' || room === undefined) {
    room = jQuery('#existing-rooms').val();
  }
  window.location.href = '/chat.html?name=' + name + '&room=' + room;
}
