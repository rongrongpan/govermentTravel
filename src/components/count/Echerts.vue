<template>
    <div class="count-data" v-if="countInfo.fundPeopleCount">
        <div class="retire-title">
            <img class="logo" src="@/assets/tabbar5.png" alt=""><span class="imgspan">统计</span>
            <div class="addresstype"><i class="el-icon-location"></i>{{$store.state.userInfo.area}}</div>
            <!-- 街道 -->
            <div class="street-wra">
                <span class="community-else" v-if="$store.state.userInfo.street">{{$store.state.userInfo.street}}</span>
                <el-select size="small" class="noborder" clearable style="width:120px;" v-else v-model="streetValue" placeholder="全部街道" @change="getData(true)">
                    <el-option 
                    v-for="item in streetList[$store.state.userInfo.area]"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="lineborder"></div>
            <!-- 社区 -->
            <div class="community">
                <span class="community-else" v-if="$store.state.userInfo.housingEstate">{{$store.state.userInfo.housingEstate}}</span>
                <el-select v-else @change="getData()" clearable size="small" style="width:120px;" class="noborder" v-model="communcityValue" placeholder="全部社区">
                    <el-option
                    v-for="item in communityList[streetValue]"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="lineborder"></div>
            <el-select size="small" style="width:120px;" class="noborder" v-if="yearDate.length" v-model="yearDateV" placeholder="请选择" @change="getData()">
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
                            <p class="tit">退休人员总数 <span class="ren">（人）</span></p>
                            <p class="desc big">{{countInfo.totalPelple[0]}}</p>
                        </div>
                        <div class="item">
                            <p class="tit">文体经费总额 <span class="ren">（元）</span></p>
                            <p class="desc black">{{(countInfo.totalAmount*0.01).toFixed(2)}}</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="echerts-wrapper">
                <div class="left" style="margin-right:50px;">
                    <p class="title">{{yearDateV}}年各项消费人数占比</p>
                    <div class="wra">
                        <div id="myChart" :style="{width:'380px', height:'300px'}"></div>
                        <ul class="typelist">
                            <li>
                                <p class="top"><span class="color" style="backgroundColor: #FCD039;"></span>旅游统计 <span class="mon">（人）</span></p>
                                <p class="bottom">{{countInfo.totalTour}} <span>{{countInfo.tourPercentage}}</span></p>
                            </li>
                            <el-popover
                                placement="right"
                                title=""
                                width="200"
                                trigger="hover">
                                <p class="bottom" v-if="countInfo.fundPeopleCount"><span> 一年制：{{countInfo.totalActivity[1]}} &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp; 半年制：{{countInfo.totalActivity[2]}}</span></p>
                                <li slot="reference">
                                    <p class="top"><span class="color" style="backgroundColor: #836CF2;"></span>活动统计 <span class="mon">（人）</span></p>
                                    <p class="bottom">{{countInfo.totalActivity[0]}} <span>{{countInfo.activityPercentage}}</span></p>
                                </li>
                            </el-popover>
                            
                            <el-popover
                                placement="right"
                                title=""
                                width="200"
                                trigger="hover">
                                <p class="bottom" v-if="countInfo.fundPeopleCount"><span> 一年制：{{countInfo.totalCardHandle[1]}} &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp; 半年制：{{countInfo.totalCardHandle[2]}}</span></p>
                                <li slot="reference">
                                    <p class="top"><span class="color" style="backgroundColor: #FF7661;"></span>孝亲卡办理 <span class="mon">（人）</span></p>
                                    <p class="bottom">{{countInfo.totalCardHandle[0]}} <span>{{countInfo.cardHandlePercentage}}</span></p>
                                </li>
                            </el-popover>
                            <el-popover
                                placement="right"
                                title=""
                                width="200"
                                trigger="hover">
                                <p class="bottom" v-if="countInfo.fundPeopleCount"><span> 一年制：{{countInfo.totalCondolences[1]}} &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp; 半年制：{{countInfo.totalCondolences[2]}}</span></p>
                                <li slot="reference">
                                    <p class="top"><span class="color" style="backgroundColor: #41DBCD;"></span>上门慰问 <span class="mon">（人）</span></p>
                                    <p class="bottom">{{countInfo.totalCondolences[0]}} <span> {{countInfo.condolencesPercentage}}</span></p>
                                </li>
                            </el-popover>
                            <el-popover
                                placement="right"
                                title=""
                                width="200"
                                trigger="hover">
                                <p class="bottom" v-if="countInfo.fundPeopleCount"><span> 一年制：{{countInfo.totalNotConsum[1]}} &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp; 半年制：{{countInfo.totalNotConsum[2]}}</span></p>
                                <li slot="reference">
                                    <p class="top"><span class="color" style="backgroundColor: #4080FF;"></span>未消费 <span class="mon">（人）</span></p>
                                    <p class="bottom">{{countInfo.totalNotConsum[0]}} <span>{{countInfo.notConsumPercentage}}</span></p>
                                </li>
                            </el-popover>
                            
                        </ul>
                    </div>
                </div>
                <div class="left">
                    <p class="title">文体经费近年消费人数情况</p>
                    <div id="myChart1" :style="{width: '380px', height: '300px'}"></div>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import api from '@/api/index';
