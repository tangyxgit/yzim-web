<template>
    <div>
        <div @click="handleFriendClick" class="">
            <div class="group-item">
                <avatar :src="friend.avatar" />
                <div class="group-name text-ellipsis">{{ friend.nick||friend.userID }}</div>
            </div>
        </div>
        <div style="width: 90%;height: 1px;background: #E9EBEC;margin-left: 80px"></div>
    </div>
</template>

<script>
    export default {
        components:{
        },
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
