<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color"><Icon type="ios-world-outline"></Icon> — </span>
                <span class="main-title-text">合同管理</span></p>

        </div>
        <div class="layout-content-main">
            <div class="item-block-title clients-title">
                <Button :class="['title-button',{'current-clicked':changeNum==1}]" @click="myManagerCont">我负责的合同</Button>
                <Button :class="['title-button',{'current-clicked':changeNum==2}]" @click="partCont">我参与的合同</Button>
                <Button :class="['title-button',{'current-clicked':changeNum==3}]" @click="allCont">刷新</Button>
                
            </div>
            <div class="item-block">
                <div class="table-header-operate" style="float:left;">
                    <Button-group class="ml-50">
                       
                        <Button type="text" size="large" icon="android-exit" @click="turnItem" :disabled="selectedArr.length==0">转让</Button>
                        <Button type="text" size="large" icon="clipboard" @click="editItem" :disabled="selectedArr.length!=1">修改</Button>
                        <Button type="text" size="large" icon="trash-a" @click="delItem" :disabled="selectedArr.length==0">删除</Button>
                        <Button type="text" size="large" icon="android-exit" @click="showDetail" :disabled="selectedArr.length!=1">详情</Button>
                        <Button type="text" size="large" icon="android-exit" @click="returnMoney" :disabled="selectedArr.length!=1">回款计划</Button>
                    </Button-group>
                    <p style="float:right">
                        <Button type="text" icon="plus" @click="addItem"> 添加合同</Button>
                        <Poptip placement="bottom-end" width="200" v-model="isShowHeaderSet" title="设置显示条目">
                            <Button type="text" icon="ios-cog"> 设置</Button>
                            <div class="api" slot="content">
                                <!--<Checkbox-group v-model="tempArr">-->
                                <Checkbox v-for="(el,index) in showTableColumns" :key="index" v-model="el.isShow">{{el.title}}</Checkbox>
                                <!--</Checkbox-group>-->
                                <Button type="primary" size="small" long style="float:left;" @click="setShowColumns">确定</Button>
                            </div>
                        </Poptip>
                    </p>
                </div>
                <Table :columns="tableHeader" :data="tableData" show-footer="true" :height="tableHeight" @on-selection-change="getSelectedData">
                    <div slot="footer">
                        <Page :total="total" :current="pageCurrent" style="float:right;margin-right:20px;" show-total @on-change="changePage"></Page>
                    </div>
                </Table>
            </div>
        </div>
        <!--以下开始为弹窗-->
        <!--合同转让弹窗-->
        <Modal v-model="isShowChangePerson" title="合同转让" width="300" :mask-closable="false">
            <p class="main-title-color">请选择转让人</p><br>
            <Select placeholder="根据部门筛选" v-model="model1" filterable @on-change="changeDepart">
                    <Option v-for="item in deptList" :value="item.value" :key="item">{{ item.label }}</Option>
                   </Select>
            <br/><br>
            <Select filterable placeholder="选择转让人" @on-change="setChangePerson">
                        <Option v-for="item in userList" :value="item.value" :key="item">{{ item.label }}</Option>
                   </Select>
            <div slot="footer">
                <Button @click="shutChangePerson" long style="width:45%">取消</Button>
                <Button type="primary" @click="subChangePerson" long style="width:45%">提交</Button>
            </div>
        </Modal>

        <!--合同添加/修改弹窗-->
        <Modal v-model="isShowEditBox" title="市场合同添加/编辑" width="400" :mask-closable="false" :styles="style" class="diy-box">
            <Form :model="addObj" :rules="addRules" style="margin-top:20px;" ref="addForm" :label-width="80">
                <bForm :itemslist="items" ref="loopForm" formobj="addObj"></bForm>
                <Form-item label="所属区域">
                    <Select v-model="belong_area" style="width:200px">
                        <Option v-for="item in areaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="所属行业">
                    <Select v-model="belong_industry" style="width:200px">
                        <Option v-for="item in industryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="所属产品">
                    <Select v-model="belong_product" style="width:200px">
                        <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                 <Form-item label="所属部门">
                    <Select v-model="belong_dept" style="width:200px">
                        <Option v-for="item in deptLists" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddBox" long style="width:45%">取消</Button>
                <Button type="primary" @click="subAddData" long style="width:45%">提交</Button>
            </div>
        </Modal>
        <!--添加回款计划-->
        <Modal v-model="isShowReturnMoney" title="回款计划添加/编辑" width="700" :mask-closable="false" :styles="style" class="diy-box" :scrollable="false">

            <Table :columns="returnMoneyName" :data="returnMoneyList" show-header  style="float:left;">
                <div slot="header">
                    <Button type="primary" @click="addReturnPlan" style="float:right;margin-right:10px;margin-top:10px;">添加回款计划</Button>
                </div>
            </Table>

            
            <div slot="footer">
                <!--<Button @click="shutAddBox" long style="width:45%">取消</Button>
                <Button type="primary" @click="subAddData" long style="width:45%">提交</Button>-->
            </div>
        </Modal>
        <!--详情组件-->
        <Detail :model="curObj" ref="details"></Detail>
    </div>
