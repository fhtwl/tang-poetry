const config = {
	baseUrl: '127.0.0.1:3000', // 请求的本域名
	method: 'POST',
	version: '/app/api/v1',
	// 设置为json，返回后会对数据进行一次JSON.parse()
	dataType: 'json',
	showLoading: true, // 是否显示请求中的loading
	loadingText: '请求中...', // 请求loading中的文字提示
	loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
	originalData: false, // 是否在拦截器中返回服务端的原始数据
	loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
	// 配置请求头信息
	header: {
		'content-type': 'application/json;charset=UTF-8'
	},
}
import store from '@/store/index.js';
const install = (Vue, obj)=> {
	Vue.prototype.$http = (obj)=> {
		return $httpzheg
	}
	// Vue.prototype.$http = function(obj) {
	// 	uni.getNetworkType({
	// 	    success: function (res) {
	// 	        if(res.networkType != 'none') {
	// 				// const domain = 'https://test.eeeyun.com'
	// 				// const domain = 'https://crplingxi.com.cn/'
	// 				let apiName = ''
	// 				// console.log(obj.apiName)
	// 				if(!obj.apiName) {
	// 					apiName = store.state.apiName
	// 				}
	// 				let domain = store.state.domain + apiName
	// 				if(obj.url.indexOf("/api/")!=-1) {
						
	// 				}
	// 				else {
	// 					obj.url = config.baseUrl + '/app/api/v1' + obj.url
	// 				}
					
	// 				obj.complete = function (res) {
	// 					if(res.status == '401') {
	// 						uni.showModal({
	// 							title: '提示',
	// 							content: '登录信息已失效，请重新登录',
	// 							showCancel:false,
	// 							success: function (res) {
	// 								if(res.confirm) {
	// 									// uni.navigateTo({
	// 									// 	url:'/pages/loginPage/login/login.vue'
	// 									// })
	// 								}
	// 							}
	// 						})
	// 					}
	// 				}
	// 				if(!obj.fail) {
	// 					obj.fail = function(res) {
	// 						 uni.hideLoading()
	// 						 if(res.errMsg) {
	// 							 setTimeout(function () {
	// 								 uni.showToast({
	// 									icon: 'none',
	// 									title: res.errMsg,
	// 									duration: 2000
	// 								 });
	// 							 })
	// 						 }
							
							 
	// 					}
	// 				}
	// 				wx.request(obj)
	// 			}
	// 			else {
	// 				uni.showToast({
	// 					icon:'none',
	// 				    title: '您已处于离线状态，请检查网络',
	// 				    duration:2000
	// 				});
	// 			}
	// 	    }
	// 	});
	// 	// const domain = 'https://dev.eeeyun.com'
		
	// }
}

export default {
	install
}
