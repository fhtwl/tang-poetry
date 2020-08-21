<template>
	<view class="body">
		<head2 @clickRightBtn="clickRightBtn" back :name="headName" :rightBtn="rightBtn"></head2>
		<view class="list">
			<u-swipe-action :show="item.show" :index="index"
				v-for="(item, index) in list" :key="item.id" 
				@click="click" @open="open"
				:options="options"
				@content-click="goDatails"
				:disabled="multiple"
			>
				<view class="item-box">
					<view class="multiple" :class="{active:item.active}" v-show="multiple">
						<u-icon name="checkbox-mark" color="#fff" size="28"></u-icon>
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
			<button @tap="deleteData" class='btn' type="default">删除</button>
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
				],
				headName: '收藏',
				rightBtn: '编辑'
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
			clickRightBtn() {
				if(val == '编辑') {
					this.rightBtn = '完成'
					this.multiple = true
				}
				else {
					this.rightBtn = '编辑'
					this.multiple = false
				}
			},
			goDatails(index) {
				if(this.multiple) {
					//编辑状态中
					this.$forceUpdate()
					this.list[index].active = !this.list[index].active
				}
				else {
					// 跳转到详情页
				}
				console.log(this.list)
			},
			click(index, index1) {
				if(index1 == 0) { //表示点击删除
					// this.list.splice(index, 1);
					let collectionId = this.list[index].id
					uni.showModal({
					    title: '提示',
					    content: '确定删除吗？',
					    success: async (res)=> {
					        if (res.confirm) {
								let _this = this 
								let res = await setCollection({
									type: '2',
									collectionId
								})
								if(res.data.success) {
									this.$refs.uToast.show({
										title: '删除成功',
										type: 'success', 
									})
									this.query(true)
								}
								else {
									this.$refs.uToast.show({
										title: '删除失败',
										type: 'error', 
									})
								}
								
					        } else if (res.cancel) {
					            
					        }
					    }
					});
				} else {
				
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
				// let data = this.$refs.slideList.delete()
				let data = []
				let collectionIdArr = []
				data = this.list.filter((v,i)=> {
					if(v.active) {
						collectionIdArr.push(v.id)
					}
					return v.active
				})
				let collectionId = collectionIdArr.toString()
				if(data.length > 0 && data[0].id) {
					uni.showModal({
					    title: '提示',
					    content: '确定删除吗？',
					    success: async (res)=> {
					        if (res.confirm) {
								let _this = this 
					            uni.showLoading({
					            	title:'加载中',
					            	mask:true
					            })
					            let res = await setCollection({
					            	type: '2',
					            	collectionId
					            })
					            if(res.data.success) {
					            	this.$refs.uToast.show({
					            		title: '取消收藏成功',
					            		type: 'success', 
					            	})
					            	this.query(true)
					            }
					            else {
					            	this.$refs.uToast.show({
					            		title: '取消收藏失败',
					            		type: 'error', 
					            	})
					            }
								
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
				min-width:50rpx;
				min-height:50rpx;
				border:1rpx solid #ccc;
				border-radius: 50%;
				margin-left:40rpx;
				margin-right:20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.multiple.active {
				background-color: $color;
				border-color: transparent;
			}
			.item-box {
				display: flex;
				align-items: center;
			}
		}
		.delete-content {
			width: 100%;
			height: 140rpx;
			background: #fff;
			position: fixed;
			bottom: 0;
			padding-top:20rpx;
			box-sizing: border-box;
			box-shadow: 0 0 6rpx 6rpx #eee;
			.btn {
				width: 700rpx;
				background-color: #e54d42;
				color: #fff;
			}
		}
	}
	
</style>
