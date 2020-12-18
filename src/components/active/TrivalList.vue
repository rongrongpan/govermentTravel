<template>
    <div class="retirement">
        <div class="retire-title"><img src="@/assets/tabbar2.png" alt="">活动报名</div>
        <div class="search">
            <el-button size="small" @click="getList(true)"><i style="margin-right:6px;" class="el-icon-refresh-right"></i>刷新列表</el-button>
            <!-- 区级别 -->
            <el-select style="width:120px;margin-left:10px;" size="small" v-model="yearType" @change="getList(true)" placeholder="请选择">
                <el-option
                v-for="item in yearTypeZ"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <div class="personlist-wrapper">
            <ul class="travel-list" v-if="trivalList.length">
                <li v-for="item in trivalList" :key="item.travelId" @click="openDetail(item.id)">
                    <div class="img imghover">
                        <img :src="item.frontCover" alt="旅游图片">
                    </div>
                    <div class="topline">
                        <p class="title">
                            <span class="name">{{item.title}}</span>
                            <span class="status" v-if="item.activityStatus==='1'">暂未开始</span>
                            <span class="status red" v-else-if="item.activityStatus==='5'">报名开始</span>
                            <span class="status gray" v-else>报名结束</span>
                        </p>
                        <!-- 社区 -->
                        <template v-if="$store.state.userInfo.housingEstate">
                            <el-button v-if="item.activityStatus==='5'" size="small" type="primary" @click.stop="openTest(item.id)">报名</el-button>
                            <el-button v-if="item.activityStatus==='10'" size="small" type="primary" @click.stop="outList(item.id)">导出名单</el-button>
                        </template>
                        <!-- 街道/区 -->
                        <template v-else>
                            <el-button v-if="item.activityStatus==='5'||item.activityStatus==='10'" size="small" type="primary" @click.stop="navToXq(item.id)">查看报名</el-button>
                        </template>
                    </div>
                    <div class="theTime">
                        <p class="lastTime">
                            <template v-if="item.activityStatus==='5'">
                                <span :class="[item.endDay<7?'red':'']">剩余 {{item.endDay}} 天</span>
                            </template>
                            <span v-else class="date">{{item.startTime}}-{{item.endTime}}</span>
                            <span class="num" @click.stop="navToXq(item.id)">报名总人数 ：{{item.registerNum}} 人</span>
                        </p>
                    </div>
                </li>
            </ul>
            <HasNone v-if="trivalList.length === 0" />
        </div>
        <a style="display:none;" target="_blank" id="down" :href="downLink" download="报名名单.pdf">报名名单</a>
        <TravelPop :openTravel="openTravel" :travelXq="travelXq" @closeDetailPop="closeDetailPop" @openTest="openTest" @openFile="openFile" @outListXq="outListXq" @navToXq="navToXq"/>
        <Testpop testType='4' :id="testPopId" :centerDialogVisible="centerDialog" @changeCom="changeParent"/>
        <UpFile :centerDialogVisible="centerDialogVisible" @changeFile="changeFile" :type="4" :activeId="travelXq.id"/>
    </div>
</template>
<script>
import api from '@/api/index.js';
import TravelPop from './TravelPop';
import HasNone from '@/components/public/HasNone';
import Testpop from '@/components/public/TestPop';
import UpFile from '@/components/public/UpFile';
export default {
    components:{
        HasNone,
        TravelPop,
        Testpop,
        UpFile
    },
    data(){
        return{
            trivalList:[],
            yearType:this.$store.state.userInfo.years,
            yearTypeZ:[],
            openTravel:false,
            centerDialog:false,
            testPopId:0,
            travelXq:0,
            downLink:"",
            centerDialogVisible:false
        }
    },
    methods:{
        //验证资质
        openTest(id){
            this.testPopId = id.id||id;
            this.centerDialog = true;
        },
        changeParent(val){
            this.centerDialog=false;
        },
        dealYear(){
            let year = this.$store.state.userInfo.years;
            for(let i=2020;i<=year;i++){
                this.yearTypeZ.push(i);
            }
        },
        openDetail(id){
            api.getActiveXq({id}).then(res=>{
                this.travelXq = res.data.data.retirementActivityDetailDTO;
                this.openTravel = true;
            })
        },
        closeDetailPop(e){
            this.openTravel = false;
        },
        getList(load){
            api.getActiveList({year:String(this.yearType)}).then(res=>{
                let list = res.data.data.list;
                list.forEach(function(ele){
                    let day = parseInt((new Date(ele.endTimeLong)-new Date()) / 1000);
                    ele.endDay = Math.floor( day/ (60 * 60 * 24));
                })
                this.trivalList = list;
                if(load){
                    this.$reMessage('刷新成功！','success');
                }
            })
        },
        outList(id){
            this.downLink = this.$store.state.baseUrl+'/retirement/activity/registrationstatistics/excel?housingEstate='+this.$store.state.userInfo.housingEstate+'&street='+this.$store.state.userInfo.street+'&param= '+'&retirementActivityId='+id+'&type=1';
            this.$nextTick(function(){
                let a = document.getElementById('down');
                a.click();
            })
            
        },
        outListXq(e){
            this.outList(e.id)
        },
        changeFile(){
            this.centerDialogVisible = false;
            this.openTravel = false;
            this.getList();
        },
        openFile(){
            this.centerDialogVisible = true;
        },
        navToXq(id){
            this.$router.push({ name: 'activexq', query: { id:id}})
        }
    },
    created(){
        this.dealYear();
        this.getList(); 
    },
    beforeRouteLeave(to,from,next){
        this.$store.commit('setTrival',this.yearType);
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
            height: calc(100% - 106px);
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
                                margin-left: 10px;
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
                    .date{
                        height: 16px;
                        line-height: 16px;
                        font-size: 16px;
                        color: #FF8645;
                        span{
                            color: #909399;
                            margin-left: 20px;
                            font-size: 14px;
                            cursor: pointer;
                        }
                    }
                    .theTime{
                        height: 16px;
                    }
                    .lastTime{
                        height: 16px;
                        line-height: 16px;
                        font-size: 16px;
                        color: #909399;
                        span.num{
                            font-size: 14px;
                            margin-left: 10px;
                            color: #909399;
                            cursor: pointer;
                            &:hover{
                                color: #1060FF;
                            }
                        }
                        span.red{
                            color: #F9496C;
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



