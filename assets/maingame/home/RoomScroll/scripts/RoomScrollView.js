const ROUND_RADIUS = 360;
const ROUND_RADIUS_MIN = 10;
const ROUND_TOTAL_ORDER = 4;
const ROUND_RADIAN_SPACE = Math.PI / 2;
const ORDER_FRONT = 0;
const ORDER_RIGHT = 1;
const ORDER_BACK = 2;
const ORDER_LEFT = 3;
const ROOM_NAMES = ['新手渔村', '阳光海滩', '潜龙深渊', '海妖战场'];
const CCGlobal = require('CCGlobal');
cc.Class({
    extends: cc.Component,

    properties: {
        roomItems: [cc.Prefab],
        frontIndex: {
            set(order) {
                if (order < 0) order += this.allItems.length;
                if (order >= this.allItems.length) order -= this.allItems.length;
                this._frontIndex = order;
            },
            get() {
                return this._frontIndex;
            },
            visible: false
        }
    },

    onLoad() {
        var defaultRoomId = ff.AccountManager.roomConfig.defaultRoomId;
        this._frontIndex = ff.AccountManager.roomConfig.getRoomOrderById(defaultRoomId);
        this.hideItem = null;
        this.allItems = [];
        var bindEvent = node => {
            node.on('item-click', this.clickItem, this);
            node.on('item-touch-move', this.onTouchMove, this);
            node.on('item-touch-end', this.onTouchEnd, this);
            node.on('position-changed', this.onItemMoving, this);
        }
        var roomData = ff.AccountManager.roomConfig.data;
        for (var i in roomData) {
            var data = roomData[i];
            var node = cc.instantiate(this.roomItems[ROOM_NAMES.indexOf(data.name)]);
            var item = node.getComponent('RoomScrollItem');
            item.init(data);
            bindEvent(node);
            this.allItems.push(item);
        }
        var length = this.allItems.length;
        if (length <= 3) {
            for (var i = 0; i < length; i++) {
                var node = cc.instantiate(this.allItems[i].node);
                var item = node.getComponent('RoomScrollItem');
                item.init(this.allItems[i].data);
                bindEvent(node);
                this.allItems.push(item);
            }
        }
        this.initRoundItems();
    },

    clickItem(event) {
        var direction = 0;
        var item = event.target.getComponent('RoomScrollItem');
        if (item.roundOrder == ORDER_RIGHT) direction = -1;
        else if (item.roundOrder == ORDER_LEFT) direction = 1;
        if (direction != 0) {
            this.updateRoundHideItem(direction);
            this.fixAllItems(direction);
        } else {
            var enterRoomId = item.data.id;
            var roomConfig = ff.AccountManager.roomConfig;
            cc.log('clickItem  room  '+JSON.stringify(item.data));
            if(!roomConfig.isRoomUnlcoked(enterRoomId)) {
                if (item.data.enterMinMoney > ff.AccountManager.coins) {
                    if (ff.AccountManager.coins < 100){
                        return cc.Popup('NewExchangePop').outsideClose(false).show();
                    }
                    return cc.Toast('您的金币不足' + item.data.enterMinMoney + '，去其他房间看看吧').show();
                }
                // /**未解锁不可进入 */
                // cc.Toast(item.data.enterBatteryLv + '级解锁该房间').show();
                // return;
            }
            
            if (item.data.type == 2) {
                 /***首页-选择房间-自选房间 */
                ff.BuryingPoint(3401080001);
                /***自选房间 */
                cc.Linker('GetSelectRoomConfig').request((data) => {
                    if(data.ws) {
                        CCGlobal.websocketUrl = data.ws;
                        cc.Popup('SelectRoom').show(pop => pop.init(data.room));
                    } else cc.Toast('获取房间入口失败').show();
                });
            } else {
                /**首页-进入房间 */
                // ff.BuryingPoint(3401000004,{
                //     room_level: enterRoomId,
                //     sub_room_id: 0,
                // })
                ff.GameManager.enterGameRoom(enterRoomId);
            }
        }
    },

    forEveryItem(callback) {
        var childs = this.node.children;
        for (var i = childs.length - 1; i >= 0; i--) {
            if (callback(childs[i].getComponent('RoomScrollItem'))) break;
        }
    },

    initOneRoundItem(order, item) {
        if (!item) {return;}
        item.roundOrder = order;
        item.node.parent = this.node;
        item.node.setPosition(this.getOrderPosition(item.roundOrder, 20));
    },

    initRoundItems() {
        this.hideItem = this.allItems[this.getRoundHideIndex(1)];
        this.initOneRoundItem(ORDER_FRONT, this.allItems[this.frontIndex]);
        this.initOneRoundItem(ORDER_RIGHT, this.allItems[this.getNextIndex(this.frontIndex, 1)]);
        this.initOneRoundItem(ORDER_BACK, this.hideItem);
        this.initOneRoundItem(ORDER_LEFT, this.allItems[this.getNextIndex(this.frontIndex, -1)]);
        this.fixAllItems(0);
    },

    getNextIndex(index, offset) {
        index += offset;
        if (index < 0) index += this.allItems.length;
        if (index >= this.allItems.length) index -= this.allItems.length;
        return index;
    },

    getRoundHideIndex(direction) {
        return this.getNextIndex(this.frontIndex, direction < 0 ? 2 : -2);
    },

    getOrderPosition(order, offset) {
        var radian = -Math.PI / 2 + order * ROUND_RADIAN_SPACE;
        radian += Math.PI / 2 - Math.atan2(ROUND_RADIUS, offset);
        var x = Math.cos(radian) * ROUND_RADIUS;
        var y = Math.sin(radian) * ROUND_RADIUS_MIN;
        return cc.p(x, y);
    },

    updateRoundItem(item, offset) {
        item.node.setPosition(this.getOrderPosition(item.roundOrder, offset));
    },

    updateRoundHideItem(offset) {
        var nextHideItem = this.allItems[this.getRoundHideIndex(offset < 0 ? -1 : 1)];
        if (nextHideItem != this.hideItem) {
            this.hideItem.node.parent = null;
            nextHideItem.roundOrder = ORDER_BACK;
            nextHideItem.node.parent = this.node;
            nextHideItem.node.setPosition(this.getOrderPosition(nextHideItem.roundOrder, 0));
            this.hideItem = nextHideItem;
        }
        this.updateRoundItem(this.hideItem, offset);
    },

    fixItemPosition(item) {
        var pos = this.getOrderPosition(item.roundOrder, 0);
        item.node.runAction(cc.sequence(
            cc.moveTo(0.3, pos).easing(cc.easeExponentialOut()),
            cc.callFunc(() => {
                item.onMoveEnd();
                if (item.roundOrder == ORDER_FRONT) cc.Sound.playSound('sHomeRoom' + this._frontIndex);
            })
        ))
    },

    fixAllItems(direction) {
        this.frontIndex -= direction;
        this.forEveryItem(item => {
            item.roundOrder += direction;
            if (item.roundOrder == ORDER_BACK) this.hideItem = item;
            this.fixItemPosition(item);
        })
    },

    onTouchMove(event) {
        var offset = event.detail;
        this.updateRoundItem(this.allItems[this.frontIndex], offset);
        this.updateRoundItem(this.allItems[this.getNextIndex(this.frontIndex, 1)], offset);
        this.updateRoundItem(this.allItems[this.getNextIndex(this.frontIndex, -1)], offset);
        this.updateRoundHideItem(offset);
    },

    onTouchEnd(event) {
        var offset = event.detail;
        var direction = 0;
        if (Math.abs(offset) > ROUND_RADIUS / 2) {
            if (offset < 0) direction = -1;
            else direction = 1;
        }
        this.fixAllItems(direction);
    },

    onItemMoving(event) {
        var item = event.target.getComponent('RoomScrollItem');
        var distance = item.node.y + ROUND_RADIUS_MIN;
        item.onMoving(1 - distance / ROUND_RADIUS_MIN / 2);
    }
});
