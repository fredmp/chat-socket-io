var socket = io();

socket.on('connect', function () {

  socket.emit('getRooms', function (data) {
    if (data.length > 0) {
      var newRoom = jQuery('[name=room]');
      var select = jQuery('#existing-rooms');

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
  var selectedRoom = jQuery('#existing-rooms').val()
  selectedRoom = selectedRoom === '' ? jQuery('[name=room]').val() : selectedRoom;
  window.location.href = '/chat.html?name=' + name + '&room=' + selectedRoom;
}
