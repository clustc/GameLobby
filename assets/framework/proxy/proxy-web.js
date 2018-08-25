const android = require('proxy-android');
var app = {};

for(var key in android) {
    if(typeof android[key] == 'function') {
        (method => {
            app[method] = function() {
                cc.log('....NATIVE CALL....', method, [].slice.call(arguments))
            }
        })(key);
    } else {
        app[key] = android[key];
    }
}

app.canVisitorLogin = () => {
    setTimeout(() => {
        cc.Proxy.onSuccess(19, JSON.stringify({ msg: 1 }));
    }, 100);
}

app.getDeviceInfo = () => {
    return '{"appChannel":"200001","city":"","country":"","deviceId":"12321","gameId":"10000","ip":"10.0.2.15","manufacturer":"samsung","model":"SM-G9350","os":"android 5.1.1","province":""}'
}

app.logOut = () => {
    cc.Proxy.onSuccess(13, '{}');
}

app.autoLogin = () => {
    setTimeout(() => {
        cc.Proxy.onSuccess(21, JSON.stringify({ accessToken: require('CCGlobal').accessToken }));
    }, 1000);
}

app.thirdSdkAutoLogin = () => {
    setTimeout(() => {
        cc.Proxy.onSuccess(25, JSON.stringify({ accessToken: require('CCGlobal').accessToken }));
    }, 1000);
}

//退出app
app.exit = ()=>{
    cc.sys.localStorage.removeItem('refreshToken');
    require('CCGlobal').accessToken = '';
    
    cc.director.loadScene('LoginScene',() => delete ff.AccountManager);
};

app.getAppChannel = () => {
    return 'normal'
}

module.exports = app;