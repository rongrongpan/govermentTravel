<template>
    <div class="retirement-xq">
        <div class="xqname">退休人员 /<span> {{basicInfo.elderName}}</span></div>
        <div class="person-info">
            <div class="basic-info">
                <span class="name">{{basicInfo.elderName}}</span>
                <span class="sex">{{basicInfo.sex}}</span>
                <span class="age">{{basicInfo.age}}岁</span>
                <span class="card">{{basicInfo.fundType==='1'?'一年制':'半年制'}}</span>
                <span class="edit" @click="openEdit=true">编辑<i class="el-icon-edit-outline"></i></span>
            </div>
            <div class="info-detail">
                <div class="line">
                    <div class="li">
                        <p class="tit">文体经费余额</p>
                        <p class="desc">{{(basicInfo.balance*0.01).toFixed(2)}}</p>
                    </div>
                    <div class="li" v-if="basicInfo.xiaoqinCardnum">
                        <p class="tit">孝亲卡卡号</p>
                        <p class="desc">{{basicInfo.xiaoqinCardnum}}</p>
                    </div>
                    <div class="li"></div>
                </div>
                <div class="line">
                    <div class="li">
                        <p class="tit">身份证号码</p>
                        <p class="desc">{{basicInfo.idCard}}</p>
                    </div>
                    <div class="li">
                        <p class="tit">紧急联系人</p>
                        <p class="desc">{{basicInfo.relativesName}}</p>
                    </div>
                    <div class="li">
                        <p class="tit">社区负责人</p>
                        <p class="desc">{{basicInfo.govName}}</p>
                    </div>
                </div>
                <div class="line">
                    <div class="li">
                        <p class="tit">联系电话</p>
                        <p class="desc">{{basicInfo.phone}}</p>
                    </div>
                    <div class="li">
                        <p class="tit">紧急电话</p>
                        <p class="desc">{{basicInfo.relativesPhone}}</p>
                    </div>
                    <div class="li">
                        <p class="tit">负责人电话</p>
                        <p class="desc">{{basicInfo.govPhone}}</p>
                    </div>
                </div>
                <div class="lineone">
                    <p class="tit">所属区域</p>
                    <p class="de">{{basicInfo.area}} {{basicInfo.street}} {{basicInfo.housingEstate}}</p>
                </div>
                <div class="lineone">
                    <p class="tit">联系地址</p>
                    <p class="de">{{basicInfo.address}}</p>
                </div>
            </div>
        </div>

        <div class="shop-history">
            <div class="title">
                <p>消费记录</p>
                <el-select v-if="yearDate>=0" style="width:119px;" @change="getShopList" v-model="yearDate" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in yearDateZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
            </div>
            <div class="list">
                <!-- 孝亲卡申领 -->
                <ListCom v-if="historyList.xiaoqinList" :item="historyList.xiaoqinList" @childChange="changeList($event,historyList.xiaoqinList.id)"/>
                <!-- 上门慰问 -->
                <template v-else-if="historyList.homeConsoleList && historyList.homeConsoleList.length">
                    <OrderList v-for="item in historyList.homeConsoleList" :key="item.id" :item="item"  @childChange="changeList($event,item.id)" @toPrint="toPrint(item)"/>
                </template>
                <!-- 活动 -->
                <template v-else-if="historyList.activity && historyList.activity.length">
                    <OrderList v-for="item in historyList.activity" :key="item.id" :item="item"  @childChange="changeList($event,item.id)" @toPrint="toPrint(item)"/>
                </template>
                <!-- 旅游 -->
                <TravelDemo  v-else-if="historyList.travel" :item="historyList.travel" :index="null" @childChange="changeList($event,historyList.travel.id)"/>
                <hasNone v-else />
            </div>
        </div>
        <OrderDetail :orderinfo="xqInfo" :popType="popType" :innerVisible="innerVisible" @closeDetailPop="closeDetailPop"/>

        <Print v-if="printData.id" @closeTheTime="closeTime" :openTheTime="openTheTime" :info="printData" />

        <ChangeInfo :openEdit="openEdit" @closeEdit="closeEdit" :info="basicInfo"/>
    </div>
</template>

