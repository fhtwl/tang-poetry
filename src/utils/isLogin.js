// 判断是否登录
exports.install = function (Vue, obj) {
	Vue.prototype.isLogin = function(obj) {
		let token = ''
		try {
			token = JSON.parse(uni.getStorageSync('token')).token;
		} catch (e) {
			//TODO handle the exception
		}
		return token
	}
}