/**
 * 更新模块
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

    init:function(){
        this._am = null;                    //AssetsManager Instance
        this._localVersion = "1.0.0.0";
        this._checkListener = null;
        this._updateListener = null;
        this._retryCount = 0;
    },

    onDestroy:function(){
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }

        if(this._updateListener){
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
    },

    start:function() {
        //检测是否更新成功，如果已经更新成功，则跳过更新逻辑
        if(cachedata){
            if(cachedata.get("updated")){
                this.skipUpdate();
                return;
            }
        }

        this.init();
        
        if(!cc.sys.isNative){
            //web env, goto login
            this.skipUpdate();
            return;
        }

        let versionCompareHandle = function(versionA, versionB){
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
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
        }

        //load local version
        var storage_path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'hall';
        this._am = new jsb.AssetsManager(cc.url.raw('resources/project.manifest'), storage_path, versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }


        let localAsset = this._am.getLocalManifest();
        //本地project.manifest加载失败,跳过更新,此处可上传统计信息，用于分析更新模块异常
        if(!localAsset || !localAsset.isLoaded()) {
            this.skipUpdate();
            return;
        }

        //show local version
        this._localVersion = localAsset.getVersion();
        this.node.emit("update_version", this._localVersion);
        
        //检测更新
        this.checkUpdate();
    },

    /**
     * 检测更新
     */
    checkUpdate:function(){
        this.node.emit("update_check");
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

        this.node.emit("update_start");
        this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
        cc.eventManager.addListener(this._updateListener, 1);

        this._am.update();
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
                this.node.emit('update-progress', event);
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
            this.node.emit('update-finish');
        }
    },

    /**
     * 跳转登录
     */
    skipUpdate:function(){
        // this.node.emit("update-skip");
        this.scheduleOnce(() => this.node.emit('update-skip'), 0);
    },

    /**
     * 尝试重新下载
     */
    retryUpdate:function(){
        this.skipUpdate();
    },  

});
