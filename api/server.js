var http = require('http'),
    buffer = [];

//function whisper (id, message) {
//    if ( !clients[id] ) return;
//
//    clients[id].write( JSON.stringify(message) );
//}


function onConnection (conn) {
//    clients[conn.id] = conn;

//    broadcast({ type: 'newUser' }, conn.id);
//    whisper(conn.id, { type: 'history', message: buffer, id: conn.id });

    conn.on('message', function onDataCB (data) {
        data = JSON.parse(data);

        if ( data.type == 'text' ) {
            if ( !data.message ) return;

            data.message = data.message.substr(0, 128);

            if ( buffer.length > 15 ) buffer.shift();
            buffer.push(data.message);

            wss.broadcast({ type: 'message', message: data.message, username: data.username });
        }
    });

    conn.on('close', function onCloseCB () {
        wss.broadcast({ type: 'userLeft' });
    });
}

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 9999});
wss.on('connection', onConnection);


wss.broadcast = function (message) {
    for ( var i in this.clients ) {
        console.log("sending message")
        this.clients[i].send(JSON.stringify(message));
    }
}