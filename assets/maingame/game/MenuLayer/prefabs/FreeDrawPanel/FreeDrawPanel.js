const SHOW_X = 150;
const HIDE_X = -160;
const SHOW_INTERVAL = 3;

cc.Class({
    extends: cc.Component,

    properties: {
        freeDrawText: cc.Node,
        progressBar: cc.ProgressBar,
        progressLabel: cc.Label,
        awardPool: cc.Label,
        statePanel: cc.Node,
        freeDrawBtn: cc.Node,
        unlockAnim: cc.Node,
    },

    onLoad() {
        this.showTimer = SHOW_INTERVAL * 2;
        this.freeDrawConfig = null;
        this.userData = null;
        this.freeDrawBtn.on('click', this.onFreeDrawClick, this);
        this.statePanel.on('click', this.onPanelClick, this);
        ff.FishManager.node.on('caught-fish', this.judgeFishType, this);
        ff.AccountManager.shopConfig.on('EVENT_REFRESH_FREEDRAW', this.initFreeDrawData, this);
        // this.initFreeDrawData();
    },

    onDestroy() {
        this.node.off('click', this.onFreeDrawPop, this);
        ff.AccountManager.shopConfig.off('EVENT_REFRESH_FREEDRAW', this.initFreeDrawData, this);
    },

    initFreeDrawData() {
        ff.AccountManager.shopConfig.refreshFreeDrawData((data) => {
            this.freeDrawConfig = data;
            this.onFreeDrawClick();
        })
    },

    onFreeDrawClick() {
        this.getUserData(() => {
            (this.showTimer == SHOW_INTERVAL * 2) ? this.showPanel() : this.hidePanel();
        });
    },

    onPanelClick() {
        /**游戏-抽奖 */
        ff.BuryingPoint(3402000020);
        cc.Popup('FreeDrawPop').show((item) => {
            item.initData(this.freeDrawConfig, this.userData);
        })
    },

    getUserData(cbk, isHitFish) {
        //获取用户数据
        cc.Linker('GetDrawCondition').request((msg) => {
            if (this.userData && (isHitFish == 'isHitFish')) {
                if (this.userData.kill == msg.kill || this.userData.score == msg.score) {
                    return;
                }
            }
            this.unschedule(this.hitFishShow);
            this.userData = msg;
            this.setAwardPool();
            this.setProgress();
            cbk && cbk(this);
        });
    },

    setAwardPool() {
        this.awardPool.string = this.userData.score;
    },

    setProgress() {
        var MaxKill = this.freeDrawConfig[0].kill;
        var flag = this.userData.kill >= MaxKill;
        this.unlockAnim.active = flag;
        this.freeDrawText.active = flag;
        this.progressBar.node.active = !flag;
        if (flag) return;
        this.progressBar.progress = this.userData.kill / MaxKill;
        this.progressLabel.string = this.userData.kill + '/' + MaxKill;
    },

    hitFishShow() {
        this.getUserData(this.showPanel, 'isHitFish');
    },

    judgeFishType(event) {
        var fish = event.detail;
        if (fish.info.type == 'AWARD') {
            this.unschedule(this.hitFishShow);
            this.schedule(this.hitFishShow, 1);
        }
    },

    showPanel(that) {
        that = that || this;
        if (that.statePanel.getNumberOfRunningActions() > 0) return;
        if (that.statePanel.x > HIDE_X + 10) return;
        that.statePanel.runAction(cc.moveTo(0.5, SHOW_X, that.statePanel.y).easing(cc.easeSineOut()));
        that.showTimer = 0;
    },

    hidePanel() {
        if (this.statePanel.getNumberOfRunningActions() > 0) return;
        if (this.statePanel.x < SHOW_X - 10) return;
        this.statePanel.runAction(cc.moveTo(0.5, HIDE_X, this.statePanel.y).easing(cc.easeSineOut()));
        this.showTimer = SHOW_INTERVAL * 2;
    },

    update(dt) {
        if (this.showTimer > SHOW_INTERVAL) return;
        this.showTimer += dt;
        if (this.showTimer > SHOW_INTERVAL) this.hidePanel();
    },
});
