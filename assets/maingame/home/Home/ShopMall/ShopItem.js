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
        shopIcon:cc.Sprite,
        goodsDes:cc.Label,
        goodsPrice:cc.Label,
        goodsIconSpt:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initData:function(data){
        this.shopIcon.spriteFrame = this.goodsIconSpt[data.sort-1];
        if (data.amount < 10000){
            this.goodsDes.string = data.initData;
        }else{
            this.goodsDes.string = parseInt(data.amount / 10000);
        }
        this.goodsPrice.string = data.price;
    },
    start () {

    },

    // update (dt) {},
});
