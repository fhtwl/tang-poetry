import { http } from '@/utils/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
let $http = http;
const getUserInfo = (data) => {
	return new Promise((resolve, reject) => {
		let result = $http.get('/user/getUserInfo',{
			params:{
				token: data.token
			}
		}).then(res => {
			return res.data;
		})
		resolve(result)
	})
 
}
module.exports = {
	getUserInfo
}