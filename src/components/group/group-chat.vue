<template>
    <el-dialog title="选择成员" :visible.sync="showDialog" width="600px">
        <div v-if="hasFriend">
            <GroupChatFriend v-for="friend in friendList" :key="friend.userID" :friend="friend"/>
        </div>
        <div style="color:gray;" v-else>暂无好友</div>
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
            }
        },
        computed: {
            ...mapState({
                friendList: state => state.friend.friendList
            }),
            hasFriend() {
                return this.friendList.length > 0
            }
        },
        methods: {
            handleConfirm() {
                let Name = this.userApi().nickName, MemberList = []
                this.friendList.forEach(item => {
                    if (item.isChecked) {//选中的
                        item.isChecked = false
                        MemberList.push({
                            userID: item.profile.userID
                        })
                        if (Name.length <= 9) {
                            if (Name) {
                                Name += '、'
                            }
                            Name += item.profile.nick
                        }
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
                this.$emit('closeGroup')
                // this.requestPost('group/createGroup',{
                //     Name:Name,
                //     Type:'Private',
                //     MemberList:MemberList,
                //     Owner_Account:this.userApi().userId
                // },()=>{
                //     this.$store.commit('showMessage', {
                //         message: '创建成功',
                //         type: 'success'
                //     })
                // },error=>{
                //     this.$store.commit('showMessage', {
                //         message: '创建失败：' + error.message,
                //         type: 'error'
                //     })
                // })
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