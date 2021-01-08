<template>
    <div>
        <!--个人基础信息-->
        <a-row style="background-color:#FFFFFF; padding:16px">
            <a-col :span="16">
                <h2>{{summary.greet + user.userName + summary.welcome}}</h2>
                {{summary.classicQuotations[Math.floor(Math.random() * summary.classicQuotations.length)]}}
            </a-col>
            <a-col :span="3">
                <a-statistic title="笔记本" :value="summary.categoryCount" >
                    <template #suffix>个</template>
                </a-statistic>
            </a-col>
            <a-col :span="3">
                <a-statistic title="笔记" :value="summary.notesCount" >
                </a-statistic>
            </a-col>
            <a-col :span="2">
                <a-statistic title="标签" :value="summary.tagCount" >
                </a-statistic>
            </a-col>
        </a-row>
        <a-layout-content class="gutter-content">
            <a-layout style="padding: 24px 0; background: #fff">
                <a-layout-sider width="200" style="background: #fff">
                    <a-menu
                        :default-selected-keys="['1001']" 
                        mode="inline"
                        style="height: 100%"
                    >
                        <a-menu-item key="1001" @click="currentComponent='myUserInfo'">
                            基本信息
                        </a-menu-item>
                        <a-menu-item key="1002" @click="currentComponent='myPwd'">
                            修改密码
                        </a-menu-item>
                        <a-menu-item key="1003" @click="currentComponent='myAccountBind'">
                            社交绑定
                        </a-menu-item>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content :style="{ padding: '0 24px', minHeight: '400px' }">
                    <component v-bind:is="currentComponent" :user="user">
                    </component>
                </a-layout-content>
            </a-layout>
        </a-layout-content>
    </div>
</template>
<script>
    // 引入组件
    import myUserInfo from '@/components/my-user-info'
    import myPwd from '@/components/my-pwd'
    import myAccountBind from '@/components/my-account-bind'
    export default {
        data() {
            return {
                user: this.db.get("USER"),
                currentComponent:'myUserInfo',
                summary:{}
            };
        },
        components: {
            myUserInfo,myPwd,myAccountBind
        },
        computed: {
        },
        mounted() {
            this.loadDashboardSummary();
        },
        methods: {
            // 加载仪表盘
            loadDashboardSummary(){
                this.getRequest('/dashboard/summary', {}, {"JWTHeaderName":this.user.token}).then(resp => {
                    if (resp.code == 200) {
                        this.summary = resp.data
                    }
                }) 
            },
        }
    }
</script>
<style scoped>
    .gutter-content {
        padding:20px;
        background: transparent;
        border: 0;
    }
    .gutter-box {
        background: #FFFFFF;
        padding: 0px;
    }
</style>