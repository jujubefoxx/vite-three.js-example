import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from '../router/index.js'

const app = createApp(App)
//整个应用支持路由。
app.use(router)
app.mount('#app')
