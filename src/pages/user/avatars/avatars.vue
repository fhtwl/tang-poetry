<template>
	<view class="body">
		
		<head2 @clickRightBtn="save" back :name="headName" :url='headUrl' class="head" :rightBtn="rightBtn"></head2>
		<view class="content">
			<u-upload @on-success="uploadSuccess" @on-error="uploadError"  name='face' :action="action" :file-list="fileList" :max-size="5 * 1024 * 1024" max-count="1" ref='uUpload'></u-upload>
		</view>
		<u-toast ref="uToast" />
		<!-- <sunUiUpimg :url="action" @change="getImageInfo" :upload_auto="true" ref="upimg1" :upload_count="1"></sunUiUpimg> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import Configuration from '@/config.js';
	import sunUiUpimg from '@/components/common/sunui-upimg/sunui-upimg'; // 选择器
	import { saveUserInfo } from '@/api/user/saveUserInfo.js';
	export default {
		computed: mapState(['domain']),
		components:{sunUiUpimg},
		data() {
			return {
				headName:'上传头像',
				headUrl:"",
				rightBtn:'确定',
				userId:"",
				USER_INDUSTR:'',
				action:  Configuration.domain + Configuration.apiPrefix + Configuration.version + '/upload/add',
				fileList: [],
				avatar:""
			}
		},
		methods: {
			submit() {
				this.$refs.uUpload.upload();
			},
			getImageInfo(e) {
				console.log('图片返回1：', e)

			},
			uploadSuccess(data, index, lists, name) {
				console.log(data)
				this.avatar = data.id
				this.$refs.uToast.show({
					title: '上传成功',
					type: 'success', 
				})
			},
			uploadError(res, index, lists, name) {
				console.log(res)
				// this.$refs.uToast.show({
				// 	title: '上传失败',
				// 	type: 'error', 
				// })
			},
			async save() {
				let info = JSON.stringify({
						avatar:this.avatar
					})
				let res = await saveUserInfo({
					info
				})
				if(res.data.success) {
					uni.navigateBack()
				}
			}
		},
		onLoad(e) {
			if(e.url) {
				this.fileList.push({
					url:  e.url
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.body {
	width:100%;
	display: flex;
	flex-direction: column;
	.content {
		width:100%;
		padding:10rpx 16rpx;
		box-sizing: border-box;
	}
}
</style>
