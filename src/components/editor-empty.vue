<template>
  <a-empty style="margin-top:64px"> 
      <a-dropdown >
        <a-menu slot="overlay" @click="createNotes">
          <a-menu-item key="rich_text"> 
            <my-icon type="icon-wenben" ></my-icon>
            富文本 
          </a-menu-item>
          <a-menu-item key="markdown"> 
            <my-icon type="icon-markdown" ></my-icon>
            Markdown 
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px" type="primary" > 
          创建笔记
          <a-icon type="plus" /> 
        </a-button>
      </a-dropdown>
  </a-empty>
</template>
<script>
  export default {
    data(){
      return{
        token: this.db.get("USER").token
      }
    },
    props: {
      notes:{}
    },
    methods: {
      // 创建笔记
      createNotes(type) {
        let dataForm = {
            categoryId: this.$route.params.id,
            title: '无标题',
            content: '',
            user_id:'zealon',
            type: type.key
        }
        this.postRequest('/notes/create', dataForm, {"JWTHeaderName":this.token}).then(resp => {
            if (resp && resp.code==200) {
              let timestamp=new Date().getTime();
              let url = '/home/notes-list/'+resp.data.categoryId+'?level=2&type='+resp.data.type+'&timestamp='+timestamp;
              this.$router.push(url);
            }
        })
      }
    }
  }
</script>