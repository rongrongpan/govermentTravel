<template>
    <el-dialog title="" :visible.sync="openTravel" class="travelPop" width="646px" :before-close="handleClose">
        <p class="title">{{travelXq.title}}</p>
        <div class="desc">
            <p class="short overhid2">{{travelXq.subTitle}} <span v-if="showMore" @click="openText">[展开]</span></p>
            <div class="descpop" v-show="open">
                {{travelXq.subTitle}}
                <span @click="openText">收起</span>
            </div>
        </div>
        
        <div class="info">
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
                    <p class="content">{{travelXq.destination}}</p>
                </div>
                <div class="list">
                    <p class="tit">集合地点</p>
                    <p class="content">{{travelXq.meetingPlace}}</p>
                </div>
                <div class="list">
                    <p class="tit">出行日期</p>
                    <p class="content">{{travelXq.travelTime}}</p>
                </div>
                <div class="list">
                    <p class="tit">发车时间</p>
                    <p class="content">{{travelXq.travelTime}}</p>
                </div>
                <div class="list">
                    <p class="tit">产品须知</p>
                    <p class="content">{{travelXq.product_notice?travelXq.product_notice:'无'}}</p>
                </div>
            </div> 
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
                this.$emit('navToXq', this.travelXq.travelOpenId)
            },
            handleClose(){
                this.$emit('closeDetailPop');
            },
            openText(){
                this.open = !this.open
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
                    width:80px;
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
    }
</style>
<style>
    .travelPop .el-dialog__body{
        padding: 0px 66px 30px;
    }
    .create .el-button--small{
        padding: 9px 38px;
    }
</style>