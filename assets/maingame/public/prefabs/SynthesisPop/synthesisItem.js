cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        awardName: cc.Label,
        awardIcon: cc.Sprite,
    },

    init(data) {
        if (!data) return;
        this.itemData = data;
        this.awardName.string = data.awardsName;
        this.awardIcon.loadImage(data.awardsImage);
    },

    onBuy() {
        if (ff.AccountManager.isVisitor) {
            cc.Toast('游客状态无法合成哦').show();
            return;
        }

        cc.Linker('GetSynthesis', { awardsId: this.itemData.awardsId, fragmentId: this.itemData.fragmentId }).request((data) => {
            if (data.isSuccess) {
                this.scheduleOnce(() => {
                    this.parentNode.emit('Refresh_List', 1.3);
                    this.parentNode.emit('Refresh_UserInfo');
                    cc.Toast('合成成功!').show();
                }, 0.5)
            } else {
                cc.Toast('话费碎片不足，无法合成哦！').show();
            }
        })
    },
});
