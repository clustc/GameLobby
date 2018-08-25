cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        contain: cc.Node,
        item: cc.Node,

        //描述节点
        descView: cc.Node,
        descItem: cc.Node,
        desc: cc.Node,
        descText: cc.RichText,

        leftButton: cc.Node,
        rightButton: cc.Node,

        progress: cc.ProgressBar,
        nowVipLevel: cc.Label,
        nextVipLevel: cc.Label,
        rechargeAmount: cc.RichText,

        RechargeButton:cc.Node,
    },

    onLoad() {
        //是否打开描述状态
        this.isOpenDesc = false;
        //描述弹窗是否在位移
        this.isDescMoving = false;
        //是否是移动状态
        this.isMoving = false;
        //是否超出边界
        this.isLeftOverBound = false;
        this.isRightOverBound = false;
        //显示描述时的边界状态
        this.isLeftDesc = false;
        this.isRightDesc = false;
        //选中的数据
        this.chooseData = null;
        //选中的数据的位置
        this.showIndex = null;

        //获取vip特权配置
        // this.getVipConfig();
        //设置进度条
        this.setProgress();
        //绑定scrollView事件
        this.bindEvent();

        this.RechargeButton.active =  ff.AccountManager.switchConfig.findStateByName('shop');
    },

    getVipConfig() {
        this.vipConfigData = ff.AccountManager.vipConfig.data;
        this.initView(this.vipConfigData);
    },

    initView(data) {
        this.contain.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            this.createItem(data[i], i);
        }
    },

    //设置进度条
    setProgress() {
        var nowVipLevel = ff.AccountManager._vipLevel;
        if (nowVipLevel >= this.vipConfigData.length) {
            this.nowVipLevel.string = this.vipConfigData.length;
            this.nextVipLevel.string = this.vipConfigData.length;
            this.rechargeAmount.string = '<b>您已达到最高VIP等级</b>';
            var progress = 1;
        }
        else {
            this.nowVipLevel.string = nowVipLevel;
            this.nextVipLevel.string = nowVipLevel + 1;
            var lastRecharge = this.vipConfigData[nowVipLevel].recharge - ff.AccountManager.recharge;
            this.rechargeAmount.string = '再充值<color=red>' + lastRecharge + '元</color>,即可升级到' + (nowVipLevel + 1) + ',高级VIP可同时享受低级VIP特权';
            var progress = ff.AccountManager.recharge / this.vipConfigData[nowVipLevel].recharge;
        }
        this.progress.progress = progress;
    },

    //创建子节点
    createItem(data, index) {
        var p = cc.instantiate(this.item);
        p.x = (this.ITEM_WIDTH + this.ITEM_SPACE) * index;
        p.order = index;
        p.getScript().init(data);
        p.parent = this.contain;
        this.bindEventToNode(p);
    },

    bindEventToNode(node) {
        node.on('click', this.showDesc, this);
    },

    bindEvent() {
        this.scrollView.node.on('scrolling', () => this.isMoving = true, this);
        this.scrollView.node.on('scroll-ended', () => this.isMoving = false, this);
    },

    showDesc(event) {
        if (this.isMoving) return;
        this.isOpenDesc = true;
        this.showIndex = event.target.order;
        this.descView.active = true;
        this.scrollView.node.active = false;
        this.chooseData = this.vipConfigData[event.target.order];
        this.descItem.getScript().init(this.chooseData);
        this.runDescAnim('show');
    },

    runDescAnim(flag) {
        if (this.isDescMoving) return;
        flag = flag === 'show';
        var descPos, itemPos, time;
        if (flag) {
            descPos = cc.p(70, -20);
            itemPos = cc.p(20, 0);
            time = 0.5;
            this.descText.string = this.chooseData.desc;
        }
        else {
            descPos = cc.p(-635, -20);
            itemPos = cc.p(368.5, 0);
            time = 0.3;
        }
        this.descItem.runAction(cc.sequence(
            cc.spawn(
                cc.callFunc(() => {
                    this.isDescMoving = true;
                    this.desc.runAction(cc.moveTo(time, descPos));
                }),
                cc.moveTo(time, itemPos)
            ),
            cc.callFunc(() => {
                this.scrollView.node.active = !flag;
                this.isOpenDesc = flag;
                this.descView.active = flag;
                this.isDescMoving = false;
            })
        ))
    },

    update(dt) {
        var offset = this.scrollView.getScrollOffset().x;
        if(offset > 0){
            this.isLeftOverBound = true;
        }else this.isLeftOverBound = false;

        if(offset < -955){
            this.isRightOverBound = true;
        }else this.isRightOverBound = false;

        if(this.showIndex === this.vipConfigData.length - 1){
            this.isRightDesc = true;
        }else{
            this.isRightDesc = false;
        }

        if(this.showIndex === 0){
            this.isLeftDesc = true;
        }else{
            this.isLeftDesc = false;
        }
    },

    //左按钮 
    onLeft() {
        if(this.isDescMoving) return;
        if(this.isOpenDesc) this.onOpenLeft();
        else this.onCloseLeft();
    },

    onCloseLeft(){
        if(this.isLeftOverBound) return;
        this.scrollView.scrollToLeft(0.3);
    },

    onOpenLeft(){
        if(this.isLeftDesc) return;
        this.showIndex = this.showIndex - 1 <= 0 ? 0 : this.showIndex - 1;
        var showData = this.vipConfigData[this.showIndex];
        this.descItem.getScript().init(showData);
        this.descText.string = showData.desc;
    },

    //右按钮 
    onRight() {
        if(this.isDescMoving) return;
        if(this.isOpenDesc) this.onOpenRight();
        else this.onCloseRight();
    },

    onCloseRight(){
        if(this.isRightOverBound) return;
        this.scrollView.scrollToRight(0.3);
    },

    onOpenRight(){
        if(this.isRightDesc) return;
        this.showIndex = this.showIndex + 1 >=  this.vipConfigData.length - 1 ? this.vipConfigData.length - 1 : this.showIndex + 1;
        var showData = this.vipConfigData[this.showIndex];
        this.descItem.getScript().init(showData);
        this.descText.string = showData.desc;
    },

    onOpenShop() {
        ff.BuryingPoint(3401040001);
        this.node.emit('close');
        ff.PopupManager.showShopPop();
    },
});
