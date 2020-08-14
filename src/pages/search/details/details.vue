<template>
	<view class="body">

		<view class="item animate1">
			<view class="name">
				<view class="yuan bg-purple"></view>
				标题
			</view>
			<view class="title">
				<text class="purple">{{ info.title }}</text>
			</view>
		</view>
		<view class="item animate2">
			<view class="name">
				<view class="yuan bg-green"></view>
				作者
			</view>
			<view class="title">
				<text class="author green">{{ info.author }}</text>
			</view>
		</view>
		<view class="item animate3">
			<view class="name">
				<view class="yuan bg-black"></view>
				内容
			</view>
			<view class="content black" v-html="format(info.content)"></view>
		</view>

		<view class="item animate4">
			<view class="name">
				<view class="yuan bg-black"></view>
				简介
			</view>
			<br />
			<!-- <view class="title">
				
				{{ info.intro }}
			</view> -->
			<view class="intro black">{{ info.intro }}</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { getPoetryInfo } from '@/api/search/details/details.js';
	import hrPullLoad from '@/components/common/hr-pull-load/hr-pull-load.vue'
	export default {
		components: { hrPullLoad },
		data() {
			return {
				info:{
					author:'',
					content: '',
					intro: '',
					title: ''
				}
			}
		},
		onLoad(e) {
			this.poetryId = e.poetryId
			this.getPoetryInfo()
		},
		mounted() {
		},
		methods:{
			async getPoetryInfo() {
				let res = await getPoetryInfo({
					poetryId:this.poetryId
				})
				if(res.data.success) {
					this.info = res.data.data[0]
				}
				else {
					this.$refs.uToast.show({
						title: '加载失败',
						type: 'error', 
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
					this.query()
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
		},
	}
</script>

<style scoped lang="scss">
	.red {
		color:#e54d42;
	}
	.orange {
		color:#f37a1d;
	}
	.yellow {
		color:#fbbd08;
	}
	.olive {
		color:#8dc73f;
	}
	.green {
		color:#3ab54a;
	}
	.blue {
		color:#0081ff;
	}
	.purple {
		color:#6739b6;
	}
	.mauve {
		color:#9c26b0;
	}
	.pink {
		color:#e13998;
	}
	.brown {
		color:#a56740;
	}
	.grey {
		color:#8799a3;
	}
	.gray {
		color:#f0f0f0;
	}
	.black {
		color:#333333;
	}
	.white {
		color:#ffffff;
	}
	.bg-red {
		background-color:#e54d42;
	}
	.bg-orange {
		background-color:#f37a1d;
	}
	.bg-yellow {
		background-color:#fbbd08;
	}
	.bg-olive {
		background-color:#8dc73f;
	}
	.bg-green {
		background-color:#3ab54a;
	}
	.bg-blue {
		background-color:#0081ff;
	}
	.bg-purple {
		background-color:#6739b6;
	}
	.bg-mauve {
		background-color:#9c26b0;
	}
	.bg-pink {
		background-color:#e13998;
	}
	.bg-brown {
		background-color:#a56740;
	}
	.bg-grey {
		background-color:#8799a3;
	}
	.bg-gray {
		background-color:#f0f0f0;
	}
	.bg-black {
		background-color:#333333;
	}
	.bg-white {
		background-color:#ffffff;
	}
	.body {
		background:#f3f5f7;
		.item {
			display: flex;
			width: 710rpx;
			align-items: center;
			background-color: #FFFFFF;
			border-radius: 6rpx;
			margin: 0 auto;
			padding:20rpx;
			box-sizing: border-box;
			text-align: center;
			position: relative;
			margin-top: 20rpx;
			.name {
				position: absolute;
				left: 20rpx;
				top: 20rpx;
				z-index: 2;
				margin-left:10rpx;
				.yuan {
					position: absolute;
					left: -20rpx;
					top: 15rpx;
					width:10rpx;
					height:10rpx;
					border-radius: 50%;;
					// background:#3ab54a;
				}
			}
			.title {
				// color: #6739b6;
				font-weight: 600;
				font-size: 30rpx;
				align-items: center;
				width:100%;
			}
			
			
			
		}
		.animate1 {
			display: flex;
			animation: bounceInLeft 1s both 300ms;
		}
		.animate2 {
			display: flex;
			animation: bounceInLeft 1s both 500ms;
		}
		.animate3 {
			display: flex;
			animation: bounceInLeft 1s both 800ms;
		}
		.animate4 {
			display: flex;
			animation: bounceInLeft 1s both 1000ms;
		}
		.content {
			text-align: center;
			// color: #333;
			line-height: 40rpx;
			flex-direction: column;
			width: 710rpx;
			align-items: center;
			background-color: #FFFFFF;
			border-radius: 6rpx;
			padding:20rpx;
			box-sizing: border-box;
			text-align: center;
			margin: 20rpx auto 0 auto;
			position: relative;
			
			view {
				width:100%;
			}
		}
		.author {
			font-size: 24rpx;
		}
		.intro {
			text-indent:  2em;
			margin-top: 40rpx;
			text-align: left;
		}
	}
	
</style>
