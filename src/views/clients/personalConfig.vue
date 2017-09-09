<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color">
                    <Icon type="ios-personadd"></Icon> — </span>
                <span class="main-title-text">个人配置</span>
            </p>
    
        </div>
        <div class="layout-content-main personal">
            <Row justify="center" type="flex">
                <Col span="12">
                <h2 class="main-title-color" style="text-align:left;line-height:3;">基本信息</h2>
                <Form :model="basicForm" ref="basicForm" :rules="basicFormRule" :label-width="100" label-position="left">
                    <Form-item label="姓名">
                        <Input v-model="basicForm.user_name" disabled></Input>
                    </Form-item>
                    <Form-item label="用户名">
                        <Input :value="basicForm.user_account" disabled></Input>
                    </Form-item>
                    <Form-item label="修改密码" prop="user_pwd">
                        <Input v-model="basicForm.user_pwd" type="password"></Input>
                    </Form-item>
                    <Form-item label="确认密码" prop="pwd2">
                        <Input v-model="basicForm.pwd2" type="password"></Input>
                    </Form-item>
                    <Form-item label="手机" prop="user_tel">
                        <Input v-model="basicForm.user_tel"></Input>
                    </Form-item>
                    <Form-item label="邮箱" prop="user_mail">
                        <Input v-model="basicForm.user_mail"></Input>
                    </Form-item>
                    <Form-item label="QQ" prop="user_qq">
                        <Input v-model="basicForm.user_qq"></Input>
                    </Form-item>
                    <Form-item label="微信" prop="user_wechart">
                        <Input v-model="basicForm.user_wechart"></Input>
                    </Form-item>
                    <Form-item label="当前头像">
                        <img :src="basicForm.user_url" alt="">
                    </Form-item>
                    <Form-item label="更改头像">
                        <Upload ref="upload" :show-upload-list="true"  :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" type="drag" action="/web/PersonSettingController/addPhoto" style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                        图片大小不超过2M,图片为正方形为佳。
                    </Form-item>
                    <Form-item>
                        <Button type="primary" long style="letter-spacing:3em;" @click="updateUserInfo">提交</Button>
                    </Form-item>
                </Form>
                </Col>
            </Row>
            <Row justify="center" type="flex">
                <Col span="12">
                <h2 class="main-title-color" style="text-align:left;line-height:3;">我参与的工作组</h2>
                    <Table :columns="workGroupHeader" :data="workGroupList" :height="300" border></Table>
                </Col>
            </Row>
        </div>

    </div>
</template>
<script>
    export default {
        data() {
            // const validatePass = (rule, value, callback) => {
            //         if (value === '') {
            //             callback(new Error('请输入密码'));
            //         } else {
            //             if (this.basicForm.pwd2 !== '') {
            //                 // 对第二个密码框单独验证
            //                 this.$refs.basicForm.validateField('pwd2');
            //             }
            //             callback();
            //         }
            //     };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '' && this.basicForm.user_pwd !== '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.basicForm.user_pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };


            return {
                basicForm: {
                    user_id: "",
                    user_name: '',
                    user_mail: "",
                    user_tel: "",
                    user_url: "",
                    user_qq: "",
                    user_account: "",
                    user_wechart: "",
                    user_pwd: "",
                    pwd2: "",

                },
                basicFormRule: {
                    user_tel: [{
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    }, {
                        pattern: /^1[34578]\d{9}$/,
                        message: '请输入正确的手机号',
                        trigger: 'blur'
                    }],
                    user_mail: [{
                        required: true,
                        type: "email",
                        message: '请输入正确的邮箱',
                        trigger: 'blur'
                    }],
                    user_pwd: [{
                        type: 'string',
                        min: 8,
                        max: 16,
                        message: '密码长度介于8-16之间',
                        trigger: 'blur'
                    }],
                    pwd2: [{
                        validator: validatePassCheck,
                        trigger: 'blur'
                    }]
                },
                imgName: '',
                visible: false,
                uploadList: [],
                workGroupHeader: [{
                    title: '工作组名称',
                    key: 'workgroup_name'
                }, {
                    title: '操作',
                    type: 'action',
                    key: 'action',
                    render: (h, p) => {
                        let id = p.row.workgroup_id;
                        return h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.exitGroup(id);
                                }
                            }
                        }, '退出工作组')
                    }
                }],
                workGroupList: [],
            }
        },
        computed: {
            //这里是同步全局store文件中的数据
            contentHeight() {
                let cheight = document.body.clientHeight;
                cheight = cheight > 400 ? cheight : 400;
                return (cheight - 120);
            },
        },
        mounted() {
            this.uploadList = this.$refs.upload.fileList;
        },
        created() {
            //加载个人信息
            this.findUserInfo();
            //加载工作组信息
            this.findWorkgroupInfo();
        },
        methods: {
            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                this.basicForm.user_url = res.o;
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload() {
                const check = this.uploadList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 1 张图片。'
                    });
                }
                return check;
            },

            //查询个人信息
            findUserInfo() {
                this.$http.post("/web/PersonSettingController/findPersonInfo", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.basicForm.user_id = res.data.o.user_id;
                        this.basicForm.user_name = res.data.o.user_name;
                        this.basicForm.user_url = res.data.o.user_url;
                        this.basicForm.user_tel = res.data.o.user_tel;
                        this.basicForm.user_mail = res.data.o.user_mail;
                        this.basicForm.user_account = res.data.o.user_account;
                        this.basicForm.user_qq = res.data.o.user_qq;
                        this.basicForm.user_wechart = res.data.o.user_wechart;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },
            //修改个人信息
            updateUserInfo() {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        this.$http.post("/web/PersonSettingController/updatePersonInfo", this.basicForm, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.findUserInfo();
                                        this.$refs.upload.clearFiles();
                                    }
                                })
                            } else {
                                // this.$Message.error({
                                //     content: '操作失败',
                                //     duration: 1,
                                //     onClose: () => {
                                //         this.findUserInfo();
                                //         this.$refs.upload.clearFiles();
                                //     }
                                // });
                                this.$errorHandle(res);
                                this.$refs.upload.clearFiles();

                                // this.$Notice.error({
                                //     title: '操作失败',
                                //     desc: res.data.ec,
                                //     onClose: () => {
                                //         this.findUserInfo();
                                //         this.$refs.upload.clearFiles();
                                //     }
                                // });
                            }

                        }).catch((res) => {
                            this.$Message.error({
                                content: '操作失败，原因未知',
                                duration: 1,
                                onClose: () => {
                                    this.findUserInfo();
                                    this.$refs.upload.clearFiles();
                                }
                            });
                        });

                    }
                });
            },
            //加载工作组
            findWorkgroupInfo() {
                this.$http.post("/web/PersonSettingController/findWorkgroupInfo", {}, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.workGroupList = res.data.a;
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {

                });
            },
            //退出工作组
            exitGroup(id) {
                this.$http.post("/web/PersonSettingController/quitWorkgroup", {
                    "workgroup_id": id
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.findWorkgroupInfo();
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    this.$Message.error({
                        content: '操作失败，原因未知',
                        duration: 1,
                        onClose: () => {

                        }
                    });
                });
            },

        },
    }
</script>