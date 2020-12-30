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
                            <a-button>
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
    </div>
</template>

<script>
    import Vue from 'vue'
    import tags from '@/components/tags'
    import mavonEditor from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    Vue.use(mavonEditor)
    export default {
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
        methods: {
            // 更新笔记
            save(){
                let dataForm = {
                    id: this.notes.id,
                    title: this.notes.title,
                    content: this.notes.content
                }
                this.postRequest('/notes/update', dataForm).then(resp => {
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
                postRequest('/notes/update', dataForm).then(resp => {
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
                postRequest('/notes/update', dataForm).then(resp => {
                    if (resp && resp.code==200) {
                        // 回传给父组件
                        this.$emit('updateNotes', this.notes);
                        this.$message.success(resp.msg);
                    }
                })
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