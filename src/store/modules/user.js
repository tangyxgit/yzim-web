import tim from '../../tim'

const user = {
    state: {
        currentUserProfile: {},
        userFlag: -1,//-1未登录；-2注册；-3忘记密码；0登陆成功
        isSDKReady: false, // TIM SDK 是否 ready
        fullLoading: false,//全局加载
        userID: 0,
        userSig: '',
        sdkAppID: 0,
    },
    mutations: {
        updateCurrentUserProfile(state, userProfile) {
            state.currentUserProfile = userProfile
        },
        userFlag(state, isLogin) {
            state.userFlag = typeof isLogin === 'undefined' ? -1 : isLogin
        },
        toggleIsSDKReady(state, isSDKReady) {
            state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
        },
        fullUserLoading(state,status) {
          state.fullLoading = typeof status === 'undefined' ? !state.fullLoading : status
        },
        reset(state) {
            Object.assign(state, {
                currentUserProfile: {},
                userFlag: -1,
                isSDKReady: false // TIM SDK 是否 ready
            })
        },
        GET_USER_INFO(state, payload) {
            state.userID = payload.userID
            state.userSig = payload.userSig
            state.sdkAppID = payload.sdkAppID
        },
    },
    actions: {
        // login(context, userID) {
        //   tim
        //     .login({
        //       userID,
        //       userSig: window.genTestUserSig(userID).userSig
        //     })
        //     .then(() => {
        //       context.commit('toggleIsLogin', true)
        //       context.commit('startComputeCurrent')
        //       window.$message({ type: 'success', message: '登录成功' })
        //     })
        //     .catch(imError => {
        //       if (imError.code === 2000) {
        //         window.$message.error(imError.message + ', 请检查是否正确填写了 SDKAPPID')
        //       } else {
        //         window.$message.error(imError.message)
        //       }
        //     })
        // },
        logout(context) {
            // 若有当前会话，在退出登录时已读上报
            if (context.rootState.conversation.currentConversation.conversationID) {
                tim.setMessageRead({conversationID: context.rootState.conversation.currentConversation.conversationID})
            }
            tim.logout().then(() => {
                context.commit('userFlag')
                context.commit('stopComputeCurrent')
                context.commit('reset')
            })
        }
    }
}

export default user
