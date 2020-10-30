<template>
  <div>
    <div class="blacklist-item-wrapper">
      <img
              class="avatar"
              :src="profile.avatar ? profile.avatar : 'http://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-2.png'"
      />
      <div class="item">{{profile.nick||profile.userID}}</div>
      <el-button type="text" @click="removeFromBlacklist">取消拉黑</el-button>

    </div>
    <div style="width: 100%;height: 1px;background: #E9EBEC;margin-left: 80px"></div>
  </div>
</template>

<script>
export default {
  name: 'BlacklistItem',
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeFromBlacklist() {
      this.tim
        .removeFromBlacklist({ userIDList: [this.profile.userID] })
        .then(() => {
          this.$store.commit('removeFromBlacklist', this.profile.userID)
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
.item {
  padding-left: 10px;
  width: 100%;
  color: $font-dark;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blacklist-item-wrapper {
  padding 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
