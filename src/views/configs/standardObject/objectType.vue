
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color"><Icon type="ios-world-outline"></Icon> — </span>
                <span class="main-title-text">市场活动</span></p>
            
        </div>
        <div class="layout-content-main">
            <Row :gutter="24" type="flex">
                <Col span="4">
                <div class="item-block">
                    <div class="item-block-title">商机业务类型
                        <p class="operate" :class="{'active':iseditable}">
                            <Icon type="plus" @click.native="addType"></Icon>
                            <Icon type="trash-a" @click.native="DelType"></Icon>
                            <Icon type="edit" @click.native="editType"></Icon>
                        </p>
                    </div>
                    <div class="api">
                        <Checkbox v-for="(el,index) in typeList" :key="index" v-model="el.isShow">{{el.sales_type_name}}</Checkbox>
                    </div>
                </div>
                </Col>
                <Col span="20">
                        <Table :columns="advanceTableHeader" :data="advanceList"></Table>
                </Col>
               <Row>             
        </div>
        <Modal v-model="isAddType" title="添加/修改类型">
            <Form ref="addType" v-model="addTypeObj" :rules="addTypeObjRule" label-position="left" :label-width="100">
                <Form-item prop="sales_type_name" label="类型名称">
                    <Input v-model="addTypeObj.sales_type_name"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddTypeBlock">取消</Button>
                <Button type="primary" @click="submitAddTypeForm">确定</Button>
            </div>
        </Modal>

         <Modal v-model="isAddAdvence" title="添加/修改进度">
            <Form ref="addType" v-model="addAdvanceObj" :rules="addAdvanceRule" label-position="left" :label-width="100">
                <Form-item prop="sales_type_name" label="进度名称">
                    <Input v-model="addAdvanceObj.sales_advance_name"></Input>
                </Form-item>
                <Form-item prop="sales_type_name" label="所占比重">
                    <Input v-model="addAdvanceObj.sales_advance_proportion"></Input>
                </Form-item>
                 <Form-item prop="sales_type_name" label="节点最大时间">
                    <Input v-model="addAdvanceObj.sales_advance_maxday"></Input>
                </Form-item>
                <Form-item prop="sales_type_name" label="进度状态">
                    <Input v-model="addAdvanceObj.sales_advance_status"></Input>
                </Form-item>
                 <Form-item prop="sales_type_name" label="排列顺序">
                    <Input v-model="addAdvanceObj.sales_advance_index"></Input>
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

    data() {
        return {
            typeList: [{ sales_type_id:1, sales_type_name: '商机类型1', crm_identifier:'smk', sales_state: 1}, { sales_type_id:2, sales_type_name: '商机类型2', crm_identifier:'smk', sales_state: 2},{ sales_type_id:3, sales_type_name: '商机类型3', crm_identifier:'smk', sales_state: 1}],
            typeTableHeader: [{
                title: '类型名称',
                key: 'sales_type_name'
            }, {
                title: '操作',
                key: 'action',
                render: (h, pramas) => {
                    return h('div', [
                         h('Button', {
                            style: {
                                marginRight: '5px'
                            },
                            props: {
                                type: 'primary',
                                icon: 'trash-a',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.getAdvanceList( pramas.row.id);
                                }
                            }
                        }, '商机进度'),
                        h('Button', {
                            props: {
                                type: 'primary',
                                icon: 'edit',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.editType(pramas.index);
                                }
                            }
                        }, '修改'), 
                        h('Button', {
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
                                    this.removeType(pramas.index, pramas.row.id);
                                }
                            }
                        },'删除')
                        
                    ])
                }
            }],//标准业务对象字段表格页头

            advanceList:[{sales_advance_id:1,sales_advance_name:"进度1",sales_advance_proportion:"10%",sales_advance_maxday:"2017.4.7",sales_advance_status:1},{sales_advance_id:1,sales_advance_name:"进度1",sales_advance_proportion:"10%",sales_advance_maxday:"2017.4.7",sales_advance_status:1}],
            advanceTableHeader: [{
                title: '进度名称',
                key: 'sales_advance_name',
            }, {
                title: '所占比重',
                key: 'sales_advance_proportion'
            }, {
                title: '节点最大时间',
                key: 'sales_advance_maxday'
            }, {
                title: '状态',
                key: 'sales_advance_status'
            }, {
                title: '排序',
                key: 'sales_advance_index'
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
                                    this.editType(pramas.index);
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
                                    this.removeType(pramas.index, pramas.row.id);
                                }
                            }
                        }, '删除')
                    ])
                }
            }],//页面布局表格页头部分
            isAddType: false,//是否显示添加/编辑类型弹窗
            isAddAdvence:false,//是否显示添加/编辑进度弹窗
            addTypeObj: {
                sales_type_name:"",
                service_id:"",

            },
            addAdvanceObj: {
                sales_advance_name:"",
                sales_advance_proportion:"",
                 sales_advance_maxday:"",
                  sales_advance_status:"",
                   sales_type_id:"",
                   sales_advance_index:"",
            },
            addTypeRule: {
                sales_type_name: [{
                    required: true,
                    message: '此项为必填项目',
                }, {
                    type: 'string',
                    min: 2,
                    max: 10,
                    message: '长度介于2-8',
                }]
            },
        }
    },
    created() {
        //查询业务实体对象列表（id，name）
        this.$http.post("/web/Crm_corp_mgr_std_sales_type/findCrm_corp_mgr_std_sales_typeList",this.findObject).then((res)=>{
                this.stBusObjs=res.data.a
                    }).catch(function(response) {
                        console.log(response)
                        }
                    );
        this.typeList.map(obj=>{
            obj.isShow=false;
        })
    },

    methods: {
        //***********************************************类型模块************************* */
        editType() {
            this.addTypeObj=this.typeList[index];
            this.isAddType=true;
            console.log(index);
        },
        removeType(index, id) {
            this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除【${this.typeList[index].sales_type_name}】字段`,
                onOk: () => {
                    console.log('删除' + id + '中');
                }
            })
        },
        addType() {
            this.addTypeObj = {
               sales_type_id:4, sales_type_name: '商机类型1', crm_identifier:'smk', sales_state: 1
            };
            this.isAddType=true;
        },
        shutAddTypeBlock() {
            this.isAddType = false;
        },
        submitAddTypeForm() {
            console.log(this.$data.addTypeObj);
            this.$http.post("/web/Crm_corp_mgr_std_sales_type/addCrm_corp_mgr_std_sales_type",this.addTypeObj).then((res)=>{
                                       
                        }).catch(function(response) {
                           console.log(response)
                         }
                     );
            this.isAddType = false;
        },
           //***********************************************进度模块************************* */
        getAdvanceList(value) {
            this.$http.post("/web/Cem_corp_mgr_std_sales_advance/findCem_corp_mgr_std_sales_advanceList",{"service_id":value,"crm_identifier":'smk'}).then((res)=>{
            this.typeList=res.data.a
                }).catch(function(response) {
                    console.log(response)
                    }
                );
        },
        shutAddAdvenceBlock() {
            this.isAddAdvence= false;
        },
        submitAddAdvenceForm() {
            console.log(this.$data.addTypeObj);
            this.$http.post("/web/Crm_corp_mgr_std_sales_type/addCrm_corp_mgr_std_sales_type",this.addTypeObj).then((res)=>{
                                       
                        }).catch(function(response) {
                           console.log(response)
                         }
                     );
            this.isAddAdvence = false;
        },
    }
}
</script>
