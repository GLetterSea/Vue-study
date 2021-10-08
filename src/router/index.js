import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import ShoppingCar from '@/views/codewhy/购物车案例'
import propsCommunication from '@/views/codewhy/父子组件通信props/'
import emitCommunication from '@/views/codewhy/父子组件通信emit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/shoppingCar',
      // name: 'HelloWorld',
      name: 'ShoppingCar',
      component: ShoppingCar
    },
    {
      path: '/propsCommunication',
      name: 'propsCommunication',
      component: propsCommunication
    },
    {
      path: '/emitCommunication',
      name: 'emitCommunication',
      component: emitCommunication
    }
  ]
})
