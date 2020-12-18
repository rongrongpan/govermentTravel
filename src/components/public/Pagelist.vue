<template>
    <div class="pagelist">
        <div class="page">
            <el-pagination
            :page-size="pagesize"
            :current-page="current"
            background
            @current-change="pageChange"
            layout="total,prev, pager, next"
            :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props:['totalPage','pagesize','current'],
    data(){
        return{

        }
    },
    methods:{
        pageChange(e){
            this.$emit('changePage',e);
        }
    }

}
</script>
<style lang="scss">
.el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: $myblue;
}
.pagelist{
    width: 100%;
    height: 60px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

