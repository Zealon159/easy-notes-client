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
        <div id="myEditor" class="editor" ></div>
    </div>
</template>

<script>
    import wangEditor from 'wangeditor'
    import tags from '@/components/tags'
    export default {
        data(){
            return{
                token: this.db.get("USER").token,
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
            // 更新笔记
            save(){
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