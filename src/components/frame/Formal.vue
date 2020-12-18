<template>
    <div class="page-container">
        <PublicTop />
        <div class="sonPage">
            <PublicLeft/>
            <div class="sonPagecontent">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import PublicTop from './PublicTop';
import PublicLeft from './PublicLeft';
export default {
    components:{
        PublicTop,
        PublicLeft
    }
}
</script>
<style lang="scss" scoped>
.page-container{
    width: 100%;
    height: 100%;
    .sonPage{
        background-color: transparent;
        position: relative;
        background-color: #fff;
        width: 100%;
        height: calc(100% - 60px);
        display:flex;
        .sonPagecontent{
            width: calc(100% - 178px);
            height: calc(100% - 18px);
            margin-left: 18px;
            margin-top: 18px;
            border-top:1px solid #DCDFE6;
            border-left:1px solid #DCDFE6;
            border-right:1px solid #DCDFE6;
            background-color: #fff;
            box-sizing: border-box;
            padding: 25px;
            overflow: hidden;
            padding-bottom: 0;
        }
    }
}
</style>

