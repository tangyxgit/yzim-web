<template>
  <div class="avatar" :class="shape === 'circle' ? 'shape-circle' : ''">
    <img :src="avatarSrc">
  </div>
</template>

<script>
import systemAvatar from '@/assets/image/system.png'
import userAvatar from '@/assets/image/img_contact_default.png'
import groupAvatar from '@/assets/image/img_group_default.png'
export default {
  props: {
    src: String,
    type: {
      type: String,
      default: 'C2C'
    },
    shape: {
      type: String,
      default: 'circle'
    }
  },
  computed: {
    avatarSrc: function () {
      let src = this.src
      if (/^(https:|http:|\/\/)/.test(src)) {
        return src
      } else {
        return this.defaultSrc
      }
    },
    defaultSrc: function () {
      switch(this.type) {
        case 'C2C':
          // 个人头像
          return userAvatar
        case 'GROUP':
          // 群默认头像
          return groupAvatar
        case this.TIM.TYPES.CONV_SYSTEM:
          return systemAvatar
        default:
          // 默认头像
          return userAvatar
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar
  background-color $first
  text-align center
  width 100%
  height 100%
  overflow hidden
  img
    width 100%
    height 100%
.shape-circle
  border-radius 50%
</style>
