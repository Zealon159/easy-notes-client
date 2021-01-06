<template>
    <div class="home">
        <!--工具栏-->
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
        <mavon-editor v-model="notes.content" class="editor" :style="editorStyle"></mavon-editor>
        <!--移动至组件-->
        <a-modal v-model="visible" title="移动至其它笔记本" @ok="handleOk" :zIndex=1505 ok-text="确认" cancel-text="算了">
            <a-select
                show-search
                placeholder="选择一个笔记本哦"
                option-filter-prop="children"
                style="width: 245px;"
                :filter-option="filterOption"
                @change="handleChange"
                :dropdownStyle="{ zIndex:1510 }"
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
    import Vue from 'vue'
    import tags from '@/components/tags'
    import mavonEditor from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    Vue.use(mavonEditor)
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
        props: {
            notes: {}
        },
        components: {
            tags
        },
        computed: {
            // 收藏图标
            starIconTheme: function(){
                if(this.notes.star == 1){
                    return 'filled';
                }else{
                    return 'outlined';
                }
            },
            editorStyle: function() {
                // 计算body可用高度
                let cHeight = window.outerHeight - (window.outerHeight - window.innerHeight) - 110;
                let style = "margin-top:12px; height:" + cHeight + "px;";
                return style
            }
        },
        mounted() {
            this.loadCategorys();
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
                let dataForm = {
                    id: this.notes.id,
                    title: this.notes.title,
                    content: this.notes.content
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
        }
    }
</script>

<style>
    .home {
        width: 100%;
        margin: auto;
        position: relative;
    }

    .toolbar {
        height: 64px; line-height:64px;
    }

    .editor {
        z-index: 0; 
    }
</style>