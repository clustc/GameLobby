cc.Class({
    extends: require('EditPathMovePoints'),

    properties: {
        /**
         * offset: y
         */
        data: {
            set(data) {
                this.setCount();
                for(var i in this.allPoints) this.allPoints[i].node.y = data.offset;
            },
            get() {
                return {
                    offset: this.allPoints[0].node.y
                }
            }
        }
    },

    onLoad() {
        this._super();
    },

    setCount() {
        this.allPoints = [];
        this.node.removeAllChildren();

        for(var i = 0; i < 3; i++) {
            var p = this.getOnePoint();
            var n = p.node;
            p.init(i, 2);
            n.y = 0;
            this.allPoints.push(p);
        }
    },

    onTouchMove(evt) {
        if(this.touchPoint) {
            var deltay = evt.getDeltaY();
            for(var i in this.allPoints) this.allPoints[i].node.y += deltay;
        }
    },
});
