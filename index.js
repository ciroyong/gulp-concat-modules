'use strict';

var through, minimatch, path, concat, PluginError;

through = require('through2');
minimatch = require('minimatch');
path = require('path');
concat = require('concat-with-sourcemaps');
PluginError = require('plugin-error');

module.exports = function(opt) {
    var isUsingSourceMaps, concats, write, end, firstFiles, _concat, _createFile;

    if (!opt) {
        throw new PluginError('gulp-concat-modules', {message:'Missing options'});
    }

    if (typeof opt.newLine !== 'string') {
        opt.newLine = "\n";
    }

    isUsingSourceMaps = false;
    concats = {};
    firstFiles = {};

    _concat = function(file, name) {
        if (file.sourceMap) {
            isUsingSourceMaps = true;
        }

        if (!concats.hasOwnProperty(name)) {
            concats[name] = new concat(isUsingSourceMaps, name, opt.newLine);
            firstFiles[name] = file.clone({contents: false});
            firstFiles[name].path = path.join(file.base, name);
        }

        concats[name].add(file.relative, file.contents, file.sourceMap);
    }

    _createFile = function(name, concat) {
        var file;

        file = firstFiles[name];
        file.contents = concat.content;
        
        if (concat.sourceMapping) {
            file.sourceMap = JSON.parse(concat.sourceMap);
        }


        return file;
    }

    return through.obj(function(file, enc, cb) {
        var src;
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // we dont do streams (yet)
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-concat-modules', {message:'Streaming not supported'}));
            cb();
            return;
        }

        for(var relative in opt.modules) {
            src = opt.modules[relative];
            if(typeof src === "string") {
                if(minimatch(file.relative, src)){
                    _concat(file, relative);
                }
            }

            if (src instanceof Array) {
                for(var i=0; i< src.length; i++) {
                    if(minimatch(file.relative, src[i])) {
                        _concat(file, relative);
                        break;
                    }
                }
            }
        }

        cb();
    }, function end(cb) {
        for(var name in concats) {
            this.push(_createFile(name, concats[name]));
        }

        cb();
    });
};