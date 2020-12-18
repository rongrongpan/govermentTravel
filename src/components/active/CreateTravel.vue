<template>
    <div class="trival-sign">
        <div class="xqname">活动报名 /<span> 报名申请</span></div>
        <div class="makesure-scroll">
        <div class="sign-title">报名申请</div>
        <div class="trival-info">
            <div class="left">
                <p class="tit">商品列表</p>
                <ul class="myshop-list">
                    <li>
                        <div class="info">
                            <div class="img"><img :src="travelInfo.frontCover" alt="商品图片"></div>
                            <div class="font">
                                <div class="title">
                                    <p class="name overhid2">{{travelInfo.title}}</p>
                                    <p class="time">剩余 {{travelInfo.endDay}}天</p>
                                </div>
                                <div class="desc">
                                    <p class="titt">集合地点：</p>
                                    <p class="content">{{travelInfo.place}}</p>
                                </div>
                                <div class="desc">
                                    <p class="titt">活动时间：</p>
                                    <p class="content">{{travelInfo.activityTime}}</p>
                                </div>
                                <div class="desc">
                                    <p class="titt">礼品详情：</p>
                                    <p class="content"><span v-for="item in travelInfo.giftList" :key="item.specificationName">{{item.specificationName}}&nbsp;&nbsp;&nbsp;</span></p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <p class="tit">企退人员信息 <span class="right">请仔细核对用户信息</span></p>

                <div class="user-info">
                    <div class="line"><el-input disabled class="input hui" v-model="personInfo.elderName"></el-input> <span class="red">*</span></div>
                    <div class="line"><el-input disabled class="input hui" v-model="personInfo.idCard"></el-input> <span class="red">*</span></div>
                    <div class="line">
                        <el-input class="input" v-model="inputPhone" placeholder="请输入电话"></el-input>
                        <span class="red"></span>
                    </div>
                    <p class="hometitle">紧急联系人</p>
                    <div class="line">
                        <el-input class="hos-detail" v-model="seriesName" placeholder="请输入紧急联系人姓名"></el-input>
                        <span class="red"></span>
                    </div>
                    <div class="line">
                        <el-input class="hos-detail" v-model="seriesPhone" placeholder="请输入紧急联系人电话"></el-input>
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
                        <span class="red"></span>
                    </div>
                    <el-button type="primary" class="mybutton" @click="sureSign">报名</el-button>
                </div>
            </div>
        </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog
            class="tosign-pop"
            title=""
            :visible.sync="centerDialogVisible"
            :close-on-click-modal="false"
            :show-close="false"
            :close-on-press-escape="false"
            width="380px"
            center>
            <div class="sign-success">
                <p class="status">
                    <img src="@/assets/success.png" alt="验证通过">报名成功
                </p>
                <p class="num">请准时参加报名活动</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <router-link :to="{name:'active'}">
                    <el-button class="btn kon" round type="primary">返回列表</el-button>
                </router-link>
                <router-link :to="{name:'retirexq',params:{id:personInfo.id}}">
                    <el-button class="btn" round type="primary">查看订单</el-button>
                </router-link>
            </span>
        </el-dialog>
        <LeavePop :leavePop="leavePop" @childChange="childChange"></LeavePop>
    </div>
</template>

