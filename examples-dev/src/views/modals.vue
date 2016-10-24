<template>

<div>
    <button class="am-btn am-btn-default" type="button" v-on:click="showModal=true">open modal</button>
    &nbsp;&nbsp;
    <button class="am-btn am-btn-primary" type="button" v-on:click="clickAlert">open alert</button>
    &nbsp;&nbsp;
    <button class="am-btn am-btn-secondary" type="button" v-on:click="clickConfirm">open confirm</button>
    &nbsp;&nbsp;
    <button class="am-btn am-btn-success" type="button" v-on:click="clickDialog">open dialog</button>
    &nbsp;&nbsp;

</div>

<hdp-modal :show.sync="showModal">
    <div class="am-modal-hd" slot="header">modal header</div>
    <div class="am-modal-bd" slot="body">hello</div>
</hdp-modal>

<hdp-alert :show.sync="showAlert" class-name="am-modal-sm" :msg="alertMsg" @alert.ok="clickAlertOK"></hdp-alert>

<hdp-confirm :show.sync="showConfirm" class-name="am-modal-sm" :msg="confirmMsg" @confirm.ok="clickConfirmOK" @confirm.cancel="clickConfirmCancel"></hdp-confirm>

<hdp-dialog :show.sync="showDialog" :msg="dialogMsg" @dialog.cancel="clickDialogCancel" @dialog.ok="clickDialogOK">
    <label for="">username</label>
    <input type="text" v-model="username">
</hdp-dialog>


</template>

<script>

import hdpVueComponents from 'hdp-vue-components';

module.exports = {

    data: function() {
        return {
            showModal: false,
            showAlert: false,
            showConfirm: false,
            showDialog: false,
            alertMsg: {
                title: 'alert',
                content: 'alert content'
            },
            confirmMsg: {
                title: 'confirm',
                content: 'alert content',
                cancelText: false
            },
            dialogMsg: {
                title: 'finish your message',
                confirmText: '提交'
            },
            username: 'hdp'
        };
    },

    methods: {
        clickAlert: function() {
            this.showAlert = true;
            this.alertMsg.title = this.alertMsg.title + 1;
        },
        clickAlertOK: function() {
            this.showAlert = false;
        },
        clickConfirm: function() {
            this.showConfirm = true;
            this.confirmMsg.title = this.alertMsg.title + 1;
        },
        clickConfirmOK: function() {
            console.log('yeah');
            this.showConfirm = false;
        },
        clickConfirmCancel: function() {
            console.log('no');
            this.showConfirm = false;
        },
        clickDialog: function() {
            this.showDialog = true;
        },
        clickDialogOK: function() {
            this.showDialog = false;
            console.log('submit name:' + this.username)
        },
        clickDialogCancel: function() {
            this.showDialog = false;
            console.log('cancel')
        }
    }

};

</script>
