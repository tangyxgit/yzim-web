<template>
  <div class="group-tip-element-wrapper">{{text}}</div>
</template>

<script>
export default {
  name: 'GroupTipElement',
  props: {
    payload: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: false
    }
  },
  computed: {
    text() {
      return this.getGroupTipContent(this.message)
    }
  },
  methods: {
    getGroupTipContent(message) {
      const userName = message.nick || message.payload.userIDList.join(',')
      if(!message.nick) {
        this.tim.getUserProfile({
          userIDList:message.payload.userIDList
        }).then(imResponse=>{
          let userData = imResponse.data
          let msgNick = ''
          userData.forEach(item=>{
            if(msgNick) {
              msgNick+=','
            }
            msgNick += item.nick
          })
          message.nick = msgNick
        }).catch((imError) => {
          console.warn('getUserProfile error:', imError)// 获取其他用户资料失败的相关信息
        })
      }
      switch (message.payload.operationType) {
        case this.TIM.TYPES.GRP_TIP_MBR_JOIN:
          return `群成员：${userName} 加入群组`
        case this.TIM.TYPES.GRP_TIP_MBR_QUIT:
          return `群成员：${userName} 退出群组`
        case this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
          return `群成员：${userName} 被踢出群组`
        case this.TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
          return `群成员：${userName} 成为管理员`
        case this.TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
          return `群成员：${userName} 被撤销管理员`
        case this.TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED:
          if(message.payload.newGroupProfile.notification) {
            return '群公告：'+message.payload.newGroupProfile.notification
          }else if(message.payload.newGroupProfile.name) {
            return '群昵称修改：'+message.payload.newGroupProfile.name
          }
          return '群资料更改'
        case this.TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED:
          for (let member of message.payload.memberList) {
            if (member.muteTime > 0) {
              return `群成员：${member.userID}被禁言${member.muteTime}秒`
            } else {
              return `群成员：${member.userID}被取消禁言`
            }
          }
          break
        default:
          return '[群提示消息]'
      }

    },
}
}
</script>

<style lang="stylus" scoped>
.group-tip-element-wrapper
  background $white
  padding 4px 15px
  border-radius 3px
  color $secondary
  font-size 12px
  // text-shadow $secondary 0 0 0.05em
</style>
