const Cannon = require('Cannon');

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
    },

    reset() {
        this.speed = cc.Vec2.ZERO;
        this.isBounce = true;
        this.battery = null;
        this.cannonLevel = 0;
        this.locateFish = null;
        this.fishnetSkin = null;
    },

    init(cannon) {
        var skin = cannon.getSkin();
        this.isBounce = true;
        this.locateFish = null;
        this.fishnetSkin = skin.fishnet;
        this.sprite.spriteFrame = skin.bullet;
        this.battery = cannon.battery;
        this.cannonLevel = cannon.battery.level;
        this.node.rotation = cannon.node.rotation;
        this.node.position = cannon.getFirePosition();
        var radian = Math.PI / 2 - cc.degreesToRadians(this.node.rotation);
        this.speed = cc.pForAngle(radian).mulSelf(Cannon.BULLET_VELOCITY);
        return this;
    },

    follow(pos) {
        var position = this.node.position;
        var radian = Math.atan2(pos.y - position.y, pos.x - position.x);
        this.node.rotation = cc.radiansToDegrees(Math.PI / 2 - radian);
        this.speed = cc.pForAngle(radian).mulSelf(Cannon.BULLET_VELOCITY);
    },

    updates(dt) {
        var self = this;
        var rect = cc.screenBoundingBox;
        self.node.x += self.speed.x * dt;
        self.node.y += self.speed.y * dt;
        if(self.isBounce) {
            if(self.node.x > rect.xMax) {
                self.speed.x *= -1;
                self.node.x = rect.xMax;
                self.node.rotation = -self.node.rotation;
            } else if (self.node.x < rect.xMin) {
                self.speed.x *= -1;
                self.node.x = rect.xMin;
                self.node.rotation = -self.node.rotation;
            }
            if(self.node.y > rect.yMax) {
                self.speed.y *= -1;
                self.node.y = rect.yMax;
                self.node.rotation = -180 - self.node.rotation;
            } else if (self.node.y < rect.yMin) {
                self.speed.y *= -1;
                self.node.y = rect.yMin;
                self.node.rotation = -180 - self.node.rotation;
            }
        }
    },
});
