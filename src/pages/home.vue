<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible >
      <div class="home-logo" >
        <my-icon type="icon-GULULU-suanningmeng" />
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
              style="margin-left:12px; color:#add8f7"> {{user.userName}} <a-icon type="down" /> </a>
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
          <my-icon type="icon-yumao"></my-icon>
          <span>
            <a-dropdown>
              <a style="color:rgb(183, 197, 214)">创建笔记</a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="createNotes('rich_text')">
                      <my-icon type="icon-wenben" ></my-icon>
                      富文本
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="createNotes('markdown')">
                      <my-icon type="icon-markdown" ></my-icon>
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
        <a-menu-item key="1004" @click="$message.info('功能开发中ヾ(◍°∇°◍)ﾉﾞ');">
           <a-icon type="tags" />
          <span>我的标签</span>
        </a-menu-item>
        <a-menu-item key="1005" @click="$router.push('/home/notes-remove-list');">
          <a-icon type="delete" />
          <span>废纸篓</span>
        </a-menu-item>
        <a-menu-item key="1006" @click="$router.push('/home/category-list');">
          <my-icon type="icon-shucheng-07"></my-icon>
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
        subject: '简笔记',
        user: this.db.get("USER"),
        collapsed: false,
        categorys:[],
        selectedCategoryId:'',
        level:1
      };
    },
    created() {
      document.title = this.subject
    },
    mounted () {
      this.loadCategory("")
      this.gotoNotesList(-1,'0')
    },
    computed: {
      title:function(){
        if(!this.collapsed){
          return this.subject;
        }else{
          return '';
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
        this.$router.push('/');
      }
    }
  };
</script>

<style scope>
  .home-logo {
    height: 32px;
    margin: 10px 16px 0px 16px;
    color: #aad6b4;
    font: 200;
    font-size: 32px;
  }

  .user-info {
    margin: 40px 0px 12px 18px; 
    color:rgb(183, 197, 214);
  }

  .user-text{
    display:inline;
    color: #add8f7;
  }

  .user-text-hide{
    display:none
  }
</style>
