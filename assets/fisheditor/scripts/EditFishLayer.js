cc.Class({
    extends: require('FishManager'),

    properties: {

    },

    init() {
        ff.FishManager = this;
        this.fishLayer = this.node.addComponent('FishLayer');
    },
    
    onPathChange(data) {
        this.fishLayer.callFishesMethod('onFinish');
        if(!data) return;
        data.time = 0;
        data.dead = [];
        this.fishLayer.bornFish(data);
    },

    onFishBegin(fish) {

    },

    update(dt) {

    }
});