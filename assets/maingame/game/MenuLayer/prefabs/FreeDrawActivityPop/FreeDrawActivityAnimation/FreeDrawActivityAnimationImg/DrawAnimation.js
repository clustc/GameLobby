cc.Class({
    extends: require('PoolLayer'),

    properties: {
        mainFrame: cc.SpriteFrame,

        redFrame: cc.Node,
        countDown: cc.Node,
        countDownNumber: cc.Label,

        itemNode: cc.Prefab,
        drawButton: cc.Button,

        drawFinishAnim: cc.Prefab,
        drawChooseAnim: cc.Prefab,

        RibbonsAnim: cc.Node,
    },

    onLoad() {
        this.configData = null;
        this.chooseData = null;
        this.isOpenBrand = false;
        //抽奖动画背景红框开始时隐藏
        this.redFrame.active = false;
        //定时器开始不显示
        this.countDown.active = false;
        this.allNode = [];
        this.dataArr = [];
        this.anim = this.node.getComponent(cc.Animation);
    },

    createObject(type) {
        var object = null;
        if (type === 'awardItem') {
            object = cc.instantiate(this.itemNode);
        } else {
            object = cc.instantiate(this.drawFinishAnim);
        }
        return object;
    },

    resetObject(object, type) {
        object.parent = null;
    },


    //初始化数据
    initAnim(data) {
        this.configData = data;
        for (var i = 0; i < 6; i++) {
            var node;
            if (i == 0) node = this.node.getChildByName('Apai')
            else node = this.node.getChildByName('Apai' + (i + 1));
            this.allNode.push(node);
        }
        this.licensingAnim();
    },

    reDrawAnim() {
        //清除动画结束监听
        this.anim.off('finished');
        for (var i = 0; i < this.allNode.length; i++) {
            this.allNode[i].off('touchstart')
            this.reclaim(this.allNode[i].children[0], 'awardItem');
        }
        //清除数组
        this.dataArr.length = 0;
        //清除定时器
        this.cleanCountDown();
        //清除背景动画
        this.reclaim(this.node.getChildByName('DrawFinishAnimation'), 'DrawFinishAnimation');
        //背景红框显示
        this.redFrame.active = true;
        //开始抽奖按钮隐藏
        this.drawButton.node.active = true;
        this.licensingAnim();
        this.anim.play('DongHua');
    },

    //发牌动画
    licensingAnim() {
        //将各个牌节点保存,并设置数据
        for (var i = 0; i < this.allNode.length; i++) {
            var item = this.produce('awardItem');
            item.active = true;
            item.x = item.y = 0;
            item.getComponent('FreeDrawAwardItem').initItem(this.configData.props[i]);
            item.parent = this.allNode[i];
        }
        this.anim.on('finished', () => {
            this.anim.off('finished');
            this.drawButton.node.active = true;
            this.countDownFuc(15, () => this.showShuffle());
        }, this)
    },

    //倒计时
    countDownFuc(interval, cbk) {
        //初始化倒计时
        var interval = interval || 15;
        this.countDown.active = true;
        this.countDownNumber.string = interval;
        //倒计时定时器执行方法
        this.countDownCallBack = function () {
            interval--;
            this.countDownNumber.string = interval;
            if (interval <= 0) {
                //清除定时器
                this.cleanCountDown();
                cbk && cbk();
            }
        }
        //启动计时器
        this.schedule(this.countDownCallBack, 1)
    },

    cleanCountDown() {
        this.unschedule(this.countDownCallBack);
        this.countDown.active = false;
    },

    //洗牌动画
    showShuffle() {
        //清除定时器
        this.cleanCountDown();
        //背景红框显示
        this.redFrame.active = true;
        //开始抽奖按钮隐藏
        this.drawButton.node.active = false;
        //播放洗牌动画
        this.anim.play('DongHua2');
        //洗牌动画结束监听
        this.anim.on('finished', () => {
            this.scheduleOnce(() => {
                //播放洗牌结束后的背光效果
                var anim = this.produce('DrawFinishAnimation');
                anim.getComponent(cc.Animation).play('donghua3', 1);
                anim.zIndex = -30;
                anim.parent = this.node;
                for (var i = 0; i < this.allNode.length; i++) {
                    this.allNode[i].on('touchstart', this.onClickBrand, this);
                }
                this.countDownFuc(15, () => {
                    this.allNode[Math.rand(0, this.allNode.length - 1)].emit('touchstart');
                });
            }, 0.1);
        }, this)
    },

    onClickBrand(event) {
        if (this.isOpenBrand) return;
        this.isOpenBrand = true;
        var target = event.target;
        cc.Linker('GetDrawReward', { type: this.configData.type }).request((data) => {
            this.chooseData = data.award;
            this.dataArr.length = 0;
            this.dataArr = this.configData.props.concat();
            for (var i = 0; i < this.dataArr.length; i++) {
                if (Number(this.dataArr[i].id) == Number(data.award.id) && Number(this.dataArr[i].count) == Number(data.award.count)) {
                    this.dataArr.splice(i, 1);
                    break;
                }
            }
            Math.shuffle(this.dataArr);
            this.openBrand(target);
            // if (this.configData.type === 0) ff.AccountManager.shopConfig.refreshFreeDrawData(null, true);

            /**游戏-抽奖页面-获得抽奖奖励 */
            // ff.BuryingPoint(3402040003, {
            //     return_amount: this.chooseData.id == 2 ? this.chooseData.count : undefined,
            //     awards_id: this.chooseData.id,
            // });
        }, () => {
            ff.PopupManager.showDialogPop('当前网络环境不佳，是否重新抽奖', () => {
                this.isOpenBrand = false;
                this.reDrawAnim();
            }, () => {
                this.node.emit('close');
            })
        })
    },

    //开牌动画
    openBrand(target) {
        //清除定时器
        this.cleanCountDown();
        var node = target;
        //关闭洗牌结束后的背光效果
        var beiguangAnim = this.node.getChildByName('DrawFinishAnimation');
        beiguangAnim.destroy();
        //根据返回的数据，刷新所有卡牌
        node.children[0].getComponent('FreeDrawAwardItem').initItem(this.chooseData);
        for (var i = 0, j = 0; i < this.allNode.length; i++) {
            if (this.allNode[i] !== node) {
                this.allNode[i].children[0].getComponent('FreeDrawAwardItem').initItem(this.dataArr[j]);
                j++;
            }
            this.allNode[i].off('touchstart', this.openBrand, this);
        }
        //点击之后翻牌，以及其他牌翻牌
        this.openBrandAction(node, true);
        this.scheduleOnce(() => {
            for (var i = 0; i < this.allNode.length; i++) {
                if (this.allNode[i] !== node) this.openBrandAction(this.allNode[i], false);
            }
        }, 0.6);
        //翻牌之后动画
        this.scheduleOnce(() => {
            var position = ff.ControlManager.battery.getCannonPosition();
            if (!position) {
                this.node.emit('close');
                return;
            }
            node.runAction(cc.sequence(
                cc.spawn(
                    cc.rotateBy(0.8, 450),
                    cc.jumpTo(0.8, position, 400, 1),
                    cc.scaleTo(0.8, 0).easing(cc.easeQuinticActionIn())
                ),

                cc.callFunc(() => {
                    this.node.emit('close');
                })
            ));
        }, 1.4);
    },

    //翻牌动作
    openBrandAction(node, flag) {
        var item = node.children[0];
        node.runAction(cc.sequence(
            cc.callFunc(() => {
                if (!flag) {
                    item.children[item.children.length - 1].active = true;
                }
            }),
            cc.scaleTo(0.2, 0, 1),
            cc.callFunc(() => {
                item.active = true;
                node.getComponent(cc.Sprite).spriteFrame = this.mainFrame;
            }),
            cc.scaleTo(0.2, 1, 1),
            cc.callFunc(() => {
                if (flag) {
                    //如果是点击的牌，有特殊光效
                    var anim = cc.instantiate(this.drawChooseAnim);
                    anim.zIndex = -1;
                    anim.position = node.position;
                    anim.parent = this.node;
                    item.children[0].active = true;
                    node.zIndex = 999;
                    //彩带显示
                    this.RibbonsAnim.active = true;
                }
            })
        ))
    },

    //切换牌正反面
    switchBrand(flag) {
        for (var i = 0; i < this.allNode.length; i++) {
            this.allNode[i].children[0].active = flag;
        }
    },
});
