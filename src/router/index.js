import { createWebHistory, createRouter } from 'vue-router';

import Welcome from '@/views/Welcome.vue';
import List from '@/views/List.vue';

const routes = [
    {
        path: '/',
        redirect: '/Welcome',
    },
    {
        path: '/Welcome',
        name: 'Welcome',
        component: Welcome,
    },
    {
        path: '/List',
        name: 'List',
        component: List,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
