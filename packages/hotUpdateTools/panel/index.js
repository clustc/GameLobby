'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const Electron = require('electron');
const {remote} = require('electron');
Editor.Panel.extend({
    style: fs.readFileSync(Editor.url('packages://hot-update-tools/panel/index.css', 'utf8')) + "",
    template: fs.readFileSync(Editor.url('packages://hot-update-tools/panel/index.html', 'utf8')) + "",
    $: {},
    ready () {
        // 初始化vue面板
        new window.Vue({
            el: this.shadowRoot,
            created: function () {
                this._initPluginCfg();
            },
            init: function () {
                console.log("vue init");
            },
            data: {
                srcDirPath: "srcDirPath",
                resDirPath: "resDirPath",
                projManifestPath: "projManifestPath",
                verManifestPath: "verManifestPath",

                version: "",
                genManifestDir: "",
                serverRootDir: "",
                resourceRootDir: "",
                localServerPath: "",
                
                android_force_update: true,
                
                android_version: "",
                android_url: "",
                android_msg: "",
                
                ios_force_update: true,
                
                ios_version: "",
                ios_url: "",
                ios_msg: "",
                
                logView: "",

                copyProgress: 0,
                totalNum: 0,// 操作文件总数
                curNum: 0,// 当前操作的次数
            },
            methods: {
                _addLog(str){
                    var time = new Date();
                    this.logView = "[" + time.toLocaleString() + "]: " + str + "\n" + this.logView;
                },
                _getFileIsExist(path){
                    try {
                        fs.accessSync(path, fs.F_OK);
                    } catch (e) {
                        return false;
                    }
                    return true;
                },
                _getAppCfgPath(){
                		return path.join(Editor.projectInfo.path, 'settings') + "\\hotUpdateConfig.json";
                    //return remote.app.getPath('userData') + "\\hotUpdateConfig.json";
                },
                onCleanAPPCfg(){
                    fs.unlink(this._getAppCfgPath());
                },
                _saveConfig(){
                    let configFilePath = this._getAppCfgPath();
                    var data = {
                        version: this.version,
                        serverRootDir: this.serverRootDir,
                        resourceRootDir: this.resourceRootDir,
                        genManifestDir: this.genManifestDir,
                        localServerPath: this.localServerPath,
                        
                        "android":{
                            "version": this.android_version,
                            "url": this.android_url,
                            "message": this.android_msg,
                            "forceUpdate": this.android_force_update,
                        },
                        
                        "ios": {
                            "version": this.ios_version,
                            "url": this.ios_url,
                            "message": this.ios_msg,
                            "forceUpdate": this.ios_force_update,
                        },
                    };
                    fs.writeFile(configFilePath, JSON.stringify(data), function (error) {
                        if (!error) {
                            console.log("保存配置成功!");
                        }
                    });
                },
                _initPluginCfg(){
                    let configFilePath = this._getAppCfgPath();
                    var b = this._getFileIsExist(configFilePath);
                    if (b) {
                        var plugin = this;
                        fs.readFile(configFilePath, 'utf-8', function (err, data) {
                            if (!err) {
                                var saveData = JSON.parse(data.toString());
                                Editor.log(data.toString());
                                plugin.version = saveData.version;
                                plugin.serverRootDir = saveData.serverRootDir;
                                plugin.resourceRootDir = saveData.resourceRootDir;
                                plugin.genManifestDir = saveData.genManifestDir;
                                plugin.localServerPath = saveData.localServerPath;
                                
                                plugin.android_version = saveData.android.version;
                                plugin.android_url = saveData.android.url;
                                plugin.android_msg = saveData.android.message;
                                plugin.android_force_update = saveData.android.forceUpdate;

                                plugin.ios_version = saveData.ios.version;
                                plugin.ios_url = saveData.ios.url;
                                plugin.ios_msg = saveData.ios.message;
                                plugin.ios_force_update = saveData.ios.forceUpdate;
                            }
                        });
                    } else {
                        this._saveConfig();
                    }
                },
                onClickGenCfg(event){
                    //Editor.log("android_version = " + this.android_version + ";android_force_update = " + this.android_force_update);
                    //this._saveConfig();
                    //return;
                    //Editor.Ipc.sendToMain('hotUpdateTools:test', 'Hello, this is simple panel');
                    if (!this.version || this.version.length <= 0) {
                        this._addLog("版本号未填写");
                        return;
                    }
                    if (!this.serverRootDir || this.serverRootDir.length <= 0) {
                        this._addLog("服务器地址未填写");
                        return;
                    } else {
                        // todo 检测URL有效性
                        this._isUrlAvilable(this.serverRootDir, function (code) {
                        }.bind(this))
                    }

                    if (!this.resourceRootDir || this.resourceRootDir.length <= 0) {
                        this._addLog("资源路径未填写");
                        return;
                    }
                    if (!fs.existsSync(this.resourceRootDir)) {
                        this._addLog("资源目录不存在: " + this.resourceRootDir + ", 请选择构建后的目录");
                        return;
                    } else {
                        var srcPath = path.join(this.resourceRootDir, "src");
                        if (!fs.existsSync(srcPath)) {
                            this._addLog(this.resourceRootDir + "不存在src目录");
                            return;
                        }
                        var resPath = path.join(this.resourceRootDir, "res");
                        if (!fs.existsSync(resPath)) {
                            this._addLog(this.resourceRootDir + "不存在res目录");
                            return;
                        }
                    }

                    if (!this.genManifestDir || this.genManifestDir.length <= 0) {
                        this._addLog("manifest文件生成地址未填写");
                        return;
                    }

                    if (!fs.existsSync(this.genManifestDir)) {
                        this._addLog("目录不存在: " + this.genManifestDir);
                        return;
                    }
                    this._addLog("开始生成manifest配置文件....");
                    this._saveConfig();
                    this._genVersion(this.version, this.serverRootDir, this.resourceRootDir, this.genManifestDir);
                },
                // 是否以斜杠结尾
                _formatPathWithSlantingChar(path){

                },
                // serverUrl 必须以/结尾
                // genManifestDir 建议在assets目录下
                // buildResourceDir 默认为 build/jsb-default/
                // -v 10.1.1 -u http://192.168.191.1//cocos/remote-assets/  -s build/jsb-default/ -d assets
                _genVersion(version, serverUrl, buildResourceDir, genManifestDir){
                    var manifest = {
                        packageUrl: 'http://localhost/cocosCreaterHotUpdate/remote-assets/',
                        remoteManifestUrl: 'http://localhost/cocosCreaterHotUpdate/remote-assets/project.manifest',
                        remoteVersionUrl: 'http://localhost/cocosCreaterHotUpdate/remote-assets/version.manifest',
                        version: '1.0.0',
                        assets: {},
                        searchPaths: []
                    };

                    manifest.version = version;
                    manifest.packageUrl = serverUrl;
                    if (serverUrl[serverUrl.length - 1] == "/") {
                        manifest.remoteManifestUrl = serverUrl + 'project.manifest';
                        manifest.remoteVersionUrl = serverUrl + 'version.manifest';
                    } else {
                        manifest.remoteManifestUrl = serverUrl + '/project.manifest';
                        manifest.remoteVersionUrl = serverUrl + '/version.manifest';
                    }
                    var dest = genManifestDir;
                    var src = buildResourceDir;

                    var readDir = function (dir, obj) {
                        var stat = fs.statSync(dir);
                        if (!stat.isDirectory()) {
                            return;
                        }
                        var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
                        for (var i = 0; i < subpaths.length; ++i) {
                            if (subpaths[i][0] === '.') {
                                continue;
                            }
                            subpath = path.join(dir, subpaths[i]);
                            stat = fs.statSync(subpath);
                            if (stat.isDirectory()) {
                                readDir(subpath, obj);
                            }
                            else if (stat.isFile()) {
                                // Size in Bytes
                                size = stat['size'];
                                md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
                                //md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'utf8')).digest('hex');
                                compressed = path.extname(subpath).toLowerCase() === '.zip';

                                relative = path.relative(src, subpath);
                                relative = relative.replace(/\\/g, '/');
                                relative = encodeURI(relative);
                                obj[relative] = {
                                    'size': size,
                                    'md5': md5
                                };
                                if (compressed) {
                                    obj[relative].compressed = true;
                                }
                            }
                        }
                    };

                    var mkdirSync = function (path) {
                        try {
                            fs.mkdirSync(path);
                        } catch (e) {
                            if (e.code != 'EEXIST') throw e;
                        }
                    }

                    // Iterate res and src folder
                    readDir(path.join(src, 'src'), manifest.assets);
                    readDir(path.join(src, 'res'), manifest.assets);

                    var destManifest = path.join(dest, 'project.manifest');
                    var destVersion = path.join(dest, 'version.manifest');


                    mkdirSync(dest);

                    var plugin = this;
                    // 生成project.manifest
                    fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
                        if (err) throw err;
                        console.log('Manifest successfully generated');
                        plugin._addLog("生成 project.manifest成功");
                    });

                    // 生成version.manifest
                    delete manifest.assets;
                    delete manifest.searchPaths;
                    if(this.android_force_update) {
                    		manifest.android = {
                            "version": this.android_version,
                            "url": this.android_url,
                            "message": this.android_msg
                    			};
                    }
                    if(this.ios_force_update) {
                    	  manifest.ios = {
                            "version": this.ios_version,
                            "url": this.ios_url,
                            "message": this.ios_msg
                    	  	};
                    }
                    fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
                        if (err) throw err;
                        console.log('Version successfully generated');
                        plugin._addLog("生成 version.manifest成功");
                    });
                },
                // 选择物理server路径
                onSelectLocalServerPath(event){
                    let res = Editor.Dialog.openFile({
                        title: "选择本地测试服务器目录",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });
                    if (res != -1) {
                        this.localServerPath = res[0];
                        this._saveConfig();
                    }
                },
                // 拷贝文件到测试服务器
                onCopyFileToLocalServer(){
                    // 检查要拷贝的目录情况
                    if (!fs.existsSync(this.localServerPath)) {
                        this._addLog("本地测试服务器目录不存在:" + this.localServerPath);
                        return;
                    }

                    // 检查资源目录
                    var srcPath = path.join(this.resourceRootDir, "src");
                    var resPath = path.join(this.resourceRootDir, "res");
                    if (!fs.existsSync(this.resourceRootDir)) {
                        this._addLog("资源目录不存在: " + this.resourceRootDir + ", 请先构建项目");
                        return;
                    } else {
                        if (!fs.existsSync(srcPath)) {
                            this._addLog(this.resourceRootDir + "不存在src目录, 无法拷贝文件");
                            return;
                        }
                        if (!fs.existsSync(resPath)) {
                            this._addLog(this.resourceRootDir + "不存在res目录, 无法拷贝文件");
                            return;
                        }
                    }

                    // 检查manifest文件
                    var project = path.join(this.genManifestDir, "project.manifest");
                    var version = path.join(this.genManifestDir, "version.manifest");
                    if (!this.genManifestDir || this.genManifestDir.length <= 0) {
                        this._addLog("manifest文件生成地址未填写");
                        return;
                    } else {
                        if (!this._getFileIsExist(project)) {
                            this._addLog(project + "不存在, 请点击生成配置");
                            return;
                        }
                        if (!this._getFileIsExist(version)) {
                            this._addLog(version + "不存在, 请点击生成配置");
                            return;
                        }
                    }
                    this._addLog("开始拷贝文件到:" + this.localServerPath);
                    this.curNum = 0;
                    this.copyProgress = 0;
                    this.totalNum = this._getTotalNum();
                    this._addLog("操作文件总数据: " + this.totalNum);

                    this._delDir(this.localServerPath);
                    this._copySourceDirToDesDir(srcPath, path.join(this.localServerPath, "src"));
                    this._copySourceDirToDesDir(resPath, path.join(this.localServerPath, "res"));
                    this._copyFileToDesDir(project, this.localServerPath);
                    this._copyFileToDesDir(version, this.localServerPath);
                },

                // 获取要操作的文件总数量
                _getTotalNum(){
                    var delNum = this._getFileNum(this.localServerPath);
                    var srcNum = this._getFileNum(path.join(this.resourceRootDir, "src"));
                    var resNum = this._getFileNum(path.join(this.resourceRootDir, "res"));
                    return delNum + srcNum + resNum + 2 + 2;// 2个manifest,2个目录(src, res)
                },
                addProgress(){
                    this.curNum++;
                    var p = this.curNum / this.totalNum;
                    p = p ? p : 0;
                    console.log("进度: " + p * 100);
                    this.copyProgress = p * 100;
                    if (p >= 1) {
                        this._addLog("拷贝完成");
                    }
                },
                // 获取文件个数
                _getFileNum(url){
                    var i = 0;
                    var lookDir = function (fileUrl) {
                        var files = fs.readdirSync(fileUrl);//读取该文件夹
                        for (var k in files) {
                            i++;
                            var filePath = path.join(fileUrl, files[k]);
                            var stats = fs.statSync(filePath);
                            if (stats.isDirectory()) {
                                lookDir(filePath);
                            }
                        }
                    };
                    lookDir(url);
                    return i;
                },
                _delDir(rootFile){
                    var self = this;
                    //删除所有的文件(将所有文件夹置空)
                    var emptyDir = function (fileUrl) {
                        var files = fs.readdirSync(fileUrl);//读取该文件夹
                        for (var k in files) {
                            var filePath = path.join(fileUrl, files[k]);
                            var stats = fs.statSync(filePath);
                            if (stats.isDirectory()) {
                                emptyDir(filePath);
                            } else {
                                fs.unlinkSync(filePath);
                                self.addProgress();
                                console.log("删除文件:" + filePath);
                            }
                        }
                    };
                    //删除所有的空文件夹
                    var rmEmptyDir = function (fileUrl) {
                        var files = fs.readdirSync(fileUrl);
                        if (files.length > 0) {
                            for (var k in files) {
                                var rmDir = path.join(fileUrl, files[k]);
                                rmEmptyDir(rmDir);
                            }
                            if (fileUrl != rootFile) {// 不删除根目录
                                fs.rmdirSync(fileUrl);
                                self.addProgress();
                                console.log('删除空文件夹' + fileUrl);
                            }
                        } else {
                            if (fileUrl != rootFile) {// 不删除根目录
                                fs.rmdirSync(fileUrl);
                                self.addProgress();
                                console.log('删除空文件夹' + fileUrl);
                            }
                        }
                    };
                    emptyDir(rootFile);
                    rmEmptyDir(rootFile);
                },
                // 拷贝文件到目录
                _copyFileToDesDir(file, desDir){
                    if (this._getFileIsExist(file)) {
                        var readable = fs.createReadStream(file);// 创建读取流
                        var copyFileName = path.basename(file);
                        var fileName = path.join(desDir, copyFileName);
                        var writable = fs.createWriteStream(fileName);// 创建写入流
                        readable.pipe(writable);// 通过管道来传输流
                        this.addProgress();
                    }
                },
                // 拷贝文件夹
                _copySourceDirToDesDir(source, des){
                    var self = this;
                    // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
                    var exists = function (src, dst, callback) {
                        fs.exists(dst, function (exists) {
                            // 已存在
                            if (exists) {
                                callback(src, dst);
                            }
                            // 不存在
                            else {
                                fs.mkdir(dst, function () {
                                    self.addProgress();
                                    callback(src, dst);
                                });
                            }
                        });
                    };
                    /*
                     * 复制目录中的所有文件包括子目录
                     * @param{ String } 需要复制的目录
                     * @param{ String } 复制到指定的目录
                     */
                    var copy = function (src, dst) {
                        // 读取目录中的所有文件/目录
                        fs.readdir(src, function (err, paths) {
                            if (err) {
                                throw err;
                            }
                            paths.forEach(function (path) {
                                var _src = src + '/' + path,
                                    _dst = dst + '/' + path,
                                    readable, writable;
                                fs.stat(_src, function (err, st) {
                                    if (err) {
                                        throw err;
                                    }
                                    if (st.isFile()) {// 判断是否为文件
                                        readable = fs.createReadStream(_src);// 创建读取流
                                        writable = fs.createWriteStream(_dst);// 创建写入流
                                        readable.pipe(writable);// 通过管道来传输流
                                        console.log("拷贝文件:" + _dst);
                                        self.addProgress();
                                    } else if (st.isDirectory()) {// 如果是目录则递归调用自身
                                        exists(_src, _dst, copy);
                                    }
                                });
                            });
                        });
                    };
                    // 复制目录
                    exists(source, des, copy);
                },
                onTestUrl(){
                    var url = this.serverRootDir;
                    if (url.length > 0) {
                        this._isUrlAvilable(url, function (code) {
                            this._addLog(url + " 响应: " + code);
                        }.bind(this));
                    } else {
                        this._addLog("未填写参数");
                    }
                },
                _isUrlAvilable(url, callback){
                    var http = require("http");
                    http.get(url, function (res) {
                        if (callback) {
                            callback(res.statusCode);
                        }
                        //var text;
                        //res.setEncoding('utf8');
                        //res.on('data', function (chunk) {
                        //    text += chunk;
                        //    console.log(text);
                        //});
                    }.bind(this));
                },
                // 访问测试网站
                onOpenUrl(event){
                    var url = this.serverRootDir;
                    if (url.length > 0) {
                        Electron.shell.openExternal(url);
                    } else {
                        this._addLog("未填写参数");
                    }
                },
                // 选择资源文件目录
                onSelectSrcDir(event){
                    let res = Editor.Dialog.openFile({
                        title: "选择Src目录",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                        callback: function (fileNames) {
                            //Editor.Ipc.sendToMain('hotUpdateTools:test', 'Hello, this is simple panel');
                            //var relativePath = path.relative(__dirname, path.join(Editor.projectInfo.path, 'assets'));
                            //console.log(relativePath);
                        },
                    });
                    if (res != -1) {
                        this.srcDirPath = res[0];
                        this._saveConfig();
                    }
                },
                onSelectResDir(){
                    let res = Editor.Dialog.openFile({
                        title: "选择Res目录",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });
                    if (res != -1) {
                        this.resDirPath = res[0];
                        this._saveConfig();
                    }
                },
                // 选择projManifest文件
                onOpenResourceDir(){
                    if (!fs.existsSync(this.resourceRootDir)) {
                        this._addLog("目录不存在：" + this.resourceRootDir);
                        return;
                    }
                    Electron.shell.showItemInFolder(this.resourceRootDir);
                    Electron.shell.beep();
                },
                onOpenManifestDir(){
                    if (!fs.existsSync(this.genManifestDir)) {
                        this._addLog("目录不存在：" + this.genManifestDir);
                        return;
                    }
                    Electron.shell.showItemInFolder(this.genManifestDir);
                    Electron.shell.beep();
                },
                onOpenLocalServer(){
                    if (!fs.existsSync(this.genManifestDir)) {
                        this._addLog("目录不存在：" + this.localServerPath);
                        return;
                    }
                    Electron.shell.showItemInFolder(this.localServerPath);
                    Electron.shell.beep();
                },
                // 选择生成Manifest的目录
                onSelectGenManifestDir(){
                    let res = Editor.Dialog.openFile({
                        title: "选择生成Manifest目录",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });
                    if (res != -1) {
                        this.genManifestDir = res[0];
                        this._saveConfig();
                    }
                },
                onSelectGenServerRootDir(){
                    let res = Editor.Dialog.openFile({
                        title: "选择部署的服务器根目录",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });
                    if (res != -1) {
                        this.serverRootDir = res[0];
                        this._saveConfig();
                    }
                },
                onSelectResourceRootDir(){
                    let res = Editor.Dialog.openFile({
                        title: "选择构建后的根目录",
                        defaultPath: Editor.projectInfo.path,
                        properties: ['openDirectory'],
                    });
                    if (res != -1) {
                        this.resourceRootDir = res[0];
                        this._saveConfig();
                    }
                },
            }
        });
        this._initTest();
    },
    _initTest(){
        //console.log("1111111");
        //Editor.Profile.load('profile://local/builder.json', (err, profile) => {
        //    console.log("1111");
        //});
    },
});