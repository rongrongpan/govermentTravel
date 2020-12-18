<template>
    <div class="count-data">
        <div class="retire-title">
            <div class="lefticon">
                <img class="logo" src="@/assets/tabbar7.png" alt="图片"><span class="imgspan">家孝通消费</span>
            </div>
            <div class="countdesc">
                <p>数据来源：家孝通小程序</p>
                <p>更新时间：{{date.getFullYear()}}年{{date.getMonth()+1}}月{{date.getDate()}}日 {{date.getHours()}}:{{date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes()}}</p>
            </div>
            <el-select style="margin-left:20px;width:120px;" class="noborder left" size="small" @change="getData" v-if="yearDate.length" v-model="yearDateV" placeholder="请选择">
                <el-option
                v-for="item in yearDate"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>

        <div class="content-wrapper">
        <div class="data-content">
            <ul class="data-top">
                <li class="basic-data">
                    <div class="dataall">
                        <div class="item left-item">
                            <p class="tit">家孝通退休用户 <span class="ren">（人）</span></p>
                            <p class="desc big">{{consumeData.totalPeople}}</p>
                        </div>
                        <div class="item">
                            <p class="tit">家孝通文体经费总额 <span class="ren">（元）</span></p>
                            <p class="desc black">{{consumeData.totalAmount}}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="echerts-wrapper">
                <div class="left" style="margin-right:50px;">
                    <p class="title">{{yearDateV}}年各项消费占比</p>
                    <div class="wra">
                        <div id="myChart" :style="{width: '380px', height: '300px'}"></div>
                        <ul class="typelist">
                            <li>
                                <p class="top"><span class="color" style="backgroundColor: #FCD039;"></span>游·消费 <span class="mon">（元）</span></p>
                                <p class="bottom">{{consumeData.tourTotalAmount}} <span>{{consumeData.tourPercentage}}</span></p>
                            </li>
                            <li>
                                <p class="top"><span class="color" style="backgroundColor: #FF7661;"></span>购·消费 <span class="mon">（元）</span></p>
                                <p class="bottom">{{consumeData.shopTotalAmount}} <span>{{consumeData.shopPercentage}}</span></p>
                            </li>
                            <li>
                                <p class="top"><span class="color" style="backgroundColor: #41DBCD;"></span>食·消费 <span class="mon">（元）</span></p>
                                <p class="bottom">{{consumeData.foodTotalAmount}} <span>{{consumeData.foodPercentage}}</span></p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="left">
                    <p class="title">文体经费年度消费情况</p>
                    <div id="myChart1" :style="{width: '380px', height: '300px'}"></div>
                </div>
            </div>
        </div>

        <div class="shop-history">
            <div class="history-title">
                <div class="left">
                    <p class="title">订单记录</p>
                    <el-select style="width:120px;" class="noborder left" size="small" type="success" v-model="serveType" placeholder="请选择" @change="getList(1)">
                        <el-option 
                        v-for="item in serveTypeZ"
                        :key="item.name"
                        :label="item.name"
                        :value="item.type">
                        </el-option>
                    </el-select>
                </div>
                <el-input
                    size="small"
                    style="width:240px;"
                    placeholder="请输入姓名/身份证号码/订单编号/手机号"
                    prefix-icon="el-icon-search"
                    @keyup.enter.native="getList(1)"
                    v-model="searchWord">
                </el-input>
            </div>
            
            <div class="list">
                <div  v-for="item in historyList.list" :key="item.id">
                    <!-- 消费记录 -->
                     <Shoplist :item="item"  @childChange="changeList"/> 
                </div>
                <HasNone v-if="historyList.list && historyList.list.length===0" /> 
            </div>
            <PageList v-if="historyList.list&&historyList.list.totalPage>1" :current="historyList.pageNum" :totalPage="historyList.totalCount" :pagesize="historyList.pageSize" @changePage="getList" />
            
        </div>
        </div>
        <OrderDetail :orderinfo="xqInfo" :innerVisible="innerVisible" :popType="1" @closeDetailPop="closeDetailPop"/>
    </div>
