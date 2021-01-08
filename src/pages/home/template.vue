<template>
    <div>
        <a-row style="background-color:#FFFFFF; padding:16px">
            <a-col :span="24">
                
            </a-col>
        </a-row>
        <a-layout-content class="gutter-content">
            <a-row :gutter="[24,24]">
                <a-col :span="6" class="gutter-row">
                    <div class="gutter-box">
                        <a-card title="Card title" :bordered="false">
                            <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
                            Group title
                            </p>
                        </a-card>
                    </div>
                </a-col>
                <a-col :span="18" class="gutter-row">
                    <div class="gutter-box">
                        <a-card title="Card title" :bordered="false">
                            <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500">
                            Group title
                            </p>
                        </a-card>
                    </div>
                </a-col>
            </a-row>
        </a-layout-content>
    </div>
</template>
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