cc.Class({
    extends: cc.Component,

    properties: {
        UnlockItemPrefab: cc.Prefab,
        LockItemPrefab: cc.Prefab,

        CannonUnlockContent: cc.Node,

        UnlockArray: [],
        LockArray: [],

        showItemAmount: 0,
        itemSpace: 0,
    },

    onLoad() {
        this.isUnLockIng = false;
        this.MoveFlag = false;
        this.SPACE = this.CannonUnlockContent.width / this.showItemAmount + this.itemSpace;
        this.MID = Math.floor(this.showItemAmount / 2);
        //获取玩家的投注总流水
        cc.Linker('TotalBetAmount').request(data => {
            cc.log('TotalBetAmount   '+JSON.stringify(data));
            this.betAmount = data;
            this.createItemToContent(this.CannonData);
        });
        this.initAll();
        ff.AccountManager.on('EVENT_CANNON_UPGRADE', this.onCannonUpgrade, this);
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_CANNON_UPGRADE', this.onCannonUpgrade, this);
    },

    initAll() {
        //初始化所有状态
        this.CannonUnlockContent.removeAllChildren;
        this.initUnlockItemPool();
        this.initLockItemPool();
        this.CannonData = ff.AccountManager.cannonConfig.data;
    },

    initUnlockItemPool() {
        this.unlockItemPool = new cc.NodePool();
        let item = cc.instantiate(this.UnlockItemPrefab); // 创建节点
        this.unlockItemPool.put(item); // 通过 putInPool 接口放入对象池
    },

    initLockItemPool() {
        this.lockItemPool = new cc.NodePool();
        let item = cc.instantiate(this.LockItemPrefab); // 创建节点
        this.lockItemPool.put(item); // 通过 putInPool 接口放入对象池
    },

    getItemFromPool(pool, prefab) {
        let p = null;
        if (pool.size() > 0) {
            p = pool.get();
        } else {
            p = cc.instantiate(prefab);
        }
        return p;
    },

    createItemToContent(data) {
        //根据状态创建相对应的节点
        for (var i = 0; i < data.length; i++) {

            if (data[i].betAmount < this.betAmount) {
                this.initUnlockItem(data[i], i);
            }
            else {
                this.initLockItem(data[i], i);
            }
        }
    },

    initUnlockItem(data, index) {
        var item = this.getItemFromPool(this.unlockItemPool, this.UnlockItemPrefab)
        item.getScript().init(data);

        item.parent = this.CannonUnlockContent;
        item.x = (index - this.MID) * this.SPACE;
        item.lockFlag = false;
        item.order = index;
        this.UnlockArray.push(item);
    },

    initLockItem(data, index) {
        var item = this.getItemFromPool(this.lockItemPool, this.LockItemPrefab)
        item.getScript().init(data);

        item.parent = this.CannonUnlockContent;
        item.x = (index - this.MID) * this.SPACE;
        item.lockFlag = true;
        item.order = index;
        this.LockArray.push(item);

        this.setLockItemScale();
    },

    onCannonUpgrade() {
        var data = ff.AccountManager.cannonConfig.data;
        if (this.MoveFlag) return;
        this.MoveFlag = true;

        //点击之后未解锁节点消失，已解锁界面显示
        this.destroyNode(this.clickNode);
        this.initUnlockItem(this.CannonData[this.clickNode.order], this.clickNode.order);

        //判断是否在最前面，不然就进行移动
        if (data[data.length - 1].grade !== this.CannonData[this.CannonData.length - 1].grade && this.LockArray.length <= 2) {
            this.CannonData[this.CannonData.length] = data[data.length - 1];
            this.initLockItem(data[data.length - 1], this.LockArray[this.LockArray.length - 1].order + 1);
            this.moveAllItem();
        }else {
            this.MoveFlag = false;
            this.setLockItemScale();
        }
    },

    setLockItemScale() {
        //设置解锁节点的大小和点击状态
        for (var i = 0; i < this.LockArray.length; i++) {
            var button = this.LockArray[i].getChildByName('CannonItemUnlockButton');
            if (i == 0) {
                this.LockArray[i].getScript().hideQuestionMark();
                this.LockArray[i].scale = 1;
                if (!this.MoveFlag) button.getComponent(cc.Button).interactable = true;
                button.on('click', this.onUnlockCannon, this);
            }
            else {
                this.LockArray[i].getScript().showQuestionMark();
                this.LockArray[i].scale = 0.85;
                button.getComponent(cc.Button).interactable = false;
            }
        }
        this.isUnLockIng = false;
    },

    onUnlockCannon(event) {
        if(this.isUnLockIng) return;
        this.isUnLockIng = true;
        this.clickNode = event.target.parent;
        var needJewels = this.clickNode.getScript().data.diamond;
        if(ff.AccountManager.jewels < needJewels) {
            this.node.emit('close');
            ff.PopupManager.showShopPop();
        }else{
            ff.AccountManager.cannonConfig.upgradeCannonLevel();
        }
    },

    moveAllItem() {
        //移动所有节点
        var allItems = this.CannonUnlockContent.children;
        for (var i = 0; i < allItems.length; i++) {
            var finished = cc.callFunc((item) => {
                if (item.order == this.LockArray[this.LockArray.length - 1].order) {
                    this.MoveFlag = false;
                    this.setLockItemScale();
                }
                item.order--;
            }, this, allItems[i]);

            allItems[i].runAction(cc.sequence(
                cc.moveBy(1, cc.p(-this.SPACE, 0)),
                finished,
            ))
        }
        this.CannonData.splice(0, 1);
    },



    update(dt) {
        var allItems = this.CannonUnlockContent.children;
        for (var i = 0; i < allItems.length; i++) {
            if (allItems[i].x <= (-(this.MID + 1) * this.SPACE + 1)) {
                this.destroyNode(allItems[i]);
            }
        }
    },

    destroyNode(target) {
        if (target.lockFlag) {
            this.LockArray.splice(0, 1);
            target.getChildByName('CannonItemUnlockButton').off('click', this.onUnlockCannon, this);
            this.lockItemPool.put(target);
        }
        else {
            this.UnlockArray.splice(0, 1);
            this.unlockItemPool.put(target);
        }
    },

    onclose() {
        this.node.emit('close');
    },
});
