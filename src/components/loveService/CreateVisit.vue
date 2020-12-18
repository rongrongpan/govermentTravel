<template>
    <div class="trival-sign">
        <div class="xqname">爱心逆行 /<span> 创建探望</span></div>
        <div class="sign-title">创建探望</div>
        <div class="trival-info">
            <div class="left">
                <p class="tit">企退人员信息 <span class="right">请仔细核对用户信息</span></p>
                <div class="user-info">
                    <div class="line"><el-input disabled class="input hui" v-model="personInfo.elderName" placeholder="请输入姓名"></el-input> <span class="red">*</span></div>
                    <div class="line"><el-input disabled class="input hui" v-model="personInfo.idCard" placeholder="请输入身份证号码"></el-input> <span class="red">*</span></div>
                    <div class="line">
                        <el-input class="input" v-model="inputPhone" placeholder="请输入电话"></el-input>
                        <span class="red"></span>
                    </div>
                    <p class="hometitle">家庭地址 <span>*</span></p>
                    <div class="line home">
                        <el-select v-model="areaVal" placeholder="地区" @change="streetVal = null;commitytVal=null">
                            <el-option
                            v-for="item in areaList"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        <el-select  v-model="streetVal" placeholder="街道" @change="commitytVal=null">
                            <el-option
                            v-for="item in streetList[areaVal]"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        
                        <el-select v-model="commitytVal" placeholder="社区">
                            <el-option
                            v-for="item in commitytList[streetVal]"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        <span class="red"></span>
                    </div>
                    <div class="line">
                        <el-input class="hos-detail" v-model="homeAddress" placeholder="请输入详细家庭地址: 道路、门牌号、小区、楼栋号、单元市等"></el-input>
                        <span class="red"></span>
                    </div>
                    <p class="hometitle">医院地址</p>
                    <div class="line text">
                        <div class="input textarea">
                            <el-input
                                type="textarea"
                                :rows="3"
                                class="mytextarea"
                                placeholder="医院探望请输入医院详细地址，尽可能详细到医院楼栋号、楼层、床位号"
                                v-model="hosAddress">
                            </el-input> 
                        </div>
                        <span class="red"></span>
                    </div>

                    <div class="line text">
                        <div class="input textarea">
                            <el-input
                                type="textarea"
                                :rows="3"
                                class="mytextarea"
                                show-word-limit
                                maxlength="100"
                                placeholder="备注"
                                v-model="inputDetail">
                            </el-input> 
                        </div>
                        <span class="red"></span></div>
                    </div>
                    <el-button type="primary" class="mybutton" @click="sureSign">确认</el-button>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog
            class="tosign-pop"
            title=""
            :visible.sync="centerDialogVisible"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="380px"
            center>
            <div class="sign-success">
                <p class="status">
                    <img src="@/assets/success.png" alt="验证通过">创建成功
                </p>
                <p class="num">系统会尽快匹配探望人员</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <router-link :to="{name:'loveList'}">
                    <el-button class="btn kon" round type="primary">返回列表</el-button>
                </router-link>
            </span>
        </el-dialog>
        <LeavePop :leavePop="leavePop" @childChange="childChange"></LeavePop>
    </div>
</template>

