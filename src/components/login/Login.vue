<template>
    <div class="login-wrapper">
        <div class="login-top">
            <img class="leftimg" src="@/assets/loginimg.png" alt="登录">
            <div class="rightlogin">
                <div class="welcome"><img src="@/assets/logo.png" alt=""><span>企退人员管理系统</span></div>

                <div class="logindesc">
                    <p class="wel">欢迎您来到这里！</p>
                    <p>请输入登录账号密码</p>
                </div>

                <div class="password">
                    <el-input class="passname" v-model="inputName" placeholder="请输入账号"></el-input>
                    <el-input minlength="6" maxlength="12" class="password" placeholder="请输入密码" v-model="inputPassword" show-password></el-input>
                    <el-checkbox class="remmber" v-model="remmber">记住密码</el-checkbox>
                    <el-button class="submit" type="primary" @click="submitLogin">登录</el-button>
                    <p class="phone">TEL：96033</p>
                </div>
            </div>
        </div>
        <div class="webinfo">CopyRight©1692019yueyil</div>
    </div>
</template>

<script>
import api from '@/api/index.js';
import { hexMD5 } from "@/md5.js";
import qs from 'qs';
import commonJs from '@/common.js';
export default {
    data(){
        return{
            inputName:commonJs.getCookie("userName")||'',
            inputPassword:'',
            remmber:(commonJs.getCookie("userName")&&commonJs.getCookie("passWord"))?true:false
        }
    },
    methods:{
        submitLogin(){
            let that = this;
            let pass = hexMD5(this.inputPassword + '...sadHJD34jijfjI_/}');
            if(!this.inputName || !this.inputPassword){
                this.$reMessage('账号或密码不能为空！','error');
            }else if(this.inputPassword.length<6){
                this.$reMessage('请输入6-12位密码！','error');
            }else{
                commonJs.saveCookie("userName", '',-1);
                commonJs.saveCookie("userInfo", '',-1);
                commonJs.saveCookie("passWord", '',-1);
                api.getLogin(qs.stringify({'govAdminName':this.inputName,'govAdminPwd':pass})).then(res=>{
                    if(res.data.code==0){
                        commonJs.saveCookie("userInfo", JSON.stringify(res.data.data.govAdmin),1);
                        commonJs.saveCookie("userName", that.inputName,7);
                        if(this.remmber){
                            let pass = '';
                            that.inputPassword.split('').forEach((ele,index)=>{
                                pass  = pass +ele+Math.floor(Math.random()*10) 
                            })
                            commonJs.saveCookie("passWord", pass,7);
                        }else{
                            commonJs.saveCookie("passWord", '',-1);
                        }
                        that.$store.commit('setInfo',res.data.data.govAdmin);
                        that.$message({
                            center:true,
                            duration:1000,
                            message: '登录成功！',
                            type: 'success',
                            onClose(){
                                if(res.data.data.govAdmin.count){
                                    that.$router.replace({name:'retirement'})
                                }else{
                                    that.$router.replace({name:'password'})
                                } 
                            }
                        });
                    }else{
                        that.$reMessage(res.data.msg,'error');
                    }
                })
            }    
        }
    },
    created(){
        if(commonJs.getCookie("passWord")){
            let pass = commonJs.getCookie("passWord");
            let newpass = '';
            pass.split('').forEach((ele,index)=>{
                if(!(index%2)){
                    newpass+=ele;
                }
            })
            this.inputPassword = newpass;
        }
    }
}
</script>

<style lang="scss" scoped>
    .login-wrapper{
        width: 1054px;
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
        .leftimg{
            width: 437px;
            vertical-align: top;
            height: 670px;
        }
        .rightlogin{
            width: 380px;
            margin-left: 100px;
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
                    margin-bottom: 14px;
                    margin-top: 0;
                }
                .remmber{
                    font-size: 14px;
                    position: relative;
                }
                .submit{
                    margin-left: 285px;
                    margin-top: 30px;
                }
                .phone{
                    font-size: 15px;
                    color: #999;
                    margin-top:127px;
                }
                .el-button--primary{
                    width: 95px;
                    height: 40px;
                    border: 0;
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


