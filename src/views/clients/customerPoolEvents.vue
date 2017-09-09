<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color"><Icon type="ios-world-outline"></Icon> — </span>
                <span class="main-title-text">公海池客户</span></p>
            
        </div>
        <div class="layout-content-main">
            <div class="item-block-title clients-title">
                <Button  :class="['title-button',{'current-clicked':changeNum==1}]" @click="effectiveCust">有效的客户</Button>
                <Button  :class="['title-button',{'current-clicked':changeNum==2}]" @click="invalidCust">无效的客户</Button>
                <Button  :class="['title-button',{'current-clicked':changeNum==3}]" @click="outofdateCust">自动回收的客户</Button>
                <Button  :class="['title-button',{'current-clicked':changeNum==4}]" @click="allCust">全部</Button>
            </div>
            <div class="item-block">
                    <div class="table-header-operate" style="float:left;">
                        <Button-group class="ml-50">
                           
                            <Button type="text" size="large" icon="android-exit" @click="turnItem" :disabled="selectedArr.length==0">领取</Button>
                            <Button type="text" size="large" icon="android-exit" @click="returnItem" :disabled="selectedArr.length==0">分派</Button>
                            <Button type="text" size="large" icon="android-exit" @click="lockMessage" :disabled="selectedArr.length==0">锁定</Button>
                            <Button type="text" size="large" icon="android-exit" @click="returnLockMessage" :disabled="selectedArr.length==0">解锁</Button>
                        </Button-group>
                         <p style="float:right"> 
                             <Button type="text" icon="plus" @click="addItem"> 添加线索</Button>
                             <Poptip placement="bottom-end" width="200" v-model="isShowHeaderSet" title="设置显示条目">
                                <Button type="text" icon="ios-cog" > 设置</Button>
                                    <div class="api" slot="content">
                                        <!--<Checkbox-group v-model="tempArr">-->
                                            <Checkbox v-for="(el,index) in showTableColumns" :key="index" v-model="el.isShow">{{el.title}}</Checkbox>
                                        <!--</Checkbox-group>-->
                                         <Button type="primary" size="small" long style="float:left;" @click="setShowColumns">确定</Button>                                     
                                    </div>
                             </Poptip>
                         </p>
                    </div>
                    <Table :columns="tableHeader" :data="tableData" show-footer :height="tableHeight" @on-selection-change="getSelectedData" style="float:left;">

                       <Page :total="total" :current="pageCurrent" style="float:right;margin-right:20px;display:table;" show-total slot="footer" @on-change="changePage"></Page>                        
                    </Table>
                    
            </div>
             
        </div>
        <!--以下开始为弹窗-->
        <!--线索分派-->
        <Modal v-model="isShowChangePerson" title="线索分派" width="300" :mask-closable="false">
            <p class="main-title-color">请选择接收人</p><br>
                   <Select  placeholder="根据部门筛选" v-model="model1" filterable @on-change="changeDepart">
                    <Option v-for="item in deptList" :value="item.value" :key="item">{{ item.label }}</Option>
                   </Select>
                   <br/><br>
                   <Select  filterable placeholder="选择接收人" @on-change="setChangePerson">
                        <Option v-for="item in userList" :value="item.value" :key="item">{{ item.label }}</Option>
                   </Select>
            <div slot="footer">
                <Button @click="shutChangePerson" long style="width:45%">取消</Button>
                <Button type="primary" @click="subChangePerson" long style="width:45%">提交</Button>
            </div>
        </Modal>

