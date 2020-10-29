<template>
    <div class="list-container">
        <div class="header-bar justify-content-between">
            <el-input
                    @focus="startFilter"
                    @blur="endFilter"
                    size="mini"
                    v-model="keyword"
                    placeholder="请输入群昵称"
                    class="group-search-bar"
                    prefix-icon="el-icon-search"
            ></el-input>
            <button title="刷新列表" @click="handleRefresh">
                <i class="tim-icon-refresh"></i>
            </button>
            <el-popover
                    placement="bottom"
                    width="100"
                    trigger="click">
                <div>
                    <el-button type="text" @click="handleAddFriend">添加好友</el-button>
                </div>
                <div>
                    <el-button type="text" @click="handleAddButtonClick">发起群聊</el-button>
                </div>
                <el-button slot="reference"><i class="tim-icon-add"></i></el-button>
            </el-popover>
        </div>
        <div class="scroll-container">
            <conversation-item v-for="item in getConversationListData" :key="item.conversationID" :conversation="item"/>
        </div>
        <friend-dialog :show="show" @closeSearch="closeSearch"></friend-dialog>
        <group-dialog ref="createGroup" :showDialog="showAddGroup" @closeGroup="closeGroup"></group-dialog>
    </div>
</template>

<script>
    import ConversationItem from './conversation-item'
    import {Popover} from 'element-ui'
    import {mapState} from 'vuex'
    import FriendDialog from '../friend/addFriend'
    import GroupDialog from '../group/group-chat'

    export default {
        name: 'ConversationList',
        components: {
            GroupDialog,
            ConversationItem,
            FriendDialog,
            ElPopover: Popover,
        },
        data() {
            return {
                show: false,
                checkedFriends: '',
                showAddGroup: false,
                userID: '',
                isCheckouting: false, // 是否正在切换会话
                timeout: null,
                keyword: '',
                start:false
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
            },
            getConversationListData() {
                return this.conversationList.filter(item=>{
                    if (item.groupProfile) {
                        return item.groupProfile.name.indexOf(this.keyword) >= 0
                    }
                    if (item.userProfile) {
                        return item.userProfile.nick.indexOf(this.keyword) >= 0
                    }
                    if(item.type==='@TIM#SYSTEM' && !this.keyword) { return true }
                })
            }
        },
        mounted() {
            window.addEventListener('keydown', this.handleKeydown)
        },
        destroyed() {
            window.removeEventListener('keydown', this.handleKeydown)
        },
        methods: {
            startFilter() {
                this.start = true
            },
            endFilter() {
                this.keyword = ''
                this.start = false
            },
            filterKeyword(item) {
                if (item.groupProfile) {
                    return item.groupProfile.name.indexOf(this.keyword) >= 0
                }
                if (item.userProfile) {
                    return item.userProfile.nick.indexOf(this.keyword) >= 0
                }
            },
            handleAddFriend() {
                this.show = true
            },
            closeSearch() {
                this.show = false
            },
            handleRefresh() {
                let that = this
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
            },
            handleAddButtonClick() {
                // this.$store.dispatch('getFriendlist')
                this.$refs.createGroup.refreshData()
                this.showAddGroup = true
            },
            closeGroup() {
                this.showAddGroup = false
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

            .group-search-bar
                width 100%
                margin-right 10px

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
            overflow-x hidden
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
