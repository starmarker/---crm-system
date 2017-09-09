const routers = [
    {
        path: '/',
        meta: {
            title: 'SmkCRM登录页面'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    }, {
        path: '/login',
        meta: {
            title: 'SmkCRM登录页面'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    }, {
        path: '/register',
        meta: {
            title: 'SmkCRM注册页面'
        },
        component: (resolve) => require(['./views/register.vue'], resolve)
    }, {
        path: '/test',
        meta: {
            title: 'SmkCRM测试页面'
        },
        component: (resolve) => require(['./views/test.vue'], resolve)
    }, {
        path: '/config',
        meta: {
            title: 'SmkCRM首页'
        },
        component: (resolve) => require(['./views/configs/index.vue'], resolve),
        children: [
            {
                path: '/',
                meta: {
                    title: '欢迎页面'
                },
                component: (resolve) => require(['./views/configs/welcome.vue'], resolve)
            },{
                path: 'backIndex',
                meta: {
                    title: '欢迎页面'
                },
                component: (resolve) => require(['./views/configs/welcome.vue'], resolve)
            },{
                path: 'depart',
                meta: {
                    title: '部门管理'
                },
                component: (resolve) => require(['./views/configs/depart/permission.vue'], resolve)
            }, {
                path: 'yewu',
                meta: {
                    title: '标准业务对象'
                },
                component: (resolve) => require(['./views/configs/standardObject/operationObj.vue'], resolve)
            }, {
                path: 'salesType',
                meta: {
                    title: '销售机会业务类型'
                },
                component: (resolve) => require(['./views/configs/standardObject/salesType.vue'], resolve)
            },
			{
                path: 'argument',
                meta: {
                    title: '业务参数配置'
                },
                component: (resolve) => require(['./views/configs/argument.vue'], resolve)
            }, {
                path: 'logs',
                meta: {
                    title: '日志管理'
                },
                component: (resolve) => require(['./views/configs/logs.vue'], resolve)
            },{
                path: 'dataarea',
                meta: {
                title: '维度管理'
                },
                component: (resolve) => require(['./views/configs/depart/dataarea.vue'], resolve)
                }, {
                path: 'pool',
                meta: {
                    title: '后台公海池配置'
                },
                component: (resolve) => require(['./views/configs/standardObject/pool.vue'], resolve)
            }, {
                path: 'companyConfig',
                meta: {
                    title: '企业配置'
                },
                component: (resolve) => require(['./views/configs/systemConfig.vue'], resolve)
            },{
                path: 'mail',
                meta: {
                    title: '邮件管理'
                },
                component: (resolve) => require(['./views/configs/mailManager.vue'], resolve)
            }

        ]
    },//这里是后台管理页面的路由配置，管理页面的路由都需要配置在children字段中；
    {
        path: '/clients',
        meta: {
            title: 'SmkCRM首页'
        },
        component: (resolve) => require(['./views/clients/index.vue'], resolve),
        children: [
		{
            path:'/',
                meta: {
                    title: 'SmkCRM客户端首页'
                },
                component: (resolve) => require(['./views/clients/welcome.vue'], resolve)
        },{
            path:'frontIndex',
                meta: {
                    title: 'SmkCRM客户端首页'
                },
                component: (resolve) => require(['./views/clients/welcome.vue'], resolve)
        },{
            path:'marketEvents',
                meta: {
                    title: 'SmkCRM_市场活动'
                },
                component: (resolve) => require(['./views/clients/marketEvents.vue'], resolve)
        },{
            path:'clueEvents',
                meta: {
                    title: 'SmkCRM_线索管理'
                },
                component: (resolve) => require(['./views/clients/clueEvents.vue'], resolve)
        },{
            path:'userConfig',
                meta: {
                    title: 'SmkCRM_个人配置'
                },
                component: (resolve) => require(['./views/clients/personalConfig.vue'], resolve)
        },{
            path:'contMessage',
                meta: {
                    title: 'SmkCRM_合同信息'
                },
                component: (resolve) => require(['./views/clients/contMessage.vue'], resolve)
        },{
            path:'linkerMessage',
                meta: {
                    title: 'SmkCRM_联系人信息'
                },
                component: (resolve) => require(['./views/clients/linkerMessage.vue'], resolve)
        },{
            path:'salesMessage',
                meta: {
                    title: 'SmkCRM_商机信息'
                },
                component: (resolve) => require(['./views/clients/salesMessage.vue'], resolve)
        },{
            path:'customerEvents',
                meta: {
                    title: 'SmkCRM_客户信息'
                },
                component: (resolve) => require(['./views/clients/customerEvents.vue'], resolve)
        },{
            path:'clueEvents',
                meta: {
                    title: 'SmkCRM_线索管理'
                },
                component: (resolve) => require(['./views/clients/clueEvents.vue'], resolve)
        },{
            path:'customerEvents',
                meta: {
                    title: 'SmkCRM_客户管理'
                },
                component: (resolve) => require(['./views/clients/customerEvents.vue'], resolve)
        },{
            path:'linkerMessage',
                meta: {
                    title: 'SmkCRM_联系人管理'
                },
                component: (resolve) => require(['./views/clients/linkerMessage.vue'], resolve)
        },{
            path:'salesMessage',
                meta: {
                    title: 'SmkCRM_商机管理'
                },
                component: (resolve) => require(['./views/clients/salesMessage.vue'], resolve)
        },{
            path:'contMessage',
                meta: {
                    title: 'SmkCRM_合同管理'
                },
                component: (resolve) => require(['./views/clients/contMessage.vue'], resolve)
        },{
            path:'cluePoolEvents',
                meta: {
                    title: 'SmkCRM_线索公海池'
                },
                component: (resolve) => require(['./views/clients/cluePoolEvents.vue'], resolve)
        },{
            path:'customerPoolEvents',
                meta: {
                    title: 'SmkCRM_客户公海池'
                },
                component: (resolve) => require(['./views/clients/customerPoolEvents.vue'], resolve)
        },{
            path:'reportForms',
            meta: {
            title: 'SmkCRM_报表'
            },
            component: (resolve) => require(['./views/clients/reportForms.vue'], resolve)
        },{
            path: 'plan',
            meta: {
            title: 'SmkCRM_工作计划'
            },
            component: (resolve) => require(['./views/clients/workPlan.vue'], resolve)
            }]
    },//这里配置前台客户端路由，所有页面路由均配置到children字段中
    {
        path: '*',
        meta: {
            title: 'SmkCRM错误页面'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    }    
];
export default routers;