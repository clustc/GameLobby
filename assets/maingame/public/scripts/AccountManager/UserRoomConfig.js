const ROOM_CANNON_LEVEL = [[
        { "minCoins": "0", "maxCoins": "5000", "cannonLevel": "100" },
        { "minCoins": "5000", "maxCoins": "10000", "cannonLevel": "200" },
        { "minCoins": "10000", "maxCoins": "20000", "cannonLevel": "500" },
        { "minCoins": "20000", "maxCoins": "100000", "cannonLevel": "1000" },
        { "minCoins": "100000", "maxCoins": "200000", "cannonLevel": "2000" },
        { "minCoins": "200000", "maxCoins": "300000", "cannonLevel": "3000" },
        { "minCoins": "300000", "maxCoins": "0", "cannonLevel": "5000" }
    ], [
        { "minCoins": "300000", "maxCoins": "500000", "cannonLevel": "5000" },
        { "minCoins": "500000", "maxCoins": "550000", "cannonLevel": "5500" },
        { "minCoins": "550000", "maxCoins": "600000", "cannonLevel": "6000" },
        { "minCoins": "600000", "maxCoins": "650000", "cannonLevel": "6500" },
        { "minCoins": "650000", "maxCoins": "700000", "cannonLevel": "7000" },
        { "minCoins": "700000", "maxCoins": "750000", "cannonLevel": "7500" },
        { "minCoins": "750000", "maxCoins": "800000", "cannonLevel": "8000" },
        { "minCoins": "800000", "maxCoins": "850000", "cannonLevel": "8500" },
        { "minCoins": "850000", "maxCoins": "900000", "cannonLevel": "9000" },
        { "minCoins": "900000", "maxCoins": "950000", "cannonLevel": "9500" },
        { "minCoins": "950000", "maxCoins": "0", "cannonLevel": "10000" }
    ], [
        { "minCoins": "950000", "maxCoins": "1000000", "cannonLevel": "10000" },
        { "minCoins": "1000000", "maxCoins": "1500000", "cannonLevel": "15000" },
        { "minCoins": "1500000", "maxCoins": "2000000", "cannonLevel": "20000" },
        { "minCoins": "2000000", "maxCoins": "2500000", "cannonLevel": "25000" },
        { "minCoins": "2500000", "maxCoins": "3000000", "cannonLevel": "30000" },
        { "minCoins": "3000000", "maxCoins": "3500000", "cannonLevel": "35000" },
        { "minCoins": "3500000", "maxCoins": "4000000", "cannonLevel": "40000" },
        { "minCoins": "4000000", "maxCoins": "4500000", "cannonLevel": "45000" },
        { "minCoins": "4500000", "maxCoins": "0", "cannonLevel": "50000" }
    ], [
        { "minCoins": "4500000", "maxCoins": "5000000", "cannonLevel": "50000" },
        { "minCoins": "5000000", "maxCoins": "5500000", "cannonLevel": "55000" },
        { "minCoins": "5500000", "maxCoins": "6000000", "cannonLevel": "60000" },
        { "minCoins": "6000000", "maxCoins": "6500000", "cannonLevel": "65000" },
        { "minCoins": "6500000", "maxCoins": "7000000", "cannonLevel": "70000" },
        { "minCoins": "7000000", "maxCoins": "7500000", "cannonLevel": "75000" },
        { "minCoins": "7500000", "maxCoins": "8000000", "cannonLevel": "80000" },
        { "minCoins": "8000000", "maxCoins": "8500000", "cannonLevel": "85000" },
        { "minCoins": "8500000", "maxCoins": "9000000", "cannonLevel": "90000" },
        { "minCoins": "9000000", "maxCoins": "9500000", "cannonLevel": "95000" },
        { "minCoins": "9500000", "maxCoins": "0", "cannonLevel": "100000" }
    ]
]
const ROOM_DEFAULT_CANNON_LEVEL = [
    { "minCoins": "100", "maxCoins": "5000", "cannonLevel": "100" },
    { "minCoins": "5000", "maxCoins": "10000", "cannonLevel": "200" },
    { "minCoins": "10000", "maxCoins": "20000", "cannonLevel": "500" },
    { "minCoins": "20000", "maxCoins": "100000", "cannonLevel": "1000" },
    { "minCoins": "100000", "maxCoins": "200000", "cannonLevel": "2000" },
    { "minCoins": "200000", "maxCoins": "500000", "cannonLevel": "5000" },
    { "minCoins": "500000", "maxCoins": "800000", "cannonLevel": "8000" },
    { "minCoins": "800000", "maxCoins": "1200000", "cannonLevel": "10000" },
    { "minCoins": "1200000", "maxCoins": "5000000", "cannonLevel": "20000" },
    { "minCoins": "5000000", "maxCoins": "0", "cannonLevel": "50000" }
];
cc.Class({
    properties: {
        data: {
            get() { return this._data; },
            set(d) {
                d.sort((a, b) => { return a.id - b.id; });
                cc.log('roomconfig     '+JSON.stringify(d));
                this._data = d;
                // this.enterRoomId = this.getDefaultRoomId();
            }
        },

        defaultRoomId: {
            get() { return this.getDefaultRoomId(); }
        }
    },

    ctor() {
        /**大厅房间/自选房间/默认房间 */
        this.enterRoomId = this.selectRoomId = 0;
    },

    /**玩家默认房间 */
    getDefaultRoomId() {
        var coins = ff.AccountManager.coins;
        if (coins <= 300000){
            this.enterRoomId = this._data[0].id;
            return this._data[0].id;
        } 
        if(coins <= 1000000){
            this.enterRoomId = this._data[1].id;
            return this._data[1].id;
        }
        else if(coins <= 4500000){
            this.enterRoomId = this._data[2].id;
            return this._data[2].id;
        }
        else {
            this.enterRoomId = this._data[3].id;
            return this._data[3].id;
        }
        // if (ff.AccountManager.isCannonLevelFull) {
        //     if(coins <= 100000) return this._data[1].id;
        //     else if(coins <= 1000000) return this._data[2].id;
        //     else return this._data[3].id;
        // } else {
        //     var cannonLevel = ff.AccountManager.cannonLevel;
        //     cc.log('getDefaultRoomId   '+cannonLevel);
        //     var room = this._data[1];
        //     cc.log('getDefaultRoomId sdsadasdas  '+room.enterBatteryLv);
        //     if(cannonLevel < room.enterBatteryLv) return this._data[0].id;
        //     room = this._data[this.data.length - 2];
        //     if(cannonLevel >= room.enterBatteryLv) {
        //         if(coins < 10000) return this._data[1].id;
        //         else if(coins < 50000) return this._data[2].id;
        //         else return this._data[3].id;
        //     }
        //     for(var i = 1; i < this._data.length - 2; i++) {
        //         if(cannonLevel >= this._data[i].enterBatteryLv && cannonLevel < this._data[i + 1].enterBatteryLv) {
        //             if(i === 2 && coins >= 10000) return this._data[2].id;
        //             return this._data[1].id;
        //         }
        //     }
        //     cc.error('No Default Room Id');
        //     return this._data[0].id;
        // }
    },

    /**房间默认跑等级 */
    getRoomCannonLevel() {
        var coinsCount = ff.AccountManager.coins;
        var roomOrder = this.getRoomOrderById(this.enterRoomId);
        cc.log('getRoomCannonLevel    '+roomOrder);
        
        // if(roomOrder === 0) return this._data[0].enterMaxBatteryLv;
        var roomLevels = ROOM_CANNON_LEVEL[roomOrder];
        cc.log('getRoomCannonLevel11111    '+JSON.stringify(roomLevels));
        cc.log('current count   '+coinsCount);
        for(var i in roomLevels){
            var minCoins = parseInt(roomLevels[i].minCoins);
            var maxCoins = parseInt(roomLevels[i].maxCoins) || Number.MAX_VALUE;
            if(coinsCount >= minCoins && coinsCount < maxCoins) return parseInt(roomLevels[i].cannonLevel);
        }
        // for (var i = 0; i < ROOM_DEFAULT_CANNON_LEVEL.length;i++){
        //     var minCoins = parseInt(ROOM_DEFAULT_CANNON_LEVEL[i].minCoins);
        //     var maxCoins = parseInt(ROOM_DEFAULT_CANNON_LEVEL[i].maxCoins) || Number.MAX_VALUE;
        //     if(coinsCount >= minCoins && coinsCount < maxCoins) return parseInt(ROOM_DEFAULT_CANNON_LEVEL[i].cannonLevel);
        // }
        /**如果满级，根据金币返回跑等级 */
        // if(ff.AccountManager.isCannonLevelFull) {
        //     var roomOrder = this.getRoomOrderById(this.enterRoomId);
        //     if(roomOrder === 0) return this._data[0].enterMaxBatteryLv;
        //     var roomLevels = ROOM_CANNON_LEVEL[roomOrder - 1];
        //     var coinsCount = ff.AccountManager.coins;
        //     for(var i in roomLevels) {
        //         var minCoins = parseInt(roomLevels[i].minCoins);
        //         var maxCoins = parseInt(roomLevels[i].maxCoins) || Number.MAX_VALUE;
        //         if(coinsCount >= minCoins && coinsCount < maxCoins) return parseInt(roomLevels[i].cannonLevel);
        //     }
        // } else {
        //     /**返回炮等级或房间最高等级 */
        //     return Math.min(this.getRoomConfigById(this.enterRoomId).enterMaxBatteryLv, ff.AccountManager.cannonLevel);
        // }
    },
    //获取房间道具使用的队列
    getRoomCanUseProplist:function(){
        
        var room = this.getRoomConfigById(this.enterRoomId);
        var userPop = room.useProp.split('#');
        var result = [];
        for (var i = 0; i<userPop.length;i++){
            if (userPop[i].indexOf(',') == -1){
                result.push(parseInt(userPop[i]));
            }else{
                result.push(parseInt(userPop[i].split(',')[0]));
            }
        }
        return result;
    },
    isRoomUnlcoked(roomId) {
        var room = this.getRoomConfigById(roomId);
        return ff.AccountManager.coins >= parseInt(room.enterMinMoney);
       
    },
    
    /**获取选择房间配置 */
    getEnterRoomConfig() {
        return this.getRoomConfigById(this.enterRoomId);
    },
    //获取当前房间最小跑的金币
    getCurrentRoomMinGold:function(){
        return this.getEnterRoomMinPaoLevel();
    },
    /** 获取房间最大的跑等级 */
    getEnterRoomMaxPaoLevel:function(){
        var roomOrder = this.getRoomOrderById(this.enterRoomId);
        var roomLevels = ROOM_CANNON_LEVEL[roomOrder];
        return parseInt(roomLevels[roomLevels.length-1].cannonLevel);
    },
    /** 获取房间最小的跑等级 */
    getEnterRoomMinPaoLevel:function(){
        var roomOrder = this.getRoomOrderById(this.enterRoomId);
        var roomLevels = ROOM_CANNON_LEVEL[roomOrder];
        cc.log('getEnterRoomMinPaoLevel     '+JSON.stringify(roomLevels));
        return parseInt(roomLevels[0].cannonLevel);
    },
    /**获取房间配置 */
    getRoomConfigById(id) {
        for (var i in this._data) if (this._data[i].id == id) return this._data[i];
    },

    /**获取房间索引 */
    getRoomOrderById(id) {
        for (var i in this._data) if (this._data[i].id == id) return parseInt(i);
    }
})