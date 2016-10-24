<template>
    <div class="hdp-dropdown">
        <!-- optional indicators -->
        <i class="am-icon-fw am-icon-spinner am-icon-pulse" v-if="loading"></i>
        <!--<b class="fa fa-caret-down"></b>-->
 
        <!-- the input field -->
        <input type="text"
                placeholder="{{config.placeholder}}"
                 autocomplete="off"
                 v-model="inputData"
                 @keydown.down="down"
                 @keydown.up="up"
                 @blur="reset"
                 @keydown.enter="hit"
                 @input="update"
                 @keydown.delete="backspace"
                 @click="listAll"/>
 
        <!-- the list -->
        <ul v-show="hasItems" class="dropdown-menu hdp-dropdown-typeahead">
            <li v-for="item in items" :class="activeClass($index)" @mousedown="hit" @mousemove="setActive($index)">
                <span v-text="item" class="hdp-dropdown-text"></span>
            </li>
        </ul>
    </div>
</template>
 

<script>
    import TypeAhead from './typeAheadInterface.vue';

    export default {
        extends: TypeAhead,

        props:{
            config: {
                type: Object,
                default () {
                    return {
                        placeholder: '',
                        // Limit the number of items which is shown at the list 
                        // (optional) 
                        limit: 20,
                        // 特殊显示下拉列表方法
                        listFun: undefined,
                        // 没有选中列表值是否选中当前输入,
                        alwaysHit: false
                    }
                }
            },
            inputData: {
                type: String,
                default: '',
                twoWay: true
            },
            dropdownData: {
                type: Array,
                default () {
                    return []
                }
            }
        },

        computed: {
            hasItems () {
                return this.items.length > 0
            }
        },

        ready () {

        },

        methods: {
            listItem () {
                
                if (this.config.listFun) {
                    this.config.listFun.call(this);
                    return
                }

                let text = this.inputData;
                let result = [];
                let length = 0;

                for (let i = 0, max = this.dropdownData.length; i < max; i++) {
                    if (this.dropdownData[i].indexOf(text) >= 0) {
                        result.push(this.dropdownData[i]);
                        length++;
                    }
                    if (this.config.limit && length >= this.config.limit) {
                        break;
                    }
                }

                this.items = result;
                this.current = -1;
                
            },

            listAll () {
                if (this.config.listFun) {
                    this.config.listFun.call(this);
                    return
                }
                this.items = this.dropdownData;
            },

            /**
             * 触发选中
             */
            hit () {
                let text = this.inputData;
                if (this.current !== -1 && this.items[this.current]) {
                    // 找到列表中的值，选中列表项
                    this.onHit(this.items[this.current])
                } else if (this.config.alwaysHit && String(text).trim() !== '') {
                    this.onHit(text)
                } else {
                    this.inputData = '';
                    this.items = [];
                }
            },

            onHit (item) {
                this.inputData = item;
                this.items = [];
                this.$emit('typeahead.hit', {
                    text: item
                });
            },

            backspace () {
                if (this.inputData === '') {
                    this.$emit('typeahead.backspace');
                }
            }
        }
    }

</script>