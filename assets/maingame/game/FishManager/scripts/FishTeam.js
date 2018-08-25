cc.Class({
    extends: cc.Component,
    
    properties: {
        duration: {
            get() { return this._duration; }
        },
        timestamp: {
            get() { return this._timestamp; }
        }
    },

    onLoad() {
        this.data = null;
        this.dead = [];
        this.fish = this.node.getComponent('Fish');
        this._duration = 0;
        this._timestamp = 0;
    },

    reset() {
        this.data = null;
        this.dead = [];
        this._duration = 0;
        this._timestamp = 0;
    },
    
    ready() {
        if(!this.data) return false;
        if(this.data.offsets) {
            this.loadCrowd();
            return true;
        }
        if(this.data.delay) {
            this.loadQueue();
            return true;
        }
    },

    bornSelf(order) {
        if (this.dead.indexOf(order) >= 0) return this.fish.onFinish();
        this.fish.order = order;
        this.reset();
    },

    loadCrowd() {
        if (this.fish.timestamp >= this.fish.duration) return this.fish.onFinish();
        var start = this.data.index[0];
        var count = this.data.index[1];
        var offsets = this.data.offsets;
        for (var i = 1; i < count; i++) {
            var order = start + i;
            if (this.dead.indexOf(order) >= 0) continue;
            var fish = this.fish.clone();
            fish.order = order;
            fish.offset = offsets[i];
            fish.timestamp = this.fish.timestamp;
            fish.readyMove();
        }
        this.fish.readyMove();
        this.bornSelf(start);
    },

    loadQueue() {
        this._timestamp = this.fish.timestamp;
        /**生产数量 */
        this.currCount = 0;
        /**起始order */
        this.startOrder = this.data.index[0];
        /**总共数量 */
        this.totalCount = this.data.index[1];
        /**生产间隔，多久生产一个 */
        this.bornDelay = this.data.delay;
        /**记录当前队列时间戳，可能小于0 */
        this.bornTimer = this.bornDelay + this._timestamp;
        /**生产时长 */
        this._duration = this.bornDelay * (this.totalCount - 1);
        /**路径已经结束 */
        if(this._timestamp > this.fish.duration + this._duration) return this.fish.onFinish();
        
        this.fish.timestamp -= this._duration;
        this.fish.readyMove();
        /**开始之前根据时间戳把已发射的鱼创建出来 */
        if (this._timestamp > 0) {
            var timestamp = this._timestamp;
            while (1) {
                this.bornFish(timestamp);
                if (this.totalCount == this.currCount) break;
                /**小于0说明要延时出来，这时用bornTimer计时 */
                timestamp -= this.bornDelay;
                if (timestamp < 0) {
                    this.bornTimer = this.bornDelay + timestamp;
                    break;
                }
            }
        }
    },

    bornFish(timestamp) {
        this.currCount++;
        var order = this.currCount + this.startOrder - 1;
        if (this.totalCount == this.currCount) return this.bornSelf(order);
        if (timestamp > this.fish.duration) return;
        if (this.dead.indexOf(order) >= 0) return;

        var fish = this.fish.clone();
        fish.order = order;
        fish.timestamp = timestamp;
        fish.readyMove();
    },

    updates(dt) {
        if (!this.data) return;
        if (this.fish.stopped) return;
        this._timestamp += dt;
        this.bornTimer += dt;
        if (this.bornTimer > this.bornDelay) {
            this.bornTimer -= this.bornDelay;
            this.bornFish(this.bornTimer);
        }
    },

});