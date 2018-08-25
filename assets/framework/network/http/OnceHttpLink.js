/**
 * 一次性访问的http请求
 */
const BaseHttpLink = require('BaseHttpLink');

const MiddleWare = function() {
    var callbacks = [];
    var ware = function() {
        var index = 0;
        var params = arguments[0];
        /**最后一个参数为最终回调 */
        var final = params.pop();
        var next = function() {
            var cbk = callbacks[index++];
            if(cbk) cbk.apply(cbk, params);
            else {
                params.pop();
                final && final.apply(final, params);
            }
        }
        /**最后一个参数改为next */
        params.push(next);
        next();
    }
    this.use = cbk => callbacks.push(cbk);
    this.start = function() { return new ware([].slice.call(arguments)) };
}

function OnceHttpLink(url, param) {
    var isShowLoading = false;
    var isShowMessage = true;
    this.showLoading = function (value) {
        isShowLoading = value;
        return this;
    }
    this.showMessage = function (value) {
        isShowMessage = value;
        return this;
    }
    this.request = function (OKcbk, NOcbk) {
        if (!url) return this;
        isShowLoading && cc.Waiting.show();
        var success = (data) => {
            isShowLoading && cc.Waiting.hide();
            OKcbk && OKcbk(data);
        }
        var failure = (error, code) => {
            isShowLoading && cc.Waiting.hide();
            isShowMessage && cc.Toast(error).show();
            NOcbk && NOcbk(error, code);
        }
        new BaseHttpLink(url, param).request(
            data => OnceHttpLink.success.start(data, success), 
            (error, code) => OnceHttpLink.failure.start(error, code, failure)
        );
        return this;
    }
}

OnceHttpLink.success = new MiddleWare();
OnceHttpLink.failure = new MiddleWare();

module.exports = OnceHttpLink;