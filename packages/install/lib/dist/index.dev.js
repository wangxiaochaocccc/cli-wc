"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _command = _interopRequireDefault(require("@learnmyself.com/command"));

var _utils = require("@learnmyself.com/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var initCommand =
/*#__PURE__*/
function (_Command) {
  _inherits(initCommand, _Command);

  function initCommand() {
    _classCallCheck(this, initCommand);

    return _possibleConstructorReturn(this, _getPrototypeOf(initCommand).apply(this, arguments));
  }

  _createClass(initCommand, [{
    key: "action",
    value: function action() {
      var platform, githubApi, searchResult;
      return regeneratorRuntime.async(function action$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              platform = (0, _utils.getPlatform)();

              if (platform) {
                _context.next = 5;
                break;
              }

              _context.next = 4;
              return regeneratorRuntime.awrap((0, _utils.makeList)({
                choices: [{
                  name: 'GitHub',
                  value: 'github'
                }, {
                  name: 'Gitee',
                  value: 'gitee'
                }],
                message: "请选择git平台"
              }));

            case 4:
              platform = _context.sent;

            case 5:
              _utils.log.verbose("Paltform", platform); // 平台选择后


              if (platform === 'github') {
                githubApi = new _utils.github();
              } else {}

              _context.next = 9;
              return regeneratorRuntime.awrap(githubApi.init());

            case 9:
              _context.next = 11;
              return regeneratorRuntime.awrap(githubApi.savePlatformPath(platform));

            case 11:
              _context.next = 13;
              return regeneratorRuntime.awrap(githubApi.search({
                q: 'vue',
                sort: 'stars',
                order: 'desc',
                per_page: 2,
                page: 1
              }));

            case 13:
              searchResult = _context.sent;
              console.log(searchResult, 111);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "command",
    get: function get() {
      return 'install';
    }
  }, {
    key: "description",
    get: function get() {
      return 'install project';
    }
  }, {
    key: "options",
    get: function get() {}
  }]);

  return initCommand;
}(_command["default"]);

function InstallCommand(instance) {
  return new initCommand(instance);
}

var _default = InstallCommand;
exports["default"] = _default;