<template>
    <div class="per-li" v-if="item">
        <div class="item">
            <div class="li">
                <p class="title big"><span>订单编号</span>{{item.orderCode}}</p>
                <div class="info" style="font-size:12px">
                    <p class="name">{{item.userName}}</p>
                    <p class="card">{{item.userIdcard}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title big"><span>创建时间</span>{{item.createTime}}</p>
                <div class="info two">
                    <p class="name"><span>{{item.street}}</span> {{item.housingEstate}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title">联系人</p>
                <div class="info">
                    <p class="name">{{item.relative}}</p>
                    <p class="card">{{item.relativePhone}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title">状态</p>
                <div class="info">
                    <p class="status">{{item.orderStatus==='-1'?'已取消':item.orderStatus==='4'?'已报名':'已完成'}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title">备注</p>
                <div class="info detailinfo">
                    <p class="detail">{{item.remark?item.remark:'无'}}</p>
                </div>
            </div>
        </div>
        <div class="button-wrapper">
            <el-button class="detail" @click="orderDetail">详情<i class="el-icon-caret-right"></i></el-button>
        </div>
    </div>
</template>

<script>
export default {
    props:['item','index'],
    methods:{
        orderDetail(){
            this.$emit('childChange',{popType:4});
        }
    }
}
</script>
<style lang="scss" scoped>
    .per-li{
        width: 100%;
        border: 1px solid #DCDFE6;
        margin-bottom: 20px;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 26px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
                i{
                    margin-left: 20px;
                }
            }
            .el-button+.el-button{
                margin-left: 0;
                margin-top: 10px;
            }
        }
        .item{
            display: flex;
            flex-grow: 1;
            .li:nth-of-type(1),.li:nth-of-type(2){
                width: 26%;
            }
            .li:nth-of-type(3),.li:nth-of-type(4){
                width: 14%;
            }
            .li:nth-of-type(5){
                width: 20%;
            }
            .li{
                flex-grow: 1;
                .title{
                    font-size: 12px;
                    color: $black2;
                    padding-bottom: 22px;
                    span{
                        margin-right: 16px;
                    }
                }
                .title.big{
                    font-size: 14px;
                    color: $black1;
                }
                .info.two{
                    .name{
                        font-size: 14px;
                    }
                }
                .info{
                    .name{
                        font-size: 14px;
                        line-height: 25px;
                        color: $black;
                    }
                    .none{
                        color: #1060ff;
                    }
                    .card,.time{
                        font-size: 12px;
                        line-height: 20px;
                        color: #C0C4CC;
                        span{
                            margin-right: 16px;
                        }
                    }
                    .seename,.type,.status{
                        font-size: 12px;
                        color: $black;
                        line-height: 25px;
                        span{
                            margin-right: 16px;
                        }
                    }
                    .status{
                        color: #C0C4CC;
                    }
                    .detail{
                        line-height: 25px;
                        font-size: 12px;
                        color: $black;
                    }
                }
                .detailinfo{
                    i{
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

