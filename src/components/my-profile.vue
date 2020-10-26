<template>
    <div class="my-profile-wrapper">
        <el-dialog :visible.sync="showEditMyProfile" width="600px" >
            <div slot="title" class="text-center w-100" style="font-size: 15px;">编辑个人信息</div>
            <el-row>
                <el-col :span="18">
                    <div class="offset-1">
                        <el-form v-model="form" label-width="60px" size="mini">
                            <el-form-item label="昵称">
                                <el-input v-model="form.nickName" placeholder="昵称"/>
                            </el-form-item>
                            <el-form-item label="手机">
                                <el-input @focus="changePhone = true" v-model="form.mobile" placeholder="手机号码"/>
                            </el-form-item>
<!--                            <el-form-item label="部门">-->
<!--                                <el-input v-model="form.departName" placeholder="部门"/>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="职位">-->
<!--                                <el-input v-model="form.position" placeholder="职位"/>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="工号">-->
<!--                                <el-input v-model="form.card" placeholder="工号"/>-->
<!--                            </el-form-item>-->
                            <el-form-item label="邮箱">
                                <el-input v-model="form.email" placeholder="邮箱"/>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="6" class="row justify-content-center pl-4">
                    <el-upload
                            class="avatar-uploader "
                            :action="uploadAvatarUrl"
                            style="border-radius: 100%;position: relative"
                            :on-success="avatarSuccess"
                            :on-error="avatarError"
                            :show-file-list="false">
                        <!--                        <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                        <avatar :src="form.userIcon?form.userIcon:currentUserProfile.avatar" class="avatar-uploader"
                                style="width:64px;height: 64px;border-radius: 100%;z-index: 0"></avatar>
                        <div style="z-index:99999;
                           position: absolute;
                           top: 0;
                           left: 0;
                           text-align: center;
                           background: rgba(0,0,0,.4);
                           width: 100%;
                           height: 100%;display: flex;align-items: center;justify-content: center">
                            <i class="el-icon-camera" style="color: white;font-size: 20px"></i>
                        </div>
                    </el-upload>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditMyProfile = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editMyProfile" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="changePhone" class="p-0" width="32%" center>
            <div slot="title" class="text-center w-100" style="font-size: 15px">修改手机号</div>
            <div class="p-2">
                <el-form v-model="params" label-width="100px" size="mini">
                    <el-form-item label="新的手机号">
                        <el-input v-model="params.mobile" placeholder="新的手机号" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码">
                        <el-input v-model="params.smsCode" autocomplete="off">
                            <el-button :loading="sendSms" @click="getCode" type="primary" slot="append"
                                       :disabled="time>0"
                                       placeholder="请输入验证码" style="width: 100px">
                                <span v-if="time === 0">{{sendSms?'发送中...':'获取验证码'}}</span>
                                <span v-if="time>0">
                                    <van-count-down :time="time" @finish="time=0">
                                        <template v-slot="timeData">
                                             <span class="text-primary">{{timeData.seconds}}s</span>
                                        </template>
                                    </van-count-down>
                                </span>
                            </el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="cancelCommit">取 消</el-button>
                <el-button size="medium" type="primary" @click="commitPhone">完 成</el-button>
            </span>
        </el-dialog>
        <div @click="openProfile">
            <avatar
                    slot="reference"
                    :src="currentUserProfile.avatar"
                    class="my-avatar"
            />
        </div>
    </div>
</template>

