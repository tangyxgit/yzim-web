<template>
    <div >
        <div class="friend-item-container  "
             @click="handleFriendClick"
             style="height:56px">
            <div class="row ml-0">
                <div class="pl-4 pt-2 pb-2 ">
                    <avatar :src="friend.profile.avatar"
                            style="border-radius: 5%;width:40px;height:40px;margin-left: 10px"/>
                </div>
                <div class="row align-items-center " style="height: 56px;margin-left: 10px">
                    <el-col style="color: white">{{friend.profile.nick||friend.userID}}</el-col>
                </div>
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
    .friend-item-container :hover {
        background-color $background
    }
</style>
