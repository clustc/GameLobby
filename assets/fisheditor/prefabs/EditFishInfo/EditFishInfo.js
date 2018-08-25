cc.Class({
    extends: require('EditDataView'),

    properties: {
        fishName: cc.Label,
        fishType: require('EditInputType'),
        fishStand: require('EditInputType'),
        fishDeath: require('EditInputType'),
    },

    onLoad() {
        this.fishType.init(ff.FISH_TYPES_TEXT, ff.FISH_TYPES);
        this.fishStand.init(ff.FISH_STANDS_TEXT, ff.FISH_STANDS);
        this.fishDeath.init(ff.FISH_DEATHS_TEXT, ff.FISH_DEATHS);
        this.fishName.node.on('click', this.onNameClick, this);
        this.bindView('type', this.fishType);
        this.bindView('stand', this.fishStand);
        this.bindView('death', this.fishDeath);
        this.bindView('name', this.fishName, data => this.fishName.string = data, () => (this.fishName.string));
        this.teamPreview = null;
    },

    onNameClick() {
        ff.Popup('EditFishSelectPop').show(null, data => {
            this.fishName.string = data;
            this.teamPreview && this.teamPreview.createTeam(data, 1);
            this.node.emit('input-change');
        })
    },

});
