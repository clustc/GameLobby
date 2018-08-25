cc.Class({
    extends: cc.Component,

    properties: {
        autoOff: cc.Node,
        autoOn: cc.Node,
        autoRing: cc.Node,
    },

    onLoad() {
        this.autoOn.active = false;
        this.autoRing.active = false;
    },

    onAutoState() {
        this.autoOff.active = false;
        this.autoOn.active = true;
        this.autoRing.active = true;
    },

    stopAutoState() {
        this.autoOff.active = true;
        this.autoOn.active = false;
        this.autoRing.active = false;
    },

    isAutoState() {
        return this.autoOn.active;
    }
});