</template>

<script>
import $ from 'jquery';
import OrderDetail from '@/components/retire/OrderDetail';
import Shoplist from './Shoplist';
import PageList from '@/components/public/Pagelist';
import api from '@/api/index';
import HasNone from '@/components/public/HasNone';

let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')


export default {
    components:{
        OrderDetail,
        Shoplist,
        PageList,
        HasNone
    },
    data(){
        return{
            searchWord:'',
            historyList:{},
            innerVisible: false,
            xqInfo:{},
            serveType:'0',//'全部订单','商品订单','旅游订单','餐饮订单','套餐礼包','小型多样化活动'
            serveTypeZ:[{
                name:'全部订单',
                type:'0'
            },{
                name:'商品订单',
                type:'1'
            },{
                name:'旅游订单',
                type:'2'
            },{
                name:'套餐礼包',
                type:'7'
            },{
                name:'小型多样化活动',
                type:'8'
            }],
            date:new Date(),
            consumeData:{},
            yearDate:[],
            yearDateV:0
        }
    },
    methods:{
        changeList(val){
            this.innerVisible = true;
            api.getCountXq({id:val.id}).then(res=>{
                console.log(res.data.data)
                if(res.data.data.orderDetail.orderList){
                    res.data.data.orderDetail.orderList.forEach(ele=>{
                        let price = String((ele.price*0.01).toFixed(2));
                        ele.yuan = price.substr(0,price.length-2);
                        ele.fen = price.substr(price.length-2,price.length);
                    })
                }else if(res.data.data.orderDetail.orderTravelDTO){
                    let price = String((res.data.data.orderDetail.orderTravelDTO.price*0.01).toFixed(2));
                    res.data.data.orderDetail.orderTravelDTO.yuan = price.substr(0,price.length-2);
                    res.data.data.orderDetail.orderTravelDTO.fen = price.substr(price.length-2,price.length);
                    res.data.data.orderDetail.orderTravelDTO.insurance = (res.data.data.orderDetail.orderTravelDTO.insurance*0.01).toFixed(2);
                }else if(res.data.data.orderDetail.infoPackageDTO){
                    let price = String((res.data.data.orderDetail.infoPackageDTO.price*0.01).toFixed(2));
                    res.data.data.orderDetail.infoPackageDTO.yuan = price.substr(0,price.length-2);
                    res.data.data.orderDetail.infoPackageDTO.fen = price.substr(price.length-2,price.length);
                }
                res.data.data.orderDetail.discountedPrice = (res.data.data.orderDetail.discountedPrice*0.01).toFixed(2);
                res.data.data.orderDetail.realPayment = (res.data.data.orderDetail.realPayment*0.01).toFixed(2);
                res.data.data.orderDetail.totalPrice = (res.data.data.orderDetail.totalPrice*0.01).toFixed(2);
                this.xqInfo = res.data.data.orderDetail;
            })
        },
        closeDetailPop(){
            this.innerVisible = false;
        },
        getList(pageNum){
            api.appComsumeList({
                orderType:this.serveType==0?'':this.serveType==3?4:this.serveType==4?7:this.serveType,
                pageNum:pageNum,
                pageSize:50,
                queryParams:this.searchWord,
                yearDate:this.dealYear()
            }).then(res=>{
                if(res.data.code===0){
                    res.data.data.list.forEach(ele=>{
                        let price = String((ele.realPayment*0.01).toFixed(2));
                        ele.yuan = price.substr(0,price.length-2);
                        ele.fen = price.substr(price.length-2,price.length);
                        if(ele.productList){
                            ele.productList.forEach(ele=>{
                                let price = String((ele.price*0.01).toFixed(2));
                                ele.yuan = price.substr(0,price.length-2);
                                ele.fen = price.substr(price.length-2,price.length);
                            })
                        }else if(ele.orderTravelDTO){
                            let price = String((ele.orderTravelDTO.price*0.01).toFixed(2));
                            ele.orderTravelDTO.yuan = price.substr(0,price.length-2);
                            ele.orderTravelDTO.fen = price.substr(price.length-2,price.length);
                        }else if(ele.infoPackageDTO){
                            let price = String((ele.infoPackageDTO.price*0.01).toFixed(2));
                            ele.infoPackageDTO.yuan = price.substr(0,price.length-2);
                            ele.infoPackageDTO.fen = price.substr(price.length-2,price.length);
                        }
                    })
                    this.historyList = res.data.data;
                }else{
                    this.$reMessage(res.data.msg,'error');
                }
            })
        },
        dealYear(){
            let d = new Date();
            let month = d.getMonth()+1;
            let day = d.getDate();
            if(month<10){
                month = "0"+month;
            }
            if(day<10){
                day = "0"+day;
            }
            let year = '';
            if(Number(this.yearDateV)===d.getFullYear()){
               year =  this.yearDateV+"-"+month+"-"+day;
            }else{
                year = this.yearDateV+"-01-01";
            }
            return year;
        },
        getData(){
            api.appComsumeData({
                yearDate:this.dealYear()
            }).then(res=>{
                if(res.data.code===0){
                    res.data.data.data.tourTotalAmount = (res.data.data.data.tourTotalAmount*0.01).toFixed(2);
                    res.data.data.data.shopTotalAmount = (res.data.data.data.shopTotalAmount*0.01).toFixed(2);
                    res.data.data.data.foodTotalAmount = (res.data.data.data.foodTotalAmount*0.01).toFixed(2);
                    res.data.data.data.totalAmount = (res.data.data.data.totalAmount*0.01).toFixed(2);
                    let arr = [];
                    res.data.data.data.list.forEach(ele=>{
                        arr.push((ele*0.01).toFixed(2));
                    })
                    res.data.data.data.list = arr;
                    this.consumeData = res.data.data.data;                   
                    this.drawLine();
                    this.getList(1);
                }
            })
        },
        drawLine(){
            // 饼状图
            let myChart = this.$echarts.init(document.getElementById('myChart'));
            myChart.setOption({
                tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right:0,
                top:100,
                data:[]
            },
            series: [
                {
                    name:'数据占比',
                    type:'pie',
                    color: ['#FCD039', '#FF7661', '#41DBCD'],
                    radius: ['45%', '70%'],
                    center:['50%','50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'normal'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:this.consumeData.tourTotalAmount, name:'游·消费'},
                        {value:this.consumeData.shopTotalAmount, name:'购·消费'},
                        {value:this.consumeData.foodTotalAmount, name:'食·消费'}
                    ]
                }
            ]
            });

            // 柱状图
            let myChart1 = this.$echarts.init(document.getElementById('myChart1'));
            let year = new Date().getFullYear();
            myChart1.setOption({
                color: ['#4080FF'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow',
                        shadowStyle:{
                            color:'rgba(64,128,255,.08)'
                        }
                    }
                },
                grid: {
                    left: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : [year-4, year-3, year-2, year-1, year],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:'消费总额',
                        type:'bar',
                        barWidth: '30%',
                        data:this.consumeData.list
                    }
                ]
                });
        }
    },
    created(){
        let arr = [];
        this.yearDateV = new Date().getFullYear();
        for(let i=2019;i<=this.yearDateV;i++){
            arr.push(String(i))
        }
        this.yearDate = arr; 
        this.getData();
    }
}
</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        overflow: auto;
        height: calc(100% - 54px);
    }
    .retire-title{
        width: 100%;
        font-size: 24px;
        color: $black;
        display: flex;
        align-items: center;
        img.logo{
            width: 54px;
            margin-right: 8px;
            vertical-align: middle;
        }
        .imgspan{
            font-weight: bold;
        }
        .countdesc{
            font-size: 12px;
            color: $black3;
            font-weight: normal;
            line-height: 20px;
            margin-left: 16px;
        }
    }
    .count-data{
        width: 100%;
        height: 100%;
        overflow: auto;
        .data-content{
            width: 100%;
            margin-top: 10px;
            .data-top{
                width: 1000px;
                li{
                    width: 100%;
                    border-top: 1px solid #E4E7ED;
                    height: 122px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding-bottom: 20px;
                    .dataall{
                        width: 45%;
                        display: flex;
                        padding-top: 18px;
                        .item{
                            .tit{
                                font-size: 12px;
                                color: $black;
                                .ren{
                                    font-size: 14px;
                                    color: $black2;
                                }
                            }
                            .desc{
                                font-size: 50px;
                                color: #67C23A;
                                font-weight: bold;
                                margin-top: 10px;
                                line-height: 36px;
                            }
                            
                        }
                        .left-item{
                            margin-right: 100px;
                        }
                    }
                    .data-card{
                        width: 55%;
                        height: 60px;
                        border-radius: 4px;
                        background-color: #F5F7FA;
                        border: 1px solid #DCDFE6;
                        position: relative;
                        box-sizing: border-box;
                        padding: 8px 10px;
                        display: flex;
                        justify-content: space-between;
                        margin-top: 30px;
                        .item{
                            width: 33.3%;
                            .tit{
                                font-size: 12px;
                                color: $black;
                                .ren{
                                    color: $black2;
                                }
                            }
                            .desc{
                                font-size: 18px;
                                color: $black;
                                font-weight: bold;
                                margin-top: 6px;
                                .percent{
                                    font-weight: normal;
                                    font-size: 12px;
                                    color: $black2;
                                }
                            }
                        }
                        .item:nth-of-type(2){
                            margin: 0 13px;
                        }
                        
                    }
                    .data-card:after{
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        border-top: 1px solid #DCDFE6;
                        border-left: 1px solid #DCDFE6;
                        transform: rotateZ(-45deg);
                        background-color: #F5F7FA;
                        left: -5px;
                        top: 50%;
                        margin-top: -5px;
                        content: "";
                        clear: both;

                    }
                }
                .basic-data{
                    .dataall{
                        .item{
                            .tit{
                                font-size: 16px;
                                font-weight: bold;
                            }
                            .desc{
                                color: $myblue1;
                                margin-top:28px;
                            }
                            .desc.black{
                                color: $black;
                            }
                        }
                    }
                }
                li:first-of-type{
                    border-top: 0;
                }
            }
            .echerts-wrapper{
                width: 100%;
                display: flex;
                margin-top: 10px;
                .left{
                    width: 50%;
                    .title{
                        font-size: 16px;
                        color: $black;
                        font-weight: bold;
                    }
                    .wra{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .typelist{
                            li{
                                margin-bottom: 16px;
                                .top{
                                    font-size: 12px;
                                    color: $black;
                                    .mon{
                                        color: $black3;
                                    }
                                    .color{
                                        display: inline-block;
                                        width: 28px;
                                        height: 16px;
                                        border-radius: 8px;
                                        margin-right: 10px;
                                        vertical-align: middle;
                                    }
                                }
                                .bottom{
                                    font-size: 18px;
                                    color: $black;
                                    padding-left: 38px;
                                    margin-top: 3px;
                                    span{
                                        color: $black3;
                                        font-size: 12px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .shop-history{
            margin-top: 30px;
            margin-right: 10px;
            .history-title{
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
                .left{
                    display: flex;
                    align-items: center;
                }
                .title{
                    font-size: 24px;
                    color: $black;
                    font-weight: bold;
                    line-height: 32px;
                    display: inline-block;
                    padding-right: 10px;
                    vertical-align: top;
                }
            }
            .list{
                width: 100%;
                max-height: 700px;
                overflow: auto;
            }
            
        }
    }
</style>
<style>
    .retirement-xq .el-dialog__footer{
        text-align: center;
    }
    .history-title .left .el-input__icon{
        line-height: 20px;
    }
    .shop-history .hasnone{
        padding-top: 60px;
    }
</style>


