<template>
  <div class="login" :style="backgourndStyle" >
    <a-spin tip="Loading..." size="large" :spinning="loading">
      <div style="height:120px">
        <a-row>
          <a-col>
            <a-col :span="1"></a-col>
            <a-col :span="7" ><my-icon type="icon-ningmeng" class="my-icon" style=" font-size:108px"/></a-col>
            <a-col :span="13"></a-col>
            <a-col :span="3"><my-icon type="icon-mianbao1" class="my-icon" style="margin-top:10px; font-size:108px"/></a-col>
          </a-col>
        </a-row>
      </div>
        <a-row type="flex">
          <a-col flex="auto"></a-col>
          <a-col flex="370px">
            <a-card 
              hoverable>
              <div class="logo">
                <my-icon type="icon-GULULU-suanningmeng" />
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
        <a-row>
          <a-col>
            <a-col :span="4"><my-icon type="icon-mianbao" class="my-icon" style="margin:0px 50px 0px 0px; font-size:96px"/></a-col>
            <a-col :span="18" style="text-align:center">
              <my-icon type="icon-wing" class="my-icon" style="margin:30px 50px 0px 0px; font-size:128px"/>
            </a-col>
            <a-col :span="2" style="text-align:right"><my-icon type="icon-yu" class="my-icon" style=" font-size:64px"/></a-col>
          </a-col>
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
    computed:{
        backgourndStyle: function() {
            // 计算body可用高度
            let cHeight = window.outerHeight - (window.outerHeight - window.innerHeight)
            // 计算背景图
            let imgs = ["http://resource.zealon.cn/01.jpg","http://resource.zealon.cn/02.jpg","http://resource.zealon.cn/03.jpg"]
            let imgName = imgs[Math.floor(Math.random() * 3)]
            let style = "background-image:url('" + imgName + "'); background-repeat: round; height:" + cHeight + "px;";
            return style
        }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    mounted () {
      let user = this.db.get("USER")
      console.log(user)
      if(user!=null && user.token!=null){
        this.$router.replace('/home');
      }
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
                that.$router.replace('/home');
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
          url = "https://github.com/login/oauth/authorize?client_id=d2456e0d3f62d5838fb2&redirect_uri=http://notes.zealon.cn/login/oauth2/callback/github&login=notes-user&scope&state="+timestamp+"&allow_signup=true";
          location.href = url;
        } else {
          this.$message.info(client + '开发者应用审核中，后续实现该社交登录哦~');
        }
      }
    },
  };
</script>
<style>
  .logo {
    height: 32px;
    color: #82c090;
    font: 300;
    font-size: 36px;
    text-align: center;
  }

  .login{
    width:100%;  
  }

  .login-form {
    margin-top: 45px
  }

  .login-form-button {
    width: 100%;
  
  }

  .my-icon {
    font-size: 48px;
  }

  .my-icon .s72{
    font-size: 72px;
  }

  .my-icon .s108{
    font-size: 108px;
  }

  .my-icon .s128{
    font-size: 128px;
  }

  .my-icon .s156{
    font-size: 156px;
  }

  .my-icon .s256{
    font-size: 256px;
  }
</style>