<!--活动添加/修改弹窗-->
        <Modal v-model="isShowEditBox" title="客户添加/编辑" width="400" :mask-closable="false"  :styles="style" class="diy-box">
            <Form :model="addObj" :rules="addRules" style="margin-top:20px;" ref="addForm" :label-width="80">
                <bForm :itemslist="items" ref="loopForm" formobj="addObj"></bForm>
                <Form-item label="所属区域">
                    <Select v-model="belong_area" style="width:200px">
                        <Option v-for="item in areaList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="所属行业">
                    <Select v-model="belong_industry" style="width:200px">
                        <Option v-for="item in industryList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="所属产品">
                    <Select v-model="belong_product" style="width:200px">
                        <Option v-for="item in productList" :value="item.value" :key="item">{{ item.label }}</Option>
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

    <!--转为客户-->
    <Modal v-model="isShowCus" title="线索添加/编辑" width="400" :mask-closable="false"  :styles="style" class="diy-box">
            <Form :model="cusObj" ref="changemessage" :label-width="90">
                <Form-item label="客户名称">
                                <Input v-model="cusObj.cus_name" placeholder="请输入客户名称"></Input>
                    </Form-item>
                    <Form-item label="客户电话">
                                <Input v-model="cusObj.cus_tel" placeholder="请输入客户电话"></Input>
                    </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddBox" long style="width:45%">取消</Button>
                <Button type="primary" @click="subDataMessage" long style="width:45%">提交</Button>
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
                deptList: [], //部门
                belong_dept: "",
                belong_product: '',
                productList: [], //产品
                belong_industry: '',
                industryList: [], //行业
                belong_area: '',
                areaList: [], //区域
                total: 0,
                pageCurrent: 1,
                deptLists: [],
                userList: [],
                model1: '',
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
                isShowCus: false, //显示转为客户弹窗
                addObj: {}, //修改/编辑活动对象
                changeNum: 4,
                cusObj: {
                    cus_name: "",
                    cus_tel: "",
                    clue_ids: [],
                }, //修改/编辑活动对象
                addRules: {}, //修改，编辑活动验证规则
                items: [], //该模块的页面布局数据，需要异步获取           
                style: {
                    height: '400px',
                },
                clue_id: "",
                state: 1, //1:添加  2：修改
                isShowDetail: false, //详情显示
                curObj: {
                    list: [],
                    tableId: 8,
                    id: "",

                }, //被点击的名称
                clue: { //分页查询
                    packetType: 1000,
                    tableId: 8,
                    operationParamsItem: {
                        pi: 1,
                        ps: 10,
                    },
                },
                additems: { //获取添加页面布局
                    packetType: 6000,
                    tableId: 8,
                    operationParamsItem: {
                        pi: 1,
                        ps: 10,
                    },
                },
                updateitems: { //获取修改页面布局
                    packetType: 7000,
                    tableId: 8,
                    operationParamsItem: {
                        key_name: "customer_id",
                        key_value: "",
                    },
                },
                addClue: { //添加或修改
                    packetType: 3000,
                    tableId: 8,
                    type: 1, //1:添加   2:修改
                    operationParamsItem: {
                        key_name: "customer_id",
                        key_value: "",
                        paramsList: [],
                    },
                },
                delClue: { //删除
                    packetType: 5000,
                    tableId: 8,
                    operationParamsItem: {
                        key_name: "customer_id",
                        deleteList: [],
                    },
                },
                returnClue: { //回归公海
                    clue_ids: [],
                },
                turnClue: { //转让
                    takeover_person: "",
                    customer_ids: [],
                },
                turnVain: { //转为无效或有效
                    clue_status: 1,
                    clue_ids: [],
                },
                clueField: { //分页查询业务实体详情
                    packetType: 1000,
                    tableId: 8,
                    service_id: 1,
                    service_name_a: "crm_corp_mgr_std_market",
                    service_name_b: "crm_corp_mgr_std_clue",
                    field_name_a: "market_id",
                    field_name_b: "clue_id",
                    config_id: 4,
                    field_value: 1,
                    operationParamsItem: {
                        pi: 1,
                        ps: 5,
                    },

                },
                message: {
                    tableId: 1,
                },
                subState:true,
            }
        },

        // 创建组件生命周期
        created() {
            this.getHeader();
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
            //锁定
            lockMessage() {
                this.$Modal.confirm({
                    title: '锁定确认',
                    content: '<p>是否执行[<span style="color:red;">锁定</span>]操作</p>',
                    onOk: () => {
                        let arr = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "customer_id") {
                                    let key_value = selected[key];
                                    arr.push(key_value);
                                }
                            }
                        }

                        let obj = {
                            customer_ids: arr,
                            customer_lockstatus: 0
                        };
                        this.$http.post("/web/Crm_corp_mgr_std_customer/updateCrm_corp_mgr_std_customer_poolMessage", obj).then((res) => {
                            if (res.data.b) {
                                this.$Message.success('操作成功');
                                this.selectedArr = [];
                                this.getHeader();
                            } else {
                                this.$Message.error('操作失败');
                            }
                        }).catch(function(response) {
                            console.log(response)
                        });

                    }
                });
            },
            //解锁
            returnLockMessage() {
                this.$Modal.confirm({
                    title: '解除锁定确认',
                    content: '<p>是否执行[<span style="color:red;">解除锁定</span>]操作</p>',
                    onOk: () => {
                        let arr = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "customer_id") {
                                    let key_value = selected[key];
                                    arr.push(key_value);
                                }
                            }
                        }

                        let obj = {
                            customer_ids: arr,
                            customer_lockstatus: 1
                        };

                        this.$http.post("/web/Crm_corp_mgr_std_customer/updateCrm_corp_mgr_std_customer_poolMessage", obj).then((res) => {
                            if (res.data.b) {
                                this.$Message.success('操作成功');
                                this.selectedArr = [];
                                this.getHeader();
                            } else {
                                this.$Message.error('操作失败');
                            }
                        }).catch(function(response) {
                            console.log(response)
                        });

                    }
                });
            },
            //分派提交
            subChangePerson() {
                if (this.turnClue.takeover_person == "") {
                    this.$Message.error('接收人不能为空');
                    return false;
                };
                this.$http.post("/web/Crm_corp_mgr_std_customer/addAllotCrm_corp_mgr_std_customer_poolMessage", this.turnClue).then((res) => {
                    if (res.data.b) {
                        this.$Message.success('操作成功');
                        this.selectedArr = [];
                        this.getHeader();
                    } else {
                        if (res.data.i == 1) {
                            this.$Message.warning("有客户处于锁定状态，不能分派");
                        } else {
                            this.$Message.error('操作失败');
                        }
                    }
                }).catch(function(response) {
                    console.log(response)
                });
                this.isShowChangePerson = false;
            },
            //点击分派人
            setChangePerson(value) {
                this.takeover_person = value;
                this.turnClue.takeover_person = value;
                let list = [];
                for (let i = 0; i < this.selectedArr.length; i++) {
                    for (let key in this.selectedArr[i]) {
                        let selected = [];
                        selected = this.selectedArr[i];
                        if (key == "customer_id") {
                            let key_value = selected[key];
                            list.push(key_value);
                        }
                    }
                    this.turnClue.customer_ids = list;
                }
            },
            //分派公海池客户
            returnItem() {
                //查询部门
                this.$http.post("/web/Crm_corp_mgr_module_config/findDeptById", {}).then((res) => {
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
                    this.isShowChangePerson = true;
                }).catch(function(response) {
                    console.log(response)
                });

            },
            //领取客户
            turnItem() {
                this.$Modal.confirm({
                    title: '领取确认',
                    content: '<p>是否执行[<span style="color:red;">领取</span>]操作</p>',
                    onOk: () => {
                        let arr = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "customer_id") {
                                    let key_value = selected[key];
                                    arr.push(key_value);
                                }
                            }
                        }

                        let obj = {
                            customer_ids: arr
                        };
                        this.$http.post("/web/Crm_corp_mgr_std_customer/addCrm_corp_mgr_std_clue_customerMessage", obj).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success('操作成功');
                                this.selectedArr = [];
                                this.getHeader();
                            } else {
                                this.$Message.success('操作成功');
                                    this.$Message.warning(res.data.ec[0]);
                            }
                        }).catch(function(response) {
                            console.log(response)
                        });

                    }
                });
            },
            //点击修改回显数据
            editItem() {
                //查询修改布局及数据
                let addObj = JSON.parse(JSON.stringify(this.selectedArr[0]));
                //console.log(this.addObj);
                this.isShowEditBox = true;
                this.addClue.type = 2;
                this.addClue.packetType = 4000;
                this.state = 2;
                for (let key in addObj) {
                    this.clue_id = addObj.clue_id;
                }
                this.updateitems.operationParamsItem.key_value = this.clue_id;
                //查询修改线索布局
                this.$http.post("/web/Crm_corp_mgr_std_clue/findUpdateMessageByMuneBjById", this.updateitems).then((res) => {
                    this.items = res.data.operationParamsItem.backInfoList;
                    let items = JSON.parse(JSON.stringify(res.data.operationParamsItem.backInfoList));
                    this.creatAddObj(this.addObj, items);
                    this.createAddRules(this.addRules, items);
                }).catch(function(response) {
                    console.log(response)
                });

                this.addClue.operationParamsItem.key_value = this.clue_id;
                //查询维度
                this.$http.post("/web/Crm_corp_mgr_std_clue/findBelongMessage", {}).then((res) => {
                    this.productList = res.data.a.belong_product;
                    this.industryList = res.data.a.belong_industry;
                    this.areaList = res.data.a.belong_area;
                }).catch(function(response) {
                    console.log(response)
                });
                //根据id查询当前记录的维度
                this.$http.post("/web/Crm_corp_mgr_std_clue/findPoolMessage", {
                    clue_id: this.clue_id
                }).then((res) => {
                    this.belong_product = res.data.o.belong_product;
                    this.belong_industry = res.data.o.belong_industry;
                    this.belong_area = res.data.o.belong_area;
                }).catch(function(response) {
                    console.log(response)
                });
            },
            //删除线索
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
                                if (key == "clue_id") {
                                    let key_value = selected[key];
                                    arr.push(key_value);
                                }
                            }
                        }
                        this.delClue.operationParamsItem.deleteList = arr;
                        console.log(this.delClue.deleteList);
                        this.$http.post("/web/Crm_corp_mgr_std_clue/delCrm_corp_mgr_std_clue_poolById", this.delClue).then((res) => {
                            this.$Message.success('操作成功');
                        }).catch(function(response) {
                            console.log(response)
                        });

                    }
                });
            },
            //添加线索
            subAddData() {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                       
                        
                        let arr = [];
                        for (let key in this.addObj) {
                            if (key != "customer_id") {
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
                        this.addClue.operationParamsItem.paramsList = arr;
                        console.log(this.addClue.operationParamsItem.paramsList);
                        if (this.state == 1) { //添加
                            this.$http.post("/web/Crm_corp_mgr_std_customer/addCrm_corp_mgr_std_customer_pool", this.addClue).then((res) => {
                                if (res.data.operationParamsItem.isSuccess) {
                                    this.$Message.success('操作成功');
                                    this.isShowEditBox = false;
                                   
                                    this.getHeader();
                                } else {
                                    this.$Message.error('操作失败');
                                   
                                }
                            }).catch(function(response) {
                                console.log(response)
                              
                            });
                        } else { //修改
                            this.$http.post("/web/Crm_corp_mgr_std_customer/updateCrm_corp_mgr_std_customer_pool", this.addClue).then((res) => {
                                if (res.data.operationParamsItem.isSuccess) {
                                    this.$Message.success('操作成功');
                                    this.isShowEditBox = false;
                                  
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
            //分页查询公海池列表
            getHeader() {
                this.changeNum = 4;
                this.clue.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_customer/findCrm_corp_mgr_std_customer_poolList", this.clue).then((res) => {
                    if (res.data.operationParamsItem.isSuccess == 1) {
                        this.showTableColumns = res.data.operationParamsItem.backInfoList.field_name;
                        this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                        this.total = res.data.operationParamsItem.page.total;
                        this.pageCurrent = res.data.operationParamsItem.page.pageIndex;
                        let checkboxObj = {
                            title: '选择框',
                            type: 'selection',
                            width: '60',
                            //fixed:'left',
                        };
                        this.showTableColumns.unshift(checkboxObj);
                        this.showTableColumns.map(obj => {
                            obj.align = "center";
                            obj.sortable = true;
                            obj.label = obj.title;
                            obj.isShow = true;
                            //obj.width=200;
                        });
                        this.tableHeader = JSON.parse(JSON.stringify(this.showTableColumns));
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },

            //点击添加查询布局
            addItem() {
                this.belong_product = "",
                    this.belong_industry = "",
                    this.belong_area = "",
                    this.belong_dept = '';
                //查询添加线索布局
                this.$http.post("/web/Crm_corp_mgr_std_customer/findCrm_corp_mgr_std_customer_poolById", this.additems).then((res) => {
                    this.items = res.data.operationParamsItem.backInfoList;
                    let items = JSON.parse(JSON.stringify(res.data.operationParamsItem.backInfoList));
                    this.creatAddObj(this.addObj, items);
                    this.createAddRules(this.addRules, items);
                    this.isShowEditBox = true; //注意，addObj和
                }).catch(function(response) {
                    console.log(response)
                });
                //查询维度
                this.$http.post("/web/Crm_corp_mgr_std_customer/findBelongMessage", {}).then((res) => {
                    this.productList = res.data.a.belong_product;
                    this.industryList = res.data.a.belong_industry;
                    this.areaList = res.data.a.belong_area;
                    this.deptLists = res.data.a.belong_dept;
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




            shutChangePerson() {
                this.isShowChangePerson = false;
            }, //关闭转交

            //根据部门查询成员
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

            //提交转让
            creatAddObj(targetObj, items) {
                items.map((obj) => {
                    targetObj[obj.field_name_db] = obj['field_defvalue'];
                }); //给添加对象增加键值对。传入目标对象,和页面布局
            },
            createAddRules(targetObj, items) {
                Object.assign(targetObj, this.$myFunction.createRuleObj(items));
                // targetObj=this.$myFunction.createRuleObj(items);//创建验证规则，传入的参数为目标对象和页面布局数组
            },






            //编辑选择项
            shutAddBox() {
                this.isShowEditBox = false;
            },




            //删除选择项
            setShowColumns() {
                let arr = this.showTableColumns.filter(obj => obj.isShow == true);
                this.tableHeader = arr;
                this.isShowHeaderSet = false;
            }, //设置页头显示字段方法
            getTableData(pi) {
                let clue = {
                    packetType: 1000,
                    tableId: 1,
                    operationParamsItem: {
                        pi: pi,
                        ps: 10,
                    },
                };
                this.$http.post("/web/Crm_corp_mgr_std_clue/findCrm_corp_mgr_std_clueList", clue).then((res) => {
                    this.tableData = res.data.operationParamsItem.backInfoList.field_value;
                }).catch(function(response) {
                    console.log(response)
                });
            }, //获取表格内容
            //模拟异步获取页头所有字段信息，注意，第一项可能需要获取之后再添加，因为第一项是复选框，后台是不会传过来的


            //点击多选框获取数据
            getSelectedData(arr) {
                console.log(arr);
                this.selectedArr = arr;

            }, //获取列表中被选中的数据列表，赋值给selectedData属性；
            showDetail() {
                let id;
                for (let i = 0; i < this.selectedArr.length; i++) {
                    for (let key in this.selectedArr[i]) {
                        let selected = [];
                        selected = this.selectedArr[i];
                        if (key == "clue_id") {
                            id = selected[key];
                        }
                    }

                }
                //查询业务实体绑定的业务实体
                this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_module_config", this.message).then((res) => {
                    this.curObj.list = res.data.a;
                    this.curObj.id = id;
                    this.$refs.details.isShowDetail = true;
                }).catch(function(response) {
                    console.log(response)
                });
                //this.curObj=this.selectedArr[0];
                console.log(this.curObj);

            },


            //转为有效
            returnEffective() {
                this.$Modal.confirm({
                    title: '有效确认',
                    content: '<p>是否执行[<span style="color:red;">转为有效</span>]操作</p>',
                    onOk: () => {
                        let list = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "clue_id") {
                                    let key_value = selected[key];
                                    list.push(key_value);
                                }
                            }

                        }
                        this.turnVain.clue_ids = list;
                        this.turnVain.clue_status = 0;
                        this.$http.post("/web/Crm_corp_mgr_std_clue/updateClue_status", this.turnVain).then((res) => {
                            this.$Message.success('操作成功');
                        }).catch(function(response) {
                            console.log(response)
                        });
                    }
                });
            },

            //转为无效
            returnVain() {

                this.$Modal.confirm({
                    title: '有效确认',
                    content: '<p>是否执行[<span style="color:red;">转为有效</span>]操作</p>',
                    onOk: () => {
                        let list = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "clue_id") {
                                    let key_value = selected[key];
                                    list.push(key_value);
                                }
                            }

                        }
                        this.turnVain.clue_ids = list;
                        this.turnVain.clue_status = 1;
                        this.$http.post("/web/Crm_corp_mgr_std_clue/updateClue_status", this.turnVain).then((res) => {
                            this.$Message.success('操作成功');
                        }).catch(function(response) {
                            console.log(response)
                        });
                    }
                });

            },

            //弹出转为客户窗口
            returnCus() {
                this.isShowCus = true;
            },
            //装换成客户
            subDataMessage() {
                this.$Modal.confirm({
                    title: '转换客户确认',
                    content: '<p>是否执行[<span style="color:red;">转为客户</span>]操作</p>',
                    onOk: () => {
                        let list = [];
                        for (let i = 0; i < this.selectedArr.length; i++) {
                            for (let key in this.selectedArr[i]) {
                                let selected = [];
                                selected = this.selectedArr[i];
                                if (key == "clue_id") {
                                    let key_value = selected[key];
                                    list.push(key_value);
                                }
                            }

                        }

                        this.$http.post("/web/Crm_corp_mgr_std_clue/addCusMessageById", {
                            clue_ids: list
                        }).then((res) => {
                            this.$Message.success('操作成功');
                        }).catch(function(response) {
                            console.log(response)
                        });
                    }
                });
            },

            //有效客户
            effectiveCust() {
                this.changeNum = 1;
                this.clue.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_customer/findEffectiveCrm_corp_mgr_std_customer_poolList", this.clue).then((res) => {
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
            //无效客户
            invalidCust() {
                this.changeNum = 2;
                this.clue.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_customer/findInvalidCrm_corp_mgr_std_customer_poolList", this.clue).then((res) => {
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
            //自动回收客户
            outofdateCust() {
                this.changeNum = 3;
                this.clue.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_customer/findOutofdateCrm_corp_mgr_std_customer_poolList", this.clue).then((res) => {
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
            allCust() {
                this.changeNum = 4;
                this.clue.operationParamsItem.pi = 1;
                this.$http.post("/web/Crm_corp_mgr_std_customer/findCrm_corp_mgr_std_customer_poolList", this.clue).then((res) => {
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
                this.clue.operationParamsItem.pi = c;
                let url = "";
                if (this.changeNum == 1) {
                    url = "/web/Crm_corp_mgr_std_customer/findEffectiveCrm_corp_mgr_std_customer_poolList";
                } else if (this.changeNum == 2) {
                    url = "/web/Crm_corp_mgr_std_customer/findInvalidCrm_corp_mgr_std_customer_poolList";
                } else if (this.changeNum == 3) {
                    url = "/web/Crm_corp_mgr_std_customer/findOutofdateCrm_corp_mgr_std_customer_poolList";
                } else if (this.changeNum == 4) {
                    url = "/web/Crm_corp_mgr_std_customer/findCrm_corp_mgr_std_customer_poolList";
                }
                this.$http.post(url, this.clue).then((res) => {
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

            //详情
            // metail(){
            //      this.$http.post("/web/Crm_corp_mgr_module_config/findRecordMessgeCrm_corp_mgr_module_configList",this.clueField).then((res)=>{                  

            //                         }).catch(function(response) {
            //                             console.log(response)
            //                             }
            //                         );
            // },
            //根据业务实体查询对应记录
            metail() {
                let obj = this.selectedArr[0];
                this.showDetail(this.curObj);

            },
        }
    }
</script>