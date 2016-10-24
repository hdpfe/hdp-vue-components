<template>
    <div class="hdp-dropdown">
        <!-- optional indicators -->
        <i class="am-icon-fw am-icon-spinner am-icon-pulse" v-if="loading"></i>
 
        <!-- the input field -->
        <input type="text"
                placeholder="{{config.placeholder}}"
                autocomplete="off"
                v-model="inputData[config.textName]"
                @blur="blur"
                @keydown.down="down"
                @keydown.up="up"
                @keydown.enter.prevent="hit"
                @input="update"
                @click="listAll"/>
 
        <!-- the list -->
        <ul v-show="hasItems" class="dropdown-menu hdp-dropdown-typeahead">
            <li v-for="item in items" :class="activeClass($index)" @mousedown="hit" @mousemove="setActive($index)">
                <span v-text="item.text" class="hdp-dropdown-text"></span>
                <span v-if="item.desc" class="hdp-dropdown-desc">{{ item.desc }}</span>
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

                            // 传入input的值属性名
                            textName: 'text',

                            // 传入input的id属性名
                            idName: 'id',

                            // 特殊显示下拉列表方法
                            listFun: undefined
                        }
                    },
                    coerce (config) {
                        if (!config.textName) {
                            config.textName = 'text';
                        }
                        if (!config.idName) {
                            config.idName = 'id';   
                        }
                        return config;
                    }
                },
                inputData: {
                    type: Object,
                    default () {
                        return {
                            text: '',
                            id: ''
                        }
                    }
                },
                // dropdownData数组元素必须有id与text属性
                dropdownData: {
                    type: Array,
                    default () {
                        return []
                    }
                }
            },

            methods: {

                onHit (item) {
                    this.inputData[this.config.idName] = item.id;
                    this.inputData[this.config.textName] = item.text;
                    this.items = [];
                    this.$emit('typeahead.hit', {
                        id: item.id,
                        text: item.text
                    });
                },

                listAll () {
                    if (this.config.listFun) {
                        this.config.listFun.call(this);
                        return
                    }
                    this.items = this.dropdownData;
                },

                listItem () {

                    if (this.config.listFun) {
                        this.config.listFun.call(this);
                        return
                    }

                    let text = this.inputData[this.config.textName];
                    let result = [];
                    let length = 0;

                    for (let i = 0, max = this.dropdownData.length; i < max; i++) {
                        if (this.dropdownData[i].text.indexOf(text) >= 0) {
                            result.push(this.dropdownData[i]);
                            length++;
                        }
                        if (this.config.limit && length >= this.config.limit) {
                            break;
                        }
                    }

                    this.items = result;

                },

                blur () {
                    if (this.inputData[this.config.textName] === '') {
                        this.inputData[this.config.idName] = '';
                        this.items = [];
                    } else {
                        this.hit();
                    }
                }
            }
        }

</script> 
