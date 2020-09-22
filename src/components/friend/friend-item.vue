<template>
  <div>
    <div class="friend-item-container row" style="height:56px">
      <div class="pl-4 pt-2 pb-2 ">
        <avatar :src="friend.profile.avatar" style="border-radius: 5%;width:40px;height:40px;margin-left: 10px"/>
      </div>
        <div class="row align-items-center " style="height: 56px;margin-left: 10px">
          <el-col style="font-size: 14px;color: white">{{friend.profile.nick||friend.userID}}</el-col>
        </div>
    </div>
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
