cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        content: cc.Node,
        itemNode: cc.Node,
    },

    onLoad() {
        this.isMoving = false;
        this.content.removeAllChildren();
        //获取兑换配置
        // this.getExchangeData();
        //绑定scrollView事件
        this.bindEvent();
    },

    getExchangeData() {
        var config = ff.AccountManager.shopConfig;
        config.refreshExchangeData((data) => {
            this.exchange = data;
            this.init();
        }, 'isLoading')
    },

    init() {
        var data = this.exchange.list;
        for (var i = 0; i < data.length; i++) {
            var p = cc.instantiate(this.itemNode);
            p.getScript().init(data[i]);
            p.parent = this.content;
        }
    },

    bindEvent() {
        this.scrollView.node.on('scrolling', () => this.isMoving = true, this);
        this.scrollView.node.on('scroll-ended', () => this.isMoving = false, this);
    },

    onLeft() {
        if (this.isMoving) return;
        var left = this.scrollView.getScrollOffset().x;
        var width = this.content.width;
        var MaxLeft = 0;
        if (left - MaxLeft >= width) {
            this.scrollView.scrollToOffset(cc.p(left - width, 0), 0.2);
        } else {
            this.scrollView.scrollToLeft(0.2);
        }
    },

    onRight() {
        if (this.isMoving) return;
        var right = this.scrollView.getScrollOffset().x;
        var width = this.content.width;
        var MaxRight = this.scrollView.getMaxScrollOffset().x;;
        if (width + right >= MaxRight) {
            this.scrollView.scrollToOffset(cc.p(right + width, 0), 0.2);
        } else {
            this.scrollView.scrollToRight(0.2);
        }
    },

    onRecordAwardList() {
        cc.Popup('RecordAward').outsideClose(false).show((node) => {
            node.init(1);
        });
    },

    onExchangeQuestion() {
        cc.Popup('ExchangeQuestion').outsideClose(false).show();
    },
});
