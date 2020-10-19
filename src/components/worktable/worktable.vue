<template>
    <div class="list-container" style="width: 100%">
        <div class="header-bar">
            <strong>应用中心</strong>
        </div>
        <div v-for="item in dataArray">
            <h5 class="ml-4" style="color: #666">{{item.toolCategory}}</h5>
            <div v-for="app in item.toolDataList" class="ml-4 row align-items-center" @click="handleApp(app)">
                <img :src="app.iconUrl" style="width: 24px;height: 24px" />
                <el-button type="text" class="ml-2">
                    {{app.toolName}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'worktable',
        components: {
        },
        data() {
            return {
                dataArray:[]
            }
        },
        mounted() {
            this.requestPost('tool/getToolListByUserId',{},res=>{
                this.dataArray = res.data
            })
        },
        methods:{
            handleApp(app) {
                if(app.toolCode==='code002') {//网盘
                    this.requestPost('tool/getToolToken',{
                        toolCode:app.toolCode,
                        userName:this.userApi().userName
                    },res=>{
                        window.open(app.toolUrl+'?token='+res.data)
                    },error=>{
                        this.$store.commit('showMessage', {
                            message: '启动应用失败：' + error.message,
                            type: 'error'
                        })
                    })
                }else if(app.toolCode==='code003') {
                    this.requestGet(app.toolUrl,res=>{
                        if(res.data.Success) {
                            window.open(res.data.Result.url)
                        }else{
                            this.$store.commit('showMessage', {
                                message: '启动应用失败：' + res.data.message,
                                type: 'error'
                            })
                        }
                    })
                }else{
                    window.open(app.toolUrl)
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .list-container
        height 100%
        width 100%
        display flex
        background white
        flex-direction column
        .group-container
            overflow-y scroll
        .header-bar
            display: flex;
            flex-shrink 0
            height 50px
            border-bottom 1px solid $background-deep-dark
            align-items center
        .scroll-container
            overflow-y scroll
            flex 1

</style>


