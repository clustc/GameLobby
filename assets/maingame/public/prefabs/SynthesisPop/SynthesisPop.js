cc.Class({
    extends: cc.Component,

    properties: {
        coins: cc.Label,
        fragment: cc.Label,
        content: cc.Node,
        itemNode: cc.Node,
    },

    onLoad() {
        this.configData = null;
        this.content.removeAllChildren();

        this.recordAward = this.node.getComponent('RecordAward');
        this.recordAward.init();
        
        this.setUserInfo();
        var config = ff.AccountManager.shopConfig;
        // config.refreshSynthesisData((data) => {
        //     this.synthesisData = data;
        //     this.creatItem();
        // }, 'isLoading')

        this.node.on('Refresh_UserInfo', this.setUserInfo, this);
        ff.AccountManager.on('EVENT_REFRESH_ACCOUNT', this.setUserInfo, this)
    },

    onDestroy() {
        this.node.off('Refresh_UserInfo', this.setUserInfo, this);
        ff.AccountManager.off('EVENT_REFRESH_ACCOUNT', this.setUserInfo, this)
    },

    setUserInfo() {
        //设置用户信息
        this.coins.string = ff.AccountManager.coins;
        var fragmentAmount = 0;
        cc.Linker('GetMineBagList', { page: 1, pageSize: 100 }).request((data) => {
            for (var i = 0; i < data.fragmentBag.length; i++) {
                if (data.fragmentBag[i].fragmentId == 7) {
                    fragmentAmount = data.fragmentBag[i].price;
                }
            }
            this.fragment.string = fragmentAmount;
        })
    },

    creatItem() {
        var data = this.synthesisData;
        for (var i = 0; i < data.length; i++) {
            var p = cc.instantiate(this.itemNode);
            p.getScript().init(data[i]);
            p.parent = this.content;
        }
    },
});
