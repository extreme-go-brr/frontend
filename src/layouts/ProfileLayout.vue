<template>
  <div>
    <!-- Preloader untuk pemuatan aplikasi awal -->
    <div v-if="showPreloader" class="preloader flex flex-center" >
      <q-circular-progress
        show-value
        font-size="16px"
        :value="progressValue"
        size="84px"
        :thickness="0.22"
        color="primary"
        track-color="grey-3"
        class="q-ma-md"
      >
        {{ progressValue }}%
      </q-circular-progress>
    </div>

    <!-- Layout Utama, terlihat setelah preloader -->
    <q-layout view="hHh lpR lff" v-if="!showPreloader" style="background-color: var(--q-body-background);">

<AppHeader />
      <!-- Container Konten Halaman -->
      <q-page-container >
      <div class="row justify-center " style="gap: 50px; padding-top: 150px;">
<div class="col-12 col-md-2">
        <q-card style="background-color: var(--q-item-background);">
          <q-list class="profile-menu-list">
            <q-item clickable v-ripple class="profile-header-item">
              <q-item-section avatar class="q-ma-sm">
                <q-avatar size="75px">
                  <img
                    :src="
                      preview ||
                      (user?.profile?.url
                        ? baseUrl + user.profile.url
                        : '/img/default-profile.png')
                    "
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6 text-weight-bold text-dark-blue" v-if="user">{{
                  user.username
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-expansion-item
              expand-separator
              icon="shopping_bag"
              label="Purchase"
              class="profile-menu-item"
              :class="{ 'active-menu-item': activeMenu === 'purchase' }"
              @click="activeMenu = 'purchase'"
            >
              <q-list dense class="sub-menu-list">
                <q-item clickable v-ripple class="sub-menu-item" to="/profile/transaksi">
                  <q-item-section>list of transactions</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-separator />

            <q-expansion-item
              expand-separator
              icon="notifications"
              label="Notification"
              class="profile-menu-item"
              :class="{ 'active-menu-item': activeMenu === 'notification' }"
              @click="activeMenu = 'notification'"
            >
              <q-list dense class="sub-menu-list">
                <q-item clickable v-ripple class="sub-menu-item" to="/profile/SystemNotif">
                  <q-item-section>System Notification</q-item-section>
                </q-item>
                <q-item clickable v-ripple class="sub-menu-item" to="/profile/PromotionalNotif">
                  <q-item-section>Promotional Offers</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-separator  />

           <q-expansion-item
              expand-separator
              icon="person"
              label="My Profile"
              class="profile-menu-item"
              :class="{ 'active-menu-item': activeMenu === 'profile' }"
              @click="activeMenu = 'purchase'"
            >
              <q-list dense class="sub-menu-list">
                <q-item clickable v-ripple class="sub-menu-item" to="/profile/Data">
                  <q-item-section>My Account</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

          </q-list>
        </q-card>
      </div>
      <router-view />
      </div>
    </q-page-container>

 <AppFooter />

    </q-layout>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  provide,
  inject,
  watch,
  onBeforeUnmount,
  watchEffect,

} from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user-stores'; // Pastikan path ini benar
import { storeToRefs } from 'pinia';

const $q = useQuasar();
const preview = ref<string | null>(null);
const userStore = useUserStore();
const activeMenu = ref('');
const { user } = storeToRefs(userStore); // Gunakan storeToRefs untuk user dan isLoggedIn yang reaktif
const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const hideHeader = ref(false);
let lastScroll = 0;
const isDarkMode = ref(false);


// Import the new components
import AppHeader from 'src/components/AppHeader.vue';
import AppFooter from 'src/components/AppFooter.vue';
onMounted(async () => {
  await userStore.fetchUser();

  if (user?.value) {
    if (user.value.profile?.url) {
      preview.value = baseUrl + user.value.profile.url;
    } else {
      preview.value = '/img/default-profile.png';
    }
  } else {
    console.log('User data not available after fetchUser.');
  }

  const storedTheme = localStorage.getItem('theme');
  isDarkMode.value = storedTheme === 'dark';
  $q.dark.set(isDarkMode.value);
});


watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

const handleScroll = () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 50) {
    hideHeader.value = true;
  } else {
    hideHeader.value = false;
  }
  lastScroll = currentScroll;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const showPreloader = ref(true);
const progressValue = ref(0);
let preloaderInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  preloaderInterval = setInterval(() => {
    if (progressValue.value < 100) {
      progressValue.value += 10;
    } else {
      clearInterval(preloaderInterval as ReturnType<typeof setInterval>);
      setTimeout(() => {
        showPreloader.value = false;
      }, 300);
    }
  }, 100);

  setTimeout(() => {
    if (showPreloader.value) {
      showPreloader.value = false;
      if (preloaderInterval) {
        clearInterval(preloaderInterval);
      }
    }
  }, 1500); // Maksimal 1.5 detik untuk preloader
});

/** Kontrol Drawer Seluler/Tablet */


/** Item Keranjang Belanja (data contoh, biasanya berasal dari backend/store) */
const cartItems = ref<{ id: number; name: string; price: number; image: string; qty?: number }[]>(
  [],
);

// Fungsi untuk memuat item keranjang dari localStorage
function loadCart() {
  const storedCart = localStorage.getItem('cart');
  cartItems.value = storedCart ? JSON.parse(storedCart) : [];
}

// Muat keranjang saat komponen dimuat dan dengarkan perubahan penyimpanan
onMounted(() => {
  loadCart();
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') loadCart();
  });
});

// Efek watch untuk memperbarui keranjang secara real-time (misalnya, jika ditambahkan dari halaman lain)
watchEffect(() => {
  loadCart();
});

