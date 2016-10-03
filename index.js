var os = require('os')
var path = require('path')
var fs = require('fs-extra')
var mkdirp = require('mkdirp')
var guid = require('guid').raw
var o = require('octal')
var mv = require('mv')
var walk = require('walk').walk

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
  var walker = walk(dir)

  walker.on('directory', function (root, dirStatsArray, next) {
    fs.chmodSync(root, o(755))
    next()
  })

  walker.on('file', function (root, fileStats, next) {
    var _path = path.join(root, fileStats.name)
    fs.chmodSync(_path, o(555))
    next()
  })

  walker.on('errors', function (err) {
    done(err)
  })

  walker.on('end', function () {
    done()
  })
}
