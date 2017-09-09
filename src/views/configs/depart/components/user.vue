
<template>
    <div :departId="selectedObj">
        <div class="item-block-title">
            <Button type="primary" icon="person-add">添加用户</Button>
            <p class="operate">
                <Button type="text" icon="ios-loop-strong" class="depart-posi"> 切换岗位</Button>
            </p>
        </div>
        <Table :columns="headerList" :data="datas" :height="tableHeight" style="clear:both;top:10px;"></Table>
    </div>
</template>
<script>
export default {
    props:['departId'],
    data() {
        return {
            headerList:[{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '工号',
                        key: 'work_num'
                    },
                    {
                        title: '电话',
                        key: 'tel_no'
                    },{
                        title: '所在部门',
                        key: 'depart'                        
                    },{
                        title: '岗位',
                        key: 'position'                        
                    },{
                        title: '上级领导',
                        key: 'shangji'                        
                    }],
            datas:[{
                user_id:1,
                name:'wangqiao',
                work_num:20,
                tel_no:"13541119331",
                depart:'市场部',
                position:"销售人员",
                shangji:"laogui"
            },{
                user_id:2,
                name:'wangqiao2',
                work_num:23,
                tel_no:"13541114331",
                depart:'市场部',
                position:"销售人员",
                shangji:"laogui"
            },{
                user_id:3,
                name:'wangqiao3',
                work_num:25,
                tel_no:"13541119335",
                depart:'市场部',
                position:"销售人员",
                shangji:"laogui"
            }],
            items: [{
                'colname': "text",
                'colvalue': '12',
                'type': 1,
            }, {
                'colname': "text2",
                'colvalue': '34',
                'type': 2,
            }],
            baseData: [],
            iseditable: true,
            selectedObj: {},
        }
    },
    computed:{
        tableHeight(){
            return document.body.clientHeight-250;
        }
    },
    created() {
        this.test();
    },
    updated(){
    },
    methods: {
        test(){
            console.log(this.departId);            
        }
    }
}
</script>
