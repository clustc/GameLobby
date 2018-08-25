const SHOW_X = 150;
const HIDE_X = -160;
const SHOW_INTERVAL = 3.5;

cc.Class({
    extends: cc.Component,

    properties: {
        nextLevel: cc.Label,
        unlockLevel: cc.Label,
        progressBar: cc.ProgressBar,
        jewelsRate: cc.Label,
        coinsGive: cc.Label,
        statePanel: cc.Node,
        unlockBtn: cc.Node,
        unlockAnim: cc.Node,
    },

    onLoad() {
        this.showTimer = 0;
        this.unlockBtn.on('click', this.onUnlockClick, this);
        this.statePanel.on('click', this.onPanelClick, this);
        this.onJewelsChange();
        ff.AccountManager.on('EVENT_JEWELS_CHANGE', this.onJewelsChange, this);
        ff.AccountManager.on('EVENT_CANNON_UPGRADE', this.onCannonUpgrade, this);
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_JEWELS_CHANGE', this.onJewelsChange, this);
        ff.AccountManager.off('EVENT_CANNON_UPGRADE', this.onCannonUpgrade, this);
    },

    onUnlockClick() {
        (this.showTimer == SHOW_INTERVAL * 2) ? this.showPanel() : this.hidePanel();
    },

    onPanelClick() {
        if (this.unlockLevel.node.parent.active) {
            ff.AccountManager.cannonConfig.upgradeCannonLevel();
            ff.BuryingPoint(3402000012, {
                diamond_amount: ff.AccountManager.jewels
            });
        } else {
            // ff.ControlManager.battery.showUnlockPop();
        }
    },

    onJewelsChange() {
        var data = ff.AccountManager.cannonConfig.getNextLockConfig();
        /**没有配置则满级 */
        if (!data) {
            this.node.parent = null;
            return;
        }
        var currJewels = ff.AccountManager.jewels;
        var lastJewels = parseInt(this.jewelsRate.string.split('/')[0]);
        /**钻石增加时才显示 */
        if (lastJewels < currJewels) this.showPanel();

        /**可解锁 */
        if (currJewels >= data.diamond) {
            this.unlockAnim.active = true;
            this.progressBar.node.active = false;
            this.nextLevel.node.parent.active = false;
            this.coinsGive.node.parent.active = true;
            this.unlockLevel.node.parent.active = true;
            this.coinsGive.string = data.coin;
            this.unlockLevel.string = data.grade;
            /**不可解锁 */
        } else {
            this.unlockAnim.active = false;
            this.coinsGive.node.parent.active = false;
            this.unlockLevel.node.parent.active = false;
            this.progressBar.node.active = true;
            this.nextLevel.node.parent.active = true;
            this.nextLevel.string = data.grade;
            this.jewelsRate.string = currJewels + '/' + data.diamond;
            this.progressBar.progress = currJewels / data.diamond;
            this.showTimer = 0;
        }
    },

    onCannonUpgrade(event) {
        var startPos = ff.ControlManager.battery.getAwardCoinPosition();
        ff.AwardManager.awardLabels.floatLabel(startPos, event.detail.coin);
        this.onJewelsChange();
        var startPos = cc.p(this.node.x + 360, this.node.y);
        var finishPos = ff.ControlManager.battery.getCannonPosition();
        ff.AwardManager.awardCoins.flyRangeCoins(startPos, finishPos, 20, 50);
    },

    showPanel() {
        if (this.statePanel.getNumberOfRunningActions() > 0) return;
        if (this.statePanel.x > HIDE_X + 10) return;
        this.statePanel.runAction(cc.moveTo(0.5, SHOW_X, this.statePanel.y).easing(cc.easeSineOut()));
        this.showTimer = 0;
    },

    hidePanel() {
        /**可解锁则不缩进 */
        if (this.unlockLevel.node.parent.active) return;
        if (this.statePanel.getNumberOfRunningActions() > 0) return;
        if (this.statePanel.x < SHOW_X - 10) return;
        this.statePanel.runAction(cc.moveTo(0.5, HIDE_X, this.statePanel.y).easing(cc.easeSineOut()));
        this.showTimer = SHOW_INTERVAL * 2;
    },

    update(dt) {
        if (this.showTimer > SHOW_INTERVAL) return;
        this.showTimer += dt;
        if (this.showTimer > SHOW_INTERVAL) this.hidePanel();
    }
});