const ANDROID_CLASS = 'com/dztec/lib/JsToJava';

const app = {
    //发送注册验证码
    "RES_SEND_REGISIT_CODE": 1,
    //注册
    "RES_REGISIT": 2,
    //游客登录
    "RES_VISITOR_LOGIN": 3,
    //QQ登录
    "RES_QQ_LOGIN": 4,
    //微信登录
    "RES_WEI_XIN_LOGIN": 5,
    //手机号登录
    "RES_PHONE_LOGIN": 6,
    //查询收货信息
    "RES_GET_USER_RECEIVE_INFO": 7,
    //修改收货信息
    "RES_MODIFY_USER_RECEIVE_INFO": 8,
    //修改密码
    "RES_MODIFY_PASSWORD": 9,
    //发送修改密码验证码
    "RES_SEND_MODIFY_PASSWORD_CODE": 10,
    //修改昵称
    "RES_UPDATE_NICKNAME": 11,
    //修改头像
    "RES_UPDATE_AVATAR": 12,
    //退出登录
    "RES_LOG_OUT": 13,
    //支付
    "RES_PAY": 14,
    //微信绑定
    "RES_WX_BIND": 15,
    //QQ绑定
    "RES_QQ_BIND": 16,
    //通过绑定返回的参数登录微信
    "RES_WX_LOGIN_BY_OPEN_ID": 17,
    //通过绑定返回的参数登录QQ
    "RES_QQ_LOGIN_BY_OPEN_ID": 18,
    //是否可以游客登录
    "RES_CAN_VISITOR_LOGIN": 19,
    //修改本地头像
    "RES_UPDATE_LOCAL_AVATAR": 20,
    //自动登录
    "RES_AUTO_LOGIN": 21,
    //anySdk登录
    "RES_ANY_SDK_LOGIN": 22,
    //thirdLogin
    "RES_THIRD_SDK_LOGIN": 23,
    //thirdsdkPay
    "RES_THIRD_SDK_PAY": 24,
    //thirdsdkAutoLogin
    "RES_THIRD_SDK_AUTO_LOGIN": 25
}

//回调js
app.onSuccess = (type, jsonStr) => {
    console.log(type, jsonStr);
    switch (parseInt(type)) {
        case app.RES_SEND_REGISIT_CODE:
            break;
        case app.RES_REGISIT:
            break;
        case app.RES_VISITOR_LOGIN:
            break;
        case app.RES_QQ_LOGIN:
            break;
        case app.RES_WEI_XIN_LOGIN:
            break;
        case app.RES_PHONE_LOGIN:
            break;
        case app.RES_GET_USER_RECEIVE_INFO:
            break;
        case app.RES_MODIFY_USER_RECEIVE_INFO:
            break;
        case app.RES_MODIFY_PASSWORD:
            break;
        case app.RES_SEND_MODIFY_PASSWORD_CODE:
            break;
        case app.RES_UPDATE_NICKNAME:
            break;
        case app.RES_UPDATE_AVATAR:
            break;
        case app.RES_LOG_OUT:

            break;
        case app.RES_WX_BIND:
            cc.bindState = JSON.parse(jsonStr);
            console.log(cc.bindState);
            console.log(cc.bindState.openId);
            break;
        case app.RES_QQ_BIND:
            cc.bindState = JSON.parse(jsonStr);
            console.log(cc.bindState);
            console.log(cc.bindState.headImg);
            break;
    }
}

