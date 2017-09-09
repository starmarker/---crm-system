
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <div style="font-size:16px;">
                <Icon type="levels"></Icon> 业务参数
                <Button type="primary" icon="plus"  @click="addArg" style="float:right;margin-right:10px;margin-bottom:5px;"> 添加参数</Button>
            </div>
        </div>
        <div class="layout-content-main">
            <div class="item-block">
                <div class="item-block-title" style="border-bottom:none;"></div>
                <div class="argument-class">
                    <p class="argument-class-title">参数分类列表</p>
                    <ul>
                        <li v-for="(el,index) in argumentsList" @click="getArguments(el.id)">{{el.name}}</li>
                    </ul>
                    <Input v-model="aclassName" style="margin-top:20px;">
                        <Button slot="append" icon="plus">添加</Button>
                    </Input>  
                </div>
                <div class="argument-table">
                    <Table :columns="aTableHeader" :data="argumentList"></Table>
                </div>
            </div>
        </div>
        <Modal title="添加/修改参数" v-model="isAddArg">
            <Form ref="argForm" :model="argObj" label-position="left" :label-width="100" :rules="argRule">
                <Form-item label="所属分类" prop="c_name">
                    <Select v-model="argObj.c_no">
                        <Option v-for="(el,index) in argumentsList" :value="el.id" :key="el.id">{{el.name}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="参数名称" prop="a_name">
                    <Input v-model="argObj.a_name"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutArgModal">取消</Button>
                <Button type="primary" @click="submitAddArg">确定</Button>                
            </div>
        </Modal>

    </div>
</template>
<script>
export default {
    data() {
        return {
            argumentsList:[],//参数分类列表，通过在created声明周期中通过异步方式获取
            aclassName:'',//添加分类名称
            isAddArg:false,//是否处于编辑/添加状态
            aTableHeader:[{
                title:'分类编号',
                key:'c_no'
            },{
                title:'分类名称',
                key:'c_name'
            },{
                title:'参数编号',
                key:'a_no'
            },{
                title:'参数名称',
                key:'a_name'
            },{
                title:'操作',
                key:'action',
                render:(h,pramas)=>{
                    let self=this;
                    return h('div',[h('Button',{
                        props:{
                            type:'primary',
                            icon:'compose'
                        },
                        style:{
                            cursor:'pointer'
                        },
                        on:{
                            click:()=>{
                                this.editArg(pramas.row)
                                }
                            }
                        
                    },'修改'),h('Button',{
                        style:{
                            'margin-left':'20px'
                        },
                        props:{
                            type:'error',
                            icon:'trash-a',
                        },
                        on:{
                            click:()=>{
                                this.delArg(pramas.row)
                                }
                            }
                                               
                    },'删除')])
                }
            }],//参数表格页头部分
            argumentList:[{id:1,c_no:'12232',c_name:'联系人',a_no:'sdsds',a_name:'联系人姓名'},{id:2,c_no:'12232',c_name:'联系人',a_no:'22',a_name:'联系人电话'}],//参数表格数据，通过异步获取getArguments方法就是获取数据
            argObj:{},//参数添加/修改表单对象
            argRule:{
                c_no:[{
                    required:true,
                    message:'此项为必填项目'
                }],
                a_name:[{
                    required:true,
                    message:'此项为必填项目',

                },{
                    type:'string',
                    min:2,
                    max:15,
                    message:'长度介于2-15之间'
                }]
            },//参数表单提交验证对象
        }
    },
    computed: {
       
    },
    created() {
        this.getArgumentsList();

    },
    updated() {

    },
    methods: {
        getArgumentsList(){

 //          this.$http.post().then((res)=>{
                //成功回调
 //          }).catch((reject)=>{
 //              console.log(reject);
 //          });
            this.argumentsList=[{name:'销售线索来源',id:1},{name:'失单因素',id:2},{name:'行业设置',id:3},{name:'目标管理设置',id:4}];//模拟异步
        },
        getArguments(id){
            //根据分类获取参数值
            if (id=="undefined") {
                id=0;
            }
            console.log(id);
        },
        addArg(){
            this.argObj={c_no:'',c_name:'',a_no:'',a_name:''};
            this.isAddArg=true;
        },//添加参数
        editArg(obj){
            this.argObj=JSON.parse(JSON.stringify(obj));
            this.isAddArg=true;
        },//编辑参数
        delArg(obj){
            this.$Modal.confirm({
                title:'删除确认',
                content:`是否删除【${obj.c_name}】字段`,
                onOk:()=>{
                    console.log(obj.id);//这里执行异步的删除操作
                }
            })
            
        },
        shutArgModal(){
            this.isAddArg=false;
        },//关闭编辑修改弹窗
        submitAddArg(){
            let url;
            if(this.argObj.id){
                url='1';
            }else{
                url="2";
            }//根据对象中是否有主键id来判断调用添加接口和编辑接口
            this.$refs.argForm.validate((result)=>{
                if(result){
                    console.log("表单验证成功");
                }
            })
        },//提交按钮事件
    }
}
</script>