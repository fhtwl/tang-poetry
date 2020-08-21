// 管理token
const KEY = 'token';

const get = function() {
	let ret = '';
	ret = uni.getStorageSync(KEY);
	if (!ret) {
		ret = '[]';
	}
	return JSON.parse(ret);
}

const set = function(data) {
	let users = get();
	// console.log(users)
	users = [{
		token:data.token,
		time:data.time
	}];
	uni.setStorageSync(KEY, JSON.stringify(users));
}

export {
	get,
	set
}