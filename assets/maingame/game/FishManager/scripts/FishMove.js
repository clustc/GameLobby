cc.Class({

    extends: require('BaseCurve'),

    properties: {
        path: {
            set(data) {
                this.prepare(data);
                this.velocity = data.velocity;
                if(data.stayTime) {
                    this._stayPeriod.x = this.duration * data.stayRate;
                    this._stayPeriod.y = this._stayPeriod.x + data.stayTime;
                }
            },
        },
        velocity: {
            set(v) { if (v && v > 0) this._velocity = v; },
            get() { return this._velocity; },
        },
        /**运动时间戳 */
        timestamp: {
            set(t) { t !== undefined && (this._timestamp = t); },
            get() { return this._timestamp; },
        },
        /**曲线偏移量 */
        offset: {
            set(o) { o && (this._offset = o); },
            get() { return this._offset; }
        },
        /**是否轴向翻转 */
        flipXY: {
            set(f) { this._flipXY = f; },
            get() { return this._flipXY; }
        },
        /**是否停止运动 */
        stopped: {
            get() { return this._stopped },
            set(s) { this._stopped = s; }
        },
        /**运动时长 */
        duration: {
            get() { return this._longness / this._velocity; }
        },
        /**停留时长 */
        stayPeriod: {
            get() { return this._stayPeriod.y - this._stayPeriod.x; }
        }
    },

    ctor() {
        this._flipXY = 0;
        this._offset = null;
        this._stopped = true;
        this._velocity = 0;
        this._timestamp = 0;
        this._moveRatio = 0;
        this._moveBezier = null;
        this._stayPeriod = cc.p(0, 0); 
    },

    reset() {
        this._super();
        this._flipXY = 0;
        this._offset = null;
        this._stopped = true;
        this._velocity = 0;
        this._timestamp = 0;
        this._moveRatio = 0;
        this._moveBezier = null;
        this._stayPeriod = cc.p(0, 0); 
    },

    transform(pos) {
        this._offset && pos.addSelf(this._offset);
        if (this._flipXY & 1) pos.x *= -1;
        if ((this._flipXY & (1 << 1)) >> 1) pos.y *= -1;
        this.moving(pos);
    },

    inStayPeriod() {
        return this._timestamp > this._stayPeriod.x && this._timestamp < this._stayPeriod.y;
    },

    readyMove() {
        /**时间戳大于运动时间，已经运动结束 */
        if(this.stayPeriod > 0 && (this._timestamp > this.duration + this.stayPeriod)) return this.onFinish();
        if(this.stayPeriod <= 0 && (this._timestamp / this.duration > 0.98)) return this.onFinish();
        this._stopped = false;
        this.onReady();
    },

    beginMove() {
        var percent = this._timestamp / this.duration;
        /**有停留时间 */
        if(this.stayPeriod > 0) {
            if(this.inStayPeriod()) percent = this._stayPeriod.x / this.duration;
            else if(this._timestamp >= this._stayPeriod.y) percent = (this._timestamp - this.stayPeriod) / this.duration;
        }
        /**有停留时间 */
        var ratio = 0, order = 0;
        this._moveBezier = this._beziers[order];
        while (this._moveBezier) {
            if (ratio + this._moveBezier.ratio > percent) {
                this._moveRatio = percent - ratio
                break;
            }
            ratio += this._moveBezier.ratio;
            this._moveBezier = this._beziers[++order];
        }
        if(!this._moveBezier) cc.error('No Bezier => ', this._timestamp, this.duration, percent)
        else this.transform(this._moveBezier.getP(this._moveRatio));
        if(this.inStayPeriod()) this.transform(this._moveBezier.getP(this._moveRatio + 0.016));
        this.onBegin();
    },

    updateMove(dt) {
        this._moveRatio += dt / this.duration;
        if (this._moveRatio > this._moveBezier.ratio) {
            this._moveRatio -= this._moveBezier.ratio;
            this._moveBezier = this._beziers[this._beziers.indexOf(this._moveBezier) + 1];
            if (!this._moveBezier) {
                this._stopped = true;
                return this.onFinish();
            }
        }
        this.transform(this._moveBezier.getP(this._moveRatio));
    },

    updates(dt) {
        if (this._stopped) return;

        this._timestamp += dt;
        if (this._timestamp < 0) return;
        if (!this._moveBezier) return this.beginMove();

        if(this.inStayPeriod()) return;

        this.updateMove(dt);
    },

    moving(pos) {

    },

    onReady() {

    },

    onBegin() {
        
    },

    onFinish() {

    },
});

/**
 * 曲线切线问题
 */