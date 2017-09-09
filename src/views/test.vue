
<template>
    <div>
        <Modal v-model="isShow" class="diy-box">
            <!--<Steps :current="current" v-if="showde">
                <Step :title="el.title" v-for="(el,index) in cObj.status" :key="el.id" @click.native="change"></Step>
            </Steps>-->
            <div class="my-steps">
                <div class="step-line"></div>
                <div class="step-item" :style="{width:(100/this.status.length)+'%'}" v-for="(item,index) in status" :key="index">
                    <div class="icon">
                        <!--<Icon :type="index<current-1?'checkmark':(index==current)?"index+1"></Icon>-->
                        <Icon type="checkmark" v-if="index<current"></Icon>
                        <Icon type="help" v-if="index>current"></Icon>
                        <span v-if="index==current">{{index+1}}</span>
                    </div>
                    <div class="step-item-detail">
                        <h3>{{item.title}}</h3>
                        <small>{{item.title}}</small>
                    </div>
                </div>
            </div>
      <Icon type="plus" @click.native="change" size="large"></Icon>
        <Dropdown style="margin-left: 20px" @on-click="setValue">
            <Button type="primary">
                下拉菜单
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <Dropdown-menu slot="list">
                <Dropdown-item :name="el.id" v-for="(el,index) in status" :key="el">{{el.title}}</Dropdown-item>
            </Dropdown-menu>
        </Dropdown>

            <Select ref="testS">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
                <Option value="6">6</Option>
                <Option value="7">7</Option>
            </Select>
        </Modal>
    
        <Icon type="plus" @click.native="change" size="large"></Icon>
        <Dropdown style="margin-left: 20px" @on-click="setValue">
            <Button type="primary">
                下拉菜单
                <Icon type="arrow-down-b"></Icon>
            </Button>
            <Dropdown-menu slot="list">
                <Dropdown-item :name="el.id" v-for="(el,index) in status" :key="el">{{el.title}}</Dropdown-item>
            </Dropdown-menu>
        </Dropdown>
        <div class="body-bg"></div>
        <div class="block">
            <img src="../images/smk_logo.png" alt="smk_crm文字logo" class="text-logo">
            <!--本来就是这个也可以按的我自己都害怕的-->
            已选择地域:
            <Tag v-for="item in count" :key="item.value" :name="item.value" closable @on-close="handleClose2">{{ item.label }}</Tag>
            维度选择
            <Cascader :data="data" v-model="value1" @on-change="setValue"></Cascader>
            <!--<span v-for="item in testObj">{{item[0]}}</span>-->
            <p> {{datetest | format('YYYY-MM-DD')}}</p>
            <Date-picker type="date" format="yyyy-MM-dd" v-model="testObj.datetest" @on-change="setValue($event,testObj.datetest,$el)"></Date-picker>
            <!--<input type="text" v-model="datetest " >-->
            
            <Detail :model="curObj" :show="isShowDetail"></Detail>
            <Button type="primary" @click="testE">点击</Button>
            <Modal v-model="isShow">
                {{xxx}}
                {{username}}
                <input type="text" v-model="xxx">
                <button type="button" @click="resetForm">重置</button>
            </Modal>
            
        </div>
    </div>
