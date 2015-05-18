'use strict';

var through, minimatch, path, gulpUtil, concat, PluginError;

through = require('through2');
minimatch = require('minimatch');
path = require('path');
gulpUtil = require('gulp-util');
concat = require('concat-with-sourcemaps');
PluginError = gulpUtil.PluginError;

module.exports = function(opt) {
    var isUsingSourceMaps, concats, write, end, firstFiles, _concat, _createFile;

    if (!opt) {
        throw new PluginError('gulp-concat-cc', 'Missing options');
    }

    if (typeof opt.newLine !== 'string') {
        opt.newLine = gulpUtil.linefeed;
    }

    isUsingSourceMaps = false;
    concats = {};
    firstFiles = {};

    _concat = function(file, name, cb) {
        if (file.sourceMap) {
            isUsingSourceMaps = true;
        }

        if (!concats.hasOwnProperty(name)) {
            concats[name] = new concat(isUsingSourceMaps, name, opt.newLine);
            firstFiles[name] = new gulpUtil.File(file);
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

    write = function(file, enc, cb) {
        var name, pattern;
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // we dont do streams (yet)
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-concat-cc', 'Streaming not supported'));
            cb();
            return;
        }

        for(name in opt.patterns) {
            pattern = opt.patterns[name];
            console.log("path matched: %o", file.relative);
            if(typeof pattern === "string") {
                if(minimatch(file.relative, pattern)){
                    _concat(file, name, cb);
                }
            }

            if (pattern instanceof Array) {
                for(var i=0; i< pattern.length; i++) {
                    if(minimatch(file.path, pattern)) {
                        _concat(file, name, cb);
                        break;
                    }
                }
            }
        }

        cb();
    }

    function end(cb) {
        for(var name in concats) {
            this.push(_createFile(name, concats[name]));
        }

        cb();
    }

    return through.obj(write, end);
};