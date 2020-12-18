<template>
    <div class="count-data">
        <div class="xqname">上门慰问 /<span> 慰问记录</span></div>
        <div class="search">
            <div class="leftwra">
                <p class="title-list">慰问记录</p>
                <a target="_blank" id="down" :href="downLink"></a>
                <el-button v-if="$store.state.userInfo.housingEstate" size="small" style="margin-left:10px;" @click="outPut()" slot="trigger" type="primary" plain>导出当前列表 <i class="el-icon-printer"></i></el-button>
                <el-select size="small" style="width:120px;margin-left:10px;"  v-model="typeValue" @change="getList(1)" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in typeValueZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-select size="small" style="padding-left:10px;width:120px;" v-model="getAuto" @change="getList(1)" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in getAutoZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-date-picker
                    size="small"
                    style="width:120px;margin-left:10px;"
                    :clearable="false"
                    v-model="valueDate"
                    type="month"
                    @change="getList(1)"
                    placeholder="选择月">
                </el-date-picker>
                <el-checkbox @change="getList(1)" style="margin-left:10px;" v-model="checkMonth">按月查</el-checkbox>
                <span class="pageLIstNumber" style="margin-left:10px;">共 {{historyList.totalCount}} 条</span>
            </div>
            <div class="rightdate">
                <el-input
                    size="small"
                    style="width:240px;"
                    placeholder="请输入姓名/身份证号码"
                    prefix-icon="el-icon-search"
                    @keyup.enter.native="getList(1)"
                    v-model="searchWord">
                </el-input>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="shop-history">
                <div class="list">
                    <div  v-for="(item,index) in historyList.list" :key="item.id">
                        <OrderList :item="item" :index="index"  @childChange="changeList($event,item.id)" @toPrint="toPrint"/>
                    </div>
                    <hasNone v-if="historyList.list && historyList.list.length===0" />
                </div>
            </div>
        </div>
        <PageList :current="historyList.pageNum" :totalPage="historyList.totalCount" :pagesize="historyList.pageSize" @changePage="getList" />

        <OrderDetail :orderinfo="xqInfo" :popType="2" :innerVisible="innerVisible" @closeDetailPop="closeDetailPop"/>

        <Print v-if="historyList.list && historyList.list.length" @closeTheTime="closeTime" :openTheTime="openTheTime" :info="historyList.list[itemIndex]" />  

    </div>
</template>

<script>
import $ from 'jquery';
import OrderDetail from '@/components/retire/OrderDetail';
import OrderList from '@/components/count/OrderList';
import PageList from '@/components/public/Pagelist';
import api from '@/api/index.js';
import HasNone from '@/components/public/HasNone';
import Print from '@/components/receive/Print';
import { Loading } from 'element-ui';

export default {
    components:{
        OrderDetail,
        OrderList,
        PageList,
        HasNone,
        Print
    },
    data(){
        return{
            historyList:{},
            valueDate:'2017-01',
            dialogVisible: false,
            innerVisible: false,
            xqInfo:{},
            openTheTime:false,
            itemIndex:0,
            typeValue:0,
            typeValueZ:['订单状态','待派单','已派单','已配送','已完成'],
            getAuto:0,
            getAutoZ:['派送方式','自提','上门配送'],
            checkMonth:false,
            downLink:'',
            searchWord:'',//搜索内容
        }
    },
    methods:{
        changeList(e,id){
            api.getVisitXq({id}).then(res=>{
                this.xqInfo = res.data.data.order;
                this.$nextTick(function(){
                    this.innerVisible = true;
                })
            })
        },
        toPrint(e){
            this.itemIndex = e.index;
            this.openTheTime = true;
        },
        closeTime(){
            this.openTheTime = false;
        },
        closeDetailPop(e){
            if(e){
                this.getList(1);
            }
            this.innerVisible = false;
        },
        getList(pageNum){
            let loadingInstance = Loading.service();
            let date = new Date(this.valueDate);
            let valueDate = '';
            if(this.checkMonth){
                let d = date.getMonth()+1;
                valueDate = date.getFullYear() + '-' + (d>=10?d:'0'+d);
            }else{
                valueDate = String(date.getFullYear())
            }
            this.downLink = this.$store.state.baseUrl+'/excel/orderexport?orderStatus='+this.typeValue+'&personally='+this.getAuto+'&createTime='+valueDate+'&orderType=4';
            api.getPackageList({
                createTime:valueDate,
                pageNum,
                pageSize:50,
                orderStatus:this.typeValue,
                personally:this.getAuto,
                queryParams:this.searchWord
                }).then(res=>{
                loadingInstance.close();
                res.data.data.list.forEach(ele=>{
                    let price = String((ele.packageItemDTO.packagePrice*0.01).toFixed(2));
                    ele.packageItemDTO.yuan = price.substr(0,price.length-2);;
                    ele.packageItemDTO.fen = price.substr(price.length-2,price.length);;
                })
                this.historyList = res.data.data;
            })
        },
        outPut(){
            let a = document.getElementById('down');
            a.click();
        }
    },
    created(){
        let date = new Date();
        this.valueDate = date.getTime();
        this.getList(1); 
    }
}
</script>

<style lang="scss" scoped>
#down{
    width: 0;
    height: 0;
    overflow: hidden;
}
    .xqname{
        font-size: 12px;
        color: $black2;
        padding-bottom: 24px;
        span{
            color: $black;
        }
    }
    .search{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        height: 32px;
        .leftwra{
            display: flex;
            align-items: center;
            .hisbtn{
                margin-left: 10px;
            }
        }
        .title-list{
            font-size: 24px;
            color: $black;
            font-weight: bold;
            height: 32px;
            line-height: 32px;
        }
    }
    .content-wrapper{
        width: 100%;
        overflow: auto;
        height: calc(100% - 162px);
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
            margin-right: 15px;
            i{
                color: #4080FF;
                font-size: 22px;
                margin-right: 4px;
            }
        }
        .classfiy-btn{
            margin-left: 20px;
            width: 100px;
            height: 32px;
            padding: 0;
            text-align: center;
        }
    }
    .count-data{
        width: 100%;
        height: 100%;
        overflow: hidden;
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
                    padding-bottom: 50px;
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
                                font-size: 25px;
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
                                margin-top:18px;
                            }
                            .desc.big{
                                font-size: 50px;
                                line-height: 70px;
                                margin-top: 10px;
                            }
                        }
                    }
                }
                li:first-of-type{
                    border-top: 0;
                }
            }
        }
        .shop-history{
            margin-right: 10px;
        }
    }
</style>
<style>
    .retire-title .el-input__inner{
        border: 0;
        height: 20px;
    }
    .retire-title .el-select .el-input .el-select__caret{
        line-height: 20px;
    }
    .retirement-xq .el-dialog__footer{
        text-align: center;
    }
</style>


