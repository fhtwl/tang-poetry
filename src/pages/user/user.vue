<template>
	<view class="body">
		<!-- <button class="btn_login" open-type="getPhoneNumber" @getphonenumber="toLogin">立即登录</button> -->
		<u-avatar :src="userInfo.info.avatar | avatar" :text="userInfo.nick_name"></u-avatar>
		<view class="btn">
			<u-button type="primary" @getuserinfo="toLogin" open-type="getUserInfo">微信登录/未注册会直接注册</u-button>
		</view>
		<view class="btn">
			<u-button type="primary" @click="goUserNameLogin">用户名登录</u-button>
		</view>
		<view class="btn">
			<u-button type="primary" @click="goUserNameRegister">用户名注册</u-button>
		</view>
		<view class="btn">
			<u-button @click="verify" type="primary" class="btn">验证token</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { getToken } from '@/api/user/getToken.js';
	import { verifyToken } from '@/api/user/verifyToken.js'; 
	import { getUserInfo } from '@/api/user/getUserInfo.js';
	export default {
		data() {
			let userInfo = this.$store.state.userInfo
			return {
				encryptedData:'',
				iv:'',
				code:'',
				userInfo: userInfo
			}
		},
		mounted() {
			this.getUserInfo()
		},
		filters:{
			avatar(val) {
				if(!val) {
					return '/static/images/user/touxiang-icon@2x.png'
				}
			}
		},
		methods:{
			toLogin(e) {
				var _this=this;
				if(e.detail.errMsg == "getUserInfo:ok") {
					_this.encryptedData = e.detail.encryptedData
					_this.iv = e.detail.iv;
					uni.login({
						provider: 'weixin',
						success: async (loginRes)=> {
							if(loginRes.code){
								_this.code=loginRes.code;
								// uni.request({
								// 	url: 'http://127.0.0.1:3000/app/api/v1/token',
								// 	method: 'POST',
								// 	data: {
								// 		type: 100,
								// 		code: this.code
								// 	},
								// 	success: (res)=> {
								// 		console.log(res)
								// 	}
								// })
								let tokenRes = await getToken({
									type: 100,
									code: _this.code
								});
								const errCode = tokenRes.statusCode.toString()
								if(errCode.startsWith('2')) {
									let token = {
										token:tokenRes.data.token,
										time:new Date().getTime()
									}
									uni.setStorageSync('token', JSON.stringify(token));
								}
								console.log(tokenRes)
								// _this.$http.request({
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
			},
			goUserNameRegister() {
				uni.navigateTo({
					url: '/pages/user/loginPage/register'
				})
			},
			goUserNameLogin() {
				uni.navigateTo({
					url: '/pages/user/loginPage/login'
				})
			},
			async verify() {
				let token = ''
				let ret = uni.getStorageSync('token');
				if (!ret) {
					ret = '[]';
				}
				token = JSON.parse(ret);
				console.log(token)
				const result = await verifyToken(token)
			},
			async getUserInfo() {
				let token = ''
				let ret = uni.getStorageSync('token');
				if (!ret) {
					ret = '[]';
				}
				token = JSON.parse(ret);
				const result = await getUserInfo({token})
				if(result.success) {
					this.$store.commit('modifyUserInfo',result.data)
				}
				else {
					
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.body {
		padding:0 20rpx;
		box-sizing: border-box;
		.btn {
			margin-bottom:20rpx;
			.login {
				font-size: 30rpx;
			}
		}
	}
	
</style>
