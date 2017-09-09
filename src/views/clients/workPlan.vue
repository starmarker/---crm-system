<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color"><Icon type="ios-calendar"></Icon> — </span>
                <span class="main-title-text">工作计划</span></p>
            
        </div>
        <div class="layout-content-main work-plan">
            <div class="item-block-title">
                <!-- <Form-item label="选择年度" :label-width="100" prop="plan_year"> -->
                    <Date-picker placeholder="选择年度" type="year" v-model="findObj.plan_year" @on-change="setTime1($event,'findObj','plan_year')" style="width:150px;display:inline-block"></Date-picker>
                <!-- </Form-item> -->

                <!-- <Select width="200" placeholder="选择年度" v-model="findObj.plan_year" @on-change="changeYear" style="width:150px">
                    <Option value="2018">2018</Option>
                    <Option value="2016">2016</Option>
                    <Option value="2017">2017</Option>
                </Select> -->

                <Select width="200" placeholder="选择计划类型" v-model="findObj.plan_objtype" @on-change="changeType" style="width:150px">
                    <Option value="1">部门计划</Option>
                    <Option value="2">个人计划</Option>
                </Select>

                <Select placeholder="选择部门" v-model="findObj.plan_objkeyid" @on-change="changeDepart" style="width:150px" v-if="findObj.plan_objtype==1">
                    <Option v-for="item in deptList" :value="item.dept_id" :key="item">{{ item.dept_name }}</Option>
                </Select>
                <Select placeholder="选择人员" v-model="findObj.plan_objkeyid" @on-change="changePerson" style="width:150px" v-if="findObj.plan_objtype==2">
                    <Option v-for="item in chiefList" :value="item.user_id" :key="item">{{ item.user_name }}</Option>
                </Select>
                <Button type="primary" @click="resetInfo" long style="width:55px">重置</Button>
               <!-- 计划指标:【成单金额】-->
                <Button type="text" style="color:#3983c8;float:right;" @click="addPlan"><Icon type="plus"></Icon>添加计划</Button>
                <Table :columns="planHeader" :data="planData" style="margin-top:10px;" border></Table>
                <Page :total="planTotal" :current="pageCurrent" @on-change="changePage" show-sizer style="float:right;margin-top:10px;"></Page>
            </div>
        </div>
        <!--添加/修改弹出层-->
        <Modal v-model="isAddPlan" class="add-plan" width="600">
            <h3 class="item-block-title">工作计划</h3>
             <div class="plan-content">            
            <Form :label-width="50" :model="planForm" :rules="planFormValidate" ref="planForm" label-position="left" style="margin-top:10px;">
            <Row :gutter="16">
                <Col span="12">
                <Form-item label="计划年度" :label-width="100" prop="plan_year">
                    <Date-picker type="year" v-model="planForm.plan_year" @on-change="setTime($event,'planForm','plan_year')"></Date-picker>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="指标类型" :label-width="100" prop="plan_type" >
                    <Select v-model="planForm.plan_type" disabled>
                        <Option :value="1">商机金额</Option>
                        <Option :value="2">合同金额</Option>
                        <Option :value="3">回款金额</Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="计划类型" :label-width="100" prop="plan_objtype">
                    <Select v-model="planForm.plan_objtype">
                        <Option :value="1">部门计划</Option>
                        <Option :value="2">个人计划</Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="12" v-if="planForm.plan_objtype==1" prop="plan_objkeyid">
                <Form-item label="部门选择" :label-width="100">
                    <Select v-model="planForm.plan_objkeyid">
                        <Option v-for="item in deptList" :value="item.dept_id" :key="item">{{ item.dept_name }}</Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="12" v-if="planForm.plan_objtype==2" prop="plan_objkeyid">
                <Form-item label="人员选择" :label-width="100">
                    <Select v-model="planForm.plan_objkeyid">
                        <Option v-for="item in chiefList" :value="item.user_id" :key="item">{{ item.user_name }}</Option>
                    </Select>
                </Form-item>
                </Col>
                <Col span="24">
                <Form-item label="年度计划" :label-width="100" prop="plan_yearquarter">
                    <Input number v-model="planForm.plan_yearquarter"></Input>
                </Form-item>
                </Col> 
                <Col span="6">
                <Form-item label="一季度" prop="plan_firstquarter">
                    <Input number v-model="planForm.plan_firstquarter"></Input>
                </Form-item>
                </Col>  
                <Col span="6">
                <Form-item label="一月份" prop="plan_januaryindicator">
                    <Input number v-model="planForm.plan_januaryindicator"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="二月份" prop="plan_februaryindicators">
                    <Input number v-model="planForm.plan_februaryindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="三月份" prop="plan_marchindicators">
                    <Input number v-model="planForm.plan_marchindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="二季度" prop="plan_secondquarter">
                    <Input number v-model="planForm.plan_secondquarter"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="四月份" prop="plan_aprilindicators">
                    <Input number v-model="planForm.plan_aprilindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="五月份" prop="plan_mayindicators">
                    <Input number v-model="planForm.plan_mayindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="六月份" prop="plan_juneindicators">
                    <Input number v-model="planForm.plan_juneindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="三季度" prop="plan_thirdquarter">
                    <Input number v-model="planForm.plan_thirdquarter"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="七月份" prop="plan_julyindicators">
                    <Input number v-model="planForm.plan_julyindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="八月份" prop="plan_augustindicators">
                    <Input number v-model="planForm.plan_augustindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="九月份" prop="plan_septemberindicators">
                    <Input number v-model="planForm.plan_septemberindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="四季度" prop="plan_fourthquarter">
                    <Input number v-model="planForm.plan_fourthquarter"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="十月份" prop="plan_octoberindicators">
                    <Input number v-model="planForm.plan_octoberindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="十一月" prop="plan_novemberindicators">
                    <Input number v-model="planForm.plan_novemberindicators"></Input>
                </Form-item>
                </Col>
                <Col span="6">
                <Form-item label="十二月" prop="plan_decemberindicators">
                    <Input number v-model="planForm.plan_decemberindicators"></Input>
                </Form-item>
                </Col>                                                                                                               
            </Row>
            </Form>
            </div>
            <div class="clear"></div>
            <div slot="footer">
                <Button @click="shutAddBlock" long style="width:45%">取消</Button>
                <Button type="primary" @click="subAddForm" long style="width:45%">提交</Button>                
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                deptList: [],
                chiefList: [],
                isAddPlan: false,
                planTotal: 0,
                pageCurrent: 1,
                findObj: {
                    pi: 1,
                    ps: 10,
                    plan_year: "",
                    plan_objtype: "",
                    plan_objkeyid: "",
                },
                planForm: {
                    plan_id: "",
                    plan_objtype: "", //对象类型  1.部门  2.个人
                    plan_objkeyid: "", //对象主id    
                    plan_type: "", //指标类型  1：商机  2：合同   3：回款
                    plan_yearquarter: "",
                    plan_firstquarter: "",
                    plan_secondquarter: "",
                    plan_thirdquarter: "",
                    plan_fourthquarter: "",
                    plan_januaryindicator: "",
                    plan_februaryindicators: "",
                    plan_marchindicators: "",
                    plan_aprilindicators: "",
                    plan_mayindicators: "",
                    plan_juneindicators: "",
                    plan_julyindicators: "",
                    plan_augustindicators: "",
                    plan_septemberindicators: "",
                    plan_octoberindicators: "",
                    plan_novemberindicators: "",
                    plan_decemberindicators: "",
                    plan_year: "", //年份
                },
                planFormValidate: {
                    plan_objtype: [{
                        type: 'number',
                        required: true,
                        message: '计划类型不能为空',
                        trigger: 'change'
                    }], //对象类型  1.部门  2.个人
                    plan_objkeyid: [{
                        type: 'number',
                        required: true,
                        message: '部门/人员选择不能为空',
                        trigger: 'change'
                    }], //对象主id    
                    plan_type: [{
                        type: 'number',
                        required: true,
                        message: '指标类型不能为空',
                        trigger: 'change'
                    }], //指标类型  1：商机  2：合同   3：回款
                    plan_yearquarter: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_firstquarter: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_secondquarter: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_thirdquarter: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_fourthquarter: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_januaryindicator: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_februaryindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_marchindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_aprilindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_mayindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_juneindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_julyindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_augustindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_septemberindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_octoberindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_novemberindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_decemberindicators: [{
                        type: "number",
                        message: '只能为数字',
                        trigger: 'blur'
                    }],
                    plan_year: [{
                        required: true,
                        message: '计划年度不能为空',
                        trigger: 'change'
                    }], //年份
                },

                planHeader: [{
                    title: '计划类型',
                    key: 'type',
                    width: 100,
                    fixed: 'left',
                    align: 'center'
                }, {
                    title: '所属者',
                    key: 'owner',
                    width: 100,
                    fixed: 'left',
                    align: 'center'
                }, {
                    title: '创建者',
                    key: 'creator',
                    width: 100,
                    fixed: 'left',
                    align: 'center'
                }, {
                    title: '年度',
                    key: 'year',
                    width: 100,
                    fixed: 'left',
                    align: 'center'
                }, {
                    title: '年度计划',
                    key: 'plan_yearquarter',
                    width: 150,

                }, {
                    title: '一季度',
                    key: 'plan_firstquarter',
                    width: 150,

                }, {
                    title: '二季度',
                    key: 'plan_secondquarter',
                    width: 150,

                }, {
                    title: '三季度',
                    key: 'plan_thirdquarter',
                    width: 150,

                }, {
                    title: '四季度',
                    key: 'plan_fourthquarter',
                    width: 150,

                }, {
                    title: '一月份',
                    key: 'plan_januaryindicator',
                    width: 150,

                }, {
                    title: '二月份',
                    key: 'plan_februaryindicators',
                    width: 150,

                }, {
                    title: '三月份',
                    key: 'plan_marchindicators',
                    width: 150,

                }, {
                    title: '四月份',
                    key: 'plan_aprilindicators',
                    width: 150,

                }, {
                    title: '五月份',
                    key: 'plan_mayindicators',
                    width: 150,

                }, {
                    title: '六月份',
                    key: 'plan_juneindicators',
                    width: 150,

                }, {
                    title: '七月份',
                    key: 'plan_julyindicators',
                    width: 150,

                }, {
                    title: '八月份',
                    key: 'plan_augustindicators',
                    width: 150,

                }, {
                    title: '九月份',
                    key: 'plan_septemberindicators',
                    width: 150,

                }, {
                    title: '十月份',
                    key: 'plan_octoberindicators',
                    width: 150,

                }, {
                    title: '十一月',
                    key: 'plan_novemberindicators',
                    width: 150,

                }, {
                    title: '十二月',
                    key: 'plan_decemberindicators',
                    width: 150,

                }, {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    fixed: 'right',
                    align: 'center',
                    render: (h, p) => {
                        return h('Button', {
                            props: {
                                type: 'primary'
                            },
                            on: {
                                click: () => {
                                    this.findPlan(p.row.id);
                                }
                            }
                        }, '编辑')
                    }
                }],
                planData: [],

            }
        },
        created() {
            //加载部门信息
            this.findDeptInfo();
            //加载下属信息
            this.findChiefInfo();
            //加载初始化列表
            this.findWorkPlan();

            this.planHeader.map(obj => {
                if (!obj.fixed) {
                    obj.render = (h, p) => {
                        let tar = this.planData[p.index].plan[obj.key];
                        let com = this.planData[p.index].completed[obj.key];
                        let result = (com / tar).toFixed(2) * 100;
                        let percent = result > 100 ? 100 : result;
                        return h('div', [

                            h("p", '目标：' + tar),
                            h('Progress', {
                                props: {
                                    percent: percent
                                }
                            }, result + '%'), h('p', '已完成：' + com)
                        ])
                    }
                }
            })
        },
        computed: {},
        methods: {
            findPlan(id) {
                this.$refs.planForm.resetFields();
                this.$http.post("/web/Crm_corp_mgr_common_plan/findCrm_corp_mgr_common_planById", {
                    "plan_id": id
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.planForm.plan_id = res.data.o.plan_id;
                        this.planForm.plan_objtype = res.data.o.plan_objtype; //对象类型  1.部门  2.个人
                        this.planForm.plan_objkeyid = res.data.o.plan_objkeyid; //对象主id    
                        this.planForm.plan_type = res.data.o.plan_type; //指标类型  1：商机  2：合同   3：回款
                        this.planForm.plan_yearquarter = res.data.o.plan_yearquarter;
                        this.planForm.plan_firstquarter = res.data.o.plan_firstquarter;
                        this.planForm.plan_secondquarter = res.data.o.plan_secondquarter;
                        this.planForm.plan_thirdquarter = res.data.o.plan_thirdquarter;
                        this.planForm.plan_fourthquarter = res.data.o.plan_fourthquarter;
                        this.planForm.plan_januaryindicator = res.data.o.plan_januaryindicator;
                        this.planForm.plan_februaryindicators = res.data.o.plan_februaryindicators;
                        this.planForm.plan_marchindicators = res.data.o.plan_marchindicators;
                        this.planForm.plan_aprilindicators = res.data.o.plan_aprilindicators;
                        this.planForm.plan_mayindicators = res.data.o.plan_mayindicators;
                        this.planForm.plan_juneindicators = res.data.o.plan_juneindicators;
                        this.planForm.plan_julyindicators = res.data.o.plan_julyindicators;
                        this.planForm.plan_augustindicators = res.data.o.plan_augustindicators;
                        this.planForm.plan_septemberindicators = res.data.o.plan_septemberindicators;
                        this.planForm.plan_octoberindicators = res.data.o.plan_octoberindicators;
                        this.planForm.plan_novemberindicators = res.data.o.plan_novemberindicators;
                        this.planForm.plan_decemberindicators = res.data.o.plan_decemberindicators;
                        this.planForm.plan_year = res.data.o.plan_year; //年份

                        this.isAddPlan = true;
                    } else {
                        this.$errorHandle(res);

                    }

                }).catch(function(response) {
                    this.$Message.error({
                        content: '操作出错',
                        duration: 1,
                        onClose: () => {

                        }
                    })
                });

            },
            addPlan() {
                //获取指标类型
                let num;
                this.$refs.planForm.resetFields();
                this.$http.post("/web/Crm_corp_mgr_common_plan/findPlantype", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        num = res.data.o.plantype;
                        this.planForm = {
                            plan_id: "",
                            plan_objtype: "", //对象类型  1.部门  2.个人
                            plan_objkeyid: "", //对象主id    
                            plan_type: num, //指标类型  1：商机  2：合同   3：回款
                            plan_yearquarter: "",
                            plan_firstquarter: "",
                            plan_secondquarter: "",
                            plan_thirdquarter: "",
                            plan_fourthquarter: "",
                            plan_januaryindicator: "",
                            plan_februaryindicators: "",
                            plan_marchindicators: "",
                            plan_aprilindicators: "",
                            plan_mayindicators: "",
                            plan_juneindicators: "",
                            plan_julyindicators: "",
                            plan_augustindicators: "",
                            plan_septemberindicators: "",
                            plan_octoberindicators: "",
                            plan_novemberindicators: "",
                            plan_decemberindicators: "",
                            plan_year: "", //年份
                        };
                        this.isAddPlan = true;
                    } else {
                        this.$errorHandle(res);

                    }

                }).catch(function(response) {


                });


            }, //打开日程弹窗
            shutAddBlock() {
                this.isAddPlan = false
            }, //关闭日程弹窗
            subAddForm() {
                let url = "";

                if (this.planForm.plan_id) { //编辑
                    url = "/web/Crm_corp_mgr_common_plan/updateCrm_corp_mgr_common_plan";
                } else {
                    url = "/web/Crm_corp_mgr_common_plan/addCrm_corp_mgr_common_plan";
                }

                this.$refs.planForm.validate((valid) => {
                    if (valid) {
                        if (this.planForm.plan_objkeyid == "") {
                            this.$Message.error({
                                content: '人员选择/部门选择不能为空',
                                duration: 1
                            })
                            return false;
                        }
                        this.$http.post(url, this.planForm, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.findWorkPlan();
                                        this.isAddPlan = false;
                                    }
                                })
                            } else {
                                this.$errorHandle(res);
                            }

                        }).catch(function(response) {

                        });
                    }
                });

            }, //提交日程信息
            changeYear(year) {
                //           console.log(year);
                this.findObj.pi = 1;
                this.findWorkPlan();
            }, //主页面页头年份筛选，发生改变时触发
            changeDepart(depart) {
                //           console.log(depart);
                this.findObj.pi = 1;
                this.findWorkPlan();
            }, //页面页头部门发生改变时触发
            changePerson(person) {
                //           console.log(person);
                this.findObj.pi = 1;
                this.findWorkPlan();
            }, //人员发生改变时触发
            changeType(t) {
                this.findObj.pi = 1;
                this.findWorkPlan();
                //     this.$http.post("/web/Crm_corp_mgr_common_plan/findCrm_corp_mgr_common_planList",this.findObj,{emulateJSON:true}).then((res)=>{
                //     if(res.data.b==1){
                //         this.planData=res.data.a;
                //         this.planTotal=res.data.page.total;
                //     }else{
                //         this.$Message.error({content:'操作失败',duration: 1,onClose:()=>{

                //         }})
                //     }

                // }).catch(function(response) {
                //    this.$Message.error({content:'操作出错',duration: 1,onClose:()=>{

                //     }})
                // });
            },
            changePage(page) {
                this.findObj.pi = page;
                this.findWorkPlan();
                // this.$http.post("/web/Crm_corp_mgr_common_plan/findCrm_corp_mgr_common_planList",{pi:page,ps:10},{emulateJSON:true}).then((res)=>{
                //     if(res.data.b==1){
                //         this.planData=res.data.a;
                //         this.planTotal=res.data.page.total;
                //     }else{
                //         this.$Message.error({content:'操作失败',duration: 1,onClose:()=>{

                //         }})
                //     }

                // }).catch(function(response) {
                //    this.$Message.error({content:'操作出错',duration: 1,onClose:()=>{

                //     }})
                // });
            }, //页码改变时触发


            //查询部门信息
            findDeptInfo() {
                this.$http.post("/web/Crm_corp_mgr_common_plan/findAllDepInfo", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.deptList = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },

            //查询下级员工信息
            findChiefInfo() {
                this.$http.post("/web/Crm_corp_mgr_common_plan/findChiefInfo", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.chiefList = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },
            setTime(value, objName, keyName) {
                this[objName][keyName] = value;
            },
            setTime1(value, objName, keyName) {
                this[objName][keyName] = value;
                this.changeYear(value);
            },

            //查询工作计划
            findWorkPlan() {
                this.$http.post("/web/Crm_corp_mgr_common_plan/findCrm_corp_mgr_common_planList", this.findObj, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.planData = res.data.a;
                        this.planTotal = res.data.page.total;
                        this.pageCurrent = res.data.page.pageIndex;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },
            resetInfo() {
                this.findObj.pi = 1;
                this.findObj.ps = 10;
                this.findObj.plan_year = "";
                this.findObj.plan_objkeyid = "";
                this.findObj.plan_objtype = "";
                this.findWorkPlan();
            },
        }
    }
</script>