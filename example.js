// for letting you create pure-ish functions that produce files in a directory
// e.g. creating binaries and builds

// bonus: make the dirname be the hash of the directory contents, so that you
// get deduplication for free

var fs = require('fs')
var path = require('path')
var createVirtualDirectory = require('./')('.', '/tmp')

createVirtualDirectory(function (tmpPath, done) {
  fs.mkdirSync(path.join(tmpPath, 'foo'))
  fs.writeFileSync(path.join(tmpPath, 'bar'), new Buffer('hello thar!'))
  process.nextTick(done)
}, function (err, path) {
  console.log('frozen dir located at', path)
})
