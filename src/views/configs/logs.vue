
<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <div style="font-size:16px;">
                 <Icon type="clipboard"></Icon>日志管理
            </div>
        </div>
        <div class="layout-content-main">
            <Form inline label-position="right" :label-width="100">
                <Form-item label="用户名">
                    <Input v-model="searchObj.username"></Input>
                </Form-item>
                <Form-item label="时间">
                    <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="开始时间" @on-change="setTime($event,'searchObj','time1')"></Date-picker>
                </Form-item>
                <Form-item label="——" :label-width="50">
                    <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="结束时间" @on-change="setTime($event,'searchObj','time2')"></Date-picker>
                </Form-item>
                <Form-item>
                    <Button type="primary" icon="ios-search" @click="submitSearch"> 查询</Button>
                </Form-item>
            </Form>
            <Tabs value="1">
                <!--登录日志-->
                <Tab-pane name="1" label="登录日志">
                    <Table :columns="loginTableHeader" :data="loginData" show-footer>
                        <div slot="footer" style="float:right;margin-top:10px;margin-right:10px;">
                            <Page :total="pagetotal" @on-change="loginPage"></Page>
                        </div>
                    </Table>
                </Tab-pane>
                <!--<Tab-pane name="2" label="操作日志"></Tab-pane>
                <Tab-pane name="3" label="权限管理日志"></Tab-pane>-->
            </Tabs>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
             
            loginTableHeader:[
                {
                    title:'用户姓名',
                    key:'user_name'
                },
                {
                    title:'用户账户',
                    key:'user_account'
                },
                {
                    title:'登录时间',
                    key:'login_time'
                },
                {
                    title:'登录IP',
                    key:'login_ip'
                },
                {
                    title:'设备类型',
                    key:'login_type'
                },
                {
                    title:'操作系统',
                    key:'login_os'
                },
                {
                    title:'浏览器',
                    key:'login_browser'
                },
            ],
            time:[],
            loginData:[
            ],
            pagetotal:11,
            searchObj:{
                username:'',
                time1:'',
                time2:'',
                pi:1,
                ps:10
            },
        }
    },
    computed: {
    },
    created() {
        this.getloginList();

    },
    updated() {

    },
    methods: {
        getloginList(){
            
            var url = "/web/loginlog/getLoginLog";
                this.$http.post(url,this.searchObj,{emulateHTTP:true}).then((data) => {
                if (data.data.b == 1) {
                    // [{ name: "技术部", positions: [{ name: "UI设计师", id: 2 }, { name: "前端工程师", id: 3 }, { name: "Java工程师", id: 4 }] }, { name: "产品部", positions: [{ name: "售前工程师", id: 5 }, { name: "产品经理", id: 6 }, { name: "测试工程师", id: 7 }] }],
                    //positionData干嘛的？
                    this.pagetotal = data.data.page.total;
                    this.loginData=data.data.a;
                    }else{
                        this.$errorHandle(data);
                    }
            })
        },
        //岗位列表分页
            changeLoginListPage(c){
                this.searchObj.pi=c;
                this.$http.post('/web/loginlog/getLoginLog',this.searchObj,{emulateJSON:true}).then(
                    (res)=>{
                        if(res.data.b==1){
                            this.pagetotal = res.data.page.total;
                            this.loginData=res.data.a;
                        }else{
                            this.$errorHandle(res);
                        }
                    },
                )
            },

//         getloginList(){

//  //          this.$http.post().then((res)=>{
//                 //成功回调
//  //          }).catch((reject)=>{
//  //              console.log(reject);
//  //          });
//             this.loginData=[{
//                     user_name:'wangqiao',
//                     user_account
//                     login_time:'2017-06-05 12:32:24',
//                     login_ip:'192.168.1.123',
//                     //login_area:'四川成都',
//                     device_type:'PC端',login_type
//                     system_os:'windows 8.1',login_os
//                     brower_type:'Internet Explore 9'login_browser
//                 },
//                 ];//模拟异步
//         },
        loginPage(a){
            //分页
            this.changeLoginListPage(a);
        },
        submitSearch(){
            this.getloginList();
            console.log(JSON.parse(JSON.stringify(this.searchObj)));  
        },
        setTime(e,o,k){
            this[o][k]=e;        
        }//这里是处理时间值，将值处理成不带时区的字符串

    }
}
</script>