<script>
import api from '@/api/index';
import LeavePop from '@/components/public/ToLeave';
import $ from 'jquery';
import { Loading } from 'element-ui';
import address from '@/components/public/address.js'
export default {
    components:{
        LeavePop
    },
    data(){
        return{
            centerDialogVisible:false,
            inputPhone:'',
            homeAddress:'',
            inputDetail:'',
            hosAddress:'',
            personInfo:{},
            leavePop:false,
            goTonext:'',
            areaList: address.area,
            areaVal: null,
            streetVal:null,
            streetList:address.street,
            commitytVal:null,
            commitytList:address.community
        }
    },
    methods:{
        sureSign(){
            if(!this.areaVal||!this.streetVal||!this.commitytList){
                this.$reMessage('请填写正确的区、街道、社区！','error');
            }else{
                let loadingInstance = Loading.service();
                api.createLove({
                    orderVisitAddDTO:{
                        address:this.homeAddress,
                        area:this.areaVal,
                        community:this.commitytVal,
                        hospitalAddress:this.hosAddress,
                        remark:this.inputDetail,
                        street:this.streetVal,
                        userId:this.personInfo.id,
                        userIdcard:this.personInfo.idCard,
                        userName:this.personInfo.elderName,
                        userPhone:this.inputPhone
                    }
                }).then(res=>{
                    loadingInstance.close();
                    if(res.data.code==0){
                        this.centerDialogVisible = true;
                    }else{
                        this.$reMessage(res.data.msg,'error');
                    }
                })
            }
        },
        childChange(e){
            if(e){
                this.leavePop = false;
            }else{
                this.goTonext()
            }
        }
    },
    beforeRouteLeave:function(to,from,next){
        if(this.centerDialogVisible){
            this.centerDialogVisible = false;
            next();
        }else{
            this.leavePop = true;
            this.goTonext = next;
            next(false);
        }
    },
    created(){
        if(Boolean(this.$route.params.personinfo)){
            this.personInfo = JSON.parse(this.$route.params.personinfo);
            this.inputPhone = this.personInfo.phone;
            this.streetVal = this.personInfo.street;
            this.commitytVal = this.personInfo.housingEstate;
            this.homeAddress = this.personInfo.address;
            this.areaVal = this.personInfo.area;

        }else{
           this.centerDialogVisible = true;
           this.$router.replace({name:'visit'});
        }   
    }
}
</script>

<style lang="scss" scoped>
.myaddressDetail{
    font-size: 12px;
    color: $black2;
    line-height: 18px;
    margin-bottom: 16px;
    padding:0 15px;
    margin-right: 20px;
}
.makesure-phone{
        margin-left: 10px;
        background-color: #FDA931;
        border-color: #FDA931;
        color: #fff;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        font-size: 14px;
        width: 80px;
        text-align: center;
        cursor: pointer;
    }
    .makesure-phone.active{
        background-color: $myblue1;
        border-color: $myblue1;
    }
    .trival-sign{
        width: 100%;
        padding-bottom: 80px;
        height: 100%;
        overflow: auto;
        .xqname{
            font-size: 12px;
            color: $black2;
            padding-bottom: 24px;
            span{
                color: $black;
            }
        }
        .sign-title{
            font-size: 24px;
            font-weight: bold;
            color: $black;
            margin-bottom: 20px;
        }
        .trival-info{
            width: 100%;
            display: flex;
            .left{
                width: 50%;
                .tit{
                    font-size: 18px;
                    color: $black;
                    font-weight: bold;
                    margin-bottom: 16px;
                    .right{
                        font-size: 12px;
                        color: #F9496C;
                        float: right;
                        margin-right: 20px;
                        font-weight: normal;
                        margin-top: 4px;
                    }
                }
                .user-info{
                    width: 100%;
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
                            flex-grow: 1;
                        }
                        .el-select:first-of-type{
                            margin-left: 0;
                        }
                    }
                    .line.home{
                        margin-bottom: 10px;
                    }
                    .line.text{
                        height: auto;
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
                .mybutton{
                    font-size: 14px;
                    width: 94px;
                    height: 40px;
                    float: right;
                    margin-right: 20px;
                    background-color: #4080FF;
                    flex-shrink: 0;
                }
            }
        }
    }
</style>
<style lang="scss">
.trival-sign .trival-info .left .user-info .line .hui input{
    background-color: #F5F7FA;
}
.trival-sign .trival-info .left .user-info .line textarea{
    resize: none;
    border: 0;
    font: 400 13.3333px Arial;
}
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
    .address-pop .el-dialog__header{
        padding-top: 15px;
    }
    .tosign-pop .sign-success{
        text-align: center;
        .status{
            font-size: 24px;
            font-weight: bold;
            img{
                width: 22px;
                height: 22px;
                margin-right: 10px;
            }
        }
        .num{
            font-size: 14px;
            color: $black1;
            margin-top: 10px;
        }
    }
    .tosign-pop .btn{
        width: 77px;
        height: 28px;
        font-size: 12px;
        padding: 0 !important;
        text-align: center;
        background-color: $myblue;
    }
    .tosign-pop .btn.kon{
        background-color: transparent;
        border-color: $myblue;
        color: $myblue;
    }
    .trival-sign .trival-info .left .user-info .address .leftarea .radio.is-checked{
        border-color: #409EFF;
    }
    .trival-sign .trival-info .left .user-info .address .leftarea .el-radio__input.is-checked+.el-radio__label{
        color: $black1;
    }
</style>




