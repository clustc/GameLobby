cc.Class({
    extends: cc.Component,

    properties: {
        scroller: cc.ScrollView,
        itemNode: cc.Node,
        itemSpace: 0,
    },

    onLoad() {
        this.PAGE_ITEMS = 30;
        this.ITEM_HEIGHT = 0;
        this.VIEW_ITEMS = 0;
        this.currPage = 1;
        this.allItems = [];
        this.itemData = null;
        this.isDataEnd = false;
        this.isSyncing = true;
        this.lastOffset = 0;
        this.container = this.scroller.content;
        this.itemNode && this.setItemNode(this.itemNode);
    },

    setItemNode(node) {
        this.itemNode = node;
        this.itemNode.parent = null;
        this.ITEM_HEIGHT = this.itemNode.height + this.itemSpace;
        this.VIEW_ITEMS = Math.ceil(this.scroller.node.height / this.itemNode.height) + 1;
    },

    setPageItems(count) {
        this.PAGE_ITEMS = count;
    },

    refreshView() {
        this.currPage = 1;
        this.allItems = [];
        this.itemData = null;
        this.isDataEnd = false;
        this.isSyncing = true;
        this.lastOffset = 0;
        this.scroller.scrollToTop();
        this.initView();
    },

    initView() {
        if (!this.itemNode) return;
        this.loadPage(this.currPage, this.PAGE_ITEMS, data => {
            this.container.removeAllChildren();
            var num = Math.min(data.length, this.VIEW_ITEMS);
            if (num > 0) {
                for (var i = 0; i < num; i++) {
                    var obj = cc.instantiate(this.itemNode);
                    obj.parent = this.container;
                    obj.y = -this.ITEM_HEIGHT / 2 - this.ITEM_HEIGHT * i - this.itemSpace / 2;
                    var item = this.initItem(obj, data[i], i);
                    item.order = i;
                    this.allItems.push(item);
                }
                this.itemData = data;
                this.container.height = this.itemData.length * this.ITEM_HEIGHT + this.itemSpace;
                this.isSyncing = false;
                if (data.length < this.PAGE_ITEMS) this.isDataEnd = true;
            }
        });
    },

    update(dt) {
        if (this.isSyncing) return;

        var offsetY = this.scroller.getScrollOffset().y;
        var isDown = offsetY - this.lastOffset > 0;
        var currPos = Math.floor(offsetY / this.ITEM_HEIGHT);
        this.lastOffset = offsetY;

        if (isDown) {
            if (currPos + this.VIEW_ITEMS > this.itemData.length && !this.isDataEnd) {
                this.syncData();
                return;
            }
            for (var i in this.allItems) {
                var item = this.allItems[i];
                var nextOrder = item.order + this.VIEW_ITEMS;
                if (item.order < currPos && nextOrder < this.itemData.length) {
                    item.order = nextOrder;
                    item.node.y -= this.ITEM_HEIGHT * this.VIEW_ITEMS;
                    this.updateItem(item, this.itemData[nextOrder], nextOrder);
                }
            }
        } else {
            for (var i in this.allItems) {
                var item = this.allItems[i];
                var nextOrder = item.order - this.VIEW_ITEMS;
                if (item.order >= currPos + this.VIEW_ITEMS && nextOrder >= 0) {
                    item.order = nextOrder;
                    item.node.y += this.ITEM_HEIGHT * this.VIEW_ITEMS;
                    this.updateItem(item, this.itemData[nextOrder], nextOrder);
                }
            }
        }
    },

    syncData() {
        this.isSyncing = true;
        this.loadPage(++this.currPage, this.PAGE_ITEMS, data => {
            if (data.length > 0) {
                this.isSyncing = false;
                this.itemData = this.itemData.concat(data);
                this.container.height = this.itemData.length * this.ITEM_HEIGHT + this.itemSpace;
            } else {
                this.isSyncing = false;
                this.isDataEnd = true;
            }
        }, () => this.isSyncing = false);
    },

    loadPage(page, size, okCbk, noCbk) {

    },

    initItem(node, data, order) {

    },

    updateItem(item, data, order) {

    }

});
