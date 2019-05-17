const express = require('express');
const config = require('./config');
const util = require('./modules/util');
const energy = require('./modules/energy');
const cors = require('cors');

var app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.static(__dirname));

process.on('uncaughtException', err => {
    console.log(err);
});

function notifyRouteAccessed(routeName) {
    if (config.app.debug) {
        console.log(`Route '${routeName}' has been requested!`);
    }
}

// register routes
app.get('/', (request, response) => {
    notifyRouteAccessed('/');
    response.sendFile(__dirname + '/index.html');
});

app.get('/get/all', (request, response) => {
    notifyRouteAccessed('/get/all');
    // energy.fetchDataFromFRITZ();
    var notify = JSON.parse(util.getFileContents('notify.txt'));
    var state = JSON.parse(util.getFileContents('state.txt'));
    notify.devices = state == null ? [] : state;
    var json = JSON.stringify(notify);
    console.log(json);
    response.send(json);
});

app.get('/get/notify', (request, response) => {
    notifyRouteAccessed('/get/notify');
    // energy.fetchDataFromFRITZ();
    response.json(JSON.parse(util.getFileContents('notify.txt')));
});

app.get('/get/state', (request, response) => {
    notifyRouteAccessed('/get/state');
    // energy.fetchDataFromFRITZ();
    response.json(JSON.parse(util.getFileContents('state.txt')));
});

app.get('/get/devices', (request, response) => {
    notifyRouteAccessed('/get/devices');
    response.json(JSON.parse(util.getFileContents('devices.txt')));
});

app.post('/set/devices', (request, response) => {
    notifyRouteAccessed('/set/devices');
    util.saveToFile('devices.txt', [request.body.devices]);
    response.sendStatus(201);
});

// run app
app.on('error', (err) => {
    console.error("Server error " + err);
});


const port = config.app.port;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});

const cron = require('node-cron');

cron.schedule('*/10 * * * * *', function () {
    energy.fetchDataFromFRITZ();
});