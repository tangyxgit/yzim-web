<template>
    <el-dialog title="选择成员" :visible="showDialog" :before-close="close" width="600px">
        <el-input
                @focus="startChoose"
                @blur="endChoose"
                size="mini"
                v-model="keyword"
                placeholder="请输入昵称"
                prefix-icon="el-icon-search"
        ></el-input>
        <div v-if="!choose">
            <div v-if="hasFriend">
                <div v-for="friend in friendList" :key="friend.userID">
                    <group-chat-friend  :friend="friend"/>
                </div>
            </div>
            <div style="color:gray;" v-else>暂无好友</div>
        </div>
        <div v-else>
            <div v-if="hasFriend">
                <div v-for="friend in friendList" :key="friend.userID">
                    <group-chat-friend v-if="filter(friend)" :friend="friend"/>
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
            }
        },
        data() {
            return {
                keyword: '',
                choose:false
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
            filter(friend) {
                return friend.profile.nick.indexOf(this.keyword) >=0
            },
            startChoose() {
                this.choose = true
            },
            endChoose() {
                this.choose = false
            },
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