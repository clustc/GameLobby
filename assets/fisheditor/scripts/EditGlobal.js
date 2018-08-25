require('CCGlobal');
const FishName = [
    'fish_xiaoguangyu',
    'fish_cheqiyu',
    'fish_fangyu',
    'fish_hetun',
    'fish_wuzei',
    'fish_xiaochouyu',
    'fish_shuimu',
    'fish_haigui',
    'fish_hudieyu',
    'fish_dinianyu',
    'fish_denglongyu',
    'fish_jianyu',
    'fish_beikeyu',
    'fish_bianyu',
    'fish_moguiyu',
    'fish_shayu',
    'fish_daheisha',
    'fish_jinjianyu',
    'fish_jinbeikeyu',
    'fish_yinshayu',
    'fish_jinbianyu',
    'fish_jinmoguiyu',
    'fish_jinshayu',
    'fish_jinshuimu',
    'fish_leiyinlong',
    'fish_jinhaigui',
    'fish_jinhama',
    'fish_xiaosanyuan',
    'fish_xiaosiyuan',
    'fish_zhuanpanyu1',
    'fish_zhuanpanyu2',
    'fish_zhangyuhaiguai',
    'fish_huangjinzhangyu',
    'fish_haidaochuan',
    'fish_shenhaijulong',
    'fish_yuangujulong',
    'fish_qilinjushou',
    'fish_sunwukong',
    'fish_dianman',
    'fish_laohujiyu',
]
const globals = {

    FISH_TYPES: ['NORMAL', 'AWARD', 'SPECIAL', 'BOSS'],
    FISH_TYPES_TEXT: ['普通', '奖金', '特殊', 'BOSS'],
    
    FISH_STANDS: [false, true],
    FISH_STANDS_TEXT: ['旋转', '不旋转'],
    
    FISH_DEATHS: ['S', 'M', 'L', 'C'],
    FISH_DEATHS_TEXT: ['快速游动', '旋转半圈', '放大快速旋转', '特殊自定义'],
}

module.exports = () => {
    ff = globals;
    ff.PointsToCurve = PointsToCurve;
    ff.CurveToPoints = CurveToPoints;
    ff.GetMoveLongness = GetMoveLongness;
    ff.GetMoveDuration = GetMoveDuration;
    ff.EditStorage = require('EditStorage');
    cc.Transfer = { show(){}, hide(){} };
    // TransformFishInfo();
    // ShortPathData();
}

const GetMoveLongness = data => {
    var longness = 0;
    var lengths = data.lengths;
    for(var i in lengths) longness += lengths[i];
    return longness;
}

const GetMoveDuration = data => {
    return GetMoveLongness(data) / data.velocity;
}

