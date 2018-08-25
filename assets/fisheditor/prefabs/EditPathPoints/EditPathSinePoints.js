cc.Class({
    extends: require('EditPathMovePoints'),

    properties: {
        data: {
            set(data) {
                this.setCount(data.rounds);
            },
            get() {
                
            }
        }
    },

    onLoad() {
        this._super();
    },
    
    getSinePoints(count) {
        var points = [];
        var radius = Math.floor(this.node.width / count / 2);
        var startX = this.node.width % (radius * 2) / 2 - this.node.width / 2 + radius;

        for(var i = 0; i < count; i++) {
            var nav = (i % 2 == 0) ? 1 : -1;

            var len = (i == count - 1) ? 5 : 4;
            for(var j = 0; j < len; j++) {
                var r = -Math.PI / 2 + j * Math.PI / 4 * nav;
                var x = startX + radius * Math.sin(r);
                var y = 0 + radius * Math.cos(r);
                points.push(cc.p(x, y));
            }

            startX += radius * 2;
        }
        return points;
    },

    setCount(count) {
        this.allPoints = [];
        this.node.removeAllChildren();

        var ps = this.getSinePoints(count);
        for(var i in ps) {
            var p = this.getOnePoint();
            var n = p.node;
            p.order = i;
            n.position = ps[i];
            this.allPoints.push(p);
        }
    },

    onTouchMove(evt) {
        
    },

    onTouchEnd(evt) {
        this.touchPoint = null;
    }
});
