<template>
    <div class="side-bar-wrapper">
        <div class="bar-left">
            <my-profile/>
            <div class="tab-items" @click="handleClick">
                <div
                    id="conversation-list"
                    class="text-center"
                    v-if="(functionPrem & 1)>0"
                    :class="{ active: showConversationList }"
                    style="cursor:pointer;position: relative"
                    title="消息">
                    <img v-if="showConversationList" src='../../assets/image/icon_chat_fill_24.svg' style="background: #DBEBFE;border-radius: 4px" class="p-2" />
                    <img v-else src='../../assets/image/icon_chat_stroke_24.svg' style="pointer-events: none" class="p-2"/>
                    <sup class="unread" v-if="totalUnreadCount !== 0">
                        <template v-if="totalUnreadCount > 99">99+</template>
                        <template v-else>{{totalUnreadCount}}</template>
                    </sup>
                </div>
                <div
                        id="group-list"
                        class="text-center"
                        v-if="(functionPrem & 2)>0"
                        :class="{ active: showGroupList }"
                        style="cursor:pointer;position: relative;margin-top: 24px"
                        title="我的群组"
                >
                    <img v-if="showGroupList" src='../../assets/image/icon_position_fill_24.svg' style="background: #DBEBFE;border-radius: 4px" class="p-2" />
                    <img v-else src='../../assets/image/icon_chat_group_stroke_24.svg' style="pointer-events: none" class="p-2"/>
                </div>
                <div
                        id="friend-list"
                        class="text-center"
                        :class="{ active: showFriendList }"
                        v-if="(functionPrem & 2)>0"
                        title="我的好友"
                        style="cursor:pointer;position: relative;margin-top: 24px"
                        @click="handleRefreshFriend"
                >
                    <img v-if="showFriendList" src='../../assets/image/icon_contact_fill_24.svg' style="background: #DBEBFE;border-radius: 4px" class="p-2" />
                    <img v-else src='../../assets/image/icon_contact_stroke_24.svg' style="pointer-events: none" class="p-2"/>
                </div>
                <div
                        id="black-list"
                        class="text-center"
                        :class="{ active: showBlackList }"
                        v-if="(functionPrem & 2)>0"
                        style="cursor:pointer;position: relative;margin-top: 24px"
                        title="黑名单"
                >
                    <img v-if="showBlackList" src='../../assets/image/icon_block_fill_24.svg' style="background: #DBEBFE;border-radius: 4px" class="p-2" />
                    <img v-else src='../../assets/image/icon_block_stroke_24.svg' style="pointer-events: none" class="p-2"/>
                </div>
                <div
                        id="worktable-list"
                        class="text-center"
                        v-if="(functionPrem & 4)>0"
                        :class="{ active: showWorktable }"
                        title="应用中心"
                        style="cursor:pointer;position: relative;margin-top: 24px"
                >
                    <img v-if="showWorktable" src='../../assets/image/icon_tools_fill_24.svg' style="background: #DBEBFE;border-radius: 4px" class="p-2" />
                    <img v-else src='../../assets/image/icon_tools_stroke_24.svg' style="pointer-events: none" class="p-2"/>
                </div>
            </div>
            <el-row class="bottom " type="flex" justify="center" align="middle" v-if="isYzApp()">
                <el-popover placement="right" width="300px"  trigger="click" class="p-0" >
                    <span class="mt-1" style="cursor:pointer" @click="change">修改密码</span>
                  <div class="my-2" style="width:100%;height:1px;background: #dddfe5"></div>
                  <span style="cursor:pointer" @click="aboutUs=true">关于我们</span>
                  <div class="my-2" style="width:100%;height:1px;background: #dddfe5"></div>
                    <span style="cursor:pointer" @click="logout">退出登录</span>
