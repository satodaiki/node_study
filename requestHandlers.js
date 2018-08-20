var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var ejs = require("ejs");
const exec = require('child_process').exec;

function start(response) {
  console.log("Request handler 'start' was called.");

  var st = fs.readFileSync("./views/start.ejs", "utf-8");

  var command = 'ls';

  var status = exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log('exec command error');
    }
    console.log("stdout is '" + stdout + "'");
  });

  console.log('status is :' + status);

  var stObj = {
    title: "hello ejs.",
    status: status
  };

  var page = ejs.render(st, stObj);

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(page);
  response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    fs.rename(files.upload.path, "./tmp/test.png", function(err) {
      if(err) {
        fs.unlink("./tmp/test.png");
        fs.rename(files.upload.path, "./tmp/test.png");
      }
    });
  });
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("received image:<br/>");
  response.write("<img src='show' />");
  response.end();
}

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("./tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
