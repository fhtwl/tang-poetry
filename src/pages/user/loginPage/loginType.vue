<template>
	<view class="body">
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
			return {
				encryptedData:'',
				iv:'',
				code:'',
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
									uni.reLaunch({
										url:'/pages/user/user'
									})
								}
								console.log(tokenRes)
							}
						},
					})
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
		}
	}
</script>

<style lang="scss" scoped>
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
