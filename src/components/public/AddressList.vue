<template>
    <ul class="addressList">
        <li v-for="(item,index) in addressData" :key="item.id+index" @click="selectAddress(item.title,item.location,item.address)">
            <p class="name">{{item.title}}</p>
            <p class="detail">{{item.address}}</p>
        </li>
    </ul>
</template>
<script>
export default {
    props:['addressData'],
    methods:{
        selectAddress(name,location,detail){
            this.$emit('changeAddressVal',{name,location,detail})
        }
    }
}
</script>
<style lang="scss" scoped>
    .addressList{
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        max-height: 300px;
        overflow: auto;
        background-color: #fff;
        li{
            width: 100%;
            margin-bottom: 18px;
            border-bottom: 1px solid #DCDFE6;
            padding-bottom: 6px;
            cursor: pointer;
            .name{
                font-size: 14px;
                font-weight: bold;
                color: $black;
                line-height: 20px;
            }
            .detail{
                font-size: 12px;
                color: $black1;
                line-height: 20px;
            }
        }
        li:last-of-type{
            border-bottom: 0;
            padding-bottom: 0;
            margin-bottom: 0;
        }
    }
</style>

