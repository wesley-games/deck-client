var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

server.listen(process.env.PORT || 5001, function () {
    console.log('Starting client on port 5001.')
});