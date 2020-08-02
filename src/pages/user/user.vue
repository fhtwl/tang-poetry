<template>
	<view class="content">
		<!-- <button class="btn_login" open-type="getPhoneNumber" @getphonenumber="toLogin">立即登录</button> -->
		<button @getuserinfo="toLogin" open-type="getUserInfo" class="btn_login">立即登录</button>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				encryptedData:'',
				iv:'',
				code:''
			}
		},
		methods:{
			toLogin(e) {
				var _this=this;
				console.log(e)
				if(e.detail.errMsg == "getUserInfo:ok") {
					_this.encryptedData = e.detail.encryptedData
					_this.iv = e.detail.iv,
					uni.login({
						provider: 'weixin',
						success: (loginRes)=> {
							if(loginRes.code){
								_this.code=loginRes.code;
								// this.$u.api.getUser({code:this.code}).then(res => {
								// 	console.log(res);
								// })
								// this.$u.post('/token', {
								// 	type: 200,
								// 	code: this.code
								// }).then(res => {
								// 	console.log(res);
								// });
								uni.request({
									url: 'http://127.0.0.1:3000/app/api/v1/token',
									method: 'POST',
									data: {
										type: 100,
										code: this.code
									},
									success: (res)=> {
										console.log(res)
									}
								})
								// _this.$http({
								// 	url: '/token',
								// 	data: {
								// 		type: 100,
								// 		code: this.code
								// 	},
								// 	success: (res)=> {
								// 		console.log(res)
								// 	}
								// })
							}
						},
					})
					// _this.login_phone()
				}
				else {
					
				}
			}
		}
	}
</script>

<style>
</style>
