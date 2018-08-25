cc.Class({
    extends: require('PoolLayer'),

    properties: {
        contentView: cc.Node,
        awardList: cc.Node,

        //道具节点
        awardItem: cc.Prefab,

        //当前奖池进度
        goldPool: cc.Label,

        //进度条设置
        progress: cc.ProgressBar,
        progressText: cc.Label,
        progressBarText: cc.Label,

        //查看鱼鉴按钮  &&  抽奖按钮
        lookOverFishButton: cc.Button,
        DrawButton: cc.Button,

        //领奖动画
        rewardAnim: cc.Prefab,
    },
    onLoad() {
        this.removeChildren();
    },

    initData(configData, userData, index, progressFlag) {
        if (!configData || !userData) return;
        if (!this.configData) this.configData = configData;
        if (!this.userData) this.userData = userData;
        this.index = index;
        this.setView();
        this.setDrawButton();
    },

    createObject() {
        var object = cc.instantiate(this.awardItem);
        return object;
    },

    resetObject(object, type) {
        object.parent = null;
    },

    setView() {
        this.removeChildren();
        var data = this.configData[this.index].props;
        for (var i = 0; i < data.length; i++) {
            var item = this.produce('awardItem');
            item.getScript().initItem(data[i]);
            item.parent = this.awardList;
        }
    },

    initProgressData(configData, userData, index) {
        if (!this.configData) this.configData = configData;
        if (!this.userData) this.userData = userData;
        this.userMaxLevel = index;
        this.initProgress(index);
    },

    initProgress(index) {
        this.goldPool.string = this.userData.score;
        if (this.userData.kill < this.configData[index].kill) {
            this.progressText.string = '击杀奖金鱼数量';
            this.progressBarText.string = this.userData.kill + ':' + this.configData[index].kill;
            var progress = this.userData.kill / this.configData[index].kill;
        }
        else {
            this.progressText.string = this.configData[index].desc;
            this.progressBarText.string = this.userData.score + ':' + this.configData[index].score;
            var progress = this.userData.score / this.configData[index].score;
        }
        this.setProgress(progress);
    },

    setProgress(progress) {
        progress = progress >= 1 ? 1 : progress;
        this.progress.progress = progress;
    },

    setDrawButton() {
        if (this.index == 0) {
            var progress = this.userData.kill / this.configData[this.index].kill;
        }
        else {
            if (this.userData.kill < this.configData[this.index].kill) {
                var progress = this.userData.kill / this.configData[this.index].kill;
            }
            else var progress = this.userData.score / this.configData[this.index].score;
        }
        if (progress >= 1) {
            this.DrawButton.node.active = true;
            this.lookOverFishButton.node.active = false;
        } else {
            this.lookOverFishButton.node.active = true;
            this.DrawButton.node.active = false;
        }
    },

    removeChildren() {
        var allItems = this.awardList.children;
        if (allItems.length <= 0) return;
        for (var i = 0; i < allItems.length; i++) {
            this.reclaim(allItems[i], 'awardItem');
            i--;
        }
    },

    onFreeDraw() {
        /**游戏-抽奖页面-点击抽奖 */
        // ff.BuryingPoint(3402040002);
        if (this.index !== this.configData.length - 1 || this.userData.score <= this.configData[this.configData.length - 1].score) {
            cc.Popup('FreeDrawTips').show((node) => {
                node.initTips(this.configData[this.userMaxLevel], this.userData, this.configData[this.configData.length - 1]);
            }, (flag) => {
                if (flag) {
                    this.createAnim();
                }
            })
        }
        else {
            this.createAnim();
        }
    },

    createAnim() {
        this.node.emit('close');
        //创建抽奖动画
        cc.Popup('DrawAnimation').outsideClose(false).show((item) => {
            item.initAnim(this.configData[this.index]);
        })
    },

});
