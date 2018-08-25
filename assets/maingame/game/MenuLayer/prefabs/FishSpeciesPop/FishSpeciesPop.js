const FishInfo = require('FishData').FishInfo;
const FishType = ['NORMAL', 'AWARD', 'SPECIAL', 'BOSS'];
cc.Class({
    extends: cc.Component,

    properties: {
        quitBtn:cc.Node,
        content: cc.Node,
        textSelectIcon: [cc.SpriteFrame],
        textUnselectIcon: [cc.SpriteFrame],

        fishSpriteFrame: [cc.SpriteFrame],
        fishItem:cc.Node,
        ItemTitleFrame:[cc.SpriteFrame],
    },

    onLoad() {
        this._radioButton = this.node.getComponent('RadioButton');
        this.setTagToNode();
        this._radioButton.refreshButton();
        this._radioButton.setState(0);
        this.quitBtn.on('click',()=>this.node.emit('close'),this)
        this.node.on('click_start', this.onClickStart, this);
        this.node.on('click_cancel', this.onClickCancel, this);
    },

    setTagToNode() {
        for (var i = 0; i < this._radioButton.buttonArray.length; i++) {
            this._radioButton.buttonArray[i].node.order = i;
        }
    },


    onClickStart(event) {
        var item = event.detail.node;
        item.children[0].getComponent(cc.Sprite).spriteFrame = this.textSelectIcon[item.order];
        this.initFishData(item.order);
        this.showView(item.order);
    },

    onClickCancel(event) {
        var item = event.detail.node;
        item.children[0].getComponent(cc.Sprite).spriteFrame = this.textUnselectIcon[item.order];
    },

    showView(type) {
        cc.log('showView   '+type);
        this.content.children[0].active = type === 0;
        this.content.children[1].active = type === 1;
        this.content.children[2].active = type === 2;
        this.content.children[3].active = type === 3;
    },

    initFishData(type) {
        var ContentNode = this.content.children[type].getComponent(cc.ScrollView).content;
        var isNewOpen = ContentNode.children.length> 0?false:true;
        var fishNames = [];
        if(!isNewOpen) return;
        var fishType = FishType[type];
        for (var name in FishInfo) {
            var fish = FishInfo[name];
            if (name !== fish.name) continue;
            if (fish.type === fishType) fishNames.push(name);
        }
        this.createFishItem(fishNames,ContentNode,type);
        cc.log('all fish   '+fishNames);
    },

    createFishItem(fishNames,content,type){
        var type = type >=2?2:type;
        for(var i=0;i<fishNames.length;i++){
            var p = cc.instantiate(this.fishItem);
            p.children[0].getComponent(cc.Sprite).spriteFrame = this.ItemTitleFrame[type];
            p.children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.getFishNameSprite(fishNames[i]);
            this.getFishAnim(fishNames[i],p.children[1]);
            p.children[2].getComponent(cc.Label).string = '/'+ FishInfo[fishNames[i]].value;
            p.active= true;
            p.parent = content;
        }
    },

    getFishNameSprite(name) {
        for (var i in this.fishSpriteFrame) {
            if (this.fishSpriteFrame[i].name == name) return this.fishSpriteFrame[i];
        }
    },

    getFishAnim(name,parentNode) {
        var det = 1;
        var fishNode = ff.ConstAssets.produceFishAnim(name);
        fishNode.setPosition(0,0);
        fishNode.rotation = 0;
        if(fishNode.width >= fishNode.height){
            if(fishNode.width > 110){
                det = 110 / fishNode.width;
            }
        }else{
            if(fishNode.height > 90){
                det = 90 / fishNode.height;
            }
        }
        fishNode.setScale(det,det);
        fishNode.parent= parentNode;
    },
});
