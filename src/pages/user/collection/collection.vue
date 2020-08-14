<template>
	<view class="body">
		<!-- <button type="default" @click="query">query</button> -->
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
		<!-- <m-slide-list ref="slideList" :multiple="multiple" :list="list" :button="buttonList" :border="true" @click="clickMethod" @change="changeMethod"></m-slide-list> -->
		<view class="list">
			<u-swipe-action :show="item.show" :index="index"
				v-for="(item, index) in list" :key="item.id" 
				@click="click" @open="open"
				:options="options"
				@content-click="goDatails"
				:disabled="multiple"
			>
				<view class="item-box">
					<view class="multiple" v-show="multiple">
					</view>
					<view class="item u-border-bottom">
						<view class="title">
							{{ item.title }}
						</view>
						<view class="author">
							{{ item.author }}
						</view>
						<view class="content" v-html="format(item.content)"></view>
						<view class="time">
							{{ item.updated_at | formatTime }}
						</view>
						<!-- <view class="operation">
							<view class="left">
								<u-icon @tap="collection(item.id,item.author_id)" v-if="item.collection_id === null || item.collection_id === undefined" name="heart" color="#ccc" size="28"></u-icon>
								<u-icon @tap="cancelCollection(item.collection_id)" v-else name="heart-fill" color="#f00" size="28"></u-icon>
							</view>
						</view> -->
					</view>
				</view>
				
			</u-swipe-action>
		</view>
		
		<view v-show="multiple" class="delete-content">
			<button @tap="deleteData" class='co-btn' type="default">删除</button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { search } from '@/api/search/search.js';
	import { setCollection } from '@/api/collection/setCollection.js';
	import { queryCollectionList } from '@/api/collection/queryCollectionList.js';
	// import sibList from '@/components/common/sib-list/sib-list.vue'
	import hrPullLoad from '@/components/common/hr-pull-load/hr-pull-load.vue'
	import mSlideList from '@/components/collection/m-slide-list/m-slide-list.vue'
	export default {
		components: { hrPullLoad,mSlideList },
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
				bottomTips:"",
				multiple: false,
				buttonList: [
					{
						title: '删除',
						background: '#ff3b32'
					}
				],
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		onLoad() {
			this.getHeight()
			this.query()
		},
		mounted() {
		},
		filters:{
			formatTime(val) {
				let date=new Date(val);
				let year=date.getFullYear();
				let mon = date.getMonth()+1;
				let day = date.getDate();
				let hours = date.getHours();
				let minu = date.getMinutes();
				let sec = date.getSeconds();
				return year+'/'+mon+'/'+day+' '+hours+':'+minu+':'+sec;
			}
		},
		onPageScroll(e) {
			const pixelRatio = this.pixelRatio
			const windowHeight = this.windowHeight
			const currentPage = Number(this.currentPage)
			const limit = Number(this.limit)
			const itemHeight = 268
			const headHeight = 100/pixelRatio
			let scrollTop = e.scrollTop
			// console.log(scrollTop+windowHeight,currentPage*limit*itemHeight/pixelRatio)
			if(scrollTop+windowHeight > headHeight + currentPage*limit*itemHeight/pixelRatio) {
				console.log(e.scrollTop)
			}
		},
		methods:{
			goDatails(index) {
				console.log(index)
			},
			click(index, index1) {
				if(index1 == 0) {
					this.list.splice(index, 1);
					this.$u.toast(`删除了第${index}个cell`);
				} else {
					this.list[index].show = false;
					this.$u.toast(`收藏成功`);
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if(index != idx) this.list[idx].show = false;
				})
			},
			changeMethod(data,button,index){
				console.log('滑动按钮回调', data)
				console.log('滑动按钮回调', button)
				this.deleteData(data)
			},
			clickMethod(data,index){
				// 点击行回调
				if(!this.multiple && !data.delete) {
					uni.navigateTo({
						url:'/pages/market/commodity/details/details?GOODS_ID='+data.id,
					})
				}
			},
			clickRightBtn(val) {
				if(val == '编辑') {
					this.rightBtn = '完成'
					this.multiple = true
				}
				else {
					this.rightBtn = '编辑'
					this.multiple = false
				}
			},
			deleteData(item) {
				let data = this.$refs.slideList.delete()
				if(item && item.id) {
					data = [item]
				}
				if(data.length > 0 && data[0].id) {
					uni.showModal({
					    title: '提示',
					    content: '确定删除吗？',
					    success: (res)=> {
					        if (res.confirm) {
								let _this = this 
								
								
					            uni.showLoading({
					            	title:'加载中',
					            	mask:true
					            })
					            this.requestAjax({
					            	url: '/api/market/goodsCenter/goods/control/deleteFavoritesApp.do',
					            	data: {
										datamsg:JSON.stringify(data)
									},
					            	success: function(res) {
					            		if (res.data.success) {
					            			uni.hideLoading()
					            			let temdata = res.data.data
					            			_this.getData()
					            		} else {
					            			
					            		}
					            		uni.hideLoading()
					            
					            	},
					            })
								
					        } else if (res.cancel) {
					            
					        }
					    }
					});
				}
				else {
					uni.showToast({
						icon:"none",
						title:'请选择需要删除的商品'
					})
				}
				
				
			},
			async getHeight() {
				const res = await uni.getSystemInfo()
				this.pixelRatio = Number(res[1].pixelRatio)
				const headHeight = 0 //头部高度 + list的margin-top
				this.windowHeight = Number(res[1].windowHeight)*this.pixelRatio - headHeight
				
				console.log(this.windowHeight)
			},
			refresh: function() {
			    const _this = this
			    this.currentPage = 1
			    this.query(true)
			},
			loadMore: function() {
			    this.currentPage++
				this.bottomTips = "loading";
			    this.query()
			},
			async query(isRefresh) {
				let token = this.isLogin()
				let res = await queryCollectionList({
					limit: this.limit,
					currentPage: this.currentPage,
					token
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
				
				
				// setTimeout(()=>{
				// 	this.$refs.hrPullLoad.reSet();
				// },300);
				// const sss = this.list.map(function (item) {
				//     return item.value;
				// }).join(',');
				// console.log(sss)
			},
			async queryCollectionList() {
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
					this.query()
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
				// margin-bottom:20rpx;
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
				.time {
					font-size: 24rpx;
					color:#999;
					margin-top:4rpx;
				}
				
			}
			.multiple {
				width:50rpx;
				height:50rpx;
				border:1rpx solid #ccc;
				border-radius: 50%;
				margin-left:40rpx;
				margin-right:20rpx;
			}
			.item-box {
				display: flex;
				align-items: center;
			}
		}
	}
	
</style>
