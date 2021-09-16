import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import ShoppingCar from '@/views/codewhy/购物车案例'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      name: 'ShoppingCar',
      component: ShoppingCar
    }
  ]
})
