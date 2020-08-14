<template>
	<view class="body" @touchmove.stop.prevent>
		<view class="head">
			<u-search placeholder="请输入作者/标题/诗文关键字" v-model="keyword" @custom="query(true)" @search="query(true)"></u-search>
		</view>
		<view class="list">
			<!-- <view class="item" v-for="(item,index) in list" :key="index">
				<view class="title">
					{{ item.title }}
				</view>
				<view class="author">
					{{ item.author }}
				</view>
				<view class="content" v-html="format(item.content)"></view>
				<view class="operation">
					<view class="left">
						<u-icon @tap="collection(item.id,item.author_id)" v-if="item.collection_id === null || item.collection_id === undefined" name="heart" color="#ccc" size="28"></u-icon>
						<u-icon @tap="cancelCollection(item.collection_id)" v-else name="heart-fill" color="#f00" size="28"></u-icon>
					</view>
				</view>
			</view> -->
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
<!-- 					 //  @init="mescrollInit" @down="downCallback" @up="upCallback"为固定值,不可删改(与mescroll-mixins保持一致) 
					 // :down="downOption" :up="upOption" 绝大部分情况无需配置 
					 // :top="顶部偏移量" :bottom="底部偏移量" :topbar="状态栏" :safearea="安全区" (常用)
					 // 字节跳动小程序 ref="mescrollRef" 必须配置 
					 // 此处支持写入原生组件 -->
					<view @tap="goDetails(item.id)" class="item" v-for="(item,index) in list" :key="index">
						<view class="title">
							{{ item.title }}
						</view>
						<view class="author">
							{{ item.author }}
						</view>
						<view class="content" v-html="format(item.content)"></view>
						<view class="operation">
							<view class="left">
								<u-icon @tap="collection(item.id,item.author_id,index)" v-if="item.collection_id === null || item.collection_id === undefined" name="heart" color="#ccc" size="28"></u-icon>
								<u-icon @tap="cancelCollection(item.collection_id)" v-else name="heart-fill" color="#f00" size="28"></u-icon>
							</view>
						</view>
					</view>
			</mescroll-body>
			
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { search } from '@/api/search/search.js';
	import { setCollection } from '@/api/collection/setCollection.js';
	// import sibList from '@/components/common/sib-list/sib-list.vue'
	import hrPullLoad from '@/components/common/hr-pull-load/hr-pull-load.vue'
	export default {
		components: { hrPullLoad },
		data() {
			return {
				keyword:'',
				currentPage:'1',//第几页
				limit:'10',//每页多少条
				list: [],
				isCollection:false,
				floterText: '数据已加载完',
				pixelRatio:1,
				windowHeight:1000,
				bottomTips:""
			}
		},
		onLoad() {
			this.getHeight()
		},
		mounted() {
		},
		methods:{
			goDetails(poetryId) {
				uni.navigateTo({
					url: '/pages/search/details/details?poetryId='+poetryId
				})
			},
			async getHeight() {
				const res = await uni.getSystemInfo()
				this.pixelRatio = Number(res[1].pixelRatio)
				const headHeight = 120 //头部高度 + list的margin-top
				this.windowHeight = Number(res[1].windowHeight)*this.pixelRatio - headHeight
				
			},
			refresh: function() {
			    const _this = this
			    this.query(true)
			},
			loadMore: function() {
			    this.currentPage++
				this.bottomTips = "loading";
			    this.query()
			},
			async query(isRefresh) {
				if(isRefresh) {
					this.currentPage = 1
				}
				let res = await search({
					keyword: this.keyword,
					limit: this.limit,
					currentPage: this.currentPage
				})
				let data = res.data.data
				if(data.length < 1) {
					this.bottomTips = 'nomore'
				}
				else {
					this.bottomTips = 'more'
				}
				if(isRefresh){
					this.list = data
				}
				else {
					this.list = this.list.concat(data)
				}
				
				
				setTimeout(()=>{
					this.$refs.hrPullLoad.reSet();
				},300);
				// const sss = this.list.map(function (item) {
				//     return item.value;
				// }).join(',');
				// console.log(sss)
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
					this.list[index].collection_id = res.data.id
					this.$refs.uToast.show({
						title: '收藏成功',
						type: 'success', 
					})
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
					str += arr[i] + '<br>'
				}
				return str
			}
		},
	}
</script>

<style scoped lang="scss">
	.body {
		background:#f3f5f7;
		.head {
			padding:0 20rpx;
			height:100rpx;
			display: flex;
			align-items: center;
			width:100%;
			box-sizing: border-box;
			background:#fff;
			u-search {
				flex:1;
			}
		}
		.list {
			width:100%;
			margin-top:20rpx;
			.item {
				width:100%;
				background:#fff;
				margin-bottom:20rpx;
				padding: 10rpx 30rpx;
				box-sizing: border-box;
				height:248rpx;
				.title {
					font-size: 34rpx;
					color:#111;
					font-weight: 600;
					overflow:hidden;
					text-overflow:ellipsis;
					white-space:nowrap
				}
				.author {
					font-size: 24rpx;
					margin-top:20rpx;
				}
				.content {
					margin-top:14rpx;
					font-size: 30rpx;
					height: 80rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp:2;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
	
</style>
