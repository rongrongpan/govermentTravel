<template>
    <div class="trival-sign">
        <div class="xqname">孝亲卡 /<span> 申请孝亲卡</span></div>
        <div class="sign-title">申请孝亲卡</div>
        <div class="trival-info">
            <div class="left">
                <p class="tit">企退人员信息 <span class="right">请仔细核对用户信息</span></p>
                <div class="user-info">
                    <div class="line"><el-input class="input hui" disabled v-model="userInfo.elderName" placeholder="请输入姓名"></el-input> <span class="red">*</span></div>
                    <div class="line"><el-input class="input hui" disabled v-model="userInfo.idCard" placeholder="请输入身份证号码"></el-input> <span class="red">*</span></div>
                    <div class="line">
                        <el-input class="input" v-model="inputPhone" placeholder="请输入电话"></el-input> 
                        <span class="red"></span>
                    </div>
                    <div class="line">
                        <div class="cardNumber">
                            <div class="title">申请卡号 <span>申领金额：{{userInfo.fundType==='1'?'130':'65'}}</span></div>
                            <el-radio-group v-model="radio" @change="changeCard">
                                <el-radio :label="2">
                                    <span class="text">领取实体卡</span>
                                    <div class="inputGroup">
                                        <ul class="myinput">
                                            <li :class="[cardNumber.length===0&&radio===2?'active':'']" @click="focusInput">{{cardNumber[0]}}</li>
                                            <li :class="[cardNumber.length===1&&radio===2?'active':'']" @click="focusInput">{{cardNumber[1]}}</li>
                                            <li :class="[cardNumber.length===2&&radio===2?'active':'']" @click="focusInput">{{cardNumber[2]}}</li>
                                            <li :class="[cardNumber.length===3&&radio===2?'active':'']" @click="focusInput">{{cardNumber[3]}}</li>
                                            <li :class="[cardNumber.length===4&&radio===2?'active':'']" @click="focusInput">{{cardNumber[4]}}</li>
                                            <li :class="[(cardNumber.length===5||cardNumber.length===6)&&radio===2?'active':'']" @click="focusInput">{{cardNumber[5]}}</li>
                                        </ul>
                                        <el-input :autofocus="true" maxlength="6" ref="card" v-model="cardNumber"></el-input>
                                    </div>
                                </el-radio>
                                <el-radio :label="1"><span class="text">领取电子卡</span> <p class="auto">{{autoCard?autoCard:'0000000'}}</p></el-radio>
                            </el-radio-group>
                        </div>
                        <span class="red"></span>
                    </div>
                    
                    <div class="line">
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
            width="380px"
            :close-on-click-modal="false"
            :show-close="false"
            :close-on-press-escape="false"
            center>
            <div class="sign-success">
                <p class="status">
                    <img src="@/assets/success.png" alt="验证通过">申请已提交
                </p>
                <p class="num">卡片制作完成需要2-5个工作日</p>
            </div>
           
            <span slot="footer" class="dialog-footer">
                <router-link class="btn kon" :to="{name:'cardlist'}">返回列表</router-link>
                <router-link class="btn" :to="{name:'retirexq',params:{id:userInfo.id}}">查看订单</router-link>
            </span>
        </el-dialog>
        <LeavePop :leavePop="leavePop" @childChange="childChange"></LeavePop>

    </div>
</template>

