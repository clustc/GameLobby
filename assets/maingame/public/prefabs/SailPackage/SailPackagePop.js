cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        awardItem: cc.Node,
    },

    onLoad() {
        this.content.removeAllChildren();
        this.sailPackageData = ff.AccountManager.sailPackage;
        cc.log(this.sailPackageData);
        this.initView();
        this.schedule(this.onReceiveBtn, 5);
    },

    start() {
        this.node.parent.on('touchstart', (event) => {
            event.stopPropagation();
        }, this);
    },

    initView() {
        var data = this.sailPackageData;
        for (var i = 0; i < data.length; i++) {
            this.createItem(data[i]);
        }
    },

    createItem(data) {
        var p = cc.instantiate(this.awardItem);
        p.parent = this.content;
        p.getScript().init(data);
    },

    onReceiveBtn() {
        /**游戏-启航礼包-领取 */
        ff.BuryingPoint(3402010001);
        this.unschedule(this.onReceiveBtn);
        ff.AccountManager.sailPackage = [];
        this.postSailPackage(true);
        this.node.emit('close', true);
    },

    onClosePop() {
        this.unschedule(this.onReceiveBtn);
        ff.AccountManager.sailPackage = [];
        this.postSailPackage(false);
        this.node.emit('close', false);
    },

    postSailPackage(flag) {
        var p = flag ? 'receive' : 'close';
        cc.Linker('GetSailPackage', { 'action': p }).request();
    },
});
