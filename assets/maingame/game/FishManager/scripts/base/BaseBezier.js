/**
 * 基本贝塞尔曲线，由3个点算出一条曲线上的点
 */

const bezierAt = function(a, b, c, t) {
    return Math.pow((1 - t), 2) * a + 2 * t * (1 - t) * b + Math.pow(t, 2) * c;
}

const bezierDtAt = function(a, b, c, t) {
    return -2 * (1 - t) * a - 2 * b + 2 * t * c;
}

cc.Class({

    properties: {
        /**缩放因子 */
        ratio: 1,
        length: {
            get() { return this._length; },
            set(l) { this._length = l; }
        }
    },

    ctor() {
        this._length = 0;
        this.x0 = arguments[0];
        this.y0 = arguments[1];
        this.x1 = arguments[2];
        this.y1 = arguments[3];
        this.x2 = arguments[4];
        this.y2 = arguments[5];
    },

    getP(t) {
        t = t / this.ratio;
        return cc.p(bezierAt(this.x0, this.x1, this.x2, t), bezierAt(this.y0, this.y1, this.y2, t));
    },

    getV(t) {
        t = t / this.ratio;
        return cc.p(bezierDtAt(this.x0, this.x1, this.x2, t), bezierDtAt(this.y0, this.y1, this.y2, t));
    },

    toString() {
        return JSON.stringify({
            x: { x0: this.x0, x1: this.x1, x2: this.x2 },
            y: { y0: this.y0, y1: this.y1, y2: this.y2 },
        });
    },

    /**获取曲线长度 */
    getLength() {
        var dt = 0.064;
        var ratio = 1;

        var t = 0;
        var p = this.getP(0);
        var l = 0;
        var x, y;
        while (1) {
            t += dt;
            if (Math.abs(t - ratio) < dt) t = ratio;
            x = bezierAt(this.x0, this.x1, this.x2, t / ratio);
            y = bezierAt(this.y0, this.y1, this.y2, t / ratio);
            l += Math.pow((Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2)), 0.5);
            p = cc.p(x, y);
            if (t == ratio) break;
        }

        return l;
    }
});