/** Kontrol Input Pencarian Global & Seluler */
const searchTerm = inject('searchTerm', ref('')); // Search term yang di-inject/disediakan
provide('searchTerm', searchTerm); // Sediakan search term untuk komponen anak

// Lakukan pencarian dan navigasi ke halaman produk

// URL dasar untuk API Strapi (dari variabel lingkungan)

// Properti terkomputasi untuk URL avatar pengguna, dengan fallback ke UI Avatars


// Fokuskan input pencarian saat menjadi aktif

// Fungsi utilitas untuk memformat harga ke Rupiah Indonesia

</script>

<style scoped>
/* Efek hover umum */
.footer-hover,
.product-hover,
.tab-hover {
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none; /* Default untuk footer-hover */
}

.footer-hover {
  color: #5c5252;
}
.footer-hover:hover {
  color: #082f6d;
  text-decoration: underline;
}

.product-hover {
  color: #000000;
}
.product-hover:hover {
  color: #082f6d;
}

.tab-hover {
  color: #757575; /* Warna default untuk tab */
  padding: 8px 12px;
  font-size: 16px;
}
.tab-hover:hover {
  color: #082f6d;
}

/* Gaya bar pengumuman */
.announcement-bar {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
  font-weight: bold;
}

/* Gaya preloader */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--q-body-background);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animasi sembunyikan/tampilkan header */
.hide-header {
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.show-header {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
}

/* Animasi dropdown menu */
.jump-down-enter-active {
  animation: jumpDown 0.3s ease-out;
}
@keyframes jumpDown {
  0% {
    opacity: 0;
    transform: translateY(-15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.jump-up-leave-active {
  animation: jumpUp 0.3s ease-in forwards;
}
@keyframes jumpUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-15px);
  }
}

/* Gaya dasar header */
.q-header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 110px; /* Tinggi tetap untuk header */
}
@media (max-width: 600px) {
  .q-header {
    height: 100px !important; /* Sesuaikan tinggi untuk seluler */
  }
}

.q-toolbar-custom {
  max-width: 1700px;
  width: 100%;
  padding-top: 15px;
  margin: 0 auto;
  align-items: center;
  transform: translateY(-10px); /* Sesuaikan posisi konten toolbar */
}

/* Penempatan logo */
.logo-link {
  min-height: 0;
  min-width: 0;
  transform: translate(30px, 2px); /* Posisi desktop default */
}
@media (max-width: 991px) { /* Diubah dari md ke 991px untuk responsivitas tablet yang lebih baik */
  .logo-link {
    transform: translate(-10px, 5px); /* Posisi seluler/tablet */
  }
}

/* Penempatan link produk */
.product-link {
  font-size: 16px;
  text-decoration: none;
  transform: translate(50px, 0px);
  }

/* Lebar input pencarian desktop */
.desktop-search-input {
  width: 600px;
  max-width: 100%;
}
@media (min-width: 1024px) and (max-width: 1440px) {
  .desktop-search-input {
    width: 100%;
    max-width: 95vh;
  }
}
@media (min-width: 1440px) {
  .desktop-search-input {
    width: 100%;
    max-width: 63%;
  }
}

/* Gaya kartu menu */
.cart-menu-card,
.notification-menu-card {
  width: 300px;
  max-width: 90vw;
}

.cart-items-section,
.notification-items-section {
  max-height: 250px;
  overflow-y: auto;
}

/* Pemisah header */
.header-separator {
  width: 1px;
  height: 54px;
  background: #ccc;
  margin: 0 12px;
}

/* Gaya tombol Login/Daftar */
.login-btn {
  border-radius: 10px;
  font-weight: 500;
  border: 1.5px solid #082f6d;
  color: #082f6d;
}

.signup-btn {
  border-radius: 10px;
  background: #082f6d;
}

/* Gaya nama tampilan pengguna */
.user-display-name {
  color: #082f6d;
}

/* Gaya daftar menu pengguna */
.user-menu-list {
  min-width: 180px;
}

/* Gaya khusus seluler */
@media (max-width: 700px) {
  .q-toolbar-custom {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .q-toolbar-custom > .logo-link {
    margin-left: 0;
    margin-right: auto;
    transform: translate(0, 5px) !important;
  }

  .desktop-search-input {
    display: none;
  }
}

/* Container input pencarian seluler */
.mobile-search-container {
  width: 100%;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 99;
  position: relative;
}

.mobile-search-input {
  width: 100%;
}

/* Gaya navigasi utama desktop */
.desktop-main-nav {
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: -17px;
  margin-left: -40px;
  justify-content: center;
  width: 100%;
}

/* Gaya footer */
.custom-footer {
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding-left: 32px;
  padding-right: 32px;
}

@media (max-width: 1023px) {
  .custom-footer {
    padding-left: 0%;
    padding-right: 16%;
  }
  .footer-wrapper {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

.footer-logo {
  width: 170px;
  height: auto;
  margin-right: 16px; /* q-mr-md */
}

.footer-description {
  color: #5c5252;
}

.footer-contact-item {
  gap: 8px;
  color: #5c5252;
}

.footer-address-item {
  gap: 8px;
  color: #5c5252;
  align-items: flex-start;
}
.footer-address-item .q-avatar {
  margin-top: 4px; /* q-mt-xs */
}

/* Efek gradien hover tombol Instagram */
.instagram-btn-hover {
  color: black; /* Warna ikon default */
  transition: all 0.3s ease-in-out;
}
.instagram-btn-hover:hover {
  background: linear-gradient(
    45deg,
    #feda75,
    #fa7e1e,
    #d62976,
    #962fbf,
    #4f5bd5
  ) !important;
  color: white !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
