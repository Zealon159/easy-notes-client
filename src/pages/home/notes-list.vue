<template>
    <a-layout id="components-layout-title" style="min-height: 100vh;">
        <a-layout-sider theme="light">

        <!--分类信息-->
        <a-statistic :title="category.name" :value="notesCount" style="margin:15px 0px 0px 15px" suffix="条笔记"/>
        <a-divider style=" margin:15px 0px 0px 0px; "/>

        <!--标题列表-->
        <div style="height:600px;overflow:auto; margin:0px">
            <a-list size="small" theme="light">
                <a-list-item class="title" v-for="(item,index) in notesList" :index="index+''" :key="index">
                    <a @click="loadNotesInfo(item.id)">{{item.title}}</a>
                </a-list-item>
            </a-list>
        </div>
        </a-layout-sider>
        <a-layout-content style="margin: 0 16px">
            <div style="margin: 16px 0">
                {{notes.title}}
            </div>
            <div :style="{ padding: '24px', background: '#fff', minHeight: '460px' }">
                {{notes.content}}
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
    export default {
        data() {
            return {
                collapsed: false,
                notesList:[],
                notes:{},
                notesCount:0,
                category:{}
            };
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
            }
        }
    };
</script>

<style>
    .title{
        padding-left:10px;height:36px
    }

    .title a {
        color:grey; font-size: 12px;
    }
</style>
