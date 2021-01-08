<template>
    <a-layout id="components-layout-title" style="min-height: 100vh;">
        <a-layout-sider theme="light" width="500" :collapsed="collapsed" collapsedWidth="0">
            <!--分类信息-->
            <a-statistic 
                title="废纸篓"
                :value="notesCount" 
                style="margin:15px 0px 0px 15px" 
                suffix="条笔记" />
            <a-divider style=" margin:15px 0px 0px 0px; "/>

            <!--笔记列表-->
            <div :style="notesListStyle">
                <a-list size="small" theme="light">
                    <a-list-item class="title" v-for="(item,index) in notesList" :index="index+''" :key="index">
                        <div @mouseenter="onMouseoverEnvDelBtn($event)" @mouseleave="onMouseleaveEnvDelBtn($event)">
                            <div style="width:280px; float:left; margin-left:10px">
                                <a @click="loadNotesInfo(item.id)">
                                    <my-icon v-if="item.type=='markdown'" type="icon-markdown" style="font-size: 10px;" />
                                    <my-icon v-else type="icon-wenben" style="font-size: 10px;" /> 
                                    <a-tooltip v-if="item.title.length > 17" :key="item.title" :title="item.title">
                                        {{ `${item.title.slice(0, 17)}...` }}
                                    </a-tooltip>
                                    <span v-else>
                                        {{ item.title }}
                                    </span>
                                    <a-icon v-if="item.star==1" type="heart" theme="twoTone" two-tone-color="#eb2f96" /> 
                                </a>
                            </div>
                            <div style="width:150px; float:left">
                                <a @click="loadNotesInfo(item.id)">
                                    {{item.updateTime}}
                                </a>
                            </div>
                            <div style="width:40px; float:left" class="env-del-btn-span">
                                <a-space>
                                    <a @click="recoveryNotes(item.id)">
                                        <a-icon type="undo" :style="{ color: 'green', fontSize: '14px' }" />
                                    </a>
                                    <a @click="deleteNotes(item.id)">
                                        <a-icon type="delete" theme="filled" :style="{ color: 'red', fontSize: '14px' }" />
                                    </a>
                                </a-space>
                            </div>
                        </div>
                    </a-list-item>
                </a-list>
            </div>
        </a-layout-sider>

        <!-- 笔记预览 -->
        <a-layout-content>
            <div style="margin: 16px">
                <a-space>
                    <a-button type="primary" @click="recoveryNotes(notes.id)" v-if="notesList.length!=0">
                        <a-icon type="undo" /> 恢复
                    </a-button>
                    <a-button type="danger" @click="deleteNotes(notes.id)" v-if="notesList.length!=0">
                        <a-icon type="delete" /> 删除
                    </a-button>
                    <a-button type="danger" @click="deleteAll()">
                        <a-icon type="warning" /> 全部删除
                    </a-button>
                </a-space>
            </div>
            <div style="margin: 16px; padding: 24px; background: #fff; minHeight: 580px">
                <h2>
                    <my-icon v-if="notes.type=='markdown'" type="icon-markdown" />
                    <my-icon v-else type="icon-wenben" />   
                     {{notes.title}}
                    <a-icon v-if="notes.star==1" type="heart" theme="twoTone" two-tone-color="#eb2f96" /> 
                </h2>
                <div v-html="notes.content">
                </div>
                <a-empty v-if="notesList.length==0"></a-empty>
            </div>
        </a-layout-content>

    </a-layout>
</template>

<script>
    export default {
        data() {
            return {
                token: this.db.get("USER").token,
                delBtn: false,
                collapsed: false,
                notesList:[],
                notes:{},
                notesCount:0,
                type:''
            };
        },
        created() {
            this.loadNotesList()
        },
        computed: {
            notesListStyle: function() {
                // 计算body可用高度
                let cHeight = window.outerHeight - (window.outerHeight - window.innerHeight) - 100;
                let style = "overflow:auto; margin:0px; height:" + cHeight + "px;";
                return style
            }
        },
        methods: {
            // 笔记列表
            loadNotesList(){
                this.notesList = [];
                this.notesCount = 0;
                this.notes = {};
                let categoryId = 0
                let star = -1;
                let del = 1;
                let level = -1;
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
            removeNotes(id){
                this.empyt = false
                let notesList = this.notesList.filter(note => note.id !== id);
                this.notesList = notesList;
                this.notesCount = notesList.length
                if(notesList.length > 0){
                    this.loadNotesInfo(notesList[0].id);
                }else{
                    this.notes={}
                }
            },
            // 恢复笔记
            recoveryNotes(id){
                let postRequest = this.postRequest
                let dataForm = {
                    id: id,
                    delete: 0
                }
                postRequest('/notes/update', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        this.removeNotes(id);
                        this.$message.success(resp.msg);
                    }
                })
            },
            // 删除笔记
            deleteNotes(id){
                let postRequest = this.postRequest
                let that = this
                this.$confirm({
                    title: '确认删除笔记吗?',
                    content: '删除后不可恢复哦',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '算了',
                    onOk() {
                        postRequest('/notes/delete', {id: id}, {"JWTHeaderName":that.token}).then(resp => {
                            if (resp && resp.code==200) {
                                that.removeNotes(id);
                                that.$message.success(resp.msg);
                            }
                        })
                    }
                });
            },
            // 删除全部
            deleteAll(){
                if(this.notesList.length == 0){
                    this.$message.info('废纸篓已是空空如也');
                    return;
                }

                let postRequest = this.postRequest
                let that = this
                this.$confirm({
                    title: '确认要删除全部笔记吗?',
                    content: '删除就没有了，也没有后悔药吃哦！',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '算了',
                    onOk() {
                        postRequest('/notes/delete-all', {}, {"JWTHeaderName":that.token}).then(resp => {
                            if (resp && resp.code==200) {
                                that.notesList = [];
                                that.notes = {};
                                that.notesCount = 0;
                                that.$message.success(resp.msg);
                            }
                        })
                    }
                });
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
    .title{
        padding:0px;
        margin:0px
    }

    .title a {
        color:grey; font-size: 12px;
    }

    .env-del-btn-span{ display: none;}
</style>
