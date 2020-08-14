<template>
	<view class="body">
		<view class="bg">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.body {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// background:url(~@/static/images/bg.png) no-repeat top center;
		// background-size:100% auto;
		width:100%;
		height:100vh;
		flex:1;
		.bg {
			// background:url(~@/static/images/bg5.jpeg);
			
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

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
