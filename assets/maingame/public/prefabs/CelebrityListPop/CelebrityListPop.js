cc.Class({
    extends: cc.Component,

    properties: {
        userLevel: cc.Label,
        celebrityListMessage: cc.Node,
        UserSignatureButton:cc.Node,
    },

    onLoad() {
        this.isFirstOpen = true;
        this.isShowUserLevel = 0;
        var freeListView = this.node.getComponent('FreeListView');
        freeListView.setPageItems(7);
        freeListView.loadPage = (page, items, okCbk, noCbk) => this.loadPage(page, items, okCbk, noCbk);
        freeListView.initItem = (node, data) => this.initItem(node, data);
        freeListView.updateItem = (item, data) => this.updateItem(item, data);
        this.refreshList();
        this.node.on('Refresh_List', this.refreshList, this);

        var state = ff.AccountManager.switchConfig.findStateByName('celebrity_PersonalityMessage');
        this.UserSignatureButton.active = state;
    },

    refreshList() {
        this.node.getComponent('FreeListView').refreshView();
    },

    loadPage(page, items, okCbk, noCbk) {
        var flag = this.isFirstOpen;
        cc.Linker('GetRankList', {
            page: page,
            count: items
        }).showLoading(flag).request(data => { this.setUserLevel(data, okCbk) }, noCbk);
    },

    initItem(node, data) {
        var item = node.getScript();
        item.initItem(data);
        return item.LoadImg(data),item;
    },

    updateItem(item, data) {
        item.initItem(data);
        return item.LoadImg(data);
    },

    setUserLevel(data,okCbk) {
        this.isFirstOpen = false;
        //设置当前用户的排名
        if( this.isShowUserLevel <= 0)
        {
            this.userLevel.string = data.self == 0 ? '您当前暂未上榜' : '您当前排名: ' + data.self;
            this.isShowUserLevel++;
        }
        okCbk && okCbk(data.rank);
    },

    onSignaturePop() {
        //打开弹窗
        this.celebrityListMessage.active = true
        this.celebrityListMessage.children[1].scale = 0.6;
        this.celebrityListMessage.children[1].runAction(cc.sequence(
            cc.scaleTo(0.3, 1).easing(cc.easeBackOut()),
            cc.callFunc(() => {
                this.celebrityListMessage.children[0].getComponent(cc.Button).interactable = true;
            })
        ));
    },
});
