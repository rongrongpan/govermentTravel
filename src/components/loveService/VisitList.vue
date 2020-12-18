<template>
    <div class="retirement">
        <div class="retire-title"><img src="@/assets/tabbar8.png" alt="">爱心逆行</div>
        <div class="serveNumber">
            <p>累计服务人数 <span>{{serveNumber.totalServed}}</span></p>
            <p>今日服务人数 <span>{{serveNumber.todayServed}}</span></p>
        </div>
        <div class="search">
            <div class="retiretitle-left">
                <el-button  type="danger" size="small" @click="centerDialog = true">创建探望安排</el-button>
                <el-select size="small" style="width:120px;margin-left:10px;" v-model="classfiyValue" placeholder="请选择" @change="changeSelect">
                    <el-option
                    v-for="(item,index) in classfiyValueZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <el-select size="small" style="width:120px;margin-left:10px;" v-model="typeValue" @change="changeSelect" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in typeValueZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
            </div>  
            <el-input
                size="small"
                style="width:240px;"
                placeholder="请输入姓名/身份证号码"
                prefix-icon="el-icon-search"
                @keyup.enter.native="getList(1)"
                v-model="searchWord">
            </el-input>
        </div>
        <div class="personlist-wrapper">
            <div class="visitlist">
                <ListCom v-for="item in personList.list" :item="item" :key="item.id" @childChange="changeList"/>
                <HasNone v-if="personList.list && personList.list.length===0" />
            </div>
        </div>
        
        <PageList :current="personList.pageNum" :totalPage="personList.totalCount" :pagesize="personList.pageSize" @changePage="getList" />

        <OrderDetail :orderinfo="xqInfo" :innerVisible="innerVisible" :popType="2" @closeDetailPop="closeDetailPop"/>
        
        <Testpop testType='5' :centerDialogVisible="centerDialog" v-on:changeCom="changeParent"/>

    </div>
</template>
<script>
import $ from 'jquery';
import PageList from '@/components/public/Pagelist';
import Testpop from '@/components/public/TestPop';
import ListCom from './ListCom';
import OrderDetail from '@/components/retire/OrderDetail';
import api from '@/api/index';
import HasNone from '@/components/public/HasNone';
import { Loading } from 'element-ui';

export default {
    components:{
        PageList,
        Testpop,
        ListCom,
        OrderDetail,
        HasNone
    },
    data(){
        return{
            searchWord:'',
            classfiyValue:0,
            classfiyValueZ:['全部日期','今天','近三天','本周','本月','近6个月','今年'],
            typeValue:0,
            typeValueZ:['订单类型','待派单','已派单','已探望','已完成'],
            innerVisible:false,
            personList:{},
            centerDialog:false,
            xqInfo:{},
            serveNumber:{}
        }
    },
    methods:{
        changeList(val){
            if(val.popType==2){
                //查看详情
                this.innerVisible = true;
                api.getVisitXq({id:val.id}).then(res=>{
                    this.xqInfo = res.data.data.order;
                })
            }
        },
        closeDetailPop(){
            this.innerVisible = false;
        },
        changeParent(){
            this.centerDialog=false;
        },
        getList(pageNum){
            let loadingInstance = Loading.service();
            let json = {
                date:this.classfiyValue-1,
                orderStatus:this.typeValue,
                orderType:1,
                pageNum:pageNum,
                pageSize:50,
                queryParam:this.searchWord
            }
            api.getVisitList({orderVisitSearchDTO:json}).then(res=>{
                loadingInstance.close();
                this.personList = res.data.data.visitListVOList;
                this.serveNumber = {
                    todayServed:res.data.data.todayServed,
                    totalServed:res.data.data.totalServed
                }
            })
        },
        changeSelect(){
            this.getList(1);
        }
    },
    created(){
        this.getList(1);
    }
}
</script>

