<template>
  <div class="friend-list-container">
    <div class="header-bar justify-content-between">
      <strong>我的群聊</strong>
      <button title="创建群聊" @click="AddGroupChat">
        <i class="tim-icon-add"></i>
      </button>
    </div>
    <div class="group-container" >
      <group-item v-for="group in groupList" :key="group.groupID" :group="group"/>
    </div>
    <group-dialog ref="createGroup" :showDialog="showDialog" @closeGroup="closeGroup"></group-dialog>
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    import GroupItem from './group-item.vue'
    import GroupDialog from '../group/group-chat'

    export default {
        data() {
            return {
                groupID: '',
                hideSearchLoading: true,
                showDialog: false
            }
        },
        components: {
            GroupDialog,
            GroupItem,
        },
        computed: {
            ...mapState({
                groupList: state => state.group.groupList
            }),
            ...mapState({
                createGroupModelVisible: state => {
                    return state.group.createGroupModelVisible
                }
            })
        },
        methods: {
            AddGroupChat() {
                this.showDialog = true
                this.$refs.createGroup.refreshData()
            },
            closeGroup() {
                this.showDialog = false
            },
            onGroupUpdated(groupList) {
                this.$store.dispatch('updateGroupList', groupList)
            },
            createGroup() {
                this.$store.commit('updateCreateGroupModelVisible', true)
            },
            closeCreateGroupModel() {
                this.$store.commit('updateCreateGroupModelVisible', false)
            },
            searchGroupByID(queryString, showInSearchResult) {
                if (queryString.trim().length > 0) {
                    this.hideSearchLoading = false
                    this.tim
                        .searchGroupByID(queryString)
                        .then(({data: {group}}) => {
                            showInSearchResult([group])
                        })
                        .catch(() => {
                            this.$store.commit('showMessage', {
                                message: '没有找到该群',
                                type: 'error'
                            })
                        })
                } else {
                    this.hideSearchLoading = true
                }
            },
            showCreateGroupModel() {
                this.$store.commit('updateCreateGroupModelVisible', true)
            },
            applyJoinGroup(group) {
                this.tim
                    .joinGroup({groupID: group.groupID})
                    .then(async res => {
                        switch (res.data.status) {
                            case this.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
                                this.$store.commit('showMessage', {
                                    message: '申请成功，等待群管理员确认。',
                                    type: 'info'
                                })
                                break
                            case this.TIM.TYPES.JOIN_STATUS_SUCCESS:
                                await this.$store.dispatch(
                                    'checkoutConversation',
                                    `GROUP${res.data.group.groupID}`
                                )
                                this.$store.commit('showMessage', {
                                    message: '加群成功',
                                    type: 'success'
                                })
                                break
                            case this.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
                                this.$store.commit('showMessage', {
                                    message: '您已经是群成员了，请勿重复加群哦！',
                                    type: 'info'
                                })
                                break
                            default:
                                break
                        }
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            message: error.message,
                            type: 'error'
                        })
                    })
            }
        }
    }
</script>

<style lang="stylus" scpoed>
  .friend-list-container
    background white
    width 100%
    height 100%
    display flex
    flex-direction column

  .header-bar
    display: flex;
    flex-shrink 0
    height 50px
    border-bottom 1px solid $background-deep-dark
    align-items center

    .group-seach-bar
      width 100%
      margin-right 10px

      .el-input
        input
          color $first
          border none
          border-radius 30px
          background-color $light-background !important

          &::placeholder
            color $font-dark

        .el-icon-search
          color $font-dark

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
      margin: 0
      padding 0
      width 30px
      height 30px
      line-height 34px
      font-size: 24px;
      text-align: center;
      white-space: nowrap;
      border-radius: 50%
      outline 0
      flex-shrink 0

      &:hover
        transform: rotate(360deg);
        color $light-primary


  .group-container
    overflow-y scroll
    overflow-x hidden
    flex 1
  .default {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow-y: scroll;
  }
</style>
