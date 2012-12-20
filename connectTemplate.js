var connect   = require("connect"),
    fs        = require("fs"),
    mustache  = require("mustache");
var dfdf;

connect(
  connect.static(__dirname + "/public"),
  connect.bodyParser(),
  function(req, res) {

    if (req.method == "POST") {

      var userName = {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        };

      console.log(userName);

      // create and open the stream
      var tmplFile = fs.createReadStream(__dirname + "/server/templates/template1.html",
                                        {encoding: "utf8"});

      var template = "";
      var html;

      tmplFile.on("data", function(data) {
          template += data;
      });

      tmplFile.on("end", function() {

        // render the template with the userName object as data
        html = mustache.to_html(template, userName);

        res.end(html);

      });
    }
  }
).listen(8080);