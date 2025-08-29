// src/boot/pinia.ts
import { createPinia } from 'pinia';
import { boot } from 'quasar/wrappers';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default boot(({ app }) => {
  console.log('Quasar Boot: Initializing Pinia...');
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate); // Daftarkan plugin persistensi
  console.log('Pinia Persistedstate plugin registered.');
  app.use(pinia);
  console.log('Pinia initialized and attached to app.');
});
