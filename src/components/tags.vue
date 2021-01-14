<template>
    <div>
        <template v-for="(tag, index) in notes.tags">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                <a-tag :key="tag" :color="tagColor(index)" closable @close="() => handleClose(tag)">
                    {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :color="tagColor(index)" closable @close="() => handleClose(tag)">
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
            @blur="handleInputChannel"
            @keyup.enter="handleInputConfirm"
        />
        <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
            <my-icon type="icon-biaoqian"/> +标签
        </a-tag>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                token: this.db.get("USER").token,
                inputVisible: false,
                inputValue: ''
            }
        },
        props: {
            notes: {}
        },
        methods: {
            // 更新标签
            save(type, tagName){
                let dataForm = {
                    notesId: this.notes.id,
                    type: type,
                    tagName: tagName,
                    tags: this.notes.tags
                }
                this.postRequest('/notes/update-tags', dataForm, {"JWTHeaderName":this.token}).then(resp => {
                    if (resp && resp.code==200) {
                        console.log(resp.msg)
                    }
                })
            },
            // 删除标签
            handleClose(removedTag) {
                let tags = this.notes.tags.filter(tag => tag !== removedTag);
                this.notes.tags = tags;
                this.save(-1, removedTag);
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
            // 提交标签
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if(inputValue==''){
                    this.$message.info('请输入标签名哦');
                    return;
                }
                let tags = this.notes.tags;
                if(tags == null){
                    tags = [];
                }
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                
                this.notes.tags = tags;
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                });
                this.save(1, inputValue);
            },
            // 取消操作
            handleInputChannel(){
                let inputValue = this.inputValue;
                let tags = this.notes.tags;
                if(tags == null){
                    tags = [];
                }
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                
                this.notes.tags = tags;
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                });
                if(inputValue!=''){
                    this.save(1, inputValue);
                }
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
        }
    }
</script>