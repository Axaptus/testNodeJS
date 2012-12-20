var connect     = require("connect"),
    fs          = require("fs"),
    mustache    = require("mustache"),
    requirejs   = require("requirejs"),
    parentTmpl;

// configure requirejs to fall back to Node's require if a module is not found
requirejs.config({ nodeRequire: require });

connect(
    connect.static(__dirname + "/public"),
    connect.router(function(app) {
        app.get("/show/:tmpl/:firstName/:lastName", function(req, res) {
            var userName = {
                firstName: req.params.firstName,
                lastName: req.params.lastName
            };

            // once the parent template is loaded, render the page
            requirejs(["text!public/parent.html"], function(_parentTmpl) {
                parentTmpl = _parentTmpl;
                render(res, req.params.tmpl + ".html", userName);
            });
        });
    })
).listen(8080);

function render(res, filename, data, style, script, callback) {

    // load the template and return control to another function or send the response
    requirejs(["text!public/" + filename], function(tmpl) {
        if (callback) {

            callback(res, tmpl, data, style, script);

        } else {

            // render parent template with page template as a child
            var html = mustache.to_html(
                parentTmpl,
                {content: data},
                {content: tmpl, stylesheets: style || "", scripts: script || ""}
            );

            res.end(html);
        }
    });
}