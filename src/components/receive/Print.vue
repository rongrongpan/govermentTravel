<template>
<div class="wra-print">

    <el-dialog
        class="tosign-pop"
        title=""
        :visible.sync="openTheTime"
        :before-close="closeTime"
        width="500px"
        center>
        <div class="timeSelect">
            <p class="title">{{info.userName}} <span>{{info.userIdcard}}</span></p>
            <p class="title bottom">{{info.packageItemDTO?info.packageItemDTO.packageName:info.activityTitle}}</p>
            <p class="tit">设置回执单时间：</p>
            <div class="time" v-if="info.createTime">
                <el-date-picker
                    v-model="printDate"
                    type="date"
                    :clearable="false"
                    placeholder="选择日期">
                </el-date-picker>
                <el-time-picker
                    v-model="printTime"
                    :clearable="false"
                    :picker-options="{
                    selectableRange: '08:00:00 - 18:00:00'
                    }"
                    placeholder="任意时间点">
                </el-time-picker>
            </div>
            <a style="display:none;" target="_blank" id="down2" href="http://www.yueyilan.com/img-yueyilan/pdf/%E5%9B%9E%E6%89%A7%E5%8D%95.pdf" download="回执单.pdf">回执单</a>
            <a style="display:none;" target="_blank" id="down3" href="http://www.yueyilan.com/img-yueyilan/pdf/%E6%B4%BB%E5%8A%A8%E5%9B%9E%E6%89%A7%E5%8D%95.pdf" download="回执单.pdf">回执单</a>
            
            <div class="footer">
                <el-button type="primary" @click="toPrint">确定打印</el-button>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import api from '@/api/index';
export default {
    props:['info','openTheTime'],
    data(){
        return{
            printDate:new Date(this.info.createTime),
            printTime:new Date()
        }
    },
    computed:{
        changeDate(){
            let date = new Date(this.printDate);
            return date.getFullYear() +'-'+(date.getMonth()+1)+'-'+date.getDate()
        },
        endDate(){
            let date = new Date(this.printDate).getTime()+ 15*24*60*60*1000;
            let date1 = new Date(date);
            return date1.getFullYear() +'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'
        },
        changeTime(){
            let date = new Date(this.printTime);
            return date.getHours() +' ：'+(date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes())+' ：'+(date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds())
        }
    },
    watch:{
        info(){
           this.printDate = new Date(this.info.createTime)
        }
    },
    methods:{
        closeTime(){
            this.$emit('closeTheTime');
        },
        toPrint(){
            let address = '';
            if(this.info.housingEstate==='劳动路社区'){
                address = '荷花池头30号，联系电话：87020191';
            }else if(this.info.housingEstate==='清波门社区'){
                address = '蔡官巷35号，联系电话：87021508';
            }else if(this.info.housingEstate==='定安路社区'){
                address = '后市街125号，联系电话：87821380';
            }else if(this.info.housingEstate==='清河坊社区'){
                address = '太平坊巷3号，联系电话：87921214';
            }else if(this.info.housingEstate==='柳翠井巷社区'){
                address = '光复路50号，联系电话：87814132';
            }
            address = address + '， 周一至周五 9：00-16：00 （自提截止日期'+this.endDate+'）';
            if(this.info.activityTitle){
                api.activePdf({
                    orderId:this.info.id
                }).then(res=>{
                    if(res.data.code===0){
                        let a = document.getElementById('down3');
                        a.click();
                        this.$emit('closeTheTime');
                    }else{
                        this.$reMessage(res.data.msg,'error');
                    }
                })
            }else{
                api.getPdf({
                    activityForm:this.info.packageItemDTO.packageName,
                    date:this.changeDate,
                    personallyAddress:address,
                    orderId:this.info.id,
                    time:this.changeTime
                }).then(res=>{
                    if(res.data.code===0){
                        let a = document.getElementById('down2');
                        a.click();
                        this.$emit('closeTheTime');
                    }else{
                        this.$reMessage(res.data.msg,'error');
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.timeSelect{
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        text-align: left;
        .title{
            font-size: 14px;
            color: $black;
            margin-bottom: 5px;
            span{
                margin-left: 20px;
            }
        }
        .title.bottom{
            margin-bottom: 20px;
        }
        .tit{
            font-size: 12px;
            color: $black1;
            margin-bottom: 10px;
        }
        .time{
            width: 100%;
            display: flex;
            justify-content: space-between;
            .el-input{
                width: 190px;
            }
        }
        .footer{
            width: 100%;
            display: flex;
            justify-content: center;
            .el-button{
                width: 120px;
                margin-top: 40px;
                margin-bottom: 20px;
            }
        }
    }
</style>