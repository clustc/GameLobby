const Global = require('CCGlobal');
const appInfo = Global.appInfo;
ff.BuryingPoint = (id, data) => {
    data = data || {};
    data.user_id = null;
    data.event_id = id;
    data.ip = appInfo.ip;
    data.os = appInfo.os;
    data.city = appInfo.city;
    data.model = appInfo.model;
    data.country = appInfo.country;
    data.province = appInfo.province;
    data.project_id = appInfo.gameId;
    data.device_no = appInfo.deviceId;
    data.channel_id = appInfo.appChannel;
    data.manufacturer = appInfo.manufacturer;
    data.generate_date = new Date().format('yyyy-MM-dd');
    data.generate_time = new Date().format('hh:mm:ss');
    if(ff.AccountManager) {
        data.user_id = ff.AccountManager.userId;
        if (ff.AccountManager.isUserLogin) {
            data.cannon_level = ff.AccountManager.cannonLevel;
            data.vip_level = ff.AccountManager.vipLevel;
            data.residual_gold = ff.AccountManager.coins - (data.betting_amount || 0);
            data.diamond_balance = ff.AccountManager.jewels;
        }
        if (cc.director.currentScene === 'GameScene') {
            data.room_level = ff.AccountManager.roomConfig.enterRoomId;
            data.sub_room_id = ff.AccountManager.roomConfig.selectRoomId;
        }
    }
    // cc.BaseLinker(Global.HTTPURL.statisticsUrl, data).request();
}

