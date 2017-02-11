"use strict"

import _ from "lodash"
import Promise from "bluebird"

let app

function ModelBuilder(OwnModel, LoopbackModel) {
    this.Base = OwnModel
    this.Model = LoopbackModel
}

ModelBuilder.config = function (settings) {
    app = settings.app
}

function wrapFunction(fn, fnName, collection) {
    if (!_.isFunction(fn)) return

    let oldFn = collection[fnName] || false

    collection[fnName] = async function () {
        let args = _.toArray(arguments)
        let cb
        if (_.isFunction(args[args.length - 1])) cb = args.pop()
        if (oldFn) args.push(oldFn)

        try {
            let response = await fn.apply(this, args)
            if (cb) return process.nextTick(() => cb(null, response))
            return response
        } catch (err) {
            if (cb) return process.nextTick(() => cb(err))
            throw err
        }
    }
}


ModelBuilder.assing = function (Base, Model) {
    _.forEach(Base, wrapFunction)
    _.forEach(Base.prototype, wrapFunction)

    _.assign(Model, Base)
    _.assign(Model.prototype, Base.prototype)
}


ModelBuilder.prototype.remoteMethod = function (name, options) {
    this.Model.remoteMethod(name, options)
}

/**
 *
 * @param Base
 * @param Model
 * @return {Promise}
 */
ModelBuilder.prototype.build = function () {
    return new Promise((resolve, reject) => {
        app.once("booted", () => {
            ModelBuilder.assing(this.Base, this.Model)
            resolve(this.Base)
        })
    })
}


/**
 * ModelBuilder class exists to allow you to effectively use the Webstorm autocomplementation tools.
 * @constructor
 */
export default ModelBuilder