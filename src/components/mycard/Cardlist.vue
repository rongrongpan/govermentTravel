<template>
    <div class="retirement">
        <div class="retire-title"><img src="@/assets/tabbar4.png" alt="">孝亲卡</div>
        <div class="data-show">
            <p class="li">已消费总额 
                <el-popover
                    placement="right"
                    trigger="hover">
                    <ul class="data-pop">
                        <li>
                            <p class="num">{{consumeData.totalEntityConsumed}}</p>
                            <p class="desc">实体卡</p>
                        </li>
                        <li>
                            <p class="num">{{consumeData.totalVirtualConsumed}}</p>
                            <p class="desc">电子卡</p>
                        </li>
                    </ul>
                    <span class="data" slot="reference">{{consumeData.totalConsumed}} <span>明细</span></span>
                </el-popover>
                
            </p>
            <p class="li">未消费总额 
                <el-popover
                    placement="right"
                    trigger="hover">
                    <ul class="data-pop">
                        <li>
                            <p class="num">{{consumeData.totalEntityNuConsumed}}</p>
                            <p class="desc">实体卡</p>
                        </li>
                        <li>
                            <p class="num">{{consumeData.totalVirtualNuConsumed}}</p>
                            <p class="desc">电子卡</p>
                        </li>
                    </ul>
                    <span class="data" slot="reference">{{consumeData.totalNuConsumed}} <span>明细</span></span>
                </el-popover>
            </p>
            <p class="li">申领总人数 
                <el-popover
                    placement="right"
                    trigger="hover">
                    <ul class="data-pop">
                        <li>
                            <p class="num">{{consumeData.totalEntityApplicationNumber}}</p>
                            <p class="desc">实体卡</p>
                        </li>
                        <li>
                            <p class="num">{{consumeData.totalVirtualApplicationNumber}}</p>
                            <p class="desc">电子卡</p>
                        </li>
                    </ul>
                    <span class="data" slot="reference">{{consumeData.totalApplicationNumber}} <span>明细</span></span>
                </el-popover>
            </p>
        </div>
        <div class="search">
            <div class="retiretitle-left">
                <el-button v-if="$store.state.userInfo.housingEstate" style="margin-right:10px;" type="primary" plain size="small" @click="outPut">导出当前列表 <i class="el-icon-printer"></i></el-button>
                <a target="_blank" id="down1" style="display:none;" :href="downLink"></a>
                <el-button type="primary" plain size="small" @click="centerDialogVisible=true">批量创建</el-button>
                <el-button size="small" type="primary" style="width:120px;" @click="centerDialog = true">申请孝亲卡</el-button>
                <el-select size="small" style="width:120px;margin-left:10px;" v-model="classfiyValue" placeholder="请选择" @change="getList(1)">
                    <el-option
                    v-for="(item,index) in classfiyValueZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-date-picker
                    style="margin-left:10px;width:120px;"
                    size="small"
                    :clearable="false"
                    v-model="valueDate"
                    type="month"
                    @change="getList(1)"
                    placeholder="选择月">
                </el-date-picker>
                <el-checkbox @change="getList(1)" style="margin-left:10px;" v-model="checkMonth">按月查</el-checkbox>
                <span class="pageLIstNumber" style="margin-left:20px;">共 {{personList.totalCount}} 条</span>
                <a v-if="$store.state.userInfo.housingEstate" class="moban" href="http://www.yueyilan.com/img-yueyilan/download/%E5%AD%9D%E4%BA%B2%E5%8D%A1.xls">批量上传模板下载</a>
            </div>  
            <el-input
                size="small"
                style="width:240px"
                placeholder="请输入姓名/身份证号码"
                prefix-icon="el-icon-search"
                @keyup.enter.native="getList(1)"
                v-model="searchWord">
            </el-input>
        </div>
        <div class="personlist-wrapper">
            <dl class="personlist">
            <dt>
                <span class="name">姓名</span>
                <span class="card">身份证号码</span>
                <span class="phone">联系电话</span>
                <div class="street-wra">
                    <span v-if="$store.state.userInfo.street">{{$store.state.userInfo.street}}</span>
                    <el-select v-else class="street" clearable v-model="streetValue" placeholder="全部街道" @change="getList(1,1)">
                        <el-option
                        v-for="item in streetList[$store.state.userInfo.area]"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select> 
                </div>
                <span class="community">
                    <span v-if="$store.state.userInfo.housingEstate">{{$store.state.userInfo.housingEstate}}</span>
                    <el-select v-else class="street" clearable v-model="communityValue" placeholder="全部社区" @change="getList(1)">
                        <el-option
                        v-for="item in communityList[streetValue]"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    
                </span>
                <span class="progress">卡片进度</span>

            </dt>
            <div class="dt-h"></div>
            <dd v-for="(item) in personList.list" :key="item.xcid" @click="openProgress(item.xcid)">
                <div class="top-title">
                    <span class="name"><span>{{item.userName}}</span></span>
                    <span class="card">{{item.userIdCard}}</span>
                    <span class="phone">{{item.userPhone}}</span>
                    <div class="street-wra">
                        {{item.street}}
                    </div>
                    <span class="community">{{item.housingEstate}}</span>
                    <span class="progress" style="color:#1060FF" v-if="item.status == '1'">待领取</span>
                    <span class="progress" style="color:#C0C4CC" v-if="item.status == '2'">已领取</span>
                </div>
            </dd>
            <HasNone v-if="personList.list && personList.list.length===0" />
        </dl>
        <PageList :current="personList.pageNum" :totalPage="personList.totalCount" :pagesize="personList.pageSize" @changePage="getList" />
        </div>

        <Testpop testType='1' :centerDialogVisible="centerDialog" v-on:changeCom="changeParent"/>

        <OrderDetail :orderinfo="xqInfo" :popType="3" :innerVisible="innerVisible" @closeDetailPop="closeDetailPop"/>
        <UpFile :centerDialogVisible="centerDialogVisible" @changeFile="changeFile" :type="8" />

    </div>
