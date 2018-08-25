cc.Class({

    extends: require('BaseCurve'),

    properties: {

    },

    onLoad() {
        this.graphics = this.node.addComponent(cc.Graphics);
    },

    clear() {
        this.graphics.clear();
    },

    getPos(p) {
        return p.add(cc.p(this.node.width / 2, this.node.height / 2));
    },

    moveTo(point) {
        this.graphics.lineWidth = 6;
        this.graphics.strokeColor = cc.hexToColor('#444444');
        point = this.getPos(point);
        this.graphics.moveTo(point.x, point.y);
    },

    lineTo(point) {
        point = this.getPos(point);
        this.graphics.lineTo(point.x, point.y);
        this.graphics.stroke();
        this.graphics.moveTo(point.x, point.y);
    },

    drawBezier(bezier) {
        var dt = 0.032;
        var time = 1;

        var currt = 0;
        var currp = bezier.getP(0);
        this.moveTo(currp);
        while(1) {
            currt += dt;
            if(Math.abs(currt - time) < dt) currt = time;
            currp = bezier.getP(currt / time * bezier.ratio);
            this.lineTo(currp);
            if(currt == time) break;
        }
    },

    drawCurve() {
        for(var i in this._beziers) {
            this.drawBezier(this._beziers[i]);
        }
    }
});
