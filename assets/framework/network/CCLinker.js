const GameUrls = require('GameUrls');
const BaseHttpLink = require('BaseHttpLink');
const OnceHttpLink = require('OnceHttpLink');

cc.Linker = function (url, param) {
    if (url.indexOf('http') < 0) url = GameUrls[url];
    return new OnceHttpLink(url, param);
}

cc.BaseLinker = function (url, param) {
    if (url.indexOf('http') < 0) url = GameUrls[url];
    return new BaseHttpLink(url, param);
}

OnceHttpLink.success.use(function (data, next) {
    if (data) {
        data.props && ff.AccountManager.onPropsChange(data.props);
        data.propertyChange && ff.AccountManager.onPropertyChange(data.propertyChange);
    }
    next();
})


OnceHttpLink.failure.use(function (error, code, next) {
    if (code === 46) return;/**渠道关闭 */
    if (code === 47) return cc.Toast('尊敬的玩家大人：\n街机欢乐捕鱼正在升级维护中，全新的版本正在全力准备，敬请期待！').showDialog();/**熔断 */
    if (code === 2 || code === 401){
        cc.log('failure   OnceHttpLink   '+code );
        ff.AccountManager.emit('EVENT_USER_LOGOUT');
        return;
    }
    next();
})

cc.Linker.ErrorCode = {
    '1': '当前服务器拥挤,请稍后再玩',
    '2': '用户不存在',
    '3': '房间不存在',
    '4': '金币不足，进低倍场玩玩呗',
    '5': '房间人数已满',
    '6': '金币不足',
    '7': '钻石不足',
    '8': '鱼不存在',
    '9': '请先进入房间',
    '10': '炮台已是最大级',
    '11': '分数改变错误',
    '12': '鱼已死亡',
    '13': '道具不存在',
    '14': '道具不能使用',
    '15': '道具正在使用',
    '16': '排行榜页数超过排行',
    '17': 'vip抽奖次数已用完',
    '18': '请先进入游戏',
    '19': 'vip等级不足',
    '20': '任务未完成，无法领取奖励',
    '21': '任务奖励已领取',
    '22': '用户不存在',
    '23': '房间不存在',
    '24': '金币不足，进低倍场玩玩呗',
    '25': '房间人数已满',
    '26': '任务未完成，无法领取奖励',
    '27': '任务奖励已领取',
    '28': '任务不存在',
    '29': '活跃值不够，不能领取',
    '30': '任务奖励领取失败',
    '31': '杀死的奖金鱼数量不足',
    '32': '积分不足',
    '33': '奖励已领取',
    '34': '对方暂不接收消息',
    '35': '消息内容有误',
    '36': '无法操作',
    '37': '配置错误',
    '38': '操作不允许',
    '39': '领取奖励不存在',
    '40': '重复发送',
    '41': '操作过于频繁',
    '42': '复活基金次数已用完',
    '43': '加金币失败',
}