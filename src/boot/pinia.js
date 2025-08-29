// src/boot/pinia.ts
import { createPinia } from 'pinia';
import { boot } from 'quasar/wrappers';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
export default boot(function (_a) {
    var app = _a.app;
    console.log('Quasar Boot: Initializing Pinia...');
    var pinia = createPinia();
    pinia.use(piniaPluginPersistedstate); // Daftarkan plugin persistensi
    console.log('Pinia Persistedstate plugin registered.');
    app.use(pinia);
    console.log('Pinia initialized and attached to app.');
});
