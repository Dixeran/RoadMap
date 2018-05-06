import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Roadpage from '@/components/Roadpage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Roadpage',
      component: Roadpage,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/setting',
      name: 'Setting',
      component: HelloWorld
    }
  ]
})
