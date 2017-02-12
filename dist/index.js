"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

    collection[fnName] = function () {
        var args = _lodash2.default.toArray(arguments);
        var cb = _lodash2.default.isFunction(args[args.length - 1]) ? args.pop() : void 0;

        if (oldFn) args.push(oldFn);

        if (!cb) return fn.apply(this, args);

        fn.apply(this, args).then(function (response) {
            return cb(null, response);
        }).catch(cb);
    };
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
    var _this = this;

    return new _bluebird2.default(function (resolve, reject) {
        app.once("booted", function () {
            ModelBuilder.assing(_this.Base, _this.Model);
            resolve(_this.Base);
        });
    });
};

/**
 * ModelBuilder class exists to allow you to effectively use the Webstorm autocomplementation tools.
 * @constructor
 */
exports.default = ModelBuilder;
//# sourceMappingURL=index.js.map