<!--                    <el-button slot="reference">click 激活</el-button>-->
                    <div slot="reference" class="el-icon-setting setting" style="font-size: 24px"></div>
                </el-popover>
            </el-row>
        </div>
        <el-dialog :visible.sync="changePassword" class="p-0" width="32%">
            <div slot="title" class="text-center w-100" style="font-size: 15px">修改密码</div>
            <div class="p-2 ">
                <el-form v-model="params" label-width="70px" size="mini">
                    <el-form-item label="旧密码">
                        <el-input type="password" v-model="params.oldPassword" placeholder="请输入旧密码" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input type="password" v-model="params.newPassword" placeholder="密码6-16位，需包含大小写字母和数字" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input type="password" v-model="params.confirmPassword" placeholder="请重复新密码" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="cancelPassword">取 消</el-button>
                <el-button :disabled="!params.oldPassword || !params.newPassword || !params.confirmPassword" size="medium" type="primary" @click="commitPassword">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="aboutUs" class="p-0" width="32%">
        <div slot="title" class="text-center w-100 " style="font-size: 15px">关于我们</div>
        <div class="p-0 pt-2">
          <div class="text-center">
            <img class="logo" :src="logo"/>
          </div>

          <el-collapse class="mt-5 mb-2">
            <el-collapse-item disabled >
              <a slot="title" class="w-100 text-dark" style="text-decoration:none" href="https://yinsi.yzmetax.com/agreement.html" target="_blank">
                《用户协议》
              </a>
            </el-collapse-item>
            <el-collapse-item disabled>
              <a slot="title" class="w-100 text-dark" style="text-decoration:none"  href="https://yinsi.yzmetax.com/conceal.html" target="_blank">
               《隐私政策》
              </a>
            </el-collapse-item>
          </el-collapse>

        </div>
      </el-dialog>
        <div class="bar-right">
            <conversation-list v-show="showConversationList"/>
            <group-list v-show="showGroupList"/>
            <friend-list v-show="showFriendList"/>
            <black-list v-show="showBlackList"/>
            <worktable-list v-show="showWorktable"></worktable-list>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import MyProfile from '../my-profile'
    import ConversationList from '../conversation/conversation-list'
    import GroupList from '../group/group-list'
    import FriendList from '../friend/friend-list'
    import BlackList from '../blacklist/blacklist'
    import WorktableList from '../worktable/worktable'
    import {Popover, Dialog, Form, FormItem ,Collapse, CollapseItem} from 'element-ui'
    import logo from '../../assets/image/logo.png'

    const activeName = {
        CONVERSATION_LIST: 'conversation-list',
        GROUP_LIST: 'group-list',
        FRIEND_LIST: 'friend-list',
        BLACK_LIST: 'black-list',
        WORKTABLE_LIST: 'worktable-list',
    }
    export default {
        name: 'SideBar',
        components: {
            MyProfile,
            ConversationList,
            GroupList,
            FriendList,
            BlackList,
            WorktableList,
            elCollapseItem:CollapseItem,
            ElCollapse:Collapse,
            ElPopover:Popover,
            ElDialog:Dialog,
            ElForm: Form,
            ElFormItem: FormItem

        },
        data() {
            return {
                active: activeName.CONVERSATION_LIST,
                activeName: activeName,
                changePassword:false,
                aboutUs:false,
                logo:logo,
                params: {
                    userId: '',
                    newPassword: '',
                    oldPassword: '',
                    confirmPassword:''
                },
                functionPrem: 0
            }
        },
        mounted() {
            this.functionPrem = this.userApi().functionPerm
        },
        computed: {
            ...mapGetters(['totalUnreadCount']),
            showConversationList() {
                return this.active === activeName.CONVERSATION_LIST
            },
            showGroupList() {
                return this.active === activeName.GROUP_LIST
            },
            showFriendList() {
                return this.active === activeName.FRIEND_LIST
            },
            showBlackList() {
                return this.active === activeName.BLACK_LIST
            },
            showWorktable() {
                return this.active === activeName.WORKTABLE_LIST
            },
            showAddButton() {
                return [activeName.CONVERSATION_LIST, activeName.GROUP_LIST].includes(
                    this.active
                )
            }
        },
        methods: {
            checkoutActive(name) {
                this.active = name
            },
            change() {
                this.params.oldPassword = ''
                this.params.newPassword = ''
                this.params.confirmPassword = ''
                this.changePassword = true
            },
            commitPassword() {
                if(this.params.newPassword !== this.params.confirmPassword) {
                    this.$store.commit('showMessage',{
                        type: 'error',
                        message: '两次密码不一致'
                    })
                    return
                }
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,16}$/
                if (!reg.test(this.params.newPassword)) {
                    this.$store.commit('showMessage', {
                        message: '请输入长度6-16的密码，需包含大小写字母和数字',
                        type: 'error'
                    })
                    return
                }
                this.params.userId = this.userApi().userId
                this.requestPost('user/updatePwd',this.params,()=>{
                    this.$store.commit('showMessage', {
                        type: 'success',
                        message: '修改成功'
                    })
                    this.changePassword = false
                },error=>{
                    this.$store.commit('showMessage', {
                        message: '修改失败：' + error.msg,
                        type: 'error'
                    })
                })
            },
            cancelPassword() {
                this.changePassword = false
            },
            handleClick(event) {
                switch (event.target.id) {
                    case activeName.CONVERSATION_LIST:
                        this.checkoutActive(activeName.CONVERSATION_LIST)
                        break
                    case activeName.GROUP_LIST:
                        this.checkoutActive(activeName.GROUP_LIST)
                        break
                    case activeName.FRIEND_LIST:
                        this.checkoutActive(activeName.FRIEND_LIST)
                        break
                    case activeName.BLACK_LIST:
                        this.checkoutActive(activeName.BLACK_LIST)
                        break
                    case activeName.WORKTABLE_LIST:
                        this.checkoutActive(activeName.WORKTABLE_LIST)
                }
            },
            handleRefresh() {
                switch (this.active) {
                    case activeName.CONVERSATION_LIST:
                        this.tim.getConversationList().catch(error => {
                            this.$store.commit('showMessage', {
                                type: 'error',
                                message: error.message
                            })
                        })
                        break
                    case activeName.GROUP_LIST:
                        this.getGroupList()
                        break
                    case activeName.FRIEND_LIST:
                        this.getFriendList()
                        break
                    case activeName.BLACK_LIST:
                        this.$store.dispatch('getBlacklist')
                        break
                }
            },
            getGroupList() {
                this.tim
                    .getGroupList()
                    .then(({data: groupList}) => {
                        this.$store.commit('updateGroupList', groupList)
                    })
                    .catch(error => {
                        this.$store.commit('showMessage', {
                            type: 'error',
                            message: error.message
                        })
                    })
            },
            handleRefreshFriend() {
                this.getFriendList()
            },
            logout() {
                this.$store.dispatch('logout')
                this.userLogout()
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .side-bar-wrapper {
        height: 100%;
        color: $black;
        display: flex;
        width: 100%;
        overflow: hidden;

        .bar-left {
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            width: 80px;
            height: $height;
            background-color: $background-deep-dark;

            .tab-items {
                display: flex;
                flex-direction: column;
                flex-grow: 1;

                .iconfont {
                    position: relative;
                    margin: 0;
                    height: 70px;
                    line-height: 70px;
                    text-align: center;
                    font-size: 30px;
                    cursor: pointer;
                    color: #a5b5c1;
                    user-select: none;
                    -moz-user-select: none;
                }

                .active {
                    color: $dark-primary;
                    background-color: $background-light;

                    &::after {
                        content: ' ';
                        display: block;
                        position: absolute;
                        top: 0;
                        z-index: 0;
                        height: 70px;
                        // border-left 4px solid $border-highlight
                        //border-left: 4px solid $light-primary;
                    }
                }

                .unread {
                    position: absolute;
                    top: 0;
                    right: 10px;
                    z-index: 999;
                    display: inline-block;
                    height: 18px;
                    padding: 0 6px;
                    font-size: 12px;
                    color: #FFF;
                    line-height: 18px;
                    text-align: center;
                    white-space: nowrap;
                    border-radius: 10px;
                    background-color: $danger;
                }
            }

            .bottom {
                height: 70px;

                & > span {
                    display: block;
                }

                .btn-more {
                    width: 100%;
                    height: 70px;
                    line-height: 70px;
                    font-size: 30px;
                    color: $first;
                    text-align: center;
                    cursor: pointer;
                }

                .iconfont {
                    height: 70px;
                    line-height: 70px;
                    text-align: center;
                    font-size: 30px;
                    cursor: pointer;
                    color: white;
                    user-select: none;
                    -moz-user-select: none;
                }

                .iconfont:hover {
                    color: white;
                }

                .setting {
                    height: 70px;
                    line-height: 70px;
                    text-align: center;
                    font-size: 30px;
                    cursor: pointer;
                    color: darkgrey;
                    user-select: none;
                    -moz-user-select: none;
                }
            }

            .btn-more:hover {
                color: $white;
            }
        }

        .bar-right {
            // flex 1
            flex: 1 1 auto;
            width: 100%;
            min-width: 0;
            height: $height;
            position: relative;
            background-color: $background-dark;
        }
      .logo {
        width: 64px;
        height: 64px;
      }
    }
</style>
