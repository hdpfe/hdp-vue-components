<template>

<modal :show.sync="show" :class-name="className" :close-via-dimmer="false">
    <div class="am-modal-hd" slot="header" v-if="title !== ''">{{ msg.title }}</div>
    <div class="am-modal-bd" slot="body">
        {{{ msg.content }}}
    </div>
    <div class="am-modal-footer" slot="footer">
        <span class="am-modal-btn" v-on:click="ok">确定</span>
    </div>
</modal>

</template>

<script>

import modal from './modal.vue';

export default {

    props: {
        msg: {
            type: Object,
            default: function() {
                return {
                    title: '',
                    content: ''
                }
            }
        },
        show: {
            type: Boolean,
            default: false,
            twoWay: true
        },
        className: {
            type: String,
            default: "am-modal-lg"
        }
    },

    components: {
        modal
    },

    methods: {
        ok() {
            this.$emit('alert.ok');
        }
    }

};

</script>
