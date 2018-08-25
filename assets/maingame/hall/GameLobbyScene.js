const Global = require("CCGlobal");

var cachedata = null;
(function(){
    if(typeof CacheData != 'undefined'){
        cachedata = CacheData.getInstance();
    };
})();

var getLoadedGameList = function(){
    let list = [];
    if(cachedata){
        let strList = cachedata.get("loaded_subgame_list");
        if(strList){
            list = JSON.parse(strList);
        }
    }
    return list;
};

var setGameLoaded = function(gameName){
    let list = getLoadedGameList();
    if(list.indexOf(gameName) >= 0){
        return;
    }

    list.push(gameName);
    if(cachedata){
        cachedata.set("loaded_subgame_list", JSON.stringify(list));
    }
};

var checkGameLoaded = function(gameName){
    let list = getLoadedGameList();
    return list.indexOf(gameName) >= 0;
};

var openSubGame = function(gameName){
    cc.log("open sub game ", gameName);
    //关闭大厅BG
    cc.Sound.stopMusic('lobbyBg');
    let storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + gameName; 
    cachedata.set("loadPath", storagePath)
    cc.audioEngine.uncacheAll();        //uncacheAll区别于stopAll
    cc.loader.clear();                  //重置所有下载回调为空
    cc.game.restart();
};



