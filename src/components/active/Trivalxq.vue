<template>
    <div class="trival-xq">
        <div class="xqname">旅游报名 /<span> 报名统计</span></div>
        <div class="topinfo">
            <div class="leftinfo">
                <div class="img">
                    <img :src="travelInfo.frontCover" alt="旅游图片">
                </div>
                <div class="right">
                    <p class="title">{{travelInfo.title}} 
                        <span v-if="travelInfo.activityStatus==='1'">暂未开始</span>
                        <span class="red" v-else-if="travelInfo.activityStatus==='5'">报名开始</span>
                        <span class="gray" v-else>报名结束</span>
                    </p>
                    <p class="num">已报名 {{travelInfo.registrationNum}} 人</p>
                </div>
            </div>
           <div class="rightstreet" v-if="$store.state.userInfo.housingEstate===''">
                <span class="else" v-if="$store.state.userInfo.street">{{$store.state.userInfo.street}}</span>
                <el-select clearable style="width:120px;" size="small" v-else v-model="streetValue" placeholder="全部街道" @change="getList(1,null,1)">
                    <el-option
                    v-for="item in streetList[$store.state.userInfo.area]"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                <el-select clearable style="width:120px;margin-left:10px;" size="small" v-model="communityValue" placeholder="全部社区" @change="getList(1)">
                    <el-option
                    v-for="item in communityList[streetValue]"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                
               <el-button style="margin-left:10px;" slot="trigger" type="primary" size="small" @click="outPut">导出当前列表 <i class="el-icon-printer"></i></el-button>
           </div>
            
        </div>
        <div class="search" v-if="$store.state.userInfo.housingEstate">
            <div class="retiretitle-left">
                <div class="leftbtn">
                    <div :class="['complete',selectType==='1'?'select':'']" @click="getList(1,'1')">已完成/已报名</div>
                    <div :class="['cancle',selectType==='2'?'select':'']" @click="getList(1,'2')">已取消</div>
                </div>
            </div>
            <div class="right">
                <el-input
                    size="small"
                    style="width:240px;"
                    placeholder="请输入姓名/身份证号码"
                    prefix-icon="el-icon-search"
                    @keyup.enter.native="getList(1)"
                    v-model="searchWord">
                </el-input>
                <el-button style="margin-left:10px;" slot="trigger" type="primary" size="small" @click="outPut">导出当前列表 <i class="el-icon-printer"></i></el-button>
                <el-button style="margin-left:10px;" type="primary" size="small" @click="toPass" plain>全部已完成</el-button>
            </div>
        </div>
        <div :class="['trave-history',$store.state.userInfo.housingEstate?'':'street']">
            <template v-if="travelInfo.activityData&&travelInfo.activityData.totalCount">
                <Listdemo :item="item" :index="index" v-for="(item,index) in travelInfo.activityData.list" :key="item.id" @childChange="childChange($event,item.id)" @toPrint="toPrint"></Listdemo>
            </template>
            <HasNone v-if="travelInfo.activityData&&travelInfo.activityData.totalCount===0" />
        </div>
        <PageList v-if="travelInfo.activityData" :current="travelInfo.activityData.pageNum" :totalPage="travelInfo.activityData.totalCount" :pagesize="travelInfo.activityData.pageSize" @changePage="getList" />
        <a style="display:none;" target="_blank" id="down" :href="downLink" download="报名名单.pdf">报名名单</a>
        <OrderDetail 
            v-if="travelInfo.activityData&&travelInfo.activityData.totalCount" 
            :orderinfo="travelXq" 
            :popType="5"
            :innerVisible="innerVisible"
            @closeDetailPop="closeDetailPop"/>
        <Print v-if="travelInfo.activityData&&travelInfo.activityData.list.length" @closeTheTime="closeTime" :openTheTime="openTheTime" :info="travelInfo.activityData.list[itemIndex]" />  
    </div>
</template>

