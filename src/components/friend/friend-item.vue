<template>
    <div >
<!--        <div class="friend-item-container  "-->
<!--             @click="handleFriendClick"-->
<!--             style="height:56px">-->
<!--            <div class="row ml-0">-->
<!--                <div class="pl-4 pt-2 pb-2 ">-->
<!--                    <avatar :src="friend.profile.avatar"-->
<!--                            style="border-radius: 100%;width:50px;height:50px;margin-left: 10px"/>-->
<!--                </div>-->
<!--                <div class="row align-items-center " style="height: 56px;margin-left: 10px">-->
<!--                    <el-col style="color: white">{{friend.profile.nick||friend.userID}}</el-col>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
        <div @click="handleFriendClick" class="scroll-container">
            <div class="group-item">
                <avatar :src="friend.profile.avatar" />
                <div class="group-name text-ellipsis">{{ friend.profile.nick||friend.userID }}</div>
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
        methods: {
            handleFriendClick() {
                this.tim.getConversationProfile(`C2C${this.friend.userID}`).then(({data}) => {
                    this.$store.commit('updateCurrentConversation', data.conversation)
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
    .scroll-container
        overflow-y scroll
        flex 1
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
