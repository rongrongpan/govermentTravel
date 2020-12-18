<template>
    <el-dialog
        class="tosign-pop"
        title=""
        :visible.sync="leavePop"
        width="380px"
        :close-on-click-modal="showClose"
        :show-close="showClose"
        :before-close="handleClose"
        center>
        <div class="sign-success">
            <p class="status">
                <img src="@/assets/fail.png" alt="验证通过">是否离开当前页面
            </p>
            <p class="num">离开后，该页面数据将不会保留</p>
        </div>
        
        <span slot="footer" class="dialog-footer">
            <el-button class="btn kon" round type="primary" @click="handleClose(0)">离开</el-button>
            <el-button class="btn" round type="primary" @click="handleClose(1)">留下</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props:['leavePop'],
    data(){
        return{
            showClose:false
        }
    },
    methods:{
        handleClose(type) {
            this.$emit('childChange',type); 
        }
    }
}
</script>

<style lang="scss" scoped>
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
    .address-pop .el-dialog__header{
        padding-top: 15px;
    }
    .tosign-pop .sign-success{
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
    .tosign-pop .btn{
        width: 77px;
        height: 28px;
        font-size: 12px;
        padding: 0 !important;
        text-align: center;
        background-color: $myblue;
    }
    .tosign-pop .btn.kon{
        background-color: transparent;
        border-color: #F9496C;
        color: #F9496C;
    }
</style>


