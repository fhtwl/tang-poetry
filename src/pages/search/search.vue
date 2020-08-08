<template>
	<view class="body">
		<view class="head">
			<u-search placeholder="请输入作者/标题/诗文关键字" v-model="keyword" @custom="query" @search="query"></u-search>
		</view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="title">
					{{ item.title }}
				</view>
				<view class="author">
					{{ item.author }}
				</view>
				<view class="content" v-html="format(item.content)"></view>
				<view class="operation">
					<view @tap="collection(item.id,item.author_id)" class="left">
						<u-icon v-if="!isCollection" name="heart" color="#ccc" size="28"></u-icon>
						<u-icon v-else name="heart" color="#f00" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { search } from '@/api/search/search.js';
	import { setCollection } from '@/api/collection/setCollection.js';
	export default {
		data() {
			return {
				keyword:'',
				currentPage:'1',//第几页
				limit:'10',//每页多少条
				list: [],
				isCollection:false
			}
		},
		mounted() {
		},
		methods:{
			async query() {
				let res = await search({
					keyword: this.keyword,
					limit: this.limit,
					currentPage: this.currentPage
				})
				this.list = res.data.data
				// const sss = this.list.map(function (item) {
				//     return item.value;
				// }).join(',');
				// console.log(sss)
			},
			async collection(poetryId,authorId) {
				let res = await setCollection({
					type: '1',
					poetryId,
					authorId
				})
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
				.title {
					font-size: 34rpx;
					color:#111;
					font-weight: 600;
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