import { Loading } from 'element-ui';
import address from '@/components/public/address.js';
export default {
    data(){
        return{
            streetValue:this.$store.state.userInfo.street||null,
            streetList:address.street,
            communcityValue:this.$store.state.userInfo.housingEstate||null,
            communityList:address.community,
            countInfo:{},
            yearDate:[],
            yearDateV:0
        }
    },
    methods:{
        //获取年
        getYear(){
            let arr = [];
            this.yearDateV = this.$store.state.userInfo.years;
            for(let i=2019;i<=this.yearDateV;i++){
                arr.push(String(i))
            }
            this.yearDate = arr; 
            this.getData();
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
                    color: ['#FCD039','#836CF2', '#FF7661', '#41DBCD','#4080FF'],
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
                        {value:this.countInfo.totalTour, name:'旅游统计'},
                        {value:this.countInfo.totalActivity[0], name:'活动统计'},
                        {value:this.countInfo.totalCardHandle[0], name:'孝亲卡办理'},
                        {value:this.countInfo.totalCondolences[0], name:'上门慰问'},
                        {value:this.countInfo.totalNotConsum[0], name:'未消费'}
                    ]
                }
            ]
            });

            // 柱状图
            let myChart1 = this.$echarts.init(document.getElementById('myChart1'));
            let year = this.$store.state.userInfo.years;
            myChart1.setOption({
                legend: {
                    show:false,
                },
                grid: {
                    left: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                tooltip: {},
                color: ['#FCD039','#836CF2', '#FF7661', '#41DBCD'],
                dataset: {
                    dimensions: ['product','旅游统计','活动统计', '孝亲卡办理', '上门慰问'],
                    source: [
                        {product: year-4, '旅游统计': this.countInfo.countMap.firstFourYear[2],'活动统计': this.countInfo.countMap.firstFourYear[3], '孝亲卡办理': this.countInfo.countMap.firstFourYear[1], '上门慰问': this.countInfo.countMap.firstFourYear[0]},
                        {product: year-3, '旅游统计': this.countInfo.countMap.firstThreeYear[2],'活动统计': this.countInfo.countMap.firstThreeYear[3], '孝亲卡办理': this.countInfo.countMap.firstThreeYear[1], '上门慰问': this.countInfo.countMap.firstThreeYear[0]},
                        {product: year-2, '旅游统计': this.countInfo.countMap.firstTwoYear[2],'活动统计': this.countInfo.countMap.firstTwoYear[3], '孝亲卡办理': this.countInfo.countMap.firstTwoYear[1], '上门慰问': this.countInfo.countMap.firstTwoYear[0]},
                        {product: year-1, '旅游统计': this.countInfo.countMap.firstOneYear[2],'活动统计': this.countInfo.countMap.firstOneYear[3],'孝亲卡办理': this.countInfo.countMap.firstOneYear[1], '上门慰问': this.countInfo.countMap.firstOneYear[0]},
                        {product: year, '旅游统计': this.countInfo.countMap.thisYear[2], '活动统计': this.countInfo.countMap.thisYear[3],'孝亲卡办理': this.countInfo.countMap.thisYear[1], '上门慰问': this.countInfo.countMap.thisYear[0]}
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {type: 'bar',barWidth: '10%'},
                    {type: 'bar',barWidth: '10%'},
                    {type: 'bar',barWidth: '10%'},
                    {type: 'bar',barWidth: '10%'}
                ]
                });
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
        getData(flag){
            if(flag){
                this.communcityValue=null;
            }
            let loadingInstance = Loading.service();
            api.webConsume({
                yearDate:this.dealYear(),
                paramHousingEstate:this.communcityValue,
                paramStreet:this.streetValue
            }).then(res=>{
                loadingInstance.close();
                if(res.data.code===0){
                    this.countInfo = res.data.data.data;
                    this.$nextTick(function(){
                        this.drawLine();
                    })
                }
            })
        }
    },
    created(){
        this.getYear();     
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
        .addresstype{
            font-size: 20px;
            font-weight: bold;
            color: $black;
            margin-left: 30px;
            border-right: 1px solid #E9EBEF;
            padding-right: 15px;
            line-height: 20px;
            i{
                color: #4080FF;
                font-size: 22px;
                margin-right: 4px;
            }
        }
        .lineborder{
            display: inline-block;
            width: 1px;
            height: 20px;
            background-color: #E9EBEF;
        }
        .classfiy-btn{
            margin-left: 20px;
            width: 100px;
            height: 32px;
            padding: 0;
            text-align: center;
        }
        .street-wra,.community{
            font-size: 14px;
            color: $black;
            font-weight: normal;
        }
        .community-else,.street-else{
            padding: 0 20px;
            color: #606266;
            display: inline-block;
            height: 19px;
            line-height: 17px;
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
                        width: 60%;
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
                                cursor: pointer;
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
            margin-top: 10px;
            margin-right: 10px;
            height: calc(100% - 216px);
            .history-title{
                display: flex;
                justify-content: space-between;
                width: 100%;
                .title{
                    font-size: 24px;
                    color: $black;
                    font-weight: bold;
                    line-height: 32px;
                    margin-bottom: 16px;
                    display: inline-block;
                    padding-right: 10px;
                    vertical-align: top;
                }
                .tosearch{
                    width: 300px;
                    height: 32px;
                    margin-top: 2px
                }
            }
            .list{
                height: 100%;
                padding-right: 10px;
                overflow: auto;
            }
            
        }
    }
</style>
<style>
    .retirement-xq .el-dialog__footer{
        text-align: center;
    }
    .history-title .left input{
        border:0;
        padding: 0;
        border-radius: 0;
        padding-left: 10px;
    }
    .history-title .left .el-input__icon{
        line-height: 20px;
    }
</style>


