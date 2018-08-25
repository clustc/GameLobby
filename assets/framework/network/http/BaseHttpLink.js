const CCGlobal = require('CCGlobal');

const BaseHttpLink = function(url, param) {

    this.request = function (OKcbk, NOcbk) {
        
        var success = data => OKcbk && OKcbk(data);
        var failure = (error, code) => NOcbk && NOcbk(error, code);

        var xhr = new XMLHttpRequest();
       
        xhr.open('POST', url, true);
        xhr.setRequestHeader('App-Version', 'v1.0.0');
        xhr.setRequestHeader('App-Channel', CCGlobal.appChannel);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', CCGlobal.accessToken);
        xhr.setRequestHeader('Repeated-Submission', (new Date()).getTime().toString());
        xhr.timeout = 10000;
        xhr.ontimeout = function () {
            failure('连接超时');
        };
        xhr.onerror = function () {
            failure('未连接到网络，请检查您的网络设置');
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status <= 207) {
                if (xhr.responseText) {
                    var result = JSON.parse(xhr.responseText);
                    if (result.code === 200) {
                        success(result.data);
                    } else if (result.code === 401) {
                        failure('请重新登录', result.code);
                    } else {
                        failure(result.message, result.code);
                    }
                }
            } else {
                failure('网络不佳，请稍后再试', xhr.status);
            }
        };

        param ? xhr.send(JSON.stringify(param)) : xhr.send();
        return this;
    }
}

module.exports = BaseHttpLink;
