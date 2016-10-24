<template>
    <div class="tagInput-container tags" @click="focus">
        <span v-for="item in showList" class="tag">{{item}}<i class="close" @click="deleteItem($index)">×</i></span>
        <type-ahead-text
                v-if="typeAhead === 'text'"
                :input-data.sync="textInput"
                :config="config"
                :dropdown-data="dropdownData"
                v-ref:typeahead>
        </type-ahead-text>
        <type-ahead-object
                v-if="typeAhead === 'object'"
                :input-data.sync="objectInput"
                :dropdown-data="dropdownData"
                :config="config"
                v-ref:typeahead>
        </type-ahead-object>
    </div>
</template>

<style>
    .tagInput-container {
        border:1px #ccc solid;
        padding:4px;
        cursor:text;
        font-size:13px;
        width:100%;
        text-align: left;
    }

    .tagInput-container input {
        font-size:13px;
        clear:both;
        width:200px;
        height:30px;
        border:0;
        margin-bottom:1px;
    }

    .tagInput-container .close {        
        cursor: pointer;
        font-size: 16px;
        padding: 0 2px 0 4px;
    }

    li.tagInput-email {
        float:left;
        margin-right:2px;
        margin-bottom:1px;
        border:1px #BBD8FB solid;
        padding:2px;
        background:#F3F7FD;
    }

    .tagInput-close {
        width:16px;
        height:16px;
        display:block;
        float:right;
        margin:0 3px;
        cursor: pointer;
    }

    .tagInput-container .orochi-dropdown {
        display: inline-block;
        width: auto;
    }

    .tagInput-container .tag{
        padding: 4px 4px 4px 6px;
        background-color: #0e90d2;
        color: #fff;
        margin-right: 4px;
    }

    .tagInput-container .orochi-dropdown-typeahead {
        left: -5px;
    }
</style>
 
<script>
    import TypeAheadText from '../typeahead/typeAhead_text.vue';
    import TypeAheadObject from '../typeahead/typeAhead_object.vue';

    export default {

        data () {
            return {
                textInput: '',
                objectInput: {
                    id: '',
                    text: ''
                },
                showList: []
            }
        },

        components: {
            TypeAheadText,
            TypeAheadObject
        },

        /**
         * inputList    必选，输入列表
         * typeAhead    默认text,下拉组件类型
         * config       可选，传给下拉组件的config
         * dropdownData 可选，下拉组件的下拉数据，参照下拉组件的参数
         */
        props:{
            typeAhead: {
                type: String,
                default: 'text'
            },
            config: {
                type: Object,
                default () {
                    return {
                        // 传入input的id属性名
                        idName: 'id',
                        // 传入input的值属性名
                        textName: 'text',
                        alwaysHit: true
                    }
                }
            },
            inputList: {
                type: Array,
                twoWay: true,
                default () {
                    return []
                }
            },
            dropdownData: {
                type: Array,
                default () {
                    return []
                }
            }
        },

        computed: {},

        ready () {
            this.$refs.typeahead.$on('typeahead.hit', (data) => {
                if (this.showList.indexOf(data.text) < 0) {
                    let input = {
                        text: data.text,
                        object: {
                            id: data.id,
                            text: data.text
                        }
                    }[this.typeAhead];
                    this.inputList.push(input);
                    this.showList.push(data.text);
                    // typeahead.hit事件触发时已经对textInput进行赋值
                    setTimeout(() => {
                        this.textInput = '';
                    });
                    this.objectInput.text = '';
                }
            });
            this.$refs.typeahead.$on('typeahead.backspace', () => {
                this.inputList.pop();
                this.showList.pop();
            });
        },

        methods: {
            focus () {
                this.$el.querySelector('input').focus();
            },
            deleteItem (index) {
                this.inputList.splice(index, 1);
                this.showList.splice(index, 1);
            }
        }

    }

</script> 

