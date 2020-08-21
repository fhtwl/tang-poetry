import { http } from '@/utils/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
let $http = http;
const getRecommendInfo = (data) => {
	return new Promise((resolve, reject) => {
		let result = $http.get('/search/getRecommend').then(res => {
			return res.data;
		})
		resolve(result)
	})
 
}
module.exports = {
	getRecommendInfo
}