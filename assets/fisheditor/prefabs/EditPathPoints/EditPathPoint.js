cc.Class({
    extends: cc.Component,

    properties: {
        order: {
            set(order) {
                this.node.find('label', cc.Label).string = order;
            }
        },
    },

    onLoad() {
        var g = this.getComponent(cc.Graphics);
        g.fillColor = cc.hexToColor('#606060');
        g.circle(30, 30, 30);
        g.fill();

        var rect = this.node.parent.getBoundingBox();
        rect.x += this.node.width / 2;
        rect.y += this.node.height / 2;
        rect.width -= this.node.width;
        rect.height -= this.node.height;
        this.pMin = cc.p(rect.x, rect.y);
        this.pMax = cc.p(rect.x + rect.width, rect.y + rect.height);
        this.moveRect = rect;
        this.canTouch = true;
    },

    init(order, total) {
        this.node.find('label', cc.Label).string = order;
        this.isBorder = (order == 0) || (order == total);
        this.node.x = this.pMin.x + this.moveRect.width / total * order;
        this.node.y = this.pMax.y - this.moveRect.height / total * order;
    },

    isTouched(pos) {
        if(!this.canTouch) return false;
        return this.node.getBoundingBox().contains(pos);
    },

    onTouchMove(pos) {
        var x = pos.x;
        var y = pos.y;
        if (this.isBorder) {
            if (Math.abs(this.node.x - this.pMax.x) < 4 || Math.abs(this.node.x - this.pMin.x) < 4) {
                if (y > this.pMax.y) this.node.y = this.pMax.y;
                else if (y < this.pMin.y) this.node.y = this.pMin.y;
                else this.node.y = y;
            }
            if (Math.abs(this.node.y - this.pMax.y) < 4 || Math.abs(this.node.y - this.pMin.y) < 4) {
                if (x > this.pMax.x) this.node.x = this.pMax.x;
                else if (x < this.pMin.x) this.node.x = this.pMin.x;
                else this.node.x = x;
            }
        } else {
            if (y > this.pMax.y) this.node.y = this.pMax.y;
            else if (y < this.pMin.y) this.node.y = this.pMin.y;
            else this.node.y = y;

            if (x > this.pMax.x) this.node.x = this.pMax.x;
            else if (x < this.pMin.x) this.node.x = this.pMin.x;
            else this.node.x = x;
        }
    }
});
