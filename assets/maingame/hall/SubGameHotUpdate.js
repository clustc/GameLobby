/**
 * 子游戏更新模块
 */
var cachedata = null;
(function(){
    if(typeof CacheData != 'undefined'){
        cachedata = CacheData.getInstance();
    };
})();

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad : function() {
        this.gameCfg = null;
        this._am = null;
        this._checkListener = null;
        this._updateListener = null;       
        this.storagePath = null;

        this.node.on('enter_game', this.onEnterGame, this);
    },

    start : function() {

    },

    onDestroy:function(){
       this.clearAssetsManager();
    },

    clearAssetsManager:function(){
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
            this._am = null;
        }

        if(this._updateListener){
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
    },


    /**
        gameCfg = {
            awardsPool:null,
            corner:"https://file.beeplay123.com/group1/M00/01/4C/wKgKZVoBdvOAAUAjAAdc-bM8d9Y321.gif",
            extraFlag:0,
            gif:"https://file.beeplay123.com/group1/M00/01/4C/wKgKZVoBdvOAFtqAAAdc-bM8d9Y734.gif",
            icon:"https://file.beeplay123.com/group1/M00/01/4C/wKgKZVoBdvOAWDsgAAdc-bM8d9Y933.gif",
            id:10,
            name:"捕鱼",
            remark:"fish",
            sort:1,
            type:10,
            url:"http://game-api.yingdd888.com/fish/",
        }
    */
    onEnterGame:function(event){
        let gameCfg = event.detail;
        this.gameCfg = gameCfg;
        this._downloaded = true;       //默认已下载
        cc.log("game cfg ", gameCfg);
        

        let subGameName = gameCfg.remark;   // gameCfg.remark
        let remoteUrl = gameCfg.url;        //gameCfg.url

        let storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + subGameName; 
        this.storagePath = storagePath;
        cc.log("[sub game local storage path] : ", storagePath);

        
        this.clearAssetsManager();
        
        this._am = new jsb.AssetsManager("", storagePath, this.localVersionCompare);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }else{
            this._am.setMaxConcurrentTask(10);
        }

        let localManifest = new jsb.Manifest(storagePath + "/project.manifest");
        if(!localManifest.isLoaded()){
            this._downloaded = false;
            //该子游戏未下载
            let json = JSON.stringify({
                "packageUrl": remoteUrl,
                "remoteManifestUrl": remoteUrl + "/project.manifest",
                "remoteVersionUrl": remoteUrl + "/version.manifest",
                "version": "0.0.0.0",
                "assets": {},
                "searchPaths": []
            });
            localManifest.parseJSONString(json, storagePath);

            this.node.emit("subgame_start_download");   //未下载
        }

        cc.log("[sub game remote storage path] : ", localManifest.getPackageUrl());

        this._am.loadLocalManifest(localManifest, storagePath);

        this._am.setVersionCompareHandle(this.remoteVersionCompare);
        this.checkUpdate();
    },

    /**
     * 本地版本比较, 防止cache目录被删除
     */
    localVersionCompare:function(versionA, versionB){
        cc.log("local Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        return -1;
    },

    /**
     * 远端版本比较
     */
    remoteVersionCompare:function(versionA, versionB){
        cc.log("remote Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if(vA.length < vB.length){
            return -1;
        }else{
            return 0;
        }
    },



    /**
     * 检测更新
     */
    checkUpdate:function(){
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
    },

    /**
     * 更新检测回调
     */
    checkCb:function(event){
        cc.log('Code: ' + event.getEventCode());
        let needUpdate = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("[hot update] No local manifest file found, hot update skipped.")
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                cc.log("[hot update] Fail to download remote manifest, hot update skipped.")
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("[hot update] Fail to parse manifest file, hot update skipped.")
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("[hot update] Already up to date with the latest remote version.")
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log("[hot update] new version found!")
                needUpdate = true;
                break;
            default:
                return;
        }

        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;

        needUpdate ? this.hotUpdate() : this.skipUpdate();
    },

    /**
     * 更新
     */
    hotUpdate:function(){
        this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
        cc.eventManager.addListener(this._updateListener, 1);

        this._am.update();

        if(this._downloaded){
            this.node.emit("subgame_start_update");   //开始更新
        }
    },
    

    /**
     * 更新进度回调
     */
    updateCb:function(event){
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.onUpdateFinish();
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.hasFailAssets = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.hasErrorAssets = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.node.emit('subgame-progress', event);
                break;
            default:
                break;
        }
    },

    onUpdateFinish:function(){
        if(this.hasFailAssets) {
            this._am.downloadFailedAssets();
        }else if(this.hasErrorAssets){
            this.retryUpdate();
        }else{
            this.node.emit('subgame-finish');
        }
    },

    skipUpdate:function(){
        this.scheduleOnce(() => {
            if(this._downloaded){
                this.node.emit('subgame-skip');
            }else{
                this.node.emit('subgame-failed');
            }
        }, 0.1);
    },

    /**
     * 尝试重新下载
     */
    retryUpdate:function(){
        this.skipUpdate();
    },  
});