const PointsToCurve = (data) => {
    /**
     * pointxs:[]
     * pointys:[]
     * lengths:[]
     * velocity:0
     */
    const BaseBezier = require('BaseBezier');
    var ps = data.points;
    delete data.points;
    var pointxs = [];
    var pointys = [];
    var lengths = [];
    var addPs = (p0, p1, p2) => {
        pointxs.push(p0.x);
        pointxs.push(p1.x);
        pointxs.push(p2.x);
        pointys.push(p0.y);
        pointys.push(p1.y);
        pointys.push(p2.y);
        lengths.push(new BaseBezier(
            p0.x, p0.y,
            p1.x, p1.y,
            p2.x, p2.y
        ).getLength());
    }

    if(ps.length == 3) {
        addPs(ps[0], ps[1], ps[2]);
    } else {
        var p0, p1, p2;
        for (var i = 1; i < ps.length - 1; i++) {
            if (i == 1) {
                p0 = cc.p(ps[0].x, ps[0].y);
                p1 = cc.p(ps[1].x, ps[1].y);
                p2 = cc.p(Math.decimal((ps[2].x + p1.x) / 2, 4), Math.decimal((ps[2].y + p1.y) / 2, 4));
            } else if (i == ps.length - 2) {
                p0 = p2;
                p1 = cc.p(ps[i].x, ps[i].y);
                p2 = cc.p(ps[i + 1].x, ps[i + 1].y);
            } else {
                p0 = p2;
                p1 = cc.p(ps[i].x, ps[i].y);
                p2 = cc.p(Math.decimal((ps[i + 1].x + p1.x) / 2, 4), Math.decimal((ps[i + 1].y + p1.y) / 2, 4));
            }
            addPs(p0, p1, p2);
        }
    }
    data.pointxs = pointxs;
    data.pointys = pointys;
    data.lengths = lengths;
    return data;
}    
/**
* points:[]
* velocity:0
*/
const CurveToPoints = data => {
    var points = [];
    var lengths = data.lengths;
    var pointxs = data.pointxs;
    var pointys = data.pointys;
    delete data.lengths;
    delete data.pointxs;
    delete data.pointys;
    if(pointxs.length == 3) {
        data.points = [
            cc.p(pointxs[0], pointys[0]),
            cc.p(pointxs[1], pointys[1]),
            cc.p(pointxs[2], pointys[2])
        ];
        return data;
    }
    for (var i = 0; i < lengths.length; i++) {
        var ii = i * 3;
        if (i == 0) {
            points.push(cc.p(pointxs[0], pointys[0]));
            points.push(cc.p(pointxs[1], pointys[1]));
        } else if (i == lengths.length - 1) {
            points.push(cc.p(pointxs[ii + 1], pointys[ii + 1]));
            points.push(cc.p(pointxs[ii + 2], pointys[ii + 2]));
        } else {
            points.push(cc.p(pointxs[ii + 1], pointys[ii + 1]));
        }
    }
    data.points = points;
    return data;
}

const TransformFishInfo = () => {
    var data = ff.EditStorage.getStorageData('FishInfo');
    var fishInfos = {};
    for(var name in data) {
        var info = data[name];
        if(FishName.indexOf(name) >= 0) {
            fishInfos[name] = {
                name: name,
                type: info.type,
                stand: info.stand,
                death: info.death,
            }
        } else {
            var team = info.team;
            var group = {
                index: [0, team.length]
            };
            if(team[0].offset) {
                group.offsets = [];
                for(var ii in team) group.offsets.push(team[ii].offset);
            }
            if(team[0].delay !== undefined) {
                group.delay = Math.abs(team[1].delay - team[0].delay);
            }
            fishInfos[team[0].name] = {
                name: team[0].name,
                type: info.type,
                stand: info.stand,
                death: info.death,
            }
            fishInfos[name] = {
                name: team[0].name,
                group: group
            }
        }
    }
    ff.EditStorage.setStorageData('FishInfo', fishInfos);
}


const ShortShoalData = function() {
    var pathdata = window.localStorage.getItem('shoaldata');
    if (!pathdata) return;
    pathdata = JSON.parse(pathdata);

    var short = array => {
        for(var i in array) array[i] = Math.decimal(array[i], 4);
    }

    for(var s in pathdata) {
        var shoal = pathdata[s];
        for(var i in shoal) {
            var path = shoal[i].path;
            short(path.pointxs);
            short(path.pointys);
            short(path.lengths);
        }
    }
    window.localStorage.setItem('shoaldata-new', JSON.stringify(pathdata));
}

const ShortPathData = function() {
    var pathdata = window.localStorage.getItem('pathdata');
    if (!pathdata) return;

    pathdata = JSON.parse(pathdata);

    var short = array => {
        for(var i in array) array[i] = Math.decimal(array[i], 4);
    }

    for(var s in pathdata) {
        var path = pathdata[s];
        for(var i in path) {
            var p = path[i];
            short(p.pointxs);
            short(p.pointys);
            short(p.lengths);
        }
    }
    
    window.localStorage.setItem('pathdata-new', JSON.stringify(pathdata));
}



