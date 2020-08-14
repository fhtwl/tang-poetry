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
			<view @tap="goLogin" class="u-flex-1" v-show="!userInfo.nick_name">
				<view class="u-font-14 u-tips-color">登录</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @tap="goCollection" icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="heart" title="好友"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
				<u-cell-item v-if="!!token" @tap="open" icon="close-circle" title="退出登录"></u-cell-item>
			</u-cell-group>
		</view>
	<!-- 	<view class="btn">
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
		</view> -->
		<u-modal v-model="show" :content="content" @confirm="cancellation" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { getToken } from '@/api/user/getToken.js';
	import { verifyToken } from '@/api/user/verifyToken.js'; 
	import { getUserInfo } from '@/api/user/getUserInfo.js';
	import { cancellation } from '@/api/user/cancellation.js';
	export default {
		data() {
			let userInfo = this.$store.state.userInfo
			userInfo.info ? userInfo.info : userInfo.info = {avatar:''}
			let token = this.isLogin()
			return {
				userInfo: userInfo,
				token: token,
				show: false,
				content: '确认退出登录？'
			}
		},
		async onShow() {
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
			open() {
				this.show = true;
				
			},
			async cancellation() {
				let token = this.isLogin()
				const res = await cancellation({token})
				if(res.data.success) {
					this.$store.commit('modifyUserInfo',{info:{avatar:''}})
					uni.removeStorageSync('token')
					this.token = ''
					this.userInfo = {info:{avatar:''}}
					this.$refs.uToast.show({
						title: '退出登录成功',
						type: 'success', 
					})
				}
				else {
					this.$refs.uToast.show({
						title: '退出登录失败',
						type: 'success', 
					})
				}
			},
			cancel() {
				
			},
			goCollection() {
				if(!this.isLogin()) {
					this.$refs.uToast.show({
						title: '请先登录',
						type: 'error', 
					})
					return false
				}
				uni.navigateTo({
					url: '/pages/user/collection/collection'
				})
			},
			async getUserInfo() {
				let token = this.isLogin()
				const res = await getUserInfo({token})
				const result = res.data
				console.log(result)
				if(result.success) {
					this.$store.commit('modifyUserInfo',result.data)
					this.userInfo = result.data
				}
				else {
				}
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/user/loginPage/loginType'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
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