<script>
import api from '@/api/index';
import LeavePop from '@/components/public/ToLeave';
import { Loading } from 'element-ui';
export default {
    components:{
        LeavePop
    },
    data(){
        return{
            centerDialogVisible:false,
            inputName:'',
            inputCard:'',
            inputPhone:'',
            inputDetail:'',
            leavePop:false,
            goTonext:'',
            userInfo:{},
            radio:2,//电子卡或实体卡
            cardNumber:'',//卡号
            autoCard:'',//自动生成的卡号
        }
    },
    methods:{
        sureSign(){
                let loadingInstance = Loading.service();
                api.toCreatCard({
                    remark:this.inputDetail,
                    userId:this.userInfo.id,
                    userIdCard:this.userInfo.idCard,
                    userName:this.userInfo.elderName,
                    userPhone:this.inputPhone,
                    cardType:this.radio,
                    xiaoqinCardNum:this.radio===2?this.cardNumber:this.autoCard
                }).then(res=>{
                    loadingInstance.close();
                    if(res.data.code==0){
                        this.centerDialogVisible = true;
                    }
                })
        },
        childChange(e){
            if(e){
                this.leavePop = false;
            }else{
                this.goTonext()
            }
        },
        changeCard(e){
            this.radio = e;
            if(e===2){
                this.$refs['card'].focus();
            }else if(this.autoCard===''){
                api.getCardNumber().then(res=>{
                    this.autoCard = res.data.data.cardNum;
                })
            }
        },
        focusInput(){
            let that = this;
            setTimeout(function(){
                that.$refs['card'].focus();
            },100)
            
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
        if(Boolean(this.$route.params.info)){
            this.userInfo = JSON.parse(this.$route.params.info);
            this.inputPhone = this.userInfo.phone;
        }else{
           this.centerDialogVisible = true;
           this.$router.replace({name:'cardlist'});
        }
        
    }
}
</script>

<style lang="scss" scoped>
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
                }
                .tit{
                    .desc{
                        font-size: 12px;
                        color: $black2;
                        font-weight: normal;
                    }
                    .right{
                        color: #F9496C;
                        float: right;
                        font-size: 12px;
                        font-weight: normal;
                        margin-right: 35px;
                    }
                }
                .user-info{
                    width: 100%;
                    .line{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        .red{
                            width: 35px;
                            color: #F9496C;
                            padding-top: 8px;
                            text-indent: 10px;
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
                        
                    }
                    .cardNumber{
                        width: 100%;
                        .title{
                            font-size: 18px;
                            color: #333;
                            margin-bottom: 20px;
                            line-height: 18px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            span{
                                font-size: 14px;
                                font-weight: bold;
                            }
                        }
                        .el-radio-group{
                            width: 100%;
                            .el-radio{
                                width: 100%;
                                border: 1px solid #DCDFE6;
                                border-radius: 8px;
                                height: 60px;
                                display: flex;
                                align-items: center;
                                box-sizing: border-box;
                                padding: 0 15px;
                                .auto{
                                    font-size: 35px;
                                    color: #333;
                                    float: right;
                                }
                            }
                            .el-radio:first-child{
                                margin-bottom: 20px;
                            }
                        }
                        .inputGroup{
                            width: 314px;
                            height: 46px;
                            position: relative;
                            overflow: hidden;
                            .myinput{
                                width: 100%;
                                height: 100%;
                                li{
                                    display: inline-block;
                                    width: 41px;
                                    height: 44px;
                                    border:1px solid #DCDFE6;
                                    border-radius: 3px;
                                    margin-right: 7px;
                                    cursor: pointer;
                                    vertical-align: top;
                                    font-size: 35px;
                                    color: #333;
                                    text-align: center;
                                    line-height: 44px;
                                }
                                li.active{
                                    border-color: #4080FF;
                                }
                                li:last-child{
                                    margin-right: 0;
                                }
                            }
                            .el-input{
                                position: absolute;
                                left: -200%;
                                top: 0;
                            }
                        }
                    }
                }
                .mybutton{
                    font-size: 14px;
                    width: 94px;
                    height: 40px;
                    float: right;
                    margin-right: 35px;
                    background-color: #4080FF;
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
        padding: 0;
        text-align: center;
        background-color: #1989FA;
        display: inline-block;
        border-radius: 14px;
        line-height: 28px;
        color: #fff;
        margin: 0 auto;
        border:1px solid #1989FA;
    }
     .tosign-pop .btn.kon{
         background-color: transparent;
         border:1px solid #1989FA;
         color: #1989FA;
         margin-right: 10px;
     }
     .cardNumber .el-radio__label{
         width: 100%;
         display: flex;
         justify-content: space-between;
         align-items: center;
     }
</style>




