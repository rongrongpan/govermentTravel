<template>
    <el-dialog title="" :visible.sync="openTravel" class="travelPop" width="646px" :before-close="handleClose">
        <p class="title">{{travelXq.title}}
            <span v-if="travelXq.activityStatus==='1'">暂未开始</span>
            <span class="red" v-else-if="travelXq.activityStatus==='5'">报名开始</span>
            <span class="gray" v-else>报名结束</span>
        </p>
        <div class="desc" v-if="travelXq.introduction">
            <p class="short overhid2">{{travelXq.introduction}} <span v-if="showMore" @click="openText">[展开]</span></p>
            <div class="descpop" v-show="open">
                {{travelXq.introduction}}
                <span @click="openText">收起</span>
            </div>
        </div>
        
        <div class="info">
            <div class="li">
                <p class="tit">报名时间</p>
                <div class="content">
                   <p class="yellow">{{travelXq.startTime}}-{{travelXq.endTime}}</p> 
                   <p :class="[lastTime<7?'red':'last']" v-if="travelXq.activityStatus==='5'">剩余<span> {{lastTime}} </span>天</p>
                </div>
            </div>
            <div class="li height">
                <p class="tit">报名人数</p>
                <div class="content">{{travelXq.registerNum}}</div>
            </div>
        </div>
        <div class="moreinfo">
            <p class="tit">产品属性</p>
            <div class="listwra">
                <div class="list">
                    <p class="tit">目的地</p>
                    <p class="content">{{travelXq.place}}</p>
                </div>
                <div class="list">
                    <p class="tit">出行日期</p>
                    <p class="content">{{travelXq.activityTime}}</p>
                </div>
                <div class="list" v-if="travelXq.giftList&&travelXq.giftList.length">
                    <p class="tit">礼品详情</p>
                    <p class="content">
                        <span v-for="item in travelXq.giftList" :key="item.specificationName">{{item.specificationName}} &nbsp;&nbsp;&nbsp;</span>
                    </p>
                </div>
                <div class="list">
                    <p class="tit">产品须知</p>
                    <p class="content">{{travelXq.activityNotice}}</p>
                </div>
            </div>
        </div>
        <div class="create" v-if="$store.state.userInfo.housingEstate && travelXq.activityStatus!=='1'">
            <template v-if="travelXq.activityStatus==='5'">
                <el-button size="small" v-if="travelXq.registerNum" class="short" type="primary" plain @click="outList">导出报名统计</el-button>
                <el-button size="small" v-else type="info" class="short" @click="outList">导出报名统计</el-button>
                <el-button size="small" style="margin-left:20px;" type="primary" @click="openTest">报名</el-button>
                <el-button size="small" style="margin-left:20px;" @click="openFile"  type="primary">批量报名</el-button>
            </template>
            <template v-else-if="travelXq.activityStatus==='10'">
                <el-button size="small" type="primary" class="short" @click="navToXq">查看报名</el-button>
                <el-button size="small" class="short" style="margin-left:20px;" type="primary" plain @click="outList">导出报名统计</el-button>
            </template>
            <p v-if="travelXq.activityStatus==='5'">仅支持exl表格，一次最多报50名</p>
        </div>
    </el-dialog>
</template>

<script>
    import $ from 'jquery';
    export default {
        props:['openTravel','travelXq'],
        data(){
            return{
                showMore:false,
                open:false,
                lastTime:false
            }
        },
        watch:{
            travelXq(){
                this.$nextTick(function(){
                    if(this.travelXq.activityStatus==='5'){
                        let day = parseInt((new Date(this.travelXq.endTimeLong)-new Date()) / 1000);
                        this.lastTime = Math.floor( day/ (60 * 60 * 24));
                    }
                    if($('.descpop').height()>36){
                        this.showMore = true;
                    }else{
                        this.showMore = false;
                    }
                })
            }
        },
        methods:{
            navToXq(){
                this.$emit('navToXq', this.travelXq.id)
            },
            handleClose(){
                this.$emit('closeDetailPop');
            },
            openTest(){
                this.$emit('openTest',{id:1})
            },
            openText(){
                this.open = !this.open
            },
            //批量报名
            openFile(){
                this.$emit('openFile');
            },
            //导出列表
            outList(){
                this.$emit('outListXq',{id:this.travelXq.id})
            }
        }
    }
</script>
<style lang="scss" scoped>
    .travelPop{
        width: 100%;
        .title{
            font-size: 24px;
            line-height: 34px;
            height: 24px;
            color: #333;
            display: flex;
            align-items: center;
            height: 34px;
            margin-bottom: 7px;
            span{
                font-size: 12px;
                color: #4080FF;
                margin-left: 5px;
                border: 1px solid #4080FF;
                border-radius: 4px;
                padding: 2px 4px;
                height: 12px;
                line-height: 12px;
            }
            span.red{
                color: #F9496C;
                border-color: #F9496C;
            }
            span.gray{
                color: #909399;
                border-color: #909399;
            }
        }
        .desc{
            font-size: 12px;
            color: #909399;
            line-height: 18px;
            margin-bottom: 28px;
            position: relative;
            .short{
                position: relative;
                span{
                    cursor: pointer;
                    position: absolute;
                    color: 303133;
                    background-color: #fff;
                    right: 0;
                    bottom: 0;
                    color: #303133;
                    padding-left: 4px;
                }
            }
            .descpop{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.16);
                border-radius: 4px;
                background-color: #fff;
                box-sizing: border-box;
                padding: 12px;
                padding-bottom: 30px;
                max-height: 135px;
                overflow: auto;
                span{
                    color: #303133;
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    cursor: pointer;
                }
            }
        }
        .info{
            .li{
                width: 100%;
                font-size: 12px;
                line-height: 22px;
                display: flex;
                margin-bottom: 6px;
                .tit{
                    width: 80px;
                    flex-shrink: 0;
                }
                .content{
                    width: 20px;
                    flex-grow: 1;
                }
                .yellow{
                    color: #FF8645;
                }
                .last{
                    color: #606266;
                    span{
                        color: #FF8645;
                        font-size: 16px;
                    }
                }
                .red{
                    color: #FA4F71;
                    span{
                        font-size: 16px;
                    }
                }
            }
        }
        .moreinfo{
            background-color: #F6F9FF;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            .tit{
                font-size: 12px;
                color: #4080FF;
                height: 22px;
                line-height: 22px;
                margin-bottom: 8px;
            }
            .listwra{
                width: 100%;
                max-height: 190px;
                overflow: auto;
            }
            .list{
                width: 100%;
                font-size: 12px;
                line-height: 22px;
                display: flex;
                margin-bottom: 6px;
                border-bottom: 1px dotted #DCDFE6;
                .tit{
                    width: 80px;
                    flex-shrink: 0;
                    color: #909399;
                }
                .content{
                    width: 20px;
                    flex-grow: 1;
                    color: #606266;
                }
            }
        }
        .create{
            display: flex;
            align-items: center;
            margin-top: 38px;
            p{
                color: #909399;
                margin-left: 10px;
                font-size: 12px;
            }
        }
    }
</style>
<style>
    .travelPop .el-dialog__body{
        padding: 0px 66px 30px;
    }
    .create .el-button--small{
        padding: 9px 38px;
    }
    .el-button--small.short{
        padding: 9px 22px !important;
    }
</style>