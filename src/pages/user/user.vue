<template>
	<view class="body">
		<!-- <button class="btn_login" open-type="getPhoneNumber" @getphonenumber="toLogin">立即登录</button> -->
		<view class="u-flex user-box u-p-l-30 u-p-r-20">
			<view class="u-m-r-20 avatar">
				<u-avatar :src="userInfo.info.avatar | avatar" size="120"></u-avatar>
			</view>
			<view class="u-flex-1" v-show="userInfo.nick_name">
				<view class="u-font-18 u-p-b-20">{{ userInfo.nick_name }}</view>
				<view class="u-font-14 u-tips-color">普通用户</view>
			</view>
			<view class="u-flex-1" v-show="!userInfo.nick_name">
				<view class="u-font-14 u-tips-color">登录</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="heart" title="好友"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
				<u-cell-item icon="close-circle" title="推出登录"></u-cell-item>
			</u-cell-group>
		</view>
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
			userInfo.info ? userInfo.info : userInfo.info = {avatar:''}
			return {
				encryptedData:'',
				iv:'',
				code:'',
				userInfo: userInfo
			}
		},
		async mounted() {
			await this.getUserInfo()
			
		},
		filters:{
			avatar(val) {
				if(!val && !val.avatar) {
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
				const res = await getUserInfo({token})
				const result = res.data
				console.log(result)
				if(result.success) {
					this.$store.commit('modifyUserInfo',result.data)
					this.userInfo = result.data
					console.log(this.userInfo)
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
		background:#ededed;
		box-sizing: border-box;
		.btn {
			margin-bottom:20rpx;
			.login {
				font-size: 30rpx;
			}
		}
	}
	.camera{
		width: 54px;
		height: 44px;
		
		&:active{
			background-color: #ededed;
		}
	}
	.user-box{
		background-color: #fff;
		display: flex;
		align-items: center;
		height: 160rpx;
		.avatar {
			font-size: 0;
		}
	}
</style>
