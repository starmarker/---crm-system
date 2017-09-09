
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p style="font-size:16px;">
                <Icon type="ios-pie"></Icon> 标准业务对象
            </p>
        </div>
        <div class="layout-content-main">
            <div class="item-block">
                <div class="item-block-title" style="border-bottom:none;">
                    已选择:
                    <Select style="width:200px;" @on-change="getFields">
                        <Option v-for="(el,index) in stBusObjs" :key="el.id" :value="el.id">{{el.name}}</Option>
                    </Select>
                    <p style="float:right;margin-right:10px;">
                        <Button type="primary" icon="plus" @click="addField">添加字段</Button>
                    </p>
                </div>
                <Tabs value="fields">
                    <!--字段列表-->
                    <Tab-pane label="字段列表" name="fields">
                        <Table :columns="fieldTableHeader" :data="fieldsList"></Table>
                    </Tab-pane>
                    <!--页面布局-->
                    <Tab-pane label="页面布局" name="layout">
                        <Table :columns="layoutTableHeader" :data="fieldsList"></Table>
                    </Tab-pane>
                </Tabs>
            </div>
        </div>
        <Modal v-model="isAddField" title="添加/修改字段">
            <Form ref="addField" v-model="addFieldObj" :rules="addFieldObjRule" label-position="left" :label-width="100">
                <Form-item prop="field_name" label="字段名称">
                    <Input v-model="addFieldObj.field_name"></Input>
                </Form-item>
                <Form-item prop="field_code" label="字段代码">
                    <Input v-model="addFieldObj.field_code"></Input>
                </Form-item>
                <Form-item prop="field_type" label="字段类型">
                    <Input v-model="addFieldObj.field_type"></Input>
                </Form-item>
                <Form-item prop="field_length" label="字段长度">
                    <Input v-model="addFieldObj.field_length"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddFieldBlock">取消</Button>
                <Button type="primary" @click="submitAddFieldForm">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {

    data() {
        return {
            stBusObjs: [{ name: '客户', id: 1 }, { name: '联系人', id: 2 }, { name: '线索', id: 3 }],//标准业务对象列表，异步获取
            fieldTableHeader: [{
                title: '字段名称',
                key: 'field_name'
            }, {
                title: '字段代码',
                key: 'field_code'
            }, {
                title: '字段类型',
                key: 'field_type'
            }, {
                title: '字段属性',
                key: 'field_attr',
                render: (h, pramas) => {
                    return h('span', {}, this.$myFunction.arrayToValue(this.field_attr_list, pramas.row.field_attr, 'id', 'name'))
                    //注意这里的全局方法arrayToValue(this.field_attr_list,pramas.row.field_attr,'id','name')，这个方法带四个参数，第一个参数是JSON数组，第二个参数是值，第三个参数是值对应的key，第四个参数是返回的对应key.在这里，我们是从data的field_attr_list数组中找到id（第三个参数值）为xx（第二个参数的值），并返回它的name（四个参数）的值
                }
            }, {
                title: '字段状态',
                key: 'field_status'
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
                                    this.editField(pramas.index);
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
                                    this.removeField(pramas.index, pramas.row.id);
                                }
                            }
                        }, '删除')
                    ])
                }
            }],//标准业务对象字段表格页头
            fieldsList: [{ field_name: '客户姓名', field_code: 'client_name', field_type: 1, field_attr: 1, field_status: 1, id: 2, isShow: true, isrequired: true, isUsually: true }, { field_name: '客户电话', field_code: 'client_phone', field_type: 1, field_attr: 1, field_status: 1, id: 3, isShow: false, isrequired: false, isUsually: true }, { field_name: '客户年龄', field_code: 'client_age', field_type: 2, field_attr: 2, field_status: 2, id: 5, isShow: true, isrequired: false, isUsually: false }],//标准业务对象，需要异步获取
            field_attr_list: [{ id: 1, name: '系统标准' }, { id: 2, name: '自定义' }],//字段属性常量，可以提取到常量中
            layoutTableHeader: [{
                title: '字段名称',
                key: 'field_name',
            }, {
                title: '字段类型',
                key: 'field_type'
            }, {
                title: '是否显示',
                key: 'isShow',
                render: (h, pramas) => {
                    return h('Checkbox', {
                        props: {
                            value: pramas.row.isShow
                        },
                        on: {
                            'on-change': (res) => {
                                console.log(pramas.row.id + '状态为:' + res);
                            }
                        }
                    }, "显示")
                }
            }, {
                title: '',
                key: 'action',
                render: (h, pramas) => {
                    return h('div', [
                        h('Checkbox', {
                            props: {
                                value: pramas.row.isrequired
                            },
                            on: {
                                'on-change': (res) => {
                                    console.log(pramas.row.id + '状态为:' + res);
                                }
                            }
                        }, '必填'),
                        h('Checkbox', {
                            props: {
                                value: pramas.row.isUsually
                            },
                            on: {
                                'on-change': (res) => {
                                    console.log(pramas.row.id + '状态为:' + res);
                                }
                            }
                        }, '常用')
                    ]);
                }
            }],//页面布局表格页头部分
            isAddField: false,//是否显示添加/编辑弹窗
            addFieldObj: {},
            addFieldObjRule: {
                field_name: [{
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
        // this.$http.post("/getInfo",{}).then((res)=>{
        //     console.log(res)
        // },(reject)=>{console.log(reject)}).catch((error)=>{console.log(error)});
    },

    methods: {
        getFields(value) {
            //console.log(value);
            if (value) {
                console.log(value);//异步获取标准业务对象的字段和页面布局
            }
        },
        editField(index) {
            this.addFieldObj=this.fieldsList[index];
            this.isAddField=true;
            console.log(index);
        },
        removeField(index, id) {
            this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除【${this.fieldsList[index].field_name}】字段`,
                onOk: () => {
                    console.log('删除' + id + '中');
                }
            })
        },
        addField() {
            this.addFieldObj = {
                field_name: '', field_code: '', field_type: 1, field_length:0,field_default:''
            };
            this.isAddField=true;
        },
        shutAddFieldBlock() {
            this.isAddField = false;
        },
        submitAddFieldForm() {
            console.log(this.$data.addFieldObj);
            console.log("提交表单，成功后关闭");
            this.isAddField = false;
        }
    }
}
</script>
