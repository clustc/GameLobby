cc.Class({
    properties: {
        data: {
            get() {
                return this._data;
            }
        },
    },
    
    refreshData(cbk) {
        // cc.Linker('GetSignInInfo').request((data) => {
        //     this._data = data;
        //     cbk && cbk(data);
        // });
    },

    isTodaySigned() {
        if(!this._data) return;
        var date = new Date();
        var day = date.getDay();
        day = day === 0 ? 7 : day;

        var result = false;
        if(!this._data.fishDaySignInfo.signInfo) return !result;
        var draw_arr = this._data.fishDaySignInfo.signInfo.split(",");

        for (let index = 0; index < draw_arr.length; index++) {
            const element = draw_arr[index];
            if (Number(day) === Number(element)) {
                result = true;
            }
        }

        return !result;
    },
});
