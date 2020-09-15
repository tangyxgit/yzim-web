<template>
    <div class="wrapper">
        <el-page-header @back="backLogin" class="top" content="返回登录">
        </el-page-header>
        <el-form label-position="left">
            <el-input autocomplete="off" v-model="params.mobile" placeholder="请输入手机号" clearable>
                <i slot="prefix" class="el-icon-user el-input__icon"></i>
            </el-input>
            <el-input autocomplete="off" v-model="params.smsCode" placeholder="请输入验证码" class="mt-3">
                <i slot="prefix" class="el-icon-chat-dot-square el-input__icon"></i>
                <el-button slot="append" @click="getCode" :disabled="time>0" loading-text="加载中">
                    <span v-if="time===0">获取验证码</span>
                    <span v-else>
                        <span class="text-primary">{{time}}s</span>
                    </span>
                </el-button>
            </el-input>
            <el-input autocomplete="off" v-model="params.password" type="password" placeholder="请输入您的新密码" clearable
                      class="mt-3">
                <i slot="prefix" class="el-icon-lock el-input__icon"></i>
            </el-input>
            <el-input autocomplete="off" v-model="params.confirmPassword" type="password" placeholder="请再次输入您的新密码"
                      clearable
                      class="mt-3">
                <i slot="prefix" class="el-icon-lock el-input__icon"></i>
            </el-input>
        </el-form>
        <el-button
                :disabled="!params.mobile || !params.smsCode || !params.password || !params.confirmPassword"
                @click="login"
                class="mt-4"
                type="primary"
                style="width:100%; margin-top: 6px;"
        >完成
        </el-button>
    </div>
</template>

<script>
    import {Form, PageHeader} from 'element-ui'
    import {mapState} from 'vuex'

    export default {
        name: 'register',
        components: {
            ElForm: Form,
            ElPageHeader: PageHeader
        },
        computed: {
            ...mapState({
                userFlag: state => state.user.userFlag,
            }),
        },
        data() {
            return {
                time: 0,
                params: {
                    mobile: '',
                    smsCode: '',
                    password: '',
                    confirmPassword: ''
                }
            }
        },
        methods: {
            backLogin() {
                this.$store.commit('userFlag', -1)
            },
            login() {
                if (this.userFlag === -2) {
                    this.requestPost('user/register', this.params, () => {
                        this.$store.commit('showMessage', {
                            type: 'success',
                            message: '注册成功'
                        })
                        this.$store.commit('userFlag', -1)
                    }, error => {
                        this.$store.commit('showMessage', {
                            message: '注册失败：' + error.message,
                            type: 'error'
                        })
                    })
                } else if (this.userFlag === -3) {
                    this.requestPost('user/resetPwd', this.params, () => {
                        this.$store.commit('showMessage', {
                            type: 'success',
                            message: '重置成功'
                        })
                        this.$store.commit('userFlag', -1)
                    }, error => {
                        this.$store.commit('showMessage', {
                            message: '重置失败：' + error.message,
                            type: 'error'
                        })
                    })
                }

            },
            getCode() {
                if (this.params.mobile && this.userFlag === -2) {
                    this.requestPost('user/sendSms', this.params, res => {
                        console.log(res)
                        this.time = 60
                        this.timer = setTimeout(()=> {
                            this.time--
                            if (this.time > 0) {
                                this.timer
                                console.log(4455)
                            } else {
                                clearTimeout(this.timer)
                            }
                        }, 1000)
                    }, error => {
                        console.log(error)
                    })
                } else if (this.params.mobile && this.userFlag === -3) {
                    this.requestPost('user/sendSmsReset', this.params, res => {
                        console.log(res)
                    }, error => {
                        console.log(error)
                    })
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .top {
        /*top:0;*/
        /*left:5px*/
    }

    .wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 400px;
        padding: 40px 50px 40px;
        background: $white;
        color: $black;
        border-radius: 5px;
        box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);
    }
</style>
