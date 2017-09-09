<template>
    <div class="layout-content">
        <div class="layout-breadcrumb">
            <p style="font-size:16px;">
                <Icon type="lock-combination"></Icon> 维度管理</p>
        </div>
        <div class="layout-content-main">
            <Row :gutter="24" type="flex">
                <!--区域 -->
                <Col span="8">
                    <div class="item-block">
                        <div class="item-block-title">区域
                            <p class="operate" :class="{'active':isAreaEditable}">
                                <Icon type="plus" @click.native="addArea"></Icon>
                                <Icon type="trash-a" @click.native="showDelBlock"></Icon>
                                <Icon type="edit" @click.native="updateArea"></Icon>
                            </p>
                        </div>
                        <Tree ref="areaData" :data="areaData"  class="left-tree"  @on-select-change="getCheckedNodes"></Tree>
                    </div>
                </Col>

                 <!-- 产品 -->
                <Col span="8">
                    <div class="item-block">
                        <div class="item-block-title">产品
                            <p class="operate" :class="{'active':isProductEditable}">
                                <Icon type="plus" @click.native="addProduct"></Icon>
                                <Icon type="trash-a" @click.native="showDelBlock2"></Icon>
                                <Icon type="edit" @click.native="updateProduct"></Icon>
                            </p>
                        </div>
                        <Tree ref="productData" :data="productData" class="left-tree"  @on-select-change="getCheckedNodes2"></Tree>
                    </div>
                </Col>

                 <!--行业 -->
                <Col span="8">
                    <div class="item-block">
                        <div class="item-block-title">行业
                            <p class="operate" :class="{'active':isIndustryEditable}">
                                <Icon type="plus" @click.native="addIndustry"></Icon>
                                <Icon type="trash-a" @click.native="showDelBlock3"></Icon>
                                <Icon type="edit" @click.native="updateIndustry"></Icon>
                            </p>
                        </div>
                        <Tree ref="industryData" :data="industryData"  class="left-tree"  @on-select-change="getCheckedNodes3"></Tree>
                    </div>
                </Col>
                </Row>
            </div>
            <!--添加区域-->
            <Modal title="添加/修改区域" v-model="isAddArea" class="dataarea">
                <Form  :label-width="100" label-position="right" :model="areaObj" :rules="areaObjValidate" ref="areaObj">
                    <Form-item label="名称" prop="dataarea_tree_name">
                        <Input v-model="areaObj.dataarea_tree_name"></Input>
                    </Form-item>
                    <Form-item label="上级节点" prop="parent_dataarea_tree_id">
                        <Select filterable v-model="areaObj.parent_dataarea_tree_id" >
                   <!--         <Option :value="1" v-for="items in item.positions">全部</Option> -->
                   <!--         <Option-group :label="item.name" v-for="(item,index) in positionData" :key="index">  -->
                                <Option v-for="(item,index) in areaList" :value="item.dataarea_tree_id" :key="item.dataarea_tree_id">{{ item.dataarea_tree_name }}</Option>
                       <!--     </Option-group>  -->
                        </Select>
                    </Form-item>
                </Form>	
                <div slot="footer">
                    <Button @click="shutAreaBlock">取消</Button>
                    <Button type="primary" @click="submitAddArea">确定</Button>
                </div>
            </Modal>

            <!-- 添加产品  -->
            <Modal title="添加/修改产品" v-model="isAddProduct" class="dataarea">
                <Form :label-width="100" label-position="right" :model="productObj" :rules="productObjValidate" ref="rproductObj">
                    <Form-item label="名称" prop="dataarea_tree_name">
                        <Input v-model="productObj.dataarea_tree_name"></Input>
                    </Form-item>
                    <Form-item label="上级节点" prop="parent_dataarea_tree_id">
                        <Select filterable v-model="productObj.parent_dataarea_tree_id" >
                   <!--         <Option :value="1" v-for="items in item.positions">全部</Option> -->
                   <!--         <Option-group :label="item.name" v-for="(item,index) in positionData" :key="index">  -->
                                <Option v-for="(item,index) in productList" :value="item.dataarea_tree_id" :key="item.dataarea_tree_id">{{ item.dataarea_tree_name }}</Option>
                       <!--     </Option-group>  -->
                        </Select>
                    </Form-item>
                </Form>	
                <div slot="footer">
                    <Button @click="shutProductBlock">取消</Button>
                    <Button type="primary" @click="submitAddProduct">确定</Button>
                </div>
            </Modal>

            <!-- 添加行业  -->
            <Modal title="添加/修改行业" v-model="isAddIndustry" class="dataarea">
                <Form :label-width="100" label-position="right" :model="industryObj" :rules="industryObjValidate" ref="industryObj">
                    <Form-item label="名称" prop="dataarea_tree_name">
                        <Input v-model="industryObj.dataarea_tree_name"></Input>
                    </Form-item>
                    <Form-item label="上级节点" prop="parent_dataarea_tree_id"> 
                        <Select filterable v-model="industryObj.parent_dataarea_tree_id" >
                   <!--         <Option :value="1" v-for="items in item.positions">全部</Option> -->
                   <!--         <Option-group :label="item.name" v-for="(item,index) in positionData" :key="index">  -->
                                <Option v-for="(item,index) in industryList" :value="item.dataarea_tree_id" :key="item.dataarea_tree_id">{{ item.dataarea_tree_name }}</Option>
                       <!--     </Option-group>  -->
                        </Select>
                    </Form-item>
                </Form>	
                <div slot="footer">
                    <Button @click="shutIndustryBlock">取消</Button>
                    <Button type="primary" @click="submitAddIndustry">确定</Button>
                </div>
            </Modal>

    </div>
