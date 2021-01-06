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
                    <a-list-item class="notes-item" v-for="(item,index) in notesList" :index="index+''" :key="index">
                        <div @mouseenter="onMouseoverEnvDelBtn($event)" @mouseleave="onMouseleaveEnvDelBtn($event)">
                            <div class="title">
                                <a @click="loadNotesInfo(item.id)">
                                    <svg v-if="item.type=='markdown'"
                                        t="1609211872898" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2261" width="10" height="10"><path d="M896 0h128v1024h-128V304l-303.872 569.728L672 1024h-320l79.872-150.272L128 304V1024H0V0h128l384 722.816L896 0z" fill="#2F80ED" p-id="2262"></path></svg>
                                    <svg v-if="item.type=='rich_text'"
                                        t="1609213178251" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29469" width="10" height="10"><path d="M577.215757 956.736653c-11.568886-15.561688-17.19976-52.315937-17.19976-110.262748V64.191962h127.360128c32.24955 0 60.506299 2.25235 84.360728 6.859428 24.059188 4.607079 44.227954 13.104579 60.915816 25.69726 16.687862 12.592681 30.20196 30.406719 40.542292 53.646871 10.442711 23.240152 18.223555 53.032593 23.444911 89.889222h29.690062V0H48.835033v240.079984h18.018796c4.19756-32.24955 11.159368-59.482503 20.783044-81.903619s22.216357-40.542292 37.880424-54.363528c15.561688-13.923615 34.706659-23.854429 57.127774-30.09958 22.421116-6.245151 48.425515-9.418916 78.115577-9.418916h149.269346v782.179564c0 62.861028-7.064187 102.174765-21.192561 117.838832-19.247351 21.090182-49.756449 31.737652-91.424916 31.737653h-36.754249v27.94961h449.446111v-27.94961h-37.470906c-44.842232-0.204759-76.682264-13.309338-95.417716-39.313737z" fill="#15385A" p-id="29470"></path><path d="M682.666667 762.522695h6.040392c1.433313-10.74985 3.685663-19.861628 6.859428-27.232953 3.173765-7.473705 7.371326-13.514097 12.695061-18.121176 5.118976-4.607079 11.568886-7.985603 18.940212-10.033193 7.473705-2.04759 16.175965-3.173765 26.106778-3.173765h49.756449v260.760648c0 20.987802-2.354729 33.990002-6.961808 39.211357-6.44991 6.961808-16.585483 10.545091-30.509098 10.545091h-12.285543v9.316537H903.089782v-9.316537h-12.490302c-14.947411 0-25.594881-4.29994-31.737652-13.104579-3.788042-5.221356-5.835633-17.404519-5.835633-36.856628V703.961608h42.487502c10.85223 0 20.168766 0.716657 28.05199 2.252349 8.087982 1.535693 14.742651 4.29994 20.271146 8.497501s10.033193 10.237952 13.616476 17.814037c3.378524 7.678464 6.040392 17.711658 7.780844 29.894821h9.930814v-79.958408H682.666667v80.060787z" fill="#D0D7DE" p-id="29471"></path></svg>
                                    
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
                type:''
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
