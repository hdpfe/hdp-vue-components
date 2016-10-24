<template>

<div class="am-datepicker-body">
    <days-picker
            v-bind:selected-date.sync="selectedDate"
            v-bind:view-date.sync="viewDate"
            v-show="show.days"
            @picker.viewchange="changshow">
    </days-picker>
    <months-picker
            v-bind:selected-date.sync="selectedDate"
            v-bind:view-date.sync="viewDate"
            v-show="show.months"
            @picker.viewchange="changshow">
        </months-picker>
    <years-picker
            v-bind:selected-date.sync="selectedDate"
            v-bind:view-date.sync="viewDate"
            v-show="show.years"
            @picker.viewchange="changshow">
    </years-picker>
</div>

</template>

<script>

import daysPicker from './dayspicker.vue';
import monthsPicker from './monthspicker.vue';
import yearsPicker from './yearspicker.vue';

export default {
    props: {
        selectedDate: {
            type: Date,
            twoWay: true,
            required: true
        }
    },

    components: {
        daysPicker,
        monthsPicker,
        yearsPicker
    },

    data() {
        var viewDate = new Date(this.selectedDate.valueOf());
        return {
            show: {
                days: true,
                months: false,
                years: false
            },
            viewDate: viewDate
        };
    },

    methods: {
        changshow (data) {
            this.show = data;
        }
    },

    events: {
        "view-change": function(show) {
            this.show = show;
        }
    }
};

</script>
