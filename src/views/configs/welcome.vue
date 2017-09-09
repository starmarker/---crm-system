
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p style="font-size:16px;">
                <Icon type="lock-combination"></Icon> 权限管理</p>
        </div>
        <div class="layout-content-main">欢迎使用SMKCRM</div>
    </div>
</template>
<script>
export default {

    data() {
        return {
            items: [{
                'colname': "text",
                'colvalue': '12',
                'type': 1,
            }, {
                'colname': "text2",
                'colvalue': '34',
                'type': 2,
            }],
        }
    },
    created() {
        // this.$http.post("/getInfo",{}).then((res)=>{
        //     console.log(res)
        // },(reject)=>{console.log(reject)}).catch((error)=>{console.log(error)});
    },

    methods: {
    }
}
</script>
