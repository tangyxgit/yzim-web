<template>
  <div class="list-container" style="width: 100%" >
    <div class="header-bar">
      <strong>黑名单</strong>

    </div>
    <blacklist-item
            v-for="item in blacklist"
            :key="item.userID"
            :profile="item"
    />
  </div>
</template>

<script>
import BlacklistItem from './blacklist-item'
import { mapState } from 'vuex'
export default {
  name: 'Blacklist',
  components: {
    BlacklistItem
  },
  computed: {
    ...mapState({
      blacklist: state => state.blacklist.blacklist
    }),
    hasBlacklist() {
      return this.blacklist.length > 0
    }
  }
}
</script>

<style lang="stylus" scoped>
  .list-container
    height 100%
    width 100%
    display flex
    background white
    flex-direction column
    .group-container
      overflow-y scroll
    .header-bar
      display: flex;
      flex-shrink 0
      height 50px
      border-bottom 1px solid $background-deep-dark
      align-items center
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
    .scroll-container
      overflow-y scroll
      flex 1

</style>
