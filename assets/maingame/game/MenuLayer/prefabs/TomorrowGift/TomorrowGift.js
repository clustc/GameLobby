
cc.Class({
    extends: cc.Component,

    properties: {
        countDown: cc.Label,
        drawTicket: cc.Node,

        lightAnim_1: cc.Node,
        lightAnim_2: cc.Node,
    },

    onLoad() {
        this.node.on('click', this.onTomorrowGiftPop, this);
        this.delta_time = 0;
        this.delta_dt = 900;
        this.time = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.tickets = 0;
        this.isCountDown = true;
        // this.getTomorrowData();
    },

    onDestroy() {
        this.node.off('click', this.onTomorrowGiftPop, this)
    },

    onTomorrowGiftPop(event) {
        var node = event.target;
        cc.Popup('TomorrowGiftPop').outsideClose(false).show((item) => {
            item.setTomorrowData(node);
            item.showTicketOrCountDown(this.isCountDown);
        })
        ff.BuryingPoint(3402000011);
    },

    judgeShowTomorrow(valid) {
        var validFlag = valid;
        if (!validFlag && this.tickets <= 0) {
            this.node.active = false;
        }
    },

    getTomorrowData() {
        // cc.Linker('GetTomorrowGift').request((data) => {
        //     this.tomorrowData = data;
        //     this.updateTime(data.remainMilliSeconds);
        //     this.updataTicket(data.cards);
        //     this.judgeShowTomorrow(data.valid);
        // });
    },

    updateTime(time) {
        this.delta_time = time;
    },

    updataTicket(amount) {
        // cc.log('设置抽奖券');
        this.tickets = amount;
        this.showTicketOrCountDown();
    },

    showTicketOrCountDown() {
        if (this.tickets <= 0) {
            this.lightAnim_1.active = false;
            this.lightAnim_1.active = false;
            this.node.getComponent(cc.Animation).stop('CanDraw');
            this.isCountDown = true;
            this.node.emit('change_Flag', this.isCountDown);
            this.showCountDown();
        }
        else {
            this.lightAnim_1.active = true;
            this.lightAnim_1.active = true;
            this.node.getComponent(cc.Animation).play('CanDraw');
            this.isCountDown = false;
            this.node.emit('change_Flag', this.isCountDown);
            this.showTicket();
        }
    },

    showCountDown() {
        this.drawTicket.active = false;
        this.countDown.node.active = true;
    },

    showTicket() {
        this.drawTicket.active = true;
        this.countDown.node.active = false;
    },


    update(dt) {
        if (!this.isCountDown) return;
        this.hour = Math.floor(this.delta_time / 1000 / 60 / 60 % 24);
        this.minute = Math.floor(this.delta_time / 1000 / 60 % 60);
        this.second = Math.floor(this.delta_time / 1000 % 60);
        this.hour = this.hour < 10 ? '0' + this.hour : this.hour;
        this.minute = this.minute < 10 ? '0' + this.minute : this.minute;
        this.second = this.second < 10 ? '0' + this.second : this.second;
        this.time = this.hour + ':' + this.minute + ':' + this.second;
        if (this.delta_dt >= 1000) {
            this.countDown.string = this.time;
            this.node.emit('Refresh_Time', this.time);
            this.delta_time -= this.delta_dt;
            if (this.delta_time <= 0) {
                this.isCountDown = false;
                // this.getTomorrowData();
            }
            else this.delta_dt = 0;
        }
        else {
            this.delta_dt += dt * 1000;
        }
    },
});
