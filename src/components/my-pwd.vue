<template>
    <a-form v-bind="formItemLayout" :form="form" @submit="handleSubmit">
        <a-form-item label="ID" >
            {{user.userId}}
        </a-form-item>
        <a-form-item has-feedback label="当前密码">
            <a-input
                v-decorator="[
                'currentPassword',
                {
                    rules: [
                    {
                        required: true,
                        message: '请输入当前密码!',
                    },
                    {
                        validator: validateToNextPassword,
                    },
                    ],
                },
                ]"
                placeholder="输入当前密码"
                type="password"
            >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
        </a-form-item>
        <a-form-item has-feedback label="新密码">
            <a-input
                v-decorator="[
                'password',
                {
                    rules: [
                    {
                        required: true,
                        message: '请输入新密码!',
                    },
                    {
                        validator: validateToNextPassword,
                    },
                    ],
                },
                ]"
                placeholder="输入新密码"
                type="password"
            >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
        </a-form-item>
        <a-form-item has-feedback label="确认新密码">
            <a-input
                v-decorator="[
                'confirm',
                {
                    rules: [
                    {
                        required: true,
                        message: '确认新密码!',
                    },
                    {
                        validator: compareToFirstPassword,
                    },
                    ],
                },
                ]"
                type="password"
                @blur="handleConfirmBlur"
                placeholder="确认新密码"
            >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
        </a-form-item>
        <a-form-item 
            :label-col="formTailLayout.labelCol" 
            :wrapper-col="formTailLayout.wrapperCol">
            <a-button type="primary" html-type="submit">
                确认修改
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
                    this.postRequest('/user/update-pwd', fieldsValue, {"JWTHeaderName":this.user.token}).then(resp => {
                        if (resp && resp.code==200) {
                            that.form.setFieldsValue({currentPassword: '',password:'',confirm:''})
                            that.$message.success(resp.msg);
                        }else{
                            that.$message.warn(resp.msg);
                        }
                    })
                });
            },
            handleConfirmBlur(e) {
                const value = e.target.value;
                this.confirmDirty = this.confirmDirty || !!value;
            },
            compareToFirstPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('password')) {
                callback('两次密码不一致!');
                } else {
                callback();
                }
            },
            validateToNextPassword(rule, value, callback) {
                const form = this.form;
                if (value && this.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
                }
                callback();
            }
        },
    };
</script>