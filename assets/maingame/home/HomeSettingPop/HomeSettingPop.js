cc.Class({
    extends: cc.Component,

    properties: {
        musicSlide: require('SlideProgress'),
        soundSlide: require('SlideProgress'),
        horseLamp:cc.Node,
        radioBtn: cc.Sprite,
        radioIcons: [cc.SpriteFrame],
    },

    onLoad() {
        this.musicSlide.node.on('slide', () => cc.Sound.setMusicVol(this.musicSlide.progress));
        this.soundSlide.node.on('slide', () => cc.Sound.setSoundVol(this.soundSlide.progress));

        var data = ff.AccountManager.switchConfig.data;
        this.horseLamp.active = data[33].state;
    },

    start() {
        this.musicSlide.progress = cc.Sound.getMusicVol();
        this.soundSlide.progress = cc.Sound.getSoundVol();
    },

    onLogoutClicked(event) {
        // require('CCGlobal').accessToken = '';
        // cc.Proxy('logOut').listen('RES_LOG_OUT').called(event => {
        //     this.node.emit('close');
        //     ff.AccountManager.emit('EVENT_USER_LOGOUT');
        // });
        this.node.emit('close');
        cc.director.loadScene('GameLobbyScene');
    },

    initData(data) {
        this.isShowHorseLamp = data;
        this.showToggleFlag();
    },

    onHorseLamp() {
        this.isShowHorseLamp = !this.isShowHorseLamp;
        this.showToggleFlag(this.isShowHorseLamp);
    },

    showToggleFlag() {
        var type = this.isShowHorseLamp ? 1 : 0;
        if(type) this.radioBtn.node.x = 20;
        else this.radioBtn.node.x = 8;
        this.radioBtn.spriteFrame = this.radioIcons[type];
    },

    onClosePop() {
        this.node.emit('close', this.isShowHorseLamp);
    },
});
