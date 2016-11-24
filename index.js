var Through = require('through2');
var gutil = require('gulp-util');
var progeny = require('progeny');
var fs = require('fs');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-progeny-mtime';

module.exports = function(options) {

  return Through.obj(function (file, enc, callback) {

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));      
      return callback();
    }

    if (file.isBuffer()) {
      var self = this;
      progeny(options)(file.path, file.contents, function(err, deps) {
        var n = deps.length;

        if (n == 0) {
          self.push(file);
          callback();
          return;
        }

        var counter = 0;
        var latestMtime = file.stat.mtime;

        for (var i = 0; i < n; i++) {
          fs.stat(deps[i], function(err, stat) {
            if (stat.mtime > latestMtime) {
              latestMtime = stat.mtime;
            }

            if (++counter == n) {
              file.stat.mtime = latestMtime;
              self.push(file);
              callback();
            }
          });
        }
      });
      return;
    }
    
    this.push(file);
    callback();
  });

};
