<template>
  <div style="height: 100%">
    <div style="margin-top: 20px">
      <div style=" border-bottom:  1px solid #e7e7e7">
        <group-member-list :groupProfile="groupProfile"/>
      </div>
      <div class="group-info-content">
        <div class="info-item">
          <div class="label">
            群公告
            <i
              class="el-icon-edit"
              v-if="editable"
              @click="
            showEditNotification = true
            inputFocus('editNotification')
          "
              style="cursor:pointer; font-size:16px;"></i>
          </div>
          <div class="long-content" :title="groupProfile.notification" v-if="!showEditNotification">
            {{ groupProfile.notification || '暂无' }}
          </div>

          <el-input
            ref="editNotification"
            v-else
            autofocus
            v-model="notification"
            size="mini"
            @blur="showEditNotification = false"
            @keydown.enter.native="editNotification"
          />
        </div>
        <div class="info-item">
          <div class="label">
            我的群名片
            <i
              class="el-icon-edit"
              @click="
              showEditNameCard = true
              inputFocus('editNameCard')
            "
              style="cursor:pointer; font-size:16px;"></i>
          </div>
          <div class="content cursor-pointer" v-if="!showEditNameCard">
            {{ groupProfile.selfInfo.nameCard || '暂无' }}
          </div>
          <el-input
            ref="editNameCard"
            v-else
            autofocus
            v-model="nameCard"
            size="mini"
            @blur="showEditNameCard = false"
            @keydown.enter.native="editNameCard"
          />
        </div>
        <div class="info-item">
          <div class="label">
            群名称
            <i
              class="el-icon-edit"
              v-if="editable"
              @click="
            showEditName = true
            inputFocus('editName')
          "
              style="cursor:pointer; font-size:16px;"></i>
          </div>

          <div class="content text-ellipsis" :title="groupProfile.name" v-if="!showEditName">
            {{ groupProfile.name || '暂无' }}
          </div>
          <el-input
            ref="editName"
            v-else
            autofocus
            v-model="name"
            size="mini"
            @blur="showEditName = false"
            @keydown.enter.native="editName"
          />
        </div>
        <div class="info-item" v-if="groupProfile.type !== 'Private'">
          <div class="label">
            申请加群方式
            <i
              class="el-icon-edit"
              v-if="editable"
              @click="
            showEditJoinOption = true
            inputFocus('editJoinOption')
          "
              style="cursor:pointer; font-size:16px;"></i>
          </div>
          <div class="content" v-show="!showEditJoinOption">
            {{ joinOptionMap[groupProfile.joinOption] }}
          </div>
          <el-select
            ref="editJoinOption"
            v-model="joinOption"
            v-show="showEditJoinOption"
            size="mini"
            automatic-dropdown
            @blur="showEditJoinOption = false"
            @change="editJoinOption"
          >
            <el-option label="自由加入" value="FreeAccess"></el-option>
            <el-option label="需要验证" value="NeedPermission"></el-option>
            <el-option label="禁止加群" value="DisableApply"></el-option>
          </el-select>
        </div>
        <div class="info-item">
          <div class="label">群消息提示</div>
          <div class="long-content ">
            <div class="row justify-content-between px-3">
              <div>开启消息提示</div>
              <div>
                <el-switch
                  @change="editMessageRemindType"
                  v-model="messageRemindType"
                  active-value="AcceptAndNotify"
                  inactive-value="AcceptNotNotify">
                </el-switch>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div v-if="isOwner" class="mx-3 mt-3">
            <el-button class="w-100" @click="showGroupMember">转让群主</el-button>
          </div>
          <div v-if="!isOwner" class="mx-3 mt-3">
            <el-popconfirm
              title="确认退出该群吗？"
              @onConfirm="quitGroup">
              <el-button class="w-100" slot="reference">退出群聊</el-button>
            </el-popconfirm>
          </div>
          <div v-if="showDismissGroup" class="mx-3 mt-3">
            <el-popconfirm
              title="确认解散该群吗？"
              @onConfirm="dismissGroup">
              <el-button slot="reference" class="w-100">解散该群</el-button>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="row justify-content-between pt-1 top" style="height:15%;padding-left: 25px;padding-right: 25px;">
        <div class="member-count text-ellipsis" style="font-size: 14px;color:#A8AFBA">
          群成员：{{currentConversation.groupProfile.memberCount}}
        </div>
        <div slot="reference" class="btn-add-member" title="添加群成员" @click="handleAddButtonClick"
             style="cursor: pointer">
          <span class="tim-icon-friend-add" style="color: #007bff;font-size: 18px"></span>
        </div>
      </div>

      <div style="height:85%;overflow-y: auto;overflow-x: hidden">
        <div v-for="member in members" :key="member.userID" style="padding-left: 25px;padding-right: 25px;padding-bottom: 8px;padding-top: 8px">
          <popover placement="right" :key="member.userID" >
            <group-member-info :member="member"/>
            <div slot="reference" class="row align-items-center">
              <div>
                <avatar :src="member.avatar" style="width:32px;height:32px;border-radius: 90%"/>
              </div>
              <div class="ml-2 col text-truncate align-items-center" style="font-size: 14px;width: 150px">
                <span v-if="member.nameCard" :title=member.nameCard>{{ member.nameCard }}</span>
                <span v-else-if="member.nick" :title=member.nick>{{ member.nick }}</span>
              </div>
            </div>
          </popover>
        </div>
      </div>
    </div>
    <group-dialog ref="groupAdd" :showDialog="showAddGroup" @closeGroup="closeAddGroup"></group-dialog>

    <el-dialog title="转让群主"
               :visible="showChangeGroupOwner"
               :before-close="closeGroup"
               width="600px">
      <el-input
        @focus="startSearch"
        @blur="endSearch"
        size="mini"
        v-model="keyword"
        placeholder="请输入昵称"
        prefix-icon="el-icon-search"
      ></el-input>
      <div @click="chooseOwner(item)" v-for="item in getAllMemberList" :key="item.userID">
        <div class="scroll-container">
          <div class="item">
            <el-checkbox v-model="item.isChecked" class="mt-3 mr-3"></el-checkbox>
            <avatar :src="item.avatar"/>
            <div class="group-name ">{{ item.nick }}</div>
          </div>
        </div>
        <div style="width: 80%;height: 1px;background: #E9EBEC;margin-left: 80px"></div>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="closeGroup" size="small">取 消</el-button>
                <el-button type="primary" @click="handleConfirmChangeOwner" size="small">确 定</el-button>
              </span>
    </el-dialog>
  </div>
