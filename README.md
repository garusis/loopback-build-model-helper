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
```
import ModelBuilder from "loopback-build-model-helper"
```
or **NodeJS** traditional require
```
const ModelBuilder = require("loopback-build-model-helper").default
```
configure it
```
ModelBuilder.config({app:require("../server/server")})
```
then use it
```
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
## Overwriting

Overwrite built-in methods can be do it in the same way that 
you define new methods. To avoid some stupid issues, if you want to 
overwrite a built-in method, your function will receive a last argument **old**
that which is in fact the overwritten function.
```
  //overwriting the create method.
  MyModel.create = async function (data, options, old) {
    //do something with data or other models.
    
    let newMy = await old.call(this, data, options)
    
    // do something more
    
    return newMy
  }
```