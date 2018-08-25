const Cannon = require('Cannon');

cc.Class({
    extends: require('PropState'),

    properties: {

    },

    onLoad() {
        this._super();
        this.fish = null;
        this.bullets = [];
        this.fireTimer = 0;
        this.cannon = this.battery.cannon;
    },

    onEnable() {
        this.setLocateView(this.battery.assets.locateLine);
        this.setCannonView(this.battery.assets.locateRing);
    },

    setLocateView(prefab) {
        var line = cc.instantiate(prefab);
        line.position = this.battery.getCannonPosition();
        line.parent = this.node.parent;
        line.setLocalZOrder(-1);
        line = line.getComponent('LocateLine');
        this.views.line = line;
    },

    setCannonView(prefab, zIndex) {
        if (prefab === null && this.views.ring) {
            this.views.ring.parent = null;
            delete this.views.ring;
            return;
        }
        var ring = cc.instantiate(prefab);
        zIndex !== undefined && ring.setLocalZOrder(zIndex);
        ring.parent = this.cannon.node.parent;
        ring.x = ring.y = 0;
        this.views.ring = ring;
    },

    isFishValid() {
        return this.fish && !this.fish.caught && this.fish.anim.visible;
    },

    fireFish() {
        var bullet = this.cannon.fire(this.fish.node.position);
        if(bullet) {
            bullet.locateFish = this.fish;
            this.bullets.push(bullet);
        }
    },

    onTouchStart(pos) {
        var fish = ff.FishManager.getTouchFish(pos);
        cc.log('onTouchStart   ',fish);
        fish && ff.WSLinkManager.send('CannonLocateMsg', {
            targets: [{
                fishId: fish.data.id,
                fishOrder: fish.order,
            }]
        });
    },

    update(dt) {
        this._super(dt);
        if (!this.fish) return;
        if (!this.isFishValid()) {
            this.setLocateFish(null);
            this.views.line.locateFish(null);
            return;
        }
        this.views.line.locateFish(this.fish);
        this.fireTimer += dt;
        if (this.fireTimer > Cannon.BULLET_SHOT_DELAY) {
            this.fireFish();
            this.fireTimer = 0;
        }
    },

    setLocateFish(fish) {
        if (fish != this.fish) {
            while (this.bullets.length > 0) this.bullets.pop().locateFish = null;
        }
        this.fish = fish;
    },

    getLocateFish() {
        cc.log('getLocateFish    ',this.fish);
        return this.isFishValid() ? this.fish : null;
    },

    onLocateFish(data) {
        cc.log('PropLocate   set  ',data);
        this.setLocateFish(ff.FishManager.getFishById(data[0].fishId, data[0].fishOrder));
    },
});
