<template>
    <!-- 验证弹窗 -->
    <el-dialog
        class="tosign-pop"
        :title="signStep==1?'资格验证':''"
        :visible.sync="centerDialogVisible"
        width="380px"
        :before-close="closePop"
        center>
        <el-input v-if="signStep==1" class="sendinput" v-model="signInput" placeholder="请输入退休人员身份证号码"></el-input>
        <div class="sign-ing" v-if="signStep==2">
            <i class="el-icon-loading"></i>
            <p>验证中...</p>
        </div>
        <div class="sign-success" v-if="signStep==3">
            <p class="status">
                <img src="@/assets/success.png" alt="验证通过">验证通过
            </p>
            <p class="num">为您查找到一位用户</p>
        </div>
        <div class="sign-success" v-if="signStep==4">
            <p class="status">
                <img src="@/assets/fail.png" alt="验证通过">无法验证通过
            </p>
            <p class="num">{{errorText}}</p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="signStep==1||signStep==4" class="btn" round type="primary" @click="changeParent">{{signStep==1?'验证':'确定'}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import api from '@/api/index'
export default {
    props:['centerDialogVisible','testType','id'], //testType:1孝亲卡申领   2上门慰问  3创建探望安排  4旅游 5爱心服务
    data(){
        return{
            signStep:1,
            signInput:'',
            errorText:''
        }
    },
    methods:{
        changeParent(){
            let that = this;
            this.signInput = this.signInput.trim();
            if(this.signStep == 1){
                    this.signStep = 2;
                    if(that.testType=='3'||that.testType=='5'){
                        api.toTestVisit({idCard:this.signInput}).then(res=>{
                            that.signInput = '';
                            if(res.data.code==0){
                                that.signStep = 3;
                                setTimeout(function(){
                                    that.$router.push({name:that.testType=='3'?'createVisit':'createLove',params:{personinfo:JSON.stringify(res.data.data.retireePubDto)}})
                                },1000)
                            }else{
                                that.signStep = 4;
                                that.errorText = res.data.msg;
                            }
                        })
                        
                    }else{
                        api.toTest({idCard:this.signInput}).then(res=>{
                            that.signInput = '';
                            if(res.data.code==0){
                                that.signStep = 3;
                                setTimeout(function(){
                                        if(that.testType === '2'){
                                        that.$router.push({name:'makesure',params:{id:that.id,personinfo:JSON.stringify(res.data.data.retireePubDto)}})
                                    }else if(that.testType === '6'){
                                        that.$router.push({name:'makeactive',params:{id:that.id,personinfo:JSON.stringify(res.data.data.retireePubDto)}})
                                    }else if(that.testType === '1'){
                                        that.$router.push({name:'getcard',params:{info:JSON.stringify(res.data.data.retireePubDto)}});
                                    }else if(that.testType === '4'){
                                        that.$router.push({name:'createActive',params:{id:that.id,personinfo:JSON.stringify(res.data.data.retireePubDto)}});
                                    }
                                },1000)
                            }else{
                                that.signStep = 4;
                                that.errorText = res.data.msg;
                            }
                        })
                    } 
            }else if(this.signStep == 4){
                this.closePop();
            } 
        },
        closePop(){
            this.$emit('changeCom');
            this.signStep = 1;
        }
    }
}
</script>

<style lang="scss" scoped>
    .tosign-pop{
            .btn{
                width: 77px;
                height: 28px;
                font-size: 12px;
                padding: 0;
                text-align: center;
                background-color: $myblue;
            }
            .sign-ing{
                text-align: center;
                width: 100%;
                i{
                    font-size: 22px;
                    color: $myblue;
                }
                p{
                    margin-top: 10px;
                    font-size: 14px;
                    color: $black1;
                }
            }
            .sign-success{
                text-align: center;
                .status{
                    font-size: 24px;
                    font-weight: bold;
                    img{
                        width: 22px;
                        height: 22px;
                        margin-right: 10px;
                    }
                }
                .num{
                    font-size: 14px;
                    color: $black1;
                    margin-top: 10px;
                }
            }
        }
</style>
<style>
    .tosign-pop .el-dialog__body{
        padding-top: 8px;
        padding-bottom: 20px;
    }
    .tosign-pop .el-dialog__title{
        font-size: 24px;
        font-weight: bold;
    }
    .tosign-pop .el-dialog__footer{
        padding-bottom: 35px;
    }
    .tosign-pop .el-dialog__header{
        padding-top: 35px;
    }
</style>



