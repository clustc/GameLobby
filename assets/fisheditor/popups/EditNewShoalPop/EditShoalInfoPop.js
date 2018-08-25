cc.Class({
    extends: cc.Component,

    properties: {
        fishInfo: cc.Prefab,
        shoalEmit: cc.Prefab,
        shoalType: cc.Prefab,
        inputLine: cc.Prefab,
        teamPreview: require('EditTeamPreview'),
        layout: cc.Node,
        btnClose: cc.Node,
    },

    onLoad() { 
        this.btnClose.on('click', this.onClose, this);
        this.fishInfo = this.layout.addScriptNode(this.fishInfo);
        this.fishInfo.teamPreview = this.teamPreview;
        cc.instantiate(this.inputLine).parent = this.layout;
        this.shoalEmit = this.layout.addScriptNode(this.shoalEmit);
        cc.instantiate(this.inputLine).parent = this.layout;
        this.shoalType = this.layout.addScriptNode(this.shoalType);
    },

    init(data, duration) {
        this.duration = duration;
        if(typeof data == 'string') {
            this.shoalType.init(data);
            this.type = data;
        } else {
            this.shoalType.init(data.edit.type);
            this.type = data.edit.type;
            this.fishInfo.data = data.info;
            this.shoalType.data = data.edit;
            this.shoalEmit.data = data.edit.emit;
            this.editData = data;
        }
    },
    
    onClose() {
        if(this.fishInfo.data.name == '点击选择') return;
        var data = {};
        var emit = this.shoalEmit.data;
        var edit = this.shoalType.data;
        edit.type = this.type;
        edit.offset = 0;
        if(this.editData) {
            edit.offset = this.editData.edit.offset;
            if(this.type == 'line' && !edit.double) edit.offset = 0;
        } else {
            if(this.type == 'round') edit.offset = -500;
            if(this.type == 'line' && edit.double) edit.offset = 100;
        }
        data.edit = edit;
        data.edit.emit = emit;
        data.info = this.fishInfo.data;
        data.path = {
            velocity: emit.velocity,
        };
        data.emit = {
            interval: emit.interval / 1000,
            duration: this.duration / 1000,
            doubleX: this.type == 'round',
            doubleY: (this.type == 'sine' || (this.type == 'line' && edit.double)),
        };
        data.name = data.info.name;
        data.group = {
            index: [0, -1],
            delay: emit.interval / 1000,
        }
        this.node.emit('close', data);
    }
});
