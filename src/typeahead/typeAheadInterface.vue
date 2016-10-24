<style>

    .hdp-dropdown {
        position: relative;
        display: inline-block;
    }
    .hdp-dropdown input {
        width: 100%;
    }
    .hdp-dropdown .am-icon-fw {
        position: absolute;
        right: 8px;
        top: 4px;
    }
    .hdp-dropdown-typeahead {
        position: absolute;
        display: block;
        width: 100%;
        max-height: 200px;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        text-align: left;
        background-color: #fff;
        z-index: 1000;
    }
    .hdp-dropdown-typeahead li {
        padding: 0 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 20px;
    }
    .hdp-dropdown-typeahead .active {
        background-color: #ddd;
    }
    .hdp-dropdown-typeahead li:hover {
        background-color: #ddd;    
    }
    .hdp-dropdown-text {
        color: #757575;
       
    }
    .hdp-dropdown-desc {
        float: right;
        font-size: 12px;
    }
</style>

<script>
    export default {
        data () {
            return {
                items: [],
                current: -1,
                loading: false
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
            update () {
                this.timeout && clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {

                    this.listItem();

                }, 100);
            },

            reset () {
                this.items = []
                this.loading = false
            },

            setActive (index) {
                this.current = index
            },

            activeClass (index) {
                return {
                    active: this.current === index
                }
            },

            /**
             * 触发选中
             */
            hit () {
                let text = this.inputData[this.config.textName];
                if (this.current !== -1 && this.items[this.current]) {
                    // 找到列表中的值，选中列表项
                    this.onHit(this.items[this.current])
                }
            },

            up () {
                if (this.current > 0) {
                    this.current--
                } else if (this.current === -1) {
                    this.current = this.items.length - 1
                } else {
                    this.current = -1
                }
            },

            down () {
                if (this.current < this.items.length - 1) {
                    this.current++
                } else {
                    this.current = -1
                }
            },

            onHit (item) {
                // 选中某个项
            },

            listItem () {
                // 列出下拉列表

            }
        }
    }

</script>