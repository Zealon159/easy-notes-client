<template>
  <div class="login" :style="backgourndStyle" >
    <a-spin size="large" tip="Loading..." :spinning="loading">
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
            :loading="loading"
            hoverable
            :headStyle="{ fontSize: '22px' }" >
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
                    'username'
                  ]"
                  placeholder="账户"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                    'password'
                  ]"
                  type="password"
                  placeholder="密码"
                >
                  <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" class="login-form-button">
                  注册
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col flex="auto"></a-col>
      </a-row>
      <a-row>
          <a-col>
            <a-col :span="4"><my-icon type="icon-dangao" class="my-icon" style="margin:0px 50px 0px 0px; font-size:96px"/></a-col>
            <a-col :span="18" style="text-align:center">
              <my-icon type="icon-wing" class="my-icon" style="margin:30px 50px 0px 0px; font-size:128px"/>
            </a-col>
            <a-col :span="2" style="text-align:right"><my-icon type="icon-zhuangshi2" class="my-icon" style=" font-size:64px"/></a-col>
          </a-col>
        </a-row>
    </a-spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: this.db.get("USER"),
      loading: true,
      username: '',
      password: '',
      initUserName: '',
      initAvatarUrl: ''
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
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
  created(){
    this.init();
  },
  methods: {
    init() {
      let that = this;
      let clientId = this.$route.params.clientId;
      let url = '/oauth2/authorized/callback/' + clientId
      let values = 
      {
        code: this.$route.query.code,
        state: this.$route.query.state
      }
      let token = ''
      if(this.user!=null){
        token=this.user.token
      }
      this.getRequest(url, values, {"JWTHeaderName":token}).then(resp => {
        if (resp.code == 200) {
          // OAuth2注册
          if(resp.data.type==1){
            that.initUserName = resp.data.initUserName 
            that.username = resp.data.initUserId
            that.initAvatarUrl = resp.data.initAvatarUrl
            // 已注册，存储token 跳转主页
            if(resp.data.registered == true){
              that.db.save("USER", resp.data);
              that.$router.push("/");
            } else {
              that.loading = false;
              // OAuth2 name被其它人使用，需要创建新账户
              if(resp.data.otherAccountRegistered == true){
                
                that.$warning({
                  title: '报告主人',
                  content: '不知道是哪个愣头青把您的'+clientId+'账户<'+resp.data.initUserId + ' >给使用了，那我们使用别的名字吧 ε=(´ο｀*)))',
                });
              } 
              // 提示用户是否使用 OAuth2 name 注册账户
              else {
                that.registerWithClient(resp.data)
              }
            }
          } 
          // OAuth2绑定
          else {
            if(resp.data.otherAccountBind == true){
              that.$router.push("/");
              that.$message.warn("该社交账户已被其它账户绑定了，您可以退出登录直接使用该社交账户登录哦");
            } else {
              that.$router.push("/");
              that.$message.success("绑定成功，以后可以使用该社交账户登录啦");
            }
          }
        } else {
          if(token!=''){
            that.$router.push("/");
            that.$message.error("操作失败了，请重试哦");
          }else{
            that.$router.push("/login");
            that.$message.error("操作失败了，请重试哦");
          }
        }
      })
    },
    // 使用Client账户注册
    registerWithClient(data){
      let that = this
      this.$confirm({
        title: '要使用<'+data.initUserId+'>注册为简笔记的账户吗?',
        content: '直接注册密码默认设置为:pass啦； 点击取消也可以自定义账户名称和密码的哦 ~',
        onOk() {
          that.loading = true;
          let values = {
            "userId": data.initUserId,
            "userName": data.initUserName,
            "password": "pass",
            "clientName": data.clientName,
            "name": data.initUserId,
            "avatarUrl": data.initAvatarUrl
          }
          that.postRequest('/register', values).then(resp => {
            that.loading = false
            if (resp && resp.code==200) {
              that.db.save("USER", resp.data);
              that.$router.replace('/');
            } else {
              that.$message.info(resp.msg);
            }
          })
        },
        onCancel() {
          that.form.setFieldsValue({
            username: data.initUserId,
          });
          console.log('自定义账户名');
        }
      });
    },
    // 提交注册
    handleSubmit(e) {
      let that = this;
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, vals) => {
        if(!vals.username){
          that.$message.info('请填写账户哦!');
          return false;
        }
        if(!vals.password){
          that.$message.info('请填写密码哦!');
          return false;
        }
        if (!err) {
          that.loading = true;
          let values = {
            "userId": vals.username,
            "userName": that.initUserName,
            "password": vals.password,
            "clientName": that.$route.params.clientId,
            "name": that.username,
            "avatarUrl": that.initAvatarUrl
          }
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
  }
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