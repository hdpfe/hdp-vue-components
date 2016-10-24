<template>

    <div>
        <label for="">文本输入</label>
        <hdp-taginput :input-list.sync="tagList" :dropdown-data="listData"></hdp-taginput>
    </div>

    <div>
        <label for="">自定义文本输入</label>
        <hdp-taginput :input-list.sync="tagList2" :config="textConfig"></hdp-taginput>
    </div>

    <div>
        <label for="">对象输入</label>
        <hdp-taginput 
            type-ahead="object"
            :input-list.sync="tagList3"
            :dropdown-data="listObject">
        </hdp-taginput>
    </div>

    <div>
        <label for="">自定义(ajax)对象输入</label>
        <hdp-taginput 
            type-ahead="object"
            :input-list.sync="tagList4"
            :config="objectConfig">
        </hdp-taginput>
    </div>

</template>

<script>

    module.exports = {

        data: function() {
            return {
                tagList: [],
                listData: ['abc','addd','asdgasd','asdfasge','gwesdf'],
                tagList2: [],
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
                tagList3: [],
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
                tagList4: [],
                objectConfig: {
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
            }
        },

        methods: {
            
        }
    };

</script>
