<template>
    <el-dialog title="发起群聊" :visible="showDialog" :before-close="close" width="600px">
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
            <div v-else style="color:gray;" >暂无好友</div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
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
            hasFriend() {
                return this.friendList.length > 0
            },
            getFriendListData() {
                this.friendList.forEach(friend=>{
                    friend.disabled = false
                    friend.isChecked = false
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
            handleConfirm() {
                let Name = this.userApi().nickName, MemberList = []
                this.friendList.forEach(item => {
                    if (item.isChecked) {//选中的
                        if(!item.disabled) {
                            MemberList.push({
                                userID: item.userID
                            })
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
                this.tim.createGroup({
                    name: Name,
                    type: this.TIM.TYPES.GRP_WORK,
                    memberList: MemberList
                }).then((imResponse) => {
                    this.$store.commit('showMessage', {
                        message: `群聊：【${imResponse.data.group.name}】发起成功`,
                        type: 'success'
                    })
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
