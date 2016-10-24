<template>
    
    <div>
        <div class="am-modal am-modal-active" :class="className" tabindex="-1" v-show="show">
            <div class="am-modal-dialog">
                <slot name="header"></slot>
                <slot name="body"></slot>
                <slot name="footer"></slot>
            </div>
        </div>

        <div class="am-dimmer" v-bind:class="{'am-active': show}" v-show="show" v-on:click="close" transition="modal-fade"></div>
    </div>
    
</template>

<style>

.am-modal, .am-dimmer {
    display: block;
}

</style>

<script>

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        closeViaDimmer: { // 是否通过点击遮罩层关闭模态框，默认为true
            type: Boolean,
            default: true
        },
        className: {
            type: String,
            default: "am-modal-lg"
        }
    },

    transitions: {
        "modal-fade": {
            beforeEnter(el) {},
            enter (el) {},
            afterEnter(el) {},
            enterCancelled(el) {},
            beforeLeave(el) {},
            leave(el) {},
            afterLeave(el) {},
            leaveCancelled(el) {}
        }
    },

    methods: {
        close() {
            if (this.closeViaDimmer) {
                this.show = false;
            }
        }
    }
};

</script>
