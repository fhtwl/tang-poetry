import { http } from '@/utils/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
import { get } from '@/utils/token.js'
let $http = http;
const saveUserInfo = (data) => {
	return new Promise((resolve, reject) => {
		let result = $http.post('/user/saveUserInfo',{
			token: get().token,
			info: data.info
		}).then(res => {
			return res.data;
		})
		resolve(result)
	})
 
}
module.exports = {
	saveUserInfo
}