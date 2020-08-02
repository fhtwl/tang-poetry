import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// domain: 'https://dev.sgcctd.cn',
		// domain: 'https://test.sgcctd.cn',
		domain: 'https://crplingxi.com.cn',
		// domain:'https://hzkjapp.sgcctd.cn',
		// apiName:'/api/eeumWGW',
		apiName:'/api/open',
		userInfo:{
			
		}
	},
	mutations: {
		modifyUserInfo(state,data) {
			state.company = data
		}
	}
})

export default store
