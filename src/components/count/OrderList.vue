<template>
    <div class="orderlist">
        <div class="item">
            <div class="left-info">
                <p class="title">订单编号 <span>{{item.orderCode}}</span></p>
                <div class="bottom">
                    <div class="image"><img :src="item.packageItemDTO.mainPicture" alt="商品图片"></div>
                    <div class="list-info">
                        <p class="sub-title overhid1">{{item.packageItemDTO.packageName}}</p>
                        <p class="price">¥ {{item.packageItemDTO.yuan}}<span class="small">{{item.packageItemDTO.fen}}</span> <span class="num">x 1</span></p>
                    </div>
                </div>
            </div>
            <div class="left-info" style="width:32%;">
                <p class="title">创建时间 <span>{{item.createTime}}</span></p>
                <div class="bottom">
                    <div class="code-info">
                        <p class="name">{{item.userName}}</p>
                        <p class="code-number">{{item.userIdcard}}</p>
                    </div>
                </div>
            </div>
            <div class="li">
                <p class="title">状态</p>
                <p class="bottom status">
                     <span v-if="item.orderStatus=='10'" style="color:rgb(192, 196, 204)">已完成</span>
                     <span v-else-if="item.orderStatus=='1'" style="color:#1060FF">待派单</span>
                     <span v-else-if="item.orderStatus=='4'" style="color:#1060FF">已派单</span>
                     <span v-else style="color:#1060FF">已配送</span>
                </p>
            </div>
            <div class="li">
                <p class="title">备注</p>
                <p class="bottom detail">{{item.remark}}</p>
            </div>
        </div>
        <div class="button-wrapper">
            <el-button type="warning" plain icon="el-icon-printer" @click="printPop">回执单</el-button>
            <el-button class="detail" @click="orderDetail">详情<i class="el-icon-caret-right"></i></el-button>
        </div>
    </div>
</template>
<script>
export default {
    props:['item','index'],
    methods:{
        orderDetail(){
            if(this.index==null){
                this.$emit('childChange',{popType:2});
            }else{
                this.$emit('childChange',{index:this.index});
            }
        },
        printPop(){
            if(this.index==null){
                this.$emit('toPrint',{popType:2});
            }else{
                this.$emit('toPrint',{index:this.index});
            }
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
        align-items: center;
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
                width: 18%;
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
        .button-wrapper{
            width: 115px;
            button{
                width: 115px;
                height: 36px;
                flex-shrink: 0;
                padding: 0;
            }
            .detail{
                color: #1060ff;
                border-color: #1060ff;
                margin-left: 30px;
                i{
                    margin-left: 20px;
                }
            }
            .el-button+.el-button{
                margin-left: 0;
                margin-top: 10px;
            }
        }
        
    }
</style>


