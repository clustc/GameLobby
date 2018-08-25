const SHOW_INTERVAL = 5;
cc.Class({
    extends: cc.Component,

    properties: {
        openBtn: cc.Node,
        closeBtn: cc.Node,
        exitBtn: cc.Node,
        soundBtn: cc.Toggle,
    },

    onLoad() {
        this.scheduleOnce(this.init, 0);
    },

    init() {
        this.showTimer = 0;
        this.showX = this.node.x;
        this.hideX = this.showX + 102;
        this.openBtn.on('click', this.showMenu, this);
        this.closeBtn.on('click', this.hideMenu, this);
        this.exitBtn.on('click', this.onBackHomeScene, this);
        this.soundBtn.node.on('toggle', this.onSoundToggle, this);
        if(cc.Sound.getMusicVol() + cc.Sound.getSoundVol() == 0) this.soundBtn.uncheck();
        ff.ControlManager.node.on('touch-screen', this.hideMenu, this);
    },

    showMenu() {
        if (this.node.getNumberOfRunningActions() > 0) return;
        if(this.node.x < this.hideX - 10) return;
        this.node.runAction(cc.sequence(
            cc.moveTo(0.5, this.showX, this.node.y).easing(cc.easeSineOut()),
            cc.callFunc(this.onShown, this)
        ))
    },

    hideMenu() {
        if (this.node.getNumberOfRunningActions() > 0) return;
        if(this.node.x > this.showX + 10) return;
        this.node.runAction(cc.sequence(
            cc.moveTo(0.5, this.hideX, this.node.y).easing(cc.easeSineOut()),
            cc.callFunc(this.onHiden, this)
        ))
    },

    onShown() {
        this.openBtn.active = false;
        this.closeBtn.active = true;
        this.showTimer = 0;
    },

    onHiden() {
        this.openBtn.active = true;
        this.closeBtn.active = false;
        this.showTimer = SHOW_INTERVAL * 2;
    },

    onBackHomeScene() {
        cc.Popup('FishGameExitPop').outsideClose(false).show(pop => {
            pop.init('exitRoom');
        }, close => {
            if(close) {
                ff.WSLinkManager.send('ExitRoomMsg');
                ff.GameManager.loadScene('HomeScene');
            }
        });
    },

    onSoundToggle() {
        var vol = this.soundBtn.isChecked ? 1 : 0;
        cc.Sound.setMusicVol(vol);
        cc.Sound.setSoundVol(vol);
    },

    onFishSpeciesPop(){
        // ff.BuryingPoint(3402000013);
         cc.Popup('FishSpeciesPop').show();
    },

    update(dt){
        if (this.showTimer > SHOW_INTERVAL) return;
        this.showTimer += dt;
        if (this.showTimer > SHOW_INTERVAL) this.hideMenu();
    }
});
