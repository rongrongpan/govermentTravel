<template>
    <div class="receivelist">
        <div class="retire-title"><img src="@/assets/tabbar3.png" alt="">上门慰问</div>
        <div class="search">
            <div class="retiretitle-left">
                <router-link :to="{name:'receiveHistory'}" style="margin-right:10px;">
                    <el-button size="small" type="primary" style="width:120px;">慰问记录</el-button>
                </router-link>
                <el-button type="primary" size="small" plain style="width:120px;" @click="centerDialogVisible=true">批量创建</el-button>
                <a v-if="$store.state.userInfo.housingEstate" class="moban" href="http://www.yueyilan.com/img-yueyilan/download/%E8%80%81%E4%BA%BA%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls">批量上传模板下载</a>
            </div>
            <el-select style="width:120px;" size="small" v-if="!$store.state.userInfo.street" v-model="streetValue" placeholder="选择街道" @change="getGrouplist()">
                <el-option 
                v-for="item in streetList"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <!-- 列表 -->
        <div class="shoplist">
            <ul class="list">
                <li v-for="(item,index) in pagelistinfo" :key="item+index" @click="showDetail(index)">
                    <div class="img">
                        <img :src="item.mainPicture" alt="商品图片">
                    </div>
                    <div class="shop-title">
                        <p class="font overhid2">{{item.packageName}}</p>
                    </div>
                    <p class="shop-desc">{{item.recommend}}</p>
                </li>
            </ul>
            <HasNone v-if="pagelistinfo.length===0" />
        </div>
       <Testpop testType='2' :id="testPopId" :centerDialogVisible="centerDialog" v-on:changeCom="changeParent"/>

        <!-- 兑换弹窗 -->
        <el-dialog title="" :visible.sync="innerVisible" class="show-order-detail receive" width="646px">
            <div class="receive-pop-showdow" v-if="detailInfo.length">
                <p class="title-pop">{{detailInfo[0].packageName}}</p>
                <ul class="product-list">
                    <li v-for="(item) in detailInfo" :key="item.id">
                        <div class="img">
                            <img :src="item.picture" alt="商品图片">
                        </div>
                        <div class="right">
                            <p class="title">{{item.subTitle}}</p>
                            <p class="desc overhid2">{{item.description}}</p>
                        </div>
                    </li>
                </ul>
                <p class="button" @click="centerDialog=true">立即兑换</p>
            </div>
            <div class="loading-pageicon" v-else><i class="el-icon-loading"></i></div>
        </el-dialog>

        <UpFile :centerDialogVisible="centerDialogVisible" @changeFile="changeFile" :type="2" :activeId="pagelistinfo"/>
    </div>
</template>
<script>
import $ from 'jquery';
import Testpop from '@/components/public/TestPop';
import api from "@/api/index.js";
import HasNone from '@/components/public/HasNone';
import { Loading } from 'element-ui';
import UpFile from '@/components/public/UpFile';
import address from '@/components/public/address.js'

export default {
    components:{
        Testpop,
        HasNone,
        UpFile
    },
    data(){
        return{
            centerDialog:false,
            innerVisible:false,
            centerDialogVisible:false,
            detailInfo:[],
            testPopId:0,
            pagelistinfo:[],
            streetList:address.street[this.$store.state.userInfo.area],
            streetValue:this.$store.state.userInfo.street||address.street[this.$store.state.userInfo.area][0]
        }
    },
    methods:{
        changeParent(val){
            this.centerDialog=false;
        },
        showDetail(index){
            this.testPopId = this.pagelistinfo[index].id;
            this.detailInfo = [];
            api.getPackageXq({id:this.pagelistinfo[index].id}).then(res=>{
                this.detailInfo = res.data.data.packageDTO.productList;
            })
            this.innerVisible=true;
        },
        getGrouplist(){
            let loadingInstance = Loading.service();
            api.getPackage({street:this.streetValue}).then(res=>{
                loadingInstance.close();
                this.pagelistinfo = res.data.data.packageList;
            })
        },
        changeFile(){
            this.centerDialogVisible = false;
        }
    },
    created(){
        this.getGrouplist();
    }
}
</script>

<style lang="scss" scoped>
    .receivelist{
        width: 100%;
        height: 100%;
        .search{
            .createVisit{
                padding: 0;
                line-height: 36px;
                a{
                    color: #fff;
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
            }
            a{
                color: $myblue1;
            }
        }
        .shoplist{
            margin-top: 20px;
            overflow: auto;
            height: calc(100% - 120px);
            padding-right: 10px;
            .list{
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                li{
                    width: 21.2%;
                    list-style-type: none;
                    margin-bottom: 45px;
                    margin-right: 5%;
                    cursor: pointer;
                    .img{
                        width: 100%;
                        border: 1px solid #F5F7FA;
                        img{
                            width: 100%;
                        }
                    }
                    .shop-title{
                        font-size: 18px;
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        color: $black;
                        line-height: 24px;
                        margin-top: 15px;
                        i{
                            margin-left: 10px;
                            cursor: pointer;
                        }
                        i:hover{
                            color: #FDA931;
                        }
                    }
                    .shop-desc{
                        font-size: 14px;
                        color: $black2;
                        line-height: 20px;
                        margin-top: 2px;
                    }
                    .price-wra{
                        display: flex;
                        justify-content: space-between;
                        line-height: 30px;
                        margin-top: 4px;
                        .price{
                            font-size: 17px;
                            color: #FF8645;
                            span{
                                font-size: 22px;
                            }
                        }
                        .num{
                            font-size: 14px;
                            color: $black1;
                        }
                    }
                }
                li:nth-of-type(4n){
                    margin-right: 0;
                }
            }
        }
    }
    .search{
        .retiretitle-left{
            display: flex;
            align-items: center;
        }
    }
</style>

<style lang="scss">
    
    .show-order-detail .el-dialog__headerbtn{
        top: 12px;
    }
    .show-order-detail.receive .el-dialog__header{
        background-color: #fff;
    }
    .show-order-detail.receive .el-dialog__body{
        padding: 0;
        padding-bottom: 35px;
        padding-top: 20px;
        background-color: #fff;
    }
    .receive-pop-showdow{
        box-sizing: border-box;
        width: 100%;
        padding: 0 66px;
        .title-pop{
            font-size: 24px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            color: #333;
        }
        .product-list{
            width: 100%;
            margin-top: 32px;
            max-height:314px;
            overflow: auto;
            padding-right: 10px;
            li{
                display: flex;
                width: 100%;
                margin-bottom: 35px;
                .img{
                    width: 120px;
                    height: 120px;
                    border: 1px solid #F5F7FA;
                    flex-shrink: 0;
                    margin-right: 10px;
                    img{
                        width: 100%;
                    }
                }
                .right{
                    .title{
                        font-size: 16px;
                        color: #333;
                        line-height: 22px;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .desc{
                        font-size: 14px;
                        line-height: 20px;
                        color: #909399;
                        margin-top: 4px;
                    }
                    .price{
                        font-size: 16px;
                        color: #FDA931;
                        font-weight: bold;
                        margin-top: 10px;
                    }
                }
            }
            li:last-of-type{
                margin-bottom: 0;
            }
        }
        .button{
            width: 144px;
            height: 28px;
            background-color: #1989FA;
            border-radius: 14px;
            text-align: center;
            line-height: 28px;
            color: #fff;
            font-size: 14px;
            margin: 0 auto;
            cursor: pointer;
            margin-top: 35px;
        }
    }
</style>





