const FishInfo = require('FishData').FishInfo;
const STATE = {
    NONE: 1 << 0,
    BOSS: 1 << 1,
    SHOAL: 1 << 2,
    FREEZE: 1 << 3,
    FLIPXY: 1 << 4,
}

cc.Class({
    extends: require('PoolLayer'),

    properties: {
        fishLayer: cc.Prefab,
        floorLayer: cc.Prefab,
        freezeLayer: cc.Prefab,
    },

    onLoad() {
        this.STATE = STATE;
        this.fishState = STATE.NONE;
        this.init();
    },

    init() {
        this.floorLayer = this.node.addScriptNode(this.floorLayer);
        this.fishLayer = this.node.addScriptNode(this.fishLayer);
        this.freezeLayer = this.node.addScriptNode(this.freezeLayer);
        this.freezeLayer.node.on('freeze-start', this.freezeFishes, this);
        this.freezeLayer.node.on('freeze-finish', this.unfreezeFishes, this);
        ff.WSLinkManager.on('EnterRoomMsg', this.onEnterRoomMsg, this);
        ff.WSLinkManager.on('RefreshFishMsg', this.onRefreshFishMsg, this);
    },

    isState(state) {
        return (this.fishState & state) !== 0;
    },

    forViewFish(callback) {
        this.fishLayer.forViewFish(callback);
    },

    getTouchFish(pos) {
        var ret = null;
        this.fishLayer.forViewFish(fish => {
            if (fish.checkHit(pos)) {
                if (!ret || (fish.info.value > ret.info.value)) ret = fish;
            }
        });
        return ret;
    },

    getTypeFishes(type) {
        var ret = [];
        this.fishLayer.forViewFish(fish => {
            if (fish.info.type === type) ret.push(fish);
        });
        return ret;
    },

    getFishById(id, order) {
        var ret = null;
        this.fishLayer.forEachFish(fish => {
            if (fish.data.id == id && (order == undefined || fish.order == order)) return ret = fish;
        });
        return ret;
    },

    freezeFishes() {
        this.fishState |= STATE.FREEZE;
        this.fishLayer.callFishesMethod('pause');
    },

    unfreezeFishes() {
        this.fishState &= ~STATE.FREEZE;
        this.fishLayer.callFishesMethod('resume');
    },

    fadeoutFishes() {
        this.fishLayer.forEachFish(fish => {
            if (fish.data.type !== 4) fish.fadeout();
        });
    },

    onFishReady(fish) {
        if (fish.info.type === 'SHOAL') {
            this.fishLayer.bornShoal(fish.data);
        }
    },

    onFishBegin(fish) {
        if (fish.info.type === 'SHOAL') {
            this.fadeoutFishes();
            this.fishState |= STATE.SHOAL;
            if (fish.timestamp < 1) {
                ff.EffectManager.onShoalComing();
                this.floorLayer.changing();
            }
        } else if (fish.info.type === 'BOSS') {
            // this.fishState |= STATE.BOSS;
            // if (fish.timestamp < 1) ff.EffectManager.onBossComing(fish.info.value);
        }
    },

    onFishFinish(fish) {
        if (fish.info.type === 'SHOAL') {
            this.fishState &= ~STATE.SHOAL;
        } else if (fish.info.type === 'BOSS') {
            this.fishState &= ~STATE.BOSS;
        }
        this.fishLayer.reclaim(fish, fish.info.name);
    },

    onRefreshFishMsg(event) {
        if (this.isState(STATE.SHOAL)) return;
        this.fishLayer.timestamp = event.detail.timestamp;
        var fishes = event.detail.fishes;
        for (var i in fishes) {
            var data = fishes[i];
            if (this.getFishById(data.id)) continue;
            this.fishLayer.fishqueue.push(data);
        }
    },

    onReconnectMsg(event) {
        this.fishLayer.callFishesMethod('onFinish');
        this.onEnterRoomMsg(event);
    },

    onEnterRoomMsg(event) {
        var data = event.detail;
        if (data.playerPlace > 1) {
            this.fishLayer.flipXY = 3;
            this.fishState |= STATE.FLIPXY;
        }
        if (data.freezeTime > 0) {
            var freezeTime = data.freezeTime;
            this.scheduleOnce(() => this.freezeLayer.play(freezeTime), 0);
        }
        this.fishLayer.timestamp = event.detail.timestamp;
        var fishes = data.fishes;
        for (var i in fishes) {
            if (fishes[i].type === 4) {
                this.fishLayer.callFishesMethod('onFinish');
                this.fishLayer.bornFish(fishes[i]);
                break;
            }
            this.fishLayer.bornFish(fishes[i]);
        }
    },
});
