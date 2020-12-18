<template>
    <div class="retirement" v-if="$store.state.userInfo.phone">
        <div class="retire-title"><img src="@/assets/tabbar1.png" alt="">退休人员</div>
        <div class="search">
            <div class="uploadfile">
                <a target="_blank" id="down1" :href="downLink"></a>
                <template v-if="$store.state.userInfo.housingEstate">
                    <el-button slot="trigger" size="small" style="width:100px;" type="primary" @click="centerDialogVisible=true">批量上传</el-button>
                    <el-button slot="trigger" type="primary" plain size="small" @click="openEdit=true">添加外籍人员</el-button>
                    <el-button type="primary" plain size="small" style="margin-right:10px;" @click="outPut">导出当前列表 <i class="el-icon-printer"></i></el-button>
                </template>
                <el-select size="small" style="width:120px;" v-model="safeType" @change="getList(1)" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in safeTypeZ"
                    :key="item"
                    :label="item"
                    :value="index">
                    </el-option>
                </el-select>
                <a v-if="$store.state.userInfo.housingEstate" class="moban" href="http://www.yueyilan.com/img-yueyilan/download/%E8%80%81%E4%BA%BA%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls">批量上传模板下载</a>
            </div>
            <el-input
                style="width:240px;"
                size="small"
                placeholder="请输入姓名/身份证号码"
                prefix-icon="el-icon-search"
                @keyup.enter.native="getList(1)"
                v-model="searchWord">
            </el-input>
        </div>
        <div class="personlist-wrapper">
            <dl class="personlist">
            <dt>
                <span class="name">姓名</span>
                <span class="card">身份证号码</span>
                <span class="phone">联系电话</span>
                <div class="street-wra">
                    <span class="street-else" v-if="$store.state.userInfo.street">{{$store.state.userInfo.street}}</span>
                    <el-select style="width:120px;" clearable v-else class="noborder paddingl" v-model="streetValue" placeholder="全部街道" @change="getList(1,1)">
                        <el-option
                        v-for="item in streetList[$store.state.userInfo.area]"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="community">
                    <span class="street-else" v-if="$store.state.userInfo.housingEstate">{{$store.state.userInfo.housingEstate}}</span>
                    <el-select v-else style="width:120px;" clearable class="noborder paddingl" v-model="communityValue" placeholder="全部社区" @change="getList(1)">
                        <el-option
                        v-for="item in communityList[streetValue]"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    
                </div>
            </dt>
            <div class="dt-h"></div>
            <dd v-for="(item,index) in personList.list" :key="item.id">
                <div class="top-title" @click="openThis(index)">
                    <span class="name"><span>{{item.elderName}}</span><i class="el-icon-arrow-down"></i></span>
                    <span class="card">{{item.idCard}}</span>
                    <span class="phone">{{item.phone}}</span>
                    <div class="street-wra">
                        {{item.street}}
                    </div>
                    <span class="community">{{item.housingEstate}}</span>
                </div>
                <div class="bottom-detai">
                    <div class="line">
                        <div class="li">
                            <span class="tit">姓名</span>
                            <span class="desc">{{retireInfo.elderName}} </span>
                        </div>
                        <div class="li">
                            <span class="tit">紧急联系人</span>
                            <span class="desc">
                                <span>{{retireInfo.relativesName}} {{retireInfo.relativesPhone}} </span>
                                <router-link :style="{marginLeft:retireInfo.xiaoqinCardnum?'20px':'0px'}" class="shoplist" :to="{name:'retirexq',params: { id: retireInfo.id }}">个人详情  <i class="el-icon-arrow-right"/></router-link>
                            </span>
                        </div>
                    </div>
                    <div class="line">
                        <div class="li">
                            <span class="tit">性别</span>
                            <span class="desc">{{retireInfo.sex}}</span>
                        </div>
                        <div class="li">
                            <span class="tit">社区负责人</span>
                            <span class="desc">{{retireInfo.govName}} {{retireInfo.govPhone}}</span>
                        </div>
                    </div>
                    <div class="line">
                        <div class="li">
                            <span class="tit">身份证号码</span>
                            <span class="desc">{{retireInfo.idCard}}</span>
                        </div>
                        <div class="li">
                            <span class="tit">文体经费余额</span>
                            <span class="desc">{{(retireInfo.balance*0.01).toFixed(2)}}</span>
                        </div>
                    </div>
                    <div class="line">
                        <div class="li">
                            <span class="tit">联系电话</span>
                            <span class="desc">{{retireInfo.phone}}</span>
                        </div>
                        <div class="li">
                            <span class="tit">联系地址</span>
                            <span class="desc">{{retireInfo.address}}</span>
                        </div>
                    </div>
                    <div class="line" v-if="retireInfo.xiaoqinCardnum">
                        <div class="li">
                            <span class="tit">孝亲卡</span>
                            <span class="desc">{{retireInfo.xiaoqinCardnum}}</span>
                        </div>
                    </div>
                </div>
            </dd>
            <HasNone v-if="personList.list && personList.list.length===0" />
        </dl>
        <PageList :current="personList.pageNum" :totalPage="personList.totalCount" :pagesize="personList.pageSize" @changePage="getList" />
        </div>
        <UpFile :centerDialogVisible="centerDialogVisible" @changeFile="changeFile" :type="6" />
        <ChangeInfo :openEdit="openEdit" @closeEdit="closeEdit"/>
    </div>
