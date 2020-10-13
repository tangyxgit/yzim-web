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
  }
}

export default friendModules
