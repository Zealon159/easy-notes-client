<template>
    <a-layout id="components-layout-title" style="min-height: 100vh;">
        <a-layout-sider theme="light" width="230" :collapsed="collapsed" collapsedWidth="0">
            <!--分类信息-->
            <a-statistic :title="category.name" :value="notesCount" style="margin:15px 0px 0px 15px" suffix="条笔记"/>
            <a-divider style=" margin:15px 0px 0px 0px; "/>

            <!--笔记列表-->
            <div style="height:600px;overflow:auto; margin:0px">
                <a-list size="small" theme="light">
                    <a-list-item class="title" v-for="(item,index) in notesList" :index="index+''" :key="index">
                        <a @click="loadNotesInfo(item.id)">{{item.title}}</a>
                    </a-list-item>
                </a-list>
            </div>
        </a-layout-sider>

        <!-- 笔记编辑器 -->
        <a-layout-content style="margin: 0 16px">
            <div>
                <editor :notes="notes" 
                @updateTitle="reShowUpdateTitle"
                @removeNotes="removeNotes"></editor>
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
    import editor from '@/components/editor'
    export default {
        data() {
            return {
                collapsed: false,
                notesList:[],
                notes:{},
                notesCount:0,
                category:{},
                type:''
            };
        },
        components: {
            editor
        },
        created() {
            this.loadNotesList()
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
                let level = this.$route.query.level;
                this.getRequest('/notes/list', 
                {
                    userId: "zealon",
                    star: -1,
                    delete: 0,
                    direction: 0,
                    level: level, 
                    categoryId: categoryId
                }).then(resp => {
                    if (resp.code == 200) {
                        if(resp.data.length > 0){
                            // 笔记总数
                            this.notesCount = resp.data.length;
                            for(let i=0;i<resp.data.length;i++){
                                if(i==0){
                                    this.loadNotesInfo(resp.data[i].id);
                                }
                                this.notesList.push(resp.data[i])
                            }
                        }
                    }
                })
            },
            // 笔记信息
            loadNotesInfo(id){
                this.getRequest('/notes/details', {id: id}).then(resp => {
                    if (resp.code == 200) {
                        this.notes = resp.data;
                    }
                })
            },
            // 分类信息
            loadCategoryInfo(id){
                this.getRequest('/category/details', {id: id}).then(resp => {
                    if (resp.code == 200) {
                        this.category = resp.data;
                    }
                })
            },
            // 重新加载修改的笔记标题
            reShowUpdateTitle(id, title){
                for(let i=0;i<this.notesList.length;i++){
                    if(this.notesList[i].id==id){
                        this.notesList[i].title = title
                        break;
                    }
                }
            },
            removeNotes(id){
                let notesList = this.notesList.filter(note => note.id !== id);
                this.notesList = notesList;
                if(notesList.length>0){
                    this.loadNotesInfo(notesList[0].id);
                } else {
                    // todo 空
                }
            }
        }
    };
</script>

<style>
    .title{
        padding-left:10px;
    }

    .title a {
        color:grey; font-size: 12px;
    }
</style>
