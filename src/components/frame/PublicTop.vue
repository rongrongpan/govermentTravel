<template>
    <div class="publicTop-wrapper">
        <div class="public-top">
            <div class="leftlogo"><img class="logo" src="@/assets/logo.png" alt=""> 企退人员管理系统</div>
            <div class="myinfo" v-document-click="closeThis">
                <div class="myimg myimginfo">{{userName}}</div>
                <div class="myname overhid">{{$store.state.userInfo.name}}</div>
                <div class="changePassword" v-show="showPass">
                    <router-link :to="{name:'password'}" tag="p">修改密码</router-link>
                    <p class="loginout" @click="loginOut">退出</p>
                </div>
            </div>
        </div>
        <div class="public-top-h"></div>
    </div>
</template>
<script>
import api from '@/api/index.js'
export default {
    data(){
        return{
            showPass:false,
            userName:'Y'
        }
    },
    methods:{
        closeThis(e){
            if(e.target.className=='changePassword'){
                return
            }
            if(e.target.className=='myimg myimginfo'){
                this.showPass = true;
                return;
            }
            this.showPass = false;
            
        },
        loginOut(){
            this.saveCookie("userInfo", '',-1);
            api.loginOut().then(res=>{
                let that = this;
                if(res.data.code==0){
                    this.$message({
                        center:true,
                        duration:1000,
                        message: res.data.msg,
                        type: 'success',
                        onClose(){
                            that.$router.push({name:'login'});
                        }
                    });
                    
                }else{
                    this.$reMessage(res.data.msg,'error');
                }
            })
        },
        saveCookie(cookieName,cookieValue,cookieDates){
            let d = new Date();
            d.setDate(d.getDate()+cookieDates);
            document.cookie = cookieName+"="+cookieValue+";expires="+d.toGMTString();
        }
    },
    created(){
        if(this.$store.state.userInfo.name){
            this.userName = this.$store.state.userInfo.name.slice(0,1);
        }
    }
}
</script>
<style lang="scss" scoped>
    .public-top{
        width: 100%;
        height: 60px;
        background-color: #fff;
        box-shadow: 1px 1px 14px rgba(36,65,109,.13);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px;
        color: #333;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 101;
        .myinfo{
            display: flex;
            align-items: center;
            position: relative;
            .myimg{
                width: 31px;
                height: 31px;
                border-radius: 50%;
                overflow: hidden;
                background-color: #1060FF;
                font-size: 16px;
                margin-right: 10px;
                font-size: 20px;
                text-align: center;
                line-height: 31px;
                color: #fff;
                font-weight: bold;
                cursor: pointer;
                img{
                    width: 100%;
                }
            }
            .myname{
                max-width: 100px;
            }
            .changePassword{
                position: absolute;
                width: 95px;
                border-radius: 4px;
                border: 1px solid #E4E7ED;
                font-size: 14px;
                box-sizing: border-box;
                padding: 10px 0px 10px 20px;
                padding-right: 0;
                line-height: 30px;
                background-color: #fff;
                right: 0px;
                top: 36px;
                box-shadow: 1px 0px 10px #E4E7ED;
                p{
                    cursor: pointer;
                }
                .loginout{
                    color: #FDA931;
                }
            }
        }
    }
    .public-top-h{
        width: 100%;
        height: 60px;
    }
    .public-top .leftlogo{
        font-size: 16px;
        .logo{
            width: 38px;
            margin-top: 5px;
        }
    }
</style>

