var os = require('os')
var path = require('path')
var fs = require('fs-extra')
var mkdirp = require('mkdirp')
var guid = require('guid').raw
var ncp = require('ncp')
var walk = require('walk-fs')

module.exports = function (outDir, tmpDir) {
  var tmpDirHead = guid()
  var tmpDir = path.join(tmpDir || os.tmpdir(), tmpDirHead)

  mkdirp.sync(tmpDir)

  return function (work, finish) {
    work(tmpDir, function () {
      // Copy tmpdir to outdir
      var outFull = path.join(outDir, tmpDirHead)
      fs.mkdirs(outFull, function (err) {
        if (err) return finish(err)

        ncp(tmpDir, outFull, function (err) {
          if (err) return finish(err)

          // Set outdir as read-only
          // recursiveChmod(outFull, 0555, function (err) {
          fs.chmod(outFull, 0555, function (err) {
            if (err) return finish(err)

            // Remove tmpdir and finish
            fs.remove(tmpDir, function (err) {

              finish(err, outFull)
            })
          })
        })
      })
    })
  }
}

// TODO: https://www.npmjs.com/package/walk-fs
function recursiveChmod (dir, mode, done) {
  walk(dir, function (_path, stats) {
    console.log(_path, stats)
  }, done)
}
