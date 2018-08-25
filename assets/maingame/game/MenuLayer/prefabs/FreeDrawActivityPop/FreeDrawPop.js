cc.Class({
    extends: cc.Component,

    properties: {
        selectedFrame: [cc.SpriteFrame],
        unSelectedFrame: [cc.SpriteFrame],
    },

    onLoad() {
        this.userData = null;
        this.freeDrawData = null;
        this.freeDrawView = this.node.getComponent('FreeDrawView');
        this.init();
    },

    init() {
        this.allItems = this.node.getComponent('RadioButton').buttonArray;
        this.node.on('click_start', this.setFreeDrawShow, this);
        this.node.on('click_cancel', this.setFreeDrawHide, this);
        this.setTag();
    },

    onDestroy() {
        this.node.off('click_start', this.setFreeDrawShow, this);
        this.node.off('click_cancel', this.setFreeDrawHide, this);
    },

    setTag() {
        for (var i = 0; i < this.allItems.length; i++) {
            this.allItems[i].node.order = i;
        }
    },

    initData(data, msg) {
        this.freeDrawData = data;
        this.userData = msg;
        this.initView();
    },

    initView() {
        var index = this.judgeUserLevel();
        var setIndex = index - 1 < 0 ? 0 : index - 1;
        var progressIndex = index === this.freeDrawData.length ? index - 1 : index;
        this.node.getComponent('RadioButton').setState(setIndex);
        this.freeDrawView.initProgressData(this.freeDrawData, this.userData, progressIndex);
    },

    judgeUserLevel() {
        for (var i = 0; i < this.freeDrawData.length; i++) {
            if (this.userData.kill >= this.freeDrawData[i].kill) {
                if (this.userData.score < this.freeDrawData[i].score) {
                    return i;
                }
                else if (i == this.freeDrawData.length - 1) {
                    return this.freeDrawData.length;
                }
            }
            else {
                return i;
            }
        }
    },

    setFreeDrawShow(event) {
        var item = event.detail.node;
        item.setLocalZOrder(999);
        item.children[0].getComponent(cc.Sprite).spriteFrame = this.unSelectedFrame[item.order];
        this.refreshAwardContent(item);
    },

    setFreeDrawHide(event) {
        var item = event.detail.node;
        item.setLocalZOrder(-1);
        item.children[0].getComponent(cc.Sprite).spriteFrame = this.selectedFrame[item.order];
    },

    refreshAwardContent(target) {
        this.freeDrawView.initData(this.freeDrawData, this.userData, target.order);
    },

    onFishSpeciesPop(){
        this.node.emit('close');
         cc.Popup('FishSpeciesPop').show();
    },
});
