
<template>
    <div>
        <Form-item v-for="(item,index) in itemslist" :prop="item.field_name_db" :label="item.field_name_show" :key="item.field_id" label-position="left" :label-width="100">
            <!--<Input v-model="item.colname" :type="input"></Input>-->
            <!--<formEle :obj="item"></formEle>-->
            <Input  type="text" v-model='cObj[item.field_name_db]' v-if="item.field_type==3 || item.field_type==5 || item.field_type==6 ||item.field_type==7" :placeholder="item.field_name_show"></Input>
            <Input v-model='cObj[item.field_name_db]' v-if="item.field_type==1 || item.field_type==2" number></Input>
            <Date-picker v-model="cObj[item.field_name_db]" type="date" format="yyyy-MM-dd"  placeholder="选择日期" @on-change="setValue($event,item.field_name_db)" v-if="item.field_type==10" :editable="false"></Date-picker>
            <Input v-model='cObj[item.field_name_db]' v-if="item.field_type==4" type="textarea"></Input>
            <Select v-model='cObj[item.field_name_db]' v-if="item.field_type==8" filterable>
                <Option v-for="el in item.extend" :value="el.value+''" :key="el.value">{{el.name}}</Option>
            </Select>
            <Select v-model='cObj[item.field_name_db]' v-if="item.field_type==11" filterable>
                <Option v-for="el in item.extend" :value="el.value" :key="el.value">{{el.name}}</Option>
            </Select>
            <Checkbox-group v-model='cObj[item.field_name_db]' v-if="item.field_type==9">
                <Checkbox :label="el.name" v-for="el in item.extend" :value="el.value" :key="el.value"></Checkbox>
            </Checkbox-group>
        </Form-item>
    </div>
</template>
<script>
export default {
    props: ['itemslist','formobj'],
    data() {
        return {
            //itemArray: this.itemslist,
        }
    },
    created() {

    },
    updated(){ 
    },
    mounted() {

    },
    computed: {
       cObj(){
        return this.$parent.model;          
       } ,
       itemArray(){
           return this.itemslist;
       }
        // fieldname(index){
        //     return this.$parent.model+'.'+this.itemslist[index].colname;
        // },
        // type1(type){
        //     if (type===1) {
        //         return "input";
        //     }else if(type==2){
        //         return "textarea";
        //         }
        //     }
    },
    //components:{formEle:formEle}
    methods: {
        getKey(key) {

        },
        setValue(date,field){          
            this.$nextTick(()=>{
            this.cObj[field]=date;           
           })
        },
        resetForm(){
            this.cObj={};
            let tempObj = {};
            this.itemArray.map((obj,index) => {  
                if(obj.field_type==11 && obj.field_defvalue===""){
                    obj.field_defvalue=null;
                }          
                obj[obj.field_name_db]=obj.field_defvalue;            
            })
        this.cObj = tempObj;
        },
    }

}
</script>
