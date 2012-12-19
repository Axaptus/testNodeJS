var http        = require("http"),
    querystring = require("querystring");

http.createServer(function(req, res) {
    
    var qs          = querystring.parse(req.url.split("?")[1]),
        username    = qs.firstName + " " + qs.lastName,
        json;
    
    if (qs.callback) {
    // if we have a callback function name, do JSONP
        json = qs.callback + "({username:'" + username + "'});";
    } else {
    // otherwise, just return JSON
        json = JSON.stringify({"username":username});
    }
    
    res.writeHead(200, {
        // change MIME type to JSON
        "Content-Type": "application/json",
        "Content-Length": json.length
    });
    
    res.end(json);
    
}).listen(8080);





