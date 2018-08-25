const SHOW_INTERVAL = 3;
const Cannon = require('Cannon');

cc.Class({
    extends: cc.Component,

    properties: {
        buttons: cc.Node,
        btnSwitch: cc.Node,
        btnTalk: cc.Node,
        btnAuto: require('CannonAutoShot'),
        btnAdd: cc.Node,
        btnSub: cc.Node,
        iconLock: cc.Node,
    },

    onLoad() {
        this.showTimer = 0;
        this.btnSwitch.on('click', this.onSwitchClick, this);
        this.btnTalk.on('click', this.onTalkClick, this);
        this.btnAuto.node.on('click', this.onAutoClick, this);
    },

    init(battery) {
        this.battery = battery;
        this.node.position = battery.cannon.node.parent.position;
        this.node.y += 12;
        this.node.on('click', battery.onMenuClick, battery);
        this.btnSub.on('click', battery.onSubLevel, battery);
        this.btnAdd.on('click', battery.onAddLevel, battery);
        return this;
    },

    onTalkClick() {
        !this.btnAuto.isAutoState() && (this.showTimer = 0);
        // ff.BuryingPoint(3402000015);
    },

    onSwitchClick() {
        // ff.BuryingPoint(3402000016);
        cc.Popup('CannonSkinPop').show(pop => pop.init(this.battery));
        !this.btnAuto.isAutoState() && (this.showTimer = 0);
    },

    onAutoClick() {
        ff.BuryingPoint(3402000014);
        this.btnAuto.isAutoState() ? this.stopAutoState() : this.startAutoState();
    },

    toggleMenu() {
        (this.showTimer == SHOW_INTERVAL * 2) ? this.showMenu() : this.hideMenu();
    },

    showMenu() {
        if (this.buttons.getNumberOfRunningActions() > 0) return;
        this.buttons.runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
        this.showTimer = 0;
    },

    hideMenu() {
        if (this.showTimer == SHOW_INTERVAL * 2) return;
        if (this.buttons.getNumberOfRunningActions() > 0) return;
        this.buttons.runAction(cc.scaleTo(0.3, 0).easing(cc.easeBackIn()));
        this.showTimer = SHOW_INTERVAL * 2;
    },

    startAutoState() {
        this.showTimer = 0;
        ff.PopupManager.showVipGiftPop(() => {
            cc.log('locate  ',this.battery.locate);
            if (!this.battery.locate) {
                this.showTimer = SHOW_INTERVAL * 2;
                this.btnAuto.onAutoState();
            }
        });
    },

    stopAutoState() {
        if (this.btnAuto.isAutoState()) {
            this.btnAuto.stopAutoState();
            this.showTimer = SHOW_INTERVAL / 3;
            this.battery.firePoint = null;
        }
    },

    enableButtons(enable) {
        this.node.getComponent(cc.Button).interactable = enable;
        this.btnSub.getComponent(cc.Button).interactable = enable;
        this.btnAdd.getComponent(cc.Button).interactable = enable;
    },

    update(dt) {
        if (this.showTimer <= SHOW_INTERVAL) {
            this.showTimer += dt;
            if (this.showTimer > SHOW_INTERVAL) this.hideMenu();
        }
    }
});
