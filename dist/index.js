"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = void 0;

function ModelBuilder(OwnModel, LoopbackModel) {
    this.Base = OwnModel;
    this.Model = LoopbackModel;
}

ModelBuilder.config = function (settings) {
    app = settings.app;
};

function wrapFunction(fn, fnName, collection) {
    if (!_lodash2.default.isFunction(fn)) return;

    var oldFn = collection[fnName] || false;

    collection[fnName] = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this = this;

        var args,
            cb,
            _ret,
            _args2 = arguments;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        args = _lodash2.default.toArray(_args2);
                        cb = void 0;

                        if (_lodash2.default.isFunction(args[args.length - 1])) cb = args.pop();
                        if (oldFn) args.push(oldFn);

                        _context2.prev = 4;
                        return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
                            var response;
                            return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            _context.next = 2;
                                            return fn.apply(_this, args);

                                        case 2:
                                            response = _context.sent;

                                            if (!cb) {
                                                _context.next = 5;
                                                break;
                                            }

                                            return _context.abrupt("return", {
                                                v: process.nextTick(function () {
                                                    return cb(null, response);
                                                })
                                            });

                                        case 5:
                                            return _context.abrupt("return", {
                                                v: response
                                            });

                                        case 6:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        })(), "t0", 6);

                    case 6:
                        _ret = _context2.t0;

                        if (!((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object")) {
                            _context2.next = 9;
                            break;
                        }

                        return _context2.abrupt("return", _ret.v);

                    case 9:
                        _context2.next = 16;
                        break;

                    case 11:
                        _context2.prev = 11;
                        _context2.t1 = _context2["catch"](4);

                        if (!cb) {
                            _context2.next = 15;
                            break;
                        }

                        return _context2.abrupt("return", process.nextTick(function () {
                            return cb(_context2.t1);
                        }));

                    case 15:
                        throw _context2.t1;

                    case 16:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[4, 11]]);
    }));
}

ModelBuilder.assing = function (Base, Model) {
    _lodash2.default.forEach(Base, wrapFunction);
    _lodash2.default.forEach(Base.prototype, wrapFunction);

    _lodash2.default.assign(Model, Base);
    _lodash2.default.assign(Model.prototype, Base.prototype);
};

ModelBuilder.prototype.remoteMethod = function (name, options) {
    this.Model.remoteMethod(name, options);
};

/**
 *
 * @param Base
 * @param Model
 * @return {Promise}
 */
ModelBuilder.prototype.build = function () {
    var _this2 = this;

    return new _bluebird2.default(function (resolve, reject) {
        app.once("booted", function () {
            ModelBuilder.assing(_this2.Base, _this2.Model);
            resolve(_this2.Base);
        });
    });
};

/**
 * ModelBuilder class exists to allow you to effectively use the Webstorm autocomplementation tools.
 * @constructor
 */
exports.default = ModelBuilder;
//# sourceMappingURL=index.js.map
