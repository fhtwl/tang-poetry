import { http } from '@/utils/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
let $http = http;
const getToken = (data) => {
	return new Promise((resolve, reject) => {
		let result = $http.post('/token',{
			type: data.type,
			code: data.code
		}).then(res => {
			return res.data;
		})
		resolve(result)
	})
 
}
module.exports = {
	getToken
}