
<template>
    <div class="layout-content">
        <div class="layout-content-main clients-welcome">
            <Row :gutter="32">
                <Col span="12">
                <div class="wel-block ">
                    <p class="item-block-title">工作组信息 <Button type="text" style="float:right" icon="refresh" color="#3983C8" @click="getWG_Msg(selectWid)"></Button> </p>
                    <p>所在工作组:
                        <Select v-model="workgroup" @on-change="getWG_Msg" placeholder="参与的工作组" style="margin:10px 0px;width:200px;">
                            <Option value="">所有工作组</Option>
                            <Option :value="el.workgroup_id" v-for="(el,index) in workGroupArr" :key="el.workgroup_id">{{el.workgroup_name}}</Option>
                        </Select>
                    
                    </p>

                    <ul class="workgroup-info" style="height:270px;overflow-y:auto;">
                        <li v-for="(el,index) in workGroupInfoArr" :key="el">
                            <img :src="el.head_img" alt="">
                            <div class="info-intro">
                                
                                <h4>
                                    <span>{{el.username}}</span> &emsp;
                                    <span>{{el.publish_time}}</span>
                                </h4>
                                <p>{{el.msg_detail}} <a :href="el.msg_path" target="_blank">{{el.msg_title}}</a></p>
                                
                            </div>
                        </li>
                    </ul>
                    <Button type="text" v-if="isShowGetMore &&workgroup" style="position:absolute;bottom:2px;left:5px;" @click="getMoreInfos">
                        <Icon type="plus"></Icon>查看更多</Button>
                    <Poptip v-if="selectWid!=0" placement="top-end" v-model="isShowSendMsg" style="position:absolute;bottom:5px;right:5px;" :width="500" title="发布回复" @on-popper-hide="moveMsgbody">
                        <Button type="primary">发布</Button>
                        <div class="comm-form" slot="content">
                            <h3>发布内容及附件</h3>
                            <Form :label-width="50" label-position="left">
                                <Form-item label="内容">
                                    <Input type="textarea" v-model="msgbody.msg_detail" :autosize="{minRows: 3,maxRows: 6}"></Input>
                                </Form-item>
                                <Form-item label="">
                                    <Upload action="/web/MSG/uploadMsgSth"
                                    :on-success="uploadTitlePic"
                                    :max-size="2048"
                                    :show-upload-list="false"
                                style="float:right;width:80px">
                                   <Button type="text" >添加附件</Button><div>{{this.doc.doc_name}}</div>
                                </Upload>
                                    <!-- <Upload multiple action="//jsonplaceholder.typicode.com/posts/">
                                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                    </Upload> -->
                                    <!--<Input type="file" :autosize="{minRows: 3,maxRows: 6}"></Input>-->
                                </Form-item>
                            </Form>
                            <Button size="small" style="position:absolute;bottom:15px;right:100px" @click="isShowSendMsg=false" >取消</Button>
                            <Button type="primary" size="small" @click="sendMsg" style="position:absolute;bottom:15px;right:40px">提交</Button>
                        </div>
                    </Poptip>
                </div>
                </Col>
                <Col span="12">
                <div class="wel-block">
                    <Row>
                        <Col span="12">
                        <div class="works">
                            <p class="item-block-title">今日工作
                                <!--<Button type="primary" icon="plus" size="small" @click="addWork" style="float:right;margin-right:10px;margin-top:10px">添加日程</Button>-->
                            </p>
                            <Timeline>
                                <Timeline-item v-for="(el,index) in workList" :key="index">
                                    <p class="time">{{el.schedule_date}} </p>
                                    <p class="content">{{el.schedule_content}}</p>
                                </Timeline-item>
                            </Timeline>
                        </div>
                        </Col>
                        <Col span="12">
                        <Calendar ref="work" @pick="getNewDate" @change-month="changeMonth"></Calendar>
                        </Col>
                    </Row>
                </div>
                </Col>
                <!--详情信息-->
                <Col span="8">
                <div class="wel-block com-info">
                    <p class="item-block-title">公司动态</p>
                    <ul>
                        <!--<li v-for="(el,index) in comInfoArr" :key="index">
                            <div class="list-icon">
                                <Icon type="ios-bell-outline"></Icon>
                            </div>{{el.msg_detail}}（{{el.creator}} {{el.publish_time}}）</li>-->
                    </ul>
                </div>
                </Col>
                <!--待办事项-->
                <Col span="8">
                <div class="wel-block com-info">
                    <p class="item-block-title">我的关注</p>
                    <ul>
                        <!--<li><div class="list-icon"><Icon type="ios-bell-outline"></Icon></div>德仁堂明天上午九点开会（郑海霞 2017-06-19 15:32:21）德仁堂明天上午九点开会（郑海霞 2017-06-19 15:32:21）</li>
                                <li><div class="list-icon"><Icon type="ios-bell-outline"></Icon></div>德仁堂明天上午九点开会（郑海霞 2017-06-19 15:32:21）德仁堂明天上午九点开会（郑海霞 2017-06-19 15:32:21）</li>-->
                    </ul>
                </div>
                </Col>
                <!--仪表盘-->
                <Col span="8">
                <div class="wel-block diy-panes">
                    <p class="item-block-title">自定义仪表盘
                        <!-- @click="addWork"--><Button type="text"  style="float:right;margin-right:10px;margin-top:10px"> 
                            <Icon type="gear-b" color="#3983c8"></Icon>
                        </Button>
                    </p>
                    <!--<Carousel
                               :value="0"
                                :autoplay="false"
                                dots="inside "
                                trigger="click"
                                arrow="hover">
                                <Carousel-item>
                                    <div class="demo-carousel">1</div>
                                </Carousel-item>
                                <Carousel-item>
                                    <div class="demo-carousel">2</div>
                                </Carousel-item>
                                <Carousel-item>
                                    <div class="demo-carousel">3</div>
                                </Carousel-item>
                                <Carousel-item>
                                    <div class="demo-carousel">4</div>
                                </Carousel-item>
                            </Carousel>-->
                </div>
                </Col>
            </Row>
        </div>
        <!--添加日程弹出窗-->
        <Modal v-model="isAddWork" title="添加日程信息">
            <Form :model="addWorkObj" :label-width="80" label-position="left" :rules="addWorkRules">
                <Form-item label="日程标题" prop="title">
                    <Input v-model="addWorkObj.title"></Input>
                </Form-item>
                <Form-item label="日程时间" prop="time">
                    <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间（不含秒）" v-model="addWorkObj.time"></Date-picker>
                </Form-item>
                <Form-item label="日程详情">
                    <Input type="textarea" v-model="addWorkObj.desc"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddWorkBlock">取消</Button>
                <Button type="primary" @click="submitAddWork">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Calendar from '../publicComponents/Calendar'
