<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <div style="font-size:16px;">
                 <Icon type="clipboard"></Icon>邮件管理
            </div>
        </div>
        <!--邮箱信息-->


        <div class="layout-content-main">
            <!--<Form inline label-position="right" :label-width="100">
                <Form-item label="用户名">
                    <Input v-model=""></Input>
                </Form-item>
                <Form-item label="时间">
                    <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始时间" @on-change=""></Date-picker>
                </Form-item>
                <Form-item label="——" :label-width="50">
                    <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="结束时间" @on-change=""></Date-picker>
                </Form-item>
                <Form-item>
                    <Button type="primary" icon="ios-search" @click=""> 查询</Button>
                </Form-item>
            </Form>-->
            <Tabs value="1">
                <!--已发送的邮件-->
                <Tab-pane name="1" label="已发送邮件">
                    <Table :columns="loginTableHeader" :data="logData" show-footer>
                        <div slot="footer" style="float:right;margin-top:10px;margin-right:10px;">
                            <Page :total="pagetotal" @on-change=""></Page>
                        </div>
                    </Table>
                </Tab-pane>
                <Tab-pane name="2" label="邮箱配置">
            <Row justify="center" type="flex">
                <Col span="12">
                <h2 class="main-title-color" style="text-align:left;line-height:3;">邮箱信息</h2>
                <Form :model="mailForm" ref="mailForm" :rules="basicFormRule" :label-width="100" label-position="left">
                    <Form-item label="邮箱帐号" prop="mail_account">
                        <Input v-model="mailForm.mail_account" ></Input>
                    </Form-item>
                    <Form-item label="邮箱密码" prop="mail_pwd">
                        <Input v-model="mailForm.mail_pwd" ></Input>
                    </Form-item>
                     <Form-item label="服务器地址" prop="mail_host">
                        <Input v-model="mailForm.mail_host" ></Input>
                    </Form-item>
                    <Form-item label="端口" prop="mail_port">
                        <Input v-model="mailForm.mail_port" ></Input>
                    </Form-item>
                    <Form-item label="协议" prop="mail_protocol">
                        <Input v-model="mailForm.mail_protocol"></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" long style="letter-spacing:3em;" @click="submitMailInfo">提交</Button>
                    </Form-item>
                </Form>
                </Col>
            </Row>
                </Tab-pane>
            </Tabs>
        </div>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                pagetotal: 0,
                loginTableHeader: [{
                    title: '发件人',
                    key: 'mail_log_fromers'
                }, {
                    title: '发送时间',
                    key: 'mail_log_fromtime'
                }, {
                    title: '接收人',
                    key: 'mail_log_receivers'
                }, {
                    title: '发送状态',
                    key: 'mail_log_status',
                    render(h, p) {
                        let value = p.row.mail_log_status;

                        let result = value == 1 ? '成功' : '失败';
                        return h('span', result);
                    }
                }, {
                    title: '邮件主题',
                    key: 'mail_log_title'
                }, {
                    title: '邮件内容',
                    key: 'mail_log_console'
                }],
                mailForm: {
                    mail_id: "",
                    mail_host: "",
                    mail_account: '',
                    mail_pwd: '',
                    mail_port: '',
                    mail_protocol: ''
                },
                basicFormRule: {
                    mail_account: [{
                        type: 'string',
                        required: true,
                        message: '邮箱帐号不能为空',
                        trigger: 'blur'
                    }],
                    mail_pwd: [{
                        type: 'string',
                        required: true,
                        message: '邮箱密码不能为空',
                        trigger: 'blur'
                    }],
                    mail_host: [{
                        type: 'string',
                        required: true,
                        message: '服务器地址不能为空',
                        trigger: 'blur'
                    }],
                    mail_port: [{
                        type: 'string',
                        required: true,
                        message: '端口不能为空',
                        trigger: 'blur'
                    }],
                    mail_protocol: [{
                        type: 'string',
                        required: true,
                        message: '协议不能为空',
                        trigger: 'blur'
                    }],
                },
                logData: [],
            }
        },
        computed: {

        },
        created() {
            this.findMailInfo();
            this.findMailLogInfo();
        },
        methods: {
            //查询邮箱信息
            findMailInfo() {
                this.$http.post("/web/Crm_corp_msg_mail/findCrm_corp_msg_mail", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.mailForm.mail_id = res.data.o.mail_id;
                        this.mailForm.mail_host = res.data.o.mail_host;
                        this.mailForm.mail_account = res.data.o.mail_account;
                        this.mailForm.mail_pwd = res.data.o.mail_pwd;
                        this.mailForm.mail_port = res.data.o.mail_port;
                        this.mailForm.mail_protocol = res.data.o.mail_protocol;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },
            //查询邮件信息
            findMailLogInfo() {
                this.$http.post("/web/Crm_corp_msg_mail_log/findCrm_corp_msg_mail_logList", {
                    pi: 1,
                    ps: 10
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.logData = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },
            //新增/编辑邮箱信息
            submitMailInfo() {
                let url = "";
                if (this.mailForm.mail_id) { //编辑
                    url = "/web/Crm_corp_msg_mail/updateCrm_corp_msg_mail";
                } else { //新增
                    url = "/web/Crm_corp_msg_mail/addCrm_corp_msg_mail";
                }
                this.$refs.mailForm.validate((valid) => {
                    if (valid) {
                        this.$http.post(url, this.mailForm, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.findMailInfo();
                                        this.findMailLogInfo();
                                    }
                                })
                            } else {
                                this.$errorHandle(res);
                            }

                        }).catch(function(response) {
                            this.$Message.error({
                                content: '操作异常',
                                duration: 1,
                                onClose: () => {

                                }
                            })
                        });
                    }
                });
            },

        },
    }
</script>