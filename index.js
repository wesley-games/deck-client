$(document).ready(function () {
    var socket = io.connect('https://deck-server.herokuapp.com/');

    var chat = $("#chat");

    $("#send").click(function (event) {
        let message = $("#message").val();
        socket.emit('send_message', message);

        chat.prepend(`<li>${message}</li>`);

        $("#message").val("");
    });

    socket.on('on_message', function (message) {
        chat.prepend(`<li style="text-align: right;">${message}</li>`);
    });
});
