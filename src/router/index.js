import { createWebHistory, createRouter } from 'vue-router';

import Welcome from '@/views/Welcome.vue';
import List from '@/views/List.vue';
import Liti from '../views/Liti.vue';

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
    {
        path: '/3d',
        name: '3d',
        component: Liti,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
