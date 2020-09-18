<template>
    <div class="my-profile-wrapper">
        <el-dialog :visible.sync="showEditMyProfile" class="p-0 m-0" width="32%" center>
            <div slot="title" class="text-center w-100" style="font-size: 15px">编辑个人信息</div>
            <div slot="" class=" w-100 row">
                <div class="col-9 offset-1">
                    <el-form v-model="form" label-width="60px" size="mini">
                        <el-form-item label="头像">
                            <el-input v-model="form.userIcon" placeholder="头像地址(URL)"/>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input v-model="form.nickName" placeholder="昵称"/>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="form.mobile" placeholder="手机号码"/>
                        </el-form-item>
                        <el-form-item label="部门">
                            <el-input v-model="form.departName" placeholder="部门"/>
                        </el-form-item>
                        <el-form-item label="职位">
                            <el-input v-model="form.position" placeholder="职位"/>
                        </el-form-item>
                        <el-form-item label="工号">
                            <el-input v-model="form.card" placeholder="工号"/>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="form.email" placeholder="邮箱"/>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="col-2">
                    <!--                    <avatar :src="currentUserProfile.avatar" style="width:64px;height: 64px"></avatar>-->
                    <!--                    <el-avatar :alt="currentUserProfile.avatar"></el-avatar>-->
                    <!--                    <el-image :src="currentUserProfile.avatar"></el-image>-->
                    <el-upload
                            class="avatar-uploader"
                            action="http://api/upload"
                            :show-file-list="false">
                        <!--                            :on-success="handleAvatarSuccess"-->
                        <!--                            :before-upload="beforeAvatarUpload"-->
                        <!--                        <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                        <!--                        <i class="el-icon-plus avatar-uploader-icon"></i>-->
                        <avatar :src="currentUserProfile.avatar" class="avatar-uploader"
                                style="width:64px;height: 64px;border-radius: 10px"></avatar>
                        <i class="el-icon-plus avatar-uploader-icon" style="z-index:999"></i>
                    </el-upload>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditMyProfile = false">取 消</el-button>
                <el-button type="primary" @click="editMyProfile">确 定</el-button>
            </span>
        </el-dialog>
        <div @click="showEditMyProfile = true">
            <avatar
                    slot="reference"
                    :src="currentUserProfile.avatar"
                    class="my-avatar"
            />
        </div>
    </div>
</template>

<script>
    import {Form, FormItem, Avatar, Image, Upload} from 'element-ui'
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
            ElAvatar: Avatar,
            ElImage: Image,
            ElUpload: Upload,
        },
        data() {
            return {
                showEditMyProfile: false,
                centerDialogVisible: false,
                form: {
                    userId: '',
                    userIcon: '',
                    nickName: '',
                    card: '',
                    position: '',
                    email: '',
                    password: '',
                    departName: ''
                }
            }
        },
        created() {
            this.requestPost('user/getUserByUserId', this.form, res => {
                this.form = res.data
            }, () => {
                this.$store.commit('showMessage', {
                    type: 'error',
                    message: '获取信息失败，请稍后重试'
                })
                this.showEditMyProfile = false
            })
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
            editMyProfile() {
                // if (this.form.avatar && this.form.avatar.indexOf('http') === -1) {
                //     this.$store.commit('showMessage', {
                //         message: '头像应该是 Url 地址',
                //         type: 'warning'
                //     })
                //     this.form.avatar = ''
                //     return
                // }
                // const options = {}
                // // 过滤空串
                // Object.keys(this.form).forEach(key => {
                //     if (this.form[key]) {
                //         options[key] = this.form[key]
                //     }
                // })
                // this.tim
                //     .updateMyProfile(options)
                //     .then(() => {
                //         this.$store.commit('showMessage', {
                //             message: '修改成功'
                //         })
                //         this.showEditMyProfile = false
                //     })
                //     .catch(imError => {
                //         this.$store.commit('showMessage', {
                //             message: imError.message,
                //             type: 'error'
                //         })
                //     })
                this.form.password = '123456'
                this.requestPost('user/update', this.form, res => {
                    console.log(res)
                    this.$store.commit('showMessage', {
                        type: 'success',
                        message: '保存成功'
                    })
                    this.showEditMyProfile = false
                }, () => {
                    this.$store.commit('showMessage', {
                        type: 'error',
                        message: '保存失败，请稍后重试'
                    })
                })
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
        border-radius: 90%;

    .edit-my-profile
        position absolute
        top 10px
        right 10px
        cursor pointer
</style>
