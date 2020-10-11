<template>
    <div class="list-container">
        <div class="header-bar justify-content-between">
            <button title="刷新列表" @click="handleRefresh">
                <i class="tim-icon-refresh"></i>
            </button>
            <!--                  <button title="创建会话" @click="handleAddButtonClick">-->
            <!--                    <i class="tim-icon-add"></i>-->
            <!--                  </button>-->
            <el-popover
                    placement="bottom"
                    width="100"
                    trigger="click">
                <div>
                    <el-button type="text" @click="handleAddFriend">添加好友</el-button>
                </div>
                <div>
                    <el-button type="text"  @click="handleAddButtonClick">发起群聊</el-button>
                </div>
                <el-button slot="reference" ><i class="tim-icon-add"></i></el-button>
            </el-popover>
        </div>
        <div class="scroll-container">
            <conversation-item
                    :conversation="item"
                    v-for="item in conversationList"
                    :key="item.conversationID"
            />
        </div>
        <Friend-dialog :show="show" @closeSearch="closeSearch"></Friend-dialog>
        <el-dialog title="选择成员" :visible.sync="showDialog" width="600px">
            <div v-if="hasFriend">
                <GroupChatFriend v-for="friend in friendList" :key="friend.userID" :friend="friend"/>
            </div>
            <div style="color:gray;" v-else>暂无好友</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import ConversationItem from './conversation-item'
    import GroupChatFriend from '../friend/GroupChatfriend'
    import {Popover} from 'element-ui'
    import {mapState} from 'vuex'
    import FriendDialog from '../friend/addFriend'

    export default {
        name: 'ConversationList',
        components: {
            GroupChatFriend,
            ConversationItem,
            FriendDialog,
            ElPopover: Popover,
            // ElCheckboxGroup:CheckboxGroup,
            // ElCheckbox:Checkbox
        },
        data() {
            return {
                show: false,
                checkedFriends: '',
                showDialog: false,
                userID: '',
                isCheckouting: false, // 是否正在切换会话
                timeout: null,
            }
        },
        computed: {
            ...mapState({
                conversationList: state => state.conversation.conversationList,
                currentConversation: state => state.conversation.currentConversation,
                friendList: state => state.friend.friendList
            }),
            hasFriend() {
                return this.friendList.length > 0
            }
        },
        mounted() {
            window.addEventListener('keydown', this.handleKeydown)
        },
        destroyed() {
            window.removeEventListener('keydown', this.handleKeydown)
        },
        methods: {
            handleAddFriend() {
                this.show = true
            },
            closeSearch() {
                this.show = false
            },
            handleRefresh() {
                this.refreshConversation()()
            },
            refreshConversation() {
                let that = this
                return function () {
                    if (!that.timeout) {
                        that.timeout = setTimeout(() => {
                            that.timeout = null
                            that.tim.getConversationList().then(() => {
                                that.$store.commit('showMessage', {
                                    message: '刷新成功',
                                    type: 'success'
                                })
                            })
                        }, 1000)
                    }
                }
            },
            handleAddButtonClick() {
                this.showDialog = true

            },
            handleConfirm() {
                console.log(this.friendList);
                let Name = this.userApi().nickName,MemberList=[]
                this.friendList.forEach(item=>{
                    if(item.isChecked) {//选中的
                        item.isChecked = false
                        MemberList.push({
                            Member_Account:item.profile.userID
                        })
                        if(Name.length<=9) {
                            Name+=item.profile.nick
                        }
                    }
                })
                if(MemberList.length===0) {
                    this.$store.commit('showMessage',{
                        type:'error',
                        message:'请选择成员'
                    })
                    return
                }
                if(Name.length>=9) {
                    Name = Name.substring(0,8)+'...'
                }
                this.showDialog = false
                this.requestPost('group/createGroup',{
                    Name:Name,
                    Type:'Private',
                    MemberList:MemberList,
                    Owner_Account:this.userApi().userId
                },()=>{
                    this.$store.commit('showMessage', {
                        message: '创建成功',
                        type: 'success'
                    })
                },error=>{
                    this.$store.commit('showMessage', {
                        message: '创建失败：' + error.message,
                        type: 'error'
                    })
                })
            },
            handleKeydown(event) {
                if (event.keyCode !== 38 && event.keyCode !== 40 || this.isCheckouting) {
                    return
                }
                const currentIndex = this.conversationList.findIndex(
                    item => item.conversationID === this.currentConversation.conversationID
                )
                if (event.keyCode === 38 && currentIndex - 1 >= 0) {
                    this.checkoutPrev(currentIndex)
                }
                if (
                    event.keyCode === 40 &&
                    currentIndex + 1 < this.conversationList.length
                ) {
                    this.checkoutNext(currentIndex)
                }
            },
            checkoutPrev(currentIndex) {
                this.isCheckouting = true
                this.$store
                    .dispatch(
                        'checkoutConversation',
                        this.conversationList[currentIndex - 1].conversationID
                    )
                    .then(() => {
                        this.isCheckouting = false
                    })
                    .catch(() => {
                        this.isCheckouting = false
                    })
            },
            checkoutNext(currentIndex) {
                this.isCheckouting = true
                this.$store
                    .dispatch(
                        'checkoutConversation',
                        this.conversationList[currentIndex + 1].conversationID
                    )
                    .then(() => {
                        this.isCheckouting = false
                    })
                    .catch(() => {
                        this.isCheckouting = false
                    })
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
        flex-direction column // -reverse

        .header-bar
            flex-shrink 0
            height 50px
            border-bottom 1px solid $background-deep-dark
            padding 10px 10px 10px 20px

            button
                float right
                display: inline-block;
                cursor: pointer;
                background $background-deep-dark
                border: none
                color: $font-dark;
                box-sizing: border-box;
                transition: .3s;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                margin: 0 10px 0 0
                padding 0
                width 30px
                height 30px
                line-height 34px
                font-size: 24px;
                text-align: center;
                white-space: nowrap;
                border-radius: 50%
                outline 0

                &:hover
                    // background $light-primary
                    // color $white
                    transform: rotate(360deg);
                    color $light-primary

        .scroll-container
            overflow-y scroll
            flex 1

    .bottom-circle-btn {
        position: absolute;
        bottom: 20px;
        right: 20px;
    }

    .refresh {
        bottom: 70px;
    }
</style>
