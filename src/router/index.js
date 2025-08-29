import { defineRouter } from '#q-app/wrappers';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory, } from 'vue-router';
import routes from './routes.ts';
export default defineRouter(function ( /* { store, ssrContext } */) {
    var createHistory = process.env.SERVER
        ? createMemoryHistory
        : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);
    var Router = createRouter({
        scrollBehavior: function () { return ({ left: 0, top: 0 }); },
        routes: routes,
        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });
    return Router;
});
