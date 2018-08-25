cc.Class({
    extends: cc.Component,

    properties: {
        teamName: cc.EditBox,
        fishInfo: cc.Prefab,
        fishTeam: cc.Prefab,
        inputLine: cc.Prefab,
        teamPreview: require('EditTeamPreview'),
        layout: cc.Node,
        btnClose: cc.Node,
    },

    onLoad() {
        this.btnClose.on('click', this.onClose, this);
        this.fishInfo = this.layout.addScriptNode(this.fishInfo);
        this.fishInfo.fishType.node.parent.active = true;
        this.fishInfo.fishStand.node.parent.active = true;
        this.fishInfo.fishDeath.node.parent.active = true;
    },

    editInfo(name, info) {
        var type = info.group ? (info.group.delay ? 'queue' : 'border') : 'single';
        this.teamPreview.createTeam(info.name, 1);
        this.fishInfo.data = info;
        this.fishInfo.fishName.node.parent.active = false;
        this.btnClose.off('click', this.onClose, this);
        this.btnClose.on('click', () => {
            this.node.emit('close', {
                type: type,
                name: name,
                info: this.fishInfo.data,
                group: info.group,
            });
        });
    },

    //single, queue, border
    init(type) {
        this.type = type;
        if(type !== 'single') {
            this.teamName.node.parent.active = true;
            cc.instantiate(this.inputLine).parent = this.layout;
            this.fishTeam = this.layout.addScriptNode(this.fishTeam);
            this.fishTeam.init(type);
            this.fishTeam.node.on('input-change', this.onInputChange, this);
            this.fishInfo.node.on('input-change', this.onInputChange, this);
        } else {
            this.fishInfo.teamPreview = this.teamPreview;
        }
    },

    onInputChange() {
        var info = this.fishInfo.data;
        var team = this.fishTeam.data;
        this.teamPreview.createTeam(info.name, team.count, team.range);
    },

    onClose() {
        if(this.fishInfo.data.name == '点击选择') return;
        var data = {};
        var team = this.fishTeam.data;
        data.type = this.type;
        data.info = this.fishInfo.data;
        if(this.type == 'single') {
            data.name = data.info.name;
        } else {
            data.name = this.teamName.string;
            data.group = {};
            data.group.index = [0, team.count];
            if(this.type == 'queue') {
                data.group.delay = team.delay / 1000;
            } else {
                data.group.offsets = this.teamPreview.getTeamOffsets();
            }
        }
        this.node.emit('close', data);
    },

});