</template>
<script>
import $ from 'jquery';
import PageList from '@/components/public/Pagelist';
import Testpop from '@/components/public/TestPop';
import OrderDetail from '@/components/retire/OrderDetail';
import api from '@/api/index';
import HasNone from '@/components/public/HasNone';
import { Loading } from 'element-ui';
import address from '@/components/public/address.js';
import UpFile from '@/components/public/UpFile';
export default {
    components:{
        PageList,
        Testpop,
        OrderDetail,
        HasNone,
        UpFile
    },
    data(){
        return{
            searchWord:'',
            valueDate:'2017-01',
            classfiyValue:0,
            classfiyValueZ:['全部','一年制','半年制'],
            innerVisible:false,
            centerDialog:false,
            streetValue:this.$store.state.userInfo.street||null,
            streetList:address.street,
            communityValue:this.$store.state.userInfo.housingEstate||null,
            communityList:address.community,
            personList:[],
            xqInfo:{},
            checkMonth:false,//选中表示按月查询订单
            consumeData:{},
            downLink:'',
            centerDialogVisible:false,//批量创建
        }
    },
    methods:{
        changeFile(){
            this.centerDialogVisible = false;
            this.getList(1);
        },
        openProgress(id){
            this.innerVisible = true;
            api.getCardXq({id:id}).then(res=>{
                this.xqInfo= res.data.data.claimDetailDto;
            })
        },
        changeParent(){
            this.centerDialog=false;
        },
        closeDetailPop(val){
            this.innerVisible = false;
            if(val){
                this.getList(this.personList.pageNum);
            }
        },
        getList(pageNum,date){
            let loadingInstance = Loading.service();
            if(date){
                this.communityValue=null;
            }
            let datel = new Date(this.valueDate);
            let valueDate = '';
            if(this.checkMonth){
                let month = datel.getMonth()+1;
               valueDate = datel.getFullYear() + '-' + (month>9?month:'0'+month);
            }else{
                valueDate = datel.getFullYear();
            }
            this.downLink = this.$store.state.baseUrl+'/xiaoqin/list/excel?createTime='+valueDate+'&fundType='+this.classfiyValue;
            api.getXiaoqinList({
                createTime:valueDate,
                pageNum:pageNum,
                pageSize:50,
                queryParams:this.searchWord,
                fundType:this.classfiyValue,
                paramStreet:this.streetValue,
                paramHousingEstate:this.communityValue
            }).then(res=>{
                loadingInstance.close();
                if(res.data.code===0){
                    this.personList = res.data.data;
                }
            })
        },
        getData(){
            let datel = new Date(this.valueDate);
            api.getCardData({dateTime:datel.getFullYear()+'-01-01'}).then(res=>{
                this.consumeData = res.data.data.cardData;
            })
        },
        outPut(){
            let a = document.getElementById('down1');
            a.click();
        }
    },
    created(){
        let date = new Date();
        this.valueDate = date.getTime();
        this.getList(1);
        this.getData();
    }

}
</script>

