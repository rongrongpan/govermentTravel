import Vue from 'vue'
import Router from 'vue-router'

import Formal from '@/components/frame/Formal'
import Login from'@/components/login/Login'
import PassWord from '@/components/login/ChangePassword'
// 退休人员
import RetireIndex from '@/components/retire/Index'
import Retirement from '@/components/retire/Retirement'
import Retirexq from '@/components/retire/Retirexq'
// 旅游
import TrivalIndex from '@/components/trival/Index'
import Trival from '@/components/trival/TrivalList'
import Trivalxq from '@/components/trival/Trivalxq'
// 活动
// import ActiveIndex from '@/components/active/Index'
// import Active from '@/components/active/TrivalList'
// import Activexq from '@/components/active/Trivalxq'
// import CreateActive from '@/components/active/CreateTravel'
import ActiveIndex from '@/components/receiveActive/Index'
import Active from '@/components/receiveActive/Receivelist'
import MakeActive from '@/components/receiveActive/Makesure'
import ActiveList from '@/components/receiveActive/ReceiveHistory'
// 上门慰问
import ReceiveIndex from '@/components/receive/Index'
import Receivelist from '@/components/receive/Receivelist'
import Makesure from '@/components/receive/Makesure'
import ReceiveHistory from '@/components/receive/ReceiveHistory'
// 孝亲卡
import CardIndex from '@/components/mycard/Index'
import Cardlist from '@/components/mycard/Cardlist'
import Getcard from '@/components/mycard/GetCard'
// 统计
import Count from '@/components/count/Count'
import Echerts from '@/components/count/Echerts'
// 病人探望
import VisitIndex from '@/components/visit/Index'
import Visit from '@/components/visit/VisitList'
import CreateVisit from '@/components/visit/CreateVisit'

//爱心逆行
import LoveIndex from '@/components/loveService/Index'
import LoveList from '@/components/loveService/VisitList'
import CreateLove from '@/components/loveService/CreateVisit'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'formal',
      component: Formal,
      redirect: 'retireIndex',
      children:[
        {
          path:'retireIndex',
          name:'retireIndex',
          component:RetireIndex,
          redirect: 'retireIndex/retirement',
          children:[
            {
              path:'retirement',
              name:'retirement',
              component:Retirement
            },
            {
              path:'retirexq/:id',
              name:'retirexq',
              component:Retirexq
            }
          ]
        },
        {
          path:'trivalIndex',
          name:'trivalIndex',
          component:TrivalIndex,
          redirect:'trivalIndex/trival',
          children:[
            {
              path:'trival',
              name:'trival',
              component:Trival
            },
            {
              path:'trivalxq',
              name:'trivalxq',
              component:Trivalxq
            }
          ]
        },
        {
          path:'activeIndex',
          name:'activeIndex',
          component:ActiveIndex,
          redirect:'activeIndex/active',
          children:[
            {
                path:'active',
                name:'active',
                component:Active
            },
            {
              path:'makeactive',
              name:'makeactive',
              component:MakeActive
            },
            {
                path:'activeList',
                name:'activeList',
                component:ActiveList
            }
          ]
        },
        {
          path:'receiveIndex',
          name:'receiveIndex',
          component:ReceiveIndex,
          redirect:'receiveIndex/receivelist',
          children:[
            {
              path:'receivelist',
              name:'receivelist',
              component:Receivelist
            },
            {
              path:'makesure',
              name:'makesure',
              component:Makesure
            },
            {
              path:'receiveHistory',
              name:'receiveHistory',
              component:ReceiveHistory
            }
          ]
        },
        {
          path:'cardIndex',
          name:'cardIndex',
          component:CardIndex,
          redirect:'cardIndex/cardlist',
          children:[
            {
                path:'cardlist',
                name:'cardlist',
                component:Cardlist
            },
            {
                path:'getcard',
                name:'getcard',
                component:Getcard
            }
          ]
        },
        {
          path:'visitIndex',
          name:'visitIndex',
          component:VisitIndex,
          redirect:'visitIndex/visit',
          children:[
            {
              path:'visit',
              name:'visit',
              component:Visit
            },
            {
              path:'createVisit',
              name:'createVisit',
              component:CreateVisit
            }
          ]
        },
        {
          path:'loveIndex',
          name:'loveIndex',
          component:LoveIndex,
          redirect:'loveIndex/loveList',
          children:[
            {
              path:'loveList',
              name:'loveList',
              component:LoveList
            },
            {
              path:'createLove',
              name:'createLove',
              component:CreateLove
            }
          ]
        },
        {
          path:'/count',
          name:'count',
          component:Count,
        },
        {
          path:'/echerts',
          name:'echerts',
          component:Echerts,
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/password',
      name:'password',
      component:PassWord
    },
    {path:'*',redirect:'/retireIndex'}
  ]
})