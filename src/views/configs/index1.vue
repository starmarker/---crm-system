
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#">首页</Breadcrumb-item>
                <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
                <Breadcrumb-item>某应用</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="layout-content-main">内容区域</div>
    </div>
</template>
<script>
    export default {
        
        data(){
            return {
                items:[{
                    'colname':"text",
                    'colvalue':'12',
                    'type':1,
                },{
                    'colname':"text2",
                    'colvalue':'34',
                    'type':2,
                }],
            }
        },
        created(){
            // this.$http.post("/getInfo",{}).then((res)=>{
            //     console.log(res)
            // },(reject)=>{console.log(reject)}).catch((error)=>{console.log(error)});
        },
        
        methods: {
        }
    }
</script>
