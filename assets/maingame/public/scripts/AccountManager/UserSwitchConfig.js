cc.Class({
    properties: {
        data: {
            get() { return  this._switch_state; },
        }
    },

    ctor() {
        this._data = null;
        this._switch_state = {
            [1]: {
                name:'firstCharge',         //'首冲礼包',
                state:true,
            },
            [2]: {
                name:'shop',                //'商城',
                state:true,
            },
            [3]: {
                name:'vipGift',             //'贵族礼包',
                state:true,
            }, 
            [4]: {
                name:'vipPrivilege',        //'VIP特权',
                state:true,
            }, 
            [5]: {
                name:'resort',              //'娱乐场',
                state:true,
            }, 
            [6]: {
                name:'activity',            //'活动',
                state:true,
            }, 
            [7]: {
                name:'userBag',             //'背包',
                state:true,
            },
            [8]: {
                name:'change_name',         //'修改昵称',
                state:true,
            }, 
            [9]: {
                name:'celebrity',           //'名人榜',
                state:true,
            }, 
            [10]: {
                name:'celebrity_PersonalityMessage',//'名人榜 => 个性签名',
                state:true,
            }, 
            [11]: {
                name:'task',                //'任务',
                state:true,
            }, 
            [12]: {
                name:'task_day',            //'任务 => 每日任务',
                state:true,
            }, 
            [13]: {
                name:'task_week',           //'任务 => 每周任务',
                state:true,
            }, 
            [14]: {
                name:'task_day_activity',   //'每日任务 => 每日活跃',
                state:true,
            }, 
            [15]: {
                name:'task_week_activity',  //'每周任务 => 每周活跃',
                state:true,
            }, 
            [16]: {
                name:'exchange',            //'兑换',
                state:true,
            },
            [17]: {
                name:'exchange_synthesis',  //'兑换 => 合成',
                state:true,
            },
            [18]: {
                name:'exchange_exchange',   //'兑换 => 实物兑换',
                state:true,
            },
            [19]: {
                name:'sign',                //'签到',
                state:true,
            },
            [20]: {
                name:'vipDraw',             //'VIP抽奖',
                state:true,
            },
            [21]: {
                name:'mail',                //'邮件',
                state:true,
            },
            [22]: {
                name:'mail_system',         //'邮件  => 系统邮件',
                state:true,
            },
            [23]: {
                name:'main_push',           //'邮件  => 消息推送',
                state:true,
            },
            [24]: {
                name:'mail_leaveMsg',       //'邮件  => 留言',
                state:true,
            },
            [25]: {
                name:'playNowButton',       //'立马玩',
                state:true,
            },
            [26]: {
                name:'playerGuide',         //'新手引导',
                state:true,
            },
            [27]: {
                name:'newbieTask',          //'新手任务',
                state:true,
            },
            [28]: {
                name:'unLockCannon',        //'解锁炮台',
                state:true,
            },
            [29]: {
                name: 'freeDraw',           //'免费抽奖'
                state:true,
            },
            [30]: {
                name:'tomorrowGift' ,       //'明日抽大奖',
                state:true,
            },
            [31]: {
                name:'sailPackage' ,        //'起航礼包',
                state:true,
            },
            [32]: {
                name:'revive' ,             //'复活基金',
                state:true,
            },
            [33]: {
                name:'horseRaceLamp' ,      //'跑马灯',
                state:true,
            },
        }
    },

    setData() {
        for(var i in this._data){
            if(this._data[i] !== 1){
                if(this._switch_state[i]){
                    this._switch_state[i].state = false;
                }else{
                    var obj  = {
                        name:'',
                        state:false,
                    }
                    this._switch_state[i] = obj;
                }
            }
        }
    },

    findStateByName(name){
        for(var i in this._switch_state){
            if(this._switch_state[i].name == name){
                return this._switch_state[i].state;
            }
        }
    },

    refreshData(cbk) {
        cc.Linker('GetSwitchState').request(data => {
            this._data = data;
            cc.log('GetSwitchState   '+JSON.stringify(data));
            this.setData();
            cbk && cbk();
        }, cbk);
    },
})