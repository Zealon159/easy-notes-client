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

        <!-- 用户信息 -->
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()" 
            style="margin-left:12px; color:ligthgreen"> Zealon <a-icon type="down" /> </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;">修改密码</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">绑定管理</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">退出系统</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <a-menu 
        theme="dark" 
        :default-selected-keys="['1001']" 
        mode="inline">
        <a-menu-item key="1000">
          <a-icon type="plus-circle" />
          <span>
            <a-dropdown>
              <a 
                style="color:rgb(183, 197, 214)"
                @click="e => e.preventDefault()">创建笔记</a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click="createNotes('rich_text')">富文本笔记</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="createNotes('markdown')">Markdown</a>
                  </a-menu-item>
                </a-menu>
                
              </template>
            </a-dropdown>
            
          </span>
        </a-menu-item>
        <a-menu-item key="1001" @click="gotoNotesList(-1, 0)">
          <a-icon type="number" />
          <span>近期笔记</span>
        </a-menu-item>

        <!-- 动态加载 -->
        <a-sub-menu key="1002" >
          <span slot="title"><a-icon type="book" /><span>笔记本组</span></span>
          <a-sub-menu v-for="(item,index) in categorys" :index="index+''" :key="item.id" >
            <span slot="title" @click="gotoNotesList(item.level, item.id, item.parengId)">{{item.title}}</span>
            <a-menu-item v-for="(subItem,indexj) in item.categorys" :index="indexj+''" 
              :key="subItem.id" @click="gotoNotesList(subItem.level, subItem.id, subItem.parentId)">
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
      categorys:[],
      selectedCategoryId:'',
      level:1,
      selectedCategoryParentId:''
    };
  },
  created () {
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
    gotoNotesList(level, id, pid) {
      this.selectedCategoryId = id;
      this.level = level;
      this.selectedCategoryParentId = pid;
      let url = '/home/notes-list/'+id+'?level='+level+'&mode=edit';
      this.$router.push(url);
    },
    // 创建笔记
    createNotes(type){
      if(this.selectedCategoryId == '') {
        this.$message.info('请选择一个分类进行创建哦');
        return;
      }

      let dataForm = {
          categorySubId: this.selectedCategoryId,
          categoryId: this.selectedCategoryParentId,
          title: '无标题',
          content: '',
          user_id:'zealon',
          type: type
      }
      this.postRequest('/notes/create', dataForm).then(resp => {
          if (resp && resp.code==200) {
            let timestamp=new Date().getTime();
            let url = '/home/notes-list/'+this.selectedCategoryId+'?level='+this.level+'&type='+type+'&timestamp='+timestamp;
            this.$router.push(url);
          }
      })
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
