var pagination = require('./pagination/pagination.vue');
var modal = require('./modal/modal.vue');
var alert = require('./modal/alert.vue');
var confirm = require('./modal/confirm.vue');
var dialog = require('./modal/dialog.vue');
var typeAheadInterface = require('./typeahead/typeAheadInterface.vue');
var typeAheadText = require('./typeahead/typeAhead_text.vue');
var typeAheadObject = require('./typeahead/typeAhead_object.vue');
var taginput = require('./taginput/taginput.vue');
var dateTimePicker = require('./datetimepicker/datetimepicker.vue');
var dateTimeInput  = require('./datetimepicker/datetimeinput.vue');

var components = {
    hdpPagination: pagination,
    hdpModal: modal,
    hdpAlert: alert,
    hdpConfirm: confirm,
    hdpDialog: dialog,
    hdpTaText: typeAheadText,
    hdpTaObject: typeAheadObject,
    hdpTaginput: taginput,
    hdpDateTimePicker: dateTimePicker,
    hdpDateTimeInput: dateTimeInput
};

module.exports = Object.assign({
    components: function install(Vue) {
        for (var name in components) {
            Vue.component(name, components[name]);
        }
    }
},components);