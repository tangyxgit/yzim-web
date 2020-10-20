<template>
    <div class="login-wrapper" v-if="showLogin">
        <div class="text-left w-100">
            <div>
                <img class="logo" :src="logo"/>
            </div>
            <div class="mt-1">
                <strong style="font-size: 24px">欢迎使用元信</strong>
            </div>
            <div style="color: #787878" class="mt-1">
                <span>在元信与你的同事和朋友进行沟通与协作</span>
            </div>
        </div>
        <el-form
                ref="login"
                :rules="rules"
                :model="form"
                label-width="0"
                style="width:100%"
                class="mt-4"
                @keydown.enter.native="submit"
        >
            <el-form-item>
                <el-input autocomplete="off" v-model="params.mobile" clearable placeholder="请输入手机号">
                    <template slot="prepend">+86</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input autocomplete="off" v-model="params.password" type="password" clearable
                          placeholder="请输入密码"></el-input>
            </el-form-item>
        </el-form>
        <el-button
                type="primary"
                :disabled="!params.mobile || !params.password"
                @click="submit"
                style="width:100%;"
                :loading="loading"
        >登录
        </el-button>
        <el-row class="w-100 mt-2">
            <el-col :span="12">
                <div class="text-primary" style="font-size: 10px;cursor:pointer;"
                     @click="$store.commit('userFlag', -2)">还没有账号？立即注册
                </div>
            </el-col>
            <el-col :span="12" class="text-right">
                <div class="text-dark" style="font-size: 10px;cursor: pointer" @click="$store.commit('userFlag', -3)">
                    忘记密码？
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {Form, FormItem} from 'element-ui'
    import logo from '../../assets/image/logo.png'

    export default {
        name: 'Login',
        components: {
            ElForm: Form,
            ElFormItem: FormItem,
        },
        data() {
            const checkUserID = (rule, value, callback) => {
                if (!/^[a-zA-Z][a-zA-Z0-9_]{3,23}$/.test(value)) {
                    callback(new Error('不合法（字母开头+字母/数字，长度4-24)'))
                } else {
                    callback()
                }
            }
            return {
                params: {
                    mobile: '',
                    password: ''
                },
                form: {
                    userID: 'user0',
                    password: ''
                },
                rules: {
                    userID: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkUserID, trigger: 'blur'}
                    ],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                logo: logo,
                registerVisible: false,
                loading: false,
                showLogin: false,
            }
        },
        created() {
            this.$store.commit('fullUserLoading', true)
            const userApi = this.userApi()
            if (userApi && userApi.userId) {
                this.requestPost('user/getUserByUserId', userApi, () => {//检查token是否失效
                    this.login(true)
                }, () => {
                    this.$store.commit('fullUserLoading', false)
                    this.showLogin = true
                })
            } else {
                this.$store.commit('fullUserLoading', false)
                this.showLogin = true
            }
        },
        methods: {
            submit() {
                this.$refs['login'].validate(valid => {
                    if (valid) {
                        // this.login()
                        this.requestPost('user/login', this.params, res => {
                            this.setUserData(res.data)
                            this.setUserToken(res.token)
                            this.login()
                        }, error => {
                            this.$store.commit('showMessage', {
                                type: 'error',
                                message: error.msg
                            })
                        })
                    }
                })
            },
            login(autoLogin) {
                this.loading = true
                this.tim
                    .login({
                        userID: this.userApi().userId,
                        userSig: this.userApi().userSign
                    })
                    .then(() => {
                        this.loading = false
                        this.$store.commit('userFlag', 0)
                        this.$store.commit('startComputeCurrent')
                        this.$store.commit({
                            type: 'GET_USER_INFO',
                            userID: this.userApi().userId,
                            userSig: this.userApi().userSign,
                            sdkAppID: window.genTestUserSig('').SDKAppID
                        })
                        this.$store.commit('fullUserLoading', false)
                        if (!autoLogin) {
                            this.$store.commit('showMessage', {
                                type: 'success',
                                message: '登录成功'
                            })
                        }
                        this.showLogin = true
                    })
                    .catch(error => {
                        this.$store.commit('fullUserLoading', false)
                        this.loading = false
                        this.$store.commit('showMessage', {
                            message: '登录失败：' + error.message,
                            type: 'error'
                        })
                        this.userLogout()
                        this.showLogin = true
                    })
            },
        }
    }
</script>

<style lang="stylus" scoped>
    .login-wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 400px;
        padding: 20px 20px;
        background: $white;
        color: $black;
        border-radius: 5px;
        box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);

        .logo {
            width: 64px;
            height: 64px;
        }

        .register-button {
            width: 100%;
            margin: 6px 0 0 0;
        }

        .user-selector {
            width: 100%;
        }
    }
</style>
