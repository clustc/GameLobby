cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor() { 

    },

    createObject(type) {
        return null;
    },

    resetObject(object, type) {

    },

    prepareObject(count, type) {
        var typeArray = '_objects' + (type || 'default');
        this[typeArray] = [];
        for(var i = 0; i < count; i++) this[typeArray].push(this.createObject(type)); 
    },

    produce(type) {
        var typeArray = '_objects' + (type || 'default');
        if(!this[typeArray]) this[typeArray] = [];
        if (this[typeArray].length > 0) {
            return this[typeArray].shift();
        } else {
            return this.createObject(type);
        }
    },

    reclaim(object, type) {
        this.resetObject(object, type);
        type = '_objects' + (type || 'default');
        if (this[type].indexOf(object) < 0) this[type].push(object);
    }
});