</template>
<script>
import bForm from './publicComponents/builtFormItem.vue';
import detail from './publicComponents/details.vue';
export default {
    data () {
        return {
            xxx:1,
            text:'',
            tableHeader:[{
                title:'编辑',
                key:'edit',
                render:(h,p)=>{
                    return h('Input',{
                        attrs:{
                            value:p.row.edit
                        },
                        on:{
                            'on-change':(e)=>{
                                console.log(e.target.value);
                                    p.row.edit=e.target.value;
                                    //this.tableData[p.index].edit=e.target.value;
                              
                                
                            }
                        }
                    })
                }
            },{
                title:'操作',
                key:'action'
            }],
            tableData:[{edit:'qweqw'},{edit:'qwedqw'}],
            detailStyle: {
                width: '80%',
                height: "400px",
                top: '60px',
                right: '0'
            },
            lists: [{
                id: 1,
                name: '这是第一条内容',
            }, {
                id: 2,
                name: '这是第2条内容',
            }, {
                id: 3,
                name: '这是第3条内容',
            }],
            datetest: '',
            curObj: {},
            cObj:{},
            testObj:{datetest: '',},
            showde:false,
            currentStatus: 13,
            current: 2,
            options: {
                shortcuts: [{
                    value (date) {
                        let d = new Date(date);
                        let y = d.getFullYear();
                        return y;
                    }
                }
                ]


            },
            value1: [],
            data: [{
                value: 1,
                label: '北京',
                children: [
                    {
                        value: 2,
                        label: '故宫'
                    },
                    {
                        value: 3,
                        label: '天坛'
                    },
                    {
                        value: 4,
                        label: '王府井'
                    }
                ]
            }, {
                value: 5,
                label: '江苏',
                children: [
                    {
                        value: 6,
                        label: '南京',
                        children: [
                            {
                                value: 7,
                                label: '夫子庙',
                            }
                        ]
                    },
                    {
                        value: 8,
                        label: '苏州',
                        children: [
                            {
                                value: 9,
                                label: '拙政园',
                            },
                            {
                                value: 10,
                                label: '狮子林',
                                children: [{
                                    value: 11,
                                    label: '狮子林1',
                                }]
                            }
                        ]
                    }
                ],
            }],
            count: [],
            isShow:false,
            isShowDetail: false,
            status: [],
            // items: [{
            //     field_id:1, 
            //     extend:[{name:"羽毛球", value:1}, {name:"篮球", value:2}],
            //      layout_index:1, 
            //      field_modifytype:1,
            //       field_name_show:"需求名称", 
            //       dividingLine_name:"分割线", 
            //       field_name_db:"demain_name", 
            //       field_defvalue:2, 
            //       field_length:200, 
            //       field_type:8, 
            //       field_isnull:1,
            //        is_DividingLine:1},{field_id:2, layout_index:1, field_modifytype:1, field_name_show:"需求内容", dividingLine_name:"分割线", field_name_db:"demian_conntent", field_defvalue:"dsadsa", field_length:200, field_type:3, field_isnull:1, is_DividingLine:1},{field_id:3, layout_index:1, field_modifytype:1, field_name_show:"需求类型", dividingLine_name:"分割线", field_name_db:"demian_typpe", field_defvalue:"dasdad", field_length:200, field_type:3, field_isnull:1, is_DividingLine:1},{field_id:11, layout_index:1, field_modifytype:1, field_name_show:"数量", dividingLine_name:"分割线", field_name_db:"demain_num", field_defvalue:21, field_length:200, field_type:1, field_isnull:1, is_DividingLine:1},{field_id:12, layout_index:1, field_modifytype:1, field_name_show:"排序", dividingLine_name:"分割线", field_name_db:"demain_index", field_defvalue:1, field_length:200, field_type:1, field_isnull:1, is_DividingLine:1}],
            // testObj: {
            //     "2015": [1, 2, 3, 4],
            //     "2016": [5, 6, 7, 9]
            // },
            // baseData: [],
            // loginRule:{

            // },
            // loginObj:{},
            // test1:{name:1},
            // testRule:{
            //     name:[{
            //         type:'number',
            //         required:true,
            //         message:'数字且必填',
            //         trigger:'blur'
            //     },]
            // }
        }
    },
    created () {
        // this.loginRule=this.$myFunction.createRuleObj(this.items);
        // this.items.map((obj)=>{
        //     this.loginObj[obj.field_name_db]=obj['field_defvalue'];
        // });
    //     this.getStatus();
       
    //         this.allList.map((obj1)=>{
    //              this.getList.map((obj2)=>{
    //            if(obj2.func_id==obj1.parent_func_id && (obj1.meth_code & obj2.meth_codes)){
    //                 obj1.checked=true;
    //                 console.log(1);
    //            }
    //         })
    //     })
    //     console.log(JSON.parse(JSON.stringify(this.allList)));
    },
    update () {
        console.log(isShowDetail);
    },
    watch: {
        isShowDetail: function (a, b) {
            console.log(a);
        },

    },
    mounted () {
        // let detail=document.getElementsByClassName('detail-box')[0];
        // detail.addEventListener("click",function(e){
        //     e.stopPropagation();
        // });
        // window.addEventListener('click',function(e){
        //     alert(111);
        //    this.isShowDetail=false;
        // })
        //this.$refs.testS.style.width="100px";
        //this.$forceUpdate();
        this.$nextTick(()=>{
            console.log(this.$refs.testS);
        })
        
    },
    components: { bForm: bForm, Detail: detail },
    computed:{
        username(){
            //return this.$store.state.user_name;
        }
    },
    methods: {
        changeText(e){
            console.log(e.target.value);
        },
        showDetail (index) {
            this.curObj = this.lists[index];
            this.curObj.mark = 1;
            this.isShowDetail = true;
        },
        getStatus () {
            this.status = [{ id: 3, title: '初步洽谈' }, { id: 4, title: '确认需求' }, { id: 5, title: '签订合同' }, { id: 6, title: '项目开发' }, { id: 7, title: '结项' }];
            this.cObj.status=[{ id: 3, title: '初步洽谈' }, { id: 4, title: '确认需求' }, { id: 5, title: '签订合同' }, { id: 6, title: '项目开发' }, { id: 7, title: '结项' }];
        },
        // login() {
        //     //console.log(JSON.parse(JSON.stringify(this.loginObj)));
        //     //console.log(JSON.parse(JSON.stringify(this.$refs.loopForm._data.itemArray)));
        //      console.log(this.$refs.testForm.model===this.loginObj);
        //     console.log(JSON.parse(JSON.stringify(this.loginRule)));
        //     this.$refs.testForm.validate((result)=>{
        //         if(result){
        //             console.log("验证成功");

        //         }else{
        //             console.log("验证失败");
        //         }
        //     })

        // },
        // login1(){
        //     this.$refs.form2.validate((valid)=>{
        //         if (valid) {
        //             console.log("成功");
        //         }else{
        //             console.log("失败");
        //         }
        //     })
        // },
        getid (a) {
            console.log(a);
        },
        testE () {
            this.isShow=true;
            this.showde=true;
            console.log(this.$store);
            this.$store.commit('login','张亮');
        },
        change () {
            alert();
        },
        goto (time) {
            // alert(time);
            // this.datetest=time;
            alert(this.datetest);
        },
        setValue (value, selectedData,el) {
        
            this.selectedData=value;
            console.log(value);
           // console.log(this.selectedData); 
           console.log(this.testObj.datetest);
            console.log(el);
        },
        handleClose2 () { },
        resetForm(){
            //this.$set(this.$data,'xxx',this.$option.data());
        },
    }
}
</script>
