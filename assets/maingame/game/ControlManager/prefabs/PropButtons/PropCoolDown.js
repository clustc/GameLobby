cc.Class({
    extends: cc.Component,

    properties: {
        iconSprite: cc.Sprite,
        maskSprite: cc.Sprite,
        countLabel: cc.Label,
        // iconJewel: cc.Node,
        iconLock: cc.Node,
        count: {
            set(c) {
                this.countLabel.string = c;
                // this.iconJewel.active = false;
            },
            visible: false
        }
    },

    onLoad() {
        this.maskSprite.fillType = cc.Sprite.FillType.RADIAL;
        this.maskSprite.fillCenter = cc.p(0.5, 0.5);
        this.maskSprite.fillStart = 0.25;
        this.maskSprite.fillRange = 0;
        this.node.on('click', this.onClick, this);
        this.button = this.node.getComponent(cc.Button);
    },

    reset() {
        this.maskSprite.fillRange = 0;
        this.button.interactable = true;
    },

    clickable() {
        if(this.maskSprite.fillRange == 0) {
            this.button.interactable = true;
        }
    },

    onClick() {
        if(this.iconLock.active) return this.node.emit('button-click');
        this.button.interactable = false;
        this.node.emit('button-click');
        this.scheduleOnce(this.clickable, 0.5);
    },

    startCool() {
        this.button.interactable = false;
    },

    endCool() {
        this.maskSprite.fillRange = 0;
        this.button.interactable = true;
    },

    isCooling() {
        return this.maskSprite.fillRange > 0;
    },

    updatePercent(percent) {
        this.maskSprite.fillRange = percent;
    },

    setLocked(lock) {
        this.iconLock.active = lock;
        // this.iconJewel.parent.active = !lock;
    },

    setJewelCost(count) {
        // this.iconJewel.active = true;
        this.countLabel.string = count;
    }
});
