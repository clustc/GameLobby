cc.Class({
    extends: require('PropState'),

    properties: {

    },

    onEnable() {
        this.setTextView(this.battery.assets.freezeText, true);
    },

    init(prop, time) {
        this._super(prop, time);
        ff.FishManager.freezeLayer.play(time);
    },
});
