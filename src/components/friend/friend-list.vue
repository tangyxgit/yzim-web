<template>
  <div class="friend-list-container" :class="{'default': !hasFriend}" >
    <div class="header-bar">
      <el-autocomplete
              :value-key="''"
              :debounce="500"
              size="mini"
              placeholder="输入好友搜索"
              class="group-seach-bar"
              prefix-icon="el-icon-search"
      ></el-autocomplete>
      <button title="创建群组" >
        <i class="tim-icon-add"></i>
      </button>
    </div>
    <div v-if="hasFriend">
      <friend-item v-for="friend in friendList" :key="friend.userID" :friend="friend" />
    </div>
    <div style="color:gray;" v-else>暂无好友</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FriendItem from './friend-item.vue'
import { Autocomplete } from 'element-ui'
export default {
  components: {
    FriendItem,
    ElAutocomplete: Autocomplete
  },
  computed: {
    ...mapState({
      friendList: state => state.friend.friendList
    }),
    hasFriend() {
      return this.friendList.length > 0
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .header-bar
    display: flex;
    flex-shrink 0
    height 50px
    border-bottom 1px solid $background-deep-dark
    padding 10px 10px 10px 20px
    .group-seach-bar
      width 100%
      margin-right 10px
      >>> .el-input
        input
          color $first
          border none
          border-radius 30px
          background-color $deep-background !important
          &::placeholder
            color $font-dark
        .el-icon-search
          color $font-dark
    button
      float right
      display: inline-block;
      cursor: pointer;
      background $background-deep-dark
      border: none
      color: $font-dark;
      box-sizing: border-box;
      transition: .3s;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      margin: 0
      padding 0
      width 30px
      height 30px
      line-height 34px
      font-size: 24px;
      text-align: center;
      white-space: nowrap;
      border-radius: 50%
      outline 0
      flex-shrink 0
      &:hover
        transform: rotate(360deg);
        color $light-primary
.default {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
}
</style>
