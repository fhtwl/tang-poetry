import { http } from '@/utils/service.js' // 全局挂载引入，配置相关在该index.js文件里修改
let $http = http;
const search = (data) => {
	return new Promise((resolve, reject) => {
		let result = $http.get('/search',{
			params:{
				keyword: data.keyword,
				limit: data.limit,
				currentPage: data.currentPage,
				token: data.token
			}
		}).then(res => {
			return res.data;
		})
		resolve(result)
	})
 
}
module.exports = {
	search
}