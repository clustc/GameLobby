const Global = require('CCGlobal');
const HTTPURL = Global.HTTPURL;

module.exports = {
    GetWebSocketUrl: HTTPURL.gameUrl + '/app/fish/api/config/query',                                        //获取长连接地址
    GetUserStatus: HTTPURL.gameUrl + '/app/fish/api/get/status',                                            //获取用户信息
    GetPropsList: HTTPURL.gameUrl + '/app/fish/api/prop/lists',                                             //获取道具列表信息
    CannonUpgradeConfig: HTTPURL.gameUrl + '/app/fish/api/battery/config',                                  //获取炮台升级配置
    CannonUpgradeLevel: HTTPURL.gameUrl + '/app/fish/api/battery/deblocking',                               //解锁炮台等级
    CannonSkinConfig: HTTPURL.gameUrl + '/app/fish/api/battery/cannonConfig',                               //炮台皮肤配置
    GetHorseLamp: HTTPURL.gameUrl + '/app/fish/api/board-messages/query',                                   //获取跑马灯数据
    SendHorseLamp: HTTPURL.gameUrl + '/app/fish/api/board-messages/new',                                    //用户发送跑马灯
    GetFishConfig: HTTPURL.gameUrl + '/app/fish/api/config/fish',                                           //获取鱼配置
    HitGuideFish: HTTPURL.gameUrl + '/app/fish/api/luckyDraw/beginnerKill',                                 //新手引导鱼

    BuryingPoint: HTTPURL.dataUrl + '/data/api/burying/point',                                              //游戏埋点
    HttpHeartBeat: HTTPURL.gameUrl + '/app/fish/api/get/heartBeat',                                         //短链接心跳
    UserPreference: HTTPURL.gameUrl + '/app/fish/api/get/saveData',                                         //用户数据存储
    HotUpdate: HTTPURL.gameUrl + '/app/fish/api/get/hotUpdateAddress',                                      //热更新地址 
    EnableAutoFire: HTTPURL.gameUrl + '/app/fish/api/get/autoFire',                                         //是否支持自动开炮

    GetEmail: HTTPURL.gameUrl + '/app/fish/api/mail/query',                                                 //邮件数据请求
    GetIgnoreMail: HTTPURL.gameUrl + '/app/fish/api/mail/ignore',                                           //屏蔽邮件
    GetAttachment: HTTPURL.gameUrl + '/app/fish/api/mail/attachment',                                       //领取邮件附件
    SetMailReaded: HTTPURL.gameUrl + '/app/fish/api/mail/read',                                             //设置已读
    GetUnReadTypes: HTTPURL.gameUrl + '/app/fish/api/mail/unReadTypes',                                     //查询未读大类型

    GetTask: HTTPURL.gameUrl + '/app/fish/api/task/getTask',                                                //任务
    GetNewbieTask: HTTPURL.gameUrl + '/app/fish/api/task/getCurNewUserTask',                                //新手任务
    GetTaskAward: HTTPURL.gameUrl + '/app/fish/api/task/convertTaskAward',                                  //任务领取

    GetFreeDrawLists: HTTPURL.gameUrl + '/app/fish/api/luckyDraw/lists',                                    //获取免费抽奖奖励配置
    GetDrawCondition: HTTPURL.gameUrl + '/app/fish/api/luckyDraw/condition',                                //获取免费抽奖用户当前实时数据
    GetDrawReward: HTTPURL.gameUrl + '/app/fish/api/luckyDraw/reward',                                      //免费抽奖用户领奖

    GetSelectRoomConfig: HTTPURL.gameUrl + '/app/fish/api/aren/query',                                      //自选房间配置

    GetUserRechargeAmount: HTTPURL.platformUrl + '/platform/api/trans/rechargeAmount',                      //用户充值总数
    GetShopConfigList: HTTPURL.platformUrl + '/platform/api/mall/list',                                     //商城配置列表
    CreateOrder: HTTPURL.platformUrl + '/platform/api/trans/order/create',                                  //创建订单
    CheckOrderState: HTTPURL.platformUrl + '/platform/api/trans/order/info',                                //查询订单状态(老)
    CheckOrderStateNew: HTTPURL.platformUrl + '/platform/api/trans/order/queryOrder',                       //查询订单状态(新)
    RechargeAmount: HTTPURL.platformUrl + '/platform/api/trans/rechargeAmount',                             //查询充值总数


    GetRankList: HTTPURL.gameUrl + '/app/fish/api/get/rank',                                                //查询名人榜
    GetUserSign: HTTPURL.gameUrl + '/app/fish/api/get/sign',                                                //查看签名
    EditUserSign: HTTPURL.gameUrl + '/app/fish/api/get/editSign',                                           //编辑签名
    SendEmail: HTTPURL.gameUrl + '/app/fish/api/mail/send',                                                 //发送留言

    GetFirstCharge: HTTPURL.platformUrl + '/platform/api/mall/firstRecharge',                               //首充特惠
    GetVipAward: HTTPURL.platformUrl + '/platform/api/mall/vip',                                            //贵族礼包

    GetVipConfig: HTTPURL.gameUrl + '/app/fish/api/vip/config',                                             //vip特权配置
    GetVipDrawConfig: HTTPURL.gameUrl + '/app/fish/api/vip/drawConfig',                                     //vip抽奖配置
    GetVipDraw: HTTPURL.gameUrl + '/app/fish/api/vip/draw',                                                 //vip抽奖

    GetSailPackage: HTTPURL.gameUrl + '/app/fish/api/gift/beginnerAward',                                   //起航礼包

    GetTomorrowGift: HTTPURL.gameUrl + '/app/fish/api/gift/continuousLoginShow',                            //明日礼包
    GetTomorrowDraw: HTTPURL.gameUrl + '/app/fish/api/gift/continuousLoginAward',                           //明日礼包抽奖

    CanReliveCoins: HTTPURL.gameUrl + '/app/fish/api/revivingFund/canRevive',                               //复活基金是否可领取
    GetReliveCoins: HTTPURL.gameUrl + '/app/fish/api/revivingFund/revive',                                  //复活基金 

    GetExchangeList: HTTPURL.platformUrl + '/platform/api/mall/exchange',                                   //限时兑换
    GetMineBagList: HTTPURL.platformUrl + '/platform/api/trans/fragment/bagMe',                             //我的碎片
    GetSynthesisList: HTTPURL.platformUrl + '/platform/api/trans/fragment/convertAllList',                  //合成列表
    GetSynthesis: HTTPURL.platformUrl + '/platform/api/trans/fragment/combineAwards',                       //合成
    GetSynthesisRecord: HTTPURL.platformUrl + '/platform/api/welfareBag/awardsFragmentList',                //合成记录
    GetExchangeRecord: HTTPURL.platformUrl + '/platform/api/welfareBag/awardsTranceList',                   //兑换记录
    GetRecordAward: HTTPURL.platformUrl + '/platform/api/welfareBag/awardsListByAppNew',                    //获奖记录
    GetReceiveAward: HTTPURL.platformUrl + '/platform/api/welfareBag/drawAwardsByApp',                      //领取奖励

    GetSignInInfo: HTTPURL.gameUrl + '/app/fish/api/sign/info',                                             //获取签到信息
    GetDaySignAward: HTTPURL.gameUrl + '/app/fish/api/sign/signIn',                                         //领取每日签到
    GetTotalSignAward: HTTPURL.gameUrl + '/app/fish/api/sign/drawAccumulated',                              //领取累计签到

    GetSwitchState: HTTPURL.gameUrl + '/app/fish/api/function_switch/find',                                 //获取功能点开关

    GetResortList: HTTPURL.gameUrl + '/app/fish/api/miniGames/list',                                        //娱乐场小游戏  列表

    GetAuditInit: HTTPURL.platformUrl + '/platform/api/audit/init',                                         //app的审核状态

    GetRoomMail: HTTPURL.platformUrl + '/platform/api/mall/room',                                           //获取房间礼包






    
    VisitorLogin:  HTTPURL.platformUrl + "/uic/api/user/login/visitor",                               //游客登录
    GamePhoneLogin:  HTTPURL.platformUrl + "/uic/api/user/login/requestToken",                           //手机账号登录
    AccessToken:    HTTPURL.platformUrl + "/uic/api/user/login/accessToken",                           //获取accesstoken                
    SmsRegisterVerifyCode:  HTTPURL.platformUrl + "/uic/api/user/register/sendCode",                 //注册获取验证码
    SmsForgetVerifyCode:  HTTPURL.platformUrl + "/uic/api/user/password/sendForgetCode",             //忘记密码获取验证码
    RegisterAccount:    HTTPURL.platformUrl + "/uic/api/user/register/save",                         //注册账号
    ResetPassWord:   HTTPURL.platformUrl + "/uic/api/user/password/newPassword",                    //重制密码
    //捕鱼app新增接口
    SkinCannon : HTTPURL.gameUrl + '/app/fish/api/get/skinCannon',                                 //获取皮肤炮接口
    TotalBetAmount : HTTPURL.gameUrl + '/app/fish/api/get/bettotalamount',                        //获取投注总流水


    //大厅相关接口
    UicPersonalInfo : HTTPURL.platformUrl + '/uic/api/user/center/getPersonalInfo',                        //用户信息
    GameList  : HTTPURL.platformUrl + '/app/api/index/gamesCity',                                     //游戏列表初始
    SendGift  :  HTTPURL.platformUrl + "/trans/api/givelog/giveleaf",                                      //赠送金叶子
    SendGiftRecord :HTTPURL.platformUrl + "/trans/api/givelog/getgivehistorylist",                         //赠送记录
    GetGiftRecord : HTTPURL.platformUrl + "/trans/api/givelog/getreceivehistorylist",                      //接受记录
    PlatfromEmail:  HTTPURL.platformUrl + "/trans/api/givelog/getreceivelist",                             //平台邮件列表
    ReceiveGold  :  HTTPURL.platformUrl + "/trans/api/givelog/receiveleaf",                           //接受玩家赠送的列表
    ExchangeCode:   HTTPURL.platformUrl+"/trans/api/exchangelog/exchangeleaaf",
    SendGifConfig:  HTTPURL.platformUrl +'/trans/api/givelog/giveDesc',                               //赠送描述
    //检查是否可以游客登录
    CheckVisitor:  HTTPURL.platformUrl +'/uic/api/user/login/checkVisitor',                            //检测师傅哦可以热更
    //检查登录是否是游客状态
    IsVisitorStatus:  HTTPURL.platformUrl +'/uic/api/user/login/isVisitor',                        //当前登录是否是游客 
    //获取默认头像换地址
    DefaultHeaderFrame :  HTTPURL.platformUrl +'/uic/api/user/center/getHeadImgList', 
    //修改默认头像
    EditDefaultHeaderFrame:  HTTPURL.platformUrl +'/uic/api/user/center/chooseHeadImg', 
    //修改昵称
    FixUserName:   HTTPURL.platformUrl +'/uic/api/user/center/updateNickname', 
    //绑定手机验证码
    BindPhoneSmsCode:  HTTPURL.platformUrl +'/uic/api/user/center/sendPhoneBindCode', 
    //绑定手机
    BindPhone :  HTTPURL.platformUrl +'/uic/api/user/center/phoneBind', 

    //商品列表
    ShopMall :  HTTPURL.platformUrl +'/trans/api/mall/list', 
}
