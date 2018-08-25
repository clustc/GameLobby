const Cannon = require('Cannon');

cc.Class({
    extends: require('PoolLayer'),

    properties: {
        
    },

    onLoad() {
        this.bullets = [];
        this.prepareObject(20);
        this.prepareObject(20, 'fishnet');
    },

    createObject(type) {
        if(type == 'fishnet') {
            var fishnet = ff.BulletManager.produceFishnet();
            fishnet.animation.on('finished', () => this.reclaim(fishnet, 'fishnet'));
            return fishnet;
        } else {
            return ff.BulletManager.produceBullet();
        }
    },

    resetObject(object, type) {
        if(type !== 'fishnet') {
            this.bullets.splice(this.bullets.indexOf(object), 1)
            object.reset();
        }
        object.node.x = object.node.y = 10000;
    },

    produce(type) {
        var object = this._super(type);
        object.node.parent = this.node;
        if(type !== 'fishnet') this.bullets.push(object);
        return object;
    },

    shotBullet(cannon) {
        return this.produce().init(cannon);
    },

    isHitFish(bullet, fish) {
        if (fish.checkHit(bullet.node.position)) {
            fish.showHit();
            this.produce('fishnet').init(bullet);
            bullet.battery.bulletHitFish(bullet, fish);
            this.reclaim(bullet);
            return true;
        }
        return false;
    },

    update(dt) {
        var length = this.bullets.length;
        for(var i = length - 1; i >= 0; i--) {
            var bullet = this.bullets[i];
            bullet.updates(dt);

            if(bullet.locateFish) {
                /**有锁定鱼时不反弹 */
                bullet.isBounce = false;
                if (!this.isHitFish(bullet, bullet.locateFish)) {
                    bullet.follow(bullet.locateFish.node.position);
                }
            } else {
                bullet.isBounce = i > length - Cannon.BULLET_MAX_COUNT;
                if(bullet.isBounce) {
                    ff.FishManager.forViewFish(fish => (this.isHitFish(bullet, fish)));
                } else if(!cc.screenBoundingBox.contains(bullet.node.position)) {
                    this.reclaim(bullet);
                }
            }
       }
    },
});
