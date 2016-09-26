var path = require('path')
var fs = require('fs-extra')
var mkdirp = require('mkdirp')

module.exports = function (outDir, tmpDir) {
  // TODO: use module to get os temp dir
  tmpDir = path.join(tmpDir || '/tmp', ('dir-store-'+(''+Math.random()).substring(2, 7)))
  console.log(tmpDir)

  var name = 'dir-'+(''+Math.random()).substring(2, 7)
  var dir = path.join(tmpDir, name)

  mkdirp.sync(dir)

  return function (pre, post) {
    pre(dir, function () {
      var outFull = path.join(outDir, name)
      fs.copySync(dir, outFull)
      post(null, outFull)
    })
  }

  // TODO: remove all write bits on final dir
}

//   function (tmpPath, done) {
//   fs.mkdirSync(path.join(tmpPath, 'foo'))
//   fs.writeFileSync(path.join(tmpPath, 'bar'), new Buffer('hello thar!'))
//   process.nextTick(done)
// }, function (path, err) {
//   console.log('frozen dir located at', path)
// }

