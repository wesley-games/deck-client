$(document).ready(function () {
    let socket = io.connect('https://deck-server.herokuapp.com/');
    // let socket = io.connect('http://localhost:5000');
    let enabledToPlay = false;
    let playerCardPlayed = null;
    let enemyCardPlayed = null;

    $('#join').click(function (event) {
        let room = $('#room').val();
        socket.emit('join_room', room);
        $('#roomName').text(room);
        $('#roomController').hide();
        $('#roomHeader').show();
    });

    $('#disconnect').click(function (event) {
        socket.emit('leave_room');
        $('#roomController').show();
        $('#roomHeader').hide();
        $('#deck').empty();
        $('#table').empty();
        $('#playerHand').empty();
        $('#enemyHand').empty();
        $('#turn').text('');
    });

    socket.on('disconnected_play', function () {
        $('#deck').empty();
        $('#table').empty();
        $('#playerHand').empty();
        $('#enemyHand').empty();
        $('#turn').text('');
    });

    $('#restart').click(function (event) {
        socket.emit('restart_game');
    })

    socket.on('started_game', function () {
        $('#deck').empty();
        $('#table').empty();
        $('#enemyHand').empty();
        $('#playerHand').empty();
        $('#turn').text('');
        $('#restart').hide();

        for (let i = 0; i < 52; i++) {
            let divCard = $('<div/>').addClass('card');
            $('#deck').append(divCard);
        }

        let startCards = 0;
        let drawing = setInterval(function () {
            if (startCards < 3) {
                startCards++;
                socket.emit('draw_card');
            } else {
                clearInterval(drawing);
            }
        }, 500);
    });

    $('#deck').click(function (event) {
        if (enabledToPlay) {
            socket.emit('draw_card');
        }
    });

    socket.on('play_turn', function () {
        $('#turn').text('YOUR TURN');
        enabledToPlay = true;
    });

    socket.on('drawn_card', function (card) {
        $('#deck div:last-child').detach();

        if (card) {
            let spanSuit = $('<span/>').attr('suit', card.slice(0, 1)).text(card.slice(0, 1));
            let spanValue = $('<span/>').text(card.slice(1));
            let divCard = $('<div/>').addClass('card').append(spanValue).append(spanSuit).click(onClickedCard);
            $('#playerHand').append(divCard);
        }
    });

    socket.on('drawn_enemy_card', function () {
        let e = $('#deck div:last-child').detach();
        $('#enemyHand').append(e);
    });

    socket.on('played_enemy_card', function (card) {
        $('#enemyHand div:last-child').detach();

        let spanSuit = $('<span/>').attr('suit', card.slice(0, 1)).text(card.slice(0, 1));
        let spanValue = $('<span/>').text(card.slice(1));
        let divCard = $('<div/>').addClass('card').append(spanValue).append(spanSuit);
        enemyCardPlayed = divCard;
        $('#table').append(divCard);
    });

    // Play card function
    var onClickedCard = function (event) {
        if (enabledToPlay) {
            let card = $(event.currentTarget);
            card.detach();
            playerCardPlayed = card;
            $('#table').append(card);

            let suit = card.children().last().text();
            let value = card.children().first().text();
            socket.emit('play_card', suit + value);

            $('#turn').text('');
            enabledToPlay = false;
        }
    }

    socket.on('wrong_card', function () {
        setTimeout(() => {
            $('#playerHand').append(playerCardPlayed);
            $('#turn').text('YOUR TURN');
            enabledToPlay = true;
        }, 500);
    });

    socket.on('wrong_enemy_card', function () {
        setTimeout(() => {
            $(enemyCardPlayed).detach();
            $('#enemyHand').append($('<div />').addClass('card'));
        }, 500);
    });

    socket.on('win_turn', function () {
        $('#table').empty();
        $('#turn').text('YOUR TURN');
        enabledToPlay = true;
    });

    socket.on('lose_turn', function () {
        $('#table').empty();
        $('#turn').text('');
    });

    socket.on('win_game', function () {
        $('#restart').show();
        $('#turn').text('YOU WIN');
        enabledToPlay = false;
    })

    socket.on('lose_game', function () {
        $('#restart').show();
        $('#turn').text('YOU LOSE');
        enabledToPlay = false;
    });
});