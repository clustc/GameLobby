const CCGlobal = require('CCGlobal');
cc.Class({
    extends: cc.Component,

    properties: {
        gameItem: cc.Node,
    },

    onLoad() {
        this.menuData = null;
        // this.gameItem.parent = null;
        this.menuData = ['http://wap.beeplay123.com/fishAppLegion'];
        // this.getGamesMenu();
    },

    getGamesMenu() {
        cc.Linker('GetResortList').request((data) => {
            this.menuData = data;
            this.initData();
        });
    },

    initData() {
        for (var i = 0; i < this.menuData.length; i++) {
            var p = cc.instantiate(this.gameItem);
            p.loadImage(this.menuData[i].icon);
            p.address = this.menuData[i].address;
            p.isVertical = this.menuData[i].displayMode == 0 ? false : true;
            p.parent = this.node;
            p.on('click', this.onOpenGame, this);
        }
    },

    onGamesOpen(event) {
        // var p = event.target;
        // var isVertical = p.isVertical ? '&vertical' : '';
        var url =this.menuData + '?token=' + CCGlobal.accessToken + '&vertical';
        cc.Proxy('openUrl', url).called(event => { }, event => { });
    },

    onOpenGame(){
        var p = event.target;
        var isVertical = p.isVertical ? '&vertical' : '';
        var url = p.address + '?token=' + CCGlobal.accessToken + isVertical;
        cc.Proxy('openUrl', url).called(event => { }, event => { });
    },
});
