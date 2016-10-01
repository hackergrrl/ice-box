var icebox = require('../')()
var walk = require('fs-walk')
var ncp = require('ncp').ncp
var fs = require('fs')
var path = require('path')
var o = require('octal')

var src = process.argv[2]

icebox(function (dst, done) {
  ncp(src, dst, function (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    walk.walk(dst, function (basedir, filename, stat, next) {
      fs.chmod(path.join(basedir, filename), o(777), next)
    }, done)
  })
}, function (err, finalDir) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(finalDir)
})

