cc.Class({
    extends: cc.Component,

    properties: {
        bullet: cc.Prefab,
        fishnet: cc.Prefab,
    },

    onLoad() {
        this.bulletLayer = this.node.addComponent('BulletLayer');
    },

    produceBullet() {
        return cc.instantiate(this.bullet).getComponent('Bullet');
    },

    produceFishnet() {
        return cc.instantiate(this.fishnet).getComponent('Fishnet');
    },

    shotBullet(cannon) {
        return this.bulletLayer.shotBullet(cannon);
    }
});
