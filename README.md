# debug-helper

A simple helper for easy use of the [debug](https://www.npmjs.com/package/debug) package

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
import dh from "debug-helper"
```
or **NodeJS** traditional require
```
const dh = require("debug-helper").default
```
you can configure it before use it
```
dh.configure({appNamespace:"my-app-name"}) //Default appNamespace = process.env.DH_APP_NAMESPACE
```
and then use the shortcut methods 
```
dh.debug.test("test message") //output -> my-app-name:test: test message
dh.debug.production("production production"), //output -> my-app-name:test: production message
dh.debug.development("development development"), //output -> my-app-name:test: development message
dh.debug.staging("staging staging"), //output -> my-app-name:test: staging message
dh.debug.error("error error"), //output -> my-app-name:test: error message
dh.debug.info("info info") //output -> my-app-name:test: info message
```
or create your own decorators
```
const debug = new db("intern-namespace")
debug("a message") //output -> my-app-name:intern-namespace: a message
```
### More
For more info about **debug** package uses like how to use the *DEBUG* environment variable go to [debug](https://www.npmjs.com/package/debug) docs.