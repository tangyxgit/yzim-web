<template>
<message-bubble :isMine=isMine :message=message>
  <div class="custom-element-wrapper">
    <div class="survey"  v-if="this.payload.data === 'survey'">
      <div class="title">对IM DEMO的评分和建议</div>
      <el-rate
          v-model="rate"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}">
      </el-rate>
      <div class="suggestion">{{this.payload.extension}}</div>
    </div>
    <span class="text" title="不支持的消息，请在手机上查看" v-else>{{text}}</span>
  </div>
</message-bubble>
</template>

<script>
import MessageBubble from '../message-bubble'
import { Rate } from 'element-ui'
import { ACTION } from '../../../utils/trtcCustomMessageMap'
import { formatDuration } from '../../../utils/formatDuration'

export default {
  name: 'CustomElement',
  props: {
    payload: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean
    }
  },
  components: {
    MessageBubble,
    ElRate: Rate
  },
  computed: {
    text() {
      return this.translateCustomMessage(this.payload)
    },
    rate() {
      return parseInt(this.payload.description)
    }
  },
  methods: {
    translateCustomMessage(payload) {
      let videoPayload = {}
      try{
        videoPayload = JSON.parse(payload.data)
      } catch(e) {
        videoPayload = {}
      }
      if (payload.data === 'group_create') {
        const extension = payload.extension
        if(extension) {
          const id = extension.substring(0,extension.indexOf('创建群组'))
          if(id) {
            this.tim.getUserProfile({
              userIDList:[id]
            }).then(imResponse=>{
              let userData = imResponse.data
              let msgNick = ''
              userData.forEach(item=>{
                if(msgNick) {
                  msgNick+=','
                }
                msgNick += item.nick
              })
              payload.extension = msgNick+' 发起了群聊'
            })
          }
        }
        return `${payload.extension}`
        // return '发起群聊'
      }
      switch (videoPayload.action) {
        case ACTION.VIDEO_CALL_ACTION_DIALING:
          return '[请求通话]'
        case ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL:
          return '[取消通话]'
        case ACTION.VIDEO_CALL_ACTION_REJECT:
          return '[拒绝通话]'
        case ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT:
          return '[无应答]'
        case ACTION.VIDEO_CALL_ACTION_ACCEPTED:
          return '[开始通话]'
        case ACTION.VIDEO_CALL_ACTION_HANGUP:
          return `[结束通话，通话时长：${formatDuration(videoPayload.duration)}]`
        case ACTION.VIDEO_CALL_ACTION_LINE_BUSY:
          return '[正在通话中]'
        case ACTION.VIDEO_CALL_ACTION_ERROR:
          return '[设备异常]'
        default:
          return '[不支持的消息，请在手机上查看]'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.text
  font-weight bold
.title
  font-size 16px
  font-weight 600
  padding-bottom 10px
.survey
  background-color white
  color black
  padding 20px
  display flex
  flex-direction column
.suggestion
  padding-top 10px
  font-size 14px
</style>
