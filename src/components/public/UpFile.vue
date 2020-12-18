<template>
    <!-- 验证弹窗 -->
    <el-dialog
        class="tosign-pop"
        title=""
        :visible.sync="centerDialogVisible"
        width="412px"
        :before-close="closePop"
        center>
        <div class="content">
            <el-upload
                class="upload-demo"
                ref="upload"
                :data="type=='6'?{
                    type:userType,
                    serviceType:serviceTypeZ
                }:(type=='2'||type=='7')?{
                    packageId:groupValue,
                    personally:getAuto?0:1
                }:type=='8'?{
                    type:this.cardType
                }:{
                    retirementActivityId:activeId
                }"
                :action="type=='6'?'/api/retirement/excel/inport':type=='8'?'/api/retirement/xiaoqin/claim/excel':type=='4'?'/api/retirement/retirement/activity/excel/import':type=='5'?'/api/retirement/travel/excel/import':type=='7'?'/api/retirement/similar/activity/bulkcreation':'/api/retirement/condolence/excel/import'"
                :on-change="handleRemove"
                :on-remove="handleRemove"
                :on-success="fileSuccess"
                :file-list="fileList"
                :limit="1"
                :auto-upload="false">
                <el-button slot="trigger" type="primary" v-if="length===0">上传老人信息文件</el-button>
            </el-upload>
            <template v-if="type=='6'">
                <div class="selectType">
                    <p class="tit">用户类型：</p>
                    <div class="con">
                        <el-radio v-model="userType" label="1">一年</el-radio>
                        <el-radio v-model="userType" label="2">半年</el-radio>
                    </div>
                </div>
                <div class="selectType">
                    <p class="tit">服务类型：</p>
                    <div class="con">
                        <el-select v-model="serviceTypeZ" placeholder="请选择">
                            <el-option
                            v-for="item in serviceType"
                            :key="item.name"
                            :label="item.name"
                            :value="item.type">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </template>
            <div v-else-if="type=='8'" class="selectType">
                <p class="tit">孝亲卡类型：</p>
                <div class="con">
                    <el-radio v-model="cardType" label="1">实体卡</el-radio>
                    <el-radio v-model="cardType" label="2">电子卡</el-radio>
                </div>
            </div>
             <template v-else-if="type=='2'||type=='7'">
                <div class="selectType">
                    <p class="tit">是否自提：</p>
                    <div class="con">
                        <el-radio v-model="getAuto" :label="true">上门</el-radio>
                        <el-radio v-model="getAuto" :label="false">自提</el-radio>
                    </div>
                </div>
                <div class="selectType">
                    <p class="tit">选择套餐：</p>
                    <div class="con">
                        <el-select v-model="groupValue" placeholder="请选择">
                            <el-option
                            v-for="item in activeId"
                            :key="item.name"
                            :label="item.packageName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </template>
            <p class="errortext" v-if="errorText&&length!==0">错误信息：{{errorText}}</p>
            <el-button class="makesure" type="primary" @click="submitUpload" round>确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import api from '@/api/index';
export default {
    props:['centerDialogVisible','type','activeId'], //type:1孝亲卡申领   2上门慰问    3创建探望安排  4活动  5旅游  6导入老人数据 7活动 8孝亲卡批量导入
    data(){
        return{
            fileList:[],
            length:0,
            errorText:"",
            userType:'1',//是一年得用户还是半年的用户
            serviceType:[
                {
                    name:'无服务类型',
                    type:'0'
                },
                {
                    name:'上门慰问',
                    type:'1'
                },
                {
                    name:'小型多样化活动',
                    type:'4'
                }
            ],
            serviceTypeZ:'0',//用户选择哪种消费类型
            getAuto:true,
            groupValue:null,
            cardType:'1',//孝亲卡类型
        }
    },
    methods:{
        closePop(){
            this.$emit('changeFile');
        },
        submitUpload() {
                if(this.length===0){
                    this.$reMessage('请上传文件！','error');
                }else if(this.type=='2'&&!this.groupValue){
                    this.$reMessage('请选择套餐！','error');
                }else{
                    this.$refs.upload.submit();
                }
        },
        handleRemove(file, fileList) {
            this.length = fileList.length;
            if(fileList.length===0){
                this.errorText = '';
            }
        },
        fileSuccess(e){
            if(e.code===0){
                this.$reMessage('上传成功！','success')
                this.closePop();
            }else{
                this.errorText = e.msg;
            }  
        }
    },
    created(){
    }
}
</script>
<style lang="scss" scoped>
    .errortext{
        font-size: 14px;
        color: #FF7661;
        font-weight:bold;
        margin-top: 10px;
    }
    .selectType{
        width: 100%;
        display: flex;
        margin-bottom: 20px;
        align-items: center;
        .tit{
            width: 72px;
            font-size: 12px;
            color: $black2;
            flex-shrink: 0;
        }
    }
    .content{
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px 20px;
        .el-button{
            width: 100%;
        }
        .makesure{
            width: 86px;
            height: 28px;
            padding: 0;
            line-height: 28px;
            margin: 0 auto;
            margin-top: 40px;
            display: block;
        }
        .el-checkbox{
            width: 20%;
            margin-bottom: 10px;
        }
        .el-checkbox:nth-of-type(2n){
            margin-right: 0;
        }
    }
</style>

<style>
    .tosign-pop .el-dialog__body{
        padding-top: 8px;
        padding-bottom: 20px;
    }
    .tosign-pop .el-dialog__title{
        font-size: 24px;
        font-weight: bold;
    }
    .tosign-pop .el-dialog__footer{
        padding-bottom: 35px;
    }
    .tosign-pop .el-dialog__header{
        padding-top: 35px;
    }
    .upload-demo{
        width: 100%;
        overflow: hidden;
        height:70px;
    }
    .el-upload{
        width: 100%;
    }
    .el-upload-list__item:first-child{
        margin-top: 0 !important;
    }
</style>