var http        = require('http');
var path        = require("path");
var fs          = require('fs');
var querystring = require("querystring");
var io          = require("socket.io").listen(8081);
var mustache    = require("mustache");

var extensions = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg"
    };

http.createServer(function(request, response) {

    // parse everything after the "?" into key/value pairs
    var qs          = querystring.parse(request.url.split("?")[1]),
        userName    = qs.firstName + " " + qs.lastName;

    // look for a filename in the URL, default to index.html
    var filename    = path.basename(request.url) || "index.html";
    var ext         = path.extname(filename);
    var dir         = path.dirname(request.url).substring(1);
    // __dirname is a built-in variable containing the path where the code is running
    var localPath   = __dirname + "/public/";

    console.log(filename + " " + ext + " " + dir + " " + localPath);

    if (extensions[ext]) {

        localPath += (dir ? dir + "/" : "") + filename;

        fs.exists(localPath, function(exists) {
            if (exists) {
                getFile(localPath, extensions[ext], response);
            } else {
                response.writeHead(404);
                response.end();
            }
        });
    }
    else {
        console.log("Archivo desconocido");
        response.writeHead(404);
        response.end();
    }


}).listen(8080);

function getFile(localPath, mimeType, res) {

    fs.readFile(localPath, function(err, contents){

        if(!err)
        {
            res.writeHead(200, {
                "Content-Type": mimeType,
                "Content-Length": contents.length
            });

            res.write(contents);
            res.end();
        }
        else {
            res.writeHead(500);
            res.end();
        }
    });
}

// listen for connection from an individual client
io.sockets.on("connection", function(socket) {
    // listen for setName event
    socket.on("setName", function(data) {

        var userName = data.firstName + " " + data.lastName;
        // publish nameSet event with new username
        socket.emit("nameSet", {userName: userName});
    });
});















