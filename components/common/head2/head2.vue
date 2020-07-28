<template>
	<view class="head">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="head_box">
			<!-- 二级页面头部 -->
			<template v-if="!noBack">
				<uni-icons  @tap="toMain" type="arrowleft" class="left"></uni-icons>
			</template>
			<template v-else>
				<text></text>
			</template>
			<view class="name">
				{{name}}
			</view>
			<view class="right">
				<text @tap="clickRightBtn" v-if="rightBtn">{{rightBtn}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			'name': {
				type: String,
				default: ''
			},
			'url': {
				type: String,
				default: '/pages/market/index'
			},
			'back': {
				type: Boolean,
				default:false
			},
			'noBack': {
				type: Boolean,
				default:false
			},
			'rightBtn': {
				type: String,
				default:''
			}
		},
		methods:{
			toMain() {
				if(this.back) {
					uni.navigateBack()
				}
				else {
					uni.navigateTo({
						url: this.url,
						animationType:'fade-in'
					})
				}
			},
			clickRightBtn() {
				this.$emit('clickRightBtn',this.rightBtn)
			}
		},
	}
</script>

<style scoped lang="scss">
	.head {
		position: sticky;
		top: 0;
		background: #fff;
		// box-shadow: 0 0 4upx 4upx #eee;
		border-bottom:1rpx solid #e5e5e5;
		font-size: 30rpx;
		color: #333;
		z-index: 990;
		box-sizing: border-box;
		.head_box {
			height: 112rpx;
			padding:0 20rpx;
			box-sizing: border-box;
			display:flex;
			justify-content: space-between;
			align-items: center;
			.name {
				font-weight: 600;
				font-size: 32rpx;
			}
			.left {
				font-size: 48upx !important;
			}
			.right {
				width:48rpx;
				height:100%;
				position: relative;
				text {
					position: absolute;
					width: 60rpx;
					right:10rpx;
					top:36rpx;
				}
			}
		}
		
	}
</style>
