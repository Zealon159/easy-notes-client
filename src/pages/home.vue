<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo" >
        {{title}}
      </div>
      <div class="user-info">
        <a-badge>
          <a-icon v-if="user.clientName" slot="count" :type="user.clientName" />
          <a-avatar :src="user.avatarUrl" style="backgroundColor:#b1c5a8;z-index:1" icon="user"
           :alt="user.userName" shape="square" />
        </a-badge>

        <!-- 用户信息 -->
        <span :class="userTextClass">
          <a-dropdown >
            <a class="ant-dropdown-link" @click="e => e.preventDefault()" 
              style="margin-left:12px; color:#b1c5a8"> {{user.userName}} <a-icon type="down" /> </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="$router.push('/home/my');">我的账户</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="logout">退出系统</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </span>
      </div>
      <a-menu 
        theme="dark" 
        :default-selected-keys="['1001']" 
        mode="inline">
        <a-menu-item key="1000">
          <a-icon  >
            <svg t="1609810384474" class="icon" viewBox="0 0 1245 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11210" width="16" height="16"><path d="M134.385302 736.031497S575.937007 179.29239 959.895011 115.299389C511.944006 294.479791 0 1024 0 1024h499.145406s-6.3993-25.5972-38.3958-25.5972H63.993001s76.791601-89.590201 140.784601-147.183902c255.972003-12.7986 479.947506-38.3958 633.530708-255.972003 25.5972-51.194401-19.1979-44.795101-31.9965-44.795101 121.586701-51.194401 383.958005-243.173403 345.562204-339.162904-19.1979-19.1979-31.9965-6.3993-31.996501-6.3993s198.378302-127.986002 95.989502-185.579702-358.360804 31.9965-358.360805 31.9965 19.1979-38.3958-38.3958-38.3958C601.534207 32.108488 441.551705 179.29239 441.551705 179.29239s0-51.194401-31.9965-31.9965c-441.551705 275.169903-275.169903 588.735607-275.169903 588.735607z" p-id="11211" fill="#0fe389"></path></svg>
          </a-icon>
          <span>
            <a-dropdown>
              <a style="color:rgb(183, 197, 214)">创建笔记</a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="createNotes('rich_text')">
                      <svg t="1609213178251" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29469" width="10" height="10"><path d="M577.215757 956.736653c-11.568886-15.561688-17.19976-52.315937-17.19976-110.262748V64.191962h127.360128c32.24955 0 60.506299 2.25235 84.360728 6.859428 24.059188 4.607079 44.227954 13.104579 60.915816 25.69726 16.687862 12.592681 30.20196 30.406719 40.542292 53.646871 10.442711 23.240152 18.223555 53.032593 23.444911 89.889222h29.690062V0H48.835033v240.079984h18.018796c4.19756-32.24955 11.159368-59.482503 20.783044-81.903619s22.216357-40.542292 37.880424-54.363528c15.561688-13.923615 34.706659-23.854429 57.127774-30.09958 22.421116-6.245151 48.425515-9.418916 78.115577-9.418916h149.269346v782.179564c0 62.861028-7.064187 102.174765-21.192561 117.838832-19.247351 21.090182-49.756449 31.737652-91.424916 31.737653h-36.754249v27.94961h449.446111v-27.94961h-37.470906c-44.842232-0.204759-76.682264-13.309338-95.417716-39.313737z" fill="#15385A" p-id="29470"></path><path d="M682.666667 762.522695h6.040392c1.433313-10.74985 3.685663-19.861628 6.859428-27.232953 3.173765-7.473705 7.371326-13.514097 12.695061-18.121176 5.118976-4.607079 11.568886-7.985603 18.940212-10.033193 7.473705-2.04759 16.175965-3.173765 26.106778-3.173765h49.756449v260.760648c0 20.987802-2.354729 33.990002-6.961808 39.211357-6.44991 6.961808-16.585483 10.545091-30.509098 10.545091h-12.285543v9.316537H903.089782v-9.316537h-12.490302c-14.947411 0-25.594881-4.29994-31.737652-13.104579-3.788042-5.221356-5.835633-17.404519-5.835633-36.856628V703.961608h42.487502c10.85223 0 20.168766 0.716657 28.05199 2.252349 8.087982 1.535693 14.742651 4.29994 20.271146 8.497501s10.033193 10.237952 13.616476 17.814037c3.378524 7.678464 6.040392 17.711658 7.780844 29.894821h9.930814v-79.958408H682.666667v80.060787z" fill="#D0D7DE" p-id="29471"></path></svg>
                      富文本
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="createNotes('markdown')">
                      <svg t="1609211872898" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2261" width="10" height="10"><path d="M896 0h128v1024h-128V304l-303.872 569.728L672 1024h-320l79.872-150.272L128 304V1024H0V0h128l384 722.816L896 0z" fill="#2F80ED" p-id="2262"></path></svg> 
                      Markdown
                    </a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            
          </span>
        </a-menu-item>
        <a-menu-item key="1001" @click="gotoNotesList(-1, 0)">
          <a-icon type="history" />
          <span>近期笔记</span>
        </a-menu-item>

        <!-- 动态加载 -->
        <a-sub-menu key="1002" >
          <span slot="title"><a-icon type="book" /><span>笔记本组</span></span>
          <a-menu-item v-for="(item,index) in categorys" :index="index+''" :key="item.id" 
            @click="gotoNotesList(1, item.id)"
            >
            {{item.title}}
          </a-menu-item>
        </a-sub-menu>
      
        <a-menu-item key="1003" @click="gotoNotesList(-1, 1)">
          <a-icon type="heart" />
          <span>我的收藏</span>
        </a-menu-item>
        <a-menu-item key="1004" >
          <a-icon type="tags" />
          <span>我的标签</span>
        </a-menu-item>
        <a-menu-item key="1005" @click="$router.push('/home/notes-remove-list');">
          <a-icon type="delete" />
          <span>废纸篓</span>
        </a-menu-item>
        <a-menu-item key="1006" @click="$router.push('/home/category-list');">
          <a-icon type="history" />
          <span>笔记本管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  export default {
    data() {
      return {
        user: this.db.get("USER"),
        collapsed: false,
        categorys:[],
        selectedCategoryId:'',
        level:1
      };
    },
    mounted () {
      this.loadCategory("")
      this.gotoNotesList(-1,'0')
    },
    computed: {
      title:function(){
        if(!this.collapsed){
          return '简笔记';
        }else{
          return '简';
        }
      },
      userTextClass:function(){
        if(!this.collapsed){
          return 'user-text';
        }else{
          return 'user-text-hide';
        }
      }
    },
    methods: {
      loadCategory(){
        // 分类列表
        this.getRequest('/category/list', {}, {"JWTHeaderName":this.user.token}).then(resp => {
            if (resp.code == 200) {
              if(resp.data.length > 0){
                for(let i=0;i<resp.data.length;i++){
                  this.categorys.push(resp.data[i])
                }
              }
            }
        }) 
      },
      // 笔记列表
      gotoNotesList(level, id) {
        this.selectedCategoryId = id;
        this.level = level;
        let timestamp=new Date().getTime();
        let url = '/home/notes-list/'+id+'?level='+level+'&timestamp='+timestamp;
        this.$router.push(url);
      },
      // 创建笔记
      createNotes(type){
        if(this.selectedCategoryId == '') {
          this.$message.info('请选择一个分类进行创建哦');
          return;
        }

        let dataForm = {
            categoryId: this.selectedCategoryId,
            title: '无标题',
            content: '',
            type: type
        }
        this.postRequest('/notes/create', dataForm, {"JWTHeaderName":this.user.token}).then(resp => {
            if (resp && resp.code==200) {
              let timestamp=new Date().getTime();
              let url = '/home/notes-list/'+this.selectedCategoryId+'?level='+this.level+'&type='+type+'&timestamp='+timestamp;
              this.$router.push(url);
            }
        })
      },
      logout(){
        this.db.remove("USER")
        this.$router.push('/login');
      }
    }
  };
</script>

<style>
  #components-layout-demo-side .logo {
    height: 32px;
    margin: 5px 16px 0px 16px;
    color:lightskyblue;
    font: 200;
    font-size: 32px;
  }

  .user-info {
    margin: 32px 0px 18px 16px; 
    color:rgb(183, 197, 214);
  }

  .user-text{
    display:inline
  }

  .user-text-hide{
    display:none
  }
</style>
