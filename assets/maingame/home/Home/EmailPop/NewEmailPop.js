// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        emailScorllView:cc.ScrollView,
        emilItem:cc.Node,
        noContent:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.page = 1;
        // this.pageSize = 10;
        var freeListView = this.node.getComponent('FreeListView');
        freeListView.setPageItems(5);
        freeListView.loadPage = (page, items, okCbk, noCbk) => this.loadPage(page, items, okCbk, noCbk);
        freeListView.initItem = (node, data) => this.initItem(node, data);
        freeListView.updateItem = (item, data) => this.updateItem(item, data);
        this.refreshList();
        this.node.on('Refresh_List', this.refreshList, this);
       
    },
    refreshList(event) {
        var interval = event ? event.detail : 0;
        this.scheduleOnce(() => {
            this.node.getComponent('FreeListView').refreshView();
        }, interval)
    },
    loadPage(page, items, okCbk, noCbk){
        cc.Linker('PlatfromEmail',{page:page,pageSize:items}).request(data=>{
            cc.log('loadPage   '+JSON.stringify(data))
            if (data.length == 0 && page == 1){
                this.noContent.active = true;
            }else{
                this.noContent.active = false;
            }
           okCbk &&  okCbk(data);
        });
    },
    initItem(node, data) {
        var item = node.getScript();
        item.initData(data);
        return item;
    },

    updateItem(item, data) {
        item.initData(data);
    },
    start () {

    },

    // update (dt) {},
});
