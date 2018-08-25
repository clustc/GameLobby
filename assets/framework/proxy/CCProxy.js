/**
 * 调用原生接口
 * 
 * 调用：
 * cc.Proxy(method, arg1, arg2...).listen(codeKey).called(event => {}, event => {})
 * 
 * 参数：
 * method：方法名，参见proxy-android.js
 * arg1，arg2...：参数，按顺序传入，参见proxy-android.js
 * code：有回调时传入code的key，参见proxy-android.js
 * event => {}：成功/失败回调，数据为event.detail
 * 
 * 示例：
 * cc.Proxy('phoneLogin', 'user', '1388').listen('RES_PHONE_LOGIN').called(event => {}, event => {})
 */

var app = {};
if (window.jsb && cc.sys.os === cc.sys.OS_IOS) {
    app = require('proxy-ios');
} else if (window.jsb && cc.sys.os === cc.sys.OS_ANDROID) {
    app = require('proxy-android');
} else {
    app = require('proxy-web');
}
app.getCodeName = (code) => {
    code = parseInt(code);
    for(var key in app) if(code === app[key]) return key; 
}

cc.systemEvent = cc.systemEvent || new cc.EventTarget();
const AppEventCaller = function () {
    var params = arguments[0];
    var codeKey = '';
    /**第一个参数为方法名 */
    var method = app[params.shift()];
    return {
        called(OKcbk, NOcbk) {
            if(method) {
                OKcbk && cc.systemEvent.once('success' + codeKey, OKcbk);
                NOcbk && cc.systemEvent.once('failure' + codeKey, NOcbk);
                var ret = method.apply(app, params);
                if(ret !== undefined) {
                    /**如果有返回值，则直接回调 */
                    OKcbk && OKcbk({ detail: ret });
                    OKcbk && cc.systemEvent.off('success' + codeKey, OKcbk);
                    NOcbk && cc.systemEvent.off('failure' + codeKey, NOcbk);
                    return ret;
                }
            }
        },
        listen(key) {
            codeKey = key;
            return this;
        }
    }
}

cc.Proxy = function() { return new AppEventCaller([].slice.call(arguments)) }

cc.Proxy.onSuccess = function(code, jsonStr) {
    code = app.getCodeName(code);
    cc.systemEvent.off('failure' + code);
    ((c, j) => { setTimeout(() => cc.systemEvent.emit('success' + c, JSON.parse(j)), 100) })(code, jsonStr);
}

cc.Proxy.onFailed = function(code, errorTxt) {
    code = app.getCodeName(code);
    cc.systemEvent.off('success' + code);
    ((c, e) => { setTimeout(() => cc.systemEvent.emit('failure' + c, e), 100) })(code, errorTxt);
}

cc.Proxy.kickOut = function() {
    if(require('CCGlobal').accessToken) {
        cc.Toast('游戏提示：\n用户信息失效，请重新登录！').showDialog(() => ff.AccountManager.emit('EVENT_USER_LOGOUT'));
    }
}
