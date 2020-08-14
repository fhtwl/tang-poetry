/**
 * @version 3.0.4
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-2.7.14 alpha-2.8.0
 */
import Request from '@/utils/luch-request/index.js'
import Configuration from '@/config.js';

const getTokenStorage = () => {
	let token = ''
	try {
		token = JSON.parse(uni.getStorageSync('token')).token;
	} catch (e) {
		//TODO handle the exception
	}
	return token
}
/**
 * 修改全局配置示例
 const test = new Request({
	header: {a:1}, // 举例
	baseURL: 'https://www.fastmock.site/mock/26243bdf9062eeae2848fc67603bda2d/luchrequest',
	validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
		return statusCode >= 200 && statusCode < 300
	}
})
 test.config.baseURL = 'https://www.fastmock.site/mock/26243bdf9062eeae2848fc67603bda2d/luchrequest'
 **/

const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
	config.baseURL = Configuration.domain + Configuration.apiPrefix + Configuration.version
	config.header = {
		...config.header
	}
	return config
})


http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
	config.header = {
		...config.header,
		// token: getTokenStorage()
	}
	/*
	 if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
	   return Promise.reject(config)
	 }
	 */
	// console.log(config)
	let requestType = config.method;
	if (requestType == 'GET') {
		// config.params.token = getTokenStorage();
	} else if (requestType == 'POST') {
		// config.params.token = getTokenStorage();s
	}
	return config
}, (config) => {
	return Promise.reject(config)
})


// 响应拦截
http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	// if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
	//   return Promise.reject(response)
	// }
	uni.hideLoading();
	return {
		// data: response.data
		data: response
	}
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	// return Promise.reject(response)
	return {
		// data: response.data
		data: response
	}
})

export {
	http
}
