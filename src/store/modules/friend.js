import tim from '../../tim'
const friendModules = {
  state: {
    friendList: [],
    createGroupModelVisible: false
  },
  mutations: {
    updateFriendList(state, friendList) {
      state.friendList = friendList
    },
    reset(state) {
      Object.assign(state, {
        friendList: [],
        createGroupModelVisible: false
      })
    }
  },
  actions:{
    getFriendlist(context) {
      tim.getFriendList().then(({data})=>{
        context.commit('updateFriendList', data)
      }).catch(error => {
        this.$store.commit('showMessage', {
          type: 'error',
          message: error.message
        })
      })
    }
  }
}

export default friendModules
