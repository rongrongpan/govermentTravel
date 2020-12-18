<template>
    <!-- 验证弹窗 -->
    <el-dialog
        class="tosign-pop"
        :title="info?'修改用户信息':'添加外籍人员'"
        :visible.sync="openEdit"
        width="646px"
        :before-close="closePop"
        center>
        <div class="editInfo">
             <p class="title">企退人员信息 <span class="right">请仔细核对用户信息</span></p>
            <div class="user-info">
                <div class="line"><el-input placeholder="请输入姓名" :disabled="info?true:false" class="input hui" v-model="elderName"></el-input> <span class="red">*</span></div>
                <div class="line"><el-input placeholder="请输入护照编号" :disabled="info?true:false" class="input hui" v-model="idCard"></el-input> <span class="red">*</span></div>
                <div class="line type" style="margin-bottom:0;">
                    <div class="wra">
                        性别：
                        <el-radio v-model="sex" label="男">男</el-radio>
                        <el-radio v-model="sex" label="女">女</el-radio>
                        <el-radio v-model="sex" label="未知">未知</el-radio>
                    </div>
                </div>
                <div class="line">
                    <el-input class="input" v-model="inputPhone" placeholder="请输入电话"></el-input>
                    <span class="red"></span>
                </div>
                <p class="hometitle">紧急联系人</p>
                <div class="line">
                    <el-input class="hos-detail" v-model="helpName" placeholder="紧急联系人姓名"></el-input>
                    <span class="red"></span>
                </div>
                <div class="line">
                    <el-input class="hos-detail" v-model="helpPhone" placeholder="紧急联系人电话"></el-input>
                    <span class="red"></span>
                </div>
                <p class="hometitle">联系地址</p>
                <div class="line">
                    <el-input class="hos-detail" v-model="homeAddress" placeholder="请输入联系地址"></el-input>
                    <span class="red"></span>
                </div>
            </div>
            <el-button class="makesure" @click="changeInfo" type="primary" round>确定</el-button>
            </div>
    </el-dialog>
</template>

<script>
import api from '@/api/index'
import qs from 'qs'
export default {
    props:['openEdit','info'], 
    data(){
        return{
            elderName:'',
            idCard:'',
            sex:'',
            inputPhone:'',
            helpName:'',
            helpPhone:'',
            homeAddress:'',
            fundType:''
        }
    },
    methods:{
        closePop(){
            this.$emit('closeEdit',1);
            if(this.info){
                this.idCard = this.info.idCard;
                this.elderName = this.info.elderName;
                this.sex = this.info.sex;
                this.inputPhone = this.info.phone;
                this.helpName = this.info.relativesName;
                this.helpPhone = this.info.relativesPhone;
                this.homeAddress = this.info.address;
            }
            
        },
        changeInfo(){
            let that = this;
            if(!this.info){
                if(this.elderName===''){
                    this.$reMessage('请输入姓名！','error');
                    return false;
                }else if(this.idCard===''){
                    this.$reMessage('请输入护照编号！','error');
                    return false;
                }
            }
            if(this.sex===''){
                this.$reMessage('请选择性别！','error');
            }else{
                let sex = 1;
                this.sex==='男'?sex=1:this.sex==='女'?sex=2:sex=0;
                if(this.info){
                    //编辑退休老人信息
                    api.editRetire({
                        id:this.info.id,
                        retireeUpdateVO:{
                            address:this.homeAddress,
                            id:this.info.id,
                            phone:this.inputPhone,
                            relativesName:this.helpName,
                            relativesPhone:this.helpPhone,
                            sex:sex
                        }
                    }).then(res=>{
                        if(res.data.code===0){
                            this.$message({
                                center:true,
                                duration:1000,
                                message: '编辑成功！',
                                type: 'success',
                                onClose(){
                                    that.$emit('closeEdit',2);
                                }
                            });
                        }else{
                            this.$reMessage(res.data.msg,'error');
                        }
                    })
                }else{
                    // 添加外籍老人
                    api.addCountry({
                        address:this.homeAddress,
                        elderName:this.elderName,
                        idCard:this.idCard,
                        phone:this.inputPhone,
                        relative:this.helpName,
                        relativePhone:this.helpPhone,
                        sex:sex,
                        fundType:'3'
                    }).then(res=>{
                        if(res.data.code===0){
                            this.$message({
                                center:true,
                                duration:1000,
                                message: '添加成功！',
                                type: 'success',
                                onClose(){
                                    that.$emit('closeEdit',2);
                                }
                            });
                        }else{
                            this.$reMessage(res.data.msg,'error');
                        }
                    })
                }
            } 
        }
    },
    watch:{
        info(){
            this.idCard = this.info.idCard;
            this.elderName = this.info.elderName;
            this.sex = this.info.sex;
            this.inputPhone = this.info.phone;
            this.helpName = this.info.relativesName;
            this.helpPhone = this.info.relativesPhone;
            this.homeAddress = this.info.address;
        }
    },
    created(){
    }
}
</script>

<style lang="scss" scoped>
.editInfo{

    .title{
        font-size: 18px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        line-height: 18px;
        margin-bottom: 16px;
        span{
            color: #F9496C;
            font-weight: normal;
            font-size: 12px;
        }
    }
    .makesure{
        background-color: #1989FA;
        width: 77px;
        height: 28px;
        padding: 0;
        line-height: 28rpx;
        text-align: center;
        font-size: 12px;
        display: block;
        margin: 10px auto;
    }
}
    .user-info{
        width: 100%;
        margin-bottom: 30px;
        text-align: left;
        .line{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            height: 40px;
            overflow: hidden;
            .red{
                width: 20px;
                color: #F9496C;
                text-indent: 10px;
                flex-shrink: 0;
                line-height: 46px;
            }
            .input{
                width: 100px;
                flex-grow: 1;
                height: 40px;
                font: 400 13.3333px Arial;
            }
            .textarea{
                border-radius: 4px;
                border: 1px solid #DCDFE6;
                height: 80px;
                .mytextarea{
                    height: 80px;
                    resize: none;
                }
            }
            .el-select{
                margin-left: 14px;
            }
            .el-select:first-of-type{
                margin-left: 0;
            }
        }
        .line.type{
            justify-content: left;
            .wra:first-of-type{
                margin-right: 80px;
            }
        }
        .line.home{
            margin-bottom: 10px;
        }
        .line.text{
            height: auto;
        }
        .line.getauto{
            font-size: 14px;
            color: $black;
            margin-bottom: 0;
            display: block;
        }
        .hometitle{
            font-size: 14px;
            color: $black;
            line-height: 14px;
            margin-bottom: 10px;
            height: 14px;
            span{
                color: #F9496C;
                margin-top: 4px;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>