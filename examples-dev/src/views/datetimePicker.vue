<template>

<grid>
    <p>{{ myDate1 | formatDate 'yyyy年MM月dd日,星期D hh:mm' }}</p>
    <ul class="am-avg-sm-1 am-avg-md-3 am-margin am-padding am-text-center admin-content-list ">
        <li>
            <hdp-date-time-picker v-bind:date-time.sync="myDate1"></hdp-date-time-picker>
        </li>
        <li>
            <hdp-date-time-picker v-bind:date-time.sync="myDate1" v-bind:show-time-picker="false"></hdp-date-time-picker>
        </li>

        <li>
            <hdp-date-time-picker v-bind:date-time.sync="myDate1" v-bind:show-date-picker="false"></hdp-date-time-picker>
        </li>
    </ul>
    


    <hdp-date-time-input v-bind:date-time.sync="myDate2"></hdp-date-time-input>


    <hdp-date-time-input v-bind:date-time.sync="myDate2" date-only></hdp-date-time-input>


    <hdp-date-time-input v-bind:date-time.sync="myDate2" time-only></hdp-date-time-input>
    
</grid>

</template>

<script>

export default {

    data() {
        return {
            myDate1: new Date('2010-1-3 4:5:6'),
            myDateMin1: '2010-1-1 4:5:6',
            myDateMax1: '2010-1-20 4:5:6',
            myDate2: '2015-12-12 13:14',
            myDateMin2: '2015-12-1 13:14:15',
            myDateMax2: '2015-12-30 13:14:15'
        };
    },

    filters: {
        formatDate(_date, format) {
            // if (typeof date !== 'string' || typeof date !== 'number') {
            //   return _date;
            // }
            // var _date = new Date(_date);
            if (isNaN(_date.getTime())) {
                return '';
            }

            var map = {
                    "M": _date.getMonth() + 1
                , "d": _date.getDate()
                , "h": _date.getHours()
                , "m": _date.getMinutes()
                , "s": _date.getSeconds()
            };

            format = format.replace(/([yMdDhms])+/g, function(all, t) {
                var v = map[t];
                if(v !== undefined){
                    if(all.length > 1){
                        v = '0' + v;
                        v = v.substr(v.length - 2);
                    }
                    return v;
                } else if(t === 'y') {
                    return (_date.getFullYear() + '').substr(4 - all.length);
                } else if (t === 'D') {
                    return ['日', '一', '二', '三', '四', '五', '六'][_date.getDay()];
                }
                return all;
            });

            return format;
        }
    },

    methods: {
        myDateChange1(changedDate) {
            console.log(changedDate);
        },

        myDateChange2(changedDate) {
            console.log(changedDate);
        }
    }

};

</script>
