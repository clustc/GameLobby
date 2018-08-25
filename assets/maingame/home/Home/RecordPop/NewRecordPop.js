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
        noContent:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.reqeustType = 1;
        var freeListView = this.node.getComponent('FreeListView');
        freeListView.setPageItems(10);
        freeListView.loadPage = (page, items, okCbk, noCbk) => this.loadPage(page, items, okCbk, noCbk);
        freeListView.initItem = (node, data) => this.initItem(node, data);
        freeListView.updateItem = (item, data) => this.updateItem(item, data);
        this.refreshList();
    },
    refreshList() {
        this.node.getComponent('FreeListView').refreshView();
    },
    loadPage(page, items, okCbk, noCbk){
        var url = 'GetGiftRecord';
        if (this.reqeustType == 2){
            url = 'SendGiftRecord';
        }
        cc.Linker(url,{page:page,pageSize:items}).request(data=>{
            cc.log('loadPage   '+JSON.stringify(data))
            if (data.length == 0&& page == 1){
                this.noContent.active = true;
            }else{
                this.noContent.active = false;
            }
           okCbk &&  okCbk(data);
        });
    },
    initItem(node, data) {
        var item = node.getScript();
        if (this.reqeustType == 1){
            item.initData(data);
        }else{
            item.initItemdata(data);
        }
        
        return item;
    },

    updateItem(item, data) {
        if (this.reqeustType == 1){
            item.initData(data);
        }else{
            item.initItemdata(data);
        }
    },
    getRecordBtnClick:function(){
        this.reqeustType = 1;
        this.refreshList();
    },
    sendRecordBtnClick:function(){
        this.reqeustType = 2;
        this.refreshList();
    },
    start () {

    },

    // update (dt) {},
});
