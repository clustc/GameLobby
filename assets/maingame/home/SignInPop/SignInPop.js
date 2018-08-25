cc.Class({
    extends: cc.Component,

    properties: {
        lbl_total_num: cc.Label,
        btn_lingqu: cc.Node,
        btn_lingqu_over: cc.Node,
        pro_num: cc.ProgressBar,

        node_total_item_arr: [cc.Node],
        node_item_arr: [cc.Node],

        name_frames: [cc.SpriteFrame],
        node_bg_frames: [cc.SpriteFrame],
        node_title_frames: [cc.SpriteFrame],
        day_icon_frames: [cc.SpriteFrame],
        total_icon_frames: [cc.SpriteFrame],
    },

    onLoad() {
        this.AccumulatedInfo = {}; //累计签到信息
        this.DaySignInfo = {}; //每日签到信息
        this.SignConfigs = {}; //奖品配置信息

        this.isSign = false;

        // this.scheduleOnce(this.GetInfo, 0.5);
        this.GetInfo();
    },

    start() {
    },

    GetInfo() {
        var data = ff.AccountManager.signConfig.data;
        if (!data) {
            ff.AccountManager.signConfig.refreshData((msg) => {
                data = msg;
                this.isSigned = ff.AccountManager.signConfig.isTodaySigned();
            })
        } else {
            this.isSigned = ff.AccountManager.signConfig.isTodaySigned();
        }

        this.AccumulatedInfo = data.fishAccumulatedInfo;
        this.DaySignInfo = data.fishDaySignInfo;
        this.SignConfigs = data.signConfigs;
        this.FreshPage();
    },

    FreshPage(flag) {
        this.FreshDaySignNode();
        this.FreshTotalSignNode();
        this.FreshBtnIcon(flag);
    },

    FreshBtnIcon(flag) {
        if (!flag) flag = this.isSigned;
        else flag = flag === 'false' ? false : true;

        if (flag) {
            this.btn_lingqu.active = true;
            this.btn_lingqu_over.active = false;
        } else {
            this.btn_lingqu.active = false;
            this.btn_lingqu_over.active = true;
        }
    },

    //判断指定日期是否与今天日期相同
    JudgeIsToday(index) {
        var result = false;

        var now_date = new Date();
        var now_day = now_date.getDay();

        if (index === 6) {
            result = now_day === 0;
        } else {
            result = (now_day - 1) === index;
        }

        return result;
    },

    FreshDaySignNode() {
        for (let index = 0; index < this.node_item_arr.length; index++) {
            const item = this.node_item_arr[index];
            var isToday = this.JudgeIsToday(index);

            var config = this.GetAwardConfigByTypeAndFlag(1, index + 1);
            var info_sign = this.GetDaySignInfo(index + 1);

            //底图
            var spt_node_bg = item.find('spt_node_bg').getComponent(cc.Sprite);
            spt_node_bg.spriteFrame = info_sign || isToday ? this.node_bg_frames[1] : this.node_bg_frames[0];

            //title
            var spt_node_title = item.find('spt_node_title').getComponent(cc.Sprite);
            var tmp_index = index * 2;
            spt_node_title.spriteFrame = info_sign || isToday ? this.node_title_frames[tmp_index] : this.node_title_frames[tmp_index + 1];

            //中间Icon图片
            var spt_icon = item.find('spt_icon').getComponent(cc.Sprite);
            spt_icon.spriteFrame = config.propInfos.length === 1 ? this.day_icon_frames[0] : this.day_icon_frames[1];
            spt_icon.node.width = config.propInfos.length === 1 ? 66 : 98;
            spt_icon.node.height = config.propInfos.length === 1 ? 69 : 67;

            //奖品描述
            for (let index = 1; index < 3; index++) {
                var node = item.find('node_desp/node_name_' + index);
                node.active = false;
            }

            for (let index = 1; index < config.propInfos.length + 1; index++) {
                const element = config.propInfos[index - 1];

                var node = item.find('node_desp/node_name_' + index);
                var spt = node.find('lbl_name').getComponent(cc.Sprite);
                var lbl = node.find('lbl_num').getComponent(cc.Label);
                var lbl_flag = node.find('lbl_num_flag').getComponent(cc.Label);
                node.active = true;

                if (info_sign || isToday) {
                    spt.spriteFrame = element.propId === 1 ? this.name_frames[3] : this.name_frames[1];
                    lbl.node.active = false;
                    lbl_flag.node.active = true;
                    lbl_flag.string = ":" + element.propNum;
                } else {
                    spt.spriteFrame = element.propId === 1 ? this.name_frames[2] : this.name_frames[0];
                    lbl.node.active = true;
                    lbl_flag.node.active = false;
                    lbl.string = ":" + element.propNum;
                }
            }

            //领取标志

            var node_mask = item.find('node_mask');
            node_mask.active = info_sign;

        }
    },

    FreshTotalSignNode() {
        this.lbl_total_num.string = "累计签到" + this.AccumulatedInfo.signTime + "天";

        //进度条
        this.pro_num.progress = Number(this.AccumulatedInfo.signTime) / 15;

        //刷新物品
        for (let index = 0; index < 4; index++) {
            var tmp_arr = [3, 6, 9, 15];

            const item = this.node_total_item_arr[index];

            var config = this.GetAwardConfigByTypeAndFlag(2, tmp_arr[index]);
            var info_sign = this.GetTotalSignInfo(tmp_arr[index]);
            //刷新底图
            var spt_total_icon = item.find('spt_total_icon').getComponent(cc.Sprite);
            switch (config.propInfos[0].propId) {
                case 1://钻石
                    spt_total_icon.spriteFrame = this.total_icon_frames[1];
                    break;
                case 2://金币
                    spt_total_icon.spriteFrame = this.total_icon_frames[0];
                    break;
                case 3:
                    spt_total_icon.spriteFrame = this.total_icon_frames[2];
                    break;
                default:
                    break;
            }

            //刷新数量
            var lbl_total_num = item.find('lbl_total_num').getComponent(cc.Label);
            lbl_total_num.string = ":" + config.propInfos[0].propNum;

            //刷新可领取特效
            var light_anim = item.find('light_anim');
            light_anim.active = !info_sign && Number(this.AccumulatedInfo.signTime) >= tmp_arr[index];
            // light_anim.getComponent(cc.Animation).play();

            //刷新领取标志
            var spt_total_flag = item.find('spt_total_flag');
            spt_total_flag.active = info_sign;

        }
    },

    GetAwardConfigByTypeAndFlag(type, flag) {
        var result = {};
        for (let index = 0; index < this.SignConfigs.length; index++) {
            const element = this.SignConfigs[index];
            if (Number(type) === Number(element.signType) && Number(flag) === Number(element.signCondition)) {
                result = element;
            }
        }

        return result;
    },

    GetDaySignInfo(flag) {
        var result = false;

        var draw_arr = this.DaySignInfo.signInfo.split(",");

        for (let index = 0; index < draw_arr.length; index++) {
            const element = draw_arr[index];
            if (Number(flag) === Number(element)) {
                result = true;
            }
        }

        return result;
    },

    GetTotalSignInfo(flag) {
        var result = false;

        var draw_arr = this.AccumulatedInfo.drawStatus.split(",");

        for (let index = 0; index < draw_arr.length; index++) {
            const element = draw_arr[index];
            if (Number(element) === Number(flag)) {
                result = true;
            }
        }

        return result;
    },

    onClickBtnDayLQ(event) {
        /**首页-每周签到-签到 */
        ff.BuryingPoint(3401110101);
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        cc.Linker('GetDaySignAward').request((data) => {
            this.isSign = true;
            this.AccumulatedInfo = data.fishAccumulatedInfo;
            this.DaySignInfo = data.fishDaySignInfo;
            this.FreshPage('false');

            var config = this.GetAwardConfigByTypeAndFlag(1, data.signDay);
            var item_data = config.propInfos;

            var param = [];
            for (let index = 0; index < item_data.length; index++) {
                const element = item_data[index];
                param.push({ propId: element.propId, propNumAdd: element.propNum });
            }
            ff.PopupManager.showAwardTips(param, () => {
                btn.interactable = true;
            });
        }, (error, code) => {
            btn.interactable = true;
        });
    },

    onClickBtnTotalLQ(event, param) {
        /**首页-每周签到-领取累计签到 */
        ff.BuryingPoint(3401110102);
        var num = Number(param);
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        cc.Linker('GetTotalSignAward', {
            accumulatedTime: num,
        }).request((data) => {
            this.isSign = true;
            this.AccumulatedInfo = data.fishAccumulatedInfo;
            this.FreshTotalSignNode();
            var config = this.GetAwardConfigByTypeAndFlag(2, data.accumulatedTime);
            var param = [];
            var item_data = config.propInfos;
            for (let index = 0; index < item_data.length; index++) {
                const element = item_data[index];
                param.push({ propId: element.propId, propNumAdd: element.propNum });
            }
            ff.PopupManager.showAwardTips(param, () => {
                btn.interactable = true;
            });
        }, (error, code) => {
            btn.interactable = true;
        });
    },

    onClosePop() {
        this.node.emit('close', this.isSign);
    },
});
