<style scoped>
 
</style>
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color">
                    <Icon type="ios-personadd"></Icon> — </span>
                <span class="main-title-text">企业配置</span>
            </p>
    
        </div>
        <div class="layout-content-main personal">
            <Row justify="center" type="flex">
                <Col span="12">
                <h2 class="main-title-color" style="text-align:left;line-height:3;">基本信息</h2>
                <Form :model="company" ref="company" :rules="companyRule" :label-width="100" label-position="left">
                    <Form-item label="公司名称" prop="name">
                        <Input v-model="company.name" ></Input>
                    </Form-item>
                     <Form-item label="当前公司logo">
                        <img :src="company.logo" alt="" style="max-height:60px;max-width:180px;">
                        <Upload ref="upload" :show-upload-list="true"  :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" type="drag" action="/web/Crm_crop_account_company/addComHeadImg" style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <span>图片大小不超过2M,分辨率为180*60比例的图片</span>
                    </Form-item>
                    
                    <Form-item label="所在地区" prop="area">
                        <Input v-model="company.area"></Input>
                    </Form-item>
                    <Form-item label="所属行业" prop="industry">
                        <Input v-model="company.industry"></Input>
                    </Form-item>
                    <Form-item label="邀请码" prop="code">
                        <Input v-model="company.code"></Input>
                    </Form-item>
                    <Form-item label="公司动态" prop="msg">
                        <Input v-model="company.msg"></Input>
                    </Form-item>
                    <h2 class="main-title-color" style="text-align:left;line-height:3;">线索公海配置</h2>
                    
                   <Form-item label="线索回归公海周期:" prop="cluebackday"  :label-width="200">
                        <Input number v-model="company.cluebackday" style="width:150px"><span slot="append">天</span></Input>
                    </Form-item>
                    <Form-item label="每人每天领取线索数量：" prop="cluedailymax" :label-width="200">
                        <Input  number v-model="company.cluedailymax" style="width:150px"><span slot="append">条</span></Input>
                    </Form-item>
                    <h2 class="main-title-color" style="text-align:left;line-height:3;">客户公海配置</h2>
                   <Form-item label="客户回归公海周期" prop="cusbackday"  :label-width="200">
                        <Input number  v-model="company.cusbackday" style="width:150px"><span slot="append">天</span></Input>
                    </Form-item>
                    <Form-item label="每人每天领取客户数量" prop="cusdailymax" :label-width="200">
                        <Input number  v-model="company.cusdailymax" style="width:150px"><span slot="append">条</span></Input>
                    </Form-item>
                    <Form-item label="计划指标" prop="plantype">
                    <Select v-model="company.plantype" style="width:200px">
                        <Option v-for="item in plantype_list" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" long style="letter-spacing:3em;" @click="updateComInfo">提交</Button>
                    </Form-item>
                </Form>
                </Col>
            </Row>
        </div>

    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {

        return {
            plantype_list: [
                    {
                        value: 1,
                        label: '商机金额'
                    },
                    {
                        value: 2,
                        label: '合同金额'
                    },
                    {
                        value: 3,
                        label: '汇款金额'
                    }
                ],
            company: {
                com_id:0,
                sas_id:0,
                name:"",
                logo:"",
                area:"",
                industry:"",
                code:"",
                msg:"",
                cluebackday:30,
                cluedailymax:10,
                cusbackday:7,
                cusdailymax:5,
                plantype:0,

            },
            companyRule:{
                    name:[{
                        required:true,
                        message:'公司名不能为空',
                        trigger:'blur'
                    },{
                        type:"string",
                        message:'最长不能超过10位',
                        max:10,
                        trigger:'blur'
                    }],

                cluebackday:[{
                        required:true,
                        type:"number",
                        message:'不能为空',
                        trigger:'blur'
                    }],

                cluedailymax:[{
                        required:true,
                        type:"number",
                        message:'不能为空',
                        trigger:'blur'
                    }],
                cusbackday:[{
                        required:true,
                        type:"number",
                        message:'不能为空',
                        trigger:'blur'
                    }],
                cusdailymax:[{
                        required:true,
                        type:"number",
                        message:'不能为空',
                        trigger:'blur'
                    }],
                plantype:[{
                        required:true,
                        type:"number",
                        message:'不能为空',
                        trigger:'blur'
                    }],
                },
            imgName: '',
            visible: false,
            uploadList: [],
            fileList:[],
        }
    },
    computed: {
        ...mapState({
            user: 'user_name',
            depart_name: 'depart_name'
        }), //这里是同步全局store文件中的数据
        contentHeight() {
            let cheight = document.body.clientHeight;
            cheight = cheight > 400 ? cheight : 400;
            return (cheight - 120);
        },
    },
    mounted() {
        this.uploadList = this.$refs.upload.fileList;
    },
    created() {
        //
        this.findComInfo();
    },
    methods: {
        handleView(name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove(file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file) {
            // 因为上传过程为实例，这里模拟添加 url
            this.company.logo=res.o;
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleBeforeUpload() {
            const check = this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 1 张图片。'
                });
            }
            return check;
        },

        //查询
        findComInfo(){
            this.$http.post("/web/Crm_crop_account_company/findCrm_crop_account_company",{},{emulateJSON:true}).then((res)=>{
                if(res.data.b==1){
                    this.company=res.data.o;
                }else{

                }
               
            }).catch(function(response) {
               
            });
        },
        //修改
        updateComInfo(){
            this.$refs.company.validate((valid)=>{
                if(valid){
                    this.$http.post("/web/Crm_crop_account_company/updateCrm_crop_account_company",this.company,{emulateJSON:true}).then((res)=>{
                    if(res.data.b==1){
                        this.$Message.success({content:'操作成功',duration: 1,onClose:()=>{
                            this.findComInfo();
                        this.$refs.upload.clearFiles();
                        }}) 
                    }else{
                        this.$Message.error({content:'操作失败',duration: 1,onClose:()=>{
                            this.findComInfo();
                            this.$refs.upload.clearFiles();
                        }}) 
                    }
                        
                    }).catch((res)=>{
                        this.$Message.error({content:'操作失败，原因未知',duration: 1,onClose:()=>{
                                    
                            this.findComInfo();
                            this.$refs.upload.clearFiles();
                        }})
                    });

                }
            });
        },
                              
    },
}
</script>