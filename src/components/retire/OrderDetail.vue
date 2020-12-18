<template>
    <div>
        <!-- popType:1商品 -->
        <el-dialog v-if="popType===1" title="" :visible.sync="innerVisible" class="show-order-detail" width="778px" :before-close="handleClose">
            <div class="detail-body-pop">
                <p class="title">买家信息</p>
                <div class="userinfo">
                    <div class="topname">
                        <div class="namewrapper" v-for="item in orderinfo.receiverDtoList" :key="item.idCard">
                            <div class="name">{{item.name}}</div>
                            <div class="address-info">
                                <div class="phone">
                                    <p>{{item.phone}}</p>
                                    <p>{{item.idCard}}</p>
                                </div>
                                <div class="address" v-if="item.address">
                                    <i class="el-icon-location-information"></i>
                                    <div class="desc">
                                        <p>{{item.address}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order">
                        <p class="beizhu"><span class="tit">备注</span><span class="desc">{{orderinfo.remark?orderinfo.remark:'无'}}</span></p>
                        <p><span class="tit">是否自提</span><span class="desc">{{orderinfo.deliveryMethod==='1'?'否':'是'}}</span></p>
                        <p><span class="tit">订单编号</span><span class="desc">{{orderinfo.orderCode}}</span></p>
                        <p><span class="tit">创建时间</span><span class="desc">{{orderinfo.createTime}}</span></p>
                        <p><span class="tit">支付方式</span><span class="desc">{{orderinfo.payType=='1'?'孝亲卡':orderinfo.payType=='2'?'支付宝':'微信支付'}}</span></p>
                        <p><span class="tit">支付时间</span><span class="desc">{{orderinfo.payTime}}</span></p>
                    </div>
                </div>
                <div class="pop-scroll-wra" style="width:100%;">
                <div class="shoplist myshop">
                    <div class="leftlist">
                        <p class="title">商品列表</p>
                        <div class="leftlist-wra">
                            <div class="item" v-if="orderinfo.orderTravelDTO">
                                <div class="img">
                                    <img :src="orderinfo.orderTravelDTO.picture" alt="商品图片">
                                </div>
                                <div class="shop-info">
                                    <p class="tit overhid2">{{orderinfo.orderTravelDTO.travelTitle}}</p>
                                    <p class="price">¥ {{orderinfo.orderTravelDTO.yuan}}<span>{{orderinfo.orderTravelDTO.fen}}</span> <span class="num">x {{orderinfo.orderTravelDTO.num}}</span></p>
                                </div>
                            </div>
                            <div v-else-if="orderinfo.orderList">
                                <div class="item" v-for="item in orderinfo.orderList" :key="item.productId">
                                    <div class="img">
                                        <img :src="item.picture" alt="商品图片">
                                    </div>
                                    <div class="shop-info">
                                        <p class="tit overhid2">{{item.item}}</p>
                                        <p class="price">¥ {{item.yuan}}<span>{{item.fen}}</span> <span class="num">x {{item.quantity}}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="item" v-if="orderinfo.infoPackageDTO">
                                <div class="img">
                                    <img :src="orderinfo.infoPackageDTO.picture" alt="商品图片">
                                </div>
                                <div class="shop-info">
                                    <p class="tit overhid2">{{orderinfo.infoPackageDTO.item}}</p>
                                    <p class="price">¥ {{orderinfo.infoPackageDTO.yuan}}<span>{{orderinfo.infoPackageDTO.fen}}</span> <span class="num">x {{orderinfo.infoPackageDTO.quantity}}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="total-money">
                        <p class="desc">商品总价</p>
                        <p class="money">¥ {{orderinfo.totalPrice}}</p>
                        <p class="desc" v-if="orderinfo.orderTravelDTO">保险费 +{{(orderinfo.orderTravelDTO.insurance*orderinfo.orderTravelDTO.day*orderinfo.orderTravelDTO.num).toFixed(2)}}元</p>
                        <p class="desc">抵扣金额 -{{orderinfo.discountedPrice}}元</p>
                        <p class="desc" style="margin-top:25px;">实付款</p>
                        <p class="money">¥ {{orderinfo.realPayment}}</p>
                        <p class="desc sta">状态</p>
                        <p class="desc status">
                            <span v-if="orderinfo.status=='10'" style="color:rgb(192, 196, 204)">已完成</span>
                            <span v-else-if="orderinfo.status=='0'" style="color:#1060FF">待支付</span>
                            <span v-else-if="orderinfo.status=='1'" style="color:#1060FF">待发货</span>
                            <span v-else-if="orderinfo.status=='2'" style="color:#1060FF">待收货</span>
                            <span v-else-if="orderinfo.status=='-1'" style="color:#F9496C">支付失败</span>
                            <span v-else-if="orderinfo.status=='-2'" style="color:#F9496C">订单失败</span>
                            <span v-else-if="orderinfo.status=='-3'" style="color:#F9496C">订单失效</span>
                        </p>
                    </div>
                </div>
                </div>
            </div>
        </el-dialog>

        <!-- popType:2 病人探望，上门慰问,爱心逆行 活动 -->
        <el-dialog v-if="popType===2" title="" :visible.sync="innerVisible" class="show-order-detail" width="778px" :before-close="handleClose">
            <div class="detail-body-pop" v-if="orderinfo.userIdcard">
                <p class="title">{{orderinfo.orderType=='4'?'慰问':'探望'}}信息  <span class="edit" v-if="orderinfo.orderStatus==='1' || orderinfo.orderStatus==='4'" @click="editInfo">编辑<i class="el-icon-edit-outline"></i></span></p>
                <div class="userinfo">
                    <div class="topname">
                        <div class="name">{{orderinfo.userName}}</div>
                        <div class="address-info">
                            <div class="phone">
                                <p>{{orderinfo.userPhone}}</p>
                                <p>{{orderinfo.userIdcard}}</p>
                            </div>
                            <div class="address">
                                <i class="el-icon-location-information"></i>
                                <div class="desc" v-if="orderinfo.hospitalAddress">
                                    <p>{{orderinfo.hospitalAddress}}</p>
                                    <p>{{orderinfo.address}}</p>
                                </div>
                                <div class="desc" v-else>
                                    <p>{{orderinfo.address}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order">
                        <p class="beizhu"><span class="tit">备注</span><span class="desc">{{orderinfo.remark?orderinfo.remark:'无'}}</span></p>
                        <p v-if="orderinfo.orderType==='4'||orderinfo.orderType==='12'"><span class="tit">是否自提</span><span class="desc">{{orderinfo.personally==='1'?'是':'否'}}</span></p>
                        <p><span class="tit">{{orderinfo.orderType=='4'?'慰问':'探望'}}编号</span><span class="desc">{{orderinfo.orderCode}}</span></p>
                        <p><span class="tit">创建时间</span><span class="desc">{{orderinfo.createTime}}</span></p>
                    </div>
                </div>
                <div class="pop-scroll-wra" style="min-height:192px;max-height:396px;width:100%;overflow:auto;background-color:#fff;">
                <div class="shoplist-visit">
                    <div class="staffName" v-if="orderinfo.orderStatus !== '1'">
                        <p class="staf-title">{{orderinfo.orderType=='4'?'慰问':'探望'}}人员</p>
                        <p class="info"><span class="left">{{orderinfo.staffName.slice(0,1)}}</span> {{orderinfo.staffName}} &nbsp;&nbsp;{{orderinfo.staffPhone}}</p>
                    </div>
                    <p class="title" v-if="orderinfo.orderStatus=='10'||orderinfo.orderStatus=='-1'||orderinfo.orderStatus=='7'">{{orderinfo.orderType=='4'?'慰问':'探望'}}日志</p>
                    <div class="visitinfo" v-if="orderinfo.orderStatus=='10'||orderinfo.orderStatus=='-1'||orderinfo.orderStatus=='7'">
                        <div class="senddetail">
                            <div class="remark" v-if="orderinfo.logRemark">{{orderinfo.logRemark}}</div>
                            <div class="img" v-if="orderinfo.logImageList">
                                <img @click="openSlide(index)" v-for="(item,index) in orderinfo.logImageList" :key="item+index"  :src="item" alt="图片">
                            </div>
                        </div>
                    </div>
                    <p class="title status">{{orderinfo.orderType=='4'?'慰问':'探望'}}状态</p>
                    <ul class="progress">
                        <li class="type1">
                            <p class="date">{{orderinfo.sendTime}}</p>
                            <div class="circle none"></div>
                            <p class="sta">{{orderinfo.orderStatus==='1'?'已发布':'已派单'}}</p>
                        </li>
                        <li class="type3-success" v-if="orderinfo.orderStatus=='10'">
                            <p class="date">{{orderinfo.serverTime}}</p>
                            <div class="circle"></div>
                            <p class="sta">{{orderinfo.orderType=='4'?'已慰问':'已探望'}}</p>
                        </li>
                        <li class="type3-success" v-else-if="orderinfo.orderStatus=='-1'">
                            <p class="date">{{orderinfo.serverTime}}</p>
                            <div class="circle"></div>
                            <p class="sta">{{orderinfo.orderType=='4'?'慰问失败':'探望失败'}}</p>
                        </li>
                        <li class="type3-success" v-else-if="orderinfo.orderStatus=='7'">
                            <p class="date">{{orderinfo.serverTime}}</p>
                            <div class="circle"></div>
                            <p class="sta">待审核</p>
                        </li>
                        <li class="type2" v-else>
                            <p class="date" style="height:14px;"></p>
                            <div class="circle" style="background-color:#F2F6FC;"></div>
                            <p class="sta" style="color:#909399">{{orderinfo.orderType=='4'?'待慰问':'待探望'}}</p>
                        </li>
                    </ul>
                </div>
                <div class="shoplist" v-if="orderinfo.orderType=='4'">
                    <p class="title" style="padding-top:0;">商品列表</p>
                    <div class="leftlist">
                        <div class="item" v-for="(item) in orderinfo.productDTOList" :key="item.id">
                            <div class="img">
                                <img :src="item.picture" alt="商品图片">
                            </div>
                            <div class="shop-info">
                                <p class="tit overhid2">{{item.subTitle}}</p>
                                <p class="description overhid2">{{item.description}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </el-dialog>

        <!-- popType:3孝亲卡 -->
        <el-dialog v-if="popType===3" title="" :visible.sync="innerVisible" class="show-order-detail1" width="912px" :before-close="handleClose">
            <div class="cardlist-pop">
                <div class="leftinfo">
                    <p class="title">申领人信息</p>
                    <div class="basic-wrapper">
                        <div class="basic">
                            <p class="name">{{orderinfo.userName}}</p>
                            <div class="phone">
                                <p>{{orderinfo.userPhone}}</p>
                                <p>{{orderinfo.userIdCard}}</p>
                            </div><br/>
                        </div>
                        <p class="cardnumber"><span class="tit">领取卡号</span><span class="desc">{{orderinfo.xiaoqinCardNum}}</span></p>
                    </div>
                    
                    <div class="detail">
                        <p class="beizhu"><span class="tit">备注</span><span class="desc">{{orderinfo.remark?orderinfo.remark:'无'}}</span></p>
                        <p><span class="tit">服务编号</span><span class="desc">{{orderinfo.claimCode}}</span></p>
                        <p><span class="tit">申请时间</span><span class="desc">{{orderinfo.createTime}}</span></p>
                        <p><span class="tit">申领金额</span><span class="desc">{{orderinfo.fundType==='1'?'130':'65'}}</span></p>
                    </div>
                </div>
                <div class="right-progress">
                    <div class="toppro">
                        <div class="status sta">
                            <div class="cir">
                                <i class="el-icon-check"></i>
                            </div>
                            <div class="font">
                                <p class="tit">已申请</p>
                                <p class="date">{{orderinfo.createTime}}</p>
                            </div>
                        </div>
                        <div class="status sta already1">
                            <div class="cir">
                                <i class="el-icon-more"></i>
                            </div>
                            <div class="font">
                                <p class="tit">{{orderinfo.status=='1'?'待领取':'已领取'}}</p>
                                <p class="date">{{orderinfo.status=='1'?'':orderinfo.updateTime}}</p>
                            </div>
                        </div>

                        <div class="line"></div>
                    </div>
                    <p class="getcard" v-if="orderinfo.status == '2'">已领取</p>
                    <p class="getcard" @click="getCard(orderinfo.id,orderinfo.status)" v-else style="background-color:#4080FF;color:#fff;">领取卡片</p>
                </div>   
            </div>
        </el-dialog>

        <el-dialog v-if="popType===4||popType===5" title="" :visible.sync="innerVisible" class="show-order-detail" width="700px" :before-close="handleClose">
            <div class="detail-body-pop">
                <p class="title">用户信息</p>
                <div class="userinfo">
                    <div class="topname">
                        <div class="name">{{orderinfo.userName}}</div>
                        <div class="address-info">
                            <div class="phone">
                                <p>{{orderinfo.userPhone}}</p>
                                <p>{{orderinfo.userIdcard}}</p>
                            </div>
                            <div class="address" v-if="orderinfo.relative">
                                <p style="margin-right:30px;">联系人</p>
                                <div class="desc">
                                    <p>{{orderinfo.relative}}</p>
                                    <p>{{orderinfo.relativePhone}}</p>
                                </div>
                            </div>
                            <div class="street">
                                <p><span>所属街道</span>{{orderinfo.street}}</p>
                                <p><span>所属社区</span>{{orderinfo.housingEstate}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="order">
                        <p class="beizhu"><span class="tit">备注</span><span class="desc">{{orderinfo.remark?orderinfo.remark:'无'}}</span></p>
                        <p><span class="tit">订单编号</span><span class="desc">{{orderinfo.orderCode}}</span></p>
                        <p><span class="tit">创建时间</span><span class="desc">{{orderinfo.createTime}}</span></p>
                        <p><span class="tit">订单来源</span><span class="desc">{{orderinfo.source===1?'家孝通':orderinfo.source===2?'企退人员管理系统':'越易蓝派单系统'}}</span></p>
                        <template v-if="orderinfo.orderStatus==='-1'">
                            <p style="margin-top:6px;"><span class="tit">取消原因</span><span class="desc">{{orderinfo.reason?orderinfo.reason:'无'}}</span></p>
                            <p><span class="tit">取消时间</span><span class="desc">{{orderinfo.cancelTime}}</span></p>
                        </template>
                    </div>
                    <div class="cancelTravel">
                        <el-input
                            type="textarea"
                            placeholder="请输入取消原因"
                            v-model="cancelText"
                            maxlength="50"
                            show-word-limit
                            rows="3"
                            v-if="cancelTravel"
                            >
                        </el-input>
                    </div>
                </div>
                <div class="shoplist">
                    <div class="leftlist travel">
                        <div class="item">
                            <div class="img">
                                <img :src="orderinfo.mainImage||orderinfo.frontCover" alt="商品图片">
                            </div>
                            <div class="shop-info">
                                <p class="tit overhid2" style="margin-bottom:2px;">{{orderinfo.travelTitle||orderinfo.activityTitle}}</p>
                                <p class="description" style="line-height:20px;">集合地点&nbsp;&nbsp;&nbsp;&nbsp;{{orderinfo.meetingPlace||orderinfo.place}}</p>
                                
                                <p class="description" style="line-height:20px;">
                                    <span v-if="orderinfo.travelTime">发车时间&nbsp;&nbsp;&nbsp;&nbsp;{{orderinfo.travelTime}}</span>
                                    <span v-else>活动时间&nbsp;&nbsp;&nbsp;&nbsp;{{orderinfo.activityTime}}</span>
                                </p>
                                <p class="description" v-if="popType===5&&orderinfo.gift&&orderinfo.gift.length" style="line-height:20px;">礼品详情&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span v-for="item in orderinfo.gift" :key="item.specificationName">{{item.specificationName}}&nbsp;&nbsp;&nbsp;</span>
                                </p>
                            </div>
                        </div>
                        <div class="status">
                            <p class="tit">状态</p>
                            <p class="con">{{orderinfo.orderStatus==='-1'?'已取消':orderinfo.orderStatus==='4'?'已报名':'已完成'}}</p>
                        </div>
                    </div>
                </div>
                <template v-if="$store.state.userInfo.housingEstate&&popType===5">
                    <div class="travel-button" v-if="cancelTravel">
                        <el-button class="btn" size="small" type="primary" plain @click="cancelTravel=false;">暂不取消</el-button>
                        <el-button class="btn" size="small" type="danger" plain @click="cancelOrder">&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;</el-button>
                    </div>
                    <div class="travel-button" v-else>
                        <template v-if="orderinfo.orderStatus==='4'">
                            <el-button class="btn" size="small" type="primary" plain  @click="changeTravel">修改订单</el-button>
                            <el-button class="btn" size="small" type="warning" @click="toPass" plain>&nbsp;&nbsp;已完成&nbsp;&nbsp;</el-button>
                            <el-button class="btn" size="small" type="warning" plain @click="cancelTravel=true">{{popType===4?'取消旅游':'取消活动'}}</el-button>
                        </template>
                    </div>
                </template>
            </div>
        </el-dialog>

        <!-- 修改订单信息 -->
        <el-dialog title="" :visible.sync="changeInfo" class="show-order-detail changetheInfo" width="700px">
            <div class="changeInfo">
                <p class="title">修改订单</p>
                <div class="content">
                    <div class="list disabled">
                        <el-input class="left" :disabled="true" v-model="infoName" placeholder="请输入姓名"></el-input>
                        <el-input class="right" :disabled="true" v-model="infoCard" placeholder="请输入身份证号"></el-input>
                    </div>
                    <el-input class="list" v-model="infoPhone" placeholder="请输入手机号码"></el-input>
                    <template v-if="popType===2">
                        <div class="list getauto">
                            <el-input v-model="familyAddress" placeholder="请输入家庭地址"></el-input>
                            <div class="button" v-if="orderinfo.orderType==='4'"><el-checkbox v-model="personally">自提</el-checkbox></div>
                        </div>
                        <el-input v-if="orderinfo.orderType!=='4'" class="list" v-model="hospitalAddress" placeholder="请输入医院地址"></el-input>
                    </template>
                    <template v-if="groupType.length">
                        <el-select class="list" v-if="popType===4||popType===5" v-model="groupTypeZ" placeholder="请选择">
                            <el-option
                            v-for="item in groupType"
                            :key="item.id"
                            :label="item.title"
                            :value="item.title">
                            </el-option>
                        </el-select>
                        <el-select class="list" v-else v-model="groupTypeZ" placeholder="请选择">
                            <el-option
                            v-for="item in groupType"
                            :key="item.id"
                            :label="item.packageName"
                            :value="item.packageName">
                            </el-option>
                        </el-select>
                    </template>
                    <el-input
                        type="textarea"
                        :rows="4"
                        class="list text"
                        show-word-limit
                        maxlength="100"
                        placeholder="请输入备注"
                        v-model="remarkDetail">
                    </el-input> 
                </div>
                <p class="onlyOne">每位用户最多修改一次，请慎重修改</p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeTheInfo" class="btn" round type="primary">确定</el-button>
                </span>
            </div>
        </el-dialog>

        <!-- popType：2 查看打卡大图-->

        <el-dialog v-if="popType===2&&orderinfo.logImageList" title="" :visible.sync="seeBigimg" class="show-order-detail seeBigimg" width="700px">
            <el-carousel :autoplay="false" height="616px" class="bigimg" arrow="always" :loop="loopSlide"  @change="changeSlide" :initial-index="activeSlideIndex" ref="carousel">
                <el-carousel-item v-for="(item,index) in orderinfo.logImageList" :key="item+index">
                    <img :src="item" alt="图片">
                </el-carousel-item>
            </el-carousel>
            <p class="slide-number">{{activeSlideIndex+1}} / {{orderinfo.logImageList.length}}</p>
        </el-dialog>
        
    </div>

</template>
<script>
import api from '@/api/index';
export default {
    props:['innerVisible','orderinfo','popType'],//popType 1家孝通商品  2病人探望，上门慰问，爱心逆行 3孝亲卡  4 旅游信息  5活动
    data(){
        return{
            seeBigimg:false,
            loopSlide:false,
            activeSlideIndex:0,
            groupTypeZ:'',
            groupType:[],
            firstShow:true,
            changeInfo:false,
            infoPhone:'',
            familyAddress:'',
            hospitalAddress:'',
            personally:'',
            remarkDetail:'',
            infoName:'',
            infoCard:'',
            cancelTravel:false,
            cancelText:''
        }
    },
    watch:{
        orderinfo(){
            if(this.popType===2){
                this.infoPhone = this.orderinfo.userPhone;
                this.familyAddress = this.orderinfo.address;
                this.hospitalAddress = this.orderinfo.hospitalAddress;
                this.remarkDetail = this.orderinfo.remark;
                this.infoName = this.orderinfo.userName;
                this.infoCard = this.orderinfo.userIdcard;
                if(this.orderinfo.orderType==='4'){
                    this.personally = this.orderinfo.personally==='1'?true:false;
                    this.groupTypeZ = this.orderinfo.detailDTO.packageName;
                }
            }else if(this.popType===4||this.popType===5){
                this.infoPhone = this.orderinfo.userPhone;
                this.remarkDetail = this.orderinfo.remark;
                this.infoName = this.orderinfo.userName;
                this.infoCard = this.orderinfo.userIdcard;
                this.groupTypeZ = this.orderinfo.travelTitle||this.orderinfo.activityTitle;
                this.cancelText = "";
                this.cancelTravel = false;
            } 
        }
    },
    methods:{
        // 旅游相关方法
        //修改旅游订单
        changeTravel(){
            if(this.popType===5){
                api.getActiveList({year:this.orderinfo.year}).then(res=>{
                    let arr = [];
                    res.data.data.list.forEach(function(ele){
                        if(ele.activityStatus==='5'){
                            arr.push(ele)
                        }
                    })
                    this.groupType = arr;
                    this.changeInfo = true;
                })
            }else if(this.popType===4){
                api.getTravelList({year:this.orderinfo.year}).then(res=>{
                    let arr = [];
                    res.data.data.list.forEach(function(ele){
                        arr.push(ele)
                    })
                    this.groupType = arr;
                    this.changeInfo = true;
                })
            }
        },
        //取消活动订单
        cancelOrder(){
            if(this.popType===5){
                api.cancelActive({id:this.orderinfo.id,reason:this.cancelText}).then(res=>{
                    let that = this;
                    this.$message({
                        center:true,
                        duration:1000,
                        message: '取消成功！',
                        type: 'success',
                        onClose(){
                            that.$emit('closeDetailPop',true);
                        }
                    });
                })
            }else if(this.popType===4){
                api.cancelTrival({id:this.orderinfo.id,reason:this.cancelText}).then(res=>{
                    let that = this;
                    this.$message({
                        center:true,
                        duration:1000,
                        message: '取消成功！',
                        type: 'success',
                        onClose(){
                            that.$emit('closeDetailPop',true);
                        }
                    });
                })
            }
            
        },
        //关闭详情弹窗
        handleClose(){
            this.$emit('closeDetailPop',false);
        },
        //轮播图切换
        changeSlide(index){
            this.activeSlideIndex = index;
        },
        //打开大图
        openSlide(index){
            this.activeSlideIndex = index;
            this.seeBigimg = true;
            if(this.firstShow){
                this.firstShow = false;
            }else{
                this.$refs.carousel.setActiveItem(index);
            }
        },
        //确认领取孝亲卡
        getCard(id,status){
            let that = this;
            api.toGetCard({
                id,
                status
            }).then(res=>{
                this.$message({
                    center:true,
                    duration:1000,
                    message: '领取成功！',
                    type: 'success',
                    onClose(){
                        that.$emit('closeDetailPop',true);
                    }
                });
            })
        },
        //打开修改弹窗
        editInfo(){
            this.changeInfo = true;
            if(this.popType===2&&this.orderinfo.orderType==='4'){
                this.getGrouplist();
            }
        },
        //获取上门慰问商品列表
        getGrouplist(){
            api.getPackage().then(res=>{
                this.groupType = res.data.data.packageList;
            })
        },
        //修改上门慰问，病人探望，爱心逆行订单信息  活动、旅游
        changeTheInfo(){
            let groupid=0;
            let that = this;
            if(this.popType===2){
                this.groupType.forEach(function(ele){
                    if(ele.packageName===that.groupTypeZ){
                        groupid = ele.id;
                    }
                })
                api.changeOrderInfo({
                    "address": this.familyAddress,
                    "hospitalAddress": this.hospitalAddress,
                    "id": this.orderinfo.id,
                    "packageId": this.orderinfo.orderType==='4'?groupid:null,
                    "personally": this.personally?'1':'0',
                    "remark": this.remarkDetail,
                    "userPhone": this.infoPhone
                }).then(res=>{
                    this.$message({
                        center:true,
                        duration:1000,
                        message: '修改成功！',
                        type: 'success',
                        onClose(){
                            that.changeInfo = false;
                            that.$emit('closeDetailPop',true);
                        }
                    });
                })
            }else{
                if(this.popType===5){
                    this.groupType.forEach(function(ele){
                        if(ele.title===that.groupTypeZ){
                            groupid = ele.id;
                        }
                    })
                    api.changeActive({
                        orderId:this.orderinfo.id,
                        remark:this.remarkDetail,
                        retirementActivityId:groupid
                    }).then(res=>{
                        this.$message({
                            center:true,
                            duration:1000,
                            message: '修改成功！',
                            type: 'success',
                            onClose(){
                                that.changeInfo = false;
                                that.$emit('closeDetailPop',true);
                            }
                        });
                    })
                }else if(this.popType===4){
                    this.groupType.forEach(function(ele){
                        if(ele.title===that.groupTypeZ){
                            groupid = ele.travelOpenId;
                        }
                    })
                    api.changeTrival({
                        orderId:this.orderinfo.id,
                        remark:this.remarkDetail,
                        travelOpenId:groupid
                    }).then(res=>{
                        this.$message({
                            center:true,
                            duration:1000,
                            message: '修改成功！',
                            type: 'success',
                            onClose(){
                                that.changeInfo = false;
                                that.$emit('closeDetailPop',true);
                            }
                        });
                    })
                }
                
            }
        },
        //将活动订单修改成已完成
        toPass(){
            api.toPass({
                orderId:this.orderinfo.id
            }).then(res=>{
                let that = this;
                this.$message({
                    center:true,
                    duration:1000,
                    message: '订单已完成！',
                    type: 'success',
                    onClose(){
                        that.$emit('closeDetailPop',true);
                    }
                });
            })
        }
    },
    created(){
        
    }
}
</script>
<style lang="scss" scoped>

    .changeInfo{
        padding-bottom: 30px;
        width: 100%;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
        .onlyOne{
            font-size: 14px;
            color: rgb(255, 118, 97);
        }
        .disabled{
            display: flex;
            justify-content: space-between;
            .left{
                width: 45%;
                margin-right: 2%;
            }
            .right{
                width: 53%;
            }
        }
        .list{
            margin-bottom: 20px;
            width: 100%;
        }
        .title{
            margin-bottom: 30px;
            padding-top: 10px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: $black;
        }
        .getauto{
            display: flex;
            .button{
                height: 40px;
                width: 140px;
                margin-left: 10px;
                border-radius: 4px;
                border: 1px solid #1060FF;
                line-height: 40px;
                box-sizing: border-box;
                padding: 0 10px;
            }
        }
        .btn{
            width: 77px;
            height: 28px;
            font-size: 12px;
            padding: 0;
            text-align: center;
            background-color: $myblue;
            margin: 0 auto;
            display: block;
            margin-top: 20px;
        }
        .tit{
            color: $black2;
            font-size: 12px;
            margin-bottom: 6px;
        }
    }
    .slide-number{
        height: 20px;
        line-height: 20px;
        color: $black;
        text-align: center;
        width: 100%;
        padding-bottom: 20px;
        font-size: 16px;
    }
    .detail-body-pop{
        width: 100%;
        padding-top: 6px;
        .title{
            font-size: 14px;
            color: $black2;
            padding-left: 20px;
            margin-bottom: 14px;
            padding-right: 20px;
            .edit{
                margin-left: 30px;
                cursor: pointer;
                i{
                    margin-left: 4px;
                }
            }
        }
        .userinfo{
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            border-bottom: 1px solid #EBEEF5;
            .topname{
                width: 100%;
                padding-bottom: 16px;
                border-bottom: 1px solid #DCDFE6;
                max-height: 106px;
                overflow: auto;
                .namewrapper{
                    width: 100%;
                    margin-bottom: 10px;
                }
                .namewrapper:last-of-type{
                    margin-bottom: 0;
                }
                .name{
                    font-size: 14px;
                    color: #222;
                    width: 100%;
                    margin-bottom: 10px;
                }
                .address-info{
                    display: flex;
                    font-size: 12px;
                    .phone{
                        width: 33.3%;
                        font-size: 12px;
                        color: $black2;
                        line-height: 18px;
                    }
                    .address{
                        display: flex;
                        color: $black2;
                        line-height: 18px;
                         width: 33.3%;
                        i{
                            font-size: 12px;
                            margin-right: 10px;
                            margin-top: 3px;
                        }
                    }
                    .street{
                        font-size: 12px;
                        line-height: 18px;
                        color: $black2;
                        p{
                            display: flex;
                            span{
                                width: 72px;
                            }
                        }
                    }
                }
            }
            .order{
                width: 100%;
                box-sizing: border-box;
                padding: 14px 0px;
                p{
                    display: flex;
                    font-size: 12px;
                    line-height: 22px;
                    .tit{
                        color: $black2;
                        width: 60px;
                        margin-right: 16px;
                        flex-shrink: 0;
                    }
                    .desc{
                        color: $black1;
                    }
                }
                .beizhu{
                    margin-bottom: 16px;
                }
            }
            .cancelTravel{
                padding-bottom: 20px;
            }
        }
        .shoplist{
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            background-color: #fff;
            .title{
                    padding-left: 0;
                    padding-top: 20px;
                }
            .total-money{
                width: 238px;
                padding-top: 15px;
                padding-bottom: 30px;
                box-sizing: border-box;
                padding-left: 30px;
                .desc{
                    font-size: 12px;
                    color: #7A7A7A;
                    line-height:20px;
                }
                .money{
                    font-size: 30px;
                    color: $black;
                    line-height: 50px;
                    span{
                        font-size: 26px;
                    }
                }
                .sta{
                    margin-top: 8px;
                    margin-bottom: 8px;
                }
                .status{
                    font-size: 14px;
                }
            }
            .leftlist{
                padding-bottom: 20px;
                .item{
                    width: 100%;
                    margin-bottom: 20px;
                    display: flex;
                    .img{
                        width: 84px;
                        height: 84px;
                        background-color: #F2F6FC;
                        margin-right: 18px;
                        flex-shrink: 0;
                        position: relative;
                        overflow: hidden;
                        img{
                            height: 100%;
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                    .shop-info{
                        .tit{
                            font-size: 14px;
                            color: $black;
                            line-height: 22px;
                        }
                        .price{
                            font-size: 14px;
                            color: #FDA931;
                            span{
                                font-size: 12px;
                            }
                            .num{
                                font-size: 14px;
                                color: $black1;
                            }
                        }
                        .description{
                            font-size: 12px;
                            color: #999;
                            line-height: 16px;
                        }
                    }
                }
                .item:last-of-type{
                    margin-bottom: 0;
                }
            }
            .travel{
                display: flex;
                justify-content: space-between;
                padding-top: 20px;
                .status{
                    float: right;
                    font-size: 12px;
                    color: #909399;
                    width: 30%;
                    .con{
                        font-size: 14px;
                        margin-top: 10px;
                    }
                }
            }
        }
        .travel-button{
            background-color: #fff;
            padding-top: 10px;
            padding-bottom: 30px;
            padding-left: 20px;
            padding-right: 20px;
            text-align: right;
        }
        .shoplist.myshop{
            display: flex;
            .leftlist{
                flex-grow: 1;
                .img{
                    flex-shrink: 0;
                }
                .leftlist-wra{
                    height: 188px;
                    overflow: auto;
                }
            }
            .total-money{
                border-left: 1px solid #F0F2F5;
            }
        }
        .shoplist-visit{
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px 28px;
            background-color: #fff;
            .staffName{
                margin-top: 26px;
                font-size: 14px;
                .staf-title{
                    color: #9B9B9B;
                }
                .info{
                    font-size: 12px;
                    color: $black;
                    margin-top: 10px;
                    .left{
                        width: 24px;
                        height: 24px;
                        text-align: center;
                        line-height: 24px;
                        background-color: #4080FF;
                        color: #fff;
                        font-size: 12px;
                        display: inline-block;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                }
            }
            .title{
                padding-left: 0;
                padding-top: 16px;
                height: 20px;
                line-height: 20px;
                margin-bottom: 8px;
            }
            .title.status{
                padding-top: 18px;
            }
            .visitinfo{
                width: 100%;
                font-size: 12px;
                color: $black;
                .lastname{
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: $myblue1;
                    font-size: 12px;
                    line-height: 24px;
                    text-align: center;
                    display: inline-block;
                    color: #fff;
                    margin-right: 10px;
                }
                .phone{
                    margin-left: 12px;
                }
                .senddetail{
                    width: 407px;
                    line-height: 17px;
                    box-sizing: border-box;
                    color: $black1;
                    background-color: #fff;
                    position: relative;
                    margin-top: 9px;
                    z-index: 8;
                    span{
                        color: $black;
                    }
                    .remark{
                        margin-bottom: 10px;
                        color: #606266;
                        line-height: 16px;
                    }
                    .img{
                        width: 100%;
                        img{
                            width: 90px;
                            height: 90px;
                            background-color: #F7F9FB;
                            margin-right: 11px;
                            cursor: pointer;
                        }
                        img:nth-of-type(4n){
                            margin-right: 0;
                        }
                    }
                    .seemoreimg{
                        font-size: 12px;
                        line-height: 24px;
                        color: $black1;
                        margin-top: 6px;
                        cursor: pointer;
                    }
                }
            }
            ul{
                width: 100%;
                display: flex;
                li{
                    min-width: 225px;
                    color: $black2;
                    font-size: 12px;
                    .circle{
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: $myblue1;
                        position: relative;
                        margin: 4px 0;
                        &:after{
                            display: inline-block;
                            width: 215px;
                            height: 1px;
                            background-color: $myblue1;
                            content: "";
                            clear: both;
                            position: absolute;
                            left: 13px;
                            top: 6px;
                        }
                    }
                    .date{
                        height: 14px;
                        line-height: 14px;
                    }
                    .circle.none{
                        &:after{
                            background-color: #E4E7ED;
                        }
                    }
                }
                li:last-of-type{
                    color: $black;
                    .circle{
                        &:after{
                            display: none;
                        }
                    }
                }
                .type3-fail{
                    .circle{
                        background-color: #F9496C;
                    }
                    .sta{
                        color: #F9496C;
                    }
                }
            }
        }
    }
    .cardlist-pop{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .title{
            font-size: 14px;
            color: $black2;
            margin-bottom: 14px;
        }
        .leftinfo{
            width: 559px;
            background-color: #F2F6FC;
            box-sizing: border-box;
            padding: 20px;
            .basic{
                width: 100%;
                display: flex;
                align-items: flex-start;
                
                .name{
                    font-size: 14px;
                    color: #222;
                    width: 75px;
                }
                .phone{
                    font-size: 16px;
                    color: $black1;
                    line-height: 22px;
                }
            }
            .detail{
                padding-top: 12px;
                p{
                    display: flex;
                    font-size: 14px;
                    line-height: 22px;
                    .tit{
                        color: $black2;
                        width: 75px;
                    }
                    .desc{
                        color: $black;
                        
                    }
                }
                .beizhu{
                    margin-bottom: 22px;
                    .desc{
                        color: $black2;
                    }
                }
            }
            .cardnumber{
                 display: flex;
                    font-size: 14px;
                    line-height: 34px;
                    margin-top: 14px;
                    .tit{
                        color: $black2;
                        width: 75px;
                    }
                    .desc{
                        color: $black;
                        font-size: 24px;
                    }
            }
            .basic-wrapper{
                padding-bottom: 16px;
                border-bottom: 1px solid #DCDFE6;
            }
        }
        .right-progress{
            flex: 1;
            box-sizing: border-box;
            padding: 20px;
            padding-bottom: 30px;
            .toppro{
                margin-top: 10px;
                position: relative;
                .status{
                    display: flex;
                    font-size: 0;
                    height: 180px;
                    position: relative;
                    z-index: 2;
                    .cir{
                        width: 27px;
                        height: 27px;
                        border-radius: 50%;
                        background-color: #E4E7ED;
                        margin-right: 22px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        i{
                            color: #fff;
                            font-size: 14px;
                        }
                    }
                    .font{
                        .tit{
                            font-size: 24px;
                            color: #C0C4CC;
                            line-height: 24px;
                        }
                        .date{
                            font-size: 15px;
                            color: #C0C4CC;
                            line-height: 22px;
                            margin-top: 4px;
                        }
                    }
                }
                .status.sta{
                    .cir{
                        background-color: #FDA931;
                        i{
                            font-size: 20px;
                        }
                    }
                    .font{
                        .tit{
                            color: #FDA931;
                        }
                    }
                }
                .status.sta.already1{
                    height: 80px;
                    .cir{
                        background-color: #4080FF;
                    }
                    .font{
                        .tit{
                            color: #4080FF;
                        }
                    }
                }
                .already2{
                    .cir{
                        background-color: #67C23A;
                    }
                    .font{
                        .tit{
                            color: #67C23A;
                        }
                    }
                }
                .line{
                    position: absolute;
                    width: 4px;
                    height: 188px;
                    background-color: #E4E7ED;
                    left: 11px;
                    top: 10px;
                    z-index: 1;
                }
            }
            .getcard{
                background-color: #E4E7ED;
                font-size: 12px;
                color: $black2;
                border-radius: 14px;
                width: 78px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                cursor: pointer;
            }
        }
    }
</style>

<style>
    .show-order-detail .el-dialog__header{
        background-color: #F2F6FC;
        padding: 10px 20px 10px;
    }
    .show-order-detail .el-dialog__body{
        padding: 0;
        background-color: #F2F6FC;
    }
    .retirement .street .el-input__inner{
        border: 0;
        background-color: transparent;
        width: auto;
        padding-right: 0;
        padding-left: 0;
        display: inline-block;
        max-width: 70%;
    }
    .show-order-detail1 .el-dialog__header{
        background-color: #F2F6FC;
        padding: 0px !important;
    }
    .show-order-detail1 .el-dialog__body{
        padding: 0;
        background-color: #fff;
    }
    .show-order-detail1 .cardlist-pop{
        background-color: #fff;
    }
    .seeBigimg .el-dialog__header{
        background-color: #fff;
    }
    .seeBigimg .bigimg{
        box-sizing: border-box;
        width: 88%;
        padding: 20px 0;
        margin: 0 auto;
    }
    .seeBigimg .bigimg img{
        max-width: 100%;
        max-height: 100%;
    }
    .seeBigimg .el-dialog__body {
        background-color: #fff;
    }
    .seeBigimg .el-carousel__arrow {
        background-color: rgba(31,45,61,0.5);
        font-size: 20px;
    }
    .el-carousel__button{
        background-color: #666;
    }
    .bigimg .el-carousel__item{
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }
    .bigimg .el-carousel__indicators--horizontal{
        display: none !important;
    }
    .show-order-detail.changetheInfo .el-dialog__header,.show-order-detail.changetheInfo .el-dialog__body{
        background-color: #fff;
    }
    .changetheInfo textarea{
        resize: none;
        font: 400 13.3333px Arial;
    }
    .changetheInfo .el-checkbox__inner{
        border-radius: 7px;
    }
    .changetheInfo .el-checkbox{
        width: 100%;
    }
    .cancelTravel .el-textarea__inner{
        resize: none;
        font: 400 13.3333px Arial;
    }
</style>


