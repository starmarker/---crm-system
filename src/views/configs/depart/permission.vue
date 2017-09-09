<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p style="font-size:16px;">
                <Icon type="lock-combination"></Icon> 权限管理</p>
        </div>
        <div class="layout-content-main">
            <Row :gutter="24" type="flex">
                <Col span="4">
                <div class="item-block">
                    <div class="item-block-title">部门管理
                        <p class="operate" :class="{'active':iseditable}">
                            <Icon type="plus" @click.native="addDepart"></Icon>
                            <Icon type="trash-a" @click.native="showDelBlock"></Icon>
                            <Icon type="edit" @click.native="updateDepart"></Icon>
                        </p>
                    </div>
                    <Tree ref="departs" :data="baseData" class="left-tree" @on-select-change="getSelectedNode" @on-check-change="getCheckedNodes"></Tree>
                </div>
                </Col>
                <!--部门用户编辑-->
                <Col span="20" v-if="showUsers==1">
                <div class="item-block">
                    <div class="item-block-title">
                        <Button type="primary" icon="person-add" @click="addUser" style="float:left;margin-top:5px">添加员工</Button>
                        <Button type="primary" icon="arrow-down-a" style="float:left;margin-left:5px;margin-top:5px">
                            <a href="/crm/upload/1.xlsx" target="_blank" style="color:#fff;">员工模版</a>
                        </Button>
                        <Upload action="/web/ExcelLeadingUsers/leadingUsers" :format="['xlsx','xls']" :max-size="10240" style="float:left;margin-left:5px;" :on-error="uploadError" :on-success="uploadSuccess">
                            <Button type="primary" icon="ios-cloud-upload-outline">员工导入</Button>
                        </upload>
    
                        <p class="operate">
                            <Button type="text" icon="ios-loop-strong" class="depart-posi" @click="showUsersFunc"> 切换岗位</Button>
                        </p>
                    </div>
                    <p class="table-header-operate">
                        已经选择
                        <span class="number">{{tableSelectedList.length}}</span> 项
                        <ButtonGroup class="ml-50">
                            <Button size="small" @click="editUser">编辑</Button>
                            <Button size="small" @click="linkData">绑定维度</Button>
                            <Button size="small" @click="leaveOffice">离职</Button>
                            <Button size="small" @click="lock">冻结</Button>
                            <Button size="small" @click="recover">恢复</Button>
                            <Button size="small" @click="resetPwd">重置密码</Button>
                            <Button type="error" size="small" @click="delUsers">删除</Button>
                        </ButtonGroup>
                    </p>
                    <Table :columns="headerList" :data="userList" class="common-table" show-footer="true" border @on-selection-change="getTableNodes">
                        <div slot="footer">
                            <Page :total="userTotal" :current="userPageCurrent" class="table-page-position" @on-change="changeUserPage" :page-size="10"></Page>
                        </div>
                    </Table>
                </div>
                </Col>
                <!--岗位编辑-->
                <Col span="20" v-if="showUsers==2">
                <div class="item-block">
                    <div class="item-block-title" style="margin-bottom:10px;">
                        <Button type="primary" icon="person-stalker" @click="addPos">添加岗位</Button>&nbsp;已选择部门:
                        <span class="number">{{selectedObj.title || '未选择部门'}}</span>
                        <p class="operate">
                            <Button type="text" icon="ios-loop-strong" class="depart-posi" @click="showUsers=1"> 切换用户</Button>
                        </p>
                    </div>
                    <p>
                        已经选择
                        <span class="number">{{tableSelectedPosList.length}}</span> 项
                        <Button-group class="ml-50">
                            <Button size="small" type="primary" @click="editPos" :disabled="tableSelectedPosList.length!=1">编辑</Button>
                            <Button size="small" type="primary" @click="editPosPermission" :disabled="tableSelectedPosList.length!=1">授权</Button>
                            <Button type="error" size="small" @click="delPos" :disabled="tableSelectedPosList.length!=1">删除</Button>
                        </Button-group>
                    </p>
                    <Table :columns="headerList1" :data="departPos" class="common-table" :show-header="true" border @on-selection-change="getPosTableNodes" style="width:300px;">
    
                        <div slot="footer">
                            <Page :total="postTotal" class="table-page-position" @on-change="changePostListPage" :page-size="3" size="small"></Page>
                        </div>
                    </Table>
                </div>
                </Col>
                <!--授权界面-->
                <Col span="20" v-if="showUsers==3">
                <div class="item-block">
                    <div class="item-block-title">
                        已选择部门:
                        <span class="number">{{selectedObj.title || '未选择部门'}}-{{tableSelectedPosList[0].post_name ||'未选择岗位'}}</span>
                        <p class="operate">
                            <Button type="text" icon="close" class="depart-posi" @click="showUsers=2">关闭授权</Button>
                        </p>
                    </div>
                    <div class="cols">
                        <div class="item-block-title">功能权限</div>
                        <!--<Tree ref="funs" :data="allFuncData" show-checkbox class="left-tree" @on-select-change="getSelectedNode" @on-check-change="getCheckedNodes"></Tree>-->
                        <Tree ref="funs" :data="allFuncData" show-checkbox class="left-tree" @on-check-change="getCheckedFuncNodes"></Tree>
                        <!--功能权限，这里使用了部门的数据占位置，实际调用过程需要在data里面添加数组，以及使用全局方法转化数组的操作-->
                        <Button type="ghost" class="submitper" @click="updateFuncCodes">提交</Button>
                    </div>
                    <div class="cols">
                        <div class="item-block-title">数据范围权限</div>
                        <Form label-position="top" style="float:left;margin-top:10px;padding:5px;width:98%">
                            <Form-item label='部门'>
                                <Select v-model="postDataArea.sbumenArea">
                                    <Option v-for="(el,index) in bumenArea" :value="el.value" :key="el.value">{{el.name}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label='行业'>
                                <Select v-model="postDataArea.shangyeArea">
                                    <Option v-for="(el,index) in hangyeArea" :value="el.value" :key="el.value">{{el.name}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label='区域'>
                                <Select v-model="postDataArea.squyuArea">
                                    <Option v-for="(el,index) in quyuArea" :value="el.value" :key="el.value">{{el.name}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label='产品'>
                                <Select v-model="postDataArea.schanpinArea">
                                    <Option v-for="(el,index) in chanpinArea" :value="el.value" :key="el.value">{{el.name}}</Option>
                                </Select>
                            </Form-item>
                        </Form>
                        <Button class="submitper" @click="updateAreaSelect">提交</Button>
                    </div>
                    <div class="cols" style="width:50%;">
                        <div class="item-block-title">字段权限</div>
    
                        <ul class="bus-objs">
                            <li v-for="(el,index) in busObjs" @click="show(index)" :class="{'active':currentTab==index}">{{el.name}}</li>
                            <!--<Tabs >
                                            <Tab-pane :label="el.name" name="el.id" v-for="(el,index) in busObjs" :key="el.id">标签一的内容</Tab-pane>
                                        </Tabs>-->
                            <!--<Button type="primary" v-for="(el,index) in busObjs" @click="getFieldsByBusId(index,el.id)">{{el.name}}</Button>-->
                        </ul>
                        <div class="diy-nav-content">
                            <div class="diy-tab-content" v-show="currentTab==index" v-for="(el,index) in busObjs" :key="index">
                                <Table :columns="fieldTableHeader" :data="el.fields" :width="280"></Table>
                            </div>
                        </div>
                        <Button class="submitper" @click="updateBusObjs">提交</Button>
                    </div>
                </div>
                </Col>
            </Row>
        </div>
        <!--部门主框结束-->
    
        <!--岗位编辑-->
    
        <!--部分弹窗-->
        <!--添加/编辑部门框-->
        <Modal ref="del" v-model="isAddDepart" title="添加/修改部门" class="small-modal">
            <Form :model="departObj" ref="addDepartForm" :rules="departFormValidate" label-position="left">
                <Form-item :label-width="100" label="部门名称" prop="dept_name">
                    <!--from departObj.parent_name-->
                    <Input v-model="departObj.dept_name"></Input>
                </Form-item>
                <Form-item :label-width="100" label="上级部门">
                    <Select v-model="departObj.parent_id" filterable>
                        <Option v-for="(el,index) in defaultDepart" :key="index" :value="el.dept_id">{{el.dept_name}}</Option>
                    </Select>
                    <!--<Input readonly v-model="departObj.parent_id"></Input>-->
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutDepart">取消</Button>
                <Button type="primary" @click="submitAdd">确定</Button>
            </div>
        </Modal>
        <!--添加/编辑用户框-->
        <Modal ref="addEditUser" v-model="isAddUser" title="添加/修改用户">
            <Form :model="addUserObj" ref="addUserForm" :rules="userFormValidate" label-position="left">
                <Form-item :label-width="100" label="姓名" prop="user_name">
                    <Input v-model="addUserObj.user_name"></Input>
                </Form-item>
                <Form-item :label-width="100" label="手机号" prop="user_tel">
                    <Input v-model="addUserObj.user_tel"></Input>
                </Form-item>
                <Form-item :label-width="100" label="邮箱" prop="user_mail">
                    <Input v-model="addUserObj.user_mail"></Input>
                </Form-item>
                <Form-item :label-width="100" label="QQ">
                    <Input v-model="addUserObj.user_qq"></Input>
                </Form-item>
                <Form-item :label-width="100" label="微信">
                    <Input v-model="addUserObj.user_wechart"></Input>
                </Form-item>
                <!-- <Form-item :label-width="100" label="所在部门" prop="depart">
                                     <Select v-model="addUserObj.depart" multiple placement="bottom" filterable>
                                         <Option v-for="(item,index) in selectDepartArr" :value="item.dept_id" :key="item.id">{{ item.dept_name }}</Option>
                                    </Select>
                                </Form-item>   -->
                <Form-item :label-width="100" label="上级领导" prop="shangji">
                    <Select v-model="addUserObj.chief_id" placement="bottom" filterable>
                        <Option v-for="(item,index) in chiefList" :value="item.user_id" :key="item.id">{{ item.user_name }}</Option>
                        <!--这里作为测试，使用了部门数据，实际应该异步获取领导列表-->
                    </Select>
                </Form-item>
                <Form-item :label-width="100" label="当前岗位" v-show="addUserObj.user_id">
                    <Select v-model="addUserObj.position" multiple placement="top">
                        <Option-group :label="item.dept_name" v-for="(item,index) in positionData" :key="index">
                            <Option v-for="items in item.post_list" :value="items.post_id" :key="items.id">{{ items.post_name }}</Option>
                        </Option-group>
                    </Select>
                    <p style="color:blue;line-height:2.5">默认将第一个岗位设为主岗位</p>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutUserBlock">取消</Button>
                <Button type="primary" @click="submitAddUser">确定</Button>
            </div>
        </Modal>
        <!--重置密码弹窗-->
        <Modal ref="resetPwdBlock" v-model="isResetPwd" title="重置密码">
            <Form :model="pwdObj" ref="pwdForm" :rules="pwdRule" label-position="left">
                <Form-item :label-width="100" label="用户名" prop="user_name">
                    <Input v-model="pwdObj.user_name" disabled></Input>
                </Form-item>
                <Form-item :label-width="100" label="新密码" prop="user_pwd">
                    <Input type="password" v-model="pwdObj.user_pwd"></Input>
                </Form-item>
                <Form-item :label-width="100" label="确认密码" prop="user_pwd2">
                    <Input type="password" v-model="pwdObj.user_pwd2"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutResetPwdBlock">取消</Button>
                <Button type="primary" @click="submitResetPwd">确定</Button>
            </div>
        </Modal>
        <!--岗位添加/修改-->
        <Modal ref="posBlock" v-model="isAddPos" title="添加/编辑岗位">
            <Form :model="posObj" ref="posForm" :rules="posRule" label-position="left">
                <Form-item :label-width="100" label="岗位名称" prop="post_name">
                    <Input v-model="posObj.post_name"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutPosBlock">取消</Button>
                <Button type="primary" @click="submitPos">确定</Button>
            </div>
        </Modal>
        <!--维度绑定弹出层-->
        <Modal v-model="isDataRange" title="修改绑定维度" width="600" class="diy-box">
            <!--<Form :label-width="100" label-position="left">
                                <Form-item label="已选地域维度">
                                    <Tag v-for="(el,index) in areaList" closable name="el.value" :key="index" @on-close="removeItem('areaList',index)">{{el.label}}</Tag>
                                </Form-item>
                            <Form-item label="地域选择">
                                <Cascader :data="areaData" @on-change="changeArea" change-on-select trigger="hover"></Cascader>
                            </Form-item>
                            </Form>-->
            <Row :gutter="16">
                <Col span="8" style="border-right:1px solid #ccc;min-height:300px;">
                <div class="item-block-title">地域维度</div>
                <Tree ref="areaList" :data="areaList" show-checkbox class="left-tree" @on-check-change='changeArea($event,"areaArr")'></Tree>
                </Col>
                <Col span="8" style="border-right:1px solid #ccc;">
                <div class="item-block-title">产品维度</div>
                <Tree ref="productList" :data="productList" show-checkbox class="left-tree" @on-check-change='changeArea($event,"productArr")'></Tree>
                </Col>
                <Col span="8">
                <div class="item-block-title">行业维度</div>
                <Tree ref="industryList" :data="industryList" show-checkbox class="left-tree" @on-check-change='changeArea($event,"industryArr")'></Tree>
                </Col>
            </Row>
    
            <div slot="footer">
                <Button @click="shutLinkData">取消</Button>
                <Button type="primary" @click="submitLinkData">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Users from './components/user';
    import Tree from 'iview/src/components/tree';
    export default {

        data() {
            const pwd2 = (rule, value, callback) => {
                if (value == "") {
                    callback(new Error("密码不能为空"))
                } else if (value !== this.pwdObj.user_pwd) {
                    callback(new Error("两次密码不相等"))
                } else {
                    callback()
                }
            };
            return {
                postTotal: 0,
                bumen_tree: [],
                com_name: "",
                self: this,
                showUsers: 1, //显示类型，1为显示部门用户，2为显示部门岗位，3为编辑岗位权限
                baseData: [], //默认部门列表
                allFuncData: [],
                iseditable: true,
                selectedObj: {}, //选中的部门
                checkedNodes: [], //被勾选的部门列表
                checkedFuncNodes: [], //被勾选的方法列表
                isAddDepart: false, //部门添加修改弹窗
                isAddUser: false, //用户修改添加页面
                isResetPwd: false, //密码重置弹出窗
                isAddPos: false, //岗位编辑弹窗状态
                userTotal: 0, //员工总数
                userPageCurrent: 1,
                userStatus: ["", "正常", "冻结", "离职"],
                areaList: [],
                areaArr: [],
                productList: [],
                productArr: [],
                industryList: [],
                industryArr: [],
                headerList: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '姓名',
                    key: 'user_name'
                }, {
                    title: '登录名',
                    key: 'user_account'
                }, {
                    title: '手机号',
                    key: 'user_tel'
                }, {
                    title: '邮箱',
                    key: 'user_mail'
                }, {
                    title: 'QQ',
                    key: 'user_qq'
                }, {
                    title: '微信',
                    key: 'user_wechart'
                }, {
                    title: '状态',
                    key: 'user_status',
                    render(h, p) {
                        let value = p.row.user_status;

                        let result = value == 1 ? '正常' : (value == 2 ? '冻结' : '离职');
                        return h('span', result);
                    }
                }],
                userList: [], //用户数据，一般通过部门获取对应部门的用户数据
                chiefList: [], //用户数据，用户选取上级
                departObj: {
                    depart_name: '',
                    parent_id: null,
                },
                defaultDepart: [], //平行结构部门
                departFormValidate: {
                    dept_name: [{
                        type: 'string',
                        required: true,
                        message: '名称为必填项',
                        trigger: 'blur'
                    }],
                }, //部门添加/修改表单验证
                treeSelectedDepart:[],
                tableSelectedList: [], //用户表格中被选中的用户列表
                addUserObj: {
                    user_id: null,
                    user_name: "",
                    user_tel: "",
                    user_mail: "",
                    user_qq: "",
                    user_wechart: "",
                    //      depart: [],
                    position: [],
                    chief_id: null,
                }, //用户表单对象
                userFormValidate: {
                    user_name: [{
                        required: true,
                        message: '姓名为必填项目',
                        trigger: "blur",
                    }],
                    user_tel: [{
                        required: true,
                        message: '手机号为必填项目',
                        trigger: "blur",
                    }, {
                        type: "string",
                        min: "11",
                        max: "11",
                        message: '请输入正确的手机号',
                        trigger: 'blur'
                    }],
                    user_mail: [{
                        type: 'email',
                        required: true,
                        message: '邮箱为必填项目',
                        trigger: "blur",
                    }],
                },
                positionData: [],
                selectedPosis: [],
                selectDepartArr: [], //部门集合
                pwdObj: {
                    user_name: '',
                    user_id: "",
                    user_pwd: '',
                    user_pwd2: ''
                },
                pwdRule: {
                    user_pwd: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: '8',
                        max: '16',
                        message: '密码长度介于8-16之间',
                        trigger: 'blur'
                    }],
                    user_pwd2: [{
                        validator: pwd2
                    }]
                }, //修改密码表单验证
                departPos: [], //部门岗位，根据部门查出对应的岗位列表
                headerList1: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '职位',
                    key: 'post_name'
                }],
                tableSelectedPosList: [], //岗位列表已被选中的岗位
                posObj: {
                    dept_id: 0, //部门id
                    post_name: "",
                },
                posRule: {
                    "post_name": [{
                        type: 'string',
                        required: true,
                        message: '此项为必填项',
                        trigger: 'blur'
                    }]
                }, //岗位表单验证
                departPers: [],
                // departPerOptions: [{ name: '本部门', value: 1 }, { name: '本人及下属', value: 2 }, { name: '本部门及下属部门', value: 3 }, { name: '全部', value: 4 }],//这是部门权限的选项，此处可以写死，也可以动态获取
                bumenArea: [{
                    name: '本人及下属',
                    value: 1
                }, {
                    name: '本部门',
                    value: 2
                }, {
                    name: '本部门及下属部门',
                    value: 4
                }, {
                    name: '全部',
                    value: 8
                }],
                hangyeArea: [{
                    name: '本级',
                    value: 2
                }, {
                    name: '本级及下级',
                    value: 4
                }, {
                    name: '全部',
                    value: 8
                }],
                quyuArea: [{
                    name: '本级',
                    value: 2
                }, {
                    name: '本级及下级',
                    value: 4
                }, {
                    name: '全部',
                    value: 8
                }],
                chanpinArea: [{
                    name: '本级',
                    value: 2
                }, {
                    name: '本级及下级',
                    value: 4
                }, {
                    name: '全部',
                    value: 8
                }],

                postDataArea: {
                    schanpinArea: null,
                    sbumenArea: null,
                    shangyeArea: null,
                    squyuArea: null
                },


                busObjs: [{
                    name: '客户',
                    id: 1,
                    fields: [{
                        name: "姓名",
                        isShow: true,
                        readonly: false
                    }, {
                        name: "电话",
                        isShow: true,
                        readonly: false
                    }]
                }, {
                    name: '联系人',
                    id: 2,
                    fields: [{
                        name: "姓名2",
                        isShow: true,
                        readonly: false
                    }, {
                        name: "电话2",
                        isShow: true,
                        readonly: false
                    }]
                }, {
                    name: '线索',
                    id: 3,
                    fields: [{
                        name: "姓名3",
                        isShow: true,
                        readonly: false
                    }, {
                        name: "电话3",
                        isShow: true,
                        readonly: false
                    }]
                }],
                //业务对象数组，需要异步获取

                currentTab: 0, //自定义tab被激活的序列
                fieldTableHeader: [{
                    title: '字段名',
                    key: 'name'
                }, {
                    title: '字段权限',
                    key: 'action',
                    render: (h, params) => {
                        let self = this;
                        return h('div', [h('Checkbox', {
                            props: {
                                value: params.row.isShow
                            },
                            on: {
                                'on-change': (res) => {

                                    this.busObjs[this.currentTab].fields[params.index].isShow = res;
                                }
                            }
                        }, '可读'), h('Checkbox', {
                            props: {
                                value: params.row.readonly
                            },
                            on: {
                                'on-change': (res) => {
                                    this.busObjs[this.currentTab].fields[params.index].readonly = res;
                                }
                            }
                        }, '可写')])
                    }
                }], //字段权限，业务对象字段列表的渲染方式，这里渲染了两个checkbox组件，同步data中的值
                //           areaList:[],//这里是已经被选择的地域维度
                isDataRange: false,
            }
        },
        computed: {
            tableHeight() {
                return document.body.clientHeight - 250;
            },
            delList() {
                let tempArr = [];
                let delList = JSON.parse(JSON.stringify(this.checkedNodes)); //拿到当前勾选的节点
                let single = JSON.parse(JSON.stringify(this.selectedObj)); //拿到未勾选但是选中的节点
                delList.map((o) => {
                    tempArr.push(o.id);
                });
                if (single.hasOwnProperty("title")) {
                    if (tempArr.indexOf(single.id)) {
                        delList.push(single);
                    }
                }
                return delList;
            }, //部门被选择的列表（包括点击选中和勾选，用于批量删除，在增加和编辑的时候这里面的元素只能有一个）
        },
        components: {
            Tree
        },
        created() {
            this.getStart();

            // this.$http.post("/getInfo",{}).then((res)=>{
            //     console.log(res)
            // },(reject)=>{console.log(reject)}).catch((error)=>{console.log(error)});

            //7.2 zhushidiao
            // let testArr = [{ title: "果岭集团", id: 1, parent_id: 0, expand: true }, { title: "互联网事业部", id: 2, parent_id: 1 }, { title: "研发部", id: 3, parent_id: 2 }, { title: "商务部", id: 4, parent_id: 2 }];
            // let testArr1 = [{ title: "果岭集团", id: 1, parent_id: 0, expand: true }, { title: "互联网事业部", id: 2, parent_id: 1 }, { title: "研发部", id: 3, parent_id: 2 }, { title: "商务部", id: 4, parent_id: 2 }];
            // let rootArr = this.$myFunction.FlatToNested(testArr);
            // this.baseData = rootArr;

            // function addChild(obj) {
            //     obj.chilren = testArr.filter((ele) => { return ele.parent_id == obj.id });
            //     if (obj.children.length > 0) {

            //     }

            //FlatToNested函数带三个参数,分别是testArr,obj和target,后边的obj是配置对应的字段，函数对应的目录为src/libs/util/util.js;可以从main.js中看到Util的配置项
            // let obj={idField:"",//平行数组要转化的id字段key
            //         textField:'',//平行数组中转化的显示文字字段key
            //         parentField:''//平行数组中父元素id字段key
            // }
            //target同obj，只不过转换的是目标对象的键名。用于默认使用iview的级联形式
            //target={targetId:'value',targetText:'label'};意思是目标对象中的value值对应原始对象中的opt中的idField值，targetText值对应y原始对象中的textField值。
            //this.testDepartArr= this.$myFunction.iviewMenu(testArr1);
            //console.log(JSON.parse(JSON.stringify(this.testDepartArr)));


            //初始化员工列表
            this.reloadAllUser();

            //查询所有部门    0629注释掉
            // this.$http.post("/web/Crm_corp_mgr_dept/findCrm_corp_mgr_deptList",{},{emulateJSON:true}).then((res)=>{
            // if(res.data.b==1){
            // this.selectDepartArr=res.data.a;
            // }else{
            // }
            // }).catch(function(response) {
            // console.log(response)
            // }
            // );

            //查询所有人员
            this.$http.post("/web/Crm_corp_msg_user/findAllUser", {}, {
                emulateJSON: true
            }).then((res) => {
                if (res.data.b == 1) {
                    this.chiefList = res.data.a;
                } else {
                    this.$errorHandle(res);
                }

            }).catch(function(response) {
                console.log(response)
            });
        },

        methods: {
            showUsersFunc() {
                this.showUsers = 2;



            },

            //全局打开时请求的方法
            getStart() {
                var url = "/web/Crm_corp_mgr_dept/findCrm_corp_mgr_deptList";
                this.$http.post(url, {}, {
                    emulateJSON: true
                }).then((data) => {
                    var result = data.data;
                    // {"dept_name":"果岭融创","crm_identifier":"smk","dept_id":1,"parent_dept_id":null}
                    //[{ title: "果岭集团1", id: 1, parent_id: 0, expand: true },
                    if (result.b == 1) {
                        this.defaultDepart = result.a;
                        var list = result.a;
                        this.bumen_tree = [];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].parent_dept_id == -1) {
                                this.com_name = list[i].dept_name;
                                this.bumen_tree.push({
                                    title: list[i].dept_name,
                                    id: list[i].dept_id,
                                    parent_id: 0,
                                    expand: true
                                });
                            } else {
                                this.bumen_tree.push({
                                    title: list[i].dept_name,
                                    id: list[i].dept_id,
                                    parent_id: list[i].parent_dept_id
                                });
                            }
                        }
                        let rootArr = this.$myFunction.FlatToNested(this.bumen_tree);
                        this.baseData = rootArr;
                    } else {

                    }
                })
            },
            getAllFuncData() {
                // var url = "/web/Crm_corp_mgr_dept/findCrm_corp_mgr_deptList";
                this.allFuncData = [];
                var url = "/web/Crm_corp_mgr_post_func_jurisdiction/getAllFuncAndMethods";
                this.$http.post(url, {}, {
                    emulateJSON: true
                }).then((data) => {
                    var result = data.data;
                    if (result.b == 1) {
                        var list = result.a;
                        //this.allFuncData=list;                 
                        var func_tree = [];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].parent_func_id == -1 || !list[i].parent_func_id) {
                                func_tree.push({
                                    meth_id: list[i].meth_id,
                                    meth_code: list[i].meth_code,
                                    parent_id: list[i].parent_id,
                                    title: list[i].func_name,
                                    id: list[i].func_id,
                                    //                                   parent_id: 0,
                                    expand: true
                                });
                            } else {
                                func_tree.push({
                                    meth_id: list[i].meth_id,
                                    meth_code: list[i].meth_code,
                                    //                                    parent_id: list[i].parent_id,
                                    title: list[i].func_name,
                                    id: list[i].func_id,
                                    parent_id: list[i].parent_func_id
                                });
                            }
                        }
                        this.allFuncData = func_tree;
                        this.getPostFuncList();
                    } else {
                        this.$errorHandle(data);
                    }
                })
            },
            getSelectedNode(a) {
                if (a.length > 0) {
                    // console.log(JSON.parse(JSON.stringify(a)));
                    this.treeSelectedDepart=a;
                    this.selectedObj = a[0];
                    // this.$refs.users.test();
                    //单个选中的部门发生变化，刷新部门列表
                    this.frushPostList();
                    this.showUsers = 2;
                } else {
                    this.showUsers = 1;
                    this.selectedObj = {};
                    this.postTotal = 0;
                    this.departPos = [];
                }
            },

            //刷新部门下岗位列表
            frushPostList() {

                var url = "/web/Crm_corp_mgr_post/findCrm_corp_mgr_postList";
                this.$http.post(url, {
                    dept_id: this.selectedObj.id,
                    pi: 1,
                    ps: 3
                }, {
                    emulateHTTP: true
                }).then((data) => {
                    if (data.data.b == 1) {
                        // [{ name: "技术部", positions: [{ name: "UI设计师", id: 2 }, { name: "前端工程师", id: 3 }, { name: "Java工程师", id: 4 }] }, { name: "产品部", positions: [{ name: "售前工程师", id: 5 }, { name: "产品经理", id: 6 }, { name: "测试工程师", id: 7 }] }],
                        //positionData干嘛的？
                        this.postTotal = data.data.page.total;
                        this.departPos = data.data.a;
                    } else {
                        this.$errorHandle(data);
                    }
                })
            },
            //岗位列表分页
            changePostListPage(c) {
                this.$http.post('/web/Crm_corp_mgr_post/findCrm_corp_mgr_postList', {
                    dept_id: this.selectedObj.id,
                    pi: c,
                    ps: 3
                }, {
                    emulateJSON: true
                }).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.departPos = res.data.a;
                        } else {
                            this.$errorHandle(res);
                        }
                    },
                )
            },

            // getSelectedNode(a) {
            //     if (a.length > 0) {
            //         // console.log(JSON.parse(JSON.stringify(a)));
            //         this.selectedObj = a[0];
            //         // this.$refs.users.test();
            //     }
            // },//被选中的部门（单个或没有,这里还要做异步获取用户和岗位的操作）
            getCheckedNodes(nodes) {
                this.checkedNodes = nodes;

                console.log(nodes);
            }, //获取被勾选的项目，可以多选（这里只是辅助，其实只有删除部门可以多选）
            getCheckedFuncNodes(nodes) {
                this.checkedFuncNodes = nodes;
                console.log(nodes);
            }, //获取被勾选的项目，可以多选（这里只是辅助，其实只有删除部门可以多选）
            updateFuncCodes() {
                var arr=this.$refs.funs.getCheckedNodes();
                var ufuncList = JSON.parse(JSON.stringify(arr)); //this.checkedFuncNodes

                this.$http.post('/web/Crm_corp_mgr_post_func_jurisdiction/updatePostFuncAndMethods', {
                    list: ufuncList,
                    post_id: this.posObj.post_id
                }, {
                    emulateJSON: true
                }).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.$Message.success('成功')
                        } else {
                            this.$errorHandle(res);
                        }
                    },
                )

            },
            shutDepart() {
                this.isAddDepart = false;
            }, //关闭部门添加/修改对话框
            showDelBlock() {
                console.log(this.selectedObj);
               
                if (this.treeSelectedDepart.length!=1) {
                    this.$Modal.error({
                        title: "错误信息",
                        content: "请先选择部门"
                    });
                    return false;
                } else {
                    let str = this.selectedObj.title;
                    this.$Modal.confirm({
                        title: "确定删除以下项目",
                        content: '<p>' + str + '</p>',
                        onOk: () => {

                            var url = "/web/Crm_corp_mgr_dept/delCrm_corp_mgr_deptById";
                            this.$http.post(url, {
                                dept_id: this.selectedObj.id
                            }, {
                                headers: {
                                    "content-type": "application/json"
                                }
                            }).then((data) => {
                                if (data.data.b == 1) {
                                    this.$Message.success({
                                        content: "删除成功",
                                        onClose: () => {
                                            this.getStart();
                                        }
                                    });

                                } else {
                                    // this.$Message.error("删除失败");
                                    this.$errorHandle(data);
                                }
                            });
                        }
                    });
                }

            },
            addDepart() {
                this.departObj = {
                    dept_name: "",
                    parent_id: 0,
                    depart: ""
                };

                if (this.delList.length > 1) {
                    this.$Modal.error({
                        content: "添加和编辑只能单选",
                        title: "错误信息"
                    })
                    return false;
                } else if (this.delList.length = 1 && this.delList[0] != null) {
                    this.departObj.parent_id = this.delList[0].id;

                }
                // console.log(this.delList.length+'++++'+this.delList[0].id);
                this.isAddDepart = true;

            },
            updateDepart() {
                if (this.delList.length != 1) {
                    this.$Modal.error({
                        content: "请先选择部门",
                        title: "错误信息"
                    })
                    return false;
                } else if (this.delList.length = 1 && this.delList[0] != null) {
                    //this.departObj.parent_id=this.delList[0];

                    this.departObj.id = this.delList[0].id;
                    this.departObj.parent_id = this.delList[0].parent_id;
                    this.departObj.dept_name = this.delList[0].title;

                    this.isAddDepart = true;
                }
            },
            submitAdd() {

                //新增子部门  {parent_dept_id:this.departObj.parent_id,dept_name:this.departObj.depart_name}
                //console.log(this.departObj);
                this.$refs.addDepartForm.validate((valid) => {
                    if (valid) {
                        if (!this.departObj.id) {
                            var url = "/web/Crm_corp_mgr_dept/addCrm_corp_mgr_dept";
                            this.$http.post(url, {
                                parent_dept_id: this.departObj.parent_id,
                                dept_name: this.departObj.dept_name
                            }).then((data) => {
                                if (data.data.b == 1) {
                                    this.$Message.success("添加成功", 1, this.getStart());
                                } else {
                                    // this.$Message.error("添加失败", 1);
                                    this.$errorHandle(data);
                                }
                            })
                        } else {
                            //修改部门名称
                            var url = "/web/Crm_corp_mgr_dept/updateCrm_corp_mgr_dept";
                            this.$http.post(url, {
                                parent_dept_id: this.departObj.parent_id,
                                dept_name: this.departObj.dept_name,
                                dept_id: this.departObj.id
                            }).then((data) => {
                                if (data.data.b == 1) {
                                    this.$Message.success("修改成功", 1, this.getStart());
                                } else {
                                    // this.$Message.error("修改失败", 1);
                                    this.$errorHandle(data);
                                }
                            })
                        }

                        this.isAddDepart = false;
                    }
                })

            },

            getTableNodes(arrs) {
                this.tableSelectedList = arrs;
            }, //获取用户table中被勾选的项目
            getPosTableNodes(arrs) {
                this.tableSelectedPosList = arrs;
            }, //获取部门岗位table中被勾选的项目
            getdatas() {
                let depart_id = this.selectedObj.id || 0;
                //异步获取操作
            }, //获取部门用户信息
            addUser() {
                this.$refs.addUserForm.resetFields();
                this.addUserObj = {
                    user_id: null,
                    user_name: "",
                    user_tel: "",
                    user_mail: "",
                    user_qq: "",
                    user_wechart: "",
                    //      depart: [],
                    position: [],
                    chief_id: null,
                };
                this.isAddUser = true;
                //添加用户操作
            },
            shutUserBlock() { //关闭员工新增/修改页面
                this.addUserObj = {
                    user_id: null,
                    user_name: "",
                    user_tel: "",
                    user_mail: "",
                    user_qq: "",
                    user_wechart: "",
                    //      depart: [],
                    position: [],
                    chief_id: null,
                };
                this.isAddUser = false;
            },
            submitAddUser() {
                let _this = this;
                this.$refs.addUserForm.validate((valid) => {
                    if (valid) {
                        if (this.addUserObj.user_id) {
                            // 如果id存在，则是进入编辑的方法
                            let obj = this.addUserObj;

                            this.$http.post("/web/Crm_corp_msg_user/updateCrm_corp_msg_user", obj, {
                                emulateJSON: true
                            }).then((res) => {
                                if (res.data.b == 1) {
                                    this.$Message.success({
                                        content: '操作成功',
                                        duration: 1,
                                        onClose: () => {
                                            this.isAddUser = false;
                                            this.reloadAllUser();
                                        }
                                    })
                                } else {
                                    this.$errorHandle(res);
                                }

                            }).catch((res) => {
                                this.$Message.error({
                                    content: '操作失败，原因未知',
                                    duration: 1,
                                    onClose: () => {

                                        this.isAddUser = true;
                                    }
                                })
                            });

                        } else {
                            //如果id不存在，则进入添加的方法
                            let obj = this.addUserObj;

                            this.$http.post("/web/Crm_corp_msg_user/addCrm_corp_msg_user", obj, {
                                emulateJSON: true
                            }).then((res) => {

                                if (res.data.b == 1) {
                                    this.$Message.success({
                                        content: '操作成功',
                                        duration: 1,
                                        onClose: () => {
                                            this.isAddUser = false;
                                            this.reloadAllUser();
                                        }
                                    })
                                } else {
                                    this.$errorHandle(res);
                                }

                            }).catch((res) => {
                                this.$Message.error({
                                    content: '操作失败，原因未知',
                                    duration: 1,
                                    onClose: () => {}
                                })
                            });
                            //console.log("chenggg");
                        }
                    }
                });

            },
            editUser() {
                this.$refs.addUserForm.resetFields();
                if (this.tableSelectedList.length != 1) {
                    this.$Modal.error({
                        content: "编辑必选且只能单选",
                        title: "错误信息"
                    });
                    return false;
                } else {
                    this.addUserObj = this.tableSelectedList[0];
                    this.findPositionUser(this.addUserObj.user_id);
                    this.findAllpostList();
                    console.log(this.addUserObj);
                    this.isAddUser = true;
                }
            }, //编辑用户的方法
            userArrayOperate(operName, callback) {
                //两个参数，第一个参数为操作的名称，这里是“离职”，“恢复”，“删除”之类的字符串，callback为点击确定按钮之后的回调函数。
                if (this.tableSelectedList.length == 0) {
                    this.$Modal.error({
                        content: "没有选择用户",
                        title: "错误信息"
                    });
                    return false;
                } else {
                    let str = this.tableSelectedList.map((item) => {
                        return item.user_name
                    }).toString(); //这句话的意思是把选中用户列表中的name字段抽出来，转成字符串，在确认框中显示
                    this.$Modal.confirm({
                        title: "是否对以下用户进行" + operName + "操作",
                        content: '<p>' + str + '</p>',
                        onOk: callback
                    });
                }
            },
            // 用户批量操作的方法
            leaveOffice() {
                this.userArrayOperate("离职", () => {

                    let arr = this.tableSelectedList.map((item) => {
                        return item.user_id
                    });

                    this.$http.post("/web/Crm_corp_msg_user/updateCrm_corp_msg_userStatus", {
                        "user_ids": arr,
                        "user_status": 3
                    }, {
                        emulateJSON: true
                    }).then((res) => {
                        if (res.data.b == 1) {
                            this.$Message.success({
                                content: '操作成功',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        } else {
                            this.$errorHandle(res);
                        }
                    });

                    //所有选定的对象全部在this.tableSelectedList中
                });
                // if (this.tableSelectedList.length==0) {
                //     this.$Modal.error({ content: "没有选择用户", title: "错误信息" });
                //     return false;
                // }else{
                // let str = this.tableSelectedList.map((item) => { return item.name }).toString();//这句话的意思是把选中用户列表中的name字段抽出来，转成字符串，在确认框中显示
                //     this.$Modal.confirm({
                //         title: "是否对以下用户进行离职操作",
                //         content: '<p>' + str + '</p>',
                //         onOk: () => {
                //             console.log("删除进行中");//这里进行异步的离职操作，可以在成功之后重新获取一次用户列表
                //         }
                //     });
                // }

            },
            lock() {
                this.userArrayOperate("冻结", () => {
                    let arr = this.tableSelectedList.map((item) => {
                        return item.user_id
                    });

                    this.$http.post("/web/Crm_corp_msg_user/updateCrm_corp_msg_userStatus", {
                        "user_ids": arr,
                        "user_status": 2
                    }, {
                        emulateJSON: true
                    }).then((res) => {
                        if (res.data.b == 1) {
                            this.$Message.success({
                                content: '操作成功',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        } else {
                            this.$Message.error({
                                content: '操作失败',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        }
                    });
                    //               console.log("发送冻结请求，成功之后重新获取一遍数据");
                    //所有选定的对象全部在this.tableSelectedList中
                });
            }, //冻结方法
            recover() {
                this.userArrayOperate("恢复", () => {
                    let arr = this.tableSelectedList.map((item) => {
                        return item.user_id
                    });

                    this.$http.post("/web/Crm_corp_msg_user/updateCrm_corp_msg_userStatus", {
                        "user_ids": arr,
                        "user_status": 1
                    }, {
                        emulateJSON: true
                    }).then((res) => {
                        if (res.data.b == 1) {
                            this.$Message.success({
                                content: '操作成功',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        } else {
                            this.$Message.error({
                                content: '操作失败',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        }
                    });
                    //               console.log("发送恢复请求，成功之后重新获取一遍数据");
                    //所有选定的对象全部在this.tableSelectedList中
                    //这里是否需要判断用户是否处于被锁定的状态待定
                });
            },
            delUsers() {
                let url = ''; //删除接口地址
                this.userArrayOperate("删除", () => {
                    let arr = this.tableSelectedList.map((item) => {
                        return item.user_id
                    });

                    this.$http.post("/web/Crm_corp_msg_user/delCrm_corp_msg_userById", {
                        "user_ids": arr,
                        "user_isdel": 2
                    }, {
                        emulateJSON: true
                    }).then((res) => {
                        if (res.data.b == 1) {
                            this.$Message.success({
                                content: '操作成功',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        } else {
                            this.$Message.error({
                                content: '操作失败',
                                duration: 1,
                                onClose: () => {
                                    this.reloadAllUser();
                                }
                            })
                        }
                    });
                    //              console.log("发送删除请求，成功之后重新获取一遍数据");
                    //所有选定的对象全部在this.tableSelectedList中
                    //这里是否需要判断用户是否处于被锁定的状态待定
                });
            },
            resetPwd() {
                if (this.tableSelectedList.length != 1) {
                    this.$Modal.error({
                        content: "重置密码必选用户且只能单选",
                        title: "错误信息"
                    });
                    return false;
                } else {
                    this.pwdObj.user_name = this.tableSelectedList[0].user_name;
                    this.pwdObj.user_id = this.tableSelectedList[0].user_id;
                    this.pwdObj.user_pwd = "";
                    this.pwdObj.user_pwd2 = "";
                    this.isResetPwd = true;
                }
            },
            shutResetPwdBlock() {
                this.pwdObj.user_name = "";
                this.pwdObj.user_id = "";
                this.pwdObj.user_pwd = "";
                this.pwdObj.user_pwd2 = "";
                this.isResetPwd = false;
            },
            submitResetPwd() {
                this.$refs.pwdForm.validate((valid) => {
                    if (valid) {
                        this.$http.post("/web/Crm_corp_msg_user/updateCrm_corp_msg_userPwd", this.pwdObj, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.isResetPwd = false;
                                        this.reloadAllUser();
                                    }
                                })
                            } else {
                                this.$Message.error({
                                    content: '操作失败',
                                    duration: 1,
                                    onClose: () => {
                                        this.isResetPwd = false;
                                        this.reloadAllUser();
                                    }
                                })
                            }
                        });
                    } else {
                        console.log("表单验证失败");
                    }
                });
            },
            addPos() {
                this.posObj.dept_id = this.selectedObj.id; //选中的部门id即为即为岗位所属的id;
                this.posObj.post_id = "";
                this.posObj.post_name = "";
                this.isAddPos = true;
            },
            editPos() {
                this.posObj = this.tableSelectedPosList[0]; //已经在按钮上做了判断，如果选中了多个，则编辑/授权按钮无效
                this.isAddPos = true;
            }, //编辑岗位
            shutPosBlock() {
                this.isAddPos = false
            }, //关闭岗位编辑/添加弹窗
            submitPos() {
                var url;
                if (this.posObj.post_id) {
                    //修改
                    url = "/web/Crm_corp_mgr_post/updateCrm_corp_mgr_post";
                } else {
                    //新增
                    url = "/web/Crm_corp_mgr_post/addCrm_corp_mgr_post";
                }
                console.log(this.posObj);
                // 如果id不存在，则进入添加的方法
                //如果id存在，则是进入编辑的方法
                this.$refs.posForm.validate((valid) => {
                    if (valid) {
                        this.$http.post(url, this.posObj, {
                            emulateJSON: true
                        }).then((res) => {
                            //成功之后的回调
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.isAddPos = false;
                                        this.frushPostList();
                                    }
                                })
                            } else {
                                this.$Message.error({
                                    content: '操作失败',
                                    duration: 1,
                                    onClose: () => {
                                        this.isAddPos = true;
                                    }
                                })
                            }
                        }).catch((res) => {
                            this.$Message.error({
                                content: '操作失败，原因未知',
                                duration: 1,
                                onClose: () => {

                                    this.isAddPos = true;
                                }
                            });
                        });
                    }
                })
            },

            //显示岗位权限管理页面
            editPosPermission() {
                this.showUsers = 3;
                this.posObj = this.tableSelectedPosList[0];
                this.getDataAreaByPid();
                this.getAllTableList();
                this.getAllFuncData();

                //请求并刷新权限相关的信息
                // this.getAllFunc();
                // this.getFuncListByPid();
                // this.getDataAreaByPid();
                // this.getAllField();
                // this.getFieldByPid();

            },
            //获取该岗位的维度授权信息
            getDataAreaByPid() {
                var url = "/web/Crm_corp_mgr_post_dataarea_jurisdiction/findCrm_corp_mgr_post_dataarea_jurisdictionList";
                this.$http.post(url, {
                    post_id: this.posObj.post_id
                }, {
                    emulateJSON: true
                }).then(res => {
                    if (res.data.b == 1) {
                        this.postDataArea = res.data.o;
                    } else {
                        this.$Message.error("获取岗位的维度权限信息失败！");
                    }

                });
            },
            updateAreaSelect() {
                if (this.postDataArea.schanpinArea && this.postDataArea.sbumenArea && this.postDataArea.shangyeArea && this.postDataArea.squyuArea) {

                    var url = "/web/Crm_corp_mgr_post_dataarea_jurisdiction/updateCrm_corp_mgr_post_dataarea_jurisdiction";
                    this.$http.post(url, {
                        map: this.postDataArea,
                        post_id: this.posObj.post_id
                    }, {
                        emulateJSON: true
                    }).then(res => {
                        if (res.data.b == 1) {
                            this.$Message.success("成功");
                        } else {
                            this.$Message.error("获取岗位的维度权限信息失败！");
                        }

                    });
                } else {
                    this.$Modal.error({
                        content: "四项维度均须选择"
                    });
                }


            },

            //所有表列表
            getAllTableList() {
                var url = "/web/Crm_corp_mgr_post/getColumAndFIeld";
                this.$http.post(url, {
                    post_id: this.posObj.post_id
                }, {
                    emulateJSON: true
                }).then(res => {
                    if (res.data.b == 1) {
                        this.busObjs = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }

                });
            },
            updateBusObjs() {
                var url = "/web/Crm_corp_mgr_post/updateColumAndFIeld";
                this.$http.post(url, {
                    list: this.busObjs[this.currentTab].fields
                }, {
                    emulateJSON: true
                }).then(res => {
                    if (res.data.b == 1) {
                        this.$Message.success("修改成功");
                        this.getAllTableList();
                    } else {
                        this.$errorHandle(res);
                    }

                });
            },
            delPos() {
                if (this.tableSelectedPosList.length != 1) {
                    this.$Modal.error({
                        content: "请选择一个岗位",
                        title: "错误信息"
                    });
                    return false;
                } else {
                    let str = this.tableSelectedPosList.map((item) => {
                        return item.post_name
                    }).toString(); //这句话的意思是把选中用户列表中的name字段抽出来，转成字符串，在确认框中显示
                    this.$Modal.confirm({
                        title: "是否对以下岗位进行删除操作",
                        content: '<p>' + str + '</p>',
                        onOk: () => {

                            var url = "/web/Crm_corp_mgr_post/delCrm_corp_mgr_postById";
                            this.$http.post(url, {
                                post_id: this.tableSelectedPosList[0].post_id
                            }, {
                                headers: {
                                    "content-type": "application/json"
                                }
                            }).then((data) => {
                                if (data.data.b == 1) {
                                    this.$Message.success("岗位删除成功");
                                    this.frushPostList();
                                } else {
                                    this.$errorHandle(data);
                                }
                            });
                        }
                    });
                }
            }, //删除岗位
            show(index) {
                this.currentTab = index;
            },
            //初始化员工列表
            reloadAllUser() {
                this.$http.post("/web/Crm_corp_msg_user/findCrm_corp_msg_userList", {
                    pi: 1,
                    ps: 10
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.userTotal = res.data.page.total;
                        this.userList = res.data.a;
                        this.userPageCurrent = res.data.page.pageIndex;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response)
                });
            },
            //分页
            changeUserPage(c) {
                let _this = this;
                this.$http.post('/web/Crm_corp_msg_user/findCrm_corp_msg_userList', {
                    pi: c,
                    ps: 10
                }, {
                    emulateJSON: true
                }).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.userTotal = res.data.page.total;
                            this.userPageCurrent = res.data.page.pageIndex;
                            this.userList = res.data.a;
                        } else {
                            this.$errorHandle(res);
                        }
                    },
                )
            },

            //设置维度
            changeArea(selectedData, arrayName) {
                this[arrayName] = selectedData;
                console.log(selectedData);
            },
            linkData() {
                if (this.tableSelectedList.length != 1) {
                    this.$Modal.error({
                        content: "绑定维度必选且只能选择一项",
                        title: "错误信息"
                    });
                    return false;
                }

                //维度信息
                let user_id = this.tableSelectedList[0].user_id;
                //区域
                this.findAllDataareaInfo(4, 'areaList', user_id);
                //产品
                this.findAllDataareaInfo(8, 'productList', user_id);
                //行业
                this.findAllDataareaInfo(2, 'industryList', user_id);

                this.areaArr = [];
                this.productArr = [];
                this.industryArr = [];
                this.isDataRange = true;
            },
            shutLinkData() {
                this.isDataRange = false;
            },
            submitLinkData() {
                let arr = this.tableSelectedList.map((item) => {
                    return item.user_id
                });
                // let areaArr = this.areaArr.map((item) => {
                //     return item.dataarea_tree_id
                // });
                // let productArr = this.productArr.map((item) => {
                //     return item.dataarea_tree_id
                // });
                // let industryArr = this.industryArr.map((item) => {
                //     return item.dataarea_tree_id
                // });
                let areaArr = this.$refs.areaList.getCheckedNodes().map((item) => {
                    return item.dataarea_tree_id
                });
                let productArr = this.$refs.productList.getCheckedNodes().map((item) => {
                    return item.dataarea_tree_id
                });
                let industryArr = this.$refs.industryList.getCheckedNodes().map((item) => {
                    return item.dataarea_tree_id
                });

                this.$http.post("/web/Crm_corp_mgr_user_dataarea/addCrm_corp_mgr_user_dataarea", {
                    "user_ids": arr,
                    "areaArr": areaArr,
                    "productArr": productArr,
                    "industryArr": industryArr
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.$Message.success({
                            content: '操作成功',
                            duration: 1,
                            onClose: () => {
                                this.isDataRange = false;
                            }
                        })
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    this.$Message.error({
                        content: '操作失败,原因未知',
                        duration: 1,
                        onClose: () => {
                            this.isDataRange = false;
                        }
                    })
                });
            },

            findAllDataareaInfo(id, ArrayName, user_id) {
                let list1 = [];
                let list = [];
                let arr = [];

                this.$http.post("/web/Crm_corp_mgr_dataarea_tree/findCrm_corp_mgr_dataarea_treeList", {
                    "dataarea_id": id
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        list1 = res.data.a;
                        list1.map(obj => {
                            obj.expand = true;
                        });
                        let idArr = list1.map(obj => obj.dataarea_tree_id);

                        this.$http.post("/web/Crm_corp_msg_user/findUserDataarea", {
                            "dataarea_id": id,
                            "user_id": user_id
                        }, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                arr = res.data.a;
                                arr.map(obj => {
                                    let index = idArr.indexOf(obj);
                                    if (index > -1) {
                                        list1[index].checked = true;
                                    }
                                })
                                list = this.$myFunction.FlatToNested(list1, {
                                    parentField: 'parent_dataarea_tree_id',
                                    idField: 'dataarea_tree_id',
                                    textField: 'dataarea_tree_name'
                                });
                                this[ArrayName] = list;

                            } else {
                                arr = [];
                            }
                        }).catch(function(response) {
                            console.log(response)
                        });


                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },

            findAllpostList() {
                this.$http.post("/web/Crm_corp_mgr_post/findAllpostList", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.positionData = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }
                }).catch(function(response) {
                    console.log(response)
                });
            },

            //查询员工的岗位信息
            findPositionUser(user_id) {
                this.$http.post("/web/Crm_corp_msg_user/findPositionUser", {
                    "user_id": user_id
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.addUserObj.position = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response)
                });

            },
            //获取岗位功能权限
            getPostFuncList() {

                var url = "/web/Crm_corp_mgr_post_func_jurisdiction/getPostFuncAndMethods";
                this.$http.post(url, {
                    post_id: this.posObj.post_id
                }).then(res => {
                    if (res.data.b == 1) {
                        let list = res.data.a;
                        console.log(list);
                        this.allFuncData.map((obj1) => {
                            list.map((obj2) => {
                                if (obj2.func_id == obj1.parent_id && (obj1.meth_code & obj2.meth_codes) && obj1.meth_id != null) {
                                    obj1.checked = true;
                                }
                            })
                        })

                        console.log(JSON.parse(JSON.stringify(this.allFuncData)));
                        this.allFuncData = this.$myFunction.FlatToNested(this.allFuncData);
                    } else {
                        this.$errorHandle(res);
                    }

                });
            },

            uploadError(error, file, fileList) {
                this.$Message.error({
                        content: "文件导入失败",
                        duration: 1,
                    })
                    // console.log(error);
                    // console.log(file);
                    // console.log(fileList);
            },

            uploadSuccess(response, file, fileList) {
                if (response.b == 1) {
                    this.$Message.success({
                        content: file.response.ec,
                        duration: 1,
                    })
                } else {
                    this.$Message.error({
                        content: file.response.ec,
                        duration: 1,
                    })
                }

                console.log(response);
                console.log(file);
                console.log(fileList);
            },

        },

    }
</script>