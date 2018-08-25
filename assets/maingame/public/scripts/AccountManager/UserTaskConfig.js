const tTaskType = {
    daily : 1,
    newbie : 2,
    active : 3,
};

cc.Class({
    properties: {
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    ctor() {
        this.InitData()
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    refreshData(cbk,isLoading) {
        isLoading = isLoading == 'isLoading' || false;
        // cc.Linker('GetTask').showLoading(isLoading).request(data => {
        //     this.ComboData(data)
        //     cbk && cbk();
        // });
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    InitData() {
        this._data = {};
        this._data.taskLogs = [];

        for (var k in tTaskType) {
            this._data[k] = [];
        }
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    ComboData(data) {
        this.InitData();

        var tasks = data.tasks;
        for (var i in tasks) {
            var singleTask = tasks[i];
            var taskType = singleTask.taskType;

            for (var k in tTaskType) {
                if (taskType === tTaskType[k]) {
                    this._data[k].push(singleTask);
                }
            }
        }

        this._data.taskLogs = data.taskLogs;
         
        this._data.daily = this._data.daily.sort((a,b) => {
            var sa = this.GetTaskLogById(a.taskId).taskStatus || 0;
            var sb = this.GetTaskLogById(b.taskId).taskStatus || 0;
            var weight = [1,2,0,3];
            return weight[sa] - weight[sb];
        });

        this._data.active = this._data.active.sort((a,b) => {
            return a.taskCompletedCondition - b.taskCompletedCondition;
        });
        
        this._data.dayVitality = data.dayVitality;
        this._data.weekVitality = data.weekVitality;
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    GetTaskLogById(id) {
        for (var i in this._data.taskLogs) {
            var singleLog = this._data.taskLogs[i];
            if (id === singleLog.taskId) {
                return singleLog
            }
        }

        return {};
    },

    GetNewbieTaskById(id){
        for (var i in this._data.newbie) {
            var singleLog = this._data.newbie[i];
            if (id === singleLog.taskId) {
                return singleLog
            }
        }

        return {};
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    GetDataByType(type) {
        for (var k in tTaskType) {
            if (type === tTaskType[k]) {
                return this._data[k];
            }
        }

        return null;
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    GetDataByTypeAndDateType(type,dateType) {
        var data = this.GetDataByType(type);
        if (!data) { return null; }

        var ret = [];
        for (var i = 0; i < data.length; i++) {
            var singleData = data[i];
            if (dateType === singleData.dateType){
                ret.push(singleData);
            }
        }
        return ret;
    },

    /*====================================================================================================
    /
    /====================================================================================================*/
    GetVitalityByType(type) {
        if (type === 1) {
            return this._data.dayVitality;
        }else if (type === 2) {
            return this._data.weekVitality;
        }
        
        return null;
    },

    GetTaskInfoByTaskId(taskId){
        for (var k in tTaskType) {
            var data = this.GetDataByType(tTaskType[k]);
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (taskId === element.taskId){
                    return element;
                }
            }
        }

        return null;
    },

});
