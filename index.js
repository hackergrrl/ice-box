var os = require('os')
var path = require('path')
var fs = require('fs-extra')
var mkdirp = require('mkdirp')
var guid = require('guid').raw
var ncp = require('ncp')
var o = require('octal')

module.exports = function (outDir, tmpDir) {
  outDir = outDir || 'ice-box'
  var tmpDirHead = guid()
  tmpDir = path.join(tmpDir || path.join(os.tmpdir(), 'ice-box'), tmpDirHead)

  mkdirp.sync(tmpDir)

  return function (work, finish) {
    work(tmpDir, function () {
      // Copy tmpdir to outdir
      var outFull = path.join(outDir, tmpDirHead)
      fs.mkdirs(outFull, function (err) {
        if (err) return finish(err)

        ncp(tmpDir, outFull, function (err) {
          if (err) return finish(err)

          // Remove tmpdir and finish
          fs.remove(tmpDir, function (err) {
            if (err) return finish(err)

            // Set outdir as read-only
            // recursiveChmod(outFull, o(555), function (err) {
            fs.chmod(outFull, o(555), function (err) {
              if (err) return finish(err)

              finish(err, outFull)
            })
          })
        })
      })
    })
  }
}

// TODO: https://www.npmjs.com/package/walk-fs
// function recursiveChmod (dir, mode, done) {
//   walk(dir, function (_path, stats) {
//     console.log(_path, stats)
//   }, done)
// }
