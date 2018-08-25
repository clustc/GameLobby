const CONNON_LEVEL_VALUE = [100, 200, 300, 500, 1000, 2000, 3000, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 80000, 85000, 90000, 95000, 100000];

cc.Class({
    properties: {
        data: {
            get() { return this._data; },
            set(d) {
                d.sort((a, b) => { return a.betAmount - b.betAmount; });
                this._data = d;
            }
        },
        skinId: 0,
    },

    getCannonSkin(level) {
        return {
            name: ff.ConstAssets.skinImages['gun_name'],
            skin: ff.ConstAssets.skinImages['gun' + this.getCannonCount(level)]
        }
    },
 
    refreshData(cbk) {
        cc.Linker('SkinCannon').request(data => {
            cc.log('SkinCannon   '+JSON.stringify(data));
            this.data = data;
            cbk && cbk();
        });
    },

    upgradeCannonLevel() {
        cc.Linker('CannonUpgradeLevel').request(() => {
            var lastConfig = this.getNextLockConfig();
            this.refreshData(() => ff.AccountManager.emit('EVENT_CANNON_UPGRADE', lastConfig))
        });
    },

    /**获取炮管数量 */
    getCannonCount(level) {
        if (level <= 25) return 1;
        else if (level <= 250) return 2;
        else return 3;
    },

    /**左右切换时获取等级 */
    getNextLevel(level, step) {
        // var cannonLevel = ff.AccountManager.cannonLevel;
        var maxFireBattery = ff.AccountManager.roomConfig.getEnterRoomMaxPaoLevel();
        var minFireBattery = ff.AccountManager.roomConfig.getEnterRoomMinPaoLevel();
        var levelIndex = CONNON_LEVEL_VALUE.indexOf(level);
        /**升等级 */
        if(step > 0) {
            /**未解锁等级/当前房间最高等级 */
            // if(level > cannonLevel || level == roomConfig.enterMaxBatteryLv) {
            //     return roomConfig.enterBatteryLv;
            // }
            if (level == maxFireBattery){
                levelIndex = CONNON_LEVEL_VALUE.indexOf(minFireBattery);
                return minFireBattery;
            }
            return CONNON_LEVEL_VALUE[++levelIndex];
        /**降等级 */
        } else if (step < 0){
            /**小于最小等级 */
            // if(level <= roomConfig.enterBatteryLv) {
            //     if(ff.AccountManager.isCannonLevelFull) return roomConfig.enterMaxBatteryLv;
            //     if(cannonLevel >= roomConfig.enterMaxBatteryLv) return roomConfig.enterMaxBatteryLv;
            //     return this.getNextLevel(cannonLevel, 1);
            // }
            if (level == minFireBattery){
                levelIndex = CONNON_LEVEL_VALUE.indexOf(maxFireBattery);
                return maxFireBattery;
            }
            return CONNON_LEVEL_VALUE[--levelIndex];
        }else{
            return CONNON_LEVEL_VALUE[levelIndex];
        }
    },

    /**炮等级是否解锁 */
    isLevelUnlock(level) {
        return level <= ff.AccountManager.cannonLevel;
    },

    /**获取下个解锁配置 */
    getNextLockConfig() {
        for (var i in this._data) {
            if (!this._data[i].lock) return this._data[i];
        }
        return null;
    }
})
