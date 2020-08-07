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
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	<u-input v-model="value" :type="type" :border="border" :password-icon="passwordIcon" />	
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
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
		};
	},
	mounted() {
		
	},
	methods: {
		async submit() {
			let tokenRes = await emailLogin(this.form);
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
	// .form {
	// 	width:100%;
	// 	box-sizing: border-box;
	// 	padding:20rpx 30rpx;
	// }
	
</style>
