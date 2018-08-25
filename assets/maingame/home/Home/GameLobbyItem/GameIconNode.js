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
        gameIconNode:cc.Node,
        gameBottomSpt:cc.Sprite,

        lblBar: cc.Label,
        bar : cc.ProgressBar,
        light : cc.Node,
        mask: cc.ProgressBar,
        downLoadNode : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameBottomSpt.node.active = false;

        this._barWidth = this.bar.node.width;
        this._isNew = true;
        
        this.downLoadNode.active = false;
    },

    initData:function(animation,iconSpt){
        var self = this;
        this.gameId = animation.substring(5);
        cc.loader.loadRes('animation/'+animation,cc.Prefab,function(error,prefab) {
            if (!error){
                var newNode = cc.instantiate(prefab);
                newNode.parent = self.gameIconNode;
                self.gameBottomSpt.spriteFrame = iconSpt;
                self.gameBottomSpt.node.active = true;
            }else{
                cc.log('load failed   '+error);
            }
        });
    },

    gameID:function(){
        return this.gameId;
    },

    /**
     * 开始下载/更新
     */
    startLoad:function(isNew){
        this._isNew = !!isNew;
        this.lblBar.string = (isNew ? "开始下载" : "开始更新");

        this.downLoadNode.active = true;
        this.bar.progress = 0;
        this.mask.progress = 1;
        this.light.x = -this._barWidth/2 + 4;
    },

    /**
     * 结束下载/更新
     */
    endLoad:function(){
        this.lblBar.string = (this._isNew ? "下载完成" : "更新完成");

        this.bar.progress = 1;
        this.mask.progress = 0;
        this.light.x = this._barWidth/2 + 4;
        this.fadeOutLoad();
    },

    /**
     * 下载/更新 进度
     */
    progressLoad:function(event){
        let downloaded = (event.getDownloadedBytes()/(1024*1024)).toFixed(2);
        let total = (event.getTotalBytes()/(1024*1024)).toFixed(2);

        let progress = (event.getDownloadedBytes()/event.getTotalBytes()).toFixed(2);
        this.bar.progress = progress;

        this.mask.progress = 1-progress;

        this.light.x = -this._barWidth/2 + this._barWidth*progress + 4;
        
        this.lblBar.string = (downloaded + "MB/"+total+"MB");
    },

    /**
     * 下载/更新失败
     */
    failLoad:function(){
        this.lblBar.string = (this._isNew ? "下载失败" : "更新失败");

        this.fadeOutLoad();
    },  

    fadeOutLoad:function(){
        // will crash
        // this.downLoadNode.runAction(cc.sequence([
        //     cc.delayTime(1),
        //     cc.fadeOut(0.5),
        //     cc.CallFunc(()=>{
        //         this.downLoadNode.active = false;
        //         // this.downLoadNode.opacity = 255;
        //     }),
        // ]));
    },  


});
