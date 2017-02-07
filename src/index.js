"use strict"

import _ from "lodash"
import Promise from "bluebird"


function BuildHelper(Base, Model) {
    this.Base = Base
    this.Model = Model
}

function wrapFunction(fn, fnName, collection) {
    if (!_.isFunction(fn)) return

    collection[fnName] = async function () {
        let args = _.toArray(arguments)
        let cb
        if (_.isFunction(args[args.length - 1])) cb = args.pop()

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


BuildHelper.assing = function (Base, Model) {
    _.forEach(Base, wrapFunction)
    _.forEach(Base.prototype, wrapFunction)

    _.assign(Model, Base)
    _.assign(Model.prototype, Base.prototype)
}

BuildHelper.prototype.remoteMethod = function (name, options) {
    this.Base.remoteMethod(name, options)
}

/**
 *
 * @param Base
 * @param Model
 * @return {Promise}
 */
BuildHelper.prototype.build = function () {
    return new Promise((resolve, reject) => {
        app.once("started", () => {
            BuildHelper.assing(this.Base, this.Model)
            resolve(this.Base)
        })
    })
}


/**
 * BuildHelper class exists to allow you to effectively use the Webstorm autocomplementation tools.
 * @constructor
 */
export default BuildHelper