</template>

<script>
    import GroupMemberList from './group-member-list.vue'
    import {Select, Option, Popconfirm, Checkbox, Switch, Popover} from 'element-ui'
    import GroupDialog from '../../group/group-chat-add'
    import {mapState} from 'vuex'
    import GroupMemberInfo from './group-member-info.vue'

    export default {
        props: ['groupProfile'],
        components: {
            GroupMemberList,
            ElSelect: Select,
            ElOption: Option,
            ElPopconfirm: Popconfirm,
            ElCheckbox: Checkbox,
            ElSwitch: Switch,
            GroupDialog,
            GroupMemberInfo,
            Popover
        },
        data() {
            return {
                showAddGroup: false,
                selectMember: null,
                start: false,
                keyword: '',
                memberOffset: 0,
                memberDataAll: [],
                showEditName: false,
                showEditFaceUrl: false,
                showEditIntroduction: false,
                showEditNotification: false,
                showEditJoinOption: false,
                showChangeGroupOwner: false,
                showEditNameCard: false,
                name: this.groupProfile.name,
                avatar: this.groupProfile.avatar,
                introduction: this.groupProfile.introduction,
                notification: this.groupProfile.notification,
                joinOption: this.groupProfile.joinOption,
                newOwnerUserID: '',
                messageRemindType: this.groupProfile.selfInfo.messageRemindType,
                nameCard: this.groupProfile.selfInfo.nameCard || '',
                muteAllMembers: this.groupProfile.muteAllMembers,
                memberCount: this.groupProfile.memberCount,
                joinOptionMap: {
                    FreeAccess: '自由加入',
                    NeedPermission: '需要验证',
                    DisableApply: '禁止加群'
                },
                active: false,
                showChangeOwner: false
            }
        },
        computed: {
            ...mapState({
                currentConversation: state => state.conversation.currentConversation,
                currentMemberList: state => state.group.currentMemberList,
            }),
            members() {
                return this.currentMemberList
            },
            getAllMemberList() {
                return this.memberDataAll.filter(item => {
                    return item.nick.indexOf(this.keyword) >= 0
                })
            },
            editable() {
                return (
                    this.groupProfile.type === this.TIM.TYPES.GRP_WORK ||
                    [this.TIM.TYPES.GRP_MBR_ROLE_OWNER, this.TIM.TYPES.GRP_MBR_ROLE_ADMIN].includes(this.groupProfile.selfInfo.role)
                )
            },
            isOwner() {
                return this.groupProfile.selfInfo.role === this.TIM.TYPES.GRP_MBR_ROLE_OWNER
            },
            isAdmin() {
                return this.groupProfile.selfInfo.role === this.TIM.TYPES.GRP_MBR_ROLE_ADMIN
            },
            showDismissGroup() {
                // 好友工作群不能解散
                // return this.isOwner && this.groupProfile.type !== this.TIM.TYPES.GRP_WORK
                return this.isOwner
            },
            groupType() {
                switch (this.groupProfile.type) {
                    case this.TIM.TYPES.GRP_WORK:
                        return '好友工作群（Work）'
                    case this.TIM.TYPES.GRP_PUBLIC:
                        return '陌生人社交群（Public）'
                    case this.TIM.TYPES.GRP_CHATROOM:
                        return '临时会议群（Meeting）'
                    case this.TIM.TYPES.GRP_AVCHATROOM:
                        return '直播群（AVChatRoom）'
                    default:
                        return ''
                }
            }
        },
        watch: {
            groupProfile(groupProfile) {
                Object.assign(this, {
                    showEditName: false,
                    showEditFaceUrl: false,
                    showEditIntroduction: false,
                    showEditNotification: false,
                    showEditJoinOption: false,
                    showChangeGroupOwner: false,
                    showEditNameCard: false,
                    name: groupProfile.name,
                    avatar: groupProfile.avatar,
                    introduction: groupProfile.introduction,
                    notification: groupProfile.notification,
                    joinOption: groupProfile.joinOption,
                    messageRemindType: groupProfile.selfInfo.messageRemindType,
                    nameCard: groupProfile.selfInfo.nameCard || '',
                    muteAllMembers: groupProfile.muteAllMembers,
                })
            }
        },
        methods: {
            handleAddButtonClick() {
                this.$refs.groupAdd.refreshData()
                this.showAddGroup = true
            },
            closeAddGroup() {
                this.showAddGroup = false
            },
            chooseOwner(item) {
                if (this.selectMember) {
                    this.selectMember.isChecked = false
                }
                item.isChecked = true
                this.selectMember = item
                this.$forceUpdate()
            },
            filter(item) {
                return item.nick.indexOf(this.keyword) >= 0
            },
            startSearch() {
                this.start = true
            },
            endSearch() {
                this.start = false
                this.keyword = ''
            },
            inputFocus(ref) {
                this.$nextTick(() => {
                    this.$refs[ref].focus()
                })
            },
            editName() {
                this.tim
                    .updateGroupProfile({
                        groupID: this.groupProfile.groupID,
                        name: this.name.trim()
                    })
                    .then(() => {
                        this.showEditName = false
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            editFaceUrl() {
                this.tim
                    .updateGroupProfile({
                        groupID: this.groupProfile.groupID,
                        avatar: this.avatar.trim()
                    })
                    .then(() => {
                        this.showEditFaceUrl = false
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            changeMuteStatus() {
                if (this.isOwner || this.isAdmin) {
                    this.tim
                        .updateGroupProfile({
                            muteAllMembers: this.muteAllMembers,
                            groupID: this.groupProfile.groupID
                        })
                        .then(imResponse => {
                            this.muteAllMembers = imResponse.data.group.muteAllMembers
                            if (this.muteAllMembers) {
                                this.active = true
                                this.$store.commit('showMessage', {
                                    message: '全体禁言'
                                })
                            } else {
                                this.active = false
                                this.$store.commit('showMessage', {
                                    message: '取消全体禁言'
                                })
                            }
                        })
                        .catch(error => {
                            this.$store.commit('showMessage', {
                                type: 'error',
                                message: error.message
                            })
                        })
                } else {
                    this.muteAllMembers = this.groupProfile.muteAllMembers
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: '普通群成员不能对全体禁言'
                    })
                }
            },
            editIntroduction() {
                this.tim
                    .updateGroupProfile({
                        groupID: this.groupProfile.groupID,
                        introduction: this.introduction.trim()
                    })
                    .then(() => {
                        this.showEditIntroduction = false
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            editNotification() {
                this.tim
                    .updateGroupProfile({
                        groupID: this.groupProfile.groupID,
                        notification: this.notification.trim()
                    })
                    .then(() => {
                        this.showEditNotification = false
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            editJoinOption() {
                this.tim
                    .updateGroupProfile({
                        groupID: this.groupProfile.groupID,
                        joinOption: this.joinOption
                    })
                    .then(() => {
                        this.showEditJoinOption = false
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            quitGroup() {
                this.tim.quitGroup(this.groupProfile.groupID).then(({data: {groupID}}) => {
                    this.$store.commit('showMessage', {
                        message: '退群成功'
                    })
                    if (groupID === this.groupProfile.groupID) {
                        this.$store.commit('resetCurrentConversation')
                    }
                })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            dismissGroup() {
                // this.tim.dismissGroup(this.groupProfile.groupID).then(({ data: { groupID } }) => {
                //   this.$store.commit('showMessage', {
                //     message: `群：${this.groupProfile.name || this.groupProfile.groupID}解散成功！`,
                //     type: 'success'
                //   })
                //   if (groupID === this.groupProfile.groupID) {
                //     this.$store.commit('resetCurrentConversation')
                //   }
                // })
                // .catch(error => {
                //     this.$store.commit('showMessage', {
                //       type: 'error',
                //       message: error.message
                //     })
                //   })
                this.requestPost('group/destroyGroup', {
                    GroupId: this.groupProfile.groupID
                }, () => {
                    this.$store.commit('showMessage', {
                        message: `群：${this.groupProfile.name || this.groupProfile.groupID}解散成功！`,
                        type: 'success'
                    })
                    this.$store.commit('resetCurrentConversation')
                }, error => {
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: error
                    })
                })
            },
            editMessageRemindType() {
                this.tim
                    .setMessageRemindType({
                        groupID: this.groupProfile.groupID,
                        messageRemindType: this.messageRemindType
                    })
                    .then(() => {
                      this.$store.commit('showMessage', {
                        type: 'success',
                        message: '设置成功'
                      })
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            editNameCard() {
                if (this.nameCard.trim().length === 0) {
                    this.$store.commit('showMessage', {
                        message: '不能设置空的群名片',
                        type: 'warning'
                    })
                    return
                }
                this.tim
                    .setGroupMemberNameCard({
                        groupID: this.groupProfile.groupID,
                        nameCard: this.nameCard.trim()
                    })
                    .then(() => {
                        this.showEditNameCard = false
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            showGroupMember() {
                this.showChangeGroupOwner = true
                if (this.memberDataAll.length === 0) {
                    this.loadMore()
                }
            },
            loadMore() {
                this.tim.getGroupMemberList({
                    groupID: this.groupProfile.groupID,
                    count: 100,
                    offset: this.memberOffset
                }).then(({data}) => {
                    let memberList = data.memberList
                    this.memberDataAll = this.memberDataAll.concat(memberList)
                    if (memberList.length > 0 && memberList.length >= 100) {
                        this.loadMore()
                    }
                })
            },
            handleConfirmChangeOwner() {
                if (!this.selectMember) {
                    this.$store.commit('showMessage', {
                        message: '请选择需要转让的成员',
                        type: 'error'
                    })
                    return
                }
                this.tim
                    .changeGroupOwner({
                        groupID: this.groupProfile.groupID,
                        newOwnerID: this.selectMember.userID
                    })
                    .then(() => {
                        this.showChangeGroupOwner = false
                        this.$store.commit('showMessage', {
                            message: `转让群主成功，新群主：${this.selectMember.nick}`
                        })
                        this.closeGroup()
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            closeGroup() {
                if (this.selectMember) {
                    this.selectMember.isChecked = false
                    this.selectMember = null
                }
                this.showChangeGroupOwner = false
            }
        }
    }
</script>

<style lang="stylus">
  .scroll-container
    overflow-y scroll
    flex 1

  .item
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

  .group-info-content
    .avatar
      width 40px
      height 40px
      border-radius 50%

  .top {
    border-top 1px solid $border-base
  }

  .info-item {
    padding 10px;
    border-bottom: 1px solid #e7e7e7

    .label {
      font-size: 14px;
      color: $secondary;
    }

    .active {
      color: $black
    }

    .content {
      font-size 14px;
      color: $background;
      word-wrap: break-word;
      word-break: break-all;
    }

    .long-content {
      font-size 14px
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .little {
    height 40px
    width 40px
    border-radius 90%
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
</style>
