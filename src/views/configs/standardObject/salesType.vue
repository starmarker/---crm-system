
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p style="font-size:16px;">
                <Icon type="lock-combination"></Icon> 商机类型管理</p>
        </div>
        <div class="layout-content-main">
            <Row :gutter="24" type="flex">
                <Col span="4">
                <div class="item-block">
                    <div class="item-block-title">商机类型
                        <p class="operate" :class="{'active':iseditable}">
                            <Icon type="plus" @click.native="addType"></Icon>
                            <Icon type="trash-a" @click.native="removeType"></Icon>
                            <Icon type="edit" @click.native="editType"></Icon>
                        </p>
                    </div>
                    <Radio-group v-model="vertical" vertical @on-change="choseType">
                        <Radio :label="index" v-for="(el,index) in typeList" :key="el">
                            <span>{{el.sales_type_name}}</span>
                        </Radio>
                    </Radio-group>
    
                </div>
                </Col>
    
                <Col span="20">
                <div class="item-block">
                    <p class="item-block-title">进度列表
                        <Button type="primary" icon="plus" style="float:right;margin-top:5px;margin-right:10px;" @click="addAdvance">添加进度</Button>
                    </p>
                    <!--进度列表-->
    
                    <Table :columns="advanceTableHeaders" :data="advanceList" style="margin-top:20px;">
    
                    </Table>
                    <Page :total="total" style="float:right;margin-right:20px;margin-top:10px" show-total></Page>
    
                </div>
                </Col>
    
            </Row>
        </div>
    
        <!--添加修改商机类型和进度模态窗口-->
        <Modal v-model="isAddType" title="添加/修改类型">
            <Form ref="addType" :model="addTypeObj" :rules="addTypeRule" label-position="left" :label-width="100">
                <Form-item prop="sales_type_name" label="类型名称">
                    <Input type="text" v-model="addTypeObj.sales_type_name"></Input>
                </Form-item>
                <Form-item label="是否启用">
                    <Radio-group v-model="addTypeObj.sales_state">
                        <Radio label="1">启用</Radio>
                        <Radio label="2">禁用</Radio>
                    </Radio-group>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddTypeBlock">取消</Button>
                <Button type="primary" @click="submitAddTypeForm">确定</Button>
            </div>
        </Modal>
    
        <Modal v-model="isAddAdvence" title="添加/修改进度">
            <Form ref="addAdvence" :model="addAdvanceObj" :rules="addAdvanceRule" label-position="left" :label-width="100">
                <Form-item prop="sales_advance_name" label="进度名称">
                    <Input v-model="addAdvanceObj.sales_advance_name"></Input>
                </Form-item>
                <Form-item prop="sales_advance_proportion" label="所占比重">
                    <Input number v-model="addAdvanceObj.sales_advance_proportion"></Input>
                </Form-item>
                <Form-item prop="sales_advance_maxday" label="节点最大时间">
                    <Input number v-model="addAdvanceObj.sales_advance_maxday"></Input>
                </Form-item>
                <Form-item prop="sales_advance_status" label="进度状态">
                    <Input number v-model="addAdvanceObj.sales_advance_status"></Input>
                </Form-item>
                <Form-item prop="sales_advance_index" label="排列顺序">
                    <Input number v-model="addAdvanceObj.sales_advance_index"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddAdvenceBlock">取消</Button>
                <Button type="primary" @click="submitAddAdvenceForm">确定</Button>
            </div>
        </Modal>
    
    </div>
