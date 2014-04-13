window.crappyChat = function () {
    var username;

    console.log("Loading crappy chat");

    // Reference the sockjs server
    var sock = new SockJS('http://localhost:9999/echo');

    // Stuff that's not interesting
    var bindUsernameFormSubmit = function () {
        $('#registrationForm').on('submit', function (events) {
            events.preventDefault();

            username = $('#username').val();
            var notifyMe = $('#notifyMe').is(':checked');

            hideLogin();
            updateChatName(username);
            showChat();

        });
    };
    var hideLogin = function() {
        $('#registrationContainer').hide();
    };
    var showChat = function() {
        $('#chatContainer').show();
    };
    var updateChatName = function(name) {
        $('#chatterName').html(name);
    };
    var addNewMessageToPage = function (username, message) {
        // Add the message to the page. 
        $('#discussion').append('<li><strong>' + username + '</strong>: ' + message + '</li>');
    };

    // What actually sends the message
    var bindMessageSubmit = function () {
        $('#newChatMessageForm').on('submit', function (events) {
            events.preventDefault();

            var message = $('#chatMessage').val();
            $('#chatMessage').val('');

            sock.send(JSON.stringify({
                type: 'text',
                message: message,
                username: username
            }));
        });
    };

    // The method I'll run once to set stuff up.
    var initialize = function () {
        bindUsernameFormSubmit();

        bindMessageSubmit();

        sock.onmessage = function(e) {
            var data = JSON.parse(e.data);

            switch ( data.type ) {
                case 'newUser':
                    //appendMessage('system', 'A new user has joined');
                    break;
                case 'message':
                    addNewMessageToPage(data.username, data.message);
                    break;
                case 'history':
                    // This is how you'd handle different messages
                    //appendMessage('message', data.message);
                    //sockId = data.id;
                    break;
                case 'userLeft':
                    //appendMessage('system', 'A user has left');
                    break;
            }

        };
    };


    // reveal the methods we want to share
    return {
        initialize: initialize
    };
};