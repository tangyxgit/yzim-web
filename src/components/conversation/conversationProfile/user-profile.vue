<template>
  <div class="profile-user">
    <avatar :title=userProfile.userID :src="userProfile.avatar"/>
    <div class="nick-name text-ellipsis">
      <span v-if="userProfile.nick" :title=userProfile.nick>
        {{ userProfile.nick }}
      </span>
      <span v-else class="anonymous" title="该用户未设置昵称">
        [Anonymous]
      </span>
    </div>
    <div class="gender " v-if="genderClass">
      <span :title="gender" class="iconfont" :class="genderClass"></span>
    </div>

    <!--        <div class="info-item">-->
    <!--            <div class="label text-left">-->
    <!--                部门-->
    <!--            </div>-->
    <!--            <div class="content text-left">-->
    <!--                {{form.departName}}-->
    <!--            </div>-->
    <!--        </div>-->

    <!--        <div class="info-item">-->
    <!--            <div class="label text-left">-->
    <!--                职位-->
    <!--            </div>-->
    <!--            <div class="content text-left">-->
    <!--                {{form.position}}-->
    <!--            </div>-->
    <!--        </div>-->

    <!--        <div class="info-item">-->
    <!--            <div class="label text-left">-->
    <!--                工号-->
    <!--            </div>-->
    <!--            <div class="content text-left">-->
    <!--                {{form.card}}-->
    <!--            </div>-->
    <!--        </div>-->

    <div class="info-item">
      <div class="label text-left">
        邮箱
      </div>
      <div class="content text-left">
        {{form.email}}
      </div>
    </div>

    <!--        <div class="info-item">-->
    <!--            <div class="label text-left">-->
    <!--                设置备注-->
    <!--                <i class="el-icon-edit"-->
    <!--                   @click="showEditRemark = true-->
    <!--                inputFocus('editRemark')" style="cursor:pointer;font-size:16px"></i>-->
    <!--            </div>-->
    <!--            <div class="content text-left" v-if="!showEditRemark">-->
    <!--                {{form.friendRemark}}-->
    <!--            </div>-->
    <!--            <el-input-->
    <!--                    ref="editRemark"-->
    <!--                    v-else-->
    <!--                    autofocus-->
    <!--                    v-model="form.friendRemark"-->
    <!--                    size="mini"-->
    <!--                    @blur="showEditRemark = false"-->
    <!--                    @keydown.enter.native="editRemark"-->
    <!--            />-->
    <!--        </div>-->


    <el-button
      title="将该用户加入黑名单"
      type="text"
      @click="addToBlackList"
      v-if="!isInBlacklist && userProfile.userID !== myUserID"
      class="btn-add-blacklist "
    >加入黑名单
    </el-button
    >
    <el-button title="将该用户移出黑名单" type="text" @click="removeFromBlacklist" v-else-if="isInBlacklist">移出黑名单
    </el-button>
    <!-- 拉黑 和 反拉黑 -->
    <div>
      <el-button type="text" style="color:dodgerblue" @click="deleteFriend" >删除好友</el-button>
    </div>

  </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        props: {
            userProfile: {
                type: Object,
                required: true
            },
            conversationID:{
                type: String,
                required: false
            }
        },
        data() {
            return {
                form: {
                    departName: '待完善',
                    position: '待完善',
                    card: '待完善',
                    email: '待完善',
                    friendRemark: this.userProfile.nick
                },
                showEditRemark: false,

            }
        },
        computed: {
            ...mapState({
                blacklist: state => state.blacklist.blacklist,
                myUserID: state => state.user.currentUserProfile.userID
            }),
            isInBlacklist() {
                this.getDetail()
                return this.blacklist.findIndex(item => item.userID === this.userProfile.userID) >= 0
            },
            gender() {
                switch (this.userProfile.gender) {
                    case this.TIM.TYPES.GENDER_MALE:
                        return '男'
                    case this.TIM.TYPES.GENDER_FEMALE:
                        return '女'
                    default:
                        return '未设置'
                }
            },
            genderClass() {
                switch (this.userProfile.gender) {
                    case this.TIM.TYPES.GENDER_MALE:
                        return 'icon-male'
                    case this.TIM.TYPES.GENDER_FEMALE:
                        return 'icon-female'
                    default:
                        return ''
                }
            }
        },
        methods: {
            inputFocus(ref) {
                this.$nextTick(() => {
                    this.$refs[ref].focus()
                })
            },
            addToBlackList() {
                this.tim
                    .addToBlacklist({userIDList: [this.userProfile.userID]})
                    .then(() => {
                        this.$store.dispatch('getBlacklist')
                        this.getFriendList()
                    })
                    .catch(imError => {
                        this.$store.commit('showMessage', {
                            message: imError.message,
                            type: 'error'
                        })
                    })
            },
            removeFromBlacklist() {
                this.tim.removeFromBlacklist({userIDList: [this.userProfile.userID]}).then(() => {
                    this.$store.commit('removeFromBlacklist', this.userProfile.userID)
                })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            getDetail() {
                const userId = this.userProfile.userID
                this.requestPost('user/getUserByUserId', {
                        userId: userId
                    }, res => {
                        if (res.data.departName) {
                            this.form.departName = res.data.departName
                        } else {
                            this.form.departName = '待完善'
                        }
                        if (res.data.position) {
                            this.form.position = res.data.position
                        } else {
                            this.form.position = '待完善'
                        }
                        if (res.data.card) {
                            this.form.card = res.data.card
                        } else {
                            this.form.card = '待完善'
                        }
                        if (res.data.email) {
                            this.form.email = res.data.email
                        } else {
                            this.form.email = '待完善'
                        }
                    },
                    error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.msg
                        })
                    })
            },
            editRemark() {
                this.requestPost('user/updateFriend', {
                    'From_Account': this.userApi().userId,//当前用户id
                    'UpdateItem':
                        [
                            {
                                'To_Account': this.userProfile.userID,//好友的 UserID
                                'SnsItem':
                                    [
                                        {
                                            'Tag': 'Tag_SNS_IM_Remark',
                                            'Value': this.form.friendRemark
                                        },
                                        {
                                            'Tag': 'Tag_SNS_Custom_Remark',
                                            'Value': this.form.friendRemark
                                        }
                                    ]
                            }
                        ]
                }, () => {
                    this.showEditRemark = false
                    this.tim.getConversationList().then(() => {
                    })
                },)
            },
            deleteFriend() {
                this.requestPost('user/deleteFriend', {
                    From_Account:this.userApi().userId,
                    To_Account:[this.userProfile.userID],
                    DeleteType:'Delete_Type_Both'
                },()=>{
                        this.$store.commit('showMessage', {
                            type: 'success',
                            message: '删除好友成功'
                        })
                        this.getFriendList()
                        this.deleteConversation()
                    },error=>{
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.msg
                        })
                    })
            },
            deleteConversation() {
                this.tim
                    .deleteConversation(this.conversationID)
                    .then(() => {
                        this.$store.commit('resetCurrentConversation')
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            message: `会话【${this.conversationName}】删除失败!, error=${error.message}`,
                            type: 'error'
                        })
                    })
            },
        }
    }
</script>

<style lang="stylus" scoped>
  .info-item {
    margin-bottom: 12px;
  }

  .label {
    font-size: 14px;
    color: $secondary;
  }

  .content {
    color: $background;
    word-wrap: break-word;
    word-break: break-all;
  }

  .profile-user
    width 100%
    text-align center
    padding 0 20px

    .avatar
      width 160px
      height 160px
      border-radius 50%
      margin 30px auto

    .nick-name
      width 100%
      color $base
      font-size 20px
      font-weight bold
      text-shadow $font-dark 0 0 0.1em

      .anonymous
        color $first
        text-shadow none

    .gender
      padding 5px 0 10px 0
      border-bottom 1px solid $border-base

    .btn-add-blacklist
      color $danger
</style>
