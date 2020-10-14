<template>
  <div class="friend-list-container" >
    <div class="header-bar">
      <el-input
              size="mini"
              v-model="keyword"
              placeholder="请输入昵称"
              class="group-seach-bar"
              prefix-icon="el-icon-search"
      ></el-input>
      <button title="添加好友" @click="show=true">
        <i class="tim-icon-add"></i>
      </button>
    </div>
    <div>
      <div v-for="friend in getFriendListData" :key="friend.userID">
        <friend-item  :friend="friend" />
      </div>
    </div>
    <friend-dialog :show="show" @closeSearch="closeSearch"></friend-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FriendItem from './friend-item.vue'
import FriendDialog from '../friend/addFriend'
export default {
  components: {
    FriendItem,
      FriendDialog
  },
  computed: {
    ...mapState({
      friendList: state => state.friend.friendList
    }),
    hasFriend() {
      return this.friendList.length > 0
    },
    getFriendListData() {
      return this.friendList.filter(item=>{
        return item.nick.indexOf(this.keyword)>=0
      })
    }
  },
  data() {
    return {
      keyword:'',
        show:false
    }
  },
  methods:{
      closeSearch() {
          this.show = false
      },
  }
}
</script>

<style lang="stylus" scpoed>
  .friend-list-container
    background white
    height 100%
  .header-bar
    display: flex;
    flex-shrink 0
    height 50px
    border-bottom 1px solid $background-deep-dark
    padding 10px 10px 10px 20px
    .group-seach-bar
      width 100%
      margin-right 10px
      .el-input
        input
          color $first
          border none
          border-radius 30px
          background-color $light-background !important
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