<script>
    import {Form, FormItem, Upload} from 'element-ui'
    import {CountDown} from 'vant'
    import {mapState} from 'vuex'
    // import ProfileCard from './profile-card'
    export default {
        name: 'MyProfile',
        components: {
            // ElPopover: Popover,
            // ProfileCard,
            ElForm: Form,
            ElFormItem: FormItem,
            // ElRadioGroup: RadioGroup,
            // ElRadio: Radio,
            ElUpload: Upload,
            [CountDown.name]: CountDown,
        },
        data() {
            return {
                showEditMyProfile: false,
                changePhone: false,
                time: 0,
                sendSms: false,
                uploadAvatarUrl:this.baseUrl+'api/upload/',
                form: {
                    userId: '',
                    userIcon: '',
                    nickName: '',
                    card: '',
                    position: '',
                    email: '',
                    password: '',
                    departName: ''
                },
                params: {
                    mobile: '',
                    userId: '',
                    smsCode: '',
                    oldMobile: '',
                    code: 3
                }
            }
        },
        computed: {
            ...mapState({
                currentUserProfile: state => state.user.currentUserProfile,
                currentConversation: state => state.conversation.currentConversation
            }),
            gender() {
                switch (this.currentUserProfile.gender) {
                    case this.TIM.TYPES.GENDER_MALE:
                        return '男'
                    case this.TIM.TYPES.GENDER_FEMALE:
                        return '女'
                    default:
                        return '暂无'
                }
            }
        },
        methods: {
            openProfile() {
                this.requestPost('user/getUserByUserId', {
                    userId:this.userApi().userId
                }, res => {
                    this.form = res.data
                    this.showEditMyProfile = true
                }, () => {
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: '获取信息失败，请稍后重试'
                    })
                    this.showEditMyProfile = false
                })
            },
            avatarSuccess(response, file, fileList) {
                // console.log("avatar success",response,file,fileList)
                if(response.code===200) {
                    this.form.userIcon = response.data.userIcon;
                    this.editMyProfile()
                }
            },
            avatarError(err, file, fileList){
                // console.log("avatar err",response,file,fileList)

            },
            editMyProfile() {
                this.requestPost('user/update', this.form, () => {
                    this.$store.commit('showMessage', {
                        type: 'success',
                        message: '保存成功'
                    })
                    let option = {
                        nick:this.form.nickName,
                    }
                    if(this.form.userIcon) {
                        option.avatar = this.form.userIcon
                    }
                    this.tim.updateMyProfile(option)
                    this.showEditMyProfile = false
                }, () => {
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: '保存失败，请稍后重试'
                    })
                })
            },
            getCode() {
                if (!this.params.mobile) {
                    this.$store.commit('showMessage', {
                        message: '请输入新的手机号',
                        type: 'error'
                    })
                    return
                }
                this.sendSms = true
                this.requestPost('user/sendSms', this.params, res => {
                    this.sendSms = false
                    this.time = 60 * 1000
                }, error => {
                    this.sendSms = false
                    this.$store.commit('showMessage', {
                        message: error.msg,
                        type: 'error'
                    })
                })

            },
            commitPhone() {
                this.params.userId = this.userApi().userId
                this.params.oldMobile = this.form.mobile
                this.requestPost('user/updateMobile', this.params, () => {
                    this.form.mobile = this.params.mobile
                    this.$store.commit('showMessage', {
                        type: 'success',
                        message: '修改成功'
                    })
                    this.changePhone = false
                }, error => {
                    this.$store.commit('showMessage', {
                        message: '修改失败：' + error.msg,
                        type: 'error'
                    })
                })
            },
            cancelCommit() {
                this.changePhone = false
                this.params.mobile = ''
                this.params.smsCode = ''
                this.time = 0
            },
        }
    }
</script>

<style lang="stylus" scoped>
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 64px;
        height: 64px;

    }

    .avatar-uploader-icon {
        font-size: 20px;
        color: black;
        width: 15px;
        height: 15px;
        line-height: 60px;
        padding-left: 20px;
        z-index: 999
    }

    .my-profile-wrapper
        width 50px
        height 50px
        margin 15px

        & > span
            display: block;
            width: 100%;
            height: 100%;

        .popover
            top 15px
            left 15px
            width 50px
            height 50px
            padding none
            border none
            border-radius 20%

    .my-avatar
        cursor pointer
        width 50px;
        height 50px;
        border-radius 100%

    .edit-my-profile
        position absolute
        top 10px
        right 10px
        cursor pointer

</style>
