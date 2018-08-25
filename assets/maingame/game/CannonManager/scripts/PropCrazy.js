cc.Class({
    extends: require('PropLocate'),

    properties: {

    },

    onEnable() {
        this.setTextView(this.battery.assets.crazyText);
        this.setLocateView(this.battery.assets.locateLine);
        this.setCannonView(this.battery.assets.crazyRing, -1);
        this.cannon.skinProp = this.battery.assets.getPropSkin(this.cannon.getSkin());
    },

    onDisable() {
        this.cannon.skinProp = null;
        this.cannon.setSkin();
    },
});
