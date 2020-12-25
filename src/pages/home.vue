<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo" >
        {{title}}
      </div>
      <div class="user-info">
        <a-avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" >
          <template #icon>

          </template>
        </a-avatar>
        Lily
      </div>
      <a-menu 
        theme="dark" 
        :default-selected-keys="['1001']" 
        mode="inline">
        <a-menu-item key="1000">
          <a-icon type="plus-circle" />
          <span>创建笔记</span>
        </a-menu-item>
        <a-menu-item key="1001" @click="gotoNotesList(-1, 0)">
          <a-icon type="number" />
          <span>最新笔记</span>
        </a-menu-item>

        <!-- 动态加载 -->
        <a-sub-menu key="1002" >
          <span slot="title"><a-icon type="book" /><span>笔记本组</span></span>
          <a-sub-menu v-for="(item,index) in categorys" :index="index+''" :key="item.id" >
            <span slot="title" @click="gotoNotesList(item.level, item.id)">{{item.title}}</span>
            <a-menu-item v-for="(subItem,indexj) in item.categorys" :index="indexj+''" 
              :key="subItem.id" @click="gotoNotesList(subItem.level, subItem.id)">
              {{subItem.title}}
            </a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
      
        <a-menu-item key="1003">
          <a-icon type="heart" />
          <span>我的收藏</span>
        </a-menu-item>
        <a-menu-item key="1004">
          <a-icon type="delete" />
          <span>废纸篓</span>
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
      collapsed: false,
      categorys:[]
    };
  },
  created () {
    //this.$router.push('/home/notes-list/1?categoryId=');
    this.loadCategory("")
    this.gotoNotesList(-1,'0')
  },
  computed: {
      title:function(){
          if(!this.collapsed){
              return 'Easy Notes';
          }else{
              return 'EN';
          }
      }
  },
  methods: {
    loadCategory(parentId){
      // 分类列表
      this.getRequest('/category/list', 
        {userId:"zealon",parentId:parentId}).then(resp => {
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
    gotoNotesList(level,id) {
      let url = '/home/notes-list/'+id+'?level='+level;
      //location.href=url;
      this.$router.push(url);
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
</style>
