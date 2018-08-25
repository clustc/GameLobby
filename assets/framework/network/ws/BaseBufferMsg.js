const encodeText = function(text) {
    var ret = [];
    for(var i = 0; i < text.length; i++) {
        ret.push(text.charCodeAt(i));
    }
    return ret;
}

const decodeText = function(bytes) {
    var encoded = '';
    for (var i = 0; i < bytes.length; i++) {
        encoded += String.fromCharCode(bytes[i]);
    }
    return encoded;
}

const funcName = function(type) {
    var first = type.slice(0, 1).toUpperCase();
    var lasts = type.slice(1).toLowerCase();
    return first + lasts;
}

cc.Class({
    
    extends: cc.EventTarget,

    properties: {
        buffer: {
            get() {
                return this.getBuffer();
            }
        }
    },

    ctor() {
        this.setsDataView = null;
        this.getsDataView = null;
        this.setsDataViewIndex = 0;
        this.getsDataViewIndex = 0;

        this.cacheArray = [];
    },

    getBuffer() {
        var arrayBuffer = new ArrayBuffer(this.setsDataViewIndex);
        this.setsDataView = new DataView(arrayBuffer);
        this.setsDataViewIndex = 0;
        for(var i in this.cacheArray) {
            var d = this.cacheArray[i];
            this[d.method](d.value);
        }
        this.cacheArray = [];
        return this.setsDataView.buffer;
    },
    
    /*********************** get *************************/
    getByte() {
        this.getsDataViewIndex += 1;
        return this.getsDataView.getInt8(this.getsDataViewIndex - 1);
    },
    getShort() {
        this.getsDataViewIndex += 2;
        return this.getsDataView.getInt16(this.getsDataViewIndex - 2);
    },
    getInt() {
        this.getsDataViewIndex += 4;
        return this.getsDataView.getInt32(this.getsDataViewIndex - 4);
    },
    getFloat() {
        this.getsDataViewIndex += 8;
        return this.getsDataView.getFloat64(this.getsDataViewIndex - 8);
    },
    getString() {
        var len = this.getShort();
        var ret = [];
        for(var i = 0; i < len; i++) ret.push(this.getShort());
        return decodeText(ret);
    },
    getArray(obj) {
        var ret = [];
        var len = this.getShort();
        var keyLen = 0;
        var keyOne = '';
        for(var i = 0; i < len; i++) {
            var t = {};
            keyLen = 0;
            for(var key in obj) {
                t[key] = this.getValue(obj[key]);
                keyLen++;
                keyOne = key;
            }
            if(keyLen == 1) t = t[keyOne];
            
            ret.push(t);
        }
        return ret;
    },
    getValue(type) {
        if(typeof type == 'object') return this.getArray(type);
        return this['get' + funcName(type)]();
    },


    /*********************** set *************************/
    setByte(value) {
        this.cacheArray.push({ method: 'setInt8', value: value});
        this.setsDataViewIndex += 1;
    },
    setShort(value) {
        this.cacheArray.push({ method: 'setInt16', value: value});
        this.setsDataViewIndex += 2;
    },
    setInt(value) {
        this.cacheArray.push({ method: 'setInt32', value: value});
        this.setsDataViewIndex += 4;
    },
    setFloat(value) {
        this.cacheArray.push({ method: 'setFloat64', value: value});
        this.setsDataViewIndex += 8;
    },
    setString(value) {
        var chars = encodeText(value);
        this.setShort(chars.length);
        for(var i in chars) this.setShort(chars[i]);
    },
    setArray(type, value) {
        this.setShort(value.length);
        for(var i in value) {
            var obj = value[i];
            for(var k in type) {
                this.setValue(type[k], obj[k])
            }
        }
    },
    setValue(type, value) {
        if(typeof type == 'object') this.setArray(type, value);
        else this['set' + funcName(type)](value);
    },

    
    /*********************** write to buffer *************************/
    setInt8(value) {
        this.setsDataView.setInt8(this.setsDataViewIndex, value);
        this.setsDataViewIndex += 1;
    },
    setInt16(value) {
        this.setsDataView.setInt16(this.setsDataViewIndex, value);
        this.setsDataViewIndex += 2;
    },
    setInt32(value) {
        this.setsDataView.setInt32(this.setsDataViewIndex, value);
        this.setsDataViewIndex += 4;
    },
    setFloat64(value) {
        this.setsDataView.setFloat64(this.setsDataViewIndex, value);
        this.setsDataViewIndex += 8;
    },
    
});
