<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p class="main-title">
                <span class="main-title-color"><Icon type="ios-world-outline"></Icon> — </span>
                <span class="main-title-text">报表</span></p>
 
                <div>筛选：
                     选择报表:<Select v-model="findObj.tableId" @on-change="tableChange" style="width:200px;">
                        <Option value="1">市场活动</Option>
                        <Option value="2">线索</Option>
                        <Option value="3">客户</Option>
                        <Option value="4">联系人</Option>
                        <Option value="5">销售机会</Option>
                        <Option value="6">合同</Option>
                    </Select>
                    <Button-Group>
                        <Button size="small" @click="timeChange(1)" :class="{'active':timeSelect==1}">本月</Button>
                        <Button size="small" @click="timeChange(2)" :class="{'active':timeSelect==2}">本周</Button>
                        <Button size="small" @click="timeChange(0)" :class="{'active':timeSelect==0}">全部</Button>
                    </Button-Group>
                    <!-- <Button-Group style="margin-left:10px;">
                        <Button size="small" @click="workGroupChange(1)" :class="{'active':joinSelect==1}">参与</Button>
                        <Button size="small" @click="workGroupChange(2)" :class="{'active':joinSelect==2}">我的</Button>
                        <Button size="small" @click="workGroupChange(0)" :class="{'active':joinSelect==0}">全部</Button>
                    </Button-Group> -->
                    <!-- <Button-Group style="margin-left:10px;">
                        <Button size="small" @click="statusChange(1)" :class="{'active':statusSelect==1}">进行中</Button>
                        <Button size="small" @click="statusChange(2)" :class="{'active':statusSelect==2}">已完成</Button>
                        <Button size="small" @click="statusChange(0)" :class="{'active':statusSelect==0}">全部</Button>
                    </Button-Group> -->
                    数据范围: <Select style="width:200px;" v-model="findObj.dataArea" @on-change="dataareaChange">
                        <Option value="1">本人</Option>
                        <Option value="2">本部门</Option>
                        <Option value="3">本人及下属</Option>
                        <Option value="4">本部门及下属部门</Option>
                        <Option value="5" >全部</Option>
                    </Select>
                    <Poptip placement="bottom-end" width="200" v-model="isShowHeaderSet" title="设置显示条目">
                    <Button type="text" icon="ios-cog"> 设置</Button>
                        <div class="api" slot="content">
                            <!--<Checkbox-group v-model="tempArr">-->
                                <Checkbox v-for="(el,index) in showTableColumns" :key="index" v-model="el.isShow">{{el.title}}</Checkbox>
                            <!--</Checkbox-group>-->
                                <Button type="primary" size="small" long style="float:left;" @click="setTableHeader">确定</Button>                                     
                        </div>
                </Poptip>
                <Button type="primary" icon="arrow-down-a" @click="exportTable">数据导出</Button>
                
                </div>

        </div>
        <div class="layout-content-main">
            <Table :columns="tableHeader" :data="tableData" show-footer :height="tableHeight" >
                <div slot="footer">
                    <Page :total="total" :current="pageCurrent" style="float:right;margin-right:20px;" show-total  @on-change="changePage"></Page>
                </div>                        
            </Table>
        </div>
    </div>
</template>
<script>
    import Bform from '../publicComponents/builtFormItem';
    import Detail from '../publicComponents/details';
    export default {

        data() {
            return {
                tableHeader: [{}], //表格页头最终显示字段
                tableData: [], //表格数据
                showTableColumns: [{}],
                total: 0,
                pageCurrent: 1,
                isShowHeaderSet: false,
                findObj: {
                    pi: 1,
                    ps: 10,
                    tableId: "1", //业务对象ID
                    filterTime: 0, //时间
                    //                    filterGroup: 0, //工作组
                    // filterStatus: 0, //状态
                    dataArea: "1", //数据范围
                    excelParam: [], //表头
                },
                timeSelect: 0,
                //                joinSelect: 0,
                //        statusSelect: 0,
            }
        },

        // 创建组件生命周期
        created() {
            this.getHeader();
            //this.getTableData();
        },

        // 计算属性
        computed: {
            tableHeight() {
                let pHeight=document.body.scrollHeight;
                let bheight = document.body.clientHeight;
                let cHeight=pHeight>bheight?pHeight:bheight;
               // cheight = cheight > 400 ? cheight : 400;
                return this.tableData.length > 1 ? (cHeight - 320) : 0;
            }
        },

        // 组件注册
        components: {
            bForm: Bform,
            Detail: Detail,
        }, //注册组件，上边import进来的自定义组件需要在这里注册一下才能使用


        // 方法
        methods: {
            getHeader() {
                this.$http.post("/web/ReportFormsController/reportFormsList", this.findObj, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.showTableColumns = res.data.a.field_name;
                        this.tableData = res.data.a.field_value;
                        this.total = res.data.page.total;
                        this.pageCurrent = res.data.page.pageIndex;
                        //this.showTableColumns.unshift(checkboxObj);
                        this.showTableColumns.map(obj => {
                            obj.align = "center";
                            obj.sortable = true;
                            obj.label = obj.title;
                            obj.isShow = true;
                        });
                        this.tableHeader = this.showTableColumns;

                        console.log(this.tableHeader);
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response);
                });
            }, //模拟异步获取页头所有字段信息，注意，第一项可能需要获取之后再添加，因为第一项是复选框，后台是不会传过来的

            getTableData() {

            },
            setTableHeader() {
                this.tableHeader = this.showTableColumns.filter(obj => {
                    return obj.isShow === true;
                });
                this.isShowHeaderSet = false;
            },
            //分页
            changePage(c) {
                this.findObj.pi = c;
                this.getHeader();
            },
            //按业务对象查询
            tableChange() {
                this.findObj.pi = 1;
                this.getHeader();
            },
            timeChange(t) {
                this.timeSelect = t;
                this.findObj.pi = 1;
                this.findObj.filterTime = t;
                this.getHeader();
            },
            // workGroupChange(t) {
            //     this.joinSelect = t;
            //     this.findObj.pi = 1;
            //     this.findObj.filterGroup = t;
            //     this.getHeader();
            // },
            // statusChange(t) {
            //     this.statusSelect = t;
            //     this.findObj.pi = 1;
            //     this.findObj.filterStatus = t;
            //     this.getHeader();
            // },
            dataareaChange() {
                this.findObj.pi = 1;
                this.getHeader();
            },
            //导出数据
            exportTable() {
                this.findObj.excelParam = this.tableHeader;
                this.$http.post("/web/ReportFormsController/exportReportFormsList", this.findObj, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        window.open(res.data.o);
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response);
                });
            },
        }
    }
</script>