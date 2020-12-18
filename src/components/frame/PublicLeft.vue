<template>
    <div class="public-left">
        <ul class="tabbar">
            <li>
                <router-link to="/retireIndex">
                    <img src="@/assets/tabbar1.png" alt="退休人员"><p>退休人员</p>
                </router-link>
            </li>
            <li>
                <router-link to="/activeIndex">
                    <img src="@/assets/tabbar2.png" alt="旅游报名"><p>活动</p>
                </router-link>
            </li>
            <li>
                <router-link to="/cardIndex">
                    <img src="@/assets/tabbar4.png" alt="孝亲卡"><p>孝亲卡</p>
                </router-link>
            </li>
            <li>
                <router-link to="/receiveIndex">
                    <img src="@/assets/tabbar3.png" alt="上门慰问"><p>上门慰问</p>
                </router-link>
            </li>
            <li>
                <router-link to="/visitIndex">
                    <img src="@/assets/tabbar6.png" alt="病人探望"><p>病人探望</p>
                </router-link>
            </li>
            <li>
                <router-link to="/loveIndex">
                    <img src="@/assets/tabbar8.png" alt="爱心逆行"><p>爱心逆行</p>
                </router-link>
            </li>
            <li>
                <router-link to="/echerts">
                    <img src="@/assets/tabbar5.png" alt="统计"><p>统计</p>
                </router-link>
            </li>
            <li>
                <router-link to="/count">
                    <img src="@/assets/tabbar7.png" alt="家孝通消费"><p>家孝通消费</p>
                </router-link>
            </li>
            <li>
                <router-link to="/trivalIndex">
                    <img src="@/assets/tabbar2.png" alt="旅游报名"><p>旅游</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .public-left{
        width: 150px;
        background-color: #fff;
        box-shadow: 1px 1px 14px rgba(36, 65, 109, 0.13);
        overflow: auto;
        height: 100%;
        flex-shrink: 0;
        ul{
            width: 80px;
            margin: 0 auto;
            margin-top: 30px;
            li{
                width: 80px;
                height: 80px;
                background-color: #fff;
                border-radius: 4px;
                margin-bottom: 30px;
                font-size: 14px;
                color: $black;
                text-align: center;
                a{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                img{
                    width: 33px;
                    margin-top: 10px;
                }
                p{
                    color: #333;
                }
            }
            .router-link-active{
                background-color: #F5F7FA;
            }
        }
    }
</style>



