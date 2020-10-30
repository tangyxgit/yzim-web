<template>
    <div>
        <el-dialog :visible="show" title="添加好友"  width="600px" @close="close" >
            <el-input
                    size="mini"
                    v-model="keyword"
                    placeholder="请输入昵称或手机号"
                    prefix-icon="el-icon-search"
                    @input="search"
            ></el-input>
            <div v-if="waitingList.length>0">
                <div v-for="waitFriend in waitingList" :key="waitFriend.id" @click="sendCheck(waitFriend)">
                    <div v-if="waitFriend.userId!==userId">
                      <div class="group-item">
                        <avatar :src="waitFriend.userIcon" />
                        <div class="group-name ">
                          <div class="line">
                            {{ waitFriend.nickName }}
                          </div>
                          <div class="line">
                            {{ waitFriend.mobile }}
                          </div>
                        </div>
                      </div>
                      <div style="width: 80%;height: 1px;background: #E9EBEC;margin-left: 80px"></div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible="sendCheckDialog" title="发送验证信息" width="600px" :before-close="closeSend">
            <div class="group-item">
                <avatar :src="userIcon" />
                <div class="group-name ">
                    <div class="line">
                        {{ nickName }}
                    </div>
                    <div class="line">
                        {{ mobile }}
                    </div>
                </div>
            </div>
            <el-input
                    type="textarea"
                    :autosize="{ minRows: 6}"
                    placeholder="发送给对方的验证消息"
                    v-model="checkEmail">
            </el-input>
            <div class="w-100 text-right">
                <el-button type="primary" class="mt-4" @click="send">添加到通讯录</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'addFriend',
        components: {},
        props: {
            show:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                userId:this.userApi().userId,
                userIcon:'',
                nickName:'',
                mobile:'',
                keyword:'',
                waitingList:'',
                sendCheckDialog:false,
                checkEmail:''
            }
        },
        computed:{

        },
        methods: {
            close() {
                this.$emit('closeSearch')
            },
            closeSend() {
                this.sendCheckDialog = false
            },
            search() {
                this.requestPost('user/getUserByParam',{param:this.keyword},res=>{
                    this.waitingList = res.data
                    // console.log(res.data)
                },error=>{
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: error.msg
                    })
                })
            },
            sendCheck(waitFriend) {
                this.sendCheckDialog = true
                this.userIcon=waitFriend.userIcon
                this.nickName=waitFriend.nickName
                this.mobile=waitFriend.mobile
                this.friendId=waitFriend.userId
            },
            send() {
                this.requestPost('user/addFriend',{
                    From_Account:this.userApi().userId,//当前用户id
                    AddFriendItem:[{
                        To_Account:this.friendId,
                        AddSource:'AddSource_Type_Web',
                        AddWording:this.checkEmail
                    }]
                },()=>{
                    this.$store.commit('showMessage', {
                        type: 'success',
                        message: '消息发送成功'
                    })
                    this.sendCheckDialog=false
                    }, error=>{
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: error.msg
                    })
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .group-item
        display flex
        padding 15px 20px
        cursor pointer
        position relative
        overflow hidden
        transition .2s
        .avatar
            width 50px
            height 50px
            border-radius 100%
            margin-right 10px
            flex-shrink 0
        .group-name
            flex 1
            color $font-dark
            line-height 50px
            .line
                line-height 25px
    .group-name:hover{
        color darkgrey
    }
</style>
