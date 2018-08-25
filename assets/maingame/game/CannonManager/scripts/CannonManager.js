cc.Class({
    extends: cc.Component,

    properties: {
        battery: cc.Prefab,
    },

    onLoad() {
        this.batterys = [];
        for(var i = 0; i < 4; i++) {
            var node = cc.instantiate(this.battery);
            node.getComponent('CannonAssets').init(this.getBatteryPosition(i));
            node.parent = this.node;
            this.batterys.push(node);
        }
        ff.WSLinkManager.on('EnterRoomMsg', this.onEnterRoomMsg, this);
        ff.WSLinkManager.on('ChangeRoomMsg', this.onChangeRoomMsg, this);
        ff.WSLinkManager.on('CannonFireMsg', this.onCannonFireMsg, this);
        ff.WSLinkManager.on('CannonPropMsg', this.onCannonPropMsg, this);
        ff.WSLinkManager.on('CannonSkinMsg', this.onCannonSkinMsg, this);
        ff.WSLinkManager.on('CannonLevelMsg', this.onCannonLevelMsg, this);
        ff.WSLinkManager.on('CannonLocateMsg', this.onCannonLocateMsg, this);
        ff.WSLinkManager.on('CannonBrokenMsg', this.onCannonBrokenMsg, this);
        ff.WSLinkManager.on('BulletHitFishMsg', this.onBulletHitFishMsg, this);
    },

    getBatteryPosition(place) {
        var h = cc.screenBoundingBox.height / 2;
        var x = place % 2 == 0 ? -340 : 340;
        var y = place < 2 ? -h : h;
        return cc.p(x, y);
    },

    flipBatteryPlace() {
        var batterys = this.batterys.concat();
        for(var i in this.batterys) this.batterys[i] = batterys[3 - i];
    },

    getBatteryData(players, place) {
        for(var i in players) if(players[i].place == place) return players[i];
        return null;
    },

    onReconnectMsg(event) {
        this.onChangeRoomMsg(event);
    },

    onEnterRoomMsg(event) {
        var detail = event.detail;
        cc.log('进入房间的数据  '+JSON.stringify(detail));
        if(detail.playerPlace > 1) this.flipBatteryPlace();
        for(var i in this.batterys) {
            var data = this.getBatteryData(detail.roomPlayers, i);
            var node = this.batterys[i];
            if(data && data.place === detail.playerPlace) {
                this.batterys[i] = node.addComponent('CannonControl');
                if(data.vipLevel > 0) ff.EffectManager.onVipEnter(data);
            } else {
                this.batterys[i] = node.addComponent('CannonBattery');
            }
            // cc.log('onEnterRoomMsg cannon data    '+JSON.stringify(data));
            this.batterys[i].setData(data);
        }
    },

    onChangeRoomMsg(event) {
        
        var players = event.detail.roomPlayers;
        var playerExtras = event.detail.playerExtras;
        for (var i = 0 ;i < players.length;i++){
            var extras = playerExtras[i];
            var data = players[i];
            data.skinId = extras.skinId;
        }
        // cc.error('onChangeRoomMsg   ' + JSON.stringify(players));
        for(var i in this.batterys) {
            var data = this.getBatteryData(players, i);
            var change = this.batterys[i].setData(data);
            if(change && data && data.vipLevel > 0) ff.EffectManager.onVipEnter(data);
        }
    },

    onCannonFireMsg(event) {
        var data = event.detail;
        this.batterys[data.place].data && this.batterys[data.place].onFire(data.rotation);
    },

    onCannonPropMsg(event) {
        var data = event.detail;
        this.batterys[data.place].data && this.batterys[data.place].onUseProp(data);
    },

    onCannonSkinMsg(event) {
        var data = event.detail;
        this.batterys[data.place].data && this.batterys[data.place].onSkin(data.skinId);
    },

    onCannonLevelMsg(event) {
        
        var data = event.detail;
        cc.log('CannonLevelMsg   炮等级改变' +JSON.stringify(data));
        this.batterys[data.place].data && this.batterys[data.place].onLevelChange(data.level);
    },

    onCannonLocateMsg(event) {
        var data = event.detail;
        this.batterys[data.place].data && this.batterys[data.place].onLocateFish(data.targets);
    },

    onCannonBrokenMsg(event) {
        var data = event.detail;
        this.batterys[data.place].data && this.batterys[data.place].onBroken();
    },

    onBulletHitFishMsg(event) {
        
        var data = event.detail;
        cc.log('onBulletHitFishMsg   '+JSON.stringify(data));
        var fish = ff.FishManager.getFishById(data.fishId, data.fishOrder);
        var battery = this.batterys[data.place];
        if(!fish || fish.caught || !battery.data) return;
        data.fish = fish;
        data.battery = battery;
        battery.onBulletHitFish(data);
        ff.AwardManager.onBulletHitFish(data);
    },
});
