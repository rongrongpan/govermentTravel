<template>
    <div class="hasnone">
        <div class="img">
            <img src="@/assets/none.png" alt="暂时没有数据哦！">
        </div>
        <p>空空如也～</p>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .hasnone{
        width: 100%;
        text-align: center;
        padding-top: 130px;
        padding-bottom: 40px;
        .img{
            width: 147px;
            height: 147px;
            border-radius: 50%;
            margin: 0 auto;
            background-color: #F5F7FA;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: 79px;
            }
        }
        p{
            font-size: 13px;
            margin-top: 12px;
            color: #B0B0B0;
        }
    }
</style>