<script>
import api from '@/api/index.js';
import LeavePop from '@/components/public/ToLeave';
import $ from 'jquery';
import { Loading } from 'element-ui';
export default {
    components:{
        LeavePop
    },
    data(){
        return{
            centerDialogVisible:false,
            inputPhone:'',//联系电话
            inputDetail:'',//备注
            leavePop:false,
            goTonext:'',
            personInfo:{},//个人信息
            seriesPhone:'',//紧急联系人电话
            seriesName:'盼盼',//紧急联系人姓名
            travelInfo:{},//路线信息
        }
    },
    methods:{
        //提交订单
        sureSign(){
            // 请求创建订单接口
            let loadingInstance = Loading.service();
            api.activeSign({
                retirementActivityCreateDTO:{
                    "area": this.personInfo.area,
                    "housingEstate": this.personInfo.housingEstate,
                    "frontCover": this.travelInfo.frontCover,
                    "relative": this.seriesName,
                    "relativePhone": this.seriesPhone,
                    "remark": this.inputDetail,
                    "street": this.personInfo.street,
                    "retirementActivityId": this.travelInfo.id,
                    "activityTitle": this.travelInfo.title,
                    "userId": this.personInfo.id,
                    "userIdcard": this.personInfo.idCard,
                    "userName": this.personInfo.elderName,
                    "userPhone": this.inputPhone
                }
            }).then(res=>{
                loadingInstance.close();
                if(res.data.code==0){
                    this.centerDialogVisible = true;
                }else{
                    this.$reMessage(res.data.msg,'error');
                }
            })
        },
        //是否确认离开此页面
        childChange(e){
            if(e){
                this.leavePop = false;
            }else{
                this.goTonext()
            }
        },
        //倒计时
        getTimer (DateStr){
            var date = {};
            //结束时间
            var endDate = new Date(DateStr);
            //当前时间
            var nowDate = new Date();
            //相差的总秒数
            var totalSeconds = parseInt((endDate - nowDate) / 1000);
            //天数
            var days = Math.floor(totalSeconds / (60 * 60 * 24));
            //取模（余数）
            var modulo = totalSeconds % (60 * 60 * 24);
            //小时数
            var hours = Math.floor(modulo / (60 * 60));
            modulo = modulo % (60 * 60);
            //分钟
            var minutes = Math.floor(modulo / 60);
            //秒
            var seconds = modulo % 60;
            hours>9?hours=hours:hours='0'+hours
            minutes>9?minutes=minutes:minutes='0'+minutes
            seconds>9?seconds=seconds:seconds='0'+seconds
            date = {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
            }
            return date;
        }
    },
    //路由进入守卫
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
            this.seriesPhone = this.personInfo.relativePhone;
            this.seriesName = this.personInfo.relative;
            api.getActiveXq({id:this.$route.params.id}).then(res=>{
                let data = res.data.data.retirementActivityDetailDTO;
                let day = parseInt((new Date(data.endTimeLong)-new Date()) / 1000);
                data.endDay = Math.floor( day/ (60 * 60 * 24));
                this.travelInfo = data;
            })
        }else{
            //页面刷新时，自动返回上个页面
            this.centerDialogVisible = true;
            this.$router.replace({name:'active'});
        }
    }
}
</script>

<style lang="scss" scoped>
    .trival-sign{
        width: 100%;
        height: 100%;
        overflow: auto;
        .makesure-scroll{
            height: calc(100% - 40px);
            overflow: auto;
        }
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
                        margin-right: 35px;
                        font-weight: normal;
                        margin-top: 4px;
                    }
                }
                .myshop-list{
                    width: 100%;
                    box-sizing: border-box;
                    padding-bottom: 10px;
                    .seemore{
                        font-size: 14px;
                        color: #999;
                        cursor: pointer;
                    }
                    li{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        .info{
                            display: flex;
                            width: 100%;
                            .img{
                                width: 150px;
                                height: 100px;
                                background-color: #F2F6FC;
                                margin-right: 10px;
                                flex-shrink: 0;
                                img{
                                    width: 100%;
                                }
                            }
                            .font{
                                flex-grow: 1;
                                margin-right: 10px;
                                .title{
                                    display: flex;
                                    justify-content: space-between;
                                    width: 100%;
                                    .name{
                                        font-size: 20px;
                                        color: #333;
                                        line-height: 30px;
                                        width: 280px;
                                    }
                                    .time{
                                        font-size: 16px;
                                        color: #909399;
                                        line-height: 30px;
                                        flex-shrink: 0;
                                        margin-left: 10px;
                                    }
                                }
                                .desc{
                                    font-size: 12px;
                                    height: 12px;
                                    line-height: 12px;
                                    color: #999;
                                    margin-top: 10px;
                                    display: flex;
                                    width: 280px;
                                    .titt{
                                        width: 72px;
                                    }
                                }
                            }
                        }
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
                            }
                        }
                        .el-select:first-of-type{
                            margin-left: 0;
                        }
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
</style>
<style lang="scss">
.trival-sign .el-textarea__inner{
    resize: none;
    border: 0;
    font: 400 13.3333px Arial;
    overflow: auto;
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
    margin-right: 10px;
}
</style>



