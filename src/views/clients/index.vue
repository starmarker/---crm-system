<style>
    .layout-copy {
        padding: 0 !important;
    }
</style>

<template>
    <div class="layout" >
        <Row type="flex">
            <i-col class="layout-menu-left" span="3">
                   <div class="layout-logo-left"><img :src="comInfo.logo" :alt="comInfo.name">
                    <p :title="comInfo.name">{{comInfo.name}} </p>
                    </div>
                <Menu active-name="/clients/" width="auto" :open-names="['1']" accordion @on-select="routerJump">
 						<Menu-item name="/clients/">
                            <Icon type="home"></Icon>首页
                        </Menu-item>
                        <Menu-item v-for="(el,index) in menuList" :key="el" :name="el.func_addr">
                            <Icon :type="el.func_icon"></Icon>{{el.func_name}}
                        </Menu-item>
                        
						<Menu-item name="/config/" v-if="isShowButton">
                            <Icon type="android-settings"></Icon>后台功能
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
            2015-2019 &copy; 思曼克科技
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                menuList:[],
                isShowButton: false,
                userInfo: {},
                comInfo: {},
            }
        },

        computed: {
            contentHeight() {
                let pHeight=document.body.scrollHeight-200;
                let bheight = document.body.clientHeight;
                let cheight=pHeight>bheight?pHeight:bheight;
               // cheight = cheight > 400 ? cheight : 400;
                return (cheight-140);
            },
        },
        created() {
            this.getMenu();
            this.getUserInfo();
        },
        mounted() {
        this.fixHeight();
        console.log(this.contentHeight);
        
    },
   updated(){
        this.fixHeight();
    },
        methods: {
            getMenu() {
                var url = "/web/login/goSession";
                    this.$http.post(url, {}).then(
                    (res) => {
                        if (res.data.b == 1) {
                            
                            this.menuList = res.data.o.front_menu;
                            if(res.data.o.user_level!=1){
                                this.isShowButton=true;
                            }
                        }else{
                            this.$errorHandle(res);
                        }
                    },
                )
            },
            changeMenu() {
                this.$router.push({
                    path: "/config"
                })
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
                        obj.style.height = (this.contentHeight - 140) + 'px';
                    }, this);

                }
            }, //修正内容高度
            routerJump(s) {
                this.$router.push(s);
            },
            getUserInfo() {
                this.$http.post('/web/login/getUserHead', {}).then((res) => {
                    if (res.data.b == 1) {
                        this.userInfo = res.data.a;
                        this.comInfo = res.data.o;
                    } else {
                        this.$errorHandle(res);
                    }
                })
            },
            logout() {
                console.log("退出登录");
                this.$router.push("/");
            }
        }
    }
</script>