cc.Class({
    extends: cc.Component,

    properties: {
        userInfo:require('LobbyUserInfo'),
        contentor:cc.Node,
        gameIconPrefab:cc.Prefab,
        gameIconDict:[cc.SpriteFrame],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //判断是否直接跳转大厅
        cc.Proxy('hideLoading').called();
    },

    start(){
        this.node.on('end_load_persist_node', this.onEndLoadPersistNode, this);
        this.node.getComponent(cc.Canvas).addPersistNodes();

        this.scheduleOnce(this.delayLoad,0);
    },

    onEndLoadPersistNode(){
        if(cachedata){
            let str_login_data = cachedata.get("login_data");
            if(str_login_data){
                let login_data = JSON.parse(str_login_data);
                ff.GameManager.onGetToken(login_data);
            }
        }

        this._curSubGame = null;       //当前正在进入的子游戏
        this.spriteMap = {};
        
        for (var i = 0; i< this.gameIconDict.length;i++){
            var name = this.gameIconDict[i].name;
            var key = name.substring(7);
            this.spriteMap[key] = this.gameIconDict[i];
        }
        ff.AccountManager.on('EVENT_REFRESH_GOLDAMOUNT', this.refreshUserInfo, this);
        cc.Linker('UicPersonalInfo').request(data=>this.userInfo.initData(data));
        ff.AccountManager.on('EVENT_USER_LOGOUT', this.onUserLogout, this);

        this.loadGameList();

        this.node.on('subgame_start_download', this.onSubgameStartDownLoad, this);
        this.node.on('subgame_start_update', this.onSubgameStartUpdate, this);
        this.node.on('subgame-skip', this.onUpdateSkip, this);
        this.node.on('subgame-failed', this.onDownLoadFailed, this);
        this.node.on('subgame-progress', this.onUpdateProgress, this);
        this.node.on('subgame-finish', this.onUpdateFinish, this);
    },

    /**
     * 延时加载特效资源
     */
    delayLoad(){
        var isOpen = cc.sys.localStorage.getItem('LobbyBgMusic');
        this.node.getComponent(cc.Canvas).setSceneMusic('lobbyBg');
        cc.log('isOpen    '+isOpen);
        if (isOpen == null){
            cc.Sound.setMusicVol(1);
        }else{
            isOpen = parseInt(isOpen);
            if (isOpen == 1){
                cc.Sound.setMusicVol(1);
            }else{
                cc.Sound.setMusicVol(0);
            }
        }

        cc.loader.loadRes('hall/guangdian', (error, prefab)=>{
            if(error){
                cc.log(error);
            }else{
                let node = cc.instantiate(prefab);
                node.parent=this.node;
            }
        });

        cc.loader.loadRes('hall/shedeng', (error, prefab)=>{
            if(error){
                cc.log(error);
            }else{
                let node = cc.instantiate(prefab);
                node.parent=this.node;
                node.x = -344;
                node.y = 386;
            }
        });
    },

    refreshUserInfo:function(){
        cc.Linker('UicPersonalInfo').request(data=>this.userInfo.initData(data));
    },

    loadGameList:function(){  
        if(cachedata){
            let str_game_list = cachedata.get('game_list');     
            if(str_game_list){
                let game_list = JSON.parse(str_game_list);
                this.initGameList(game_list);
                return;
            }
        }

        cc.Linker('GameList').request(data=>this.initGameList(data));
    },

    initGameList:function(data){
        if(!this._subgameMap){
            this._subgameMap = [];
        }

        let gameList = data.gameList;
        let nameList = [];
        let device = cc.view.getFrameSize();
        let designHeight = 750;
        let desingWidth = 1334;
        let height = device.height / device.width * desingWidth;
        let nodeSY = (height / designHeight);
        nodeSY = nodeSY>1?1:nodeSY;
        if (nodeSY < 1 ) {
            this.contentor.getComponent(cc.Layout).spacingX = 2;//this.contentor.getComponent(cc.Layout).spacingX * nodeSY;
        }
        for (var i = 0; i< gameList.length;i++){
            var game = gameList[i];
            var node = cc.instantiate(this.gameIconPrefab);
            node.on('click',this.gameIconClick,this);
            let comp = node.getComponent(node.name);
            comp.initData('game_'+game.type,this.spriteMap[game.type+'']);
            node.cfg = game;
            let nodeHeight = node.height;
            node.scale = nodeSY;
            node.y = node.y + nodeHeight * (1 - nodeSY)/2;
            node.parent = this.contentor;
            this._subgameMap[game.remark] = comp;

            nameList.push(game.remark);
        }

        if(cachedata){
            cachedata.set('name_list', JSON.stringify(nameList));
        }
    },

    /**
     * 开始下载子游戏
     */
    onSubgameStartDownLoad:function(){
        if(this._curSubGame){
            let name = this._curSubGame.remark;
            let comp = this._subgameMap[name];
            comp && comp.startLoad(true);
        }
    },

    /**
     * 开始更新子游戏 
     */
    onSubgameStartUpdate:function(){
        if(this._curSubGame){
            let name = this._curSubGame.remark;
            let comp = this._subgameMap[name];
            comp && comp.startLoad(false);
        }
    },

    /**
     * 无需更新 直接进入
     */
    onUpdateSkip:function(){
        this.onUpdateFinish();
    },

    /**
     * 下载失败(非更新失败), 无法进入
     */
    onDownLoadFailed:function(){
        if(this._curSubGame){
            let name = this._curSubGame.remark;
            let comp = this._subgameMap[name];
            comp && comp.failLoad();
        }
        this._curSubGame = null;
    },  

    /**
     * 更新进度
     */
    onUpdateProgress:function(event){
        let evt = event.detail;
        
        let gameName = this._curSubGame.remark;
        let comp = this._subgameMap[gameName];
        if(comp){
            comp.progressLoad(evt);
        }
    },

    /**
     * 更新完成 进入
     */
    onUpdateFinish:function(){
        let gameName = this._curSubGame.remark;
        this._curSubGame = null;

        setGameLoaded(gameName);
        openSubGame(gameName);
    },


    gameIconClick:function(evt){
        let node = evt.target;
        let cfg = node.cfg;
        this.enterGame(cfg);
    },

    /**
     * 进入子游戏入口
     */
    enterGame:function(cfg){
        if(this._curSubGame) return;

        this._curSubGame = cfg;
        let gameId = cfg.type;

        cc.log("id : ", cfg.id, ", name : ", cfg.name, ", remark : ", cfg.remark);
        if (gameId == 10){  //fish
            this.onEnterFishScene();
            return;
        }

        if(!cc.sys.isNative){
            //web env, goto login
            return;
        }
        

        let subGameName = cfg.remark;
        if(checkGameLoaded(subGameName)){
            openSubGame(subGameName);
            return;
        }else{
            this.node.emit("enter_game", cfg);
        }

    },  

    onEnterFishScene:function(){
        ff.AccountManager.on('EVENT_USER_LOGOUT', this.onUserLogout, this);
        cc.Transfer.show('正在进入捕鱼中...');
        var self = this;
        ff.AccountManager.once('EVENT_REFRESH_ACCOUNT', () => {
            cc.log('EVENT_REFRESH_ACCOUNT  .......');
            //与加载游戏
            ff.ConstAssets.loadFishAnims((completedCount,totalCount,item)=>{

            },()=>{
                var percent = 0;
                cc.loader.onProgress = function (complete, total, item) {
                    var rate = complete / total;
                    if (rate > percent) {
                        percent = rate;
                        cc.Transfer.setProgress(percent);
                    }
                };
                cc.director.loadScene('HomeScene',() => cc.Transfer.hide());
            });
            
        })
        ff.AccountManager.onGetToken({accessToken:Global.accessToken}, () => cc.Transfer.hide());
    },

    onUserLogout() {
        cc.log('onUserLogout    ');
        cc.Popup.clearPopups();
        ff.AccountManager.off('EVENT_USER_LOGOUT', this.onUserLogout, this);
        cc.Proxy('exit').called();
        // Global.accessToken = '';
        // ff.AccountManager.off('EVENT_USER_LOGOUT', this.onUserLogout, this);
        // cc.director.loadScene('LoginScene', () => delete ff.AccountManager);
    },

    bottomBarItemClick:function(evt,customeData){
        switch (parseInt(customeData)){
            case 0:
                cc.Popup('NewSendGiftPop').outsideClose(false).show();
                break;
            case 1:
                cc.Popup('NewRecordPop').show();
                break;
            case 2:
                cc.Popup('ShopMallPop').show();
                break;
            case 3:
                cc.Popup('NewEmailPop').show();
                break;
        }
    },

    openSettingPop:function(){
        cc.Popup('NewSettingPop').show();
    },

    openExchangePop:function(){
        cc.Popup('NewExchangePop').outsideClose(false).show();
    },

    logOut:function(){
        cc.Popup('GameExitPop').show();
    },

});
