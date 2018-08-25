cc.Class({
    extends: cc.Component,

    properties: {
        initIndex: 0, // 负值不初始化状态
        buttonArray: [cc.Button],

        _currentIndex: -1,
    },
    editor: {
        menu: 'ExtendUI/RadioButton'
    },

    onLoad: function () {
        for (let i = 0; i < this.buttonArray.length; i++) {
            var button = this.buttonArray[i].node;
            button.active = false;
            button.on('click', event => this.onClick(event, i), this);
        }
    },
    setButtonSpriteFrame:function(){
        //console.log('setButtonSpriteFrame    '+JSON.stringify(data));
        for (let i = 0; i < this.buttonArray.length; i++){
            var button = this.buttonArray[i].node;
            button.active = true;
            ff.AccountManager.setUserHeadImage(''+i ,button.getChildByName('head').getComponent(cc.Sprite));
        }
    },
    refreshButton:function(){
        for (let i = 0; i < this.buttonArray.length; i++){
            var button = this.buttonArray[i].node;
            button.active = true;
        }
    },
    start: function () {
        // this._setState(this.initIndex);
    },

    removeNode: function (index) {
        this.buttonArray[index].off('click', this.onClick, this);
        this.buttonArray.splice(index, 1);
    },

    removeAllNode: function () {
        for (var i = 0; i < this.buttonArray.length; i++) {
            this.buttonArray[i].node.off('click', this.onClick, this);
        }
        this.buttonArray = [];
    },

    pushNode: function (button) {
        this.buttonArray.push(button.getComponent(cc.Button));
        button.on('click', event => this.onClick(event, this.buttonArray.length - 1), this);
    },

    setState: function (index) {
        this.scheduleOnce(() => this._setState(index), 0);
    },

    _setState: function (index) {
        if (index >= 0 && index < this.buttonArray.length) {
            this.buttonArray[index].node.emit('click');
        }
        else if (this._currentIndex >= 0 && this._currentIndex < this.buttonArray.length) {
            var button = this.buttonArray[this._currentIndex];
            button.interactable = true;
            button.node.emit('click_cancel');
        }
    },

    getCurIndexButton : function() {
        return this.buttonArray[this._currentIndex];
    },

    onClick: function (event, i) {
        var targetButton = event.target.getComponent(cc.Button);
        this.buttonArray.forEach((button) => {
            if (button === targetButton) {
                this._currentIndex = i;
                button.interactable = false;
                this.node.emit('click_start', button);
            }
            else {
                button.interactable = true;
                this.node.emit('click_cancel', button);
            }
        });
    }
});