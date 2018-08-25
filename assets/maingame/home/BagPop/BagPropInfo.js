cc.Class({
    extends: cc.Component,

    properties: {
        propScrollView: cc.ScrollView,
        propContent: cc.Node,
        propItem: cc.Prefab,
        propDescItem: cc.Node,
    },

    onLoad() {
        this.VIEW_WIDTH = 0;
        this.VIEW_HEIGHT = 0;
        this.VIEW_ITEMS = 0;
        this.allItems = [];
        this.propItem && this.setItemNode();
        this.propData = [];
        this.isShowPropDesc = false;
        this.getPropData();
        ff.AccountManager.on('EVENT_PROPS_CHANGE', this.refreshProp, this);
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_PROPS_CHANGE', this.refreshProp, this);
    },

    start() {
        this.initView(this.propData);
    },

    setItemNode() {
        this.VIEW_WIDTH = Math.floor(this.propScrollView.node.width / this.propItem.data.width);
        this.VIEW_HEIGHT = Math.floor(this.propScrollView.node.height / this.propItem.data.height);
        this.VIEW_ITEMS = this.VIEW_WIDTH * this.VIEW_HEIGHT;
    },

    getPropData() {
        this.prop = ff.AccountManager.propsConfig.data;
        for (var i = this.prop.length - 1, j = 0; i >= 0; i--) {
            if (this.prop[i].show === 1) {
                this.propData[j] = this.prop[i];
                j++;
            }
        }
    },

    initView(data) {
        if (!this.propItem) return;
        this.propContent.removeAllChildren();
        var num = Math.ceil(data.length / this.VIEW_WIDTH) * this.VIEW_WIDTH;
        num = num >= this.VIEW_ITEMS ? num : this.VIEW_ITEMS;
        if (num > 0) {
            for (var i = 0; i < num; i++) {
                var obj = cc.instantiate(this.propItem);
                obj.parent = this.propContent;
                obj.getScript().initItem(data[i]);
                obj.order = i;
                if (data[i]) obj.on('click', this.changeItemFrameSclected, this);
                this.allItems.push(obj);
            }
        }
    },

    changeItemFrameSclected(event) {
        if(this.isShowPropDesc) return;
        var index = event.target.order;
        this.allItems[index].getScript().setSelectedFrame();
        this.showPropDesc(index);
        this.changeItemFrameUnSclected(index);
    },

    changeItemFrameUnSclected(index) {
        for (var i = 0; i < this.allItems.length; i++) {
            if (i !== index) {
                this.allItems[i].getScript().setUnselectedFrame();
            }
        }
    },

    refreshProp() {
        this.getPropData();
        for (var i = 0; i < this.allItems.length; i++) {
            this.allItems[i].getScript().refreshPropItemAmount(this.propData[i])
        }
    },

    showPropDesc(index) {
        this.isShowPropDesc = true;
        this.propDescItem.active = true;
        var bagPropDescPopItem = this.propDescItem.getChildByName('BagPropDescPopItem');
        var positionY = bagPropDescPopItem.y;
        var moveItem = function () {
            bagPropDescPopItem.runAction(
                cc.moveBy(0.3, cc.p(0, -bagPropDescPopItem.height)).easing(cc.easeBackOut())
            )
        }
        bagPropDescPopItem.getScript().initItem(this.propData[index], positionY, moveItem, this);
    },
});
