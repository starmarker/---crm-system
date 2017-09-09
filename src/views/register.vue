
<template>
    <div>
        <div class="body-bg"></div>
        <ul class="register-progress">
            <li>
                <p>注册</p>
                <Icon type="arrow-down-b" v-if="curTab==1"></Icon>
            </li>
            <li style="margin-left:55px;">
                <p>验证</p>
                <Icon type="arrow-down-b" v-if="curTab==2"></Icon>
            </li>
            <li style="float:right;">
                <p>通过</p>
                <Icon type="arrow-down-b" v-if="curTab==3"></Icon>
            </li>
        </ul>
        <!--第一步-->
        <div class="block" style="top:220px;" v-if="curTab==1">
            <img src="../images/smk_logo.png" alt="smk_crm文字logo" class="text-logo">
            <Form ref="loginForm" :model="loginObj" :rules="loginRule" style="margin-top:20px;">
                <Form-item prop="username">
                    <Input type="text" v-model="loginObj.username" placeholder="手机号或者邮箱"></Input>
                </Form-item>
                <Form-item prop="authcode" style="width:200px;">
                    <Input type="text" v-model="loginObj.authcode" placeholder="验证码"></Input>
                </Form-item>
            </Form>
            <button type="default" style="width:340px;" @click="login" class="login-button">下&emsp;一&emsp;步</button>
            <p class="block-tips">
                <Checkbox v-model="single">接受
                    <router-link to="">《xxx产品服务协议》</router-link>
                </Checkbox>
            </p>
        </div>
        <!--第二步-->
        <div class="block" style="top:220px;" v-if="curTab==2">
            <img src="../images/smk_logo.png" alt="smk_crm文字logo" class="text-logo">
            <p class="text-tips">验证码已经发送到你的手机或者邮箱</p>
            <Input type="text" v-model="second_code" placeholder="验证码" style="width:200px;margin-top:20px;margin-bottom:20px;"></Input>
            <Button type="primary" @click="send_code" :disabled="isCouldSend">重新发送(
                <span style="color:red;"> {{remainTime}} </span>S)</Button>
            <button type="default" style="width:340px;" @click="register_step2" class="login-button">下&emsp;一&emsp;步</button>
            <p class="block-tips">
                <Checkbox v-model="single">接受
                    <router-link to="">《xxx产品服务协议》</router-link>
                </Checkbox>
            </p>
        </div>
        <!--第三步-->
        <div class="block" style="top:220px;" v-if="curTab==3">
            <Form ref="regForm" :model="regObj" :rules="regRule" style="margin-top:20px;">
                <Form-item prop="company_name">
                    <Input type="text" v-model="regObj.company_name" placeholder="公司名称(必填)"></Input>
                </Form-item>
                <Form-item prop="username">
                    <Input type="text" v-model="regObj.username" placeholder="手机号或者邮箱(必填)"></Input>
                </Form-item>
                <Form-item prop="pwd">
                    <Input type="password" v-model="regObj.pwd" placeholder="密码(必填)"></Input>
                </Form-item>
                <Form-item prop="pwd2">
                    <Input type="password" v-model="regObj.pwd2" placeholder="确认密码(必填)"></Input>
                </Form-item>
                <Form-item style="width:200px;">
                    <Input type="text" v-model="regObj.i_code" placeholder="邀请码(非必填)"></Input>
                </Form-item>
            </Form>
            <button type="default" style="width:340px;" @click="submitReg" class="login-button">完&emsp;成</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        const confirmPwd = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请再次输入密码"))
            } else if (value != this.regObj.pwd) {
                callback(new Error("两次输入不一致"))
            } else {
                callback();
            }
        };
        //自定义验证规则，在前边手机号输入获取验证码的时候需要检测重复一样可以在这里实现
        return {
            curTab: 3,
            single: false,
            second_code: '',
            regObj: {
                "company_name": "",
                "username": "",
                "pwd": "",
                "pwd2": "",
                "i_code": "",
                "authcode": ''
            },

            regRule: {
                company_name: [{
                    required: true,
                    message: '公司名不能为空',
                    trigger: 'blur'
                }],
                username: [{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                }],
                pwd: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }, {
                    type: 'string',
                    min: 6,
                    message: '密码不能少于6位',
                    trigger: 'blur'
                }],
                pwd2: [{
                    validator: confirmPwd, trigger: "blur",
                }]
            },
            rloginObj: {},
            remainTime: 10,
            CouldSend: true,
            regObj: {

            },//注册提交对象
        }
    },
    mounted() {
        let c = setInterval(() => {
            this.remainTime--;
            if (this.remainTime <= 0) {
                clearInterval(c);
            }
        }, 1000)//重新发送验证码的定时器
    },
    computed: {
        isCouldSend() {
            return this.remainTime > 0;
        }
    },
    methods: {
        handleStart() {
            this.$Modal.info({
                title: 'Bravo',
                content: 'Now, enjoy the convenience of iView.'
            });
        },
        login() {
            //console.log(this.loginObj);
            console.log(JSON.parse(JSON.stringify(this.loginObj)));
        },
        reset() {
            this.loginObj = JSON.parse(JSON.stringify(this.rloginObj));
        },
        send_code() {
            console.log("发送code");
        },
        register_step2() {
            //异步提交第一步的手机号和第二步的验证码，成功则进入第三步，即this.curTab=3;
            let url = '';
            this.$http.post(url, this.authcode, { emulateJSON: true }).then(res => {

            }, rej => { this.$Message.error("错了") }).catch(error => {
                this.$Message.error("服务器不想和你说话，并给你抛了一个error");
            })
        },
        submitReg() {
            let url = '';//定义提交注册接口url
            this.$http.post(url, this.authcode, { emulateJSON: true }).then(res => {
                //注册成功的逻辑判断，成功后跳转到登录窗口this.$route.push()方法跳转;
            }, rej => { this.$Message.error("错了") }).catch(error => {
                this.$Message.error("服务器不想和你说话，并给你抛了一个error");
            })
        }

    }
}
</script>
