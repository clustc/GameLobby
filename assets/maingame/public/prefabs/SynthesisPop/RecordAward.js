cc.Class({
    extends: cc.Component,

    properties: {
        noRecordIcon: cc.Node,
    },

    onLoad() {
        this.PAGE_ITEMS = 8;
        var freeListView = this.node.getComponent('FreeListView');
        freeListView.loadPage = (page, items, okCbk, noCbk) => this.loadPage(page, items, okCbk, noCbk);
        freeListView.initItem = (node, data) => this.initItem(node, data);
        freeListView.updateItem = (item, data) => this.updateItem(item, data);
        freeListView.setPageItems(this.PAGE_ITEMS);

        this.node.on('Refresh_List', this.refreshList, this);
    },

    init(index) {
        this.reward_url = index == 1 ? 'GetExchangeRecord' : 'GetSynthesisRecord';
        this.refreshList();
    },

    onDestroy() {
        this.node.off('Refresh_List', this.refreshList, this)
    },

    refreshList(event) {
        var interval = event ? event.detail : 0;
        this.scheduleOnce(() => {
            this.node.getComponent('FreeListView').refreshView();
        }, interval)
    },

    ShowNoneInfo(data, okCbk) {
        data = data.sort((a, b) => { return a.receiveStatus - b.receiveStatus })
        okCbk && okCbk(data);
        this.noRecordIcon.active = this.node.getComponent('FreeListView').container.childrenCount == 0;
    },

    loadPage(page, items, okCbk, noCbk) {
        cc.Linker(this.reward_url, {
            page: page,
            pageSize: items
        }).request(data => { this.ShowNoneInfo(data, okCbk) }, noCbk);
    },

    initItem(node, data) {
        var item = node.getScript();
        item.init(data);
        return item;
    },

    updateItem(item, data) {
        item.init(data);
    }
});