<script>
import OrderDetail from './OrderDetail';
import OrderList from '@/components/count/OrderList';
import ListCom from '@/components/visit/ListCom';
import HasNone from '@/components/public/HasNone';
import api from '@/api/index'
import Print from '@/components/receive/Print';
import ChangeInfo from './ChangeInfo';
// import ActiveDemo from '@/components/active/ListDemo';
import TravelDemo from '@/components/trival/ListDemo';
export default {
    data(){
        return{
            historyList:{},
            xqInfo:{},
            innerVisible: false,
            popType:2,  //3孝亲卡  2上门慰问 活动
            basicInfo:{},
            openTheTime:false,
            openEdit:false,
            yearDate:-1,
            yearDateZ:[],
            printData:{}
        }
    },
    components:{
        OrderDetail,
        OrderList,
        ListCom,
        HasNone,
        Print,
        ChangeInfo,
        TravelDemo
    },
    methods:{
        changeList(val,id){
            if(val.popType==3){
                // 查看孝亲卡申领详情
                api.getListXq({id,source:'claim'}).then(res=>{
                    this.xqInfo = res.data.data.xiaoqinDTO;
                    this.$nextTick(function(){
                        this.popType = val.popType;
                        this.innerVisible = true;
                    })
                })
            }else if(val.popType==2){
                api.getVisitXq({id}).then(res=>{
                    this.xqInfo = res.data.data.order;
                    this.$nextTick(function(){
                        this.popType = val.popType;
                        this.innerVisible = true;
                    })
                })
            }else if(val.popType==4){
                api.travelXq({id}).then(res=>{
                    this.xqInfo = res.data.data.retirementTravelOrder;
                    this.$nextTick(function(){
                        this.popType = val.popType;
                        this.innerVisible = true;
                    })
                })
            }else if(val.popType==5){
                api.activeXq({id}).then(res=>{
                    res.data.data.retirementActivityOrderDetailVO.gift = JSON.parse(res.data.data.retirementActivityOrderDetailVO.gift);
                    this.xqInfo = res.data.data.retirementActivityOrderDetailVO;
                    this.$nextTick(function(){
                        this.popType = val.popType;
                        this.innerVisible = true;
                    }) 
                })
            }
        },
        //打印
        toPrint(val){
            this.printData = val;
            console.log(this.printData)
            this.openTheTime = true;
        },
        closeTime(){
            this.openTheTime = false;
        },
        closeDetailPop(e){
            if(e){
                this.getShopList()
            }
            this.innerVisible = false;
        },
        getInfo(){
            api.getRetireXq({id:this.$route.params.id}).then(res=>{
                this.basicInfo = res.data.data.RetireeUserBaseDto;
            })
        },
        getShopList(){
            api.getShopList({id:this.$route.params.id,date:this.yearDateZ[this.yearDate]+'-01-01'}).then(res=>{
                if(res.data.data.homeConsoleList){
                    this.popType = 2;
                    res.data.data.homeConsoleList.forEach(function(ele){
                        let price = String((ele.packageItemDTO.packagePrice*0.01).toFixed(2));
                        ele.packageItemDTO.yuan = price.substr(0,price.length-2);
                        ele.packageItemDTO.fen = price.substr(price.length-2,price.length);
                    })
                }else if(res.data.data.xiaoqinList){
                    this.popType = 3;
                }else if(res.data.data.travel){
                    this.popType = 4;
                }else if(res.data.data.activity){
                    this.popType = 5;
                }
                this.historyList = res.data.data;
            })
        },
        closeEdit(e){
            this.openEdit = false;
            if(e===2){
                this.getInfo();
            }
        },
        getYear(){
            let year = this.$store.state.userInfo.years;
            for(let i=2019;i<=year;i++){
                this.yearDateZ.push(i)
            }
            this.yearDate = this.yearDateZ.length-1;
            this.getShopList();
        }
    },
    created(){
        this.getYear();
        this.getInfo();
    }

}
</script>

<style lang="scss" scoped>
    .retirement-xq{
        width: 100%;
        box-sizing: border-box;
        padding-right: 10px;
        overflow: hidden;
        height: 100%;
        .xqname{
            font-size: 12px;
            color: $black2;
            padding-bottom: 24px;
            span{
                color: $black;
            }
        }
        .person-info{
            width: 100%;
            .basic-info{
                font-size: 16px;
                color: $black1;
                .name{
                    font-size: 24px;
                    color: $black;
                    font-weight: bold;
                    span{
                        font-size: 14px;
                        color: $black;
                        font-weight: normal;
                    }
                }
                span{
                    margin-right: 16px;
                }
                .edit{
                    font-size: 16px;
                    color: $myblue;
                    margin-left: 20px;
                    cursor: pointer;
                    i{
                        margin-left: 5px;
                    }
                }
            }
            .info-detail{
                width: 100%;
                margin-top: 16px;
                .line{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    font-size: 16px;
                    color: $black1;
                    line-height: 26px;
                    padding: 5px 0px;
                    .li{
                        width: 33.333%;
                        display: flex;
                        .tit{
                            width: 120px;
                            color: $black2;
                        }
                    }
                }
                .lineone{
                    width: 100%;
                    display: flex;
                    font-size: 16px;
                    line-height: 26px;
                    padding: 5px 0px;
                    color: $black1;
                    .tit{
                        color: $black2;
                        width: 120px;
                    }
                }
            }
        }
        .shop-history{
            margin-top: 40px;
            height: calc(100% - 307px);
            .title{
                font-size: 24px;
                color: $black;
                font-weight: bold;
                line-height: 32px;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .list{
                height: calc(100% - 48px);
                overflow: auto;
            }
        }
    }
    
</style>

<style lang="scss">
    .retirement-xq .el-dialog__footer{
        text-align: center;
    }
</style>



