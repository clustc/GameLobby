const GuideEvent = require('GuideEvent');
const EVENTS = ['TAP_TO_HIT_FISH', 'UNLOCK_CANNON', 'KILL_AWARD_FISH', 'LUCK_DRAW', 'TOMORROW_GIFT'];

cc.Class({
    extends: cc.Component,

    properties: {
        animTap: cc.Prefab,
        animArrow: cc.Prefab,
        textTips: cc.Prefab,
    },

    onLoad() {
        var close = !ff.AccountManager.switchConfig.findStateByName('playerGuide');
        var final = EVENTS[EVENTS.length - 1];
        if (close) ff.GameManager.setItem('GUIDE_STEP', final);
        if (close || this.getGuideStep() === final) {
            this.node.emit('start-task');
            this.node.parent = null;
            return;
        }

        var thiz = this;
        this.eventQueue = [];

        this.eventQueue.push(new GuideEvent('TAP_TO_HIT_FISH').onPrepare(function () {
            ff.ControlManager.node.on('touch-screen', this.trigger, this);
            this.bindView(thiz.showTap(0, 0));
            this.bindView(thiz.showTips(0, -120, 'txtTapToHit'));
        }).onTrigger(function () {
            ff.ControlManager.node.off('touch-screen', this.trigger, this);
            thiz.onEventFinish(this);
        }).onClean(function () {
            ff.ControlManager.node.off('touch-screen', this.trigger, this);
        }));


        this.eventQueue.push(new GuideEvent('UNLOCK_CANNON').onPrepare(function () {
            /**监听是否可以炮升级 */
            this.onJewelsChange = function () {
                var data = ff.AccountManager.cannonConfig.getNextLockConfig();
                if (ff.AccountManager.jewels >= data.diamond) {
                    ff.AccountManager.off('EVENT_JEWELS_CHANGE', this.onJewelsChange, this);
                    var node = ff.ControlManager.node.find('MenuLayer/UnlockPanel');
                    this.bindView(thiz.showTap(node.x + 200, node.y));
                    this.bindView(thiz.showArrow(node.x + 350, node.y, 180));
                    this.bindView(thiz.showTips(node.x + 560, node.y, 'txtJewelToUnlock'));
                }
            }
            ff.AccountManager.on('EVENT_JEWELS_CHANGE', this.onJewelsChange, this);
            ff.AccountManager.once('EVENT_CANNON_UPGRADE', this.trigger, this);
        }, 3).onTrigger(function () {
            thiz.showTips(0, -200, 'txtHigherLevelMoreCoin', 5);
            thiz.onEventFinish(this);
        }).onClean(function () {
            ff.AccountManager.off('EVENT_JEWELS_CHANGE', this.onJewelsChange, this);
            ff.AccountManager.off('EVENT_CANNON_UPGRADE', this.trigger, this);
        }));


        this.eventQueue.push(new GuideEvent('KILL_AWARD_FISH').onPrepare(function () {
            /**如果有锁定道具 */
            this.onPropsChange = function () {
                var prop = ff.AccountManager.propsConfig.getPropByName('locate');
                if (prop.propNum > 0) {
                    thiz.guideFish = thiz.createGuideFish();
                    ff.AccountManager.off('EVENT_PROPS_CHANGE', this.onPropsChange, this);
                    thiz.scheduleOnce(() => this.trigger(), 9.5);
                    return false;
                }
                return true;
            }
            if (this.onPropsChange()) ff.AccountManager.on('EVENT_PROPS_CHANGE', this.onPropsChange, this);
        }).onTrigger(function () {
            thiz.guideFish.stopped = true;
            thiz.guideFish.createShadow();
            thiz.onEventFinish(this);
        }).onClean(function () {
            ff.AccountManager.off('EVENT_PROPS_CHANGE', this.onPropsChange, this);
        }));


        this.eventQueue.push(new GuideEvent('KILL_AWARD_FISH').onPrepare(function () {
            this.bindView(thiz.showArrow(-150, -220, 90));
            this.bindView(thiz.showTips(-160, -120, 'txtUseLocateToHit'));
            var prop = ff.AccountManager.propsConfig.getPropByName('locate');
            this.locate = ff.ControlManager.battery.propButtons.getButtonById(prop.id);
            this.locate.node.once('button-click', this.trigger, this);
        }).onTrigger(function () {
            thiz.onEventFinish(this);
        }).onIgnored(function () {
            this.locate.node.off('button-click', this.trigger, this);
            delete this.locate;
            thiz.guideFish.stopped = false;
            thiz.guideFish.removeShadow();
            thiz.guideFish = null;
            thiz.onEventFinish(this);
        }, 8).onClean(function () {
            this.locate.node.off('button-click', this.trigger, this);
        }));


        this.eventQueue.push(new GuideEvent('KILL_AWARD_FISH').onPrepare(function () {
            var fish = thiz.guideFish;
            if (!fish) return thiz.onEventFinish(this);
            var battery = ff.ControlManager.battery;
            this.cannonLevel = battery.level;
            this.bindView(thiz.showTap(fish.node.x, fish.node.y));
            this.onTouchStart = function (event) {
                if (fish.checkHit(thiz.node.convertToNodeSpaceAR(event.getLocation()))) {
                    battery.locate.setLocateFish(fish);
                    thiz.scheduleOnce(() => this.trigger(), 1);
                }
            }
            thiz.node.on('touchstart', this.onTouchStart, this);
            this.onHitError = function () {
                thiz.guideFish.stopped = false;
                thiz.guideFish.removeShadow();
                delete thiz.guideFish;
                thiz.node.off('touchstart', this.onTouchStart, this);
                thiz.onEventFinish(this);
            }
        }).onTrigger(function () {
            cc.Linker('HitGuideFish', { score: this.cannonLevel }).request(() => {
                /**游戏-新手引导打鱼 */
                ff.BuryingPoint(3402000021, {
                    betting_amount: this.cannonLevel
                });
                ff.AwardManager.onBulletHitFish({
                    level: this.cannonLevel,
                    gainCoins: this.cannonLevel * 100,
                    isCaught: 1,
                    props: [],
                    fish: thiz.guideFish,
                    battery: ff.ControlManager.battery,
                });
                thiz.guideFish.removeShadow();
                thiz.guideFish.node.setLocalZOrder(thiz.guideFish.value * 10000);
                thiz.node.off('touchstart', this.onTouchStart, this);
                thiz.onEventFinish(this);
            }, () => this.onHitError());
        }).onIgnored(function () {
            this.onHitError();
        }, parseInt(ff.AccountManager.propsConfig.getPropByName('locate').effectValue)));


        this.eventQueue.push(new GuideEvent('LUCK_DRAW').onPrepare(function () {
            var node = ff.ControlManager.node.find('MenuLayer/FreeDrawPanel');
            var panel = node.getComponent('FreeDrawPanel');
            this.onPanelClick = function (event) {
                panel.showTimer = 0;
                panel.statePanel.off('click', this.onPanelClick, this);
                this.trigger();
            }
            var cbk = () => {
                panel.showPanel();
                panel.showTimer = 1000;
                this.bindView(thiz.showTap(node.x + 200, node.y));
                this.bindView(thiz.showArrow(node.x + 350, node.y, 180));
                this.bindView(thiz.showTips(node.x + 640, node.y, 'txtAwardFishToDraw', 8));
                panel.statePanel.on('click', this.onPanelClick, this);
            }
            this.panel = panel;
            thiz.scheduleOnce(() => panel.getUserData(cbk), 5);
        }).onTrigger(function () {
            thiz.onEventFinish(this);
        }).onClean(function () {
            this.panel.statePanel.off('click', this.onPanelClick, this);
        }));


        this.eventQueue.push(new GuideEvent('TOMORROW_GIFT').onPrepare(function () {
            var node = ff.ControlManager.node.find('MenuLayer/TomorrowGift');
            this.onDrawEnable = function (event) {
                this.bindView(thiz.showTap(node.x, node.y));
                this.bindView(thiz.showArrow(node.x + 150, node.y, 180));
                this.bindView(thiz.showTips(node.x + 360, node.y, 'txtTapDrawIphone', 8));
                this.trigger();
            }
            node.once('change_Flag', this.onDrawEnable, this);
            this.panel = node;
        }).onTrigger(function () {
            thiz.onEventFinish(this);
        }).onClean(function () {
            this.panel.off('change_Flag', this.onDrawEnable, this);
        }));

        ff.WSLinkManager.on('EnterRoomMsg', this.startGuide, this);
    },

    onDisable() {
        if (this.eventQueue) while (this.eventQueue.length > 0) this.eventQueue.pop().reset();
    },

    startGuide(e) {
        ff.WSLinkManager.off('EnterRoomMsg', this.startGuide, this);
        if (e.detail.code !== 0) return;
        var eventType = this.getGuideStep();
        if (EVENTS.indexOf(eventType) >= EVENTS.indexOf('LUCK_DRAW')) this.node.emit('start-task');
        for (var i in this.eventQueue) {
            var event = this.eventQueue[i];
            if (event.eventType === eventType) return event.prepare();
        }
    },

    /**已经引导过 */
    setGuided(event) {
        /**引导过击杀奖金鱼后开始任务 */
        var currIndex = EVENTS.indexOf(event.eventType);
        if (currIndex >= EVENTS.indexOf('LUCK_DRAW')) this.node.emit('start-task');

        var nextType = EVENTS[currIndex + 1];
        if (nextType) ff.GameManager.setItem('GUIDE_STEP', nextType);
        else ff.GameManager.setItem('GUIDE_STEP', event.eventType);
    },

    /**从未引导的开始 */
    getGuideStep() {
        return ff.GameManager.getItem('GUIDE_STEP') || EVENTS[0];
    },

    onEventFinish(event) {
        this.setGuided(event);
        event.reset();
        event = this.eventQueue[this.eventQueue.indexOf(event) + 1];
        if (event) event.prepare();
        else this.node.parent = null;
    },

    showTap(x, y) {
        var node = cc.instantiate(this.animTap);
        node.x = x;
        node.y = y;
        node.parent = this.node;
        return node;
    },

    showArrow(x, y, degree) {
        var node = cc.instantiate(this.animArrow);
        node.x = x;
        node.y = y;
        node.rotation = degree - 90;
        node.parent = this.node;
        return node;
    },

    showTips(x, y, text, autoHideT) {
        var node = cc.instantiate(this.textTips);
        node.parent = this.node;
        node.getComponent('GuideTextTips').showTips(text, x, y);
        if (autoHideT && autoHideT > 0) this.scheduleOnce(() => node.parent = null, autoHideT);
        return node;
    },

    createGuideFish() {
        var fish = ff.FishManager.fishLayer.produce('fish_jinshayu');
        fish.data = null;
        fish.node.setLocalZOrder(10000 * 10000);
        fish.path = { "velocity": 100, "pointxs": [-937, 5, 937], "pointys": [271, -161, 275], "lengths": [1938] };
        fish.createShadow = () => {
            var shadow = cc.Popup.createShadow();
            shadow.name = 'shadow';
            shadow.parent = fish.node;
            shadow.removeComponent(cc.Widget);
            shadow.setLocalZOrder(-1);
            shadow.width = shadow.height = 100000;
        };
        fish.removeShadow = () => {
            fish.node.getChildByName('shadow').parent = null;
        };
        fish.ready();
        return fish;
    },
});
