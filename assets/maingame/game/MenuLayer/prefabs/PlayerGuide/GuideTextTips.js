cc.Class({
    extends: cc.Component,

    properties: {
        txtImage: cc.Sprite,
        txtSprites: [cc.SpriteFrame],
    },

    onLoad() {
        this.txtSprites = this.parseToMap(this.txtSprites);
    },

    parseToMap(array) {
        var images = {};
        for (var i in array) images[array[i].name] = array[i];
        return images;
    },

    showTips(name, x, y) {
        this.txtImage.spriteFrame = this.txtSprites[name];
        this.node.x = x;
        this.node.y = y;
    }
});
