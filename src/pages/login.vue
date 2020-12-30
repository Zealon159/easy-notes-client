<template>
  <div class="login" >
    <a-spin tip="请稍后..." size="large" :spinning="loading">
      <div style="height:120px"></div>
        <a-row type="flex">
          <a-col flex="auto"></a-col>
          <a-col flex="370px">
            <a-card title="Easy Notes" 
              hoverable
              :headStyle="{ fontSize: '22px' }" >
              <a-form
                :form="form"
                class="login-form"
                @submit="handleSubmit"
              >
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'username',
                      { rules: [{ required: true, message: '请输入账户!' }] },
                    ]"
                    placeholder="账户"
                  >
                    <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'password',
                      { rules: [{ required: true, message: '请输入密码!' }] },
                    ]"
                    type="password"
                    placeholder="密码"
                  >
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" class="login-form-button">
                    登录
                  </a-button>
                  <div style="text-align:center; margin-top: 20px">
                    <a-space size="large">
                      <a @click="register('github')">
                        <a-icon type="github"  :style="{ color: 'grey', fontSize: '20px' }"/>
                      </a>
                      <a @click="register('github')">
                        <a-icon type="qq"  :style="{  color: '#8bb4f9',fontSize: '20px' }"/>
                      </a>
                      <a @click="register('github')">
                        <a-icon type="wechat"  :style="{ color: 'green', fontSize: '20px' }"/>
                      </a>
                      <a @click="register('weibo')">
                        <a-icon type="weibo" :style="{ color: 'red', fontSize: '20px' }"/>
                      </a>
                    </a-space>
                  </div>
                  <div>
                    还没有账户？<a @click="$router.push('/register')"> 现在注册  </a>
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
        loading: false
      };
    },
    beforeCreate() {
        // https://github.com/login/oauth/authorize?client_id=d2456e0d3f62d5838fb2&redirect_uri=http://localhost:9000/login/oauth2/callback/github&login=notes-user&scope&state=ffuye934hjfdjif2dsd&allow_signup=true
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    methods: {
      handleSubmit(e) {
        let that = this;
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.loading = true;
            this.postRequest('/auth/authentication', values).then(resp => {
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
      register(client){
          // 详情
          if(client=="github"){
              this.getRequest('/oauth2/authorization/github').then(resp => {
                  console.log("resp:" + resp)
                  if (resp.code == 200) {
                      this.book = resp.data;
                  }
              })
          }
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