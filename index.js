var os = require('os')
var path = require('path')
var fs = require('fs-extra')
var mkdirp = require('mkdirp')
var guid = require('guid').raw
var ncp = require('ncp')

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
        console.log('mkdir', outFull)

        console.log('copy', tmpDir, outFull)

        ncp(tmpDir, outFull, function (err) {
          if (err) return finish(err)
          console.log('copied')

          // Set outdir as read-only
          fs.chmod(outFull, 0555, function (err) {
            if (err) return finish(err)
            console.log('chmodded')

            // Remove tmpdir and finish
            fs.remove(tmpDir, function (err) {
              console.log('cleaned up')

              finish(err, outFull)
            })
          })
        })
      })
    })
  }
}
