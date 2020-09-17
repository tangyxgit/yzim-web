<template>
    <div class="my-profile-wrapper">
        <el-dialog :visible.sync="showEditMyProfile" class="p-0 m-0" width="32%" center>
            <div slot="title" class="text-center w-100" style="font-size: 15px">编辑个人信息</div>
            <div slot="" class=" w-100 row">
                <div class="col-9 offset-1">
                    <el-form v-model="form" label-width="60px" size="mini">
                        <el-form-item label="头像">
                            <el-input v-model="form.avatar" placeholder="头像地址(URL)"/>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input v-model="form.nick" placeholder="昵称"/>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input placeholder="手机号码"/>
                        </el-form-item>
                        <el-form-item label="部门">
                            <el-input placeholder="部门"/>
                        </el-form-item>
                        <el-form-item label="职位">
                            <el-input placeholder="职位"/>
                        </el-form-item>
                        <el-form-item label="工号">
                            <el-input placeholder="工号"/>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input placeholder="邮箱"/>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="col-2">
<!--                    <avatar :src="currentUserProfile.avatar" style="width:64px;height: 64px"></avatar>-->
<!--                    <el-avatar :alt="currentUserProfile.avatar"></el-avatar>-->
<!--                    <el-image :src="currentUserProfile.avatar"></el-image>-->
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false">
<!--                            :on-success="handleAvatarSuccess"-->
<!--                            :before-upload="beforeAvatarUpload"-->
<!--                        <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
                        <avatar :src="currentUserProfile.avatar" style="width:64px;height: 64px;border-radius: 10px"></avatar>
                        <i class="el-icon-plus avatar-uploader-icon"></i>
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
<!--        <el-dialog-->
<!--                title="提示"-->
<!--                :visible.sync="showEditMyProfile"-->
<!--                width="30%"-->
<!--                style="padding: 0px;margin: 0"-->
<!--                center>-->
<!--            <div class="bg-danger w-100 h-100">需要注意的是内容是默认不居中的</div>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="centerDialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
<!--  </span>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    import {Form, FormItem, Avatar, Image ,Upload} from 'element-ui'
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
            ElAvatar:Avatar,
            ElImage:Image,
            ElUpload:Upload,
        },
        data() {
            return {
                showEditMyProfile: false,
                centerDialogVisible: false,
                form: {avatar: '', nick: '', gender: ''}
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
            editMyProfile() {
                if (this.form.avatar && this.form.avatar.indexOf('http') === -1) {
                    this.$store.commit('showMessage', {
                        message: '头像应该是 Url 地址',
                        type: 'warning'
                    })
                    this.form.avatar = ''
                    return
                }
                const options = {}
                // 过滤空串
                Object.keys(this.form).forEach(key => {
                    if (this.form[key]) {
                        options[key] = this.form[key]
                    }
                })
                this.tim
                    .updateMyProfile(options)
                    .then(() => {
                        this.$store.commit('showMessage', {
                            message: '修改成功'
                        })
                        this.showEditMyProfile = false
                    })
                    .catch(imError => {
                        this.$store.commit('showMessage', {
                            message: imError.message,
                            type: 'error'
                        })
                    })
            },
            handleEdit() {
                const {avatar, nick, gender} = this.currentUserProfile
                Object.assign(this.form, {avatar, nick, gender})
                this.showEditMyProfile = true
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .avatar-uploader{
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
        color: white;
        width: 15px;
        height: 15px;
        line-height: 60px;
        padding-left:20px
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
