<template>
	<view class="body">
		<view class="form">
			<u-form :model="form" ref="uForm" :rules='rules'>
				<u-form-item label="邮箱" prop="account">
					<u-input v-model="form.account" />
				</u-form-item>
				<u-form-item label="密码" prop="secret">
					<u-input type="password" v-model="form.secret" :password-icon="true" />
				</u-form-item>
			</u-form>
			<u-button :disabled="disabled" type="primary" @click="submit">
				提交
			</u-button>
		</view>
		<u-toast ref="uToast" />
	<!-- <u-input v-model="value" :type="type" :border="border" :password-icon="passwordIcon" />	 -->
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { emailLogin } from '@/api/user/emailLogin.js';
export default {
	data() {
		return {
			form:{
				account:'',
				secret:'',
				type: '101'
			},
			rules: {
				account: [
					{
						required: true,
						message: '请输入邮箱',
						trigger: ['blur', 'change']
					}
				],
				secret: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					}
				]
			},
			value: '',
			type: 'password',
			passwordIcon: true,
			border: true,
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
					let tokenRes = await emailLogin(this.form);
					const errCode = tokenRes.statusCode.toString()
					if(errCode.startsWith('2')) {
						let token = {
							token:tokenRes.data.token,
							time:new Date().getTime()
						}
						uni.setStorageSync('token', JSON.stringify(token));
						uni.navigateBack({
							
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
				} else {
					this.disabled = false
				}
			});
			
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
