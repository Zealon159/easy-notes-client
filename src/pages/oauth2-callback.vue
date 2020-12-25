<template>
    <div>
         <a-spin size="large" tip="Loading..." />
    </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created(){
    this.initData();
  },
  methods: {
    initData() {
      let clientId = this.$route.params.clientId;
      this.getRequest('/login/oauth2/callback/' + clientId, 
      {
        code:this.$route.query.code,
        state:this.$route.query.state
      }).then(resp => {
        if (resp.code == 200) {
          console.log(resp.data)
          // 已注册，存储token 跳转主页
          if(resp.registered == true){
            this.$router.push("/home");
          } else {
            // 跳转注册页
            this.$router.push("/register");
          }
        }
      })
    },
  },
};
</script>