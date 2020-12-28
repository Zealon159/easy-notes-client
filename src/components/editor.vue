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
                        <a-button type="danger" @click="deleteNotes">
                            <a-icon type="delete"  />
                        </a-button>
                        <a-button>
                            <a-icon type="heart" />
                        </a-button>
                        
                        <a-button>
                            移动
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
        </div>
        <div class="tag">
            <template v-for="(tag, index) in notes.tags">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                    <a-tag :key="tag" :color="tagColor(index)" :closable="index !== 0" @close="() => handleClose(tag)">
                        {{ `${tag.slice(0, 20)}...` }}
                    </a-tag>
                </a-tooltip>
                <a-tag v-else :key="tag" :color="tagColor(index)" :closable="index !== 0" @close="() => handleClose(tag)">
                    {{ tag }}
                </a-tag>
            </template>
            <a-input
                v-if="inputVisible"
                ref="input"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                :value="inputValue"
                @change="handleInputChange"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
            />
            <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                <a-icon type="tag" /> +标签
            </a-tag>
        </div>
        <div id="myEditor" class="editor" ></div>
    </div>
</template>

<script>
    import wangEditor from 'wangeditor'
    export default {
        data() {
            return {
                inputVisible: false,
                inputValue: ''
            }
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
            editor.create()
            this.editor = editor
        },
        watch: {
            notes () {
                // 初始化赋值
                this.editor.txt.html(this.notes.content)
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
                this.postRequest('/notes/update', dataForm).then(resp => {
                    if (resp && resp.code==200) {
                        this.$message.success(resp.msg);
                        // 回传给父组件更新的标题
                        this.$emit('updateTitle', this.notes.id, this.notes.title);
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
                    }
                })
            },
            handleClose(removedTag) {
                let tags = this.notes.tags.filter(tag => tag !== removedTag);
                this.tags = tags;
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },

            handleInputChange(e) {
                this.inputValue = e.target.value;
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                let tags = this.notes.tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                console.log(tags);
                this.notes.tags = tags;
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                });
            },
            tagColor:function(index){
                let color = 'green';
                if(index % 7 == 0){
                    color = 'green';
                } else if(index % 7 == 1){
                    color = 'blue';
                } else if(index % 7 == 2){
                    color = 'cyan';
                } else if(index % 7 == 3){
                    color = 'pink';
                } else if(index % 7 == 4){
                    color = 'orange';
                } else if(index % 7 == 5){
                    color = 'red';
                } else if(index % 7 == 6){
                    color = 'purple';
                }
                return color;
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
    h3 {
      margin: 30px 0 15px;
    }
  }

  .toolbar {
      height: 64px; line-height:64px;
  }

  .editor {
      z-index: 0; 
      margin-top:12px
  }

  
</style>