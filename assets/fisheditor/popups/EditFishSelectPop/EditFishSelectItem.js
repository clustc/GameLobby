cc.Class({
    extends: cc.Component,

    properties: {

    },

    init(prefab, parent) {
        var fish = cc.instantiate(prefab);
        if(fish.width > fish.height) {
            fish.setScale(Math.min(fish.width, 440) / fish.width);
        } else {
            fish.setScale(Math.min(fish.height, 440) / fish.height);
        }
        fish.x = fish.y = 0;
        fish.parent = this.node;
        fish.name = prefab.name;
        cc.isValid(parent) && (this.node.parent = parent);
    },
});
