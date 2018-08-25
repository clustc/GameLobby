cc.Class({
    extends: cc.Component,

    properties: {
        TurntableButton: cc.Node,
        // signButton: cc.Node,
    },

    onLoad() {
        var data = ff.AccountManager.switchConfig.data;
        this.TurntableButton.active = data[20].state;
        // this.signButton.active = data[19].state;
    },

    onService() {
        /**首页-客服 */
        ff.BuryingPoint(3401120001);
        cc.Proxy('openCSPage').called();
    },

    onVipLuckTurntable() {
        /**首页-转盘 */
        ff.BuryingPoint(3401100001);
        cc.Popup('VipLuckTurntablePop').outsideClose(false).show();
    },

    onClickBtnQiandao() {
        /**首页-每周签到 */
        ff.BuryingPoint(3401110001);
        ff.PopupManager.signPop();
    },
});
