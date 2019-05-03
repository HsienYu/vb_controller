const mosca = require('mosca')
const Max = require('max-api');

var moscaSettings = {
    port: 1883,
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function (client) {
    console.log('client connected', client.id);
});


// Sending data from mosca to clients
const handlers = {
    //file_path = path for playing video

    main_video: (file_path) => {
        publish_player('1-1', 'play-video', file_path);
    },

    side_video: (file_path) => {
        publish_player('1-1', 'play-video-loop', file_path);
    },

    stop_video: (file_path) => {
        publish_player('1-1', 'stop-video', file_path);
    },


    tower_action: (mode) => {
        towerAction(mode);
    },

    fog_action: (mode) => {
        smoke(mode);
    }

};

Max.addHandlers(handlers);

//
function publish_player(id, mode, _file_path) {
    var message = {
        topic: `tower/mqtt-media-player/${id}/${mode}`,
        payload: `${_file_path}`, // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };
    server.publish(message, function () {
        console.log(message);
        //Max.post('fire video!!');
    });
}

function smoke(_payload) {
    var message = {
        topic: `tower/mqtt-media-player/fog`,
        payload: _payload, // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };
    server.publish(message, function () {
        console.log(message);
        //Max.post('fire 4k video!!');
    });
}

function towerAction(mode) {
    var message = {
        topic: "Control/Out",
        payload: `${mode}`, // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };
    server.publish(message, function () {
        console.log(message);
    });
}

function done() { console.log('DONE'); }

// fired when a message is received
server.on('published', function (packet, client) {
    context = packet.payload.toString();
    console.log('Published', context);
    Max.outlet(context);
});

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}