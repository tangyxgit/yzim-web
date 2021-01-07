import tim from 'tim'

const groupModules = {
  state: {
    groupList: [],
    currentMemberList: [],
    createGroupModelVisible: false,
    updateCurrentMemberCount:false
  },
  getters: {
    hasGroupList: state => state.groupList.length > 0
  },
  mutations: {
    updateGroupList(state, groupList) {
      state.groupList = groupList
    },
    updateCreateGroupModelVisible(state, visible) {
      state.createGroupModelVisible = visible
    },
    updateCurrentMemberList(state, memberList) {
      state.updateCurrentMemberCount = true
      state.currentMemberList = [...state.currentMemberList, ...memberList]
    },
    deleteGroupMemeber(state, userID) {
      state.updateCurrentMemberCount = true
      state.currentMemberList = state.currentMemberList.filter((member) => member.userID !== userID)
    },
    deleteGroupMemberList(state, userIDList) {
      state.updateCurrentMemberCount = true
      state.currentMemberList = state.currentMemberList.filter((member) => !userIDList.includes(member.userID))
    },
    changeUpdateCount(state, update) {
      state.updateCurrentMemberCount = update
    },
    resetCurrentMemberList(state) {
      state.currentMemberList = []
    },
    reset(state) {
      Object.assign(state, {
        groupList: [],
        currentMemberList: [],
        createGroupModelVisible: false
      })
    }
  },
  actions: {
    updateGroupList(context, groupList) {
      context.commit('updateGroupList', groupList)
    },
    getGroupMemberList(context, groupID) {
      return tim.getGroupMemberList({
        groupID: groupID,
        offset: context.state.currentMemberList.length,
        count: 30
      }).then((imResponse) => {
        context.commit('updateCurrentMemberList', imResponse.data.memberList)
        return imResponse
      })
    }
  }
}

export default groupModules
