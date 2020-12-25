<template>
    <div class="group-member-list-wrapper">
        <!--        <div class="header">-->
        <!--          <span class="member-count text-ellipsis">群成员：{{currentConversation.groupProfile.memberNum}}</span>-->
        <!--          <div slot="reference" class="btn-add-member" title="添加群成员" @click="handleAddButtonClick">-->
        <!--            <span class="tim-icon-friend-add"></span>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="scroll-content " v-if="members[0]&&members[1]">
            <div class="groupAvatar " style="left:43px;z-index: 99">
                <avatar :src="members[0].avatar "/>
            </div>
            <div class="groupAvatar " style="left:75px;z-index: 90">
                <avatar :src="members[1].avatar"/>
            </div>
            <div class="groupAvatar pointBg" style="left:107px;z-index: 89;background-color:#e9ebec">
                <div class="point" style="z-index: 99;right: 6px;top:28px;background-color: #a8afba"></div>
                <div class="point" style="z-index: 99;right: 13px;top:28px;background-color: #a8afba"></div>
                <div class="point" style="z-index: 99;right: 20px;top:28px;background-color: #a8afba"></div>
            </div>
            <div class="w-100 text-center" style="margin-top: 75px;">
                {{groupProfile.name}}
            </div>

            <!--        <div v-for="member in members" :key="member.userID">-->
            <!--          <popover placement="right" :key="member.userID">-->
            <!--            <group-member-info :member="member" />-->
            <!--            <div slot="reference" class="group-member" @click="currentMemberID = member.userID">-->
            <!--              <avatar :title=getGroupMemberAvatarText(member.role) :src="member.avatar" />-->
            <!--              <div class="member-name text-ellipsis">-->
            <!--                <span v-if="member.nameCard" :title=member.nameCard>{{ member.nameCard }}</span>-->
            <!--                <span v-else-if="member.nick" :title=member.nick>{{ member.nick }}</span>-->
            <!--                <span v-else :title=member.userID>{{ member.userID }}</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--          </popover>-->
            <!--        </div>-->
            <!--      </div>-->
        </div>
        <!--      <div class="more">-->
        <!--        <el-button v-if="showLoadMore" type="text" @click="loadMore">查看更多</el-button>-->
        <!--      </div>-->
        <!--      <group-dialog ref="groupAdd" :showDialog="showAddGroup" @closeGroup="closeGroup"></group-dialog>-->
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        props: ['groupProfile'],
        data() {
            return {
                addGroupMemberVisible: false,
                currentMemberID: '',
                showAddGroup: false,
                name: this.groupProfile.name,
                count: 30 // 显示的群成员数量
            }
        },
        computed: {
            ...mapState({
                currentConversation: state => state.conversation.currentConversation,
                currentMemberList: state => state.group.currentMemberList,
                friendList: state => state.friend.friendList
            }),
            showLoadMore() {
                return this.members.length < this.groupProfile.memberNum
            },
            members() {
                return this.currentMemberList.slice(0, this.count)
            },
        },
        watch: {
            groupProfile(groupProfile) {
                Object.assign(this, {
                    name: groupProfile.name,
                })
            }
        },
        methods: {
            getGroupMemberAvatarText(role) {
                switch (role) {
                    case 'Owner':
                        return '群主'
                    case 'Admin':
                        return '管理员'
                    default:
                        return '群成员'
                }
            },
            handleAddButtonClick() {
                this.$refs.groupAdd.refreshData()
                this.showAddGroup = true
            },
            closeGroup() {
                this.showAddGroup = false
            },
            loadMore() {
                this.$store
                    .dispatch('getGroupMemberList', this.groupProfile.groupID)
                    .then(() => {
                        this.count += 30
                    })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .group-member-list-wrapper
        .header
            height 50px
            padding 10px 16px 10px 20px
            border-bottom 1px solid $border-base

            .member-count
                display inline-block
                max-width 130px
                line-height 30px
                font-size 14px
                vertical-align bottom

            .btn-add-member
                width 30px
                height 30px
                font-size 28px
                text-align center
                line-height 32px
                cursor pointer
                float right

                &:hover
                    color $light-primary

        .scroll-content
            height: 125px;
            overflow-y: auto;
            padding 10px 15px 10px 15px
            width 100%
            position relative
            margin-left 12px

            .groupAvatar
                position absolute
                width 64px
                height 64px
                border-radius 90%
                border 3px solid $white

                .pointBg
                    position relative

                .point
                    position absolute
                    width 4px
                    height 4px
                    border-radius 90%

            .group-member-list

                display flex
                justify-content flex-start
                flex-wrap wrap
                width 100%

            .group-member
                width 60px
                height 60px
                display: flex;
                justify-content center
                align-content center
                flex-direction: column;
                text-align: center;
                color: $black;
                cursor: pointer;

                .avatar
                    width 40px
                    height 40px
                    border-radius 50%

                .member-name
                    font-size 12px
                    width: 40px;
                    text-align center

        .more
            padding 0 20px
            border-bottom 1px solid $border-base

    // .add-group-member {
    //   cursor: pointer;
    // }
    // .add-button {
    //   border: 1px solid gray;
    //   text-align: center;
    //   line-height: 30px;
    // }


</style>
