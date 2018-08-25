cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.RichText,
    },

    onLoad() {
        cc.systemEvent.on('EvevtFlyItemToMyPos', this.onPropsChange, this);
    },

    onDestroy() {
        cc.systemEvent.off('EvevtFlyItemToMyPos', this.onPropsChange, this);
    },

    onPropsChange(event) {
        var prop = ff.AccountManager.propsConfig.getPropById(event.detail.item_id);
        if (prop.propName == 'cardHF') this.scheduleOnce(this.showTips, 1);
    },

    showTips() {
        cc.BaseLinker('GetMineBagList', { page: 1, pageSize: 100 }).request((data) => {
            data = data.fragmentBag;
            for (var i = 0; i < data.length; i++) {
                if (data[i].fragmentId === 7) {
                    this.text.string = '你已经拥有<color=#FFFF00>' + data[i].price + '</>个<color=#FFFF00>话费碎片</>';
                    this.unschedule(this.hide);
                    this.scheduleOnce(this.hide, 5);
                    this.node.position = ff.ControlManager.battery.getAwardAnimPosition();
                    break;
                }
            }
        })
    },

    hide() {
        this.node.x = 100000;
    },
});
