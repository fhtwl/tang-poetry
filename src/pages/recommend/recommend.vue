<template>
	<view class="body u-skeleton">
		<view class="head">
			<view class="date">
				<view class="day">
					NO.<text class="num">{{ day }}</text>
				</view>
				<view class="day-right">
					<view class="month">
						{{ month }}月
					</view>
					<view class="year">
						{{ year }}
					</view>
				</view>
			</view>
			<view class="caozuo">
				<!-- <u-icon @click="collection(info.id,info.author_id)" name="heart" color="#aaa" size="36" class="collection"></u-icon> -->
				<u-icon @tap="$u.throttle(collection(info.id,info.author_id),500)" v-if="info.collection_id === null || info.collection_id === '' || info.collection_id === undefined" name="heart" color="#ccc" size="36" class="collection"></u-icon>
				<u-icon @tap="$u.throttle(cancelCollection(info.collection_id),500)" v-else name="heart-fill" color="#f00" size="36" class="collection"></u-icon>
				<u-icon name="zhuanfa" color="#aaa" size="36"></u-icon>
				
			</view>
		</view>
		<view class="color bg-purple">
			<view class="text gray u-skeleton-circle">
				{{ info.content | initials}}
			</view>
			<view class="type">
				<view class="white">
					诗
				</view>
				<view class="black">
					诗
				</view>
			</view>
		</view>
		<view class="poetry-box">
			<view class="poetry u-skeleton-rect" v-html="format(info.content)"></view>
			<view class="author u-skeleton-rect"> —— {{ info.author }}</view>
		</view>
		
		<view class="tool-footer">
			<!-- <view class="prev">
				<u-icon name="heart" color="#ccc" size="36"></u-icon>
			</view> -->
			<view class="title black u-skeleton-fillet">
				{{ info.title }}
			</view>
			<!-- <view class="prev">
				<u-icon name="heart" color="#ccc" size="36"></u-icon>
			</view> -->
		</view>
		<u-toast ref="uToast" />
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import { setCollection } from '@/api/collection/setCollection.js';
	import { getRecommendInfo } from '@/api/recommend/getRecommendInfo.js';
	export default {
		data() {
			return {
				poetryId:'',
				info:{
					author:'',
					content: '',
					intro: '',
					title: ''
				},
				loading:true,
				year:'',
				month: '',
				day: ''
			}
		},
		onLoad() {
			this.init()
			this.getRecommendInfo()

		},
		filters: {
			initials(val) {
				return val.substring(0,1)
			}
		},
		methods: {
			init() {
				const date = new Date()
				this.year = date.getFullYear()
				const month = date.getMonth()
				this.day = date.getDate()
				const numArr = [0,1,2,3,4,5,6,7,8,9,10,11]
				const chineseArr = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
				let index = numArr.findIndex((v,i)=> {
					return v === month
				})
				this.month = chineseArr[index]
			},
			async getRecommendInfo() {
				let res = await getRecommendInfo()
				if(res.data.success) {
					this.info = res.data.data[0]
				}
				else {
					this.$refs.uToast.show({
						title: '加载失败',
						type: 'error', 
					})
				}
				this.loading = false
			},
			async collection(poetryId,authorId,index) {
				if(!this.isLogin()) {
					this.$refs.uToast.show({
						title: '请先登录',
						type: 'error', 
					})
					return false
				}
				let res = await setCollection({
					type: '1',
					poetryId,
					authorId
				})
				if(res.data.success) {
					this.$refs.uToast.show({
						title: '收藏成功',
						type: 'success', 
					})
					this.info.collection_id = res.data.id
					// this.query()
				}
				else {
					this.$refs.uToast.show({
						title: '收藏失败',
						type: 'success', 
					})
				}
			},
			async cancelCollection(collectionId) {
				let res = await setCollection({
					type: '2',
					collectionId
				})
				if(res.data.success) {
					this.$refs.uToast.show({
						title: '取消收藏成功',
						type: 'success', 
					})
				}
				else {
					this.$refs.uToast.show({
						title: '取消收藏失败',
						type: 'error', 
					})
				}
			},
			format(val) {
				let arr = val.split('|')
				let str = ''
				for(let i in arr) {
					// str += '<view>'
					str += arr[i]
					// str += '</view>'
					str +=  '<br>'
				}
				console.log(str)
				return str
			}
		}
	}
</script>

<style scoped lang="scss">
	.body {
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
		// background:url(~@/static/images/bg.png) no-repeat top center;
		// background-size:100% auto;
		width:100%;
		height:100vh;
		background: #FFF; 
		flex:1;
		.head {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			box-sizing: border-box;
			.date {
				display: flex;
				align-items: center;
				.day {
					font-size: 24rpx;
					.num {
						font-size:70rpx;
						font-weight: 600;
					}
				}
				.day-right {
					border-left: 1rpx solid #333;
					height:58rpx;
					margin-left:14rpx;
					padding-left:14rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding-top: 6rpx;
					padding-bottom: 6rpx;
					.month {
						font-size: 24rpx;
						line-height: 14rpx;
					}
					.year {
						font-size: 24rpx;
						line-height: 14rpx;
					}
				}
			}
			.caozuo {
				display: flex;
				align-items: center;
				.collection {
					margin-right:14rpx;
				}
			}
		}
		.color {
			width:100%;
			height: 400rpx;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				font-size: 100rpx;
			}
			.type {
				position: absolute;
				left: 30rpx;
				bottom: -50rpx;
				font-size: 34rpx;
				line-height: 1;
				height: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
			}
		}
		.poetry-box {
			margin-top:80rpx;
			text-align: center;
			padding:0 30rpx;
			box-sizing: border-box;
			.poetry {
				font-size: 30rpx;
				line-height: 44rpx;
			}
			.author {
				text-align: right;
			}
		}
		.tool-footer {
			position: fixed;
			bottom: 140rpx;
			width: 100%;
			.title {
				// width:700rpx;
				// height:112rpx;
				font-size: 30rpx;
				text-align: center;
				background: #FFF;
				padding: 10rpx 10rpx;
				border-radius: 6rpx;
				// background: url('~@/static/images/title-bg.png') no-repeat top center;
				// background-size: 100% auto;
			}
		}
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}
</style>
