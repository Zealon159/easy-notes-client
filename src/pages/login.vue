<template>
  <div class="login" >
    <a-spin tip="Loading..." size="large" :spinning="loading">
      <div style="height:100px"></div>
        <a-row type="flex">
          <a-col flex="auto"></a-col>
          <a-col flex="370px">
            <a-card 
              hoverable
              :headStyle="{ fontSize: '22px' }" >
              <div style="text-align:center">
                简笔记
              </div>
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
                      <a @click="oauth2Register('github')">
                        <a-icon type="github"  :style="{ color: 'grey', fontSize: '20px' }"/>
                      </a>
                      <a @click="oauth2Register('qq')">
                        <a-icon type="qq"  :style="{  color: '#8bb4f9',fontSize: '20px' }"/>
                      </a>
                      <a @click="oauth2Register('wechat')">
                        <a-icon type="wechat"  :style="{ color: 'green', fontSize: '20px' }"/>
                      </a>
                      <a @click="oauth2Register('weibo')">
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
      // OAuth2注册
      oauth2Register(client){
        let url = "";
        let timestamp = new Date().getTime();
        if(client=="github"){
          url = "https://github.com/login/oauth/authorize?client_id=d2456e0d3f62d5838fb2&redirect_uri=http://localhost:9000/login/oauth2/callback/github&login=notes-user&scope&state="+timestamp+"&allow_signup=true";
          location.href = url;
        } else {
          this.$message.info(client + '开发者应用审核中，后续实现该社交登录哦~');
        }
      }
    },
  };
</script>
<style>
  .login{
    width:100%;  
  }

  .login-form {
    margin-top: 35px
  }

  .login-form-button {
    width: 100%;
  
  }
</style>