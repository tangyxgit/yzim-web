<template>
  <message-bubble :isMine=isMine :message=message>
    <template v-for="(item, index) in contentList">
      <span :key="index" v-if="item.name === 'text'" v-html="httpTextHtml(item)"></span>
      <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index"/>
    </template>
  </message-bubble>
  <!-- <div class="chat-bubble">
    <div class="message-content" :class="isMine ? 'message-send' : 'message-received'">
      <template v-for="(item, index) in contentList">
        <span :key="index" v-if="item.name === 'text'">{{ item.text }}</span>
        <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index"/>
      </template>
    </div>
  </div> -->
</template>

<script>
import MessageBubble from '../message-bubble'
import { decodeText } from '../../../utils/decodeText'

export default {
  name: 'TextElement',
  components: {
    MessageBubble
  },
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
  computed: {
    contentList() {
      return decodeText(this.payload)
    }
  },
  methods:{
    httpTextHtml(item) {
      var text = item.text
      // var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
      //var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
      //var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
      var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
      //var reg= /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
      // const v = text.replace(reg, "<a href='$1$2'>$1$2</a>"); //这里的reg就是上面的正则表达式
      // var s = text.replace(reg, "$1$2"); //这里的reg就是上面的正则表达式
      var urls = text.match(reg)
      if(urls && urls.length>0) {
        var eleStyle = this.message.flow==='in'?'text-url-in':'text-url-out'
        urls.forEach(item=>{
          text = text.replace(item,'<a class="text-url-out-in '+eleStyle+'" href="'+item+'" target="_blank">'+item+'</a>')
        })
      }
      return text
    }
  }
}
</script>

<style lang="stylus">
  .text-url-in{
    text-decoration none;
    color $font-dark
  }
  .text-url-out{
    text-decoration none;
    color $font-light
  }
    .text-url-out-in:hover{
       text-decoration underline
     }
// .chat-bubble
//   position relative
//   .message-content
//     font-size 14px
//     position relative
//     max-width 350px
//     word-wrap break-word
//     word-break break-all
//     padding 10px
//     span
//       white-space pre-wrap
//       margin 0
//       text-shadow $regular 0 0 0.05em
//     &::before
//       position: absolute
//       top: 0
//       width: 12px
//       height: 40px
//       content "\e900"
//       font-family 'tim' !important
//       font-size 24px // 32px 在mac上会模糊 24px正常
//   .message-received
//     background-color $white
//     margin-left 15px
//     border-radius 0 4px 4px 4px
//     &::before
//       left -10px
//       transform scaleX(-1)
//       color $white
//     &.new
//       transform: scale(0);
//       transform-origin: top left;
//       animation: bounce 500ms linear both;
//   .message-send
//     background-color $light-primary
//     margin-right 15px
//     border-radius 4px 0 4px 4px
//     color $white
//     &::before
//       right: -10px
//       color $light-primary
//     &.new
//       transform: scale(0);
//       transform-origin: top right;
//       animation: bounce 500ms linear both;

// @keyframes bounce {
//   0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
//   100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
// }
</style>
