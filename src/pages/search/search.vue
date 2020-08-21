<template>
	<view class="body">
		<view class="head">
		 	<u-search placeholder="请输入作者/标题/诗文关键字" v-model="keyword" @custom="query(true)" @search="query(true)"></u-search>
		 </view>	
		<mescroll-body ref="mescrollRef" :textNoMore="textNoMore" :textLoading="textLoading" @init="mescrollInit" :down="downOption"  :up="upOption" @down="downCallback" @up="upCallback">
			
			 <u-toast ref="uToast" />
			<view class="list">
			 	<view class="item" v-for="(item,index) in list" :key="index">
			 		<view @tap="goDetails(item.id)" class="title">
			 			{{ item.title }}
			 		</view>
			 		<view @tap="goDetails(item.id)" class="author">
			 			{{ item.author }}
			 		</view>
			 		<view @tap="goDetails(item.id)" class="content" v-html="format(item.content)"></view>
			 		<view class="operation">
			 			<view class="left">
			 				<u-icon @tap="collection(item.id,item.author_id,index)" v-if="item.collection_id === null || item.collection_id === undefined" name="heart" color="#ccc" size="28"></u-icon>
			 				<u-icon @tap="cancelCollection(item.collection_id,index)" v-else name="heart-fill" color="#f00" size="28"></u-icon>
			 			</view>
			 		</view>
			 	</view>
			</view>
		</mescroll-body>
	</view>
	
</template>

<script>
	import MescrollMixin from "@/components/common/mescroll-uni/mescroll-mixins.js";
	// import {apiNewList} from "@/api/mock.js"
	import { search } from '@/api/search/search.js';
	import { setCollection } from '@/api/collection/setCollection.js';
	import hrPullLoad from '@/components/common/hr-pull-load/hr-pull-load.vue'
	import MescrollBodyDiy from "@/components/common/mescroll-diy/beibei/mescroll-body.vue";
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				downOption: {
					auto: false ,//是否在初始化后,自动执行downCallback; 默认true
				},
				upOption: {
					noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					empty: {
						tip: '~ 搜索无结果 ~' // 提示
					}
				},
				keyword:'',
				currentPage:'1',//第几页
				limit:'10',//每页多少条
				list: [],
				textLoading:'加载中...',
				textNoMore:'没有更多了'
			}
		},
		methods: {
			// 点击进入诗详情
			goDetails(id) {
				uni.navigateTo({
					url: '/pages/search/details/details?poetryId='+id
				})
			},
			/*下拉刷新的回调 */
			downCallback() {
				//联网加载数据
			
				if(true){
					//联网成功的回调,隐藏下拉刷新的状态
					this.mescroll.endSuccess();
					//设置列表数据
					this.query(true)
				}
				else {
					this.mescroll.endErr();
				}
				
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				console.log(page)
				//联网加载数据
				if(true){
					//联网成功的回调,隐藏下拉刷新的状态
					this.mescroll.endSuccess();
					//设置列表数据
					this.currentPage++
					this.query()
				}
				else {
					this.mescroll.endErr();
				}
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
				let count = 0
				let next = true
				if (res.data.success) {
					let data = res.data.data
					// count = data.count
					if(isRefresh){
						this.list = data.data
					}
					else {
						this.list = this.list.concat(data.data)
					}
					if(data.data.length < 10) {
						next = false
					}
				}
				this.mescroll.endErr();
				this.mescroll.endSuccess(this.limit,next)
				// this.mescroll.endBySize(this.limit,count); 
				// this.list = []; // 先清空列表,显示加载进度
				// this.mescroll.resetUpScroll();
				// this.mescroll.endErr();
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
				}
				else {
					this.$refs.uToast.show({
						title: '收藏失败',
						type: 'success', 
					})
				}
			},
			async cancelCollection(collectionId,index) {
				let res = await setCollection({
					type: '2',
					collectionId
				})
				if(res.data.success) {
					this.list[index].collection_id = null
					this.$refs.uToast.show({
						title: '取消收藏成功',
						type: 'success', 
					})
					// this.query()
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
		}
	}
</script>

<style scoped lang="scss">
	/*说明*/
	.notice{
		font-size: 30upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
	}
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




