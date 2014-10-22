/*!
 * index
 * @author ydr.me
 * @create 2014-10-22 18:38
 */

'use strict';

var log = require('../libs/log.js');
var config = require('./build-config.js');
var path = require('path');
var CWD = process.cwd();
var cmdArgs = process.argv.slice(2);
var cmdArg0 = cmdArgs[0];
var cmdArg1 = cmdArgs[1];
var PKG = require('../package.json');
var buildPath= cmdArg1 ? path.join(CWD, cmdArg1) : CWD;

switch ((cmdArg0||'').toLowerCase()) {
    case 'version':
        log('version', PKG.version, 'success');
        break;

    case 'check':
        // 检查更新
        break;

    case 'config':
        config(buildPath);
        break;
//
//    case 'json':
//        json(cmdArg1 ? path.join(CWD, cmdArg1) : CWD);
//        break;
//
//    case 'build':
//        build(cmdArg1 ? path.join(CWD, cmdArg1) : CWD);
//        break;

    default:
        log(true, 'coolie help', '输出帮助信息', 'success');
        log(true, 'coolie version', '输出版本号', 'success');
        log(true, 'coolie check', '检查更新', 'success');
        log(true, 'coolie config [path]', '在指定目录覆盖生成`coolie-config.js`', 'success');
        log(true, 'coolie json [path]', '在指定目录覆盖生成`coolie.json`', 'success');
        log(true, 'coolie build [path]', '在指定目录执行构建操作', 'success');
}