<script>
import Listdemo from './ListDemo';
import api from '@/api/index.js';
import HasNone from '@/components/public/HasNone';
import { Loading } from 'element-ui';
import PageList from '@/components/public/Pagelist';
import OrderDetail from '@/components/retire/OrderDetail';
import Print from '../receive/Print';
import address from '@/components/public/address.js';
export default {
    components:{
        Listdemo,
        HasNone,
        PageList,
        OrderDetail,
        Print
    },
    data(){
        return{
            selectType:'1',
            searchWord:'',
            travelInfo:{},
            downLink:"",
            innerVisible:false,
            openTheTime:false,
            itemIndex:0,
            travelXq:"",
            streetValue:this.$store.state.userInfo.street||null,
            streetList:address.street,
            communityValue:this.$store.state.userInfo.housingEstate||null,
            communityList:address.community
        }
    },
    methods:{
        outPut(){
            this.downLink = this.$store.state.baseUrl+'/retirement/activity/registrationstatistics/excel?housingEstate='+this.communityValue+'&street='+this.streetValue+'&param='+this.searchWord+'&retirementActivityId='+this.$route.query.id+'&type='+this.selectType;
            this.$nextTick(function(){
                let a = document.getElementById('down');
                a.click();
            }) 
        },
        getList(pageNum,type,street){
            if(type){
                this.selectType = type;
            }
            if(street){
                this.communityValue = null;
            }
            api.activeList({
                housingEstate:this.communityValue,
                street:this.streetValue,
                pageNum:pageNum,
                pageSize:20,
                param:this.searchWord,
                retirementActivityId:this.$route.query.id,
                type:this.selectType

            }).then(res=>{
                this.travelInfo = res.data.data.res
            })
        },
        childChange(e,id){
            api.activeXq({id:id}).then(res=>{
                res.data.data.retirementActivityOrderDetailVO.gift = JSON.parse(res.data.data.retirementActivityOrderDetailVO.gift);
                this.travelXq = res.data.data.retirementActivityOrderDetailVO;
                this.$nextTick(function(){
                    this.innerVisible = true;
                }) 
            })
        },
        toPrint(e){
            this.itemIndex = e.index;
            this.openTheTime = true;
        },
        closeDetailPop(e){
            this.innerVisible = false;
            if(e){
                this.getList(1);
            }
        },
        closeTime(){
            this.openTheTime = false;
        },
        toPass(){
            api.allToPass({
                activityId:this.travelInfo.retirementActivityId
            }).then(res=>{
                let that = this;
                this.$message({
                    center:true,
                    duration:1000,
                    message: '订单已完成！',
                    type: 'success',
                    onClose(){
                        that.getList(1)
                    }
                });
            })
        }
    },
    created(){
        this.getList(1) 
    }
}
</script>

<style lang="scss" scoped>
    .trival-xq{
        width: 100%;
        height: 100%;
        overflow: auto;
        .xqname{
            font-size: 12px;
            color: $black2;
            padding-bottom: 24px;
            span{
                color: $black;
            }
        }
        .topinfo{
            display: flex;
            width: 100%;
            justify-content: space-between;
            .leftinfo{
                display: flex;
                .img{
                    width: 160px;
                    height: 107px;
                    border-radius: 4px;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .right{
                    margin-left: 10px;
                    .title{
                        font-size: 20px;
                        color: #333;
                        display: flex;
                        align-items: center;
                        span{
                            font-size: 12px;
                            line-height: 12px;
                            color: #4080FF;
                            padding: 2px 4px;
                            border: 1px solid #4080FF;
                            border-radius: 4px;
                            flex-shrink: 0;
                            margin-left: 16px;
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
                    .num{
                        font-size: 20px;
                        color: #909399;
                        line-height: 28px;
                        margin-top: 10px;
                    }
                }
            }
            .rightstreet{
                .else{
                    width: 120px;
                    font-size: 14px;
                    color: $black2;
                    display: inline-block;
                    text-align: center;
                    border: 1px solid #DCDFE6;
                    height: 30px;
                    border-radius: 4px;
                    line-height: 30px;
                    margin-left: 10px;
                }
            }
            
        }
        .leftbtn{
            display: flex;
            .complete{
                width: 114px;
                height: 32px;
                line-height: 32px;
                font-size: 12px;
                text-align: center;
                color: #606266;
                border:1px solid #E3E5EB;
                border-right: 0;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                cursor: pointer;
            }    
            .cancle{
                font-size: 12px;
                color: #606266;
                line-height: 32px;
                height: 32px;
                width: 72px;
                border:1px solid #E3E5EB;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                border-left: 0;
                cursor: pointer;
                text-align: center;
            }
            .select{
                background-color: #4080FF;
                border:1px solid #4080FF;
                color: #fff;
            }
        }
        .search{
            margin-top: 20px;
        }
        .search .right{
            display: flex;
        }
        .trave-history{
            margin-top: 20px;
            height: calc(100% - 283px);
            overflow: auto;
        }
        .trave-history.street{
            height: calc(100% - 227px);
        }
    }
</style>


