const iOS_CLASS = 'GameTools';

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
    //iOS内购
    "APPLE_PAY_Res":22
}

//回调js
app.onSuccess = (type, jsonStr) => {
    cc.log('onSuccess'+  type + jsonStr);
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
        case app.APPLE_PAY_Res:
            break;
    }
}

app.onFailed = (type, errorText) => {
    cc.log(type, errorText);
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
        case app.APPLE_PAY_Res:
            break;
    }
}
//发送注册验证码
app.sendRegisitCode = (phone) => jsb.reflection.callStaticMethod(iOS_CLASS, 'sendRegisitCode:', phone);
//注册
app.regisit = (phone, psw, code) => jsb.reflection.callStaticMethod(iOS_CLASS, 'regisit:withPws:withSMCode:', phone, psw, code);
//游客登录
app.visitorLogin = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'visitorLogin');
//QQ登录
app.qqLogin = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'qqLogin');
//微信登录
app.wxLogin = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'wxLogin');
//手机号登录
app.phoneLogin = (phone, psw) => jsb.reflection.callStaticMethod(iOS_CLASS, 'phoneLogin:withPsw:',  phone, psw);
//查询收货信息
app.queryUserReceiveInfo = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'queryUserReceiveInfo', );
//修改收货信息
app.updateUserInfo = (receiveAddr, receiveName, receivePhone) => jsb.reflection.callStaticMethod(iOS_CLASS, 'updateUserReceiveInfo:withName:withPhone:', receiveAddr, receiveName, receivePhone);
//更新密码
app.updatePsw = (phone, psw, code) => jsb.reflection.callStaticMethod(iOS_CLASS, 'updatePsw:withPhone:withSmsCode:', psw, phone, code);
//发送更新密码验证码
app.sendUpdatePswCode = (phone) => jsb.reflection.callStaticMethod(iOS_CLASS, 'sendUpdatePswCode:', phone);
//修改昵称
app.updateNickName = (nickName) => jsb.reflection.callStaticMethod(iOS_CLASS, 'updateNickName:', nickName);
//更新头像
app.updateAvatar = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'updateAvatar');
//退出登录
app.logOut = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'logOut');
//复制文本
app.copyText = (string) => jsb.reflection.callStaticMethod(iOS_CLASS, 'copyText:',string);
//获取设备号
app.getDeviceId = () => { return jsb.reflection.callStaticMethod(iOS_CLASS, 'getDeviceId') }
//获取渠道号
app.getAppChannel = () => { return jsb.reflection.callStaticMethod(iOS_CLASS, 'getChannelName') }
//获取游戏ID
app.getGameID = () => { return jsb.reflection.callStaticMethod(iOS_CLASS, 'getGameId') }
//打开支付
app.openPay = (payData) => jsb.reflection.callStaticMethod(iOS_CLASS, 'openPay:', JSON.stringify(payData));
//绑定微信
app.bindToWX = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'bindToWX');
//绑定QQ
app.bindToQQ = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'bindToQQ');
//微信登录by openID
app.wxLoginByOpenId = (openId) => jsb.reflection.callStaticMethod(iOS_CLASS, 'wxLoginByOpenId:', openId);
//QQ登录ByOpenId
app.qqLoginByOpenId = (headImg, nickName, openId) => jsb.reflection.callStaticMethod(iOS_CLASS, 'qqLoginByOpenId:withNickname:withHeadImg:',openId,nickName,headImg );
//打开页面地址
app.openUrl = (url) => jsb.reflection.callStaticMethod(iOS_CLASS, 'openWebUrl:', url);
//调试输出
app.debugLog = (info) => {
    if(typeof info === 'object') info = JSON.stringify(info)
    jsb.reflection.callStaticMethod(iOS_CLASS, 'debugLog:', info);
}
//获取Host
app.getHost = () => { return jsb.reflection.callStaticMethod(iOS_CLASS, 'getHost') }
  //是否可以游客登录
app.canVisitorLogin = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'canVisitorLogin');
//修改本地头像
app.updateLocalAvatar = (localAvatar) => jsb.reflection.callStaticMethod(iOS_CLASS, 'updateLocalAvatar:', localAvatar);
//退出app
// app.exit = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'exit');
//打开客服页面
app.openCSPage = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'openCSPage');
//获取设备信息
app.getDeviceInfo = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'getDeviceInfo');

//自动登录
app.autoLogin = () => jsb.reflection.callStaticMethod(iOS_CLASS, 'autoLogin');

//apple 内购
app.applePay = (data) => jsb.reflection.callStaticMethod(iOS_CLASS, 'applePay:',data);

//切换场景loading
app.showLoading = ()=>jsb.reflection.callStaticMethod(iOS_CLASS, 'showLoading');
app.hideLoading = ()=>jsb.reflection.callStaticMethod(iOS_CLASS, 'hideLoading');
//退出游戏
app.exit = ()=>{
    cc.sys.localStorage.removeItem('refreshToken');
    require('CCGlobal').accessToken = '';
    cc.director.loadScene('LoginScene',() => delete ff.AccountManager);
};
//游戏内支付
app.gameOpenPay = (payData, success, failure) => {


    console.log('=======>buy22222',JSON.stringify(payData));

    var times = 0;
    var checkResult = (data) => {
        var param = {
            orderSn: data.orderSn,
            recepit: data.recepit,
            thirdSn: data.thirdSn
        }
        times++;

        cc.BaseLinker('CheckOrderStateNew', param).request(result => {
            if (result.payStatus == 3) {
                cc.Waiting.hide();
                cc.Toast('支付成功').show();
                ff.AccountManager.refreshAccount();
                success && success();
            } else if (result.payStatus == 4 || times > 12) {
                cc.Waiting.hide();
                cc.Toast('支付失败').show();
                failure && failure();
            }
            // else setTimeout(checkResult, 500);
        }, error => {
            cc.Waiting.hide();
            cc.Toast(error).show();
            failure && failure();
        })
    }


    cc.Proxy('applePay', payData.bizId).listen('APPLE_PAY_Res').called((event) => {


        console.log('=======>buy3333',JSON.stringify(event.detail));

        cc.Waiting.show('确认支付结果，请稍等...');
    checkResult(event.detail);
    }, event => {
        cc.Toast(event.detail.msg).show();
        failure && failure();
    });
}
module.exports = app;