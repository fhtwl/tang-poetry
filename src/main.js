import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import uView from "uview-ui";
Vue.use(uView);
import store from './store'

import MescrollBody from "@/components/common/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/common/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)	

// 二级页面通用头部
import head2 from '@/components/common/head2/head2.vue'
Vue.component(
	'head2',head2
)



import isLogin from '@/utils/isLogin.js'
Vue.use(isLogin)

Vue.prototype.$store = store

const app = new Vue({
	store,
	...App
})
app.$mount()