</template>
<script>
    export default {
        data() {
            return {

                //区域
                isAreaEditable: true,
                selectedObj: {},
                checkedNodes: [],
                isAddArea: false,
                areaObj: {}, //区域对象
                areaList: [], //区域原始数据
                areaData: [], //区域
                areaObjValidate: {
                    dataarea_tree_name: [{
                        type: 'string',
                        required: true,
                        message: '名称不能为空',
                        trigger: 'blur'
                    }],
                    parent_dataarea_tree_id: [{
                        type: 'number',
                        required: true,
                        message: '上级节点不能为空',
                        trigger: 'change'
                    }],
                },


                //产品
                isProductEditable: true,
                selectedObj2: {},
                checkedNodes2: [],
                isAddProduct: false,
                productObj: {}, //产品对象
                productList: [], //产品原始数据
                productData: [], //产品
                productObjValidate: {
                    dataarea_tree_name: [{
                        type: 'string',
                        required: true,
                        message: '名称不能为空',
                        trigger: 'blur'
                    }],
                    parent_dataarea_tree_id: [{
                        type: 'number',
                        required: true,
                        message: '上级节点不能为空',
                        trigger: 'change'
                    }],
                },


                //行业
                isIndustryEditable: true,
                selectedObj3: {},
                checkedNodes3: [],
                isAddIndustry: false,
                industryObj: {}, //产品对象
                industryList: [], //产品原始数据
                industryData: [], //产品
                industryObjValidate: {
                    dataarea_tree_name: [{
                        type: 'string',
                        required: true,
                        message: '名称不能为空',
                        trigger: 'blur'
                    }],
                    parent_dataarea_tree_id: [{
                        type: 'number',
                        required: true,
                        message: '上级节点不能为空',
                        trigger: 'change'
                    }],
                },


            }

        },
        computed: {

        },
        created() {
            this.findAllAreaInfo();
            this.findAllProductInfo();
            this.findAllIndustryInfo();
        },
        methods: {
            getSelectedNode(a) {
                console.log(a);

                // console.log(JSON.parse(JSON.stringify(a)));
                this.selectedObj = a[0];
                // this.$refs.users.test();
                this.checkedNodes = a;
            }, //被选中的部门（单个或没有,这里还要做异步获取用户和岗位的操作）
            getCheckedNodes(nodes) {
                this.selectedObj = nodes[0];
                this.checkedNodes = nodes;

                console.log(nodes);
            }, //获取被勾选的项目，可以多选（这里只是辅助，其实只有删除部门可以多选）
            getSelectedNode2(a) {
                console.log(a);

                // console.log(JSON.parse(JSON.stringify(a)));
                this.selectedObj2 = a[0];
                // this.$refs.users.test();

            }, //被选中的部门（单个或没有,这里还要做异步获取用户和岗位的操作）
            getCheckedNodes2(nodes) {
                this.checkedNodes2 = nodes;
                this.selectedObj2 = nodes[0];
                console.log(nodes);
            }, //获取被勾选的项目，可以多选（这里只是辅助，其实只有删除部门可以多选）
            getSelectedNode3(a) {
                console.log(a);

                // console.log(JSON.parse(JSON.stringify(a)));
                this.selectedObj3 = a[0];
                // this.$refs.users.test();

            }, //被选中的部门（单个或没有,这里还要做异步获取用户和岗位的操作）
            getCheckedNodes3(nodes) {
                this.checkedNodes3 = nodes;
                this.selectedObj3 = nodes[0];
                console.log(nodes);
            }, //获取被勾选的项目，可以多选（这里只是辅助，其实只有删除部门可以多选）
            addArea() {
                this.$refs.areaObj.resetFields();
                this.areaObj = {
                    dataarea_tree_id: null,
                    dataarea_tree_name: "",
                    parent_dataarea_tree_id: "",
                    dataarea_id: 4
                }
                this.isAddArea = true;
            },
            addProduct() {
                this.$refs.rproductObj.resetFields();
                this.productObj = {
                    dataarea_tree_id: null,
                    dataarea_tree_name: "",
                    parent_dataarea_tree_id: "",
                    dataarea_id: 8
                }
                this.isAddProduct = true;
            },
            addIndustry() {
                this.$refs.industryObj.resetFields();
                this.industryObj = {
                    dataarea_tree_id: null,
                    dataarea_tree_name: "",
                    parent_dataarea_tree_id: "",
                    dataarea_id: 2
                }
                this.isAddIndustry = true;
            },
            shutAreaBlock() {
                this.isAddArea = false;
            },
            shutProductBlock() {
                this.isAddProduct = false;
            },
            shutIndustryBlock() {
                this.isAddIndustry = false;
            },

            submitAddArea() {
                let url = "";
                if (this.areaObj.dataarea_tree_id) { //编辑
                    url = "/web/Crm_corp_mgr_dataarea_tree/updateCrm_corp_mgr_dataarea_tree";
                } else { //新增
                    url = "/web/Crm_corp_mgr_dataarea_tree/addCrm_corp_mgr_dataarea_tree";
                }
                this.$refs.areaObj.validate((valid) => {
                    if (valid) {
                        this.$http.post(url, this.areaObj, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.isAddArea = false;
                                        this.findAllAreaInfo();
                                    }
                                })
                            } else {
                                this.$errorHandle(res);
                            }

                        }).catch((res) => {
                            this.$Message.error({
                                content: '操作失败，原因未知',
                                duration: 1,
                                onClose: () => {

                                }
                            })
                        });
                    }
                });
            },
            submitAddProduct() {
                let url = "";
                if (this.productObj.dataarea_tree_id) { //编辑
                    url = "/web/Crm_corp_mgr_dataarea_tree/updateCrm_corp_mgr_dataarea_tree";
                } else { //新增
                    url = "/web/Crm_corp_mgr_dataarea_tree/addCrm_corp_mgr_dataarea_tree";
                }
                this.$refs.rproductObj.validate((valid) => {
                    if (valid) {
                        this.$http.post(url, this.productObj, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.isAddProduct = false;
                                        this.findAllProductInfo();
                                    }
                                })
                            } else {
                                this.$errorHandle(res);
                            }

                        }).catch((res) => {
                            this.$Message.error({
                                content: '操作失败，原因未知',
                                duration: 1,
                                onClose: () => {

                                }
                            })
                        });
                    }
                });
            },
            submitAddIndustry() {
                let url = "";
                if (this.industryObj.dataarea_tree_id) { //编辑
                    url = "/web/Crm_corp_mgr_dataarea_tree/updateCrm_corp_mgr_dataarea_tree";
                } else { //新增
                    url = "/web/Crm_corp_mgr_dataarea_tree/addCrm_corp_mgr_dataarea_tree";
                }
                this.$refs.industryObj.validate((valid) => {
                    if (valid) {
                        this.$http.post(url, this.industryObj, {
                            emulateJSON: true
                        }).then((res) => {
                            if (res.data.b == 1) {
                                this.$Message.success({
                                    content: '操作成功',
                                    duration: 1,
                                    onClose: () => {
                                        this.isAddIndustry = false;
                                        this.findAllIndustryInfo();
                                    }
                                })
                            } else {
                                this.$errorHandle(res);
                            }

                        }).catch((res) => {
                            this.$Message.error({
                                content: '操作失败，原因未知',
                                duration: 1,
                                onClose: () => {

                                }
                            })
                        });
                    }
                });
            },

            showDelBlock() {
                let str1 = this.checkedNodes;
                console.log(str1);
                if (this.checkedNodes.length < 1) {
                    this.$Modal.error({
                        title: "错误信息",
                        content: "未选中节点,请选择至少一个节点"
                    });
                    return false;
                } else {

                    let str = str1.map((item) => {
                        return item.title
                    }).toString();
                    this.$Modal.confirm({
                        title: "确定删除以下项目",
                        content: '<p>' + str + '</p>',
                        onOk: () => {
                            let arr = str1.map((item) => {
                                return item.dataarea_tree_id
                            });

                            this.$http.post("/web/Crm_corp_mgr_dataarea_tree/delCrm_corp_mgr_dataarea_treeById", {
                                "ids": arr,
                                "dataarea_id": 4
                            }, {
                                emulateJSON: true
                            }).then((res) => {
                                if (res.data.b == 1) {
                                    this.$Message.success({
                                        content: '操作成功',
                                        duration: 1,
                                        onClose: () => {
                                            //  this.isAddArea=false;
                                            this.findAllAreaInfo();
                                        }
                                    })
                                } else {
                                    this.$errorHandle(res);
                                }

                            }).catch((res) => {
                                this.$Message.error({
                                    content: '操作失败，原因未知',
                                    duration: 1,
                                    onClose: () => {
                                        //  this.isAddArea=true;
                                    }
                                })
                            });
                        }
                    });
                }
            },
            showDelBlock2() {
                let str1 = this.checkedNodes2;
                if (this.checkedNodes2.length < 1) {
                    this.$Modal.error({
                        title: "错误信息",
                        content: "未选中节点,请选择至少一个节点"
                    });
                    return false;
                } else {

                    let str = str1.map((item) => {
                        return item.title
                    }).toString();
                    this.$Modal.confirm({
                        title: "确定删除以下项目",
                        content: '<p>' + str + '</p>',
                        onOk: () => {
                            let arr = str1.map((item) => {
                                return item.dataarea_tree_id
                            });

                            this.$http.post("/web/Crm_corp_mgr_dataarea_tree/delCrm_corp_mgr_dataarea_treeById", {
                                "ids": arr,
                                "dataarea_id": 8
                            }, {
                                emulateJSON: true
                            }).then((res) => {
                                if (res.data.b == 1) {
                                    this.$Message.success({
                                        content: '操作成功',
                                        duration: 1,
                                        onClose: () => {
                                            //  this.isAddArea=false;
                                            this.findAllProductInfo();
                                        }
                                    })
                                } else {
                                    this.$errorHandle(res);
                                }

                            }).catch((res) => {
                                this.$Message.error({
                                    content: '操作失败，原因未知',
                                    duration: 1,
                                    onClose: () => {
                                        //  this.isAddArea=true;
                                    }
                                })
                            });
                        }
                    });
                }

            },
            showDelBlock3() {
                let str1 = this.checkedNodes3;
                if (this.checkedNodes3.length < 1) {
                    this.$Modal.error({
                        title: "错误信息",
                        content: "未选中节点,请选择至少一个节点"
                    });
                    return false;
                } else {

                    let str = str1.map((item) => {
                        return item.title
                    }).toString();
                    this.$Modal.confirm({
                        title: "确定删除以下项目",
                        content: '<p>' + str + '</p>',
                        onOk: () => {
                            let arr = str1.map((item) => {
                                return item.dataarea_tree_id
                            });

                            this.$http.post("/web/Crm_corp_mgr_dataarea_tree/delCrm_corp_mgr_dataarea_treeById", {
                                "ids": arr,
                                "dataarea_id": 2
                            }, {
                                emulateJSON: true
                            }).then((res) => {
                                if (res.data.b == 1) {
                                    this.$Message.success({
                                        content: '操作成功',
                                        duration: 1,
                                        onClose: () => {
                                            //  this.isAddArea=false;
                                            this.findAllIndustryInfo();
                                        }
                                    })
                                } else {
                                    this.$errorHandle(res);
                                }

                            }).catch((res) => {
                                this.$Message.error({
                                    content: '操作失败，原因未知',
                                    duration: 1,
                                    onClose: () => {
                                        //  this.isAddArea=true;
                                    }
                                })
                            });
                        }
                    });
                }

            },


            updateArea() {
                this.$refs.areaObj.resetFields();
                if (this.selectedObj != null) {
                    this.areaObj = this.selectedObj;
                    this.isAddArea = true;
                } else {
                    this.$Modal.error({
                        content: "编辑能且只能单选",
                        title: "错误信息"
                    })
                    return false;
                }
            },
            updateProduct() {
                this.$refs.productObj.resetFields();
                if (this.selectedObj2 != null) {
                    this.productObj = this.selectedObj2;
                    this.isAddProduct = true;
                } else {
                    this.$Modal.error({
                        content: "编辑能且只能单选",
                        title: "错误信息"
                    })
                    return false;
                }
            },
            updateIndustry() {
                this.$refs.industryObj.resetFields();
                if (this.selectedObj3 != null) {
                    this.industryObj = this.selectedObj3;
                    this.isAddIndustry = true;
                } else {
                    this.$Modal.error({
                        content: "编辑能且只能单选",
                        title: "错误信息"
                    })
                    return false;
                }
            },

            //查询区域信息
            findAllAreaInfo() {
                this.$http.post("/web/Crm_corp_mgr_dataarea_tree/findCrm_corp_mgr_dataarea_treeList", {
                    "dataarea_id": 4
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.areaList = res.data.a;
                        this.areaData = this.$myFunction.FlatToNested(this.areaList, {
                            parentField: 'parent_dataarea_tree_id',
                            idField: 'dataarea_tree_id',
                            textField: 'dataarea_tree_name'
                        });
                        //let testArr = [{ title: "果岭集团", id: 1, parent_id: 0, expand: true }, { title: "互联网事业部", id: 2, parent_id: 1 }, { title: "研发部", id: 3, parent_id: 2 }, { title: "商务部", id: 4, parent_id: 2 }];
                        //FlatToNested函数带三个参数,分别是testArr,obj和target,后边的obj是配置对应的字段，函数对应的目录为src/libs/util/util.js;可以从main.js中看到Util的配置项
                        // let obj={idField:"",//平行数组要转化的id字段key
                        //         textField:'',//平行数组中转化的显示文字字段key
                        //         parentField:''//平行数组中父元素id字段key
                        // }this.$myFunction.FlatToNested(testArr,{parentField:'sss_id'});
                        //target同obj，只不过转换的是目标对象的键名。用于默认使用iview的级联形式
                        //target={targetId:'value',targetText:'label'};意思是目标对象中的value值对应原始对象中的opt中的idField值，targetText值对应y原始对象中的textField值。
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response)
                });
            },

            //查询产品信息
            findAllProductInfo() {
                this.$http.post("/web/Crm_corp_mgr_dataarea_tree/findCrm_corp_mgr_dataarea_treeList", {
                    "dataarea_id": 8
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.productList = res.data.a;
                        this.productData = this.$myFunction.FlatToNested(this.productList, {
                            parentField: 'parent_dataarea_tree_id',
                            idField: 'dataarea_tree_id',
                            textField: 'dataarea_tree_name'
                        });
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response)
                });
            },

            //查询行业信息
            findAllIndustryInfo() {
                this.$http.post("/web/Crm_corp_mgr_dataarea_tree/findCrm_corp_mgr_dataarea_treeList", {
                    "dataarea_id": 2
                }, {
                    emulateJSON: true
                }).then((res) => {
                    if (res.data.b == 1) {
                        this.industryList = res.data.a;
                        this.industryData = this.$myFunction.FlatToNested(this.industryList, {
                            parentField: 'parent_dataarea_tree_id',
                            idField: 'dataarea_tree_id',
                            textField: 'dataarea_tree_name'
                        });
                    } else {
                        this.$errorHandle(res);
                    }

                }).catch(function(response) {
                    console.log(response)
                });
            },

        },
    }
</script>