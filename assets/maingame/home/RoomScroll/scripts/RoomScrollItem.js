const ROUND_TOTAL_ORDER = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        roomIcon: cc.Node,
        labelOn: cc.Node,
        digitalNumSpt:[cc.SpriteFrame],
        minEnterLbl:cc.Label,
        maxEnterLbl:cc.Label,
        roundOrder: {
            set(order) {
                if(order < 0) order += ROUND_TOTAL_ORDER;
                if(order >= ROUND_TOTAL_ORDER) order -= ROUND_TOTAL_ORDER;
                this._roundOrder = order;

                var zorder = order == 2 ? 0 : ROUND_TOTAL_ORDER - order;
                this.node.setLocalZOrder(zorder);
            },
            get() {
                return this._roundOrder;
            },
            visible: false
        },
    },

    onLoad() {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchEnd, this);
    },

    onDisable() {
        
    },

    init(data) {
        this.data = data;
        this._roundOrder = 0;
        this.touchOffset = 0;
        this.isMoving = false;
        this.isTouchDown = false;
        this.node.find('gradebg').active = true;
        this.minEnterLbl.string = this.data.enterBatteryLv;
        this.maxEnterLbl.string = this.data.enterMaxBatteryLv;
        // if (ff.AccountManager.coins < data.enterMinMoney){
        //     this.node.find('gradebg').active = true;
        //     this.minEnterLbl.string = this.data.enterBatteryLv;
        //     this.maxEnterLbl.string = this.data.enterMaxBatteryLv;
        // }
    },

    onTouchStart(event) {
        if(this.isMoving) return;
        this.isTouchDown = true;
        this.touchOffset = 0;
    },

    onTouchMove(event) {
        if(!this.isTouchDown) return;
        this.touchOffset += event.getDeltaX();
        if(Math.abs(this.touchOffset) > 2) this.node.emit('item-touch-move', this.touchOffset);
    },

    onTouchEnd(event) {
        if(!this.isTouchDown) return;
        this.isTouchDown = false;
        if(Math.abs(this.touchOffset) <= 2) {
            this.node.emit('item-click');
            this.isMoving = false;
        } else {
            this.node.emit('item-touch-end', this.touchOffset);
        }
    },

    onMoving(percent) {
        this.isMoving = true;
        this.node.scale = 1 - (1 - percent) * 0.5;
        this.labelOn.active = percent > 0.9;
        var c = 255 - (1 - percent) * 150;
        this.node.setCascadeColor(cc.color(c, c, c));
    },

    onMoveEnd() {
        this.isMoving = false;
    }
});
