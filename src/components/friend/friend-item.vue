<template>
  <div>
    <el-row class="friend-item-container" style="height:56px">
      <el-col :span="8"  class="pl-4 pt-2 pb-2">
        <avatar :src="friend.profile.avatar" style="border-radius: 5%;width:40px;height:40px"/>
      </el-col>
      <el-col :span="16" >
        <el-row  type="flex" align="middle" style="height: 56px;" class="pl-1">
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
