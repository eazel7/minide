var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');
var staticPath = path.join(__dirname, 'static');
var serveStatic = require('serve-static');

var Interpreter = require('js-interpreter');
var exclude = 'encodeURIComponent,encodeURI,decodeURIComponent,decodeURI,unescape,escape,eval,parseInt,parseFloat,isFinite,isNaN,URIError,TypeError,SyntaxError,ReferenceError,RangeError,EvalError,Error,JSON,RegExp,Math,Date,Boolean,String,Number,Array,Object,Function,self,window,undefined,NaN,Infinity'.split(',');

io.on('connection', function (socket) {
  var i;

  socket.on('continue', function () {
    i.continue();
  });

  socket.on('run', function (code) {
    i = new Interpreter(code);

    i
    .on(
      'debugger',
      function () {
        var scope = i.getScope();

        var finalScope = {};

        for (var k in scope.properties){
          if (exclude.indexOf(k) > -1) continue;

          finalScope[k] = {
            data: scope.properties[k].type !== 'function' ? scope.properties[k].data : null,
            type: scope.properties[k].type
          };
        }

        socket
        .emit(
          'debugger',
          finalScope
        );
      }
    );

    i.run();
  });
});

app.use(serveStatic(staticPath));

server.listen(4000);