</template>
<script>
    import Bform from '../publicComponents/builtFormItem';
    import Detail from '../publicComponents/details';
    export default {

        data() {
            return {
                returnMoneyName: [{
                    title: '计划名称',
                    key: 'returnplan_name',
                    render: (h, p) => {
                        return h('Input', {
                            attrs: {
                                value: p.row.returnplan_name,
                            },
                            props: {
                                value: p.row.returnplan_name
                            },
                            on: {

                                'on-change': (a) => {
                                    p.row.returnplan_name = a.target.value;
                                    console.log(p.row);
                                    // this.returnMoneyList[p.index].returnplan_name=a.target.value;

                                }
                            }
                        })
                    }
                }, {
                    title: '回款金额(万)',
                    key: 'returnplan_money',
                    render: (h, p) => {
                        return h('Input', {
                            attrs: {
                                value: p.row.returnplan_money,
                                number: true
                            },
                            on: {
                                'on-change': (a) => {
                                    // console.log(p.row.returnplan_money);
                                    p.row.returnplan_money = a.target.value;
                                    console.log(p.row);
                                    // this.returnMoneyList[p.index].returnplan_money=a.target.value;

                                }
                            }
                        })
                    }
                }, {
                    title: '回款时间',
                    key: 'returnplan_time',
                    width: 200,
                    render: (h, p) => {
                        return h('Date-picker', {
                            props: {
                                placeholder: "选择日期",
                                value: p.row.returnplan_time,
                                type: 'date',
                                editable:false,
                            },
                            on: {
                                'on-change': (a) => {
                                    console.log(a);
                                    // let value=moment(a).format('YYYY-MM-DD');
                                    p.row.returnplan_time = a;
                                }
                            }
                        })
                    }
                }, {
                    title: "操作",
                    key: 'action',
                    render: (h, p) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'edit'
                                },
                                on: {
                                    click: () => {
                                        this.updateReturnPlan(p.row);
                                    }
                                }
                            }),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'trash-a'
                                },
                                style: {
                                    "marginLeft": '10px'
                                },
                                on: {
                                    'click': () => {
                                        this.delReturnPlan(p.index);
                                    }
                                }
                            }),
                        ]);
                    }

                }],
                deptList: [], //部门
                belong_dept: "",
                returnMoneyList: [], //回款计划列表
                belong_product: '',
                productList: [], //产品
                belong_industry: '',
                industryList: [], //行业
                belong_area: '',
                areaList: [], //区域
                total: 0,
                pageCurrent: 1,
                model1: '',
                deptLists: [],
                userList: [],
                tableSelectedList: [], //表格中被选中的对象集合
                tableHeader: [{}], //表格页头最终显示字段
                showTableColumns: [{}], //表格页头全部字段
                selectedArr: [], //表格中选中的数据列表
                isShowHeaderSet: false, //展示弹出表格页头弹出层
                tableData: [], //表格数据
                isShowChangePerson: false, //显示转让弹出窗
                depart_id: 0, //转让部门选择
                takeover_person: 0, //转让的负责人
                depart_worker: [],
                isShowEditBox: false, //显示编辑/修改弹窗
                isShowReturnMoney: false, //回款计划
                addObj: {}, //修改/编辑合同对象
                addRules: {}, //修改，编辑合同验证规则
                items: [], //该模块的页面布局数据，需要异步获取      
                state: 1,
                changeNum: 3,
                style: {
                    height: '400px',
                },
                isShowDetail: false, //详情显示
                curObj: {
                    list: [],
                    message: [],
                    tableId: 6,
                    id: "",
                    name: "",
                    userList: "",
                    userId: "",
                    person_liable: "", //责任人
                    fieldName: "", //字段名
                    config_id: "",
                    workgroup_id: "",
                    workGroupInfoArr: [],

                }, //被点击的名称
                cont: {
                    packetType: 1000,
                    tableId: 6,
                    operationParamsItem: {
                        pi: 1,
                        ps: 10,
                    },
                },
                turnCont: { //转让
                    takeover_person: "",
                    cont_ids: [],
                },
                addCont: { //添加或修改
                    packetType: 3000,
                    tableId: 6,
                    type: 1, //1:添加   2:修改
                    operationParamsItem: {
                        key_name: "cont_id",
                        key_value: "",
                        paramsList: [],
                    },
                },
                updateitems: { //获取修改页面布局
                    packetType: 7000,
                    tableId: 6,
                    operationParamsItem: {
                        key_name: "cont_id",
                        key_value: "",
                    },
                },
                additems: {
                    packetType: 6000,
                    tableId: 6,
                    operationParamsItem: {
                        pi: 1,
                        ps: 10,
                    },
                },
                delCont: { //删除
                    packetType: 5000,
                    tableId: 6,
                    operationParamsItem: {
                        key_name: "cont_id",
                        deleteList: [],
                    },
                },
                clueById: {
                    packetType: 1000,
                    tableId: 6,
                    operationParamsItem: {
                        key_name: "cont_id",
                        key_value: "",
                    },
                },
                cont_id: "",
                contPlan: {
                    returnplan_id: "",
                    returnplan_name: "",
                    returnplan_money: "",
                    returnplan_time: "",
                },
                subState:true,
            }
        },

        // 创建组件生命周期
        created() {
            this.getHeader();
            //this.getTableData(1);
            //查询部门
            this.$http.post("/web/Crm_corp_mgr_module_config/findDeptById", {
                ps: 20
            }).then((res) => {
                let dateList = res.data.a;
                let list = [];
                for (let i = 0; i < dateList.length; i++) {
                    let dept_id;
                    let dept_name;
                    for (let key in dateList[i]) {
                        let selected = [];
                        selected = dateList[i];
                        if (key == "dept_id") {
                            dept_id = selected[key];
                        }
                        if (key == "dept_name") {
                            dept_name = selected[key];
                        }
                    }
                    let obj = {
                        "value": dept_id,
                        "label": dept_name
                    };
                    list.push(obj);

                }
                this.deptList = list;
                console.log(this.deptList);
            }).catch(function(response) {
                console.log(response)
            });
        },

        // 计算属性
        computed: {
            tableHeight() {
                let pHeight=document.body.scrollHeight;
                let bheight = document.body.clientHeight;
                let cHeight=pHeight>bheight?pHeight:bheight;
               // cheight = cheight > 400 ? cheight : 400;
                return this.tableData.length > 1 ? (cHeight - 320) : 0;
            }
        },

        // 组件注册
        components: {
            bForm: Bform,
            Detail: Detail,
        }, //注册组件，上边import进来的自定义组件需要在这里注册一下才能使用


        // 方法
        methods: {

            //修改回款计划
            updateReturnPlan(obj) {
                // this.contPlan.returnplan_id=this.returnMoneyList[index].returnplan_id,
                // this.contPlan.returnplan_name=this.returnMoneyList[index].returnplan_name,
                // this.contPlan.returnplan_money=this.returnMoneyList[index].returnplan_money,
                // this.contPlan.returnplan_time=this.returnMoneyList[index].returnplan_time,
                console.log(obj);
                //return false;
                this.$http.post("/web/Crm_corp_mgr_std_cont/updateCrm_corp_mgr_std_cont_returnplan", obj).then((res) => {
                    if (res.data.b) {
                        this.$Message.success('操作成功');
                        this.returnMoney();
                    } else {
                        let ec=res.data.ec;
                        if(ec.length!=0){
                           this.$Message.error(ec[0]);
                        }else{
                           this.$Message.error('操作失败');
                        }
                        
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },
            //删除回款计划
            delReturnPlan(index) {
                this.$http.post("/web/Crm_corp_mgr_std_cont/delCrm_corp_mgr_std_cont_returnplanById", {
                    returnplan_id: this.returnMoneyList[index].returnplan_id
                }).then((res) => {
                    if (res.data.b) {
                        this.returnMoney();
                    } else {
                        this.$Message.err('操作失败');
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },
            //添加回款计划
            addReturnPlan() {
                this.$http.post("/web/Crm_corp_mgr_std_cont/addCrm_corp_mgr_std_cont_returnplan", {
                    cont_id: this.cont_id
                }).then((res) => {
                    if (res.data.b) {
                        this.returnMoney();
                    } else {
                        this.$Message.err('操作失败');
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },
            //显示回款计划窗口
            returnMoney() {
                let id;
                for (let i = 0; i < this.selectedArr.length; i++) {
                    for (let key in this.selectedArr[i]) {
                        let selected = [];
                        selected = this.selectedArr[i];
                        if (key == "cont_id") {
                            id = selected[key];
                        }
                    }
                }
                this.cont_id = id;
                //查询回款计划
                this.$http.post("/web/Crm_corp_mgr_std_cont/findCrm_corp_mgr_std_cont_returnplanList", {
                    cont_id: id
                }).then((res) => {
                    if (res.data.b) {
                        this.returnMoneyList = res.data.a;
                        this.isShowReturnMoney = true;
                    } else {
                        this.$Message.err('操作失败');
                    }
                }).catch(function(response) {
                    console.log(response)
                });

            },
            careItem() {
                this.$Modal.confirm({
                    title: '关注确认',
                    content: '<p>是否执行[<span style="color:red;">关注</span>]操作</p>',
                    onOk: () => {
                        console.log("关注操作");
                    }
                });
            }, //关注选择项
            turnItem() {
                this.changePerson = 0;
                let list=[];
                for (let i = 0; i < this.selectedArr.length; i++) {
                    for (let key in this.selectedArr[i]) {
                        let selected = [];
                        selected = this.selectedArr[i];
                        if (key == "cont_id") {
                            let key_value = selected[key];
                            list.push(key_value);
                    }
                }
                }
                //判断有无不属于自己的线索
                 this.$http.post("/web/Crm_corp_mgr_module_config/findIsPerson",{idList:list,tableId:6}).then((res) => {
                            if (res.data.b) {
                                 this.isShowChangePerson = true;
                            } else {
                                this.$Message.warning(res.data.ec[0]);
                            }
                        }).catch(function(response) {
                            console.log(response)
                        });
                
            
               
            }, //转交选择项
            shutChangePerson() {
                this.isShowChangePerson = false;
            }, //关闭转交
            changeDepart(id) {
                this.$http.post("/web/Crm_corp_mgr_module_config/findUserNameById", {
                    dept_id: id
                }).then((res) => {
                    let dateList = res.data.a;
                    let list = [];
                    for (let i = 0; i < dateList.length; i++) {
                        let user_id;
                        let user_name;
                        for (let key in dateList[i]) {
                            let selected = [];
                            selected = dateList[i];
                            if (key == "user_id") {
                                user_id = selected[key];
                            }
                            if (key == "user_name") {
                                user_name = selected[key];
                            }
                        }
                        let obj = {
                            "value": user_id,
                            "label": user_name
                        };
                        list.push(obj);
                    }
                    this.userList = list;

                }).catch(function(response) {
                    console.log(response)
                });
            },
            setChangePerson(value) {
                this.takeover_person = value;
                this.turnCont.takeover_person = value;
                let list = [];
                for (let i = 0; i < this.selectedArr.length; i++) {
                    for (let key in this.selectedArr[i]) {
                        let selected = [];
                        selected = this.selectedArr[i];
                        if (key == "cont_id") {
                            let key_value = selected[key];
                            list.push(key_value);
                        }
                    }
                    this.turnCont.cont_ids = list;
                }
                console.log(this.turnCont.cont_ids);
            }, //设置转让负责人为选择后的值
            subChangePerson() {
                if (this.turnCont.takeover_person == "") {
                    this.$Message.error('接收人不能为空');
                    return false;
                };
                this.$http.post("/web/Crm_corp_mgr_std_cont/updateCrm_corp_mgr_std_cont_liableperson", this.turnCont).then((res) => {
                    if (res.data.b) {
                        this.$Message.success('操作成功');
                        this.getHeader();
                    } else {
                        this.$Message.err('操作失败');
                    }
                }).catch(function(response) {
                    console.log(response)
                });
                this.isShowChangePerson = false;
            }, //提交转让
            creatAddObj(targetObj, items) {
                items.map((obj) => {
                    if ( obj['field_defvalue'] == "") {
                        obj['field_defvalue'] = null;
                    }
                    targetObj[obj.field_name_db] = obj['field_defvalue'];
                }); //给添加对象增加键值对。传入目标对象,和页面布局
            },
            createAddRules(targetObj, items) {
                Object.assign(targetObj, this.$myFunction.createRuleObj(items));
                // targetObj=this.$myFunction.createRuleObj(items);//创建验证规则，传入的参数为目标对象和页面布局数组
            },
            getTableData(pi) {
                let cont = {
                    packetType: 1000,
                    tableId: 2,
                    operationParamsItem: {
                        pi: pi,
                        ps: 10,
                    },
                };
                this.$http.post("/web/Crm_corp_mgr_std_market/findCrm_corp_mgr_std_marketList", cont).then((res) => {
                    this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                }).catch(function(response) {
                    console.log(response)
                });
            },
            addItem() {
                this.belong_product = '';
                this.belong_industry = '';
                this.belong_area = '';
                this.belong_dept = '';
                this.selectedArr=[];
                this.state=1;
                this.addCont.type = 1;
                this.addObj={};
                this.$nextTick(()=>{  
                    this.$refs.addForm.resetFields();  
                })                   
                //查询添加线索布局
                this.$http.post("/web/Crm_corp_mgr_std_cont/findCrm_corp_mgr_std_contById", this.additems).then((res) => {
                    this.items = res.data.operationParamsItem.backInfoList;
                    this.isShowEditBox = true;
                    let items = JSON.parse(JSON.stringify(res.data.operationParamsItem.backInfoList));
                    this.creatAddObj(this.addObj, items);
                    this.createAddRules(this.addRules, items);
                }).catch(function(response) {
                    console.log(response)
                });

                //查询维度
                this.$http.post("/web/Crm_corp_mgr_std_cont/findBelongMessage", {}).then((res) => {
                    this.productList = res.data.a.belong_product;
                    this.industryList = res.data.a.belong_industry;
                    this.areaList = res.data.a.belong_area;
                    this.deptLists = res.data.a.belong_dept;
                }).catch(function(response) {
                    console.log(response)
                });
            },
            editItem() {  
                //查询修改布局及数据 
                let addObj = JSON.parse(JSON.stringify(this.selectedArr[0]));
                //console.log(this.addObj);
                this.isShowEditBox = true;
                this.addCont.type = 2;
                this.addCont.packetType = 4000;
                this.state = 2;
                for (let key in addObj) {
                    this.cont_id = addObj.cont_id;
                }
                this.updateitems.operationParamsItem.key_value = this.cont_id;
                //查询修改线索布局
                this.$http.post("/web/Crm_corp_mgr_std_cont/findRecordMessgeCrm_corp_mgr_std_contList", this.updateitems).then((res) => {
                    this.items = res.data.operationParamsItem.backInfoList;
                    this.addCont.operationParamsItem.key_value = this.cont_id;
                    this.isShowEditBox = true;
                    let items = JSON.parse(JSON.stringify(res.data.operationParamsItem.backInfoList));
                    this.creatAddObj(this.addObj, items);
                    this.createAddRules(this.addRules, items);
                }).catch(function(response) {
                    console.log(response)
                });
                //查询维度
                this.$http.post("/web/Crm_corp_mgr_std_cont/findBelongMessage", {}).then((res) => {
                    this.productList = res.data.a.belong_product;
                    this.industryList = res.data.a.belong_industry;
                    this.areaList = res.data.a.belong_area;
                    this.deptLists = res.data.a.belong_dept;
                }).catch(function(response) {
                    console.log(response)
                });
                //根据id查询当前记录的维度
                this.$http.post("/web/Crm_corp_mgr_std_cont/findMessage", {
                    cont_id: this.cont_id
                }).then((res) => {
                    this.belong_product = res.data.o.belong_product;
                    this.belong_industry = res.data.o.belong_industry;
                    this.belong_area = res.data.o.belong_area;
                    this.belong_dept = res.data.o.belong_dept;
                    console.log(res.data.a);
                }).catch(function(response) {
                    console.log(response)
                });

            }, //编辑选择项
            shutAddBox() {
                this.isShowEditBox = false;
            },
            subAddData() {

                this.$refs.addForm.validate(valid => {
                    if (valid) {
                       
                        let arr = [];
                        for (let key in this.addObj) {
                            if (key != "cont_id") {
                                let obj = {
                                    "field_name": key,
                                    "field_value": this.addObj[key]
                                };
                                arr.push(obj);
                            }

                        }
                        let obj1 = {
                            "field_name": "belong_industry",
                            "field_value": this.belong_industry
                        };
                        let obj2 = {
                            "field_name": "belong_area",
                            "field_value": this.belong_area
                        };
                        let obj3 = {
                            "field_name": "belong_product",
                            "field_value": this.belong_product
                        };
                        let obj4 = {
                            "field_name": "belong_dept",
                            "field_value": this.belong_dept
                        };
                        arr.push(obj1);
                        arr.push(obj2);
                        arr.push(obj3);
                        arr.push(obj4);
                        this.addCont.operationParamsItem.paramsList = arr;
                        if (this.state == 1) { //添加
                            this.$http.post("/web/Crm_corp_mgr_std_cont/addCrm_corp_mgr_std_cont", this.addCont).then((res) => {
                                if (res.data.operationParamsItem.isSuccess) {
                                    this.$Message.success('操作成功');
                                    this.isShowEditBox = false;
                                    this.selectedArr=[];
                                    this.getHeader();
                                } else {
                                    this.$Message.error('操作失败');
                                   
                                }

                            }).catch(function(response) {
                                console.log(response)
                                
                            });
                        } else { //修改
                            this.$http.post("/web/Crm_corp_mgr_std_cont/updateCrm_corp_mgr_std_cont", this.addCont).then((res) => {
                                if (res.data.operationParamsItem.isSuccess) {
                                    this.$Message.success('操作成功');
                                    this.isShowEditBox = false;
                                    
                                    this.selectedArr=[];
                                    this.getHeader();
                                } else {
                                    this.$Message.error('操作失败');
                                    
                                }
                            }).catch(function(response) {
                                console.log(response)
                                
                            });
                        
                    }
                    } else {
                        console.log("验证失败");

                    }
                
                })
            },
            delItem() {
                this.$Modal.confirm({
                    title: '删除确认',
                    content: '<p>是否执行[<span style="color:red;">删除</span>]操作</p>',
                    onOk: () => {
                        let arr = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "cont_id") {
                                    let key_value = selected[key];
                                    arr.push(key_value);
                                }
                            }
                        }
                        this.delCont.operationParamsItem.deleteList = arr;
                        console.log(this.delCont.deleteList);
                        this.$http.post("/web/Crm_corp_mgr_std_cont/delCrm_corp_mgr_std_contById", this.delCont).then((res) => {
                            if (res.data.operationParamsItem.isSuccess) {
                                this.$Message.success('操作成功');
                                this.selectedArr = [];
                                this.getHeader();
                            } else {
                                this.$Message.err('操作失败');
                            }
                        }).catch(function(response) {
                            console.log(response)
                        });
                    }
                });
            }, //删除选择项
            setShowColumns() {
                let arr = this.showTableColumns.filter(obj => obj.isShow == true);
                this.tableHeader = arr;
                this.isShowHeaderSet = false;
            }, //设置页头显示字段方法
            getHeader() {
                this.changeNum = 3;
                this.cont.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_cont/findCrm_corp_mgr_std_contList", this.cont).then((res) => {
                    if (res.data.operationParamsItem.isSuccess == 1) {
                        this.showTableColumns = res.data.operationParamsItem.backInfoList.field_name;
                        this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                        this.total = res.data.operationParamsItem.page.total;
                        this.pageCurrent = res.data.operationParamsItem.page.pageIndex;
                        let checkboxObj = {
                            title: '选择框',
                            type: 'selection',
                            width: '60',
                        };
                        //this.showTableColumns=res.data.operationParamsItem.backInfoList.field_name;
                        this.showTableColumns.unshift(checkboxObj);
                        this.showTableColumns.map(obj => {
                            obj.align = "center";
                            obj.sortable = true;
                            obj.label = obj.title;
                            obj.isShow = true;
                        });
                        this.tableHeader = JSON.parse(JSON.stringify(this.showTableColumns));
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            }, //模拟异步获取页头所有字段信息，注意，第一项可能需要获取之后再添加，因为第一项是复选框，后台是不会传过来的
            getSelectedData(arr) {
                console.log(arr);
                this.selectedArr = arr;
            }, //获取列表中被选中的数据列表，赋值给selectedData属性；
            findgroupMessage(workgroup_id) {
                //查询工作组对话详情
                this.$http.post('/web/MSG/getMsgByworkgroup_id', {
                    workgroup_id: workgroup_id,
                    pi: 1,
                    ps: 10
                }).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.curObj.workGroupInfoArr = res.data.a;
                            console.log(res.data.a);
                        }
                    },
                )
            },
            showDetail() {
                let id;
                for (let i = 0; i < this.selectedArr.length; i++) {
                    for (let key in this.selectedArr[i]) {
                        let selected = [];
                        selected = this.selectedArr[i];
                        if (key == "cont_id") {
                            id = selected[key];
                        }
                    }

                }

                this.clueById.operationParamsItem.key_value = id;
                //查询详情
                this.$http.post("/web/Crm_corp_mgr_module_config/findMessageId", this.clueById).then((res) => {
                    this.curObj.message = res.data.a;
                }).catch(function(response) {
                    console.log(response)
                });
                //查询工作组成员
                this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_module_configById", {
                    tableId: 6,
                    fieldName: "cont_id",
                    fieldValue: id
                }).then((res) => {
                    this.curObj.userList = res.data.a;
                    this.curObj.person_liable = res.data.o.person_liable;
                    this.curObj.userId = res.data.o.userId;
                    this.curObj.config_id = res.data.o.map.config_id;
                    this.curObj.workgroup_id = res.data.o.map.workgroup_id;
                    this.curObj.fieldName = "cont_id";
                    this.findgroupMessage(res.data.o.map.workgroup_id);
                }).catch(function(response) {
                    console.log(response)
                });
                //查询业务实体绑定的业务实体
                this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_module_config", {tableId:6}).then((res) => {
                    this.curObj.list = res.data.a;
                    this.curObj.id = id;
                    this.curObj.name = this.selectedArr[0].cont_name;
                    this.$refs.details.isShowDetail = true;
                }).catch(function(response) {
                    console.log(response)
                });


            },


            //我负责的合同
            myManagerCont() {
                this.changeNum = 1;
                this.cont.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_cont/findMyManagerCrm_corp_mgr_std_contList", this.cont).then((res) => {
                    if (res.data.operationParamsItem.isSuccess == 1) {
                        this.showTableColumns = res.data.operationParamsItem.backInfoList.field_name;
                        this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                        this.total = res.data.operationParamsItem.page.total;
                        this.pageCurrent = res.data.operationParamsItem.page.pageIndex;
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },

            //我参与的合同
            partCont() {
                this.changeNum = 2;
                this.cont.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_cont/findMyMessage", this.cont).then((res) => {
                    if (res.data.operationParamsItem.isSuccess == 1) {
                        this.showTableColumns = res.data.operationParamsItem.backInfoList.field_name;
                        this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                        this.total = res.data.operationParamsItem.page.total;
                        this.pageCurrent = res.data.operationParamsItem.page.pageIndex;
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },

            //全部
            allCont() {
                this.changeNum = 3;
                this.cont.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_cont/findCrm_corp_mgr_std_contList", this.cont).then((res) => {
                    if (res.data.operationParamsItem.isSuccess == 1) {
                        this.showTableColumns = res.data.operationParamsItem.backInfoList.field_name;
                        this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                        this.total = res.data.operationParamsItem.page.total;
                        this.pageCurrent = res.data.operationParamsItem.page.pageIndex;
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },

            //分页
            changePage(c) {
                this.cont.operationParamsItem.pi = c;
                let url = "";
                if (this.changeNum == 1) {
                    url = "/web/Crm_corp_mgr_std_cont/findMyManagerCrm_corp_mgr_std_contList";
                } else if (this.changeNum == 2) {
                    url = "/web/Crm_corp_mgr_std_cont/findMyMessage";
                } else if (this.changeNum == 3) {
                    url = "/web/Crm_corp_mgr_std_cont/findCrm_corp_mgr_std_contList";
                }
                this.$http.post(url, this.cont).then((res) => {
                    if (res.data.operationParamsItem.isSuccess == 1) {
                        this.showTableColumns = res.data.operationParamsItem.backInfoList.field_name;
                        this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                        this.total = res.data.operationParamsItem.page.total;
                        this.pageCurrent = res.data.operationParamsItem.page.pageIndex;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response)
                });
            },
        }
    }
</script>