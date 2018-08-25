'use strict';


module.exports = {
    load () {
        // 当 package 被正确加载的时候执行
    },

    unload () {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        'test'(event, args){
            Editor.log(args);
        },
        'showPanel'(){
            Editor.Panel.open('hot-update-tools');
        },
        'showBmFont'(){
            Editor.Panel.open('test');
        },
        // 当插件构建完成的时候触发
        'editor:build-finished': function (event, target) {
            var Fs = require("fire-fs");
            var Path = require("fire-path");

            var root = Path.normalize(target.dest);
            var url = Path.join(root, "main.js");
            Fs.readFile(url, "utf8", function (err, data) {
                if (err) {
                    throw err;
                }

                var newStr =
                    "(function () { \n"+
                    "\n"+
                    "    if (cc && cc.sys.isNative) { \n" +
                    "        var hotUpdateSearchPaths = cc.sys.localStorage.getItem('" + target.title + "_HotUpdateSearchPaths'); \n" +
                    "        if (hotUpdateSearchPaths) { \n" +
                    "            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths)); \n" +
                    "            console.log('[main.js] 热更新SearchPath: ' + JSON.parse(hotUpdateSearchPaths));\n"+
                    "        }\n" +
                    "    }\n"+
                    "    // 这是为了解决一个重启的 bug 而添加的\n"+
                    "    cc.director.startAnimation();\n";

                var newData = data.replace("(function () {", newStr);
                Fs.writeFile(url, newData, function (error) {
                    if (err) {
                        throw err;
                    }
                    Editor.log("[HotUpdateTools] SearchPath updated in built main.js for hot update");
                });
            });
        }
    },
};