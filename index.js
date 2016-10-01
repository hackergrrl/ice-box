var os = require('os')
var path = require('path')
var fs = require('fs-extra')
var mkdirp = require('mkdirp')
var guid = require('guid').raw
var ncp = require('ncp')
var o = require('octal')
var mv = require('mv')
var walk = require('walk-fs')

module.exports = function (outDir, tmpDir) {
  outDir = outDir || 'ice-box'
  var tmpDirHead = guid()
  tmpDir = path.join(tmpDir || path.join(os.tmpdir(), 'ice-box'), tmpDirHead)

  mkdirp.sync(tmpDir)

  return function (work, finish) {
    work(path.resolve(tmpDir), function () {
      // Copy tmpdir to outdir
      var outFull = path.join(outDir, tmpDirHead)
      fs.mkdirs(outDir, function (err) {
        if (err) return finish(err)

        mv(tmpDir, outFull, function (err) {
          if (err) return finish(err)

          // Set outdir as read-only
          recursiveChmod(outFull, function (err) {
            if (err) return finish(err)

            finish(err, path.resolve(outFull))
          })
        })
      })
    })
  }
}

function recursiveChmod (dir, done) {
  walk(dir, function (_path, stats) {
    if (stats.isDirectory()) {
      fs.chmodSync(_path, o(755))
    } else {
      fs.chmodSync(_path, o(555))
    }
  }, done)
}
