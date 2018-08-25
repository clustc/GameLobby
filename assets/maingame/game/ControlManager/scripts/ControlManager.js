cc.Class({
    extends: cc.Component,

    properties: {
        menuLayer: cc.Prefab,
        cannonStatus: cc.Prefab,
    },

    onLoad() {
        this.menuLayer = this.node.addScriptNode(this.menuLayer);
    },

    bindBattery(battery) {
        this.battery = battery;
        this.battery.init(this.node.addScriptNode(this.cannonStatus));
        var node = this.battery.node.parent;
        node.on('touchstart', this.onTouchStart, this);
        node.on('touchmove', this.onTouchMove, this);
        node.on('touchend', this.onTouchEnd, this);
        node.on('touchcancel', this.onTouchEnd, this);
    },

    onTouchStart(event) {
        this.node.emit('touch-screen');
        this.battery.onTouchStart(this.node.convertToNodeSpaceAR(event.getLocation()));
    },

    onTouchMove(event) {
        this.battery.onTouchMove(this.node.convertToNodeSpaceAR(event.getLocation()));
    },

    onTouchEnd(event) {
        this.battery.onTouchEnd(this.node.convertToNodeSpaceAR(event.getLocation()));
    },
});
