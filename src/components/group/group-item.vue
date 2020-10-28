<template>
  <div>
    <div @click="handleGroupClick" class="scroll-container">
      <div class="group-item">
        <avatar type="GROUP" :src="group.avatar" />
        <div class="group-name text-ellipsis">{{ group.name }}</div>
      </div>
    </div>
    <div style="width: 100%;height: 0.5px;background: #E9EBEC;margin-left: 80px"></div>
  </div>
</template>

<script>
export default {
  props: ['group'],
  data() {
    return {
      visible: false,
      options: [
        {
          text: '退出群组',
          handler: this.quitGroup
        }
      ]
    }
  },
  methods: {
    handleGroupClick() {
      const conversationID = `GROUP${this.group.groupID}`
      this.$store.dispatch('checkoutConversation', conversationID)
    },
    quitGroup() {
      this.tim.quitGroup(this.group.groupID)
      .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .scroll-container
    /*overflow-y scroll*/
    /*flex 1*/
  .group-item
    display flex
    padding 15px 20px
    cursor pointer
    position relative
    overflow hidden
    transition .2s
    &:hover
      background-color $dark-primary
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
  .group-name:hover{
    color white
  }
</style>
