<template>
    <div class="login-wrapper">
        <div class="login-top">
            <div class="rightlogin">
                <div class="welcome"><img src="@/assets/logo.png" alt=""><span>企退人员管理系统</span></div>

                <div v-if="$store.state.userInfo.count==0" class="logindesc">
                    <p class="wel">你好，新人！</p>
                    <p>初次登陆需要修改密码</p>
                </div>
                <div v-else  class="logindesc">
                    <p class="wel">修改密码</p>
                    <p>请设置自己容易记住的密码</p>
                </div>

                <div class="password">
                    <el-input minlength="6" maxlength="12" class="passname" v-model="inputPassword" placeholder="请输入新密码" show-password></el-input>
                    <el-input minlength="6" maxlength="12" class="password" placeholder="请再次输入新密码" v-model="inputPassword1" show-password></el-input>
                    <el-button class="submit" type="primary" @click="submitLogin">确定</el-button>
                    <p class="phone">TEL：96033</p>
                </div>

            </div>
        </div>
        <div class="webinfo">CopyRight©1692019yueyil</div>
    </div>
</template>

<script>
import api from '@/api/index.js'
import { hexMD5 } from "@/md5.js"
import qs from 'qs';
import commonJs from '@/common.js';
export default {
    data(){
        return{
            inputPassword:'',
            inputPassword1:'',
            remmber:[]
        }
    },
    methods:{
        submitLogin(){
            let pass = hexMD5(this.inputPassword + '...sadHJD34jijfjI_/}');
            if(!this.inputPassword || !this.inputPassword1){
                this.$reMessage('密码不能为空！','error');
            }else if(this.inputPassword != this.inputPassword1){
                this.$reMessage('两次密码不一致！','error');
            }else if(this.inputPassword.length<6 || this.inputPassword1.length<6){
                this.$reMessage('请输入6-12位密码！','error');
            }else{
                let that = this;
                api.changePass(qs.stringify({id:this.$store.state.userInfo.id,passwd:pass})).then(res=>{
                   commonJs.saveCookie("userName", '',-1);
                   commonJs.saveCookie("passWord", '',-1);
                   that.$message({
                        center:true,
                        duration:1000,
                        message: '修改成功！',
                        type: 'success',
                        onClose(){
                            if(that.$store.state.userInfo.count){
                                that.$router.go(-1);
                            }else{
                                that.$router.replace({name:'retirement'});
                            }
                        }
                    }); 
                })
            }      
        }
    },
    created(){
        
    }

}
</script>

<style lang="scss" scoped>
    .login-wrapper{
        width: 454px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        .login-top{
            background-color: #fff;
            box-shadow: 0px 7px 35px 0px rgba(36,65,109,.13);
            width: 100%;
            height: 670px;
        }
        .rightlogin{
            width: 380px;
            margin-left: 36px;
            margin-top: 78px;
            display: inline-block;
            .welcome{
                font-size: 20px;
                color: $black;
                line-height: 40px;
                height: 57px;
                img{
                    width: 57px;
                    margin-right: 8px;
                    vertical-align: top;
                    margin-left: -12px;
                }
            }
            .logindesc{
                font-size: 15px;
                color: $black;
                margin-top: 36px;
                .wel{
                    font-size: 22px;
                    margin-bottom: 5px;
                }
            }
            .password{
                margin-top: 36px;
                .passname{
                    margin-bottom: 20px;
                }
                .password{
                    margin-top: 0;
                }
                .submit{
                    margin-left: 285px;
                    margin-top: 30px;
                }
                .phone{
                    font-size: 15px;
                    color: #999;
                    margin-top: 127px;
                }
                .el-button--primary{
                    width: 95px;
                    height: 40px;
                    border: 0;
                }
                .justgo{
                    width: 95px;
                    margin-left: 285px;
                    font-size: 14px;
                    color: #C0C4CC;
                    text-align: center;
                    line-height: 40px;
                    cursor: pointer;
                }
            }
        }
        .webinfo{
            font-size: 14px;
            color: $black3;
            text-align: center;
            margin-top: 40px;
            letter-spacing: 2px;
        }
    }
</style>


