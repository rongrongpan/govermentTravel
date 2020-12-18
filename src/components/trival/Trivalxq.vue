<template>
    <div class="trival-xq">
        <div class="xqname">旅游报名 /<span> 报名统计</span></div>
        <div class="topinfo">
            <div class="leftinfo">
                <div class="img">
                    <img :src="travelInfo.mainImage" alt="旅游图片">
                </div>
                <div class="right">
                    <p class="title">{{travelInfo.title}}</p>
                    <p class="num">已报名 {{travelInfo.registrationNum}} 人</p>
                </div>
            </div>
           <div class="rightstreet" v-if="!$store.state.userInfo.housingEstate">
                <!-- 社区 -->
                <el-select style="width:140px;" size="small" class="street" v-model="communcityValue" clearable placeholder="全部社区" @change="getList(1)">
                    <el-option
                    v-for="item in communityList"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
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
                <el-button v-if="travelInfo.year==$store.state.userInfo.years" style="margin-left:10px;" type="primary" size="small" @click="centerDialogVisible=true">&nbsp;&nbsp;&nbsp;&nbsp;导入名单&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </div> 
        </div>
        <div :class="['trave-history',$store.state.userInfo.housingEstate?'':'street']">
            <template v-if="travelInfo.travelList&&travelInfo.travelList.totalCount">
                <Listdemo :item="item" v-for="item in travelInfo.travelList.list" :key="item.id" @childChange="childChange($event,item.id)"></Listdemo>
            </template>
            <HasNone v-if="travelInfo.travelList&&travelInfo.travelList.totalCount===0" />
        </div>
        
        <PageList v-if="travelInfo.travelList" :current="travelInfo.travelList.pageNum" :totalPage="travelInfo.travelList.totalCount" :pagesize="travelInfo.travelList.pageSize" @changePage="getList" />
        <OrderDetail
            v-if="travelInfo.travelList&&travelInfo.travelList.totalCount" 
            :orderinfo="travelXq" 
            :popType="4" 
            :innerVisible="innerVisible" 
            @closeDetailPop="closeDetailPop"/>
        <UpFile :centerDialogVisible="centerDialogVisible" @changeFile="changeFile" :type="5" :activeId="travelInfo.id"/>
    </div>
</template>

<script>
import Listdemo from './ListDemo';
import api from '@/api/index.js';
import HasNone from '@/components/public/HasNone';
import { Loading } from 'element-ui';
import PageList from '@/components/public/Pagelist';
import OrderDetail from '@/components/retire/OrderDetail';
import UpFile from '@/components/public/UpFile';
import address from '@/components/public/address.js'
export default {
    components:{
        Listdemo,
        HasNone,
        PageList,
        OrderDetail,
        UpFile
    },
    data(){
        return{
            selectType:'1',
            searchWord:'',
            travelInfo:{},
            innerVisible:false,
            travelXq:"",
            centerDialogVisible:false,
            communcityValue:null,
            communityList:address.community[this.$route.query.street],
        }
    },
    methods:{
        getList(pageNum,type){
            if(type){
                this.selectType = type;
            }
            // 判断时候社区、街道、还是区
            let housingEstate = '';
            if(this.$store.state.userInfo.housingEstate){
                housingEstate = this.$store.state.userInfo.housingEstate;
            }else{
                housingEstate = this.communcityValue;
            }
            api.travelList({
                housingEstate:housingEstate,
                pageNum:pageNum,
                pageSize:20,
                param:this.searchWord,
                travelOpenId:this.$route.query.travelOpenId,
                type:this.selectType
            }).then(res=>{
                this.travelInfo = res.data.data.res
            })
        },
        childChange(e,id){
            api.travelXq({id:id}).then(res=>{
                this.travelXq = res.data.data.retirementTravelOrder;
                this.innerVisible = true;
            })
        },
        closeDetailPop(e){
            this.innerVisible = false;
            if(e){
                this.getList(1);
            }
        },
        changeFile(){
            this.centerDialogVisible = false;
            this.openTravel = false;
            this.getList();
        },
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


