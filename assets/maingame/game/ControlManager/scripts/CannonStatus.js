cc.Class({
    extends: cc.Component,

    properties: {
        cannonMenu: cc.Prefab,
        propButtons: cc.Prefab,

        animPlace: cc.Node,
        animFlash: cc.Prefab,
        animLocked: cc.Prefab,
        animUnlocked: cc.Prefab,
        
        brokenTimer: cc.Prefab,
        maxLevelTip: cc.Prefab,
    },

    onLoad() { 
        ff.AccountManager.on('EVENT_CANNON_UPGRADE', this.onCannonUpgrade, this);
    },

    onDestroy() {
        ff.AccountManager.off('EVENT_CANNON_UPGRADE', this.onCannonUpgrade, this);
    },

    init(battery) {
        this.battery = battery;
        var position = cc.pSub(battery.getAwardAnimPosition(), battery.assets.showPosition);
        this.maxLevelTip = this.addAnim(this.maxLevelTip, position, 'MaxLevelTip');
        this.animFlash = this.addAnim(this.animFlash, battery.cannon.node.parent.position);
        // this.animLocked = this.addAnim(this.animLocked, position);
        this.animUnlocked = this.addAnim(this.animUnlocked, position);
        this.animUnlocked.node.scale = 0.66;
        this.scheduleOnce(this.playPlace, 0.8);
        return this;
    },

    addAnim(prefab, position, component) {
        component = component || cc.Animation;
        var node = cc.instantiate(prefab);
        node.parent = this.battery.node;
        node.position = position;
        node.x = 100000;
        var script = node.getComponent(component);
        if(component == cc.Animation) script.on('finished', () => node.x = 100000);
        return script;
    },

    playPlace() {
        this.playMaxLevelTip();
        this.animPlace.position = this.battery.getAwardAnimPosition();
        var actionUp = cc.moveTo(0.4, this.animPlace.x, this.animPlace.y + 50).easing(cc.easeSineOut());
        var actionDown = cc.moveTo(0.4, this.animPlace.x, this.animPlace.y).easing(cc.easeSineIn());
        this.animPlace.runAction(cc.sequence(
            actionUp, actionDown, actionUp.clone(), actionDown.clone(),
            actionUp.clone(), actionDown.clone(), actionUp.clone(), actionDown.clone(),
            cc.callFunc(() => this.animPlace.parent = null)
        ))
    },

    playLocked(show) {
        if(show) {
            this.animLocked.play();
            this.animLocked.node.x = 0;
        } else {
            this.animLocked.node.x = 10000;
        }
    },

    playUnlocked(data) {
        this.animFlash.play();
        this.animFlash.node.x = 0;
        this.animUnlocked.play();
        this.animUnlocked.node.x = 0;
        this.animUnlocked.node.find('paotai_0001_jiesuo_wenzi/label', cc.Label).string = data.coin;
    },
    
    playBrokenTimer() {
        // cc.Linker('CanReliveCoins').request(data => {
        //     if(data.canRevive > 0) {
        //         var battery = this.battery;
        //         var brokenTimer = this.addAnim(this.brokenTimer, this.maxLevelTip.node.position, 'BrokenTimer');
        //         brokenTimer.node.x = 0;
        //         brokenTimer.node.scale = 0.8;
        //         brokenTimer.node.setLocalZOrder(1000);
        //         brokenTimer.setTotalTime(5);
        //         ff.BuryingPoint(3402000010, {
        //             /********领取次数有误********/
        //             resurrection_fund_total: data.alreadyRevive,
        //             residual_volume: data.canRevive,
        //         });
        //         brokenTimer.node.on('click', () => {
        //             brokenTimer.node.parent = null;
        //             cc.Linker('GetReliveCoins').request(coins => {
        //                 var finishPos = battery.getCannonPosition();
        //                 var startPos = battery.getAwardAnimPosition();
        //                 var add = coins - ff.AccountManager.coins;
        //                 ff.AccountManager.coins = coins;
        //                 ff.AwardManager.awardCoins.flyRangeCoins(startPos, finishPos, 20, 50);
        //                 cc.Toast('成功领取' + add + '金币').setPosition(startPos.add(cc.p(0, 100))).show();
        //                 ff.BuryingPoint(3402000018, { betting_amount: add });
        //             })
        //         });
        //     }
        // })
    },

    playMaxLevelTip() {
        var data = ff.AccountManager.roomConfig.data;
        var roomId = ff.AccountManager.roomConfig.enterRoomId;
        var room = null, roomNext = null;
        for(var i in data) {
            if(roomId == data[i].id) {
                room = data[i];
                roomNext = data[1 + parseInt(i)];
                break;
            }
        }
        if(ff.AccountManager.cannonLevel > room.enterMaxBatteryLv) {
            this.maxLevelTip.init(room.enterMaxBatteryLv, room.name, roomNext.name);
            this.maxLevelTip.node.x = 0;
            return true;
        }
        return false;
    },

    onCannonUpgrade(event) {
        cc.Sound.playSound('sCannonUnlock');
        this.playUnlocked(event.detail);
        /**如果大于当前房间最高跑等级，则进行提示 */
        if(!this.playMaxLevelTip()) ff.WSLinkManager.send('CannonLevelMsg', { level: ff.AccountManager.cannonLevel });
    },
});
