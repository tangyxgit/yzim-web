<template>
    <div class="wrapper">
        <el-form label-position="left">
            <el-input autocomplete="off" v-model="params.mobile" placeholder="请输入手机号" clearable>
                <i slot="prefix" class="el-icon-user el-input__icon"></i>
            </el-input>
            <el-input autocomplete="off" v-model="params.smsCode" placeholder="请输入验证码" class="mt-3">
                <i slot="prefix" class="el-icon-chat-dot-square el-input__icon"></i>
                <el-button slot="append" @click="getCode">获取验证码</el-button>
            </el-input>
            <el-input autocomplete="off" v-model="params.password" placeholder="请输入您的新密码" clearable class="mt-3">
                <i slot="prefix" class="el-icon-lock el-input__icon"></i>
            </el-input>
            <el-input autocomplete="off" v-model="params.confirmPassword" placeholder="请再次输入您的新密码" clearable
                      class="mt-3">
                <i slot="prefix" class="el-icon-lock el-input__icon"></i>
            </el-input>
        </el-form>
        <el-button
                class="mt-4"
                type="primary"
                style="width:100%; margin-top: 6px;"
        >完成
        </el-button>
    </div>
</template>

<script>
    import {Form,} from 'element-ui'

    export default {
        name: 'register',
        components: {
            ElForm: Form,
        },
        data() {
            return {
                params: {
                    mobile: '',
                    smsCode: '',
                    password: '',
                    confirmPassword: ''
                }
            }
        },
        methods: {
            getCode() {
                if (this.params.mobile) {
                    this.requestPost('user/sendSms', this.params, res => {
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