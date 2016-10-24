<template>
    <div class="am-form">

        <label for="">普通下拉文本</label><br>
        <hdp-ta-text :input-data.sync="textInput" :dropdown-data="listData"></hdp-ta-text><span>{{textInput}}</span>
        
        
        <br><br>

        <label for="">自定义下拉文本列表</label><br>
        <hdp-ta-text :input-data.sync="textInput2" :config="textConfig"></hdp-ta-text><span>{{textInput2}}</span>

        <br><br>

        <label for="">普通下拉对象列表</label><br>
        <hdp-ta-object
            :input-data.sync="objectInput"
            :config="objectConfig"
            :dropdown-data="listObject">
        </hdp-ta-object>
        <span>id:{{objectInput.id}},name:{{objectInput.name}}</span>

        <br><br>

        <label for="">自定义(ajax)下拉对象列表</label><br>
        <hdp-ta-object
            :input-data.sync="objectInput2"
            :config="object2Config">
        </hdp-ta-object>
        <span>id:{{objectInput2.id}},name:{{objectInput2.name}}</span>
    
    </div>

    <br><br>

    <p>本着单一职责的原则，本来还想把ajax下拉也做成一个组件，但ajax库比较多样，就不做了</p>

</template>

<style>
    .hdp-dropdown-typeahead {
        border: solid 1px #ccc
    }
</style>

<script>

import hdpVueComponents from 'hdp-vue-components';

module.exports = {

    data: function() {
        return {
            textInput: '',
            listData: ['abc','addd','asdgasd','asdfasge','gwesdf'],
            textInput2: '',
            textConfig: {
                // 邮件下拉
                listFun: function() {
                    let data = ["@hudongpai.com", "@qq.com", "@163.com", "@outlook.com", "@gmail.com", "@hotmail.com"];
                    let value = this.inputData;
                    let index = value.indexOf('@');
                    let host = '';
                    if (index > -1) {
                        host = value.slice(index);
                        value = value.slice(0, index);
                    }
                    for (var i = data.length - 1; i >= 0; i--) {
                        data[i] = value + data[i];
                    }
                    this.items = this.config.limit ? data.slice(0, this.config.limit)
                        : data
                    this.current = -1
                },
                alwaysHit: true
            },
            objectInput: {
                id: '',
                name: ''
            },
            objectConfig: {
                textName: 'name',    // 传入input的值属性名
                idName: 'id'         // 传入input的id属性名
            },
            // listObject数组元素必须有id与text属性
            listObject: [
                {
                    id: 1,
                    text: 'joey',
                    desc: 'a sb'
                },{
                    id: 2,
                    text: 'tom',
                    desc: 'a man'
                },{
                    id: 3,
                    text: 'jame'
                }
            ],
            objectInput2: {
                id: '',
                name: ''
            },
            object2Config: {
                textName: 'name',
                idName: 'id',
                listFun: function() {
                    this.loading = true;
                    // setTimeout当ajax啦
                    setTimeout(() => {
                        this.loading = false;
                        let text = this.inputData[this.config.textName];
                        let resultList = [{
                            id: 1,
                            name: '11111111'
                        },,{
                            id: 2,
                            name: '1222222222'
                        },{
                            id: 3,
                            name: '123333'
                        },{
                            id: 4,
                            name: '1234444444'
                        },{
                            id: 5,
                            name: '123455555'
                        }];

                        let items = [];

                        resultList.forEach((item) => {
                            if (item.name.indexOf(text) >= 0) {
                                items.push({
                                    id: item.id,
                                    text: item.name
                                })
                            }
                        })

                        this.items = items
                        this.current = -1

                    },500);
                }
            }
        };
    },

    ready: function() {
        
    },

    methods: {
        
    }

};

</script>
