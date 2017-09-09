import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import Promise from 'promise-polyfill';
import qs from 'qs';
import moment from 'moment';

Vue.use(VueRouter);
Vue.use(iView);
// axios.interceptors.request.use((config) => {
//     config.data = qs.stringify(config.data);
//     return config;
// }, function(error) {
//     return Promise.reject(error);
// });
Vue.filter('format',(value,patter)=>{
    return moment(value).format(patter);
});//全局时间格式化过滤器，管道符后边跟format('yyyy-MM-dd')类型的过滤器
Vue.prototype.$http=axios;
if (!window.Promise) {
    window.Promise=Promise;
}
Vue.prototype.$myFunction=Util;
//定义一个全局的错误处理方法
Vue.prototype.$errorHandle=(data)=>{
    let r=data.data;
    console.log(r);
    if(r.i==10001){
        iView.Message.error({content:"未登录或者登陆已过期,请重新登录",duration: 3,onClose:()=>{router.push({path:'/'});}});
        
    }else if(r.i==10002){
         iView.Message.error({content:"您没有权限执行该操作",duration: 5});
    }else if(!r.i){
         iView.Message.error({content:r.ec,duration: 5});
    }
}
// 路由配置
const RouterConfig = {
    mode: 'hash',
    routes: Routers,
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});
router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
var vm=new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
