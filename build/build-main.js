/*!
 * 构建入口模块
 * @author ydr.me
 * @create 2014-10-23 19:44
 */


"use strict";

var path = require('path');
var fs = require('fs-extra');
var log = require('../libs/log.js');
var util = require('../libs/util.js');
var Increase = require('../libs/Increase.js');
var buildModule = require('./build-module.js');

module.exports = function (mainFile, callback) {
    var bufferList = [];
    // 入口模块名称
    var mainName = path.basename(mainFile);
    // 自增对象
    var increase = new Increase();
    // 模块绝对路径 <=> ID 对应表
    var depIdsMap = {};
    // 记录已经构建的列表
    var depsCache = {};
    var depsLength = 1;
    var depsRelationship = {};
    var _deepBuld = function (name, file) {
        buildModule(name, file, increase, depIdsMap, function (err, meta) {
            if (err) {
                log("build", util.fixPath(file), "error");
                log('build', err.message, 'error');
                process.exit();
            }

            var code = meta.code;
            var depIdList = meta.depIdList;
            var depNameList = meta.depNameList;
            var output;

            depsCache[mainFile] = true;
            bufferList.push(new Buffer("\n" + code, "utf8"));
            depsRelationship[file] = {};

            if (depIdList.length) {
                depIdList.forEach(function (depId, index) {
                    depsRelationship[file][depId] = true;

                    if (depsRelationship[depId] && depsRelationship[depId][file]) {
                        log('depend cycle', util.fixPath(file) + '\n' + util.fixPath(depId), 'error');
                        process.exit();
                    }

                    if (!depsCache[depId]) {
                        depsCache[depId] = true;
                        log("require", util.fixPath(depId));
                        _deepBuld(depNameList[index], depId);
                        depsLength++;
                    }
                });
            }

            if (depsLength === bufferList.length) {
                output = "/*coolie " + Date.now() + "*/" +
                Buffer.concat(bufferList).toString();
                callback(null, output);
            }
        });
    };

    depIdsMap[mainFile] = mainName;
    log("build main", util.fixPath(mainFile), "warning");
    _deepBuld(mainName, mainFile);
};
