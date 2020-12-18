<template>
    <div class="per-li">
        <div class="item">
            <div class="li">
                <p class="title big"><span>订单编号</span>{{item.orderCode}}</p>
                <div class="info">
                    <p class="name">{{item.userName}}</p>
                    <p class="card">{{item.userIdcard}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title big"><span>创建时间</span>{{item.createTime}}</p>
                <div class="info two">
                    <p class="name none" v-if="item.orderStatus==='1'">匹配探望人员中...</p>
                    <p class="name" v-else>探望人员 {{item.staffName}}</p>
                    <p class="card" v-if="item.serverTime">探望时间 {{item.serverTime}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title">类型</p>
                <div class="info">
                    <p class="type">{{item.orderType}}</p>
                </div>
            </div>
            <div class="li">
                <p class="title">状态</p>
                <div class="info" v-if="item.orderType=='病人探望'||item.orderType=='爱心服务'">
                    <p class="status type1" v-if="item.orderStatus=='10'">已完成</p>
                    <p class="status type1" v-else-if="item.orderStatus=='4'">已派单</p>
                    <p class="status type1" v-else-if="item.orderStatus=='1'">待派单</p>
                    <p class="status type2" v-else>已探望</p>
                </div>
                <div class="info" v-else>
                    <p class="status" style="color:#1060FF" v-if="item.status == '1'">待领取</p>
                    <p class="status" style="color:#C0C4CC" v-else-if="item.status == '2'">已领取</p>
                </div>
            </div>
            <div class="li">
                <p class="title">备注</p>
                <div class="info detailinfo">
                    <p class="detail">{{item.remark}}</p>
                </div>
            </div>
        </div>
        <el-button @click="orderDetail">详情<i class="el-icon-caret-right"></i></el-button>
    </div>
</template>

<script>
export default {
    props:['item'],
    methods:{
        orderDetail(){
            if(this.item.orderType=='病人探望'||this.item.orderType=='爱心服务'){
                this.$emit('childChange',{popType:2,id:this.item.id});
            }else{
                this.$emit('childChange',{popType:3});
            }
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
        button{
            width: 115px;
            height: 36px;
            color: $myblue;
            border-color: $myblue;
            padding:0;
            margin-left: 30px;
            i{
                margin-left: 20px;
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
                        font-size: 18px;
                        line-height: 25px;
                        color: $black;
                    }
                    .none{
                        color: #1060ff;
                    }
                    .card,.time{
                        font-size: 14px;
                        line-height: 20px;
                        color: #C0C4CC;
                        span{
                            margin-right: 16px;
                        }
                    }
                    .seename,.type,.status{
                        font-size: 14px;
                        color: $black;
                        line-height: 25px;
                        span{
                            margin-right: 16px;
                        }
                    }
                    .detail{
                        line-height: 25px;
                        font-size: 12px;
                        color: $black;
                    }
                    .status.type1{
                        color: #FDA931;
                    }
                    .status.type2{
                        color: #C0C4CC;
                    }
                    .status.type3{
                        color: #F9496C;
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

