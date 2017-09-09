

<template>
    <div>
        <div class="body-bg"></div>
        <div class="block">
            <img src="../images/smk_logo.png" alt="smk_crm文字logo" class="text-logo">
            <Form ref="loginForm" :model="loginObj" :rules="loginRule" style="margin-top:20px;">
                <Form-item prop="username">
                    <Input type="text" v-model="loginObj.username" placeholder="用户名"></Input>
                </Form-item>
                <Form-item prop="pwd">
                    <Input type="password" v-model="loginObj.pwd" placeholder="密码"></Input>
                </Form-item>
                <Form-item prop="authcode" >
                    <Input type="text" v-model="loginObj.authcode" placeholder="验证码" class="authcode"></Input>
                    <img @click="flush_code" :src="code_url" class="auth-logo" >
                </Form-item>
            </Form>
            <button type="default" style="width:340px;" @click="login" class="login-button">登&emsp;录</button>
            <button type="default" style="width:340px;" @click="reset" class="reset-button">取&emsp;消</button>
            <p class="block-tips">点击<a href="/crm/upload/smkcrm.doc">下载操作文档</a></p>
        </div>
    </div>
    

</template>
<script>
import store from './store';
    export default {
        data(){
            return {
                loginObj:{
                    "username":"",
                    "pwd":"",
                    "authcode":'',

                },
                code_url:"",
                loginRule:{
                    username:[{
                        required:true,
                        message:'用户名不能为空',
                        trigger:'blur'
                    }],
                    pwd:[{
                        required:true,
                        message:'密码不能为空',
                        trigger:'blur'
                    },{
                        type:'string',
                        min:6,
                        message:'密码不能少于6位',
                        trigger:'blur'
                    }],
                    authcode:[{
                        required:true,
                        message:'验证码不能为空',
                        trigger:'blur'
                    }],
                },
                rloginObj:{},
            }
        },
        created(){
            this.rloginObj=JSON.parse(JSON.stringify(this.loginObj))
            this.flush_code();
        },
        methods: {
            flush_code(){
                this.code_url = "/web/CommonController/authCode?abc="+Math.random();
            },
            handleStart () {
                this.$Modal.info({
                    title: 'Bravo',
                    content: 'Now, enjoy the convenience of iView.'
                });
            },
            setStore(obj){
                this.$store.commit('login',obj);
            },
            login(){
                let str=this.$myFunction.isPc?'PC端':'移动端';
                this.loginObj.os_type=this.$myFunction.getOsType();
                this.loginObj.brower_type=this.$myFunction.getBrowerType();
                this.loginObj.device_type=str;
                this.$refs.loginForm.validate((valid)=>{
                    if(valid){
                        this.$http.post("/web/login/goLogin",this.loginObj).then((res)=>{
                        if(res.data.b==1){                          
                          //this.setStore(res.data.a);  //写入store里面的方法，先注释，看后续是否使用    
                            if(res.data.a.user_level!=2){
                                this.$router.push({path:"/clients"})
                            }else{
                                this.$router.push({path:"/config"})
                            }
                            
                        }else{
                            this.$Message.error({content:res.data.ec,onClose:()=>{
                                this.loginObj.authcode="";
                                this.flush_code();
                            }
                            })

                        }

                    }).catch(function(response) {
                        console.log("登录失败");
                        console.log(response)
                    });
                    }
                })
            },
            reset(){
                this.loginObj=JSON.parse(JSON.stringify(this.rloginObj));
            }

        }
    }
</script>