</template>
<script>
export default {

    data () {
        return {
            typeList: [],
            advanceList: [],
            total: 10,
            vertical: '',
            iseditable: true,
            isAddType: false,//是否显示添加/编辑类型弹窗
            isAddAdvence: false,//是否显示添加/编辑进度弹窗
            addTypeObj: {
                sales_type_id: "",
                sales_type_name: "",
                createtime: "",
                creator: "",
                crm_identifier: "",
                sales_state: "",
            },
            selectedObj: {},
            addAdvanceObj: {
                sales_advance_name: "",
                sales_advance_proportion: "",
                sales_advance_maxday: "",
                sales_advance_status: "",
                sales_type_id: "",
                sales_advance_index: "",
            },
            advanceTableHeaders: [{
                title: '进度名称',
                key: 'sales_advance_name',

            }, {
                title: '所占比重',
                key: 'sales_advance_proportion',

            }, {
                title: '节点最大时间',
                key: 'sales_advance_maxday',


            }, {
                title: '状态',
                key: 'sales_advance_status',

            }, {
                title: '排序',
                key: 'sales_advance_index',

            }, {
                title: '操作',
                key: 'action',
                render: (h, pramas) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                icon: 'edit',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.editAdvance(pramas.index);
                                }
                            }
                        }, '修改'), h('Button', {
                            style: {
                                marginLeft: '5px'
                            },
                            props: {
                                type: 'error',
                                icon: 'trash-a',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.removeAdvance(pramas.index, pramas.row.sales_advance_id);
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            addTypeRule: {
                sales_type_name: [
                    { required: true, type: 'string', min: 2, max: 10, message: '进度名称不能为空且长度介于2-10', trigger: 'blur' }
                ],
            },
            addAdvanceRule: {
                sales_advance_name: [
                    { required: true, message: '此项为必填项目', type: 'string', min: 2, max: 10, message: '进度名称不能为空且长度介于2-10', trigger: 'blur' }
                ],
                sales_advance_proportion: [
                    { required: true, type: 'number', message: '所占比重不能为空且必须为数字', trigger: 'blur' }
                ],
                sales_advance_maxday: [
                    { required: true, type: 'number', message: '节点最大时间不能为空且必须为数字', trigger: 'blur' }
                ],
                sales_advance_status:[{ type: 'number', message: '必须为数字', trigger: 'blur' }],
                sales_advance_index: [
                    { type: 'number', message: '必须为数字', trigger: 'blur' }
                ]
            },
        }
    },
    computed: {

    },
    created () {
        this.getTypeList();
    },
    methods: {
        //***********************************************类型模块************************* */
        getTypeList () {
            this.$http.post("/web/Crm_corp_mgr_std_sales_type/findCrm_corp_mgr_std_sales_typeList", { ps: 10 }, { emulateJSON: true }).then((res) => {
                if (res.data.b == 1) {
                    this.typeList = res.data.a;
                    this.selectedObj = res.data.a[0];
                    this.getAdvanceList();
                } else {
                }
            }).catch(function (response) {
                console.log(response)
            }
                );
        },
        addType () {
            this.addTypeObj = {
                sales_type_id: "",
                sales_type_name: '',
                crm_identifier: '',
                sales_state: 1
            };
            this.isAddType = true;
        },
        editType () {
            this.addTypeObj = this.selectedObj;
            this.isAddType = true;
        },
        removeType () {
            this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除【${this.selectedObj.sales_type_name}】类型`,
                onOk: () => {
                    console.log('删除' + this.selectedObj.sales_type_id + '中');
                    this.$http.post("/web/Crm_corp_mgr_std_sales_type/delCrm_corp_mgr_std_sales_typeById", { sales_type_id: this.selectedObj.sales_type_id }).then((res) => {
                        if (res.data.b = 1) {
                            this.getTypeList();
                        }
                    }).catch(function (response) {
                        console.log(response)
                    }
                        );
                }
            })
        },
        shutAddTypeBlock () {
            //this.$refs[name].resetFields();
            this.isAddType = false;
        },
        submitAddTypeForm () {
            console.log(this.addTypeObj.sales_type_name);
            console.log(this.addTypeRule.sales_type_name);
            this.$refs.addType.validate((valid) => {
                console.log(valid);
                if (valid) {
                    var url = "/web/Crm_corp_mgr_std_sales_type/addCrm_corp_mgr_std_sales_type";
                    if (this.addTypeObj.sales_type_id != "") {
                        url = "/web/Crm_corp_mgr_std_sales_type/updateCrm_corp_mgr_std_sales_type";
                    }
                    this.$http.post(url, this.addTypeObj).then((res) => {
                        if (res.data.b) {
                            this.$Message.success("保存成功");
                            //this.getTypeList();
                            this.isAddType = false;
                        }
                    }).catch(function (response) {
                        console.log(response)
                    }
                        );

                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        //***********************************************进度模块************************* */

        choseType (value) {
            this.selectedObj = this.typeList[value];
            this.getAdvanceList();
        },
        getAdvanceList () {
            this.$http.post("/web/Cem_corp_mgr_std_sales_advance/findCem_corp_mgr_std_sales_advanceList", { sales_type_id: this.selectedObj.sales_type_id }).then((res) => {
                this.advanceList = res.data.a
                this.total = res.data.page.total;
            }).catch(function (response) {
                console.log(response)
            }
                );
        },
        addAdvance () {
            this.addAdvanceObj = {
                sales_advance_id: "",
                sales_advance_name: "",
                sales_advance_proportion: "",
                sales_advance_maxday: "",
                sales_advance_status: "",
                sales_type_id: this.selectedObj.sales_type_id,
                sales_advance_index: ""
            }
            this.isAddAdvence = true;
        },
        editAdvance (index) {
            this.addAdvanceObj = this.advanceList[index];
            this.isAddAdvence = true;
        },
        removeAdvance (index, id) {
            this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除【${this.advanceList[index].sales_advance_name}】类型`,
                onOk: () => {
                    this.$http.post("/web/Cem_corp_mgr_std_sales_advance/delCem_corp_mgr_std_sales_advanceById", { sales_advance_id: id }).then((res) => {
                        if (res.data.b) {
                            this.getAdvanceList();
                        }
                    }).catch(function (response) {
                        console.log(response)
                    }
                        );
                }
            })
        },
        shutAddAdvenceBlock () {
            this.isAddAdvence = false;
        },
        submitAddAdvenceForm () {
            var url = "/web/Cem_corp_mgr_std_sales_advance/addCem_corp_mgr_std_sales_advance";
            if (this.addAdvanceObj.sales_advance_id != "") {
                url = "/web/Cem_corp_mgr_std_sales_advance/updateCem_corp_mgr_std_sales_advance";
            }
            this.$refs.addAdvence.validate((valid) => {
                if (valid) {
                    this.$http.post(url, this.addAdvanceObj).then((res) => {
                        if (res.data.b) {
                            this.$Message.success("保存成功");
                            this.getAdvanceList();
                            this.isAddAdvence = false;
                        }
                    }).catch((res)=>{
                        console.log(res)
                    }
                        );
                    
                }
            })

        },
    }
}
</script>
