import axios from '@/api/axios.js'
import Promise from 'promise-polyfill';
// To add to window  解决promise 在ie中未定义的问题
if (!window.Promise) {
  window.Promise = Promise;
}
// /test/api/yueyilan
const api = {
  //登录
  getLogin (params) {
    return axios.post('/manager/login', params)
  },
  //登出
  loginOut(params){
    return axios.get('/manager/logout', {params})
  },
  //修改密码
  changePass(params){
    return axios.post('/manager/passwd', params)
  },
  //退休人员列表
  getRetireList(params){
    return axios.get('/retiree/', {params})
  },
  //退休人员信息
  getRetireXq(params){
    return axios.get('/retiree/'+params.id)
  },
  //消费记录
  getShopList(params){
    return axios.get('/retiree/consume/'+params.id,{params})
  },
  //上门慰问商品列表
  getPackage(params){
    return axios.get('/condolence/package',{params})
  },
   //小型多样化活动列表
   getPackageActive(params){
      return axios.get('/similar/activity/similar/merchandise/list',{params})
    },
  //慰问套餐商品详情
  getPackageXq(params){
    return axios.get('/condolence/package/'+params.id, {params})
  },
  //查询慰问订单列表
  getPackageList(params){
    return axios.get('/condolence/list',{params})
  },
  //查询小型多样化活动列表
  getPackageListActive(params){
    return axios.get('/similar/activity/similarHome/list',{params})
  },
  //上门慰问验证
  toTest(params){
    return axios.get('/condolence/package/verification',{params})
  },
  //探望验证
  toTestVisit(params){
    return axios.get('/visit/orders/verification',{params})
  },
  //旅游路线列表
  getTravelList(params){
    return axios.get('/travel/'+params.year,{params})
  },
  //活动列表
  getActiveList(params){
    return axios.get('/retirement/activity/'+params.year)
  },
  //旅游路线详情
  getTravelXq(params){
    return axios.get('/travel/main/'+params.id)
  },
  //活动详情
  getActiveXq(params){
    return axios.get('/retirement/activity/main/'+params.id)
  },
  //孝亲卡申领列表
  getXiaoqinList(params){
    return axios.get('/xiaoqin/list',{params})
  },
  //消费记录详情
  getListXq(params){
    return axios.get('/retiree/detail/'+params.id,{params})
  },
  //修改活动报名订单信息
  changeActive(params){
    return axios({
      url:'/retirement/activity/order',
      method: 'PUT',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //修改旅游报名订单信息
  changeTrival(params){
    return axios({
      url:'/travel/order',
      method: 'PUT',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  // 订单完成
  toPass(params){
    return axios({
      url:'/retirement/activity/finish/one/'+params.orderId,
      method: 'PUT',
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  // 全部订单完成
  allToPass(params){
    return axios({
      url:'/retirement/activity/allorder/'+params.activityId,
      method: 'PUT',
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //活动报名
  activeSign(params){
    return axios({
      url:'/retirement/activity/order',
      method: 'POST',
      data:params.retirementActivityCreateDTO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  // 旅游报名统计
  travelList(params){
    return axios.get('/travel/registrationstatistics',{params})
  },
   // 活动报名统计
   activeList(params){
    return axios.get('/retirement/activity/registrationstatistics',{params})
  },
  //旅游活动详情
  travelXq(params){
    return axios.get('/travel/order/'+params.id)
  },
  //活动详情
  activeXq(params){
    return axios.get('/retirement/activity/order/'+params.id)
  },
  //取消活动报名
  cancelActive(params){
    return axios.delete('/retirement/activity/order/'+params.id,{params})
  },
  //取消活动报名
  cancelTrival(params){
    return axios.delete('/travel/order/'+params.id,{params})
  },
  //创建上门慰问订单
  createOrder(params){
    return axios.get('/condolence/order'+params.id+'&reason='+params.reason,)
  },
  //病人探望详情
  getVisitXq(params){
    return axios.get('/visit/orders/'+params.id)
  },
  //病人探望订单列表、
  getVisitList(params){
    return axios({
      url:'/visit/orders/list',
      method: 'post',
      data:params.orderVisitSearchDTO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //创建上门慰问订单
  createReceive(params){
    return axios({
      url:'/condolence/order',
      method: 'PUT',
      data:params.orderVisitCreateDTO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //创建小型多样化活动订单
  createReceiveActive(params){
    return axios({
      url:'/similar/activity/order/activity',
      method: 'PUT',
      data:params.orderVisitCreateDTO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //创建爱心逆行订单
  createLove(params){
    return axios({
      url:'/visit/orders',
      method: 'post',
      data:params.orderVisitAddDTO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //创建病人探望订单
  createVisit(params){
    return axios({
      url:'/visit/orders/patient',
      method: 'post',
      data:params.orderVisitAddDTO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //孝亲卡申领详情
  getCardXq(params){
    return axios.get('/xiaoqin/'+params.id)
  },
  //申请孝亲卡
  toCreatCard(params){
    return axios({
      url:'/xiaoqin/claim',
      method: 'post',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //查看数据展示详情
  getCountXq(params){
    return axios.get('appconsume/'+params.id)
  },
  //领取卡片
  toGetCard(params){
    return axios({
      url:'/xiaoqin/receive',
      method: 'PUT',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  // 获取批量创建的列表
  getCreateNumber(params){
    return axios.get('/excel/retiree/'+params.id)
  },
  //批量创建订单
  createNumbers(params){
    return axios({
      url:'/excel/order',
      method: 'POST',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //家孝通消费列表
  appComsumeList(params){
    return axios.get('/appconsume/',{params})
  },
  //家孝通数据展示
  appComsumeData(params){
    return axios.get('/appconsume/data/'+params.yearDate)
  },
  //编辑退休人员信息
  editRetire(params){
    return axios({
      url:'/retiree/'+params.id,
      method: 'PUT',
      data:params.retireeUpdateVO,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //添加外籍老人
  addCountry(params){
    return axios({
      url:'/retiree',
      method: 'POST',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  //企退系统消费统计
  webConsume(params){
    return axios.get('/webconsume/datashow',{params})
  },
  //回执单
  getPdf(params){
    return axios.get('/excel/inportpdf',{params})
  },
  //修改订单信息
  changeOrderInfo(params){
    return axios({
      url:'/condolence/order',
      method: 'POST',
      data:params,
      headers:{
				'Content-Type':'application/json'
			}
    })
  },
  // 活动回执单打印
  activePdf(params){
    return axios.get('/retirement/activity/pdf/export/'+params.orderId)
  },
  //获取卡号
  getCardNumber(){
    return axios.get('/xiaoqin/random/card')
  },
  //孝亲卡数据统计
  getCardData(params){
    return axios.get('/xiaoqin/card/statistics',{params})
  }
}

export default api