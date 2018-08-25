require('extention');
require('CCProxy');
cc.Toast = {};
cc.Popup = {};
cc.Linker = {};
cc.Waiting = {};
window.ff = {};

var HTTPURL = {
    dataUrl: 'http://data-api.beeplay123.com', 
    // gameUrl: 'https://fishapp-api.beeplay123.com',
    // platformUrl: 'https://sdk-api.beeplay123.com',
    // gameUrl: 'http://game-api.yingdd888.com',
    // gameUrl: 'http://172.16.201.51:8080',
    gameUrl:'http://58.210.237.50:60080',
    // platformUrl:'http://game-api.yingdd888.com',
    platformUrl:'http://58.210.237.50:60080',
    statisticsUrl: 'http://hadoop-data.beeplay123.com',

    // gameUrl: 'https://com-dev.beeplay123.com',
    // platformUrl: 'https://10.33.80.102:8030'
}

var global = {
    appInfo: null,
    platform: (cc.sys.os === cc.sys.OS_IOS ? 'IOS' : (cc.sys.os === cc.sys.OS_ANDROID ? 'ANDROID' : 'WAP')),
    accessToken: '',
    websocketUrl: '',
    HTTPURL: HTTPURL,
    isAudit: false,
    persistNodeAdded: false,
}

if (cc.sys.isBrowser) {
    global.accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VOdW0iOiI4OTQwZDIxMy0wYjBmLTM2MDYtYWIwYy0yNDNlMDYwYTE1NTciLCJhcHBJZCI6MTAwMDAsImNoYW5uZWwiOjIwMDAwMSwidXNlcklkIjo3MDQsInV1aWQiOiIwYjY0MTA4ZjRiNjg0YTIwOTZmNGQ2OTg2ODUwOGQxNSIsImFjY291bnQiOiI1MTdiMzI5ZWI3MWM0ODI3YmI2ZDJjYzc2MjY2YzdlOCJ9.UqMoV_qiWD3NuSid3CjrTilx6v-H636jc6wZ1x98VZ4'
    global.accessToken = cc.getUrlParams().token || global.accessToken;
}

cc.Proxy('getDeviceInfo').called(event => {
    var appInfo = JSON.parse(event.detail);
    appInfo.gameId = Number(appInfo.gameId);
    appInfo.appChannel = Number(appInfo.appChannel);
    global.appInfo = appInfo;
    global.appChannel = appInfo.appChannel;
    global.deviceId = appInfo.deviceId;
});

module.exports = global;