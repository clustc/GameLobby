cc.Node.prototype.emitEvent = function (event, data) {
    var evt = new cc.Event.EventCustom(event, true);
    evt.detail = data;
    this.dispatchEvent(evt);
}

cc.Node.prototype.find = function (path, componentType) {
    var node = cc.find(path, this);
    if (node && componentType) {
        return node.getComponent(componentType);
    }
    return node;
}

cc.Node.prototype.getScript = function () {
    return this.getComponent(this.name);
}

cc.Node.prototype.setCascadeColor = function (color) {
    this.color = color;
    for (var i = this.children.length - 1; i >= 0; i--) {
        this.children[i].setCascadeColor(color);
    }
}

cc.Node.prototype.animateShake = function (range, duration) {
    if (this.getNumberOfRunningActions() > 0) return;
    range = range || 40;
    duration = duration || 0.4;
    var dt = 0.03;
    var times = Math.ceil(duration / dt);
    var drange = range / times;
    var position = this.position;
    var shake = () => {
        if (--times > 0) {
            this.runAction(cc.sequence(
                cc.delayTime(dt),
                cc.place(position.add(cc.p(Math.rand(-range, range), Math.rand(-range, range)))),
                cc.callFunc(shake)
            ))
            range -= drange;
        } else {
            this.position = position;
        }
    }
    shake();
}

cc.Node.prototype.addScriptNode = function (prefab) {
    var ret = cc.instantiate(prefab);
    ret.parent = this;
    return ret.getComponent(prefab.name);
}

cc.Component.prototype.getScript = function () {
    return this.getComponent(this.node.name);
}

cc.Component.prototype.find = function (path, componentType) {
    return this.node.find(path, componentType);
}

let loadRemoteImage = function(uri, callback) {
    let name = MD5(uri);
    let tokens = uri.split('.');
    let suffix = tokens[tokens.length - 1];   //png, jpg, ...

    let dirpath = jsb.fileUtils.getWritablePath() + 'img/';
    if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
        jsb.fileUtils.createDirectory(dirpath);
    }

    let localPath = dirpath + name + '.' + suffix;
    if (jsb.fileUtils.isFileExist(localPath)) {
        //本地已存在
        callback(localPath);
        return
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        if (xhr.status == "200") {
            let succeed = jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response), localPath);
            if (succeed) {
                cc.log('load remote image : ' + uri + ' succeed!');
                callback(localPath);
            }
        }else{
            cc.log('load remote image : ' + uri + ' failed!');
        }
    }
    xhr.open('GET', uri, true);
    xhr.send();
}

const Reg_Img = /([^.]+)$/;
cc.Sprite.prototype.loadImage = function (url, cbk) {
    if (!url) return;
    
    if(url.indexOf('http')>-1){
        if(cc.sys.isNative){
            loadRemoteImage(url, (localPath)=>{
                this.loadImage(localPath, cbk);
            })
            return;
        }
    }

    let tokens = url.split('.');
    let type = tokens[tokens.length - 1];   //png, jpg, ...

    cc.loader.load({ url: url, type: type }, (error, texture) => {
        if (error) {
            cc.log('load image error: ', error);
            cbk && cbk(null);
            return;
        }
        this.spriteFrame = new cc.SpriteFrame(texture);
        cbk && cbk(texture);
    });
}

cc.loadRes = function (path, cbk) {
    if (!path) return;
    cc.loader.loadRes(path, (err2, res2) => {
        if (err2) {
            cc.log('load res failure!', path);
        } else {
            cbk && cbk(res2);
        }
    });
}

cc.getUrlParams = function () {
    if(!cc.sys.isBrowser) return {};
    var url = location.search;
    var ret = new Object();
    if (url.indexOf('?') != -1) {
        var str = url.substr(1);
        var strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            ret[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }
    return ret;
}

/**获取两线段相交交点 */
cc.lineCrossPoint = function (A, B, C, D) {
    var retP = cc.p(0, 0);

    /**直线相交 */
    if (cc.pLineIntersect(A, B, C, D, retP)) {
        /**线段相交 */
        if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0) {
            var P = cc.p(0, 0);
            P.x = A.x + retP.x * (B.x - A.x);
            P.y = A.y + retP.x * (B.y - A.y);
            return P;
        }
    }

    return null;
}

/**点是否在旋转矩形内 */
cc.pointInRotatedRect = function (point, rect, degree) {
    if (rect.width * rect.height == 0) return false;
    var center = rect.center;
    var angle = cc.degreesToRadians(-degree);
    var a = cc.pRotateByAngle(cc.p(rect.xMin, rect.yMin), center, angle);
    var b = cc.pRotateByAngle(cc.p(rect.xMax, rect.yMin), center, angle);
    var c = cc.pRotateByAngle(cc.p(rect.xMax, rect.yMax), center, angle);
    var d = cc.pRotateByAngle(cc.p(rect.xMin, rect.yMax), center, angle);
    var lines = [a, b, b, c, c, d, d, a];
    var crossp = null;
    for (var i = 0; i < lines.length; i += 2) {
        crossp = cc.lineCrossPoint(center, point, lines[i], lines[i + 1]);
        if (crossp) {
            return cc.pDistance(center, crossp) >= cc.pDistance(center, point);
        }
    }
    /**没交点则在矩形内 */
    return !crossp;
}


/**
 * 获取函数的形参个数
 * @param {Function} func [要获取的函数]
 * @return {*}       [形参的数组或undefind]
 */
cc.getFunctionParameters = function (func) {
    if (typeof func == 'function') {
        var mathes = /[^(]+\(([^)]*)?\)/gm.exec(Function.prototype.toString.call(func));
        if (mathes[1]) {
            var args = mathes[1].replace(/[^,\w]*/g, '').split(',');
            return args;
        }
    }
}

cc.bytesToSize = function (bytes) {
    if (bytes === 0) return '0B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + '' + sizes[i];
}

cc.isArrayObject = function (obj) {
    return Object.prototype.toString.call(o) == '[object Array]';
}

//========================js extend==========================
//随机n-m之间的数，包括 n, m
Math.rand = function (n, m) {
    var c = m - n + 1;
    return Math.floor(Math.random() * c + n)
}

//保留n位小数
Math.decimal = function (x, n) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    return f;
}

//随机打乱数组
Math.shuffle = function (x) {
    var m = x.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = x[m];
        x[m] = x[i];
        x[i] = t;
    }
    return x;
}

//'number{0}number{1}'.format(A, B) = 'numberAnumberB'
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

// 时间格式化，new Date(timestamp).format("yyyy年MM月dd日hh时mm分ss秒")
// 毫秒格式化，new Date(milliseconds - 28800000).format("hh时mm分ss秒") //  - 28800000 为减去1970年的8小时
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
