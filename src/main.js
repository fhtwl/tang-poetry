import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import uView from "uview-ui";
Vue.use(uView);
import store from './store'

import isLogin from '@/utils/isLogin.js'
Vue.use(isLogin)

Vue.prototype.$store = store

const app = new Vue({
	store,
	...App
})
app.$mount()