export default {
    name: 'welcome',
    data () {
        return {
            
            workgroup: null,
            workGroupArr: [],
            currentPage:2,
            workGroupInfoArr: [],//工作组信息列表,
            workList: [],//日程列表
            curDate: '',//当前日期
            comInfoArr: [],//公司动态消息
            //selectedDate:'',
            addWorkObj: {
                title: '',
                time: '',
                desc: '',
            },//添加日程表单对象
            addWorkRules: {
                title: [{
                    type: 'string',
                    required: true,
                    message: '标题为必填项',
                }, {
                    type: 'string',
                    min: 5,
                    max: 30,
                    message: '标题长度介于5-30之间'
                }],
                time: [{
                    type: 'date',
                    required: true,
                    message: '时间为必填项目'
                }]
            },
            isAddWork: false,//添加日程弹出窗是否展示
            isShowGetMore:false,


            isShowSendMsg:false,
            selectWid:0,
            doc:{//文档
                doc_name:"",
                doc_path:"",
                doc_type:1,
            },
            msgbody:{
                workgroup_id:0,
                msg_title:"",
                msg_detail:"",
                msg_path:"",
                msg_type:""
            },
        }
    },
    created () {
        this.getStart();



    },
    watch: {

    },
    computed: {
    },
    components: {
        Calendar: Calendar,
    },
    methods: {

        getStart () {
            this.getWGListAndMsg();
            this.getTodayWork();
            //this.getDateWork();
            // this.getComMsg();
        },


        //封装上传的文件的信息
         uploadTitlePic (res, file) {
                this.doc.doc_name=res.a.name;
                this.doc.doc_path=res.a.path;
                this.doc.type=res.a.type;
         },
         //发送消息
         sendMsg(){
                this.msgbody.msg_title = this.doc.doc_name;
                this.msgbody.msg_path = this.doc.doc_path;
                this.msgbody.msg_type = this.doc.doc_type;
                this.msgbody.workgroup_id = this.selectWid;
                if(this.msgbody.workgroup_id==0){
                    alert("未选择工作组");
                    return;
                }
                this.$http.post("/web/MSG/addNewWG_Msg",this.msgbody,{
                    emulateJSON: true
                }).then((res)=>{
                                if(res.data.b==1){
                                    this.$Message.success('操作成功');
                                    //关闭窗口  刷新消息
                                    this.getWG_Msg(this.msgbody.workgroup_id);
                                    this.isShowSendMsg = false;
                                }else{
                                    this.$errorHandle(res);
                                    
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );

         },

         //清空消息发送框
         moveMsgbody(){
            this.msgbody={
                workgroup_id:0,
                msg_title:"",
                msg_detail:"",
                msg_path:"",
                msg_type:""
            };
            this.doc={//文档
                doc_name:"",
                doc_path:"",
                doc_type:1,
            }
         },

        //获取单个工作组的消息
        getWG_Msg (id) {
            this.selectWid = id;
            this.currentPage=2;
            if (id!="") {
                this.$http.post('/web/MSG/getMsgByworkgroup_id', { workgroup_id: id,pi:1,ps:5 }).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.workGroupInfoArr = res.data.a;
                            if(this.workGroupInfoArr.length==5){
                                this.isShowGetMore=true;
                            }
                        }else{
                            this.$errorHandle(res);
                        }
                    },
                )
            }else{
                this.getWGListAndMsg()
            }

        },

        // 获取工作组列表
        // 获取所有工作组消息
        getWGListAndMsg () {
            this.$http.post('/web/MSG/getMyInworkgroup', {pi:1,ps:5}).then(
                (res) => {
                    if (res.data.b == 1) {
                        this.workGroupArr = res.data.a;
                        this.workGroupInfoArr = res.data.o;
                    }else{
                        this.$errorHandle(res);
                    }
                },
            )
        },


        // 获取今日工作
        getTodayWork (date) {
            var obj = {};
            if (date) {
                var obj = { "schedule_date": date };
            }
            this.$http.post('/web/Crm_corp_mgr_common_schedule/getTodayWork', obj).then(
                (res) => {
                    if (res.data.b == 1) {
                        this.workList = res.data.a;
                    }else{
                        this.$errorHandle(res);
                    }
                },
            )
        },
        //获取工作计划日历
        // getDateWork () {
        //     this.$http.post('/web/Crm_corp_mgr_common_schedule/getDateWork', {}, { emulateJSON: true }).then(
        //         (res) => {
        //             if (res.data.b == 1) {
        //                 //alert("应用到工作计划日历上");
        //             }
        //         },
        //     )
        // },

        //公司动态消息
        // getComMsg () {
        //     this.$http.post('/web/MSG/getComMsg', {}, { emulateJSON: true }).then(
        //         (res) => {
        //             if (res.data.b == 1) {
        //                 this.comInfoArr = res.data.a;
        //             }
        //         },
        //     )
        // },

        


        //添加日程      //首页暂时取消这个功能


        // 获取单个工作组的更多信息（有分页，做追加处理）
        getMoreInfos(){
            let id=this.workgroup,pi=this.currentPage;
                this.$http.post('/web/MSG/getMsgByworkgroup_id', { workgroup_id: id,pi:pi,ps:5}).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.workGroupInfoArr=this.workGroupInfoArr.concat(res.data.a);
                            console.log(this.workGroupInfoArr);
                            this.currentPage++;
                            if (res.data.a.length<5) {
                               this.isShowGetMore=false;
                            }
                        }else{
                            this.$errorHandle(res);
                        }
                    },
                )            
        },
        addWork () {
            this.addWorkObj.time = this.curDate;
            this.isAddWork = true;
        },//打开日程弹窗
        shutAddWorkBlock () {
            this.isAddWork = false
        },//关闭日程弹窗
        submitAddWork () {

        },//提交日程信息
        formatDate: function (value) {
            let date = new Date(value);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            if (m < 10) m = "0" + m;
            let d = date.getDate();
            if (d < 10) d = "0" + d;
            return y + "-" + m + "-" + d;
        },//格式化时间
        getNewDate (value) {
            this.curDate = value;
            //点击日历返回新的日期，根据新的日期查当日工作安排

            this.getTodayWork(this.curDate);
            //     let arr=[{date:"",time:"12:00",title:'拜访客户'},{date:"",time:"12:00",title:'拜访客户'},{date:"",time:"12:00",title:'拜访客户'}];
            //     arr.map((obj)=>{
            //         obj.date=this.curDate;
            //         obj.title=obj.date+obj.time+obj.title
            //    // });
            //    // this.workList= arr;
        },
        changeMonth (month) {
            console.log(month);
        }
    }
}
</script>
