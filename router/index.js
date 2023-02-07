import {createRouter, createWebHistory} from "vue-router";
// 1. 定义路由组件.
import home from "@/home/index.vue";
import {exampleRouter} from "@/example/index.js"

// 2. 定义一些路由
const routes = [
    {
        path: '/',
        component: home
    },
    {
        path: '/example',
        children: exampleRouter
    }
]
// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。
    history: createWebHistory(),
    routes
})

export default router;