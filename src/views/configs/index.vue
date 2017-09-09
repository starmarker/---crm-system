<style>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.layout-breadcrumb {
    padding: 10px 15px 0;
}

.layout-content {
    margin-top: 3px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 10px;
}

.layout-copy {
    width:100%;float:left;
    text-align: center;
    height:40px !important;
    padding: 30px 0 30px;
    color: #9ea7b4;
}
.layout-copy p{line-height: 2;}
.layout-menu-left {
    /*background: #464c5b;*/
    background: -webkit-linear-gradient(top, #3983c8, #6da5da);
}

.layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.layout-hide-text .layout-text {
    display: none;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

.ivu-menu-light {
    background-color: transparent !important;
}

.ivu-menu {
    color: #fff !important;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background-color: #fff;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
    color: #39f;
}

.header-list {
    float: right;
    font-size: 14px;
    color: #000;
    padding-right: 10px;
}

.header-list img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    vertical-align: middle;
}

.header-list i {
    font-size: 18px;
    color: #666;
    cursor: pointer;
    vertical-align: middle;
}
.item-block{
    clear: both;
    box-shadow: 2px 2px 2px 2px #EAF0F7;
    overflow-y:auto; 
}
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <i-col class="layout-menu-left" span="3">
                <div class="layout-logo-left"><router-link to="/clients/"><img :src="comInfo.logo" :alt="comInfo.name"></router-link>
                <p :title="comInfo.name">{{comInfo.name}} </p>
                </div>                
                <Menu active-name="1-2" width="auto" :open-names="['1']" accordion @on-select="routerJump">
 						<Menu-item name="/config/">
                            <Icon type="home"></Icon>首页
                        </Menu-item>

                        <Menu-item v-for="(el,index) in menuList" :key="el" :name="el.func_addr">
                            <Icon :type="el.func_icon"></Icon>{{el.func_name}}
                        </Menu-item>

            
                        <!-- <Menu-item name="/config/depart">
                            <Icon type="lock-combination"></Icon>
                        部门岗位权限
                        </Menu-item>
                        <Menu-item name="/config/yewu">
                            <Icon type="ios-pie"></Icon>标准业务对象
                        </Menu-item>
                        <Menu-item name="/config/argument">
                            <Icon type="levels"></Icon>业务参数
                        </Menu-item>
                        
                        <Menu-item name="/config/dataarea">
                            <Icon type="clipboard"></Icon>维度管理
                        </Menu-item>
                        <Menu-item name="/config/companyConfig">
                            <Icon type="ios-gear"></Icon>企业配置
                        </Menu-item>
                        <Menu-item name="/config/salesType">
                            <Icon type="ios-pulse"></Icon>销售机会类型
                        </Menu-item>
                        <Menu-item name="/config/pool">
                            <Icon type="ios-list-outline"></Icon>后台公海池
                        </Menu-item>
                        <Menu-item name="/config/logs">
                            <Icon type="ios-paw"></Icon>日志管理
                        </Menu-item>
						<Menu-item name="/config/mail">
                            <Icon type="android-mail"></Icon>邮件管理
                        </Menu-item> -->
                        <!--<Menu-item name="/config/salesType">
                            <Icon type="clipboard"></Icon>商机业务类型
                        </Menu-item>
                        <Menu-item name="3-1">选项 1</Menu-item>
                        <Menu-item name="3-2">选项 2</Menu-item>-->
                         <Menu-item name="/clients/" v-if="isShowButton">
                            <Icon type="android-settings"></Icon>前台功能
                        </Menu-item>
                </Menu>
            </i-col>
            <i-col span="21">
                <div class="layout-header">
                    <div class="header-list">
                        <img :src="userInfo.user_url" alt="用户头像">
                        <!-- <span>{{user.crmBackUserInfoSession_Basic.user_name||}}</span> -->
                        <span>{{userInfo.user_name}}</span>
                        <span>{{userInfo.dept}}-{{userInfo.post}}</span>
                         <!-- <span>{{user.crmBackUserInfoSession_Basic.crmBackUserInfoSession_Basic_DeptsList[0].dept_name||研发部}}-{{user.crmBackUserInfoSession_Basic.crmBackUserInfoSession_Basic_PostsList[0].post_name||二货}}</span>  -->
                        &emsp;|&emsp;
                        <Icon type="power" @click.native="logout"></Icon>
                    </div>
                </div>
                <router-view></router-view>
            </i-col>
        </Row>
        <div class="layout-copy">
            <p>2015-2019 &copy; 成都思曼克</p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isShowButton:false,
            menuList:[],
            userInfo: {},
                comInfo: {},
        }
    },
    computed: {
        contentHeight() { 
            let cheight=document.body.clientHeight;
            cheight=cheight>400?cheight:400;
            return (cheight - 120) }
    },
    created () {
         this.getUserInfo();
        this.getMenu();
    },
    mounted() {
        this.fixHeight();

    },
    updated() {
        this.fixHeight();
    },
    methods: {
        getMenu(){
            var url = "/web/login/goSession";
                    this.$http.post(url, {}).then(
                    (res) => {
                        if (res.data.b == 1) {
                            
                            this.menuList = res.data.o.back_menu;
                            if(res.data.o.user_level!=2){
                                this.isShowButton=true;
                            }
                        }else{
                            this.$errorHandle(res);
                        }
                    },
                )
        },
        changeMenu(){
            this.$router.push({path:"/clients"})
        },
        fixHeight() {
            // let wHeight = document.documentElement.clientHeight || document.body.clientHeight;
            // console.log(wHeight);
            let ele = document.querySelector('.layout-content');
            let ele1 = document.querySelector('.layout-content-main');
            let ele2 = document.querySelectorAll('.item-block');
                if (ele) {
                    ele.style.height = (this.contentHeight-20) + 'px';
                }
                if (ele1) {
                    ele1.style.height = (this.contentHeight-80)+'px';
                } 
                console.log(ele2);
                if (ele2) {
                    [].forEach.call(ele2, function(obj) {
                        console.log(obj);
                        obj.style.height = (this.contentHeight - 90) + 'px';
                    }, this);

                }
        },//修正内容高度
        routerJump(s) {
            this.$router.push(s);
        },
         getUserInfo(){
            this.$http.post('/web/login/getUserHead',{}).then((res)=>{
                if(res.data.b==1){
                    this.userInfo=res.data.a;
                    this.comInfo=res.data.o;
                }else{
                    this.$errorHandle(res);
                }
            })
        },
        logout(){
            console.log("退出登录");
            this.$router.push("/");
        }
    }
}
</script>