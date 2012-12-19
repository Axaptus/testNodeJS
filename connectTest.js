var connect         = require("connect");
var connectRoute    = require("connect-route");

connect(
    connect.static(__dirname + "/public"),
    // create a router to handle application paths
    connectRoute( 
    function(app) {
        
        app.get("/:firstName/:lastName", function(req, res) {
        
            var userName = req.params.firstName + " " + req.params.lastName;
            
            console.log("HI " + userName);
            
           /* var html = "<!doctype html>" +
              "<html><head><title>Hello " + userName + "</title></head>" +
              "<body><h1>Hello, " + userName + "!</h1></body></html>";*/
            
            res.end();
        });
    })
).listen(8080);