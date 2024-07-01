import { createApp } from 'vue';
import './style.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import router from './router';
import pinia from './store';
import "./tailwindcss.css"

createApp(App).use(pinia).use(router).use(Antd).mount('#app');
