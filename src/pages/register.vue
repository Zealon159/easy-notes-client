<template>
    <div class="login" >
      <a-spin tip="请稍后..." size="large" :spinning="loading">
      <div style="height:120px"></div>
        <a-row type="flex">
          <a-col flex="auto"></a-col>
          <a-col flex="370px">
            <a-card title="Easy Notes" 
              hoverable
              :headStyle="{ fontSize: '22px' }">
              <a-form :form="form" @submit="handleSubmit">
                <a-form-item>
                  <a-input
                      v-decorator="[
                      'userId',
                      {
                          rules: [
                          {
                              required: true,
                              message: '请输入账户!',
                          },
                          ],
                      },
                      ]"
                      placeholder="账户"
                  >
                    <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item has-feedback>
                  <a-input
                      v-decorator="[
                      'password',
                      {
                          rules: [
                          {
                              required: true,
                              message: 'Please input your password!',
                          },
                          {
                              validator: validateToNextPassword,
                          },
                          ],
                      },
                      ]"
                      placeholder="输入密码"
                      type="password"
                  >
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item has-feedback>
                  <a-input
                      v-decorator="[
                      'confirm',
                      {
                          rules: [
                          {
                              required: true,
                              message: '请输入确认密码!',
                          },
                          {
                              validator: compareToFirstPassword,
                          },
                          ],
                      },
                      ]"
                      type="password"
                      @blur="handleConfirmBlur"
                      placeholder="确认密码"
                  >
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                      v-decorator="[
                      'userName',
                      {
                          rules: [{ required: true, message: '请输入昵称!', whitespace: true }],
                      },
                      ]"
                      placeholder="昵称"
                  >
                    <a-icon slot="prefix" type="smile" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" class="login-form-button">
                      注册
                  </a-button>
                </a-form-item>
                <a-form-item>
                  <div>
                    已有账户？<a @click="$router.push('/login')"> 去登录  </a>
                  </div>
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>
          <a-col flex="auto"></a-col>
        </a-row>
      </a-spin>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        confirmDirty: false,
        loading: false
      };
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'register' });
    },
    methods: {
      // 提交注册
      handleSubmit(e) {
        let that = this;
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.loading = true;
            this.postRequest('/register', values).then(resp => {
              that.loading = false
              if (resp && resp.code==200) {
                that.db.save("USER", resp.data);
                that.$router.replace('/');
              }else{
                that.$message.info(resp.msg);
              }
            })
          }
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

<style>
  .login{
    width:100%;  
  }

  .login-form-button {
    width: 100%;
  }
</style>