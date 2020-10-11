<template>
    <div>
        <div @click="handleFriendClick" class="scroll-container">
            <div class="item">
                <el-checkbox v-model="friend.isChecked" :checked="friend.isChecked" style="pointer-events: none" class="mt-3 mr-3"></el-checkbox>
                <avatar :src="friend.profile.avatar" />
                <div class="group-name text-ellipsis">{{ friend.profile.nick||friend.userID }}</div>
            </div>
        </div>
        <div style="width: 80%;height: 0.5px;background: #E9EBEC;margin-left: 80px"></div>
    </div>
</template>

<script>
    import {Checkbox} from 'element-ui'
    export default {
        components:{
            ElCheckbox: Checkbox,
        },
        props: {
            friend: {
                type: Object,
                required: true
            }
        },
        methods: {
            handleFriendClick() {
                this.friend.isChecked = !this.friend.isChecked
                this.$forceUpdate()
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .scroll-container
        overflow-y scroll
        flex 1
    .item
        display flex
        padding 15px 20px
        cursor pointer
        position relative
        overflow hidden
        transition .2s
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
</style>
