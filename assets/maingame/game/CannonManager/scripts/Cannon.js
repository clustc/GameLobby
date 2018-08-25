cc.Class({
    extends: cc.Component,

    properties: {

    },    
    
    statics: {
        BULLET_MAX_COUNT: 10,
        BULLET_VELOCITY: 960,
        BULLET_SHOT_DELAY: 0.2,
    },

    init(battery) {
        this.clones = [];
        this.skinBase = null;
        this.skinWear = null;
        this.skinProp = null;
        this.battery = battery;
        this.node.rotation = battery.rotation;
        this.fireAnim = this.node.children[0].getComponent(cc.Animation);
        return this;
    },

    clone() {
        var node = cc.instantiate(this.node);
        var cannon = node.getComponent('Cannon').init(this.battery);
        node.parent = this.node.parent;
        node.rotation = this.node.rotation;
        cannon.getSkin = this.getSkin.bind(this);
        this.clones.push(cannon);
        return cannon;
    },

    cleanClones() {
        while(this.clones.length) this.clones.pop().node.parent = null;
    },

    fire(pos) {
        this.rotateAt(pos);
        return this.battery.state.fire(this);
    },

    fireAngle(degree) {
        this.rotateAngle(degree);
        return this.battery.state.fire(this);
    },

    rotateAt(pos) {
        var offset = cc.pSub(pos, this.battery.getCannonPosition());
        var radian = Math.PI / 2 - Math.atan2(offset.y, offset.x);
        this.node.rotation = cc.radiansToDegrees(radian);
    },

    rotateAngle(degree) {
        degree += this.battery.rotation;
        var radian = Math.PI / 2 - cc.degreesToRadians(degree);
        var pos = cc.pAdd(cc.pForAngle(radian).mulSelf(1000), this.battery.getCannonPosition());
        this.rotateAt(pos);
    },

    wearSkin(prefab) {
        this.fireAnim.node.stopAllActions();
        this.fireAnim.node.runAction(cc.sequence(
            cc.scaleTo(0.1, 0.6).easing(cc.easeSineOut()),
            cc.callFunc(() => {
                this.fireAnim.node.parent = null;
                this.fireAnim = cc.instantiate(prefab).getComponent(cc.Animation);
                this.fireAnim.node.parent = this.node;
                this.fireAnim.node.position = cc.p(0, 30);
                this.fireAnim.node.runAction(cc.scaleTo(0.1, 1).easing(cc.easeSineOut()));
            })
        ));
        for(var i in this.clones) this.clones[i].wearSkin(prefab);
    },

    getSkin() {
        /**道具皮肤 > 穿戴皮肤 > 基础皮肤 */
        if(this.skinProp) return this.skinProp;
        if(this.skinWear) return this.skinWear;
        return this.skinBase; 
    },

    setSkin() {
        if(this.skinProp) this.skinProp = this.battery.assets.getPropSkin(this.skinWear || this.skinBase);
        this.wearSkin(this.getSkin().cannon);
    },

    setWearSkin(skinId) {
        // cc.error('setWearSkin   '+skinId);
        if(skinId === 0) {
            this.skinWear = null;
            this.skinBase = this.battery.assets.getBaseSkin(this.battery.level);
        } else {
            this.skinWear = this.battery.assets.getWearSkin(skinId);
        }
        this.setSkin();
    },
    
    getFirePosition() {
        var radian = Math.PI / 2 - cc.degreesToRadians(this.node.rotation);
        var offset = cc.pForAngle(radian).mulSelf(90);
        return cc.pAdd(this.battery.getCannonPosition(), offset);
    }
});
