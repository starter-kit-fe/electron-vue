import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // 使用hash 路由解决 electron 刷新空白问题 
    history: createWebHashHistory(import.meta.env.VITE_APP_BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/home/index.vue'),
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/about/index.vue'),
        },
        { path: "/:pathMatch(.*)*", redirect: "/" },

    ],
})

export default router
