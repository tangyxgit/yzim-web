<template>
  <div>
    <el-row class="friend-item-container">
      <el-col :span="6"  class="bg-primary pl-4">
        <avatar :src="friend.profile.avatar" style="width: 32px;height: 32px;border-radius: 5px"/>
      </el-col>
      <el-col :span="18">
        <div class="friend-name bg-success row " style="height: 32px;">{{friend.profile.nick||friend.userID}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    friend: {
      type: Object,
      required: true
    }
  },
  methods:{
    handleFriendClick() {
      this.tim.getConversationProfile(`C2C${this.friend.userID}`).then(({data})=>{
        this.$store.commit('updateCurrentConversation', data)
      })
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
</style>
