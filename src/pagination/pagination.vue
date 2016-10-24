<template>
    <ul class="am-pagination">
        <li v-if="cur!=1">
            <a v-if="!pageLink" v-on:click="cur--">上一页</a>
            <a v-else v-link="pageLink(cur - 1)">上一页</a>
        </li>
        <li v-for="index in indexs"  v-bind:class="{ 'am-active': cur == index}">
            <a v-if="!pageLink" v-on:click="btnClick(index)">{{ index }}</a>
            <a v-else v-link="pageLink(cur)">{{ index }}</a>
        </li>
        <li v-if="cur!=pagenum">
            <a v-if="!pageLink" v-on:click="cur++">下一页</a>
            <a v-else v-link="pageLink(cur + 1)">上一页</a>
        </li>
        <li class="am-pagination-total"><span>总数：<i>{{total}}</i></span></li>
    </ul>
</template>

<script>
    export default {

        props: {
            'cur': Number,
            'total': Number,
            'pagesize': {
                type: Number,
                default: 20
            },
            'pageLink': {
                type: Function,
                default: undefined
            }
        },
        data: function(){
                return {}
        },
        computed: {
            indexs: function(){
                let left = 1
                let arr = []
                let pagenum = Math.ceil(this.total/this.pagesize)
                let right = pagenum
                if(pagenum>= 11){
                    if(this.cur > 5 && this.cur < pagenum-4){
                        left = this.cur - 5
                        right = this.cur + 4
                    }else{
                        if(this.cur<=5){
                            left = 1
                            right = 10
                        }else{
                            right = pagenum
                            left = pagenum -9
                        }
                    }
                 }
                 while (left <= right){
                    arr.push(left)
                    left ++
                 }
                 if (arr[0] != 1) {
                    arr.unshift('首页')
                 }
                 if (right != pagenum) {
                    arr.push('尾页')  
                 }
                 return arr
             },
             pagenum: function() {
                    return Math.ceil(this.total/this.pagesize);
             }
        },
        methods: {
            btnClick: function(data){
                if (data === '首页') {
                    this.cur = 1
                } else if (data === '尾页') {
                    this.cur = Math.ceil(this.total/this.pagesize)
                } else if (data != this.cur){
                    this.cur = data 
                }
            }
        }

    }
</script>