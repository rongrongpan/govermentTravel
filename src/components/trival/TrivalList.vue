<template>
    <div class="retirement">
        <div class="retire-title"><img src="@/assets/tabbar2.png" alt="">旅游报名</div>
        <div class="search">
            <el-button size="small" @click="getList(true)"><i style="margin-right:6px;" class="el-icon-refresh-right"></i>刷新列表</el-button>
            <!-- 区级别 -->
            <div>
                <el-select style="width:120px;" size="small" v-if="!$store.state.userInfo.street" v-model="streetValue" placeholder="选择街道" @change="getList()">
                    <el-option 
                    v-for="item in streetList"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                <el-select style="width:120px;margin-left:10px;" size="small" v-model="yearType" @change="getList" placeholder="请选择">
                    <el-option
                    v-for="item in yearTypeZ"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="personlist-wrapper">
            <ul class="travel-list" v-if="trivalList.length">
                <li v-for="(item) in trivalList" :key="item.travelId" @click="openDetail(item.travelId)">
                    <div class="img imghover">
                        <img :src="item.mainImage" alt="旅游图片">
                    </div>
                    <div class="topline">
                        <p class="title">
                            <span class="name">{{item.title}}</span>
                        </p>
                        <el-button size="small" type="primary" @click.stop="navToXq(item.travelOpenId)">查看报名</el-button>
                    </div>
                    <div class="theTime" @click.stop="navToXq(item.travelOpenId)">报名总人数 : {{item.registerNum}} 人</div>
                </li>
            </ul>
            <HasNone v-if="trivalList.length === 0" />
        </div>
        <TravelPop :openTravel="openTravel" :travelXq="travelXq" @closeDetailPop="closeDetailPop" @navToXq="navToXq"/>
    </div>
</template>
<script>
import api from '@/api/index.js';
import TravelPop from './TravelPop';
import HasNone from '@/components/public/HasNone';
import address from '@/components/public/address.js'
export default {
    components:{
        HasNone,
        TravelPop
    },
    data(){
        return{
            trivalList:[],
            yearType:this.$store.state.userInfo.years,
            yearTypeZ:[],
            openTravel:false,
            travelXq:0,
            streetList:address.street[this.$store.state.userInfo.area],
            streetValue:this.$store.state.userInfo.street||address.street[this.$store.state.userInfo.area][0]
        }
    },
    methods:{
        dealYear(){
            let year = this.$store.state.userInfo.years;
            for(let i=2020;i<=year;i++){
                this.yearTypeZ.push(i);
            }
        },
        openDetail(id){
            api.getTravelXq({id}).then(res=>{
                this.travelXq = res.data.data.travelOpenDetailDTO;
                this.openTravel = true;
            })
        },
        closeDetailPop(e){
            this.openTravel = false;
        },
        getList(load){
            let street = this.streetValue;
            api.getTravelList({year:String(this.yearType),street}).then(res=>{
                this.trivalList = res.data.data.list;
                this.$nextTick(function(){
                    if(load){
                        this.$reMessage('刷新成功！','success');
                    }
                })
            })
        },
        navToXq(id){
            this.$router.push({ name: 'trivalxq', query: { travelOpenId: id,street:this.streetValue}})
        }
    },
    created(){
        this.dealYear();
        this.getList(); 
    },
    beforeRouteLeave(to,from,next){
        this.$store.commit('setActive',this.yearType);
        next();
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
            display: flex;
            justify-content: space-between;
        }
        .travel-title{
            font-size: 18px;
            color: #333;
            height: 25px;
            line-height: 25px;
            font-weight: bold;
            margin-top: 15px;
        }
        .personlist-wrapper{
            overflow: hidden;
            width: 100%;
            position: relative;
            margin-top: 14px;
            box-sizing: border-box;
            height: calc(100% - 104px);
            overflow: auto;
            .travel-list{
                width: 100%;
                font-size: 0;
                li{
                    width: 31%;
                    display: inline-block;
                    margin-right: 3.5%;
                    margin-bottom: 34px;
                    vertical-align: top;
                    .img{
                        width: 100%;
                        overflow: hidden;
                        border-radius: 4px;
                        img{
                            width: 100%;
                            height: 100%;
                            transition: transform .3s ease-out,opacity .3s ease-out;
                        }
                    }
                    .img:hover{
                        img{
                            transform: scale(1.1);
                        }
                    }
                    .img.active{
                        img{
                            opacity: .6;
                        }
                    }
                    .topline{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        height: 20px;
                        padding-top: 18px;
                        padding-bottom: 14px;
                        .title{
                            display: flex;
                            align-items: center;
                            height: 20px;
                            .name{
                                font-size: 20px;
                                max-width: 200px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                line-height: 20px;
                                cursor: pointer;
                            }
                            .name:hover{
                                color: #4080FF;
                            }
                            .name:active{
                                color: #1060FF;
                            }
                            .status{
                                font-size: 12px;
                                line-height: 12px;
                                color: #4080FF;
                                padding: 2px 4px;
                                border: 1px solid #4080FF;
                                border-radius: 4px;
                                margin-left: 4px;
                            }
                            .status.red{
                                color: #F9496C;
                                border-color: #F9496C;
                            }
                            .status.gray{
                                color: #909399;
                                border-color: #909399;
                            }
                        }
                        .el-button--small{
                            flex-shrink: 0;
                            padding: 9px 0px;
                            width: 94px;
                        }
                    }
                    .theTime{
                        height: 16px;
                        line-height: 16px;
                        font-size: 14px;
                        color: #909399;
                        cursor: pointer;
                        &:hover{
                            color: #1060FF;
                        }
                    }
                }
                li:nth-of-type(3n){
                    margin-right: 0;
                }
            }
        }
        .personlist::-webkit-scrollbar {
            width: 0px; /*对垂直流动条有效*/
            height: 8px; /*对水平流动条有效*/
        }
        .sendinput{
            width: 300px;
            margin: 0 auto;
            height: 40px;
            display: block;
        }
    }
</style>



