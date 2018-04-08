import Vue from 'vue'
import Router from 'vue-router'
import haha from '@/components/haha'
import foo from '@/components/foo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/haha',
      name: 'haha',
      component: haha
    },
    {
      path: '/foo/:id',
      name: 'foo',
      component: foo
    },
  ]
})
