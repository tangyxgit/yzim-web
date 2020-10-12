export function translateGroupSystemNotice(message,tim) {
  const groupName = message.payload.groupProfile.name || message.payload.groupProfile.groupID
  const userName = message.nick || message.payload.operatorID
  if(!message.nick && tim){
    tim.getUserProfile({
      userIDList:[message.payload.operatorID]
    }).then(imResponse=>{
      let userData = imResponse.data
      let msgNick = ''
      userData.forEach(item=>{
        if(msgNick) {
          msgNick+=','
        }
        msgNick += item.nick
      })
      message.nick = msgNick
    }).catch((imError) => {
      console.warn('translateGroupSystemNotice getUserProfile error:', imError)// 获取其他用户资料失败的相关信息
    })
  }
  switch (message.payload.operationType) {
    case 1:
      return `${userName} 申请加入群组：${groupName}`
    case 2:
      return `成功加入群组：${groupName}`
    case 3:
      return `申请加入群组：${groupName}被拒绝`
    case 4:
      return `你被管理员${userName}踢出群组：${groupName}`
    case 5:
      return `群：${groupName} 已解散`
    case 6:
      return `${userName} 创建群：${groupName}`
    case 7:
      return `${userName} 邀请你加群：${groupName}`
    case 8:
      return `你退出群组：${groupName}`
    case 9:
      return `你被${userName} 设置为群：${groupName}的管理员`
    case 10:
      return `你被${userName} 撤销群：${groupName}的管理员身份`
    case 255:
      return '自定义群系统通知: ' + message.payload.userDefinedField
  }
}

export const errorMap = {
  500: '服务器错误',
  602: '用户名或密码不合法',
  610: '用户名格式错误',
  612: '用户已存在',
  620: '用户不存在',
  621: '密码错误'
}