<style lang="scss" scoped>
    .retirement{
        width: 100%;
        height: 100%;
        .search{
            width: 100%;
            margin-top: 10px;
            height: 36px !important;
            display: flex;
            justify-content: space-between;
            .retiretitle-left{
                font-size: 0;
                display: flex;
                align-items: center;
            }
            .refresh{
                width: 119px;
                height: 36px;
                padding: 11px 20px;
            }
            .createVisit{
                color: #fff;
            }
            .tosearch{
                width: 300px;
                height: 32px;
                margin-top: 2px;
            }
            .classfiy{
                padding: 11px 10px;
                padding-right: 0;
            }
            .selectDate{
                width: 124px;
                height: 36px;
                input{
                    height: 36px;
                }
            }
        }
        .serveNumber{
            font-size: 14px;
            color: #333;
            display: flex;
            line-height: 30px;
            height: 30px;
            font-weight: bold;
            p{
                margin-right: 40px;
                display: flex;
                align-items: center;
                span{
                    color: #F9496C;
                    font-size: 18px;
                    margin-left: 10px;
                }
            }
        }
        .chooseVisittype{
            width: 100%;
            font-size: 18px;
            color: #333;
            padding-top: 17px;
            border-bottom: 1px solid #E3E6EB;
            span{
                height: 25px;
                line-height: 25px;
                padding-bottom: 8px;
                border-bottom: 2px solid transparent;
                display: inline-block;
                font-weight: bold;
                cursor: pointer;
            }
            span:nth-of-type(1){
                margin-right: 20px;
            }
            span.active{
                border-bottom: 2px solid #4080FF;
            }
        }
        .personlist-wrapper{
            overflow: hidden;
            width: 100%;
            position: relative;
            height: calc(100% - 190px);
            box-sizing: border-box;
            padding-top: 20px;
        }
        .personlist::-webkit-scrollbar {
            width: 0px; /*对垂直流动条有效*/
            height: 8px; /*对水平流动条有效*/
        }
        .visitlist{
            width: 100%;
            height: 100%;
            overflow: auto;
            box-sizing: border-box;
            padding-right: 10px;
        }
    }

    .detail-body-pop{
        width: 100%;
        padding-top: 20px;
        .title{
            font-size: 14px;
            color: $black2;
            padding-left: 20px;
            margin-bottom: 14px;
        }
        .userinfo{
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            border-bottom: 1px solid #EBEEF5;
            .topname{
                display: flex;
                padding-bottom: 16px;
                border-bottom: 1px solid #DCDFE6;
                .name{
                    font-size: 14px;
                    color: #222;
                    margin-right: 16px;
                }
                .address-info{
                    display: flex;
                    .phone{
                        width: 180px;
                        font-size: 16px;
                        color: $black1;
                        line-height: 24px;
                    }
                    .address{
                        display: flex;
                        color: #222;
                        line-height: 24px;
                        i{
                            font-size: 16px;
                            margin-right: 10px;
                            margin-top: 3px;
                        }
                    }
                }
            }
            .order{
                width: 100%;
                box-sizing: border-box;
                padding: 14px 0px;
                p{
                    display: flex;
                    font-size: 14px;
                    line-height: 22px;
                    .tit{
                        color: $black2;
                        width: 70px;
                    }
                    .desc{
                        color: $black1;
                    }
                }
                .beizhu{
                    margin-bottom: 16px;
                }
            }
        }
        .shoplist{
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px 28px;
            background-color: #fff;
            .title{
                padding-left: 0;
                padding-top: 26px;
                height: 20px;
                line-height: 20px;
                margin-bottom: 8px;
            }
            .title.status{
                padding-top: 18px;
            }
            .visitinfo{
                width: 100%;
                font-size: 12px;
                color: $black;
                .lastname{
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: $myblue1;
                    font-size: 12px;
                    line-height: 24px;
                    text-align: center;
                    display: inline-block;
                    color: #fff;
                    margin-right: 10px;
                }
                .phone{
                    margin-left: 12px;
                }
                .senddetail{
                    width: 415px;
                    line-height: 17px;
                    box-sizing: border-box;
                    padding: 6px;
                    color: $black1;
                    background-color: #F7F9FB;
                    border: 1px solid #E5EEFB;
                    position: relative;
                    margin-top: 9px;
                    z-index: 8;
                    &:after{
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        border-left: 1px solid #E5EEFB;
                        border-top: 1px solid #E5EEFB;
                        transform: rotateZ(45deg);
                        top: -4px;
                        left: 6px;
                        content: "";
                        clear: both;
                        z-index: 10;
                        background-color: #F7F9FB;
                    }
                    span{
                        color: $black;
                    }
                }
            }
            ul{
                width: 100%;
                display: flex;
                li{
                    min-width: 122px;
                    color: $black2;
                    font-size: 12px;
                    .circle{
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: $myblue1;
                        position: relative;
                        margin: 4px 0;
                        &:after{
                            display: inline-block;
                            width: 108px;
                            height: 1px;
                            background-color: $myblue1;
                            content: "";
                            clear: both;
                            position: absolute;
                            left: 13px;
                            top: 6px;
                        }
                    }
                }
                li:last-of-type{
                    color: $black;
                    .circle{
                        &:after{
                            display: none;
                        }
                    }
                }
                .type3-fail{
                    .circle{
                        background-color: #F9496C;
                    }
                    .sta{
                        color: #F9496C;
                    }
                }
            }
        }
    }
</style>
<style>
    .retire-title .el-input__inner{
        border: 0;
    }
    .show-order-detail .el-dialog__header{
        background-color: #F2F6FC;
        padding: 10px 20px 10px;
    }
    .show-order-detail .el-dialog__body{
        padding: 0;
        background-color: #F2F6FC;
    }
</style>



