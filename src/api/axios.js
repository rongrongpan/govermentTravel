import axios from 'axios';
import router from '../router';

var instance = axios.create({
  // baseURL:'/apis',
  baseURL: '/api/retirement',
  headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}

})

instance.interceptors.request.use(function (config) {
  if (config.method == 'post') {
    config.url = config.url+'?time='+Date.parse(new Date()) / 1000
  } else if (config.method == 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
// 对请求错误做些什么
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code==40005){
    router.replace({name:'login'})
  }
  return response;
}, function (error) {
  if(error.message.includes('timeout')){
    alert("网络超时");
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance


// header: { 'Content-Type': 'application/json' }
// headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}