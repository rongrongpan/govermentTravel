<template>
    <div class="trival-sign">
        <div class="xqname">上门慰问 /<span> 确认订单</span></div>
        <div class="makesure-scroll">
        <div class="sign-title">确认订单</div>
        <div class="trival-info">
            <div class="left">
                <p class="tit">商品列表</p>
                <ul class="myshop-list" v-if="showOrderList.length">
                    <li v-for="(item) in showOrderList" :key="item.id">
                        <div class="info">
                            <div class="img"><img :src="item.picture" alt="商品图片"></div>
                            <div class="font">
                                <p class="title overhid1">{{item.subTitle}}</p>
                                <p class="desc overhid2">{{item.description}}</p>
                            </div>
                        </div>
                    </li>
                    <p class="seemore" @click="seeMore" v-if="orderList.length>2">{{showOrderList.length===2?'查看更多':'收起'}} >></p>
                </ul>
                <ul class="myshop-list" v-else>
                    <li v-for="(item) in orderList" :key="item.id">
                        <div class="info">
                            <div class="img"><img :src="item.picture" alt="商品图片"></div>
                            <div class="font">
                                <p class="title overhid1">{{item.subTitle}}</p>
                                <p class="desc overhid2">{{item.description}}</p>
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
                    <p class="hometitle">家庭地址 <span>*</span></p>
                    <div class="line home">
                        <el-select v-model="areaVal" placeholder="地区" @change="streetVal = null;commitytVal = null">
                            <el-option
                            v-for="item in areaList"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        <el-select  v-model="streetVal" placeholder="街道" @change="commitytVal = null">
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
                    <div class="line getauto">
                        是否自提：<el-checkbox v-model="getAuto">自提</el-checkbox>
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
                </div>
            </div>
            <div class="right-money">
                <div class="top">
                    <p class="title">计算</p>
                    <p class="price-detail">
                        <span class="tit">套餐总价</span>
                        <span class="desc">¥ {{(productInfo.packagePrice*0.01).toFixed(2)}}</span>
                    </p>
                </div>
                <div class="bottm">
                    <p class="title">总计 <span>¥ {{(productInfo.packagePrice*0.01).toFixed(2)}}</span></p>
                    <el-button type="primary" class="sign-btn" @click="sureSign">确认支付</el-button>
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
                    <img src="@/assets/success.png" alt="验证通过">下单成功
                </p>
                <p class="num">商家收到通知后会开始备货</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <router-link :to="{name:'receivelist'}">
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
import AddressList from '@/components/public/AddressList';
import LeavePop from '@/components/public/ToLeave';
import $ from 'jquery';
import { Loading } from 'element-ui';
import address from '@/components/public/address.js';
export default {
    components:{
        AddressList,
        LeavePop
    },
    data(){
        return{
            centerDialogVisible:false,
            inputPhone:'',
            homeAddress:'',
            inputDetail:'',
            orderList:[],
            productInfo:{},
            showOrderList:[],
            leavePop:false,
            goTonext:'',
            personInfo:{},
            areaList: address.area,
            areaVal: null,
            streetVal:null,
            streetList:address.street,
            commitytVal:null,
            commitytList:address.community,
            getAuto:false
        }
    },
    methods:{
        //提交订单
        sureSign(){
            if(!this.areaVal||!this.streetVal||!this.commitytVal){
                this.$reMessage('请填写正确的区、街道、社区！','error');
            }else if((this.personInfo.fundType==='1'&&this.productInfo.packagePrice!==13000)||(this.personInfo.fundType==='2'&&this.productInfo.packagePrice!==6500)){
                this.$reMessage('请购买对应的商品！','error');
            }else{
                let list = {
                    "packageType": this.productInfo,
                    "productList": this.orderList
                }
                let loadingInstance = Loading.service();
                api.createReceive({
                    orderVisitCreateDTO:{
                        address:this.homeAddress,
                        area:this.areaVal,
                        community:this.commitytVal,
                        itemInfo:JSON.stringify(list),
                        remark:this.inputDetail,
                        street:this.streetVal,
                        userId:this.personInfo.id,
                        userIdcard:this.personInfo.idCard,
                        userName:this.personInfo.elderName,
                        userPhone:this.inputPhone,
                        personally:this.getAuto?'1':'0'
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
        },
        seeMore(){
            if(this.showOrderList.length==2){
                this.showOrderList = this.orderList;
            }else{
                this.showOrderList = this.orderList.slice(0,2);
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
            this.homeAddress =this.personInfo.address;
            this.streetVal = this.personInfo.street;
            this.commitytVal = this.personInfo.housingEstate;
            this.areaVal = this.personInfo.area;
            api.getPackageXq({id:this.$route.params.id}).then(res=>{
                this.orderList = res.data.data.packageDTO.productList;
                this.productInfo = res.data.data.packageDTO.packageType;
                if(this.orderList.length>2){
                    this.showOrderList = this.orderList.slice(0,2);
                }
            })
        }else{
            //页面刷新时，自动返回上个页面
            this.centerDialogVisible = true;
            this.$router.replace({name:'receivelist'});
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
                    padding-right: 30px;
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
                            .img{
                                width: 84px;
                                height: 84px;
                                background-color: #F2F6FC;
                                margin-right: 10px;
                                flex-shrink: 0;
                                img{
                                    width: 100%;
                                }
                            }
                            .font{
                                flex-grow: 0;
                                margin-right: 10px;
                                .title{
                                    font-size: 14px;
                                    color: $black;
                                    font-weight: bold;
                                    line-height: 20px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                                .desc{
                                    font-size: 14px;
                                    color: #999;
                                    margin-top: 4px;
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
                    .line.home{
                        margin-bottom: 10px;
                        display: flex;
                        .el-select{
                            flex-grow: 1;
                        }
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
            }
            .right-money{
                width: 300px;
                box-sizing: border-box;
                padding: 20px;
                border: 1px solid #DCDFE6;
                height: 256px;
                margin-top: 42px;
                .title{
                    font-size: 18px;
                    color: $black;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 15px;
                }
                .top{
                    padding-bottom: 26px;
                    border-bottom: 1px solid #DCDFE6;
                    margin-bottom: 26px;
                }
                .price-detail{
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    .tit{
                        color: $black2;
                    }
                    .desc{
                        color: $black;
                    }
                }
                .sign-btn{
                    width: 94px;
                    height: 40px;
                    background-color: $myblue;
                    font-size: 14px;
                    color: #fff;
                    float: right;
                    margin-top: 6px;
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