<style lang="scss" scoped>
    .retirement{
        width: 100%;
        height: 100%;
        .search{
            .retiretitle-left{
                font-size: 0;
                display: flex;
                align-items: center;
            }
        }
        .data-show{
            width: 100%;
            display: flex;
            align-items: center;
            height: 40px;
            font-size: 16px;
            color: #333;
            .li{
                margin-right: 40px;
                display: flex;
                align-items: center;
                .data{
                    font-size: 25px;
                    color: #4080FF;
                    margin-left: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    span{
                        color: #909399;
                        font-size: 12px;
                        margin-left: 10px;
                    }
                    &:hover span{
                            color: #4080FF;
                        }
                }
            }
        }
        .personlist-wrapper{
            overflow: hidden;
            width: 100%;
            position: relative;
            height: calc(100% - 140px);
        }
        .personlist{
            margin-top: 20px;
            width: 100%;
            height: calc(100% - 80px);
            overflow:auto;
            dt{
                position: absolute;
                top: 20px;
                left: 0;
                z-index: 99;
            }
            .dt-h{
                height: 48px;
                width: 100%;
            }
            dt,dd{
                border-bottom: 1px solid #EBEEF5;
            }
            dd .top-title{
                transition: background-color .3s ease-out;
                -webkit-transition: background-color .3s ease-out;
                -moz-transition: background-color .3s ease-out;
            }
            dt,dd .top-title{
                width: 100%;
                height: 48px;
                line-height: 48px;
                background-color: #F5F7FA;
                box-sizing: border-box;
                padding: 0 20px;
                justify-content: space-between;
                display: flex;
                font-size: 14px;
                color: #909399;
                .name{
                    width: 18%;
                }
                .card{
                    width: 17%;
                }
                .phone{
                    width: 17%;
                }
                .street-wra{
                    width: 15%;
                }
                .community{
                    width: 18%;
                }
                .progress{
                    width: 15%;
                }
                .name,.card,.phone,.street-wra,.community{
                    flex-grow: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            dd .top-title{
                background-color: #fff;
                cursor: pointer;
            }
            dd.active .top-title{
                background-color: #F5F7FA;
                border-bottom: 1px solid #EBEEF5;
            }
            dd .top-title:hover{
                background-color: #F5F7FA;
            }
        }
    }
    .data-pop{
        width: 100%;
        li{
            display: inline-block;
            vertical-align: top;
            text-align: center;
            margin-right: 15px;
            .num{
                font-size: 18px;
                color: #303133;
            }
            .desc{
                font-size: 12px;
                color: #909399;
            }
        }
        li:last-child{
            margin-right: 0;
        }
    }
</style>



