import Vue from 'vue'
import Router from 'vue-router'
import Checklist from '../components/CheckList'
import Roadpage from '../components/Roadpage'

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
      path: '/abstract',
      name: 'Abstract',
      component: Checklist
    }
  ],
  linkExactActiveClass:'active'
})
