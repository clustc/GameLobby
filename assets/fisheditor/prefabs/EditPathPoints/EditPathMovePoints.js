cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchEnd, this);

        this.allPoints = [];
        this.touchPoint = null;
        this.pointPrefab = this.node.getComponent('EditPathPoints').pointPrefab;
    },

    reset() {
        this.allPoints = [];
        this.node.removeAllChildren();
    },

    setCount(count) {
        this.allPoints = [];
        this.node.removeAllChildren();
        for (var i = 0; i < count; i++) {
            var p = this.getOnePoint();
            p.init(i, count - 1);
            this.allPoints.push(p);
        }
    },

    getOnePoint() {
        var n = cc.instantiate(this.pointPrefab);
        var p = n.getComponent('EditPathPoint');
        n.parent = this.node;
        return p;
    },

    setPoints(ps) {
        var count = ps.length;
        this.allPoints = [];
        this.node.removeAllChildren();
        for (var i = 0; i < count; i++) {
            var p = this.getOnePoint();
            p.init(i, count - 1);
            p.node.position = ps[i];
            this.allPoints.push(p);
        }
    },

    getPoints() {
        var ret = [];
        for (var i in this.node.children) {
            var pos = this.node.children[i].position;
            ret.push(cc.p(Math.decimal(pos.x, 2), Math.decimal(pos.y, 2)));
        }
        return ret;
    },

    onTouchStart(evt) {
        var posAR = this.node.convertToNodeSpaceAR(evt.getLocation());
        for (var i in this.allPoints) {
            var p = this.allPoints[i];
            if (p.isTouched(posAR)) {
                this.touchPoint = p;
                break;
            }
        }
    },

    onTouchMove(evt) {
        var posAR = this.node.convertToNodeSpaceAR(evt.getLocation());
        if (this.touchPoint) this.touchPoint.onTouchMove(posAR);
    },

    onTouchEnd(evt) {
        if (this.touchPoint) this.node.emit('points-change');
        this.touchPoint = null;
    }
});
