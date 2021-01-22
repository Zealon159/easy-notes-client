<template>
    <a-layout id="components-layout-title" style="min-height: 100vh;">
        <a-layout-sider theme="light" width="245" :collapsed="collapsed" collapsedWidth="0">
            <!--分类信息-->
            <a-statistic 
                :title="category.title" 
                :value="notesCount" 
                style="margin:15px 0px 0px 15px" 
                suffix="条笔记" />
            <a-divider style=" margin:15px 0px 0px 0px; "/>

            <!--笔记列表-->
            <div :style="notesListStyle">
                <a-list size="small" >
                    <a-list-item class="notes-item" v-for="(item,index) in notesList" :index="index+''" :key="index" :style="itemStyle(item.id)"
                        @click="loadNotesInfo(item.id)" >
                        <div @mouseenter="onMouseoverEnvDelBtn($event)" @mouseleave="onMouseleaveEnvDelBtn($event)">
                            <div class="title">
                                <a >
                                    <my-icon v-if="item.type=='markdown'" type="icon-markdown" style="font-size: 10px;" />
                                    <my-icon v-else type="icon-wenben" style="font-size: 10px;" />    
                                    <a-tooltip v-if="item.title.length > 12" :key="item.title" :title="item.title">
                                        {{ `${item.title.slice(0, 12)}...` }}
                                    </a-tooltip>
                                    <span v-else>
                                        {{ item.title }}
                                    </span>
                                    <a-icon v-if="item.star==1" type="heart" theme="twoTone" two-tone-color="#eb2f96" /> 
                                </a>
                                <div>
                                    <span class="time">
                                        {{common.formatTime(item.updateTime)}}
                                    </span>
                                </div>
                            </div>
                            <div class="btn">
                                <a class="env-del-btn-span" @click="deleteNotes(item.id)">
                                    <a-icon type="delete" theme="filled" :style="{ color: 'red' }" />
                                </a>
                            </div>
                        </div>
                    </a-list-item>
                </a-list>
            </div>
        </a-layout-sider>

        <!-- 笔记编辑器 -->
        <a-layout-content style="margin: 0 16px">
            <div>
                <component v-bind:is="currentComponent"
                    :notes="notes" 
                    @updateNotes="reShowNotes"
                    @removeNotes="removeNotes">
                </component>
            </div>
        </a-layout-content>

        <!--回到顶部-->
        <template>
        <div>
            <a-back-top />
        </div>
        </template>
    </a-layout>
</template>

<script>
    // 引入Editor组件
    import editorEmpty from '@/components/editor-empty'
    import editor from '@/components/editor'
    import editorMarkdown from '@/components/editor-markdown'
    export default {
        data() {
            return {
                token: this.db.get("USER").token,
                delBtn: false,
                collapsed: false,
                notesList:[],
                notes:{},
                notesCount:0,
                category:{},
                type:'',
                selectedId:''
            };
        },
        components: {
            editorEmpty,
            editor,
            editorMarkdown
        },
        computed: {
            currentComponent:{
                get: function () {
                    let componentName = 'editorEmpty';
                    if(this.notesList.length==0){
                        return componentName;
                    }
                    
                    if(this.notes.type == 'rich_text'){
                        componentName = 'editor';
                    } else if (this.notes.type == 'markdown') {
                        componentName = 'editorMarkdown';
                    }
                    return componentName;
                },
                set: function () {
                    
                }
            },
            notesListStyle: function() {
                // 计算body可用高度
                let cHeight = window.outerHeight - (window.outerHeight - window.innerHeight) - 100;
                let style = "overflow:auto; margin:0px; height:" + cHeight + "px;";
                return style
            }
        },
        created() {
            this.loadNotesList()
            this.loadCategoryInfo(this.$route.params.id)
        },
        watch: {
            '$route' () {
                // 对路由变化作出响应...
                //console.log(to + from)
                this.loadNotesList()
                this.loadCategoryInfo(this.$route.params.id)
            }
        },
        methods: {
            // 笔记列表
            loadNotesList(){
                this.notesList = [];
                this.notesCount = 0;
                this.notes = {};
                let categoryId = this.$route.params.id
                let star = -1;
                if (categoryId==1){
                    star = 1
                }
                let del = 0;
                if (categoryId==2){
                    del = 1
                }
                let level = this.$route.query.level;
                this.getRequest('/notes/list', 
                {
                    star: star,
                    delete: del,
                    direction: 0,
                    level: level, 
                    categoryId: categoryId
                }, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp.code == 200) {
                        if(resp.data.length > 0){
                            this.currentComponent = 'editor'
                            // 笔记总数
                            this.notesCount = resp.data.length;
                            for(let i=0;i<resp.data.length;i++){
                                if(i==0){
                                    this.loadNotesInfo(resp.data[i].id);
                                }
                                this.notesList.push(resp.data[i])
                            }
                        } else {
                            // 显示空状态
                            this.currentComponent = 'editorEmpty'
                        }
                    }
                })
            },
            // 笔记信息
            loadNotesInfo(id){
                this.getRequest('/notes/details', {id: id}, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp.code == 200) {
                        this.notes = resp.data;
                    }
                })
                this.selectedId = id;
            },
            // 分类信息
            loadCategoryInfo(id){
                if (id == 0) {
                    this.category.title = "近期笔记";
                } else if (id == 1) {
                    this.category.title = "我的收藏";
                } else if (id == 2) {
                    this.category.title = "废纸篓";
                } else {
                    this.getRequest('/category/details', {id: id}, {"JWTHeaderName":this.token}).then(resp => {
                        if (resp.code == 200) {
                            this.category = resp.data;
                        }
                    })
                }
            },
            // 重新加载修改的笔记信息
            reShowNotes(notes){
                let id = this.$route.params.id;
                if (id == 1){
                    this.removeNotes(notes.id);
                } else {
                    for(let i=0;i<this.notesList.length;i++){
                        if(this.notesList[i].id==notes.id){
                            this.notesList[i].title = notes.title
                            this.notesList[i].star = notes.star
                            break;
                        }
                    }
                }
            },
            removeNotes(id){
                this.empyt = false
                let notesList = this.notesList.filter(note => note.id !== id);
                this.notesList = notesList;
                this.notesCount = notesList.length
                if(notesList.length > 0){
                    this.loadNotesInfo(notesList[0].id);
                }
            },
            // 删除笔记
            deleteNotes(id){
                let postRequest = this.postRequest
                let dataForm = {
                    id: id,
                    delete: 1
                }
                postRequest('/notes/update', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        this.removeNotes(id)
                    }
                })
            },
            // 控制删除按钮
            onMouseoverEnvDelBtn(event) {
                event.target.parentElement.querySelector(".env-del-btn-span").style.cssText += "display:block"
            },
            onMouseleaveEnvDelBtn(event) {
                event.target.parentElement.querySelector(".env-del-btn-span").style.cssText += "display:none"
            },
            itemStyle (id){
                if(this.selectedId==id){
                    return 'background:#eff5fa';
                }else{
                    return '';
                }
            }
        }
    };
</script>

<style>
    .notes-item {
        padding:0px;
        margin:0px
    }

    .notes-item .title {
        width:200px; float:left; margin-left:10px
    }

    .notes-item .title a {
        color:rgb(36, 43, 33); font-size: 13px;
    }

    .notes-item .title .time {
        font-size:12px; color:rgb(161, 185, 206)
    }

    .notes-item .btn {
        width:20px; float:left
    }

    .env-del-btn-span{ display: none;}
</style>
