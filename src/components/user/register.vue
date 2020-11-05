<template>
  <div class="login-wrapper">
    <div class="text-left w-100">
      <strong style="font-size: 24px">{{userFlag===-2?'注册账号':'忘记密码'}}</strong>
    </div>
    <el-form
      label-width="0"
      class="mt-4"
      style="width:100%">
      <el-form-item>
        <el-input autocomplete="off" v-model="params.mobile" placeholder="请输入手机号" clearable>
          <template slot="prepend">+86</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input autocomplete="off" v-model="params.smsCode" placeholder="请输入验证码">
          <el-button :loading="sendSms" slot="append" @click="getCode" :disabled="time>0"
                     loading-text="发送中..." style="width: 100px">
            <span v-if="time===0">{{sendSms?'发送中...':'获取验证码'}}</span>
            <span v-else>
                            <van-count-down :time="time" @finish="time=0">
                                <template v-slot="timeData">
                                    <span class="text-primary">{{timeData.seconds}}秒</span>
                                </template>
                            </van-count-down>
                    </span>
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input autocomplete="off" v-model="params.password" type="password" placeholder="请输入长度6-16的密码，需包含大小写字母和数字"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input autocomplete="off" v-model="params.confirmPassword" type="password"
                  placeholder="请再次输入您的新密码"
                  clearable>
        </el-input>
      </el-form-item>
    </el-form>
    <el-button
      :disabled="!params.mobile || !params.smsCode || !params.password || !params.confirmPassword || (userFlag===-2 && !checked)"
      @click="login"
      type="primary"
      style="width:100%; margin-top: 6px;"
    >完成
    </el-button>
    <!--        <div style="font-size: 12px;color: #787878" class="my-2">-->
    <!--            <span v-if="userFlag===-2">注册即代表同意<a style="color: #787878;text-decoration: none" href="https://yinsi.yzmetax.com/agreement.html" target="_blank">《用户协议》</a><a style="color: #787878;text-decoration: none" href="https://yinsi.yzmetax.com/conceal.html" target="_blank">《隐私政策》</a></span>-->
    <!--        </div>-->
    <el-checkbox v-if="userFlag===-2" v-model="checked" label="1" class="mt-2"><span
      style="font-size: 12px;color: #787878">注册即代表同意<a style="color: #007bff;text-decoration: none"
                                                       href="https://yinsi.yzmetax.com/agreement.html" target="_blank">《用户协议》</a><a
      style="color: #007bff;text-decoration: none" href="https://yinsi.yzmetax.com/conceal.html"
      target="_blank">《隐私政策》</a></span></el-checkbox>
    <div class="text-primary mt-2" style="font-size: 10px;cursor:pointer;" @click="$store.commit('userFlag', -1)">
      已有账号，去登录
      >
    </div>
  </div>
</template>

<script>
    import {Form, FormItem, Checkbox} from 'element-ui'
    import {mapState} from 'vuex'
    import {CountDown} from 'vant'

    export default {
        name: 'register',
        components: {
            ElForm: Form,
            ElFormItem: FormItem,
            ElCheckbox: Checkbox,
            [CountDown.name]: CountDown
        },
        computed: {
            ...mapState({
                userFlag: state => state.user.userFlag,
            }),
        },
        data() {
            return {
                checked: false,
                time: 0,
                sendSms: false,
                params: {
                    mobile: '',
                    smsCode: '',
                    password: '',
                    confirmPassword: '',
                    code: ''
                }
            }
        },
        methods: {
            login() {
                if (this.params.password !== this.params.confirmPassword) {
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: '两次密码不一致'
                    })
                    return
                }
                var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,16}$/
                if (!reg.test(this.params.password)) {
                    this.$store.commit('showMessage', {
                        message: '请输入长度6-16的密码，需包含大小写字母和数字',
                        type: 'error'
                    })
                    return
                }
                if (this.userFlag === -2) {
                    this.requestPost('user/register', this.params, () => {
                        this.$store.commit('showMessage', {
                            type: 'success',
                            message: '注册成功'
                        })
                        this.$store.commit('userFlag', -1)
                    }, error => {
                        this.$store.commit('showMessage', {
                            message: '注册失败：' + error.msg,
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
                            message: '重置失败：' + error.msg,
                            type: 'error'
                        })
                    })
                }

            },
            getCode() {
                if (!this.params.mobile) {
                    this.$store.commit('showMessage', {
                        message: '请输入手机号',
                        type: 'error'
                    })
                    return
                }
                if (this.userFlag === -2) {
                    this.params.code = 1
                } else if (this.userFlag === -3) {
                    this.params.code = 2
                }
                this.sendSms = true
                this.requestPost('user/sendSms', this.params, () => {
                    this.sendSms = false
                    this.time = 60 * 1000
                }, error => {
                    this.sendSms = false
                    this.$store.commit('showMessage', {
                        message: error.msg,
                        type: 'error'
                    })
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
  .top {
    /*top: 0;*/
    /*left: 15px*/
  }

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
  }
</style>