app.onFailed = (type, errorText) => {
    console.log(type, errorText);
    switch (parseInt(type)) {
        case app.RES_SEND_REGISIT_CODE:
            break;
        case app.RES_REGISIT:
            break;
        case app.RES_VISITOR_LOGIN:
            break;
        case app.RES_QQ_LOGIN:
            break;
        case app.RES_WEI_XIN_LOGIN:
            break;
        case app.RES_PHONE_LOGIN:
            break;
        case app.RES_GET_USER_RECEIVE_INFO:
            break;
        case app.RES_MODIFY_USER_RECEIVE_INFO:
            break;
        case app.RES_MODIFY_PASSWORD:
            break;
        case app.RES_SEND_MODIFY_PASSWORD_CODE:
            break;
        case app.RES_UPDATE_NICKNAME:
            break;
        case app.RES_UPDATE_AVATAR:
            break;
        case app.RES_LOG_OUT:
            break;

    }
}
//发送注册验证码
app.sendRegisitCode = (phone) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'sendRegisitCode', '(Ljava/lang/String;)V', phone);
//注册
app.regisit = (phone, psw, code) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'regisit', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', phone, psw, code);
//游客登录
app.visitorLogin = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'visitorLogin', '()V');
//QQ登录
app.qqLogin = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'qqLogin', '()V');
//微信登录
app.wxLogin = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'wxLogin', '()V');
//手机号登录
app.phoneLogin = (phone, psw) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'phoneLogin', '(Ljava/lang/String;Ljava/lang/String;)V', phone, psw);
//查询收货信息
app.queryUserReceiveInfo = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'queryUserReceiveInfo', '()V');
//修改收货信息
app.updateUserInfo = (receiveAddr, receiveName, receivePhone) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'updateUserReceiveInfo', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', receiveAddr, receiveName, receivePhone);
//更新密码
app.updatePsw = (phone, psw, code) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'updatePsw', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', phone, psw, code);
//发送更新密码验证码
app.sendUpdatePswCode = (phone) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'sendUpdatePswCode', '(Ljava/lang/String;)V', phone);
//修改昵称
app.updateNickName = (nickName) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'updateNickName', '(Ljava/lang/String;)V', nickName);
//更新头像
app.updateAvatar = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'updateAvatar', '()V');
//退出登录
app.logOut = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'logOut', '()V');
//复制文本
app.copyText = (string) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'copyText', '(Ljava/lang/String;)V', string);
//获取设备号
app.getDeviceId = () => {
    return jsb.reflection.callStaticMethod(ANDROID_CLASS, 'getDeviceId', '()Ljava/lang/String;')
}
//获取渠道号
app.getAppChannel = () => {
    return jsb.reflection.callStaticMethod(ANDROID_CLASS, 'getChannelName', '()Ljava/lang/String;')
}
//获取游戏ID
app.getGameID = () => {
    return jsb.reflection.callStaticMethod(ANDROID_CLASS, 'getGameId', '()Ljava/lang/String;')
}
//打开支付
app.openPay = (payData) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'openPay', '(Ljava/lang/String;)V', JSON.stringify(payData));
//绑定微信
app.bindToWX = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'bindToWX', '()V');
//绑定QQ
app.bindToQQ = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'bindToQQ', '()V');
//微信登录by openID
app.wxLoginByOpenId = (openId) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'wxLoginByOpenId', '(Ljava/lang/String;)V', openId);
//QQ登录ByOpenId
app.qqLoginByOpenId = (headImg, nickName, openId) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'qqLoginByOpenId', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V', headImg, nickName, openId);
//打开页面地址
app.openUrl = (url) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'openWebUrl', '(Ljava/lang/String;)V', url);
//调试输出
app.debugLog = (info) => {
    if (typeof info === 'object') info = JSON.stringify(info)
    jsb.reflection.callStaticMethod(ANDROID_CLASS, 'debugLog', '(Ljava/lang/String;)V', info);
}
//获取Host
app.getHost = () => {
    return jsb.reflection.callStaticMethod(ANDROID_CLASS, 'getHost', '()Ljava/lang/String;')
}
//是否可以游客登录
app.canVisitorLogin = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'canVisitorLogin', '()V');
//修改本地头像
app.updateLocalAvatar = (localAvatar) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'updateLocalAvatar', '(Ljava/lang/String;)V', localAvatar);
//退出app
// app.exit = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'exit', '()V');
//打开客服页面
app.openCSPage = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'openCSPage', '()V');
//获取设备信息
app.getDeviceInfo = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'getDeviceInfo', '()Ljava/lang/String;');
//自动登录
app.autoLogin = () => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'autoLogin', '()V');
//第三方sdk登录 platType(1应用宝,2百度,3小米，4华为) loginType 登录方式(1 游客 2qq 3微信)----此登录接口只在有需要接的平台调用
app.thirdSdkLogin = (platType, loginType) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'thirdSdkLogin', '(II)V', platType, loginType);
//第三方sdk支付 platType(1应用宝,2百度,3小米，4华为)
app.thirdSdkPay = (platType, payJson) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'thirdSdkPay', '(ILjava/lang/String;)V', platType, payJson);
//第三方sdk自动登录
app.thirdSdkAutoLogin = (platType) => jsb.reflection.callStaticMethod(ANDROID_CLASS, 'thirdSdkAutoLogin', '(I)V', platType);
//切换场景loading
app.showLoading = ()=>jsb.reflection.callStaticMethod(ANDROID_CLASS, 'showLoading', '()V');
app.hideLoading = ()=>jsb.reflection.callStaticMethod(ANDROID_CLASS, 'hideLoading', '()V');
//退出app
app.exit = ()=>{
    cc.sys.localStorage.removeItem('refreshToken');
    require('CCGlobal').accessToken = '';
    cc.director.loadScene('LoginScene',() => delete ff.AccountManager);
};

//游戏内支付
app.gameOpenPay = (payData, success, failure) => {
    cc.Proxy('openPay', {
        platform: require('CCGlobal').platform,
        productId: payData.bizId,
        price: payData.price,
    }).listen('RES_PAY').called((event) => {
        cc.Toast('支付成功').show();
        ff.AccountManager.refreshAccount();
        success && success();
    }, event => {
        cc.Toast(event.detail.msg).show();
        failure && failure();
    });
}

module.exports = app;