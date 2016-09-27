// for letting you create pure-ish functions that produce files in a directory
// e.g. creating binaries and builds

// bonus: make the dirname be the hash of the directory contents, so that you
// get deduplication for free

var fs = require('fs')
var path = require('path')
var createVirtualDirectory = require('./')('./dist', '/tmp/dir-store')

createVirtualDirectory(function (tmpPath, done) {
  console.log('given', tmpPath)
  fs.mkdirSync(path.join(tmpPath, 'foo'))
  fs.writeFileSync(path.join(tmpPath, 'bar'), new Buffer('hello thar!'))
  fs.writeFileSync(path.join(tmpPath, 'foo', 'baz'), new Buffer('inner file'))
  process.nextTick(done)
}, function (err, finalPath) {
  if (err) return console.log(err)
  console.log('frozen dir located at', finalPath)
})
