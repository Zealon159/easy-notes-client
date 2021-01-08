<template>
    <a-list item-layout="horizontal" :data-source="bindList">
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <a v-if="!item.name" slot="actions" @click="oauth2Bind(item.clientName)">绑定</a>
            <a-popconfirm v-else slot="actions"
                placement="leftTop" 
                title="确认要解除绑定吗?"
                ok-text="确定"
                cancel-text="算了"
                @confirm="removeBind(item.clientName)"
            >
                <a>解绑</a>
            </a-popconfirm>
            <a-list-item-meta
                :description="description(item.name,item.bindTime)"
            >
                <a slot="title" >{{ item.clientNameCn }}</a>
                <a-avatar v-if="item.name!=null" slot="avatar" :icon="item.clientName" style="backgroundColor:#6495ED;font-size:20px"></a-avatar>
                <a-avatar v-else slot="avatar" :icon="item.clientName" style="backgroundColor:#DCDCDC;font-size:20px"></a-avatar>
            </a-list-item-meta>
        </a-list-item>
    </a-list>
</template>
<script>
    export default {
        data() {
            return {
                bindList:[],
            };
        },
        props: {
            user: {}
        },
        computed: {
            
        },
        created() {
            this.loadBindList();
        },
        methods: {
            loadBindList(){
                this.getRequest('/user/account-bind-list', {userId: this.user.userId}, {"JWTHeaderName":this.user.token}).then(resp => {
                    if (resp.code == 200) {
                        for(let i=0;i<resp.data.length;i++){
                            this.bindList.push(resp.data[i])
                        }
                    }
                })
            },
            description(name, time){
                if(!name){
                    return '尚未绑定';
                }else{
                    return name+' 绑定于：'+time;
                }
            },
            // 解绑社交账户
            removeBind(clientName){
                let that = this
                let values = {
                    userId: this.user.userId,
                    bindType: -1,
                    clientName: clientName
                }
                this.postRequest('/user/remove-bind', values, {"JWTHeaderName":this.user.token}).then(resp => {
                    if (resp && resp.code==200) {
                        that.bindList = [];
                        for(let i=0;i<resp.data.length;i++){
                            that.bindList.push(resp.data[i])
                        }
                        that.$message.success(resp.msg);
                    }else{
                        that.$message.warn(resp.msg);
                    }
                })
            },
            // 绑定社交账户
            oauth2Bind(client){
                let url = "";
                let timestamp = new Date().getTime();
                if(client=="github"){
                    url = "https://github.com/login/oauth/authorize?client_id=d2456e0d3f62d5838fb2&redirect_uri=http://localhost:9000/login/oauth2/callback/github&login=notes-user&scope&state="+timestamp+"&allow_signup=true";
                    location.href = url;
                } else {
                    this.$message.info(client + '开发者应用审核中，后续实现该社交登录哦~');
                }
            }
        }
    };
</script>
<style></style>
