<template>
    <a-layout-content style="margin: 16px">
        <a-page-header
            style=" background-color:#FFFFFF"
            title="分类管理"
            backIcon=''
            sub-title="可以修改排序按顺序显示哦"
            @back="() => null"
        >
            <div style="margin-top:10px">
                <a-space>
                    <a-input v-model="category.title" style="width:200px" placeholder="输入分类名称" >
                        <template #prefix>
                            <a-icon type="info-circle" />
                        </template>
                    </a-input>
                    <a-input v-model="category.sort" style="width:100px" placeholder="输入排序" >
                        <template #prefix>
                            <a-icon type="sort-ascending" />
                        </template>
                    </a-input>
                    <a-button type="primary" @click="save">
                        <a-icon type="save" />保存
                    </a-button>
                </a-space>
            </div>
        </a-page-header>
        
        <div style="padding:20px; margin-top:16px; background-color:#FFFFFF">
            <a-list
                class="demo-loadmore-list"
                :loading="loading"
                item-layout="horizontal"
                :data-source="categorys"
            >
                <div
                    v-if="showLoadingMore"
                    slot="loadMore"
                    :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                >
                </div>
                <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
                    <a slot="actions" @click="loadCategory(item.id)">编辑</a>
                    <a slot="actions" @click="deleteCategory(item.id)">删除</a>
                    <a-list-item-meta>
                        <a slot="title" @click="loadCategory(item.id)">{{ item.title }}</a>
                    </a-list-item-meta>
                    <div>{{ item.sort }}</div>
                </a-list-item>
            </a-list>
        </div>
    </a-layout-content>
</template>
<script>
    export default {
        data() {
            return {
                user: this.db.get("USER"),
                loading: true,
                loadingMore: false,
                showLoadingMore: true,
                categorys: [],
                category:{}
            };
        },
        mounted() {
            this.loadCategorys();
        },
        methods: {
            loadCategorys() {
                // 分类列表
                this.categorys = [];
                this.getRequest('/category/list', {}, {"JWTHeaderName":this.user.token}).then(resp => {
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
            loadCategory(id) {
                // 分类
                this.loading = true;
                this.getRequest('/category/details', {id:id}, {"JWTHeaderName":this.user.token}).then(resp => {
                    if (resp.code == 200) {
                        this.category = resp.data;

                    }
                    this.loading = false;
                }) 
            },
            save(){
                if(!this.category.title){
                    this.$message.info('请输入分类名称');
                    return false;
                }
                if(!this.category.sort){
                    this.$message.info('请输入显示顺序');
                    return false;
                }
                let url = '/category/create';
                if(this.category.id){
                    url = '/category/update';
                }
                let dataForm = {
                    id: this.category.id,
                    title: this.category.title,
                    sort: this.category.sort
                }
                this.postRequest(url, dataForm, {"JWTHeaderName":this.user.token}).then(resp => {
                    if (resp && resp.code==200) {
                        this.$message.success(resp.msg);
                        // 回传给父组件更新的标题
                        //this.$emit('updateNotes', this.notes);
                        this.loadCategorys()
                    }
                })
            },
            deleteCategory(id){
                let that = this;
                this.$confirm({
                    title: '确认删除分类吗?',
                    content: '删除后不可恢复哦',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '算了',
                    onOk() {
                        that.postRequest('/category/delete', {id: id}, {"JWTHeaderName":that.user.token}).then(resp => {
                            if (resp && resp.code==200) {
                                that.$message.success(resp.msg);
                                that.loadCategorys();
                            }else{
                                that.$message.warn(resp.msg);
                            }
                        })
                    }
                });
            }
        },
    };
</script>
<style>
    .demo-loadmore-list {
        min-height: 350px;
        padding:0px 10px 10px 10px;
    }

    
</style>