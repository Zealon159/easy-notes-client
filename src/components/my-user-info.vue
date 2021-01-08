<template>
    <a-form v-bind="formItemLayout" :form="form" @submit="handleSubmit">
        <a-form-item label="ID" >
            {{user.userId}}
        </a-form-item>
        <a-form-item label="昵称" >
            <a-input
                v-decorator="[
                'userName',
                { rules: [{ required: true, message: '请输入昵称哦' }] },
                ]"
                placeholder="请输入昵称哦"
            />
        </a-form-item>
        <a-form-item label="上次更新" >
            {{user.updateTime}}
        </a-form-item>
        <a-form-item 
            :label-col="formTailLayout.labelCol" 
            :wrapper-col="formTailLayout.wrapperCol">
            <a-button type="primary" html-type="submit">
                保存
            </a-button>
        </a-form-item>
    </a-form>
</template>
<script>
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
    };
    const formTailLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8, offset: 4 },
    };
    export default {
        data() {
            return {
                formItemLayout,
                formTailLayout,
            };
        },
        props: {
            user: {}
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'user_info' });
        },
        mounted() {
            let u = this.user
            this.form.setFieldsValue({userName: u.userName})
        },
        methods: {
            handleSubmit(e) {
                let that = this
                e.preventDefault();
                this.form.validateFields((err, fieldsValue) => {
                    if (err) {
                        return;
                    }
                    fieldsValue.userId = this.user.userId
                    this.postRequest('/user/update', fieldsValue, {"JWTHeaderName":this.user.token}).then(resp => {
                        if (resp && resp.code==200) {
                            that.user.userName = fieldsValue.userName
                            that.user.updateTime = resp.data.updateTime
                            that.db.save("USER", that.user);
                            that.$message.success(resp.msg);
                        }
                    })
                });
            },
        },
    };
</script>