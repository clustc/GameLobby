var cachedata = null;
(function(){
    if(typeof CacheData != 'undefined'){
        cachedata = CacheData.getInstance();
    };
})();

cc.Class({
    extends: cc.Component,

    properties: {
        accountNode:cc.Node,
        musicBgBtnOn:cc.Node,
        musicBgBtnOff:cc.Node,
        musicEffectBtnOn:cc.Node,
        musicEffectBtnOff:cc.Node,

        btnClear:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var  isOpen = cc.sys.localStorage.getItem('LobbyBgMusic');
        if (isOpen == null ){
            this.musicBgBtnOn.active = true;
            this.musicBgBtnOff.active = false;
        }else{
            isOpen = parseInt(isOpen);
            cc.log('true    '+(isOpen == 1));
            if(isOpen == 1){
                cc.log('isOpen   '+isOpen);
                this.musicBgBtnOn.active = true;
                this.musicBgBtnOff.active = false;
            }else{
                cc.log('isOpen111   '+isOpen);
                this.musicBgBtnOn.active = false;
                this.musicBgBtnOff.active = true;
            }
        }
        

        var effect = cc.sys.localStorage.getItem('LobbyEffect');
        if (effect == null ){
            this.musicEffectBtnOn.active = true;
            this.musicEffectBtnOff.active = false;
        }else{
            effect = parseInt(effect);
            if(effect == 1){
                this.musicEffectBtnOn.active = true;
                this.musicEffectBtnOff.active = false;
            }else{
                this.musicEffectBtnOn.active = false;
                this.musicEffectBtnOff.active = true;
            }
        }

        this.btnClear.on('click', this.ClearCache, this);
        
    },

    toggleAccount:function(){
        if (this.accountNode.active == false){
            this.accountNode.active = true;
        }else{
            this.accountNode.active = false;
        }
    },

    confirmQuitAccount:function(){
        this.node.emit('close');
        // require('CCGlobal').accessToken = '';
        // cc.sys.localStorage.removeItem('refreshToken');
        // cc.director.loadScene('LoginScene');
        cc.Proxy('exit').called();
    },
    cancelQuitAccount:function(){
        this.accountNode.active = false;
    },  
    //背景音乐开关
    muiscToggleClick:function(){
        cc.log('212312');
        if (this.musicBgBtnOn.active){
            cc.log('212312dsadsds');
            this.musicBgToggleOn();
            cc.sys.localStorage.setItem('LobbyBgMusic',0);
        }else{
            cc.log('212312dsadsadsadsads');
            this.musicBgToggleOff();
            cc.sys.localStorage.setItem('LobbyBgMusic',1);
        }
    },
    musicBgToggleOn:function(){
        this.musicBgBtnOn.active = false;
        this.musicBgBtnOff.active = true;
        cc.Sound.setMusicVol(0);

    },
    musicBgToggleOff:function(){
        this.musicBgBtnOn.active = true;
        this.musicBgBtnOff.active = false;
        cc.Sound.setMusicVol(1);
    },
    //音效开关
    musicEffectClcik:function(){
        if (this.musicEffectBtnOn.active){
            this.musicEffectToggleOn();
            cc.sys.localStorage.setItem('LobbyEffect',0);
        }else{
            this.musicEffectToggleOff();
            cc.sys.localStorage.setItem('LobbyEffect',1);
        }
    },
    musicEffectToggleOn:function(){
        this.musicEffectBtnOn.active = false;
        this.musicEffectBtnOff.active = true;
        cc.Sound.setSoundVol(0);
    },
    musicEffectToggleOff:function(){
        this.musicEffectBtnOn.active = true;
        this.musicEffectBtnOff.active = false;
        cc.Sound.setSoundVol(1);
    },
    start () {

    },

    ClearCache:function(){
        if(cachedata){
            let str_game_list = cachedata.get('name_list');
            if(str_game_list){
                let game_list = JSON.parse(str_game_list);
                let storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/');
                for(let i = 0; i<game_list.length; ++i){
                    let gamePath = storagePath + game_list[i] + '/';
                    jsb.fileUtils.removeDirectory(gamePath);
                }
                cachedata.set("loaded_subgame_list", "");
            }
        }
    },  

    // update (dt) {},
});
