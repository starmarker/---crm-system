<style>
    /*.ivu-poptip{float:right;}*/
</style>

<template>
    <div>
    <Modal :styles="detailStyle" class="detail-box" ref="detailModal" :scrollable="false" v-model="isShowDetail" @on-cancel="shutModal">
        <div slot="header">
            <div class="detail-title">
                <span>
                    <Icon type="document-text"></Icon> &nbsp;名称：</span>  {{cObj.name}}  
                <!--<Button :type="iscared?'ghost':'primary'" :icon="iscared?'heart-broken':'heart'" style="margin-left:20px;margin-top:-5px;" size="small">
                    {{iscared?'取消关注':'我要关注'}}
                </Button>-->
            </div>
             <Steps :current="current"> 
                <Step :title="item.sales_advance_name" :content="item.sales_advance_proportion+''" @click.native="steps(item)" v-for="(item,index) in cObj.advance" :style="{width:(100/cObj.advance.length)+'%'}" :key="index"></Step>
                 <!--<Step title="失单" @click.native="showLoseDiv"></Step>-->
            </Steps>
            <!--<Row :gutter="32">
                <Col span="6">
                <div class="detail-item-title">
                    <Icon type="android-time"></Icon>&nbsp;{{nameObj[stateKey]}}开始时间-{{nameObj[stateKey]}}结束时间
                </div>
                <div class="detail-item-content">
                    2017-05-12—2017-06-12
                </div>
                </Col>
                <Col span="4">
                <div class="detail-item-title">
                    <Icon type="android-alert"></Icon> &nbsp;{{nameObj[stateKey]}}状态
                </div>
                <div class="detail-item-content">
                    进行中
                </div>
                </Col>
                <Col span="4">
                <div class="detail-item-title">
                    <Icon type="android-alert"></Icon> &nbsp;{{nameObj[stateKey]}}类型
                </div>
                <div class="detail-item-content">
                    网站建设
                </div>
                </Col>
            </Row>-->
        </div>
        <div class="detail-body">
            <Row :gutter="24">
                <!--详情左侧标签页-->
                <Col span="24">
                <Tabs value="name1">
                    <Tab-pane label="实例关联" name="name1">
                        <Collapse accordion @on-change="expandItem" v-model="expandValue">
                            <Panel :name="index+''" v-for="(item,index) in cObj.list" :key="index" >
                                <!--<div @click="expandItem">-->
                                <div class="link-icon" :style="{backgroundColor:iconbgArray[0]}">
                                    <Icon type="ios-search-strong"></Icon>
                                </div>
                                <h3>{{item.service_name_show}}
                                
                                </h3>
                                
                               <!--  </div>  -->
                                <Button type="text" icon="plus" @click="addItem($event,index)"></Button>
                                <div slot="content">
                                    <!--<Row :gutter="16" >
                                        <Col span="24" class="content-item" v-for="(item,index) in backInfoList">
                                            <Col span="12" v-for="(value,key) in item" >
                                            <p>{{key}}:
                                                <span>{{value}}</span>
                                            </p>
                                            </Col>
                                        </Col>
                                    </Row>-->
                                <Table :columns="tableHeader" :data="tableData" :height="200"  @on-selection-change="getSelectedData"></Table>
                                </div>
                            </Panel>
                            <Panel name="panelr">
                                <div class="link-icon" :style="{backgroundColor:iconbgArray[5]}">
                                    <Icon type="ios-search-strong"></Icon>
                                </div>
                                <h3>日程</h3>
                                <Button type="text" icon="plus" @click="addRItem($event,1)"></Button>
                                <div slot="content">
                                   <Table :columns="panelrName" :data="list" :height="200"></Table>
                                </div>
                            </Panel>
                            <Panel name="panelw">
                                <div class="link-icon" :style="{backgroundColor:iconbgArray[6]}">
                                    <Icon type="ios-search-strong"></Icon>
                                </div>
                                <h3>文档</h3>
                                 
                                <Upload action="/web/Crm_corp_mgr_module_config/addDoc"
                                    :on-success="uploadTitlePic"
                                    :max-size="2048"
                                    :on-exceeded-size="exceededSize"
                                    :show-upload-list="false"
                                    :on-format-error="handleFormatError"
                                style="float:right;width:80px">
                                   <Button type="text" icon="plus" ></Button>
                                </Upload>
                                
                                <div slot="content">
                                   <Table :columns="panelwName" :data="list" :height="200" show-footer></Table>
                                </div>
                            </Panel>
                            <Panel name="panelru">
                                <div class="link-icon" :style="{backgroundColor:iconbgArray[7]}">
                                    <Icon type="ios-search-strong"></Icon>
                                </div>
                                <h3>任务</h3>
                                <Button type="text" icon="plus" @click="addRItem($event,3)"></Button>
                                <div slot="content">
                                   <Table :columns="panelruName" :data="list" :height="200" show-footer></Table>
                                </div>
                            </Panel>
                        </Collapse>
                    </Tab-pane>
    
                    <!--共享交流标签页-->
                    <Tab-pane label="共享交流" name="name2" >
                        <Row>
                            <Col span="24">
                            <ul class="comm" style="height:210px;overflow-y:auto;">
                                <li v-for="(item,index) in cObj.workGroupInfoArr" :key="index">
                                    <img :src="item.head_img" alt="">
                        
                                    <div class="comm-detail">
                                        <div class="comm-header">
                                            <p>
                            
                                                <span class="comm-creater">{{item.username}}</span>&emsp;<span class="comm-time">{{item.publish_time}}</span> 
                                            </p>
                                        </div>
                                        <div class="comm-content">
                                            <p>{{item.msg_detail}}</p>
                                            <!--发布的文字内容，下边为附件列表-->
                                            <p v-if="item.msg_type==2">
                                                <img :src="item.msg_path" alt="">
                                            </p>
                                            <p v-if="item.msg_type==3">
                                                <a :href="item.msg_path" target="_blank">附件：{{item.msg_title}}</a>
                                            </p>
        
                                        </div>
                                    </div>
                                </li>
                              
                            </ul>

                        <Button style="float:left;margin-top:10px;" @click="getMoreInfos"> <Icon type="plus"></Icon>查看更多</Button><Button type="primary" @click="showMessagef" style="float:right;margin-top:10px;">发布</Button>
                        
                            </Col>
                        </Row>
                        <!--交流列表結束，以下為發佈按鈕和彈出層-->
                        <!--<Poptip placement="top-end" style="float:right;margin-right:10px;margin-top:5px;" :width="600" title="发布回复">
                            <Button type="primary">发布</Button>
                            <div class="comm-form" slot="content">
                                <h3>发布内容及附件</h3>
                                <Form :label-width="50" label-position="left">
                                    <Form-item label="内容">
                                        <Input type="textarea" :autosize="{minRows: 3,maxRows: 6}" v-model="message"></Input>
                                    </Form-item>
                                    <Form-item label="添加附件">
                                        <Upload
                                        multiple
                                        action="/web/Crm_corp_mgr_module_config/addDoc"
                                        :on-success="uploadTitlePics"
                                        :max-size="2048"
                                        :show-upload-list="false"
                                         style="float:right;width:80px"
                                        >
                                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                                        </Upload>
                                        
                                    </Form-item>
                                </Form>
                                     <Button size="small" style="position:absolute;bottom:15px;right:100px">取消</Button>
                                    <Button type="primary" size="small" style="position:absolute;bottom:15px;right:40px">提交</Button>        
                            </div>
                        </Poptip>-->

                    </Tab-pane>
                     <!--该实例对象的基本资料-->
                    <Tab-pane label="资料" name="name5">
                        <div class="info-details">
                            <Row :gutter="16" >
                                        <Col span="24" class="content-item" v-for="(item,index) in cObj.message" :key="index">
                                            <Col span="12" v-for="(value,key) in item" :key="key" >
                                            <p>{{key}}:
                                                <span>{{value}}</span>
                                            </p>
                                            </Col>
                                        </Col>
                                    </Row>
                        </div>
                    </Tab-pane>
                    <Tab-pane label="工作组成员" name="name6">
                        <ul class="wgmember">
                            <li v-if="cObj.person_liable==item.user_id" v-for="(item,index) in cObj.userList" >{{item.user_name}}<span class="ismanger" >(创建者)</span>
                                <Button-group class="wgoperate"  v-if="cObj.userId==item.user_id">
                                    <Button type="text" size="small" @click="jionGroup"><Icon type="person-add"></Icon></Button>
                                  <!--  <Button type="text" size="small" @click="carePerson(1)"><Icon type="ios-star"></Icon></Button>-->
                                    <Button type="text" size="small" @click="exitGroup"><Icon type="log-out"></Icon></Button>
                                </Button-group>
                            </li>
                        </ul>
                         <ul class="wgmember">
                            <li v-if="cObj.person_liable!=item.user_id" v-for="(item,index) in cObj.userList">{{item.user_name}}</li>
                        </ul>
                    </Tab-pane>
                    <Tab-pane label="结果数据" name="name7" v-if="cObj.tableId==1" >
                        <div class="info-details">
                            <Row class="content-item">
                                <Col span="12" >
                                <p>工作组人数:</p>
                                </Col>
                                <Col span="12" ><p>线索数:<span>{{cObj.resultMessage.allClue}}</span></p>
                                </col>
                                <Col span="12"><p>过滤线索数:<span>{{cObj.resultMessage.clueNum}}</span></p>
                                </col>
                                <Col span="12"><p>线索筛选比例:<span>{{formatRate(cObj.resultMessage.clue_scale)}}</span></p></col>
                                <Col span="12"><p>转换商机数:<span>{{cObj.resultMessage.sales}}</span></p></col>
                                <Col span="12"> <p>商机转换比例:<span>{{formatRate(cObj.resultMessage.sales_scale)}}</span></p></col>
                                <Col span="12"><p>预估商机金额:<span>{{cObj.resultMessage.salesamount}}</span></p></col>
                                <Col span="12"><p>转换客户数:<span>{{cObj.resultMessage.customers}}</span></p></col>
                                <Col span="12"><p>客户转换比例:<span>{{formatRate(cObj.resultMessage.customers_scale)}}</span></p></col>
                                <Col span="12"><p>签单机会:<span>{{cObj.resultMessage.sales}}</span></p></col>
                                <Col span="12"><p>已签单数:<span>{{cObj.resultMessage.conts}}</span></p></col>
                                <Col span="12"> <p>签单金额:<span>{{cObj.resultMessage.totalamount}}</span></p></col>
                            </Row>
                          
                        </div>
                    </Tab-pane>
                    
                </Tabs>

                </Col>
                <!--详情右侧标签块-->
    
               <!-- <Col span="10">
                <Tabs value="name1">
                   
                    <Tab-pane label="资料" name="name1">
                        <div class="info-details">
                            <p>发起人: <span>王桥</span></p>
                            <p>发起人: <span>王桥</span></p>
                             <p>发起人: <span>王桥</span></p>
                             <p>发起人: <span>王桥</span></p>
                        </div>
                    </Tab-pane>
                    <Tab-pane label="工作组成员" name="name2">
                        <ul class="wgmember">
                            <li>袁凯波-产品部<span class="ismanger">(创建者)</span>
                                <Button-group class="wgoperate">
                                    <Button type="text" size="small" @click="jionGroup"><Icon type="person-add"></Icon></Button>
                                    <Button type="text" size="small" @click="carePerson(1)"><Icon type="ios-star"></Icon></Button>
                                    <Button type="text" size="small" @click="exitGroup(1)"><Icon type="log-out"></Icon></Button>
                                </Button-group>
                            </li>
                            <li>张亮-研发部</li>
                            <li>王桥-市场部</li>
                        </ul>
                    </Tab-pane>
                    <Tab-pane label="结果数据" name="name3">标签内容</Tab-pane>
                </Tabs>
                </Col>-->
            </Row>
        </div>
        <div slot="footer"></div>
    </Modal>
    <!--添加关联字段的表单-->
    <Modal v-model="isAddEventItem" title="添加/编辑表单" class-name="topindex">
        <Form :model="addObj" :rules="addRules" style="margin-top:20px;" ref="addFormh">
            <Bform :itemslist="items" ref="loopForm" formobj="addObj"></Bform>
        </Form>
        <div slot="footer">
            <Button @click="shutAddItem" long style="width:45%">取消</Button>
            <Button type="primary" @click="subAddItem" long style="width:45%">提交</Button>
        </div>
    </Modal>
    <!--添加用户进工作组-->
           <Modal v-model="isAddGroupUser" title="添加用户进组" width="300" :mask-closable="false">
                   <Select  placeholder="根据部门筛选" v-model="dept" filterable @on-change="changeDepart">
                        <Option v-for="item in deptList" :value="item.value" :key="item">{{ item.label }}</Option>
                   </Select>
                   <br/><br>
                   <Select  filterable placeholder="选择成员" multiple v-model="groupMember">
                       <Option :value="el.user_id" v-for="(el,index) in depart_worker" :key="el.user_id">{{el.user_name}}</Option>
                   </Select>
            <div slot="footer">
                <Button @click="shutChangePerson" long style="width:45%">取消</Button>
                <Button type="primary" @click="subChangePerson" long style="width:45%">提交</Button>
            </div>
        </Modal>
        <!--移除工作组成员-->
        <Modal v-model="isRemoveGroupUser" title="移除组内成员" width="300" :mask-closable="false">
                   <Select  filterable placeholder="选择成员" multiple v-model="groupMember">
                       <Option :value="el.user_id" v-for="(el,index) in depart_worker" :key="el.user_id">{{el.user_name}}</Option>
                   </Select>
            <div slot="footer">
                <Button @click="shutAddItem" long style="width:45%">取消</Button>
                <Button type="primary" @click="removeChangePerson" long style="width:45%">提交</Button>
            </div>
        </Modal>
        <!--添加日程、任务、文档-->
        <Modal v-model="isAddEventRc" title="添加日程" class-name="topindex">
            <Form :model="schedule" :rules="addSchedule" style="margin-top:20px;" ref="addForms" :label-width="80" label-position="left">
                <Form-item label="日程内容" prop="schedule_content">
                        <Input v-model="schedule.schedule_content"></Input>
                </Form-item>
                <Form-item label="日期" prop="schedule_date">
                        <Date-picker v-model="schedule.schedule_date" format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="选择日期" style="width: 200px" @on-change="setTime($event,'schedule','schedule_date')"></Date-picker>
                </Form-item>
                <Form-item label="类型" prop="schedule_type">
                    <Select v-model="schedule.schedule_type" style="width:200px">
                        <Option v-for="item in schedule_typeList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="是否提醒" prop="schedule_remind">
                    <Select v-model="schedule.schedule_remind" style="width:200px">
                        <Option v-for="item in task_remind" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="备注" prop="schedule_bak">
                        <Input v-model="schedule.schedule_bak"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddItem" long style="width:45%">取消</Button>
                <Button type="primary" @click="addMessage(1)" long style="width:45%">提交</Button>
            </div>
        </Modal>
        <Modal v-model="isAddEventTask" title="添加任务" class-name="topindex">
            <Form :model="task" :rules="addTask" style="margin-top:20px;" ref="addFormf" :label-width="80">
                <Form-item label="任务名称"  prop="task_name">
                        <Input v-model="task.task_name"></Input>
                </Form-item>
                <Form-item label="描述" prop="task_bak">
                        <Input v-model="task.task_bak" placeholder="请输入客户名称"></Input>
                </Form-item>
                <Form-item label="开始时间" prop="task_starttime">
                    <!--<Input v-model="task.task_starttime" placeholder="请输入客户名称"></Input>-->
                    <Date-picker v-model="task.task_starttime" type="date" placeholder="选择日期" style="width: 200px" @on-change="setTime($event,'task','task_starttime')"></Date-picker>
                </Form-item>
                <Form-item label="结束时间" prop="task_endtime">
                     <Date-picker v-model="task.task_endtime" type="date" placeholder="选择日期" style="width: 200px" @on-change="setTime($event,'task','task_endtime')"></Date-picker>
                </Form-item>
                <Form-item label="是否提醒" prop="task_remind">
                    <Select v-model="task.task_remind" style="width:200px">
                        <Option v-for="item in schedule_remind" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="类型" prop="task_type">
                    <Select v-model="task.task_type" style="width:200px">
                        <Option v-for="item in schedule_typeList" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddItem" long style="width:45%">取消</Button>
                <Button type="primary" @click="addMessage(3)" long style="width:45%">提交</Button>
            </div>
        </Modal>
        <!--失单-->
        <Modal v-model="isAddLoseMessage" title="添加失单原因" class-name="topindex">
            <Form :model="task" :rules="addRules" style="margin-top:20px;" ref="addFormd" :label-width="80">
                <Form-item label="失单原因">
                        <Input v-model="sales_losebak"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="shutAddItem" long style="width:45%">取消</Button>
                <Button type="primary" @click="addLoseMessage" long style="width:45%">提交</Button>
            </div>
        </Modal>
        <!--发送消息-->
        <Modal title="发送消息" v-model="isShowMsg">
            <Form :label-width="50" label-position="left">
                <Form-item label="内容">
                    <Input type="textarea" v-model="message" :autosize="{minRows: 3,maxRows: 6}"></Input>
                </Form-item>
                <Form-item label="">
                    <Upload action="/web/MSG/uploadMsgSth"
                    :on-success="uploadTitlePics"
                    :max-size="2048"
                    :show-upload-list="false"
                style="width:80px">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传附件</Button>{{this.doc.doc_name}}
                </Upload>
                    <!-- <Upload multiple action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload> -->
                    <!--<Input type="file" :autosize="{minRows: 3,maxRows: 6}"></Input>-->
                </Form-item>
            </Form>                                
            <div slot="footer">
            <Button @click="isShowMsg=false" >取消</Button>
            <Button type="primary" @click="addMessages">提交</Button>                                    
            </div>
        </Modal>
