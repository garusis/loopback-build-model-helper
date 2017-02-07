# loopback-build-model-helper

A simple helper to build loopback models in ES7 but that no collides with remote methods.

## Usage

### Install

Install with Yarn
```
yarn add debug-helper
```
or install with NPM
```
npm i debug-helper
```
### Your scripts
**ES6** imports.
```ecmascript 6
import ModelBuilder from "loopback-build-model-helper"
```
or **NodeJS** traditional require
```ecmascript 6
const ModelBuilder = require("loopback-build-model-helper").default
```
configure it
```ecmascript 6
ModelBuilder.config({app:require("../server/server")})
```
then use it
```ecmascript 6
module.exports = function (_AppConstant) {
  let builder = new BuildHelper(AppConstant, _AppConstant)

  let hasChanges = true
  let constants = null

  builder.build()
    .then(function () {
      _AppConstant.observe("persist", function (ctx, next) {
        hasChanges = true
        next()
      })

      _AppConstant.observe("after delete", function (ctx, next) {
        hasChanges = true
        next()
      })
    })

  AppConstant.load = async function () {
    if (!hasChanges) return

    constants = await _AppConstant.find({})
    constants = _.keyBy(constants, "name")
    hasChanges = false
  }

  AppConstant.getPublic = async function () {
    return await _AppConstant.find({where: {isPublic: true}})
  }
  builder.remoteMethod("getPublic", {
    http: {
      verb: "get"
    },
    accepts: [],
    returns: {root: true, type: "array"}
  })


  /**
   *
   * @param {String} name
   */
  AppConstant.findConstant = async function (name) {
    await AppConstant.load()
    return constants[name].value
  }


  function AppConstant() {
  }
}
```