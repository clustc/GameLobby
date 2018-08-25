/**
 * 多点曲线，由多个贝塞尔曲线组成
 */

const BaseBezier = require('BaseBezier');

cc.Class({

    extends: cc.Component,

    properties: {
        curve: {
            set(data) {
                this._beziers = data.beziers;
                this._longness = data.longness;
            },
            get() {
                return {
                    beziers: this._beziers,
                    longness: this._longness
                }
            }
        },
        beziers: {
            get() { return this._beziers; }
        },
        longness: {
            get() { return this._longness; }
        }
    },

    ctor() {
        this._beziers = [];
        this._longness = 0;
    },

    reset() {
        this._beziers = [];
        this._longness = 0;
    },

    prepare(data) {
        var lengths = data.lengths;
        var pointys = data.pointys;
        var pointxs = data.pointxs;

        this._longness = 0;
        this._beziers = [];

        for(var i = 0; i < lengths.length; i++) {
            var bezier = new BaseBezier(
                pointxs[i * 3],
                pointys[i * 3],
                pointxs[i * 3 + 1],
                pointys[i * 3 + 1],
                pointxs[i * 3 + 2],
                pointys[i * 3 + 2]
            );
            bezier.length = lengths[i];
            this._beziers.push(bezier);
            this._longness += bezier.length;
        }

        for (var i in this._beziers) {
            this._beziers[i].ratio = lengths[i] / this._longness;
        }
    },
});
