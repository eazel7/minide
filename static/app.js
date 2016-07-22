angular
.module(
  'minide',
  [
    'ui.ace',
    'btford.socket-io',
    'jsonFormatter'
  ]
)
.controller(
  'BodyController',
  function ($scope, socketFactory) {
    var socket = socketFactory();

    socket.on('connect', function () {
      socket.on('debugger', function (scope) {
        $scope.scope = scope;
      })
    });

    $scope.code = 'var a = 1;\ndebugger;\na = 2;\ndebugger;';

    $scope.run = function () {
      socket.emit('run', $scope.code);
    };
    $scope.continue = function () {
      socket.emit('continue');
    };

    $scope.aceOptions = {
      mode: 'javascript',
      useWrapMode : true,
      showGutter: true,
      theme:'twilight',
      require: ['ace/ext/language_tools'],
      advanced: {
        enableSnippets: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
      },
      onLoad: function (_ace) {

      }
    };
  }
)
