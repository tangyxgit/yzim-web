<template>
    <el-dialog title="选择成员" :visible="showDialog" :before-close="close" width="600px">
        <el-input
                size="mini"
                v-model="keyword"
                placeholder="请输入昵称"
                prefix-icon="el-icon-search"
        ></el-input>
        <div>
            <div v-if="hasFriend">
                <div v-for="friend in getFriendListData" :key="friend.userID">
                    <group-chat-friend  :friend="friend"/>
                </div>
            </div>
            <div style="color:gray;" v-else>暂无好友</div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
    import {mapState} from 'vuex'
    import GroupChatFriend from '../friend/GroupChatfriend'

    export default {
        name: 'group-chat',
        components: {
            GroupChatFriend
        },
        props: {
            showDialog: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                keyword: '',
                friendList:[],
            }
        },
        computed: {
            ...mapState({
                currentMemberList: state => state.group.currentMemberList,
                currentConversation: state => state.conversation.currentConversation
            }),
            hasFriend() {
                return this.friendList.length > 0
            },
            getFriendListData() {
                this.friendList.forEach(friend=>{
                    friend.disabled = false
                    friend.isChecked = false
                    for (let i = 0; i < this.currentMemberList.length; i++) {
                        let member = this.currentMemberList[i]
                        if(member.userID === friend.userID) {
                            friend.disabled = true
                            friend.isChecked = true
                            break
                        }
                    }
                })
                return this.friendList.filter(item=>{
                    return item.nick.indexOf(this.keyword) >=0
                })
            }
        },
        methods: {
            refreshData() {
                this.getFriendList(data=>{
                    this.friendList = data
                })
            },
            filter(friend) {
                return friend.profile.nick.indexOf(this.keyword) >=0
            },
            handleConfirm() {
                let Name = this.userApi().nickName, MemberList = []
                this.friendList.forEach(item => {
                    if (item.isChecked) {//选中的
                        if(!item.disabled) {
                            MemberList.push(item.userID)
                        }
                        if (Name.length <= 9) {
                            if (Name) {
                                Name += '、'
                            }
                            Name += item.nick
                        }
                        item.isChecked = false
                        item.disabled = false
                    }
                })
                if (MemberList.length === 0) {
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: '请选择成员'
                    })
                    return
                }
                if (Name.length >= 9) {
                    Name = Name.substring(0, 8) + '...'
                }
                this.close()
                const groupID = this.currentConversation.conversationID.replace('GROUP', '')
                this.tim
                    .addGroupMember({
                        groupID,
                        userIDList:MemberList
                    })
                    .then((imResponse) => {
                        const {
                            successUserIDList,
                            // failureUserIDList,
                            // existedUserIDList
                        } = imResponse.data
                        if (successUserIDList.length > 0) {
                            this.$store.commit('showMessage', {
                                message: '群成员添加加群成功',
                                type: 'success'
                            })
                            this.tim.getGroupMemberProfile({groupID, userIDList: successUserIDList})
                                .then(({ data: { memberList }}) => {
                                    this.$store.commit('updateCurrentMemberList', memberList)
                                })
                        }
                        // if (failureUserIDList.length > 0) {
                        //     this.$store.commit('showMessage', {
                        //         message: `群成员：${failureUserIDList.join(',')}，添加失败！`,
                        //         type: 'error'
                        //     })
                        // }
                        // if (existedUserIDList.length > 0) {
                        //     this.$store.commit('showMessage', {
                        //         message: `群成员：${existedUserIDList.join(',')}，已在群中`
                        //     })
                        // }
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            close() {
                this.$emit('closeGroup')
            }
        }
    }
</script>

<style scoped>

</style>
