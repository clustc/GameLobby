cc.Class({
    extends: cc.Component,

    properties: {
        ResortButton: cc.Node,
        ActivityButton: cc.Node,
        BagButton: cc.Node,
        CelebrityListButton: cc.Node,
        TaskButton: cc.Node,
        ExchangeButton: cc.Node,
        SynthesisButton: cc.Node,
    },

    onLoad() {
        this.showTimer = 0;
        this.tips = ['领话费，快来这里！', '领话费，快来这里！', '领话费，快来这里！'];

        var data = ff.AccountManager.switchConfig.data;
        // this.ResortButton.active = data[5].state;
        // this.ActivityButton.active = data[6].state;
        this.BagButton.active = data[7].state;
        // this.CelebrityListButton.active = data[9].state;
        // this.TaskButton.active = data[11].state;
        // this.SynthesisButton.active = data[17].state;
        // this.ExchangeButton.active = data[16].state && data[18].state;

    },

    onGamesMenu() {
        cc.director.loadScene('ResortScene');
    },

    onActivityPop() {
        /**首页-活动 */
        ff.BuryingPoint(3401090001);
        cc.Popup('ActivityPop').show();
    },

    onCelebrityList() {
        cc.Popup('CelebrityListPop').show();
    },

    onSynthesisPop() {
        // /**首页-兑换页面 */
        // ff.BuryingPoint(3401000012);
        cc.Popup('SynthesisPop').show();
    },

    onExchangePop() {
        /**首页-兑换页面 */
        ff.BuryingPoint(3401000012);
        cc.Popup('ExchangePop').show();
    },

    onBagPop() {
        cc.Popup('BagPop').show();
    },

    onTaskPop() {
        /**首页-任务 */
        ff.BuryingPoint(3401000013);
        cc.Popup('TaskViewPop').show();
    },

    update(dt) {
        this.showTimer += dt;
        if (this.showTimer >= 0 && this.showTimer < 10) {
            this.showTips();
        }
        if (this.showTimer >= 10) {
            this.hideTips();
            if (this.showTimer >= 40) this.showTimer = 0;
        }
    },

    showTips() {
        if (!this.isTips) {
            this.isTips = true;
            // this.SynthesisButton.find('tips/label', cc.Label).string = this.tips[Math.rand(0, this.tips.length - 1)];
            // this.SynthesisButton.children[0].active = true;
        }
    },

    hideTips() {
        if (this.isTips) {
            this.isTips = false;
            // this.SynthesisButton.children[0].active = false;
        }
    },
});
