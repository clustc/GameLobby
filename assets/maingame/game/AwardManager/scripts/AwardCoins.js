
cc.Class({
    extends: require('PoolLayer'),

    properties: {
        flipCoin: cc.Prefab,
    },

    onLoad() {
        this.prepareObject(40);
    },

    produce() {
        var object = this._super();
        object.node.setSiblingIndex(this.node.childrenCount);
        return object;
    },  

    createObject() {
        var node = cc.instantiate(this.flipCoin);
        node.setScale(0.7);
        node.parent = this.node;
        node.x = node.y = 100000;
        return node.getComponent('FlipCoin');
    },

    resetObject(object) {
        object.node.x = object.node.y = 100000;
    },

    onGainCoins(data) {
        cc.Sound.playSound('sGetCoins');
        setTimeout(() => cc.Sound.playSound('sFlyCoins'), 2000);
        var coins = Math.min(Math.ceil(data.gainCoins / data.level), 20);
        var startPos = data.position.clone();
        var finishPos = data.battery.getCannonPosition();
        var totalCols = Math.round(coins / 2);
        var totalRows = 2;
        if(coins < 6) {
            totalCols = coins;
            totalRows = 1;
        }
        startPos.x -= totalCols / 2 * 60;
        
        this.flyMatrixCoins(startPos, finishPos, totalCols, totalRows);
    },

    flyOneCoin(startPos, finishPos, duration, delay) {
        delay = delay || 0;
        var coin = this.produce();
        coin.animateFly(startPos, finishPos, duration, delay, () => this.reclaim(coin));
    },

    flyMatrixCoins(startPos, finishPos, totalCols, totalRows) {
        var col = 0;
        var delay = totalCols * 0.04;
        var flyCol = () => {
            for(var row = 0; row < totalRows; row++) {
                var x = startPos.x + col * 54;
                var y = startPos.y - row * 64;
                this.flyOneCoin(cc.p(x, y), finishPos, 0.8, delay);
            }
            if(++col < totalCols) setTimeout(flyCol, 40);
        }
        flyCol();
    },

    flyRangeCoins(startPos, finishPos, count, range) {
        var currCoins = 0;
        var showCoin = () => {
            var coin = this.produce();
            coin.animateEmitFly(range, startPos, finishPos, 0.8, 0.6, () => this.reclaim(coin));
            if (++currCoins < count) setTimeout(showCoin, 100);
        }
        showCoin();
    },
});