</template>
<script>
import $ from 'jquery';
import PageList from '@/components/public/Pagelist';
import api from '@/api/index.js';
import HasNone from '@/components/public/HasNone';
import UpFile from '@/components/public/UpFile';
import { Loading } from 'element-ui';
import ChangeInfo from './ChangeInfo';
import address from '@/components/public/address.js';
export default {
    components:{
        PageList,
        HasNone,
        UpFile,
        ChangeInfo
    },
    data(){
        return{
            searchWord:this.$store.state.userSearch,
            streetValue:this.$store.state.userInfo.street||null,
            streetList:address.street,
            communityValue:this.$store.state.userInfo.housingEstate||null,
            communityList:address.community,
            personList:{},
            retireInfo:{},
            fileList: [],
            centerDialogVisible:false,
            openEdit:false,
            safeType:this.$store.state.userType,
            safeTypeZ:['全部人员','待消费','已消费'],
            downLink:''
        }
    },
    methods:{
        closeEdit(e){
            this.openEdit = false;
            if(e===2){
                this.getList(1);
            }
        },
        openThis(index){
            let hander = $('.top-title').eq(index).parents('dd');
            let handers = $('.top-title').parents('dd.active');

           if(hander.hasClass('active')){
               hander.removeClass('active');
           }else{
               this.retireInfo = {};
               api.getRetireXq({id:this.personList.list[index].id}).then(res=>{
                    this.retireInfo = res.data.data.RetireeUserBaseDto;
                })
               if(handers){
                    handers.removeClass('active');
                    handers.find('.bottom-detai').stop().slideToggle();
                }
               hander.addClass('active');
           }
           hander.find('.bottom-detai').stop().slideToggle();
        },
        getList(pageNum,street){
            let loadingInstance = Loading.service();
            this.downLink = this.$store.state.baseUrl+'/excel/notconsumexport?consumed='+this.safeType;
            if(street){
                this.communityValue = null;
            }
            api.getRetireList({
                pageNum:pageNum,
                pageSize:50,
                paramHousingEstate:this.communityValue,
                paramStreet:this.streetValue,
                params:this.searchWord,
                consumed:this.safeType
                }).then(res=>{
                    loadingInstance.close();
                    this.personList = res.data.data;
            })
        },
        changeFile(){
            this.centerDialogVisible = false;
            this.getList(1);
        },
        outPut(){
            let a = document.getElementById('down1');
            a.click();
        }
    },
    created(){
        this.getList(1);
    },
    beforeRouteLeave(to,from,next){
        this.$store.commit('setUserType',this.safeType);
        this.$store.commit('setUserSearch',this.searchWord);
        next();
    }
}
</script>

<style lang="scss" scoped>
    #down1{
        width: 0;
        height: 0;
        overflow: hidden;
    }
    .moban{
        margin-top: 8px;
    }
    .uploadfile{
        display: flex;
        .el-button{
            a{
                display: block;
                width: 100%;
                height: 100%;
                color: $black1;
            }
        }
    }
    .retirement{
        width: 100%;
        height: 100%;
        .personlist-wrapper{
            overflow: hidden;
            width: 100%;
            position: relative;
            height: calc(100% - 96px);
        }
        .personlist{
            margin-top: 20px;
            width: 100%;
            height: calc(100% - 80px);
            overflow:auto;
            dt{
                position: absolute;
                top: 20px;
                left: 0;
                z-index: 99;
            }
            .dt-h{
                height: 48px;
                width: 100%;
            }
            dt,dd{
                border-bottom: 1px solid #EBEEF5;
            }
            dd .top-title{
                transition: background-color .3s ease-out;
                -webkit-transition: background-color .3s ease-out;
                -moz-transition: background-color .3s ease-out;
            }
            dt,dd .top-title{
                width: 100%;
                height: 48px;
                line-height: 48px;
                background-color: #F5F7FA;
                box-sizing: border-box;
                padding: 0 20px;
                justify-content: space-between;
                display: flex;
                font-size: 14px;
                color: #909399;
                .name{
                    width: 18%;
                }
                .card{
                    width: 17%;
                }
                .phone{
                    width: 17%;
                }
                .street-wra{
                    width: 15%;
                }
                .community{
                    width: 33%;
                }
                .name,.card,.phone,.street-wra,.community{
                    flex-grow: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            dd .top-title{
                background-color: #fff;
                cursor: pointer;
                .name{
                    span{
                        display: inline-block;
                        width: 60%;
                    }
                    i{
                        color: #676767;
                        margin-left: 5%;
                        transition: all .3s ease-out;
                        transform: rotateZ(180deg);
                        display: none;
                    }
                }
            }
            dd.active .top-title{
                background-color: #F5F7FA;
                border-bottom: 1px solid #EBEEF5;
                .name{
                    i{
                        display: inline-block;
                    }
                }
            }
            dd .top-title:hover{
                background-color: #F5F7FA;
            }
            .bottom-detai{
                width: 100%;
                box-sizing: border-box;
                padding: 20px;
                display: none;
                .line{
                    width: 100%;
                    line-height: 26px;
                    padding: 5px 0;
                    font-size: 16px;
                    color: $black1;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    .li{
                        width: 50%;
                        display: flex;
                        .tit{
                            color: #C0C4CC;
                            width: 120px;
                            flex-shrink: 0;
                        }
                        .desc{
                            flex-grow: 1;
                            display: flex;
                            justify-content: space-between;
                        }
                        .shoplist{
                            font-size: 16px;
                            color: $myblue;
                            i{
                                margin-left: 8px;
                            }
                        }
                    }
                }
            }

        }
    }
</style>
<style>
    .uploadfile .upload-demo{
        display: flex;
    }
    .uploadfile .el-upload-list__item:first-child{
        margin-top: 5px;
        margin-left: 10px;
    }
</style>



