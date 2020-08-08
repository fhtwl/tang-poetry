<template>
	<view class="body">
		<view class="form">
			<u-form :model="form" ref="uForm" :rules='rules' label-width="140rpx">
				<u-form-item label="用户名" prop="nickName">
					<u-input v-model="form.nickName" />
				</u-form-item>
				<u-form-item label="邮箱" prop="email">
					<u-input v-model="form.email" />
				</u-form-item>
				<u-form-item label="密码" prop="password1">
					<u-input type="password" v-model="form.password1" />
				</u-form-item>
				<u-form-item label="确认密码" prop="password2">
					<u-input type="password" v-model="form.password2" />
				</u-form-item>
			</u-form>
			<u-button :disabled="disabled" type="primary" @click="submit">提交</u-button>
		</view>
		
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { emailRegister } from '@/api/user/emailRegister.js';
export default {
	data() {
		return {
			form:{
				email:'',
				secret:'',
				code: '101',
				nickName: ''
			},
			rules: {
				nickName: [
					{
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					}
				],
				email: [
					{
						required: true,
						message: '请输入邮箱',
						trigger: ['blur', 'change']
					}
				],
				password1: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					}
				],
				password2: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					}
				]
			},
			disabled:false
		};
	},
	mounted() {
		
	},
	methods: {
		async submit() {
			this.disabled = true
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					let tokenRes = await emailRegister(this.form);
					if(errCode.startsWith('2')) {
						uni.navigateTo({
							url: '/pages/user/user'
						})
						
					}
					else {
						this.disabled = false
						this.$refs.uToast.show({
							title: tokenRes.data.msg,
							// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
							type: 'error', 
						})
					}
				}
				else {
					this.disabled = false
				}
			})
		}

	},
	onShow() {},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>

<style scoped lang="scss">
	.form {
		width:100%;
		box-sizing: border-box;
		padding:20rpx 30rpx;
	}
	
</style>
