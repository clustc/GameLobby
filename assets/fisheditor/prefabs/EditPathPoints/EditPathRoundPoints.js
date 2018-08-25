cc.Class({
    extends: require('EditPathMovePoints'),

    properties: {
        /**
         * offset: x
         */
        data: {
            set(data) {
                this.startx = data.offset;
                this.setRound(data.radius, data.rounds);
            },
            get() {
                return {
                    offset: this.allPoints[0].node.x
                }
            }
        }
    },

    onLoad() {
        this._super();
        this.rounds = 0;
        this.radius = 200;
        this.startx = -500;
    },

    setRound(radius, count) {
        this.radius = radius;
        this.setCount(count);
    },

    addStartPoints(startx, starty) {
        var p0 = this.getOnePoint();
        p0.order = 0;
        p0.isBorder = true;
        p0.node.x = startx;
        p0.node.y = p0.pMax.y;
        this.allPoints.push(p0);

        var p1 = this.getOnePoint();
        p1.order = 1;
        p1.node.x = startx;
        p1.node.y = (starty + this.node.height / 2) / 2;
        this.allPoints.push(p1);
    },

    addFinishPoints(startx, starty) {
        var p1 = this.getOnePoint();
        p1.order = this.allPoints.length;
        p1.node.x = startx;
        p1.node.y = (starty - this.node.height / 2) / 2;
        this.allPoints.push(p1);

        var p0 = this.getOnePoint();
        p0.order = this.allPoints.length;
        p0.isBorder = true;
        p0.node.x = startx;
        p0.node.y = p0.pMin.y;
        this.allPoints.push(p0);
    },

    setCount(count) {
        if(count == this.rounds) return;
        this.rounds = count;

        var startx = this.startx;
        if(this.allPoints[0]) startx = this.allPoints[0].node.x;

        this.allPoints = [];
        this.node.removeAllChildren();

        var radius = this.radius;
        var startr = -Math.PI / 2 + Math.PI / 8;
        var radiusx = startx + radius * Math.cos(Math.PI / 8);

        this.addStartPoints(startx, radius * Math.cos(startr));

        for(var i = 0; i < 10 + (count - 1) * 8; i++) {
            var r = startr - i * Math.PI / 4;
            var p = this.getOnePoint();
            var n = p.node;
            p.canTouch = false;
            p.order = i + 2;
            n.parent = this.node;
            n.x = radiusx + radius * Math.sin(r);
            n.y = radius * Math.cos(r);
            this.allPoints.push(p);
        }

        this.addFinishPoints(startx, -radius * Math.cos(startr));
    },

    onTouchMove(evt) {
        if(this.touchPoint) {
            var deltax = evt.getDeltaX();
            var index = this.allPoints.indexOf(this.touchPoint);
            var isStill = (index == 0) || (index == this.allPoints.length - 1);
            if(isStill) {
                for(var i in this.allPoints) {
                    this.allPoints[i].node.x += deltax;
                }
            }
        }
    },
});
