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
        parentNode: cc.Node,
        emailIcon:cc.Sprite,
        emailContent:cc.Label,
        emailTime:cc.Label,
        redPoint:cc.Node,
        unreadIcon:cc.SpriteFrame,
        havereadIcon:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('click',this.itemClick,this);
    },
    initData:function(data){
        this.data = data;
        this.emailContent.string = data.fromUserNickname + '给您赠送了一笔金币';
        this.emailTime.string = data.createTime;
        if (data.status == 2 || data.status == 3){
            this.redPoint.active = false;
            this.emailIcon.spriteFrame = this.havereadIcon;
        }else{
            this.redPoint.active = true;
            this.emailIcon.spriteFrame = this.unreadIcon;
        }
    },
    itemClick:function(){
        cc.log('clck    '+JSON.stringify(this.data));
        if (this.data.status == 2 || this.data.status == 3) return;
        var self = this;
        cc.Popup('NewGiftPop').show(((node)=>{
            node.initData(this.data);
        }),()=>{
            this.parentNode.emit('Refresh_List', 1.3);
        });
    },
    start () {

    },

    // update (dt) {},
});
