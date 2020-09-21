<template>
  <div>
    <el-row class="friend-item-container" style="height:48px">
      <el-col :span="6"  class="pl-4 pt-2 pb-2">
        <avatar :src="friend.profile.avatar" style="width: 32px;height: 32px;border-radius: 5px"/>
      </el-col>
      <el-col :span="18" >
        <el-row style="height: 48px;" type="flex" align="middle" class="pl-1">
          <el-col style="font-size: 14px;color: white">{{friend.profile.nick||friend.userID}}</el-col>
        </el-row>
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
