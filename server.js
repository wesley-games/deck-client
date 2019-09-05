var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname)});
});

server.listen(process.env.PORT || 5001, function () {
    console.log('Starting client on port 5001.')
});