<template>
    <div class="orderlist">
        <div class="item">
            <div class="left-info">
                <p class="title">订单编号 <span>{{item.orderCode}}</span></p>
                <div class="bottom">
                    <div class="bottom-list" v-if="item.productList">
                        <div class="wra" v-if="seeTwo.length">
                            <div class="bottom-list" v-for="el in seeTwo" :key="el.id">
                                <div class="image"><img :src="el.picture" alt="商品图片"></div>
                                <div class="list-info">
                                    <p class="sub-title overhid1">{{el.item}}</p>
                                    <p class="price">¥ {{el.yuan}}<span class="small">{{el.fen}}</span> <span class="num">x {{el.quantity}}</span></p>
                                </div>
                            </div>
                            <p class="seemore" @click="seeMore">{{seeTwo.length==2?'查看更多':'收起'}} >></p>
                        </div>
                        <div class="wra" v-else>
                            <div class="bottom-list" v-for="el in item.productList" :key="el.id">
                                <div class="image"><img :src="el.picture" alt="商品图片"></div>
                                <div class="list-info">
                                    <p class="sub-title overhid1">{{el.item}}</p>
                                    <p class="price">¥ {{el.yuan}}<span class="small">{{el.fen}}</span> <span class="num">x {{el.quantity}}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bottom-list" v-else-if="item.orderTravelDTO">
                        <div class="image"><img :src="item.orderTravelDTO.picture" alt="商品图片"></div>
                        <div class="list-info">
                            <p class="sub-title overhid1">{{item.orderTravelDTO.item}}</p>
                            <p class="price">¥ {{item.orderTravelDTO.yuan}}<span class="small">{{item.orderTravelDTO.fen}}</span> <span class="num">x {{item.orderTravelDTO.num}}</span></p>
                        </div>
                    </div>
                    <div class="bottom-list" v-else-if="item.infoPackageDTO">
                        <div class="image"><img :src="item.infoPackageDTO.picture" alt="商品图片"></div>
                        <div class="list-info">
                            <p class="sub-title overhid1">{{item.infoPackageDTO.travelTitle}}</p>
                            <p class="price">¥ {{item.infoPackageDTO.yuan}}<span class="small">{{item.infoPackageDTO.fen}}</span> <span class="num">x {{item.infoPackageDTO.quantity}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="left-info">
                <p class="title">创建时间 <span>{{item.createTime}}</span></p>
            </div>
            <div class="li">
                <p class="title">付款信息</p>
                <p class="bottom price">¥ {{item.yuan}}<span class="small">{{item.fen}}</span></p>
            </div>
            <div class="li">
                <p class="title">状态</p>
                <p class="bottom status">
                     <span v-if="item.status=='10'" style="color:rgb(192, 196, 204)">已完成</span>
                     <span v-else-if="item.status=='0'" style="color:#1060FF">待支付</span>
                     <span v-else-if="item.status=='1'" style="color:#1060FF">待发货</span>
                     <span v-else-if="item.status=='2'" style="color:#1060FF">待收货</span>
                     <span v-else-if="item.status=='-1'" style="color:#F9496C">支付失败</span>
                     <span v-else-if="item.status=='-2'" style="color:#F9496C">订单失败</span>
                     <span v-else-if="item.status=='-3'" style="color:#F9496C">订单失效</span>
                </p>
            </div>
            <div class="li">
                <p class="title">备注</p>
                <p class="bottom detail">{{item.remark}}</p>
            </div>
        </div>
        <el-button @click="seeDetail(item.id)">详情<i class="el-icon-caret-right"></i></el-button>
    </div>
</template>
<script>
export default {
    props:['item'],
    data(){
        return{
            seeTwo:[]
        }
    },
    methods:{
        seeDetail(id){
            this.$emit('childChange',{id:id}); 
        },
        seeMore(){
            if(this.seeTwo.length==2){
                this.seeTwo = this.item.productList;
            }else{
                this.seeTwo = this.item.productList.slice(0,2);
            }
        }
    },
    created(){
        if(this.item.productList.length>2){
            this.seeTwo = this.item.productList.slice(0,2);
        }
    }
}
</script>
<style lang="scss" scoped>
    .orderlist{
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 30px 20px;
        margin-bottom: 18px;
        display: flex;
        justify-content: space-between;
        .item{
            flex-grow: 1;
            display: flex;
            .left-info{
                width: 26%;
                .title{
                    font-size: 14px;
                    line-height: 20px;
                    color: $black1;
                    padding-bottom: 22px;
                        span{
                            margin-left: 16px;
                        }
                }
                .bottom{
                    width: 100%;
                    .image{
                        width: 84px;
                        height: 84px;
                        border-radius: 8px;
                        background-color: #F2F6FC;
                        overflow: hidden;
                        display: inline-block;
                        vertical-align: top;
                        margin-right: 18px;
                        flex-shrink: 0;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .bottom-list{
                        margin-bottom: 10px;
                        width: 100%;
                    }
                    .seemore{
                        font-size: 14px;
                        color: #999;
                        cursor: pointer;
                    }
                    .list-info{
                        display: inline-block;
                        vertical-align: top;
                        flex-shrink: 1;
                        width: 50%;
                        .sub-title{
                            font-size: 14px;
                            color: $black;
                            line-height: 20px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .price{
                            font-size: 14px;
                            color: #FDA931;
                            line-height: 20px;
                            margin-top: 4px;
                            .small{
                                font-size: 12px;
                            }
                            .num{
                                color: $black1;
                            }
                        }
                    }
                    .code-info{
                        display: inline-block;
                        font-size: 14px;
                        color: $black;
                        line-height: 20px;
                        margin-left: 76px;
                        .code-number{
                            color: #c0c4cc;
                            margin-top: 4px;
                        }
                    }
                }
            }
            .li{
                width: 100px;
                line-height: 20px;
                width: 14%;
                .title{
                    font-size: 12px;
                    color: $black2;
                    line-height: 20px;
                    padding-bottom: 22px;
                }
                .bottom{
                    font-size: 14px;
                    color: $black;
                    
                }
                .price{
                    font-size: 18px;
                    color: #FDA931;
                    line-height: 20px;
                    margin-top: 4px;
                    .small{
                        font-size: 16px;
                    }
                }
                .detail{
                    margin-bottom: 14px;
                }
                i{
                    cursor: pointer;
                }
            }

        }
        button{
            width: 115px;
            height: 36px;
            color: #1060ff;
            border-color: #1060ff;
            padding: 0;
            margin-left: 30px;
            flex-shrink: 0;
            margin-top: 60px;
            i{
                margin-left: 20px;
            }
        }
    }
</style>