</div>
</template>
<script>
import bform from './builtFormItem';
export default {
    props: ['model', 'show'],
    data() {
        return {
            message:"",
            addSchedule:{
                schedule_content:[{
                        required:true,
                        message:'日程内容不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:20,
                        message:'任务名称介于1-20个字符之间',
                        trigger:'blur'
                        }
                    ],
                     schedule_date:[{
                        type:'string',
                        required:true,
                        message:'日期不能为空',
                        trigger:'blur'
                        }
                    ],
                    schedule_type:[{
                        required:true,
                        type:'number',
                        message:'类型不能为空',
                        trigger:'change'
                        }
                    ],
                    schedule_remind:[{
                        required:true,
                        type:'number',
                        message:'是否提醒不能为空',
                        trigger:'change'
                        }
                    ],
                     schedule_bak:[{
                        type:'string',
                        required:true,
                        message:'备注不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:50,
                        message:'备注介于1-50个字符之间',
                        trigger:'blur'
                        }
                    ],
            },
            isShowMsg:false,
            addTask:{
                task_name:[{
                        type:'string',
                        required:true,
                        message:'任务名不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:15,
                        message:'任务名称介于1-15个字符之间',
                        trigger:'blur'
                        }
                    ],
                    task_bak:[{
                        type:'string',
                        required:true,
                        message:'描述名不能为空',
                        trigger:'blur'
                        },{
                        type:'string',
                        min:1,
                        max:30,
                        message:'描述名称介于1-30个字符之间',
                        trigger:'blur'
                        }
                    ],
                     task_starttime:[{
                        type:'string',
                        required:true,
                        message:'开始时间不能为空',
                        trigger:'blur'
                        }
                    ],
                    task_endtime:[{
                        type:'string',
                        required:true,
                        message:'结束时间不能为空',
                        trigger:'blur'
                        }
                    ],
                    task_remind:[{
                        required:true,
                        type:'number',
                        message:'是否提醒不能为空',
                        trigger:'change'
                        }
                    ],
                    task_type:[{
                        required:true,
                        type:'number',
                        message:'类型不能为空',
                        trigger:'change'
                        }
                    ],

            },
            panelrName:[{//日程
                title:'日程内容',
                key:'schedule_content',
            },{
                title:'日期',
                key:'schedule_date',
            },{
                title:'类型',
                key:'schedule_type',
                render:(h,p)=>{
                    let text=p.row.schedule_type==1?'普通':(p.row.schedule_type==2?'重要':'紧急');
                    return h('span',{},text);
                }
            },{
                title:'是否提醒',
                key:'schedule_remind',
                render:(h,p)=>{
                   let text=p.row.schedule_remind==1?'是':'否';
                    return h('span',{},text);
                }
            },{
                title:'备注',
                key:'schedule_bak',
            },{
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render:(h,p)=>{
                        return h('Button',{
                            props:{
                                type:'primary',
                                size:'small'
                            },
                            on:{
                                click:()=>
                                this.showDiv(p.index,1)
                            }
                        },"编辑");
                    }
                    }],
            panelwName:[{//文档
                title:'文档名称',
                key:'doc_name',
            },{
                title:'创建人',
                key:'creator',
            },{
                title:'创建时间',
                key:'createtime',
            },{
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render:(h,p)=>{
                        return h('a',{
                            domProps:{
                               target:"_blank",
                               href: p.row.doc_path,
                            },
                        },"下载");
                    }
                    }],
             panelruName:[{//任务
                title:'任务名称',
                key:'task_name',
            },{
                title:'任务描述',
                key:'task_bak',
            },{
                title:'类型',
                key:'task_type',
                render:(h,p)=>{
                    let text=p.row.task_type==1?'普通':(p.row.task_type==2?'重要':'紧急');
                    return h('span',{},text);
                }
            },{
                title:'是否提醒',
                key:'task_remind',
                render:(h,p)=>{
                   let text=p.row.task_remind==1?'是':'否';
                    return h('span',{},text);
                }
            },{
                title:'开始时间',
                key:'task_starttime',
            },{
                title:'结束时间',
                key:'task_endtime',
            },{
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    render:(h,p)=>{
                        return h('Button',{
                            props:{
                                type:'primary',
                                size:'small'
                            },
                            on:{
                                click:()=>
                                this.showDiv(p.index,3)
                            }
                        },"编辑");
                    }
                    }],
            schedule_remind:[{
                value: 1,
                label: '是'
            },{
                value: 0,
                label: '否'
            }],
            task_remind:[{
                value: 1,
                label: '是'
            },{
                value: 0,
                label: '否'
            }],
            schedule_typeList:[{
                value: 1,
                label: '普通'
            },{
                value: 2,
                label: '重要'
            },{
                value: 3,
                label: '紧急'
            }],
            belong_dept:"",
            belong_product: '',
            belong_industry: '',
            belong_area: '',
            dept:"",
            sales_losebak:"",//失单原因
            schedule:{//日程
                schedule_content:"",
                schedule_date:"",
                schedule_type:"",
                schedule_remind:"",
                schedule_bak:"",
                schedule_id:"",
            },
            task:{//任务
                task_name:"",
                task_starttime:"",
                task_endtime:"",
                task_bak:"",
                task_remind:"",
                task_type:"",
                task_id:"",
            },
            doc:{//文档
                doc_name:"",
                doc_path:"",
            },
            isRemoveGroupUser:false,
            isAddLoseMessage:false,//失单原因
            isAddEventRc:false,//日程
            isAddEventTask:false,//任务
            selectedArr:[],//表格中选中的数据列表
            tableData:[],//表格数据
            tableHeader:[{}],//表格页头最终显示字段
            detailStyle: {
                position:'absolute',
                width: '80%',
                height: "400px",
                top: '60px',
                boxSize:'border',
                right: '0',
                boxShadow:'1px 2px 2px 2px #aaa',
            },
            iconObj:{},
            iconbgArray: ['#f84801', '#ef7719', '#f9b907', '#c5ea26', '#6ea754', '#166f9c', '#3983c8'],//折叠面板header部分背景颜色数组
            tableId: 1,//实例类型，1为活动
            iscared: true,//是否已经关注
            isAddEventItem:false,//添加关联事项的具体项目的表单弹窗是否展开
            items:[],//事项页面布局
            addObj:{},//表单对象
            addRules:{},//验证表单对象
            isAddGroupUser:false,//添加工作组成员弹出层
            depart_worker:[],//部门员工筛选，
            groupMember:[],//要添加的工作组成员
            isShowDetail:false,
            getList:{
                 config_id:"",
                 field_name_a:"",//主表主键名
                 field_name_b:"",//从表主键名
                 field_value:"",//主键值
                 tableId:"",
                 ps:2,
                 tableId:"",
                  packetType:1000,
            },
           backInfoList:{//返回集合

           },
           additems:{//获取添加页面布局
                packetType:6000,
                tableId:"",
                operationParamsItem:{
                    pi:1,
                    ps:10,
                },
            },
             updateitems:{//获取修改页面布局
                packetType:7000,
                tableId:"",
                operationParamsItem:{
                    key_name:"",
                    key_value:"",
                },
            },
            addCluess:{//添加或修改
                packetType:4000,
                tableId:"",
                type:2,   //1:添加   2:修改
                operationParamsItem:{
                    key_name:"",
                    key_value:"",
                    paramsList:[],
                },
            },
            addClue:{//添加或修改
                packetType:3000,
                tableId:"",
                type:1,
                service_id:"",
                config_id:"",
                field_name_a:"",
                field_name_b:"",
                operationParamsItem:{
                    paramsList:[],
                },
            },
            tableId:"",
            items:[],//该模块的页面布局数据，需要异步获取 
            index:"",
            type:1,
            name:"",
            expandValue:'-1',
            list:[],//日程、文档、任务列表数据
            imageMessage:{
                images_path:"",
                images_name:"",
            },
            deptList:[],
            current:0,
            workGroupInfoArr:[],
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
             currentPage:2,
             num:10,
        }
    },
 
    computed: {
        cObj() {
            return this.model;
        },//选择的对象
       
    },
    components: {
        Bform: bform,
    },
    created(){
           
    },
    mounted(){
        //this.$parent.findJD(this.cObj.id);
    },
    methods: {
        showMessagef(){
            this.isShowMsg=true;
            this.doc.doc_name="";
        },
         //获取更多消息
         getMoreInfos(){
                this.$http.post('/web/MSG/getMsgByworkgroup_id', { workgroup_id:this.cObj.workgroup_id,pi:this.currentPage,ps:10}).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.cObj.workGroupInfoArr=this.cObj.workGroupInfoArr.concat(res.data.a);
                            this.num=this.cObj.workGroupInfoArr.length;
                            console.log(this.workGroupInfoArr);
                            this.currentPage++;
                        }
                    },
                )            
         },
         //封装上传的文件的信息
         uploadTitlePics (res, file) {
                this.doc.doc_name=res.a.name;
                this.doc.doc_path=res.a.path;
                this.doc.type=res.a.type;
         },
          //查询工作组对话详情
          findgroupMessage(workgroup_id){    
                  this.$http.post('/web/MSG/getMsgByworkgroup_id', { workgroup_id:workgroup_id,pi:1,ps:10 }).then(
                    (res) => {
                        if (res.data.b == 1) {
                            this.cObj.workGroupInfoArr = res.data.a;
                            
                           
                        }
                    },
                )
            },
         addMessages(){
                this.msgbody.msg_title = this.doc.doc_name;
                this.msgbody.msg_path = this.doc.doc_path;
                this.msgbody.msg_type = this.doc.type;
                this.msgbody.workgroup_id = this.cObj.workgroup_id;
                this.msgbody.msg_detail=this.message;

                if(this.msgbody.workgroup_id==0){
                    alert("未选择工作组");
                    return;
                }

                this.$http.post("/web/MSG/addNewWG_Msg",this.msgbody,{
                    emulateJSON: true
                }).then((res)=>{
                                if(res.data.b==1){
                                    this.$Message.success('操作成功');
                                    this.findgroupMessage(this.msgbody.workgroup_id);
                                    this.isShowMsg = false;
                                    this.message="";
                                    this.msgbody.msg_title ="";
                                    this.msgbody.msg_path ="";
                                    this.msgbody.msg_type = "";
                                    this.msgbody.workgroup_id ="";
                                    this.msgbody.msg_detail="";
                                    this.doc.doc_name="";
                                }else{
                                    this.$Message.error('发送失败');
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
         },
        //添加失单原因
        addLoseMessage(){
             this.$http.post("/web/Crm_corp_mgr_std_sales/addCrm_corp_mgr_std_salesMseeage",{sales_id:this.cObj.id,sales_losebak:this.sales_losebak}).then((res)=>{
                                if(res.data.b==1){
                                    this.$Notice.success({
                                        title: '操作成功',
                                        duration:2,
                                    });
                                    this.isAddLoseMessage=false;
                                }else{
                                    this.$Notice.error({
                                        title: '操作失败',
                                        duration:2,
                                    });
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
        },
        //显示失单窗口
        showLoseDiv(){
             this.sales_losebak="",
             //查询失单原因
              this.$http.post("/web/Crm_corp_mgr_std_sales/findSales_losebak",{sales_id:this.cObj.id}).then((res)=>{
                                if(res.data.b==1){
                                    this.sales_losebak=res.data.o.sales_losebak;
                                    this.isAddLoseMessage=true;
                                }else{
                                    this.$Notice.error({
                                        title: '操作失败',
                                        duration:2,
                                    });
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
        },
        //修改商机阶段
        steps(item){
             let arr=this.cObj.advance.map((obj)=>{return obj.sales_advance_id});
             let id=arr.indexOf(item.sales_advance_id);
             this.current=id;
             this.$http.post("/web/Crm_corp_mgr_std_sales/updateSalesState",{sales_id:this.cObj.id,sales_marketingphase:item.sales_advance_id}).then((res)=>{
                                if(res.data.b==1){
                                    this.$Notice.success({
                                        title: '操作成功',
                                        duration:2,
                                    });
                                    if(this.cObj.tableId==5){
                                        
                                    }
                                }else{
                                    this.$Notice.error({
                                        title: '操作失败',
                                        duration:2,
                                    });
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
        },
        //显示修改窗口
        showDiv(index,number){
               this.type=2;
               this.index=index;
               if(number==1){//日程
                    this.$refs.addForms.resetFields();  
                    this.schedule.schedule_content=this.list[index].schedule_content,
                    this.schedule.schedule_date=this.list[index].schedule_date,
                    this.schedule.schedule_type=this.list[index].schedule_type,
                    this.schedule.schedule_remind=this.list[index].schedule_remind,
                    this.schedule.schedule_bak=this.list[index].schedule_bak,
                    this.isAddEventRc=true;
               }else if(number==3){
                     
                    this.$refs.addFormf.resetFields();  
                    this.task.task_name=this.list[index].task_name,
                    this.task.task_starttime=this.list[index].task_starttime,
                    this.task.task_endtime=this.list[index].task_endtime,
                    this.task.task_bak=this.list[index].task_bak,
                    this.task.task_remind=this.list[index].task_remind,
                    this.task.task_type=this.list[index].task_type,
                    this.isAddEventTask=true;
               }
        },
        //文件格式
        handleFormatError(){
                this.$Message.warning('图片格式不正确');
            },
        //分装上传的文件的信息
         uploadTitlePic (res, file) {
                this.doc.doc_name=res.a.name;
                this.doc.doc_path=res.a.path;
                this.doc.state=2;
                this.doc.tableId=this.cObj.tableId;
                this.doc.keyId=this.cObj.id
                this.$http.post("/web/Crm_corp_mgr_module_config/addCrm_corp_mgr_common_scheduleById",this.doc).then((res)=>{
                                if(res.data.b==1){
                                    this.$Notice.success({
                                        title: '操作成功',
                                        duration:2,
                                    });
                                    this.isAddEventRc=false;
                                }else{
                                    this.$Notice.error({
                                        title: '操作失败',
                                        duration:2,
                                    });
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
         },
         //上传文件超过2M
        exceededSize(){
            this.$Message.warning('图片大小不能超过2M');
        },
        //添加日程等固定模块
        addMessage(num){
            if(num==1){//日程
               if(this.type==1){//添加
                   this.schedule.schedule_id="";
                   this.schedule.tableId=this.cObj.tableId;
                   this.schedule.keyId=this.cObj.id
                   this.schedule.state=1;
                    this.$refs.addForms.validate(valid => {
                        if (valid) {
                              this.$http.post("/web/Crm_corp_mgr_module_config/addCrm_corp_mgr_common_scheduleById",this.schedule).then((res)=>{
                                if(res.data.b==1){
                                    this.$Notice.success({
                                        title: '操作成功',
                                        duration:2,
                                    });
                                    this.isAddEventRc=false;
                                     let arr=[];
                                    arr.push("panelr");
                                    this.expandItem(arr);
                                }else{
                                    this.$Notice.error({
                                        title: '操作失败',
                                        duration:2,
                                    });
                                }
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
                        }
                    });
                   
               }else{
                   this.schedule.state=1;
                   this.schedule.schedule_id=this.list[this.index].schedule_id;
                   this.$refs.addForms.validate((valid) => {
                        if (valid) {
                            this.$http.post("/web/Crm_corp_mgr_module_config/updateCrm_corp_mgr_common_scheduleById",this.schedule).then((res)=>{
                                            if(res.data.b==1){
                                                this.$Notice.success({
                                                    title: '操作成功',
                                                    duration:2,
                                                });
                                                this.isAddEventRc=false;
                                                let arr=[];
                                                arr.push("panelr");
                                                this.expandItem(arr);
                                            }else{
                                                this.$Notice.error({
                                                    title: '操作失败',
                                                    duration:2,
                                                });
                                            }
                                        }).catch(function(response) {
                                            console.log(response)
                                            }
                                        );
                                    }
                                })
               }
                   
            }else if(num==2){//文档
               
            }else if(num==3){//任务
                  if(this.type==1){
                        this.task.task_id="";
                        this.task.tableId=this.cObj.tableId;
                        this.task.keyId=this.cObj.id
                        this.task.state=3;
                        this.$refs.addFormf.validate(valid => {
                            if (valid) {
                        this.$http.post("/web/Crm_corp_mgr_module_config/addCrm_corp_mgr_common_scheduleById",this.task).then((res)=>{
                                        if(res.data.b==1){
                                            this.$Notice.success({
                                                title: '操作成功',
                                                duration:2,
                                            });
                                            this.isAddEventTask=false;
                                            let arr=[];
                                            arr.push("panelru");
                                            this.expandItem(arr);
                                        }else{
                                            this.$Notice.error({
                                                title: '操作失败',
                                                duration:2,
                                            });
                                        }
                                    }).catch(function(response) {
                                        console.log(response)
                                        }
                                    );
                                        }
                                })
                  }else{
                      this.$refs.addFormf.validate(valid => {
                            if (valid) {
                        this.task.state=3;
                        this.task.task_id=this.list[this.index].task_id;
                        this.$http.post("/web/Crm_corp_mgr_module_config/updateCrm_corp_mgr_common_scheduleById",this.task).then((res)=>{
                                        if(res.data.b==1){
                                            this.$Notice.success({
                                                title: '操作成功',
                                                duration:2,
                                            });
                                            this.isAddEventTask=false;
                                            let arr=[];
                                            arr.push("panelru");
                                            this.expandItem(arr);
                                        }else{
                                            this.$Notice.error({
                                                title: '操作失败',
                                                duration:2,
                                            });
                                        }
                                    }).catch(function(response) {
                                        console.log(response)
                                        }
                                    );
                                        }
                                })
                  }
                   
            }
        },
        //显示固定模块窗口
        addRItem(e,num){
             e.stopPropagation();
             this.type=1;
            if(num==1){//日程
                this.schedule.schedule_content="";
                this.schedule.schedule_date="";
                this.schedule.schedule_type="";
                this.schedule.schedule_remind="";
                this.schedule.schedule_bak="";
                this.$refs.addForms.resetFields();
                this.isAddEventRc=true;
            }else if(num==3){//任务
                this.task.task_name="";
                this.task.task_starttime="";
                this.task.task_endtime="";
                this.task.task_bak="";
                this.task.task_remind="";
                this.task.task_type="";
                this.$refs.addFormf.resetFields();
                this.isAddEventTask=true;
            }
        },
        //分页
        getSelectedData(){

        },
        getKey() {
            console.log(this.$children);
        },
        //根据id查询业务实体详情
        findMessage(id,tableId){
                this.$http.post("/web/Crm_corp_mgr_module_config/findAllMessage",{keyId:id,tableId:tableId}).then((res)=>{
                                        if(res.data.b){
                                            this.belong_dept=res.data.o.belong_dept;
                                            this.belong_product=res.data.o.belong_product;
                                            this.belong_industry=res.data.o.belong_industry;
                                            this.belong_area=res.data.o.belong_area;
                                        }else{
                                            this.$Notice.error({
                                                title: '操作失败',
                                                duration:2,
                                            });
                                        }
                                }).catch(function(response) {
                                    console.log(response)
                                    }
                                );
        },
        addItem(e,index) {
            e.stopPropagation();
            this.type=1;
            this.addObj={};
            this.$nextTick(()=>{  
                this.$refs.addFormh.resetFields();  
            })
            this.index=index;
            this.addClue.tableId=this.cObj.list[index].service_id;
            this.addClue.service_id=this.cObj.id;
            this.addClue.config_id=this.cObj.list[index].config_id;
            this.addClue.field_name_a=this.cObj.list[index].field_name_a;
            this.addClue.field_name_b=this.cObj.list[index].field_name_b;
            this.addClue.operationParamsItem.key_name=this.cObj.list[index].field_name_b;
            this.getLayout(this.cObj.list[index].service_id);
            this.findMessage(this.cObj.id,this.cObj.tableId);
            
            this.isAddEventItem=true;
        },//触发添加事件
        shutAddItem(){
            this.isRemoveGroupUser=false;
            this.isAddLoseMessage=false;
            this.isAddEventItem=false;
            this.isAddEventRc=false;
            this.isAddEventTask=false;
        },//关闭弹出层
        subAddItem(){
            this.$refs.addFormh.validate(valid => {
                            if (valid) {
                    let id=this.addClue.field_name_b;
                    let arr=[];
                    for (let key in this.addObj){
                        if(key!=[id]){
                            let obj={"field_name":key,"field_value":this.addObj[key]};
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
                        this.addClue.operationParamsItem.paramsList=arr;
                        this.addCluess.operationParamsItem.paramsList=arr;
                
                        if(this.type==1){//添加
                             this.$http.post("/web/Crm_corp_mgr_module_config/addPublicMessage",this.addClue).then((res)=>{
                                this.expandItemss(this.index);
                                 this.$Notice.success({
                                                title: '操作成功',
                                                duration:2,
                                            });
                                this.isAddEventItem=false;
                            }).catch(function(response) {
                                console.log(response)
                                }
                            );
                        }else{
                               this.$http.post("/web/Crm_corp_mgr_module_config/updateCrm_corp_mgr_std_clue",this.addCluess).then((res)=>{
                                        if(res.data.operationParamsItem.isSuccess){
                                             this.$Notice.success({
                                                title: '操作成功',
                                                duration:2,
                                            });
                                            this.isAddEventItem=false;
                                            this.expandItemss(this.index);
                                        }else{
                                            this.$Notice.error({
                                                title: '操作失败',
                                                duration:2,
                                            });
                                        }
                                }).catch(function(response) {
                                    console.log(response)
                                    }
                                );
                        }
                        
                            }
            })
            
        },
        getLayout(tableId){
            this.additems.tableId=tableId;
            this.$http.post("/web/Crm_corp_mgr_module_config/findLayoutById",this.additems).then((res)=>{
                    this.items=res.data.operationParamsItem.backInfoList;
                    this.creatAddObj(this.addObj,this.items);
                    this.createAddRules(this.addRules,this.items);
                    }).catch(function(response) {
                            console.log(response);
                    });        
                
            
                    // this.creatAddObj(this.addObj,this.items);
                    // this.createAddRules(this.addRules,this.items);    
        },//这里根据tableId获取页面布局。生成各种表单和验证对象
        creatAddObj(targetObj,items){
                items.map((obj)=>{
            if(obj['field_defvalue']==""){
                obj['field_defvalue']=null;
            }
           targetObj[obj.field_name_db]=obj['field_defvalue'];
        });//给添加对象增加键值对。传入目标对象,和页面布局
        },//根据页面布局创建表单对象
        createAddRules(targetObj,items){
            Object.assign(targetObj,this.$myFunction.createRuleObj(items));
           // targetObj=this.$myFunction.createRuleObj(items);//创建验证规则，传入的参数为目标对象和页面布局数组
        },//根据页面布局创建验证规则的方法
        jionGroup(){
            this.deptList=[];
            this.dept="";
            this.depart_worker=[];
            this.groupMember=[];
             //查询部门
             this.$http.post("/web/Crm_corp_mgr_module_config/findDeptById",{ps:20}).then((res)=>{
                let dateList=res.data.a;
                let list=[];
                for(let i=0;i<dateList.length;i++){
                        let dept_id;
                        let dept_name;
                        for (let key in dateList[i]){
                                    let selected=[];
                                    selected=dateList[i];
                                    if(key=="dept_id"){
                                        dept_id=selected[key];
                                    }
                                    if(key=="dept_name"){
                                        dept_name=selected[key];
                                    }
                                }
                                let obj={"value":dept_id,"label":dept_name};
                                list.push(obj);
                                
                         }
                         this.deptList=list;
                         console.log(this.deptList);
         }).catch(function(response) {
                console.log(response)
                 }
        );
            this.isAddGroupUser=true;
        },//加入工作组的操作
        shutChangePerson(){
            this.groupMember=[];
            this.depart_worker=[];
            this.isAddGroupUser=false;
        },//关闭加入工作组弹出层

        //根据部门查人员
        changeDepart(){
            this.$http.post("/web/Crm_corp_mgr_module_config/findUserNameById",{dept_id:this.dept}).then((res)=>{
                let dateList=res.data.a;
                let list=[];
                for(let i=0;i<dateList.length;i++){
                        let user_id;
                        let user_name;
                        for (let key in dateList[i]){
                                    let selected=[];
                                    selected=dateList[i];
                                    if(key=="user_id"){
                                        user_id=selected[key];
                                    }
                                    if(key=="user_name"){
                                        user_name=selected[key];
                                    }
                                }
                                let obj={"user_id":user_id,"user_name":user_name};
                                list.push(obj);
                                
                         }
                         this.depart_worker=list;

             }).catch(function(response) {
                     console.log(response)
                 }
            );
        },//切换部门
        getUsersByDepart(id){
            this.depart_worker=[{user_id:1,user_name:'王桥'},{user_id:2,user_name:'张亮'},{user_id:3,user_name:'徐良'}];
        },//根据部门id获取部门用户,这里模拟了异步操作
        setChangePerson(value){
            this.groupMember.push(value);
        },//设置转让负责人为选择后的值


        //添加人员进组
        subChangePerson(){
             if(this.groupMember.length==0){
                     this.$Notice.warning({
                          title: '成员不能为空',
                          duration:2,
                      });
                     return false;
                };
            //判断选项中已有成员存在
            let state=1;
            for(let j=0;j<this.groupMember.length;j++){
                    for(let i=0;i<this.cObj.userList.length;i++){
                        if(this.cObj.userList[i].user_id==this.groupMember[j]){
                            state=2;
                        }
                    }  
            }
            if(state==2){
                      this.$Notice.warning({
                          title: '选项中已有成员存在',
                      });
                      return false;
            }
            this.depart_worker=[];
            this.$http.post("/web/Crm_corp_mgr_module_config/addUserName",{tableId:this.cObj.tableId,userIdList:this.groupMember,config_id:this.cObj.config_id,workgroup_id:this.cObj.workgroup_id,allnum:this.cObj.userList.length}).then((res)=>{
                         if(res.data.b==1){
                             this.findList();
                             this.$Notice.success({
                                title: '操作成功',
                                duration:2,
                            });
                             this.isAddGroupUser=false;
                         }else{
                             this.$Notice.error({
                                title: '操作失败',
                                duration:2,
                            });
                         }
                         
                    }).catch(function(response) {
                            console.log(response);
              });
        },
        findList(){
             //查询工作组成员
            this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_module_configById",{tableId:this.cObj.tableId,fieldName:this.cObj.fieldName,fieldValue:this.cObj.id}).then((res)=>{                  
                this.cObj.userList=res.data.a;
                console.log(res.data.a);
            }).catch(function(response) {
                console.log(response)
                }
            );
        },
        //移除成员
        removeChangePerson(){
            if(this.groupMember.length==0){
                     this.$Notice.warning({
                                title: '成员不能为空',
                                duration:2,
                            });
                     return false;
                };
            //判断移除的人中是否有责任人
            for(let j=0;j<this.groupMember.length;j++){
                   if(this.groupMember[j]==this.cObj.userId){
                          
                           this.$Notice.warning({
                                title: '不能删除责任人',
                                duration:2,
                            });
                           return false;
                        }
            }
            this.$http.post("/web/Crm_corp_mgr_module_config/delUserName",{tableId:this.cObj.tableId,userIdList:this.groupMember,config_id:this.cObj.config_id,workgroup_id:this.cObj.workgroup_id,allnum:this.cObj.userList.length}).then((res)=>{
                     if(res.data.b==1){
                             this.findList();
                             this.$Notice.success({
                                title: '操作成功',
                                duration:2,
                            });
                             this.isRemoveGroupUser=false;
                         }else{
                              this.$Notice.error({
                                title: '操作失败',
                                duration:2,
                            });
                         }
                    }).catch(function(response) {
                            console.log(response);
              });
        },
        
        
        //提交转让
        carePerson(id){
            //关注某人的操作
            console.log(id);
        },




        //移除工作组成员
        exitGroup(){
            this.depart_worker=[];
            this.groupMember=[];
            this.depart_worker=this.cObj.userList;
            this.isRemoveGroupUser=true;
        },




        reset(){
            console.log("关闭弹窗");
        },
        //删除选择项
        setShowColumns(){
            let arr=this.showTableColumns.filter(obj=>obj.isShow==true);
            this.tableHeader=arr;
             this.isShowHeaderSet=false;
        },

        editItem(index){
             this.type=2;
             this.addCluess.tableId=this.tableId;
             this.updateitems.tableId=this.tableId;
             this.updateitems.operationParamsItem.key_name=this.getList.field_name_b;
             let id=this.getList.field_name_b;
             this.addCluess.operationParamsItem.key_name=id;
             this.updateitems.operationParamsItem.key_value=this.tableData[index][id];
             this.addCluess.operationParamsItem.key_value=this.tableData[index][id];
             this.findMessage(this.cObj.id,this.cObj.tableId);
              //查询当前记录
              this.$http.post("/web/Crm_corp_mgr_module_config/findRecordMessgeCrm_corp_mgr_std_contList",this.updateitems).then((res)=>{
                    this.items=res.data.operationParamsItem.backInfoList;
                    this.creatAddObj(this.addObj,this.items);
                    this.createAddRules(this.addRules,this.items);
                    this.isAddEventItem=true; 
                    }).catch(function(response) {
                            console.log(response);
              });
              
        },
        //查询绑定的业务实体的列表
        expandItem(arr){
           let index=arr[0];
           
           if(index=="panelr"||index=="panelw"||index=="panelru"){
                this.tableData=[];//表格数据
                this.tableHeader=[{}];
                if(index=="panelr"){//查询日程
                     this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_common_scheduleById",{tableId:this.cObj.tableId,keyId:this.cObj.id,state:1}).then((res)=>{
                             this.list=res.data.a;
                     }).catch(function(response) {
                            console.log(response);
                     });
                }
                if(index=="panelw"){//查询文档
                     this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_common_scheduleById",{tableId:this.cObj.tableId,keyId:this.cObj.id,state:2}).then((res)=>{
                         this.list=res.data.a;
                     }).catch(function(response) {
                            console.log(response);
                     });
                }
                if(index=="panelru"){//查询任务
                     this.$http.post("/web/Crm_corp_mgr_module_config/findCrm_corp_mgr_common_scheduleById",{tableId:this.cObj.tableId,keyId:this.cObj.id,state:3}).then((res)=>{
                         this.list=res.data.a;
                     }).catch(function(response) {
                            console.log(response);
                     });
                }
                
           }else{
                if(index!==undefined){
                index=Number(index);
                this.index=index;
                this.getList.config_id=this.cObj.list[index].config_id;
                this.getList.field_name_a=this.cObj.list[index].field_name_a;
                this.getList.field_name_b=this.cObj.list[index].field_name_b;
                this.getList.tableId=this.cObj.list[index].service_id;
                this.tableId=this.cObj.list[index].service_id;
                this.getList.field_value=this.cObj.id;
                this.name=this.cObj.name;
                this.tableData=[],//表格数据
                this.tableHeader=[{}],
                //查询列表
                this.$http.post("/web/Crm_corp_mgr_module_config/findRecordMessgeCrm_corp_mgr_module_configList",this.getList).then((res)=>{
                            //this.backInfoList=res.data.a;
                            let field_name=res.data.operationParamsItem.backInfoList.field_name;
                            let field_value=res.data.operationParamsItem.backInfoList.field_value;
                            if(field_name!=null){
                                    this.showTableColumns=field_name;
                            }
                            if(field_value!=null){
                                    this.tableData=field_value;
                            }
                                
                                    let checkboxObj={
                                    title:'操作',
                                    type:'action',
                                    width:100,
                                    render:(h,p)=>{
                                        return h('Button',{
                                            props:{
                                                type:'primary',
                                                size:'small'
                                            },
                                            on:{
                                                click:()=>
                                                this.editItem(p.index)
                                            }
                                        },"编辑");
                                    }
                                    };
                                
                                    this.showTableColumns.map(obj=>{
                                        obj.align="center";
                                    });
                                this.showTableColumns.push(checkboxObj);
                                this.tableHeader=this.showTableColumns;
                                }).catch(function(response) {
                                console.log(response)
                                }
                            );
            }
           }
          
           
            
        },
        shutModal(){
            this.expandValue="-1";
        },
        //查询绑定的业务实体的列表
        expandItemss(index){
           if(index!==undefined){
               index=Number(index);
            
            this.getList.config_id=this.cObj.list[index].config_id;
            this.getList.field_name_a=this.cObj.list[index].field_name_a;
            this.getList.field_name_b=this.cObj.list[index].field_name_b;
            this.getList.tableId=this.cObj.list[index].service_id;
            this.tableId=this.cObj.list[index].service_id;
            this.getList.field_value=this.cObj.id;
            this.name=this.cObj.name;
            this.tableData=[],//表格数据
            this.tableHeader=[{}],
            //查询列表
            this.$http.post("/web/Crm_corp_mgr_module_config/findRecordMessgeCrm_corp_mgr_module_configList",this.getList).then((res)=>{
                           //this.backInfoList=res.data.a;
                           let field_name=res.data.operationParamsItem.backInfoList.field_name;
                           let field_value=res.data.operationParamsItem.backInfoList.field_value;
                           if(field_name!=null){
                                this.showTableColumns=field_name;
                           }
                           if(field_value!=null){
                                this.tableData=field_value;
                           }
                            
                                let checkboxObj={
                                title:'操作',
                                type:'action',
                                width:100,
                                render:(h,p)=>{
                                    return h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>
                                            this.editItem(p.index)
                                        }
                                    },"编辑");
                                }
                                };
                               
                                this.showTableColumns.map(obj=>{
                                    obj.align="center";
                                });
                            this.showTableColumns.push(checkboxObj);
                            this.tableHeader=this.showTableColumns;
                            }).catch(function(response) {
                            console.log(response)
                            }
                        );
              

           }
            
        },
        formatRate(value){
            return Number(value*100).toFixed(1)+'%';
        },
        setTime(date,obj,key){
            this[obj][key]=date;
        }
    }

}
</script>
