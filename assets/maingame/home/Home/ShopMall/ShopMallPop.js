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
       contentUp:cc.Node,
       contentDown:cc.Node,
       shopItemPrefab:cc.Prefab,
       moenyInput:cc.EditBox,
       goldLbl:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.Linker('ShopMall').request(data=>this.initData(data));
    },
    initData:function(data){
        this.exchangeProportion = data.exchangeProportion;
        this.open = data.open;
        cc.log('dadasdsa   '+JSON.stringify(data));
        var common = data.common;
        for (var i = 0; i < common.length;i++){
            var node = cc.instantiate(this.shopItemPrefab);
            node.parent = i < 3? this.contentUp:this.contentDown;
            var js = node.getComponent(node.name);
            js.initData(common[i]);
        }
    },
    eidtBoxChanged:function(evt){

    },
    confirmPayAction:function(){

    },
    start () {

    },

    // update (dt) {},
});
