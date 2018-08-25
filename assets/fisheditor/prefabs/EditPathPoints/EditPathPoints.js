cc.Class({
    extends: cc.Component,

    properties: {
        pointPrefab: cc.Prefab,
        /**
         * path: {
         *  pxs:
         *  pys:
         *  lens:
         *  velo: 
         * }
         * type:类型
         * offset:上下左右偏移量
         * rounds:圈数/半环数
         * radius:半径
         */
        data: {
            get() {
                return this.getData();
            },
            set(data) {
                this.setData(data);
            },
            visible: false
        },
        count: {
            get() {
                if (this.movePoints) return this.movePoints.allPoints.length;
                return 0;
            }
        }
    },

    onLoad() {
        this.curveDraw = this.node.addComponent('CurveDraw');
        this.node.on('points-change', this.onPointsChange, this);
    },

    reset() {
        this.curveDraw.clear();
        this.movePoints.reset();
    },

    setData(data) {
        var edit = data.edit;
        if (this.movePoints) this.movePoints.destroy();
        if (edit.type == 'move') {
            this.movePoints = this.node.addComponent('EditPathMovePoints');
            if(data.path.pointxs) {
                this.movePoints.setPoints(ff.CurveToPoints(data.path).points);
            } else this.movePoints.setCount(edit.count);
        } else if (edit.type == 'line') {
            this.movePoints = this.node.addComponent('EditPathLinePoints');
            this.movePoints.data = data.edit;
        } else if (edit.type == 'sine') {
            this.movePoints = this.node.addComponent('EditPathSinePoints');
            this.movePoints.data = data.edit;
        } else if (edit.type == 'round') {
            this.movePoints = this.node.addComponent('EditPathRoundPoints');
            this.movePoints.data = data.edit;
        }
        this.path = data.path;
        this.onPointsChange();
    },

    getData() {
        if (this.movePoints) {
            this.path.points = this.movePoints.getPoints();
            return ff.PointsToCurve(this.path);
        }
        return null;
    },

    onPointsChange() {
        var path = this.data;
        this.curveDraw.clear();
        this.curveDraw.prepare(path);
        this.curveDraw.drawCurve();
    },
});
