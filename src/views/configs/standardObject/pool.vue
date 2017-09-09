
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p style="font-size:16px;">
                <Icon type="lock-combination"></Icon> 公海池管理</p>
        </div>
        <div class="layout-content-main">
            <Row :gutter="24" type="flex">
                <Col span="4">
                <div class="item-block">
                    <div class="item-block-title">公海池
                    </div>
                     <Radio-group v-model="vertical" vertical @on-change="labers">
                        <Radio :label="index"  v-for="(el,index) in stBusObjs" :key="index">
                            <span>{{el.name}}</span>
                        </Radio>
                    </Radio-group>
                 
                </div>
                </Col>
                <!--部门用户编辑-->
                <Col span="20" v-if="showUsers==1">
                <div class="item-block">
                    <Tabs value="fields">
                    <!--字段列表-->
                    <Tab-pane label="字段列表" name="fields" >
                        <Table :columns="fieldTableHeaders" :data="fieldsList" show-header :height="tableHeight">
                            <div slot="header">
                                <Button type="primary" icon="plus" style="float:right;margin-top:10px;margin-right:10px;" @click="addField">添加字段</Button>
                            </div>                            
                        </Table>
                        <Page :total="total" style="float:right;margin-right:20px;margin-top:10px" show-total @on-change="getTotal"></Page>

                    </Tab-pane>
                    
                    <!--页面布局-->
                    <Tab-pane label="页面布局" name="layout">
                        <!--<Table :columns="layoutTableHeader" :data="fieldsList"></Table>-->
                        <Table :columns="layoutTitles" :data="layoutList" show-header :height="tableHeight"> 
                            <div slot="header">
                                <Button type="primary" icon="plus" style="float:right;margin-top:10px;margin-right:10px;" @click="addLayout">添加布局</Button>
                            </div>
                        </Table>
                        <Page :total="layour_total" style="float:right;margin-right:20px;margin-top:10px" show-total @on-change="getLayourTotal"></Page>
                    </Tab-pane>
                </Tabs>
                </div>
                </Col>
                
            </Row>
        </div>
        <!--编辑页面布局弹出层-->
    <Modal v-model="isAddLayout" title="添加/编辑页面布局">
        <Form ref="addField" :model="addLayourMessag"  :rules="addLayourYzMessag" label-position="left" :label-width="80">
                <Form-item label="布局名称" prop="layout_name">
                    <Input v-model="addLayourMessag.layout_name"></Input>
                </Form-item>
        </Form>
        <Transfer
            :data="AllfieldsList"
            :target-keys="targetKeys"
            @on-change="createArray"
            :titles="['所有字段','布局展示字段']"></Transfer>
            <div slot="footer">
                <Button @click="shutAddFieldBlock">取消</Button>
                <Button type="primary" @click="addLayourMessagea">确定</Button>
            </div>
    <!--添加字段-->
    </Modal>   
          <Modal v-model="isAddField" title="添加/修改字段" class="diy-box">
            <Form ref="addField" :model="addFieldObj" :rules="addFieldObjRule" label-position="left" :label-width="100">
                <Form-item label="字段名称" prop="ser_opt_name_show">
                    <Input v-model="addFieldObj.ser_opt_name_show"></Input>
                </Form-item>
                <Form-item label="字段代码" prop="ser_opt_name_db">
                    <Input v-model="addFieldObj.ser_opt_name_db" ></Input>
                </Form-item>
                <Form-item prop="ser_opt_type" label="字段类型">                   
                    <Select v-model="addFieldObj.ser_opt_type" style="width:200px">
                            <Option v-for="item in optionList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                
                <Form-item prop="ser_opt_length" label="字段长度">
                    <Input v-model="addFieldObj.ser_opt_length" number></Input>
                </Form-item>
                <Form-item prop="ser_opt_isnull" label="是否必填">
                    <Select v-model="addFieldObj.ser_opt_isnull" style="width:200px">
                            <Option v-for="item in isAddList"  :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="选择项目" v-if="addFieldObj.ser_opt_type==8||addFieldObj.ser_opt_type==9"> 
                  <Button type="primary" icon="plus" @click.native="addExtend"></Button>
                 
                    <Input v-for="(item,index) in addFieldObj.selectExtends" v-model="addFieldObj.selectExtends[index]" :key="index" style="margin-top:10px">
                    <Button slot="append" @click.native="delExtend(index)" style="color:red"><Icon type="trash-b"></Icon> 删除</Button>
                    </Input>
                   
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddFieldBlock">取消</Button>
                <Button type="primary" @click="submitAddFieldForm">确定</Button>
            </div>
        </Modal>
        <!--添加业务实体-->
        <Modal v-model="isaddLayourMessagel" title="添加/修改字段" class="diy-box">
            <Form ref="addField" v-model="serviceMessag"  label-position="left" :label-width="100">
                <Form-item label="业务实体名称">
                    <Input v-model="serviceMessag.service_name_show"></Input>
                </Form-item>
                <Form-item label="实体字段名称">
                    <Input v-model="serviceMessag.service_name_db"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddFieldBlock">取消</Button>
                <Button type="primary" @click="addServiceMessage">确定</Button>
            </div>
        </Modal>
        <!--绑定岗位-->
        <Modal v-model="isaddPost" title="添加/修改岗位" class="diy-box">
         
                <Select v-model="postObjList" multiple filterable>
                    <Option-group :label="el.dept_name" v-for="(el,index) in postObj" :key="el">
                        <Option v-for="item in el.post_name" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Option-group>
                </Select>
            <div slot="footer">
                <Button @click="shutAddFieldBlock">取消</Button>
                <Button type="primary" @click="addPostMessage">确定</Button>
            </div>
        </Modal>
        <!--绑定维度-->
        <Modal v-model="isaddBinding" title="添加/修改维度" class="diy-box">
               <Select v-model="bindingObjList" multiple filterable>
                        <Option v-for="(el,index) in bindingObj" :value="el.value" :key="el">{{ el.label }}</Option>
                </Select>
            <div slot="footer">
                <Button @click="shutAddFieldBlock">取消</Button>
                <Button type="primary" @click="addBindingMessage">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {

    data() {
        const pwd2 = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("密码不能为空"))
            } else if (value !== this.pwdObj.pwd) {
                callback(new Error("两次密码不相等"))
            } else {
                callback()
            }
        };
        return {
            bindingObj:[],//维度
            bindingObjList:[],//维度集合
            postObj:[],//岗位
            postObjList:[],//岗位
            postList:[],
            total:0,
            service_id:"",
            stBusObjs: [],
            vertical: '',
            self: this,
            showUsers: 1,//显示类型，1为显示部门用户，2为显示部门岗位，3为编辑岗位权限
            baseData: [],//默认部门列表
            iseditable: true,
            selectedObj: {},//选中的部门
            checkedNodes: [],//被勾选的部门列表
            isAddDepart: false,//部门添加修改弹窗
            isAddField:false,
            isAddUser: false,//用户修改添加页面
            isResetPwd: false,//密码重置弹出窗
            isAddPos: false,//岗位编辑弹窗状态
            isaddLayourMessagel:false,
            isaddPost:false,//岗位
            isaddBinding:false,//维度
            fieldsList: [],//标准业务对象，需要异步获取
            serviceMessag:{
                service_id:"",
                service_name_db:"",
                service_name_show:"",
            },
            addFieldObj: {
                ser_opt_name_show:"",//字段显示名称
                ser_opt_name_db:"",//字段数据库名
                ser_opt_type:"",//字段类型
                ser_opt_length:"",//字段长度
                ser_opt_isnull:"",//是否必填
                service_id:"",
                ser_opt_id:"",
                selectExtends:[],
            },
            //是否必填选项
            isAddList:[{
                 value: 1,
                 label: '是'
            },{
                 value: 2,
                 label: '否'
            }],
            optionList:[{
                 
                        value: 1,
                        label: '整数'
                    },
                    {
                        value: 2,
                        label: '实数'
                    },
                    {
                        value: 3,
                        label: '文本'
                    },{
                 
                        value: 4,
                        label: '文本域'
                    },
                    {
                        value: 5,
                        label: '邮件'
                    },
                    {
                        value: 6,
                        label: '网址'
                    },{
                 
                        value: 7,
                        label: '电话'
                    },
                    {
                        value: 8,
                        label: '单选'
                    },
                    {
                        value: 9,
                        label: '多选'
                    },{
                        value:10,
                        label:'日期'
                    }],
            layoutTableHeader: [{
                title: '字段名称',
                key: 'field_name',
            }, {
                title: '字段类型',
                key: 'field_type',
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
            fieldtypeList:['','整数','实数','文本','文本域','邮件','网址','电话','单选','多选','时间'],
            fieldTableHeaders: [{
                title: '字段名称',
                key: 'ser_opt_name_show'
            }, {
                title: '字段代码',
                key: 'ser_opt_name_db'
            }, {
                title: '字段类型',
                key: 'ser_opt_type',
                render:(h,p)=>{
                    let text=this.fieldtypeList[p.row.ser_opt_type];
                    return h('span',{},text);
                }
            },{
                title: '字段长度',
                key: 'ser_opt_length'
            }, {
                title: '是否必填',
                key: 'ser_opt_isnull',
                render(h,p){
                    let text=p.row.ser_opt_isnull==1?'是':'否';
                    return h('span',{},text);
                }
            },{
                title: '是否显示',
                key: 'ser_opt_isshow',
                render:(h,p)=>{
                    let result=Boolean(p.row.ser_opt_isshow);
                    return h('Checkbox',{
                        props:{
                            value:result
                        },
                        on:{
                            'on-change':()=>{
                                result=!result;
                                this.changeState(result,p.index);
                            }
                        }
                    },'显示')
                }
            }, {
                title: '操作',
                key: 'action',
                width:100,
                render: (h, pramas) => {
                    
                    if(pramas.row.ser_opt_standard!==1){
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
                        }, '修改')
                    ])
                }else{
                    return h('span',{},'');
                }
                }
            }],
            layoutTitles:[{
                title:'布局名称',
                key:'layout_name',
                width:250
            },{
                title:'绑定岗位',
                key:'layout_position',
                render:(h,p)=>{
                    return h('div',p.row.layout_position);
                }
            },{
                title:'操作',
                key:'action',
                width:200,
                render:(h,p)=>{
                    return h('div',[
                        h('Button',{
                            props:{
                                type:'primary',
                                size:'small',
                            },
                            on:{
                                click:()=>{
                                    this.updateLayour(p.index);
                                }
                            }
                        },'编辑'),h('Button',{
                            style:{
                                marginLeft:'5px'
                            },
                            props:{
                                type:'error',
                                size:'small',
                            },
                            on:{
                                click:()=>{
                                    this.delLayout(p.index);
                                }
                            }
                        },'删除'),h('Button',{
                            style:{
                                marginLeft:'5px'
                            },
                            props:{
                                type:'success',
                                size:'small',
                            },
                            on:{
                                click:()=>{
                                    this.setLayout(p.index);
                                }
                            }
                        },'绑定'),
                    ])
                }
            }],
            layoutList:[{
                id:1,
                layout_name:'布局1',
                layout_position:['ui设计师','Java工程师'],
            }],
           
            
            tableSelectedList: [],//用户表格中被选中的用户列表
            
        
           
           
    
            tableSelectedPosList: [{ name: "UI设计师", id: 2, depart_id: 3 }],//岗位列表已被选中的岗位
            
           
            fieldTableHeader:[{
                title:'字段名',
                key:'name'
            },{
                title:'字段权限',
                key:'action',
                render:(h,params)=>{
                    let self=this;
                    return h('div',[h('Checkbox',{
                        props:{
                            value:params.row.isShow
                        },
                        on:{
                            'on-change':(res)=>{
                                this.busObjs[params.index].isShow=res;
                            }
                        }
                    },'可见'),h('Checkbox',{
                        props:{
                            value:params.row.readonly
                        },
                        on:{
                            'on-change':(res)=>{
                               this.busObjs[params.index].readonly=res; 
                            }
                        }
                        },'只读')])
                }
            }],//字段权限，业务对象字段列表的渲染方式，这里渲染了两个checkbox组件，同步data中的值
            isAddLayout:false,//添加/修改布局弹出框是否显示
            targetKeys:[],//穿梭框
            service_id:"",
            type:1,
            layout_id:"",
            index:"",
            layour_total:0,
            state:0,
            AllfieldsList:[],
            updateFileIndex:"",
            //添加布局
            addLayourMessag:{
                layout_name:"",
                service_id:"",
                layout_id:"",
            },
            //验证布局
            addLayourYzMessag:{
                layout_name:[{
                        type:'string',
                        required:true,
                        message:'字段名不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:10,
                        message:'字段名称介于1-15个字符之间',
                        trigger:'blur'
                        }],
            },
            //验证字段添加
            addFieldObjRule:{
                ser_opt_name_show:[{
                        type:'string',
                        required:true,
                        message:'字段名不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:10,
                        message:'字段名称介于1-15个字符之间',
                        trigger:'blur'
                        }
                    ],
                    ser_opt_name_db:[{
                        type:'string',
                        required:true,
                        message:'字段代码名不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:20,
                        message:'字段代码名介于1-20个字符之间',
                        trigger:'blur'
                        }
                    ],
                    ser_opt_type:[{
                        required:true,
                         type:'number',
                        message:'字段类型不能为空',
                        trigger:'change'
                        }
                    ],
                    ser_opt_length:[{
                        required:true,
                        type:'number',
                        message:'字段长度不能为空且只能为数字',
                        trigger:'blur'
                        
                        }
                    ],
                    ser_opt_isnull:[{
                        required:true,
                        type:'number',
                        message:'是否必填不能为空',
                        trigger:'change'
                        }
                    ],
            },
        }
    },
    computed: {
        tableHeight(){
        let cHeight=document.body.clientHeight;
        return (cHeight-330);
        }
       
    },
    //components: { Users: Users },
    created() {
        //查询公海池列表
        this.$http.post("/web/Crm_corp_mgr_service_pool/findCrm_corp_mgr_service_poolList",{ps:100}).then((res)=>{
            if(res.data.b==1){
                this.stBusObjs=res.data.a;
                this.service_id=this.stBusObjs[0].id;
                this.selectAllLayour();
                //根据id查询字段列表
                this.getFields(this.stBusObjs[0].id);
                //根据id查询布局列表
                this.getLayour(this.stBusObjs[0].id);
                this.index=0;
            }else{

            }
         }).catch(function(response) {
                    console.log(response)
                 }
        );
       
    },

    methods: {
        // 改变显示状态
        changeState(status,index){
            //console.log(status);
            let state=Number(status);
            //修改显示状态
            this.$http.post("/web/Crm_corp_mgr_service_pool/updateCrm_corp_mgr_service_optionIsShow",{ser_opt_isshow:state,ser_opt_id:this.fieldsList[index].ser_opt_id}).then((res)=>{
                    if(res.data.b==1){
                         this.$Message.success('操作成功');
                         if(state==1){
                             this.fieldsList[index].ser_opt_isshow=0;
                         }else{
                             this.fieldsList[index].ser_opt_isshow=1;
                         }
                    }else{

                    }  
                    }).catch(function(response) {
                            console.log(response)
                        }
                );
        },
        //添加绑定维度
        addBindingMessage(){
             let obj={key:this.bindingObjList,service_id:this.service_id};
             this.$http.post("/web/Crm_corp_mgr_layout/addDataareaMessageList",obj).then((res)=>{
                    if(res.data.b==1){
                         this.$Message.success('操作成功');
                         this.isaddBinding=false;
                    }else{

                    }  
                    }).catch(function(response) {
                            console.log(response)
                        }
                );
        },
        //业务实体绑定维度窗口
        binding(){
              this.bindingObjList=[];
               //查询绑定维度
               this.$http.post("/web/Crm_corp_mgr_layout/findDataareaMessageList",{service_id:this.service_id}).then((res)=>{
                    if(res.data.b==1){
                         this.bindingObj=res.data.a;
                         this.isaddBinding=true;
                    }else{

                    }  
                    }).catch(function(response) {
                            console.log(response)
                        }
                );
               //查询已绑定的维度
               this.$http.post("/web/Crm_corp_mgr_layout/findBindingDataareaMessageList",{service_id:this.service_id}).then((res)=>{
                    if(res.data.b==1){
                         this.bindingObjList=res.data.a;
                    }else{

                    }  
                    }).catch(function(response) {
                            console.log(response)
                        }
                );
              
        },
        //绑定岗位
        addPostMessage(){
             let obj={key:this.postObjList,layout_id:this.layoutList[this.index].layout_id};
             this.$http.post("/web/Crm_corp_mgr_layout/addPostMessage",obj).then((res)=>{
                    if(res.data.b==1){
                        this.$http.post("/web/Crm_corp_mgr_layout/findCrm_corp_mgr_layoutList",{ps:10,service_id:this.service_id}).then((res)=>{
                            if(res.data.b==1){
                                  this.layoutList=res.data.a;
                                 this.$Message.success('操作成功');
                                 this.isaddPost=false;
                            }else{

                            }
                            
                            }).catch(function(response) {
                                    console.log(response)
                                }
                            );
                        
                    }else{

                    }  
                    }).catch(function(response) {
                            console.log(response)
                        }
                    );
        },
        //添加业务实体
        addServiceMessage(){
            if(this.state==0){//添加
               this.$http.post("/web/Crm_corp_mgr_service/addCrm_corp_mgr_service",this.serviceMessag).then((res)=>{
                    if(res.data.b==1){
                         this.$http.post("/web/Crm_corp_mgr_service/findCrm_corp_mgr_serviceList",{ps:100}).then((res)=>{
                            if(res.data.b==1){
                                 this.stBusObjs=res.data.a;
                                 this.$Message.success('操作成功');
                                 this.isaddLayourMessagel=false;
                            }else{

                            }
                        }).catch(function(response) {
                                    console.log(response)
                                }
                        );
                       

                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            }else{
                this.$http.post("/web/Crm_corp_mgr_service/updateCrm_corp_mgr_service",this.serviceMessag).then((res)=>{
                    if(res.data.b==1){
                        this.$Message.success('操作成功');
                        this.stBusObjs[this.index].name=this.serviceMessag.service_name_show;
                        this.isaddLayourMessagel=false;
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            }
             
        },
        //添加页面布局基本信息
        addAllLayourMessage(){
            this.addLayourMessag.service_id=this.service_id;
            if(this.state==0){//添加
                    this.$http.post("/web/Crm_corp_mgr_layout/addCrm_corp_mgr_layout",this.addLayourMessag).then((res)=>{
                    if(res.data.b==1){
                        this.$Message.success('操作成功');
                        this.isaddLayourMessagel=false;
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            }else{//修改
                    this.$http.post("/web/Crm_corp_mgr_layout/updateCrm_corp_mgr_layout",this.addLayourMessag).then((res)=>{
                    if(res.data.b==1){
                        this.$Message.success('操作成功');
                        this.isAddLayout=false;
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            }
           
        },
        //显示添加布局窗口
        addLayoutMessages(){
             this.isaddLayourMessagel=true;
        },
        //添加布局
        addLayourMessagea(){
            if(this.state==0){
                    let obj={key:this.targetKeys,service_id:this.service_id,layout_name:this.addLayourMessag.layout_name};
                    this.$http.post("/web/Crm_corp_mgr_service_pool/addCrm_corp_mgr_layout",obj).then((res)=>{
                    if(res.data.b==1){
                         this.$http.post("/web/Crm_corp_mgr_service_pool/findCrm_corp_mgr_layoutList",{ps:10,service_id:this.service_id}).then((res)=>{
                            if(res.data.b==1){
                                  this.layoutList=res.data.a;
                                  this.$Message.success('操作成功');
                                  this.isAddLayout=false;
                            }else{

                            }
                            
                        }).catch(function(response) {
                                console.log(response)
                            }
                        );
                      
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            }else{
                    let obj={key:this.targetKeys,service_id:this.service_id,layout_name:this.addLayourMessag.layout_name,layout_id:this.addLayourMessag.layout_id};
                    this.$http.post("/web/Crm_corp_mgr_layout/updateCrm_corp_mgr_layout",obj).then((res)=>{
                    if(res.data.b==1){
                        this.$http.post("/web/Crm_corp_mgr_layout/findCrm_corp_mgr_layoutList",{ps:10,service_id:this.service_id}).then((res)=>{
                            if(res.data.b==1){
                                  this.layoutList=res.data.a;
                                  this.$Message.success('操作成功');
                                  this.isAddLayout=false;
                            }else{

                            }
                            
                            }).catch(function(response) {
                                    console.log(response)
                                }
                            );
                        
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            }
            
        },
        //分页查询布局
        getLayourTotal(page){
            let data1={ps:10,pi:page,service_id:this.service_id};
            this.$http.post("/web/Crm_corp_mgr_layout/findCrm_corp_mgr_layoutList",data1).then((res)=>{
                if(res.data.b==1){
                    this.layoutList=res.data.a;
                }else{

                }
                
            }).catch(function(response) {
                    console.log(response)
                 }
            );
        },
        //查询布局
        getLayour(value){
            this.service_id=value;
            let data1={ps:10,service_id:this.service_id};
            this.$http.post("/web/Crm_corp_mgr_service_pool/findCrm_corp_mgr_layoutList",data1).then((res)=>{
                if(res.data.b==1){
                    this.layoutList=res.data.a;
                    this.layour_total=res.data.page.total;
                }else{

                }
                
            }).catch(function(response) {
                    console.log(response)
                 }
            );
        },
        //分页
        getTotal(page){
            
            let data1={ps:10,pi:page,service_id:this.service_id};
            this.$http.post("/web/Crm_corp_mgr_service_pool/findCrm_corp_mgr_service_option_poolList",data1).then((res)=>{
                if(res.data.b==1){
                    this.fieldsList=res.data.a;
                }else{

                }
                
            }).catch(function(response) {
                    console.log(response)
                 }
            );
        },
        //添加字段
        addField(){
            this.addFieldObj.ser_opt_name_show="";
            this.addFieldObj.ser_opt_name_db="";
            this.addFieldObj.ser_opt_type="";
            this.addFieldObj.ser_opt_length="";
            this.addFieldObj.ser_opt_isnull="";
            this.model1='';
            this.model2='';
            if(this.service_id==""){
                alert("请先选择对应的业务实体");
            }else{
                this.isAddField=true;
            }
        },
        removeField(index, id) {
             this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除【${this.fieldsList[index].ser_opt_name_db}】字段`,
                onOk: () => {
                     this.$http.post("/web/Crm_corp_mgr_service_option/delCrm_corp_mgr_service_optionById",{ser_opt_id:this.fieldsList[index].ser_opt_id}).then((res)=>{
                        if(res.data.b==1){
                           this.$http.post("/web/Crm_corp_mgr_service_option/findCrm_corp_mgr_service_optionList",{service_id:this.service_id,ps:10}).then((res)=>{
                            if(res.data.b==1){
                                this.fieldsList=res.data.a;
                                this.$Message.success('操作成功');
                            }else{

                            }
                            }).catch(function(response) {
                                    console.log(response)
                                }
                            );
                           
                        }else{
                            alert("异常");
                        }
                    }).catch(function(response) {
                            console.log(response)
                        }
                    );
                }
            })
        },
        editField(index) {
            this.updateFileIndex=index;
            this.type=2;
            this.addFieldObj.ser_opt_name_show=this.fieldsList[index].ser_opt_name_show;
            this.addFieldObj.ser_opt_name_db=this.fieldsList[index].ser_opt_name_db;
            this.addFieldObj.ser_opt_type=this.fieldsList[index].ser_opt_type;
            this.addFieldObj.ser_opt_length=this.fieldsList[index].ser_opt_length;
            this.addFieldObj.ser_opt_isnull=this.fieldsList[index].ser_opt_isnull;
            this.addFieldObj.service_id=this.fieldsList[index].service_id;
            this.addFieldObj.ser_opt_id=this.fieldsList[index].ser_opt_id;
            //根据id查询单选或多选集合
            this.$http.post("/web/Crm_corp_mgr_service_option/findOptionExtend",{ser_opt_id:this.fieldsList[index].ser_opt_id}).then((res)=>{
                 if(res.data.b==1){
                    this.addFieldObj.selectExtends=res.data.a;
                    this.isAddField=true;
                      //alert(arr);
                 }else{
                     alert("异常");
                 }
            }).catch(function(response) {
                    console.log(response)
                 }
            );
        },
        labers(index){
            this.index=index;
            this.getFields(this.stBusObjs[index].id);
            this.selectAllLayour();
            this.getLayour(this.stBusObjs[index].id);
        },
        //查询对应业务实体字段列表
        getFields(value) {
            this.service_id=value;
            let data1={ps:10,service_id:this.service_id};
            this.$http.post("/web/Crm_corp_mgr_service_pool/findCrm_corp_mgr_service_option_poolList",data1).then((res)=>{
                if(res.data.b==1){
                    res.data.a.map(obj=>{
                        obj.label=obj.ser_opt_name_show;
                        obj.key=obj.ser_opt_id;
                    })
                    this.fieldsList=res.data.a;
                     this.total=res.data.page.total;
                    console.log(this.fieldsList);
                }else{

                }
                
            }).catch(function(response) {
                    console.log(response)
                 }
            );
        },
        addExtend(){
            //let arr=this.addFieldObj.selectExtends;
            this.addFieldObj.selectExtends.push("");
        },
       delExtend(index){
            
            this.addFieldObj.selectExtends.splice(index,1);
            console.log(this.addFieldObj.selectExtends);
        },

         shutAddFieldBlock() {
            this.isAddLayout=false;
            this.isAddField = false;
            this.isaddLayourMessagel=false;
            this.isaddPost=false;
            this.isaddBinding=false;
        },
        //提交字段
        submitAddFieldForm(){
            this.addFieldObj.service_id=this.service_id;
            if(this.type==1){//添加
                    this.$http.post("/web/Crm_corp_mgr_service_option/addCrm_corp_mgr_service_option",this.addFieldObj).then((res)=>{
                    if(res.data.b==1){
                         this.$http.post("/web/Crm_corp_mgr_service_option/findCrm_corp_mgr_service_optionList",{service_id:this.service_id,ps:10}).then((res)=>{
                            if(res.data.b==1){
                                this.fieldsList=res.data.a;
                                this.$Message.success('操作成功');
                                this.isAddField = false;
                            }else{

                            }
                            }).catch(function(response) {
                                    console.log(response)
                                }
                            );
                    }else{
                        alert(res.data.ec[0]);
                    }
                    }).catch(function(response) {
                        console.log(response)
                    }
                );
            }else{//修改
                this.$http.post("/web/Crm_corp_mgr_service_option/updateCrm_corp_mgr_service_option",this.addFieldObj).then((res)=>{
                    if(res.data.b==1){
                        this.fieldsList[this.updateFileIndex].ser_opt_name_show=this.addFieldObj.ser_opt_name_show;
                        this.fieldsList[this.updateFileIndex].ser_opt_name_db=this.addFieldObj.ser_opt_name_db;
                        this.fieldsList[this.updateFileIndex].ser_opt_type=this.addFieldObj.ser_opt_type;
                        this.fieldsList[this.updateFileIndex].ser_opt_length=this.addFieldObj.ser_opt_length;
                        this.fieldsList[this.updateFileIndex].ser_opt_isnull=this.addFieldObj.ser_opt_isnull;
                        this.$Message.success('操作成功');
                        this.isAddField = false;
                    }else{
                        alert(res.data.ec[0]);
                    }
                    }).catch(function(response) {
                        console.log(response)
                    }
                );
            }
        },


        //添加业务实体
        addDepart() {

            this.serviceMessag.service_id="";
            this.serviceMessag.service_name_db="";
            this.serviceMessag.service_name_show="";
            this.isaddLayourMessagel=true;
            this.state=0;
        },
        shutDepart() {
            this.isAddDepart = false;
        },//关闭部门添加/修改对话框

        //删除业务实体
        showDelBlock() {
               this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除该业务实体`,
                onOk: () => {
                    this.$http.post("/web/Crm_corp_mgr_service/delCrm_corp_mgr_serviceById",{service_id:this.service_id}).then((res)=>{
                    if(res.data.b==1){
                        this.$http.post("/web/Crm_corp_mgr_service/findCrm_corp_mgr_serviceList",{ps:100}).then((res)=>{
                            if(res.data.b==1){
                                 this.stBusObjs=res.data.a;
                                 this.$Message.success('操作成功');
                                 this.isaddLayourMessagel=false;
                            }else{

                            }
                        }).catch(function(response) {
                                    console.log(response)
                                }
                        );
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
                   }
            })
            

        },
        submitAdd() {
            if (!this.departObj.id) {
                console.log("添加成功");
            } else {
                console.log("修改成功");
            }

            this.isAddDepart = false;
        },
        //修改业务实体
        updateDepart() {
            this.state=1;
            this.$http.post("/web/Crm_corp_mgr_service/findCrm_corp_mgr_layoutMessageById",{service_id:this.service_id}).then((res)=>{
                    if(res.data.b==1){
                        this.serviceMessag.service_id=res.data.o.service_id;
                        this.serviceMessag.service_name_db=res.data.o.service_name_db;
                        this.serviceMessag.service_name_show=res.data.o.service_name_show;
                        this.isaddLayourMessagel=true;
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            
          
        },
        
        //修改布局
        editLayout(index){
            this.addLayourMessag.layout_name=this.layoutList[index].layout_name;
            this.addLayourMessag.layout_id=this.layoutList[index].layout_id;
            this.isaddLayourMessagel=true;
            this.state=1;
        },
        //删除布局
        delLayout(index){
            let id=this.layoutList[index].layout_id;
           this.$Modal.confirm({
                title: '删除确认',
                content: `是否要删除该布局`,
                onOk: () => {
                    this.$http.post("/web/Crm_corp_mgr_service_pool/delCrm_corp_mgr_layoutById",{layout_id:id}).then((res)=>{
                    if(res.data.b==1){
                        this.$http.post("/web/Crm_corp_mgr_service_pool/findCrm_corp_mgr_layoutList",{ps:10,service_id:this.service_id}).then((res)=>{
                            if(res.data.b==1){
                                  this.layoutList=res.data.a;
                                  this.$Message.success('操作成功');
                            }else{

                            }
                            
                            }).catch(function(response) {
                                    console.log(response)
                                }
                            );
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
                   }
            })
        },
        //查询部门及岗位
        setLayout(index){
            
            this.postObjList=[];
            this.postObj=[];
            this.index=index;
            this.$http.post("/web/Crm_corp_mgr_layout/findDeptById",{}).then((res)=>{
                    if(res.data.b==1){
                         this.postObj=res.data.a;
                         this.isaddPost=true;
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
                //查詢當前綁定的崗位
                this.$http.post("/web/Crm_corp_mgr_layout/findPostMessageList",{layout_id:this.layoutList[index].layout_id}).then((res)=>{
                    if(res.data.b==1){
                         this.postObjList=res.data.a;
                    }else{

                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
           
        },
        //添加修改
        addLayout(){
           this.state=0;
           this.targetKeys=[];
           this.addLayourMessag.layout_name="";
           //判断当前公海池是否有布局
           this.$http.post("/web/Crm_corp_mgr_service_pool/findIsLayoutMessage",{service_id:this.service_id}).then((res)=>{
                    if(res.data.b==1){
                         if(res.data.a.length>0){
                            this.$Notice.warning({
                                                title: '已存在布局，请删除后进行添加',
                                                duration:'2',
                                            });
                            
                         }else{
                             this.isAddLayout=true;
                         }
                    }else{
                         
                    }
                    
                }).catch(function(response) {
                        console.log(response)
                    }
                );
           
        },
        //编辑
        updateLayour(index){
                this.updateFileIndex=index;
                this.state=1;
                this.targetKeys=[];
                this.addLayourMessag.layout_id=this.layoutList[index].layout_id;
                this.$http.post("/web/Crm_corp_mgr_layout/findCrm_corp_mgr_layoutById",{layout_id:this.layoutList[index].layout_id}).then((res)=>{
                        if(res.data.b==1){
                            if(res.data.a.length!=0){
                                 this.targetKeys=res.data.a;
                            }
                            console.log(res.data.a.length);
                            this.addLayourMessag.layout_name=res.data.o;
                            this.isAddLayout=true;
                        }
                
                }).catch(function(response) {
                        console.log(response)
                    }
                );
            
        },
        //查询所有字段
        selectAllLayour(){    
            this.$http.post("/web/Crm_corp_mgr_service_pool/findAllCrm_corp_mgr_service_optionList",{service_id:this.service_id}).then((res)=>{
                if(res.data.b==1){
                     res.data.a.map(obj=>{
                        obj.label=obj.ser_opt_name_show;
                        obj.key=obj.ser_opt_id;
                    })
                    this.AllfieldsList=res.data.a;
                  
                    
                }else{

                }
                
            }).catch(function(response) {
                    console.log(response)
                 }
            );
        },
        renderKey(item){
            
            alert();
        },//处理穿梭框数组
       createArray(newArr,dereacted,arr2){
       //判断当前是加入还是删除
       console.log(arr2);
       if(dereacted=="right"){
           arr2.map(obj=>{
            this.targetKeys.push(obj);
           })
           
       }else{
           arr2.map(obj=>{
                let i=this.targetKeys.indexOf(obj);
                this.targetKeys.splice(i,1);
           })
           
           
       }
        }   
    }
}
</script>
