cc.Class({
    extends: require('EditDataView'),

    properties: {
       pathDouble: require('EditInputType'),
       pathRounds: require('EditInputValue'),
       pathRadius: require('EditInputValue'),
    },

    onLoad() {
        this.pathDouble.init(['上下对称', '单一居中'], [true, false]);
        this.pathRounds.init(cc.p(1, 100));
        this.pathRadius.init(cc.p(20, 2000));
        this.pathDouble.node.parent.active = false;
        this.pathRounds.node.parent.active = false;
        this.pathRadius.node.parent.active = false;
    },

    init(type) {
        this.clearBind();
        this.pathDouble.node.parent.active = type == 'line';
        this.pathRounds.node.parent.active = type != 'line';
        this.pathRadius.node.parent.active = type == 'round';
        if(type == 'line') {
            this.bindView('double', this.pathDouble);
        }
        if(type == 'sine') {
            this.bindView('rounds', this.pathRounds);
        }
        if(type == 'round') {
            this.bindView('rounds', this.pathRounds);
            this.bindView('radius', this.pathRadius);
        }
    },

    setData(data) {
        this.init(data.type);
        this._super(data);
    },
});
