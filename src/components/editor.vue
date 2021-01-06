<template>
    <div class="home">
        <div class="toolbar">
            <a-row>
                <a-col :span="16">
                    <a-input v-model="notes.title" style="width:95%" placeholder="请输入标题" >
                        <template #prefix></template>
                    </a-input>
                </a-col>
                <a-col :span="8">
                    <a-space>
                        <a-button type="primary" @click="save">
                            <a-icon type="save" />保存
                        </a-button>
                        <a-button-group>
                            <a-button @click="deleteNotes">
                                <a-icon type="delete" :style="{ fontSize: '16px',color:'red' }"/>
                            </a-button>
                            <a-button @click="starNotes">
                                <a-icon type="heart" :theme="starIconTheme" two-tone-color="#eb2f96" :style="{ fontSize: '16px', color: '#eb2f96' }" />
                            </a-button>
                            <a-button @click="showMoveTo">
                                <a-icon type="interaction" :style="{ fontSize: '16px' }"/>
                            </a-button>
                        </a-button-group>
                    </a-space>
                </a-col>
            </a-row>
        </div>
        <!--标签-->
        <div class="tag">
            <tags :notes="notes" ></tags>
        </div>
        <!--编辑器-->
        <div id="myEditor" class="editor" ></div>
        <!--移动至组件-->
        <a-modal v-model="visible" title="移动至其它笔记本" @ok="handleOk" :zIndex=10017 ok-text="确认" cancel-text="算了">
            <a-select
                show-search
                placeholder="选择一个笔记本哦"
                option-filter-prop="children"
                style="width: 245px;"
                :filter-option="filterOption"
                @change="handleChange"
                :dropdownStyle="{ zIndex:10018 }"
            >
                <a-select-option v-for="(item,index) in categorys" :index="index+''" :key="index" :value="item.id">
                    {{item.title}}
                    <span v-if="item.id==notes.categoryId">
                        (当前分类)
                    </span>
                </a-select-option>
            </a-select>
            <div style="margin-top:15px">
                <a-alert v-if="alertVisible" :message="alertMessage"
                    type="warning" closable :after-close="handleClose"
                />
            </div>
        </a-modal>
    </div>
</template>

<script>
    import wangEditor from 'wangeditor'
    import tags from '@/components/tags'
    export default {
        data(){
            return{
                token: this.db.get("USER").token,
                visible: false,
                alertVisible: false,
                alertMessage:'骚年，当前笔记已在此笔记本下了哦!',
                categorys: [],
                selectedCategoryId:''
            }
        },
        components: {
            tags
        },
        props: {
            notes: {}
        },
        mounted() {
            const editor = new wangEditor(`#myEditor`)
            // 配置 onchange 回调函数，将数据同步到 vue 中
            editor.config.onchange = (newHtml) => {
                this.notes.content = newHtml
            }
            // 创建编辑器
            let cHeight = window.outerHeight - (window.outerHeight - window.innerHeight) - 190;
            editor.config.height = cHeight
            editor.create()
            this.editor = editor
            this.editor.txt.html(this.notes.content)

            this.loadCategorys();
        },
        watch: {
            notes () {
                // 初始化赋值
                this.editor.txt.html(this.notes.content)
            }
        },
        computed: {
            // 收藏图标
            starIconTheme:function(){
                if(this.notes.star == 1){
                    return 'filled';
                }else{
                    return 'outlined';
                }
            }
        },
        methods: {
            // 分类列表
            loadCategorys() {
                this.categorys = [];
                this.getRequest('/category/list', {}, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp.code == 200) {
                        if(resp.data.length > 0){
                            for(let i=0;i<resp.data.length;i++){
                                this.categorys.push(resp.data[i])
                            }
                        }
                    }
                    this.loading = false;
                }) 
            },
            // 更新笔记
            save(){
                if(!this.notes.title){
                    this.$message.info('请输入个标题吧');
                    return false;
                }
                let txtContent = this.editor.txt.html()
                let dataForm = {
                    id: this.notes.id,
                    title: this.notes.title,
                    content: txtContent
                }
                this.postRequest('/notes/update', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        this.$message.success(resp.msg);
                        // 回传给父组件更新的标题
                        this.$emit('updateNotes', this.notes);
                    }
                })
            },
            // 删除笔记
            deleteNotes(){
                let id = this.notes.id
                let postRequest = this.postRequest
                let dataForm = {
                    id: id,
                    delete: 1
                }
                postRequest('/notes/update', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        // 回传给父组件
                        this.$emit('removeNotes', id);
                        this.$message.success(resp.msg);
                    }
                })
            },
            // 收藏笔记
            starNotes(){
                let id = this.notes.id
                let postRequest = this.postRequest
                let star = this.notes.star == 1 ? 0 : 1;
                this.notes.star = star
                let dataForm = {
                    id: id,
                    star: star
                }
                postRequest('/notes/update', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        // 回传给父组件
                        this.$emit('updateNotes', this.notes);
                        this.$message.success(resp.msg);
                    }
                })
            },
            // 显示移动至
            showMoveTo(){
                this.visible = true;
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            handleChange(value) {
                this.selectedCategoryId = value;
                if(value==this.notes.categoryId){
                    this.alertVisible = true;
                }else{
                    this.alertVisible = false;
                }
            },
            handleOk(){
                if(!this.selectedCategoryId){
                    this.alertVisible = true;
                    this.alertMessage = '骚年，还没有选择笔记本哦!'
                    return false;
                }
                if(this.selectedCategoryId==this.notes.categoryId){
                    this.alertVisible = true;
                    this.alertMessage = '骚年，当前笔记已在此笔记本下了哦!'
                    return false;
                }
                let id = this.notes.id;
                let dataForm = {
                    id: id,
                    categoryId: this.selectedCategoryId
                }
                this.postRequest('/notes/update', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        this.$emit('removeNotes', id);
                        this.visible = false;
                        this.$message.success(resp.msg);
                    }
                })
            },
            handleClose() {
               this.alertVisible = false;
            }
        },
        beforeDestroy() {
            // 调用销毁 API 对当前编辑器实例进行销毁
            this.editor.destroy()
            this.editor = null
        }
    }
</script>

<style lang="scss">
  .home {
    width: 100%;
    margin: auto;
    position: relative;
    .btn {
      position: absolute;
      right: 0;
      top: 0;
      padding: 5px 10px;
      cursor: pointer;
    }
  }

  .toolbar {
      height: 64px; line-height:64px;
  }

  .editor {
      z-index: 0; margin-top:12px
  }

  
</style>