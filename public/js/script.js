(function () {
    var nickname = prompt('Enter a nickname', 'Guest'),
        typing = false,
        socket = io();

    $('#submit').on('click', function () {
        if ($('#m').val()) {
            socket.emit('sendchat', $('#m').val());
            $('#messages').append(
                $('<li>').text(nickname + ': ' + $('#m').val())
            );
            $('#m').val('');
        }
        return false;
    });
    socket.on('updatechat', function (type, name, datetime, msg) {
            if (type == 'updateimage') {
                decodedURI = decodeURIComponent(msg);
                var newdiv1 = "<img src='" + decodedURI + "'/>";
                $('#messages').append($('<li>').text(name + ': ' + datetime + ':').append($(newdiv1)));
            }
            if (type == 'updatechat')
                $('#messages').append($('<li>').text(name + ': ' + datetime + ':' + msg));
            if (type == 'messagelist') {
                start = name.length - 1;
                for (i = start; i >= 0; i--) {
                    parts = name[i].split(":");
                    if (parts[1].trim() == "text") {
                        $('#messages').append($('<li>').text(parts[0] + ': ' + parts[2] + ':' + parts[3]));
                    }
                    else {
                        decodedURI = decodeURIComponent(parts[3]);
                        var newdiv1 = "<img src='" + decodedURI + "'/>";
                        $('#messages').append($('<li>').text(parts[1] + ': ' + parts[2] + ':').append($(newdiv1)));
                    }
                }
            }
            if (type == 'userconnected') {
                $('#messages').append($('<li>').text(name + ' has joined the room'));
                addUserToList(name, false);
            }
            if (type == 'disconnected') {
                $('#messages').append($('<li>').text(name + ' has left the room'));
                $('#' + name).remove();
            }
        }
    )
    ;
    socket.on('updateimage', function (type, name, msg) {
        decodedURI = decodeURIComponent(msg);
        var newdiv1 = "<img src='" + decodedURI + "'/>";
        $('#messages').append($('<li>').text(name + ': ').append($(newdiv1)));


        ;
    });
    socket.on('userconnected', function (type, user) {
        $('#messages').append($('<li>').text(user + ' has joined the room'));
        addUserToList(user, false);
    });
    socket.on('disconnected', function (type, user) {
        $('#messages').append($('<li>').text(user + ' has left the room'));
        $('#' + user).remove();
    });

    roomname = "5";
    socket.emit('adduser', nickname, roomname);


    $(document)

        .ready(function () {
            $('#messages').append($('<li>').text(nickname + ' has joined the room'));
            addUserToList(nickname, false);
            $('#m').focus().on('keyup', function () {
                if ($(this).val().length) {
                    if (typing === false) {
                        socket.emit('typing', nickname);
                    }
                    typing = true;
                } else {
                    typing = false;
                    socket.emit('stoptyping', nickname + '-typing');
                }
            });
        });

    function addUserToList(name, prepend) {
        if (prepend) {
            $('#users').prepend($('<li>').text(name).attr('id', name));
        } else {
            $('#users').append($('<li>').text(name).attr('id', name));
        }
    }


})();
