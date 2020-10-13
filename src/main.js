import Vue from 'vue'
import {MessageBox, Row, Col, Button, Input, Loading, Dialog, Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
import Avatar from './components/avatar.vue'
import Index from './index.vue'
import store from './store/index'
import tim from 'tim'
import TIM from 'tim-js-sdk'
import Axios from 'axios'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
import './assets/css/yzmw.css'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
window.tim = tim
window.TIM = TIM
window.store = store
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.$store = store
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.component('avatar', Avatar)

Vue.prototype.setUserData = function (userData) {
    if (userData) {
        this.$root.userApi = userData
        localStorage.setItem('userApi', JSON.stringify(userData))
    }
}

Vue.prototype.setUserToken = function (token) {
    if (token) {
        this.$root.token = token
        localStorage.setItem('token', token)
    }
}

Vue.prototype.token = function () {
    if (!this.$root.token) {
        let token = localStorage.getItem('token')
        if (token) {
            this.$root.token = token
        }
    }
    return this.$root.token
}
Vue.prototype.userApi = function () {
    if (!this.$root.userApi) {
        let userData = localStorage.getItem('userApi')
        if (userData) {
            this.$root.userApi = JSON.parse(userData)
        }
    }
    return this.$root.userApi
}
Vue.prototype.userLogout = function () {
    localStorage.removeItem('userApi')
    localStorage.removeItem('token')
    this.$root.userApi = null
    this.$root.token = null
}

function baseUrl() {
    return '/api'
}

//网络配置
Axios.defaults.baseURL = baseUrl()
Vue.prototype.requestPost = function (url, params, success, fail) {
    if (params && this.userApi() && this.userApi().userId
        && url!=='user/updateFriend'
        && url!=='user/addFriend'
        && url!=='user/getUserByUserId') {
        params.userId = this.userApi().userId
    }
    //加上headers
    var headersval = {token: this.token(), platform: 'web'}
    Axios.post(url, params,{headers:headersval}).then(res => {
        let code = res.data.code
        if (code === 200) {
            if (success) {
                success(res.data)
            }
        } else if(code===501) {
            this.userLogout()
            this.$store.dispatch('logout')
        }else {
            if (fail) {
                fail(res.data)
            }
        }
    }).catch(error => {

        if (!error.msg) {
            error.msg = '服务器繁忙，请稍后尝试！'
        }
        if (fail) {
            fail(error)
        }
    })
}

new Vue({
    render: h => h(Index),
    data() {
        return {
            userApi: null,
            token:null
        }
    },
    created() {

    }
}).$mount('#app')
