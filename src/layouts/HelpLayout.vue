<template>
  <div>
    <div v-if="showPreloader" class="preloader flex flex-center">
      <q-circular-progress
        show-value
        font-size="12px"
        :value="progressValue"
        size="64px"
        :thickness="0.22"
        color="primary"
        track-color="grey-3"
        class="q-ma-md"
      >
        {{ progressValue }}%
      </q-circular-progress>
    </div>
    <q-layout view="hHh lpR lff" v-if="!showPreloader">
      <q-header unelevated class="bg-white text-dark" style="height: 80px">
        <q-toolbar class="q-px-xl row items-center justify-between" style="height: 100%">
          <!-- KIRI: Logo + Help & Support -->
          <div class="row items-center no-wrap">
            <router-link to="/" class="row items-center no-wrap" style="text-decoration: none">
              <img
                src="icons/Logo fix.svg"
                alt="Maker.id logo"
                style="width: 120px; height: auto; margin-right: 8px"
              />
            </router-link>
            <div class="text-blue text-caption text-weight-medium cursor-pointer tabb-hover" style="font-size: 14px" @click="$router.push({ name: 'DashboardHelp' })">
              Help & Support
            </div>
          </div>

          <!-- KANAN: Avatar + Username atau tombol login/signup -->
          <div class="row items-center no-wrap">
            <template v-if="isLoggedIn">
              <!-- AFTER LOGIN: Tampilkan avatar, username, dan menu user -->
              <q-btn flat round dense color="black">
                <q-avatar size="28px" class="q-mr-sm">
                  <img :src="userAvatarUrl" alt="User Avatar" />
                </q-avatar>
                <span class="text-subtitle2 text-weight-medium">{{ displayUsername() }}</span>
              </q-btn>
              <q-menu
                anchor="bottom right"
                self="top right"
                transition-show="jump-down"
                transition-hide="jump-up"
              >
                <q-list style="min-width: 180px">
                  <q-item>
                    <q-item-section>
                      <div class="text-weight-bold">{{ user?.username || 'User' }}</div>
                      <div class="text-caption text-grey-7">{{ user?.email || 'No email' }}</div>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-ripple :to="{ name: 'UserProfile' }">
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>Profile</q-item-section>
                  </q-item>
                  <q-item clickable v-ripple :to="{ name: 'UserOrders' }">
                    <q-item-section avatar>
                      <q-icon name="shopping_basket" />
                    </q-item-section>
                    <q-item-section>Orders</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-ripple @click="logout">
                    <q-item-section avatar>
                      <q-icon name="logout" />
                    </q-item-section>
                    <q-item-section>Logout</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </template>
            <template v-else>
              <!-- BEFORE LOGIN: Tampilkan tombol login dan signup -->
              <q-btn
                flat
                color="primary"
                class="q-mr-sm"
                @click="$router.push('/login')"
                label="Login"
              />
              <q-btn color="primary" unelevated @click="$router.push('/signup')" label="Sign Up" />
            </template>
          </div>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>

      <q-footer
        v-if="$route.path !== '/login' && $route.path !== '/signup'"
        class="custom-footer bg-white shadow-up-2"
      >
        <div class="footer-wrapper row q-col-gutter-sm q-col-gutter-xl q-pa-xl q-mx-auto q-mx-md">
          <div class="col-12 col-md-4">
            <div class="row items-center q-mb-md">
              <img
                src="icons/logomaker.svg"
                alt="innodrive.ai"
                style="width: 170px; height: auto"
                class="q-mr-md"
              />
            </div>
            <div class="text-body2" style="color: #5c5252">
              Maker.id is an e-commerce website that offers a wide range of electronic components,
              supporting tools for students, and professionals working on electronics and technology
              projects. The platform is designed to help makers, engineers, and DIY enthusiasts
              easily find high-quality components with fast and reliable service.
            </div>
          </div>

          <div class="col-12 col-md-2">
            <div class="text-subtitle1 text-black q-mb-sm text-weight-bold">Maker.id</div>
            <span class="text-body2 footer-hover" @click="$router.push('/about')">About Us</span
            ><br />
            <span class="text-body2 footer-hover" @click="$router.push('/career')">Career</span
            ><br />
            <span class="text-body2 footer-hover" @click="$router.push('/blog')">Blog</span><br />
            <span class="text-body2 footer-hover" @click="$router.push('/learn')">Learn More</span>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-subtitle1 text-black q-mb-sm text-weight-bold">Our Contacts</div>
            <div class="text-body2 row items-center" style="gap: 8px; color: #5c5252">
              <q-avatar size="28px" class="bg-white q-mr-xs">
                <q-icon name="email" color="black" style="cursor: pointer" size="18px" />
              </q-avatar>
              <a
                href="mailto:makerid25@gmail.com"
                class="footer-hover"
                target="_blank"
                rel="noopener"
              >
                makerid25@gmail.com
              </a>
            </div>
            <div class="text-body2 row items-center" style="gap: 8px; color: #5c5252">
              <q-avatar size="28px" class="bg-white q-mr-xs">
                <q-icon name="mdi-whatsapp" color="black" style="cursor: pointer" size="18px" />
              </q-avatar>
              <a
                href="https://wa.me/6285735146647"
                target="_blank"
                class="footer-hover"
                rel="noopener"
              >
                +62 857-3514-6647
              </a>
            </div>
            <div
              class="text-body2 row items-start"
              style="gap: 8px; color: #5c5252; align-items: flex-start"
            >
              <q-avatar size="28px" class="bg-white q-mr-xs q-mt-xs">
                <q-icon name="place" color="black" style="cursor: pointer" size="18px" />
              </q-avatar>
              <div style="flex: 1">
                <a
                  href="https://maps.app.goo.gl/v3PYgfVpMpEJDT4LA"
                  target="_blank"
                  rel="noopener"
                  class="footer-hover"
                >
                  Bumi Jabon Estate Housing Complex Jl. Raya Gayaman No. G-17, Mojoanyar District,
                  Mojokerto Regency, East Java 61364
                </a>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-subtitle1 text-black q-mb-sm text-weight-bold">Follow Us</div>
            <div class="row q-gutter-md">
              <q-btn
                flat
                round
                icon="mdi-instagram"
                class="bg-white text-black instagram-btn-hover"
                href="https://www.instagram.com/innodrive.ai/"
                target="_blank"
              />
            </div>
          </div>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  provide,
  inject,
  nextTick,
  watch,
  onBeforeUnmount,
  watchEffect,
  computed,
} from 'vue';
import { useQuasar } from 'quasar';
import type { QInput } from 'quasar';
import axios from 'axios';

const $q = useQuasar();

interface User {
  id: number;
  username: string;
  email: string;
  profile?: { url: string };
}
const user = ref<User | null>(null);

// Ambil username dari localStorage jika ada
function displayUsername() {
  if (user.value?.username) {
    return user.value.username;
  }
  // Coba ambil dari localStorage jika belum ada di state
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.username) {
        user.value = parsed;
        return parsed.username;
      }
    } catch {
      // ignore error
    }
  }
  return 'Customer';
}

// Computed untuk cek login
const token = ref(localStorage.getItem('token') || '');
const isLoggedIn = computed(() => !!token.value && !!user.value);


const hideHeader = ref(false);
let lastScroll = 0;

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
  // Set user dari localStorage saat mount
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch {
      user.value = null;
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

/** === Preloader (for initial app load only) === */
const showPreloader = ref(true);
const progressValue = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  interval = setInterval(() => {
    if (progressValue.value < 100) {
      progressValue.value += 10;
    } else {
      clearInterval(interval as ReturnType<typeof setInterval>);
      setTimeout(() => {
        showPreloader.value = false;
      }, 300);
    }
  }, 100);

  setTimeout(() => {
    if (showPreloader.value) {
      showPreloader.value = false;
      if (interval) {
        clearInterval(interval);
      }
    }
  }, 1500);
});

/** === Shopping Cart === */
const cartItems = ref<{ id: number; name: string; price: number; image: string; qty?: number }[]>(
  [],
);

function loadCart() {
  const storedCart = localStorage.getItem('cart');
  cartItems.value = storedCart ? JSON.parse(storedCart) : [];
}

onMounted(() => {
  loadCart();
  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') loadCart();
  });
});

watchEffect(() => {
  loadCart();
});

/** === Search Term Global & Mobile Search Input Control === */
const searchTerm = inject('searchTerm', ref(''));
provide('searchTerm', searchTerm);
const isMobileSearchActive = ref(false);
const mobileSearchInput = ref<QInput | null>(null);

const strapiBaseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const userAvatarUrl = computed(() => {
  const nameForAvatar = user.value?.username || 'User';
  if (user.value?.profile?.url) {
    return strapiBaseUrl + user.value.profile.url;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=082f6d&color=fff`;
});

const fetchUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get('http://192.168.0.245:1337/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = res.data;
    localStorage.setItem('user', JSON.stringify(res.data));
  } catch (err) {
    console.error('Token kadaluarsa atau invalid:', err);
    localStorage.removeItem('token');
    user.value = null;
    $q.notify({ type: 'negative', message: 'Sesi login berakhir, silakan login ulang' });
  }
};

watchEffect(() => {
  token.value = localStorage.getItem('token') || '';
  if (token.value) void fetchUser();
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  user.value = null;
  token.value = '';
}


// Focus the search input when it becomes active
watch(isMobileSearchActive, async (newVal) => {
  if (newVal) {
    await nextTick(() => {
      mobileSearchInput.value?.focus();
    });
  }
});
</script>

<style scoped>
.footer-hover {
  color: #5c5252; /* Default color */
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none; /* Remove underline by default */
}
.footer-hover:hover {
  color: #082f6d; /* Change to your desired hover color */
  text-decoration: underline; /* Optional: underline on hover */
}

.product-hover {
  color: #000000; /* Default color */
  cursor: pointer;
  transition: color 0.3s ease;
}
.product-hover:hover {
  color: #082f6d; /* Change to your desired hover color */
}

.tab-hover {
  cursor: pointer;
  transition: color 0.3s ease;
}
.tab-hover:hover {
  color: #082f6d; /* Change to your desired hover color */
}

/* Add the new style for the announcement bar */
.announcement-bar {
  width: 100%;
  position: relative; /* Changed from fixed to relative to flow naturally before header */
  top: 0;
  left: 0;
  z-index: 100; /* Ensure it's above other elements but below preloader */
  font-weight: bold;
}

/* Preloader */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #f7f9fc;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hide-header {
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.show-header {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
}

/* Remove unused preloader animation styles (ytp-spinner etc.) */
/* Only keep the @keyframes spin if you intend to use it for other elements */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ANIMASI MASUK: jatuh dari atas */
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

/* ANIMASI KELUAR: dilempar ke atas */
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

/* Header */
.q-header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 125px;
}
@media (max-width: 600px) {
  .q-header {
    height: 100px !important;
  }
}

.hide-header {
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.show-header {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
}

.q-toolbar-custom {
  max-width: 1700px;
  width: 100%;
  padding-top: 15px;
  margin: 0 auto;
  align-items: center; /* Ensure items are vertically centered */
  /* Geser semua isi header ke atas 3px */
  transform: translateY(-10px);
}

/* Desktop & Tablet specific styles (gt-sm) - unchanged from previous */
@media (min-width: 601px) {
  .q-toolbar-custom {
    padding-left: 32px;
    padding-right: 32px;
  }
  .q-toolbar-custom .q-input {
    width: 420px; /* Default desktop width */
    max-width: 100%;
  }
}
@media (min-width: 1024px) and (max-width: 1440px) {
  .q-toolbar-custom .q-input {
    width: 100%; /* Adjust for larger screens but not too wide */
    max-width: 95vh;
  }
}
@media (min-width: 1440px) {
  .q-toolbar-custom .q-input {
    width: 100%;
    max-width: 63%; /* Wider for very large screens */
  }
}

/* Mobile specific styles (lt-sm) */
@media (max-width: 600px) {
  .q-toolbar-custom {
    padding-left: 16px; /* Padding for logo on the left */
    padding-right: 16px; /* Padding for icons on the right */
    padding-top: 20px;
    display: flex;
    justify-content: flex-start; /* Start items from the left */
    align-items: center;
  }

  /* Ensure logo is on the far left */
  .q-toolbar-custom > .router-link {
    margin-left: 0; /* Remove default margin */
    margin-right: auto; /* Push other items to the right */
    transform: translate(0, 5px) !important; /* Adjust if needed for precise logo alignment */
  }

  /* Hide desktop search input in mobile view */
  .q-toolbar-custom .q-input {
    display: none;
  }
}

/* Mobile Search Input Container (appears below header) */
.mobile-search-container {
  width: 100%;
  padding: 8px 16px; /* Add padding around the input */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow */
  z-index: 99; /* Ensure it's above page content */
  position: relative; /* Allows it to flow naturally below the toolbar */
}

.mobile-search-input {
  width: 100%; /* Make input take full width of its container */
}

/* Footer */
.custom-footer {
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1); /* arah bayangan ke atas */
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

/* Define Instagram Gradient Colors */
/* These are approximate and can be adjusted */
.instagram-gradient-start {
  background: #feda75; /* Yellow */
}
.instagram-gradient-mid {
  background: #fa7e1e; /* Orange */
}
.instagram-gradient-end {
  background: #d62976; /* Pink */
}
.instagram-gradient-deep-pink {
  background: #962fbf; /* Purple-ish pink */
}
.instagram-gradient-blue {
  background: #4f5bd5; /* Blue */
}

/* Apply hover effect */
.instagram-btn-hover:hover {
  /* Hapus background lama dan terapkan gradient */
  background: linear-gradient(
    45deg,
    #feda75,
    /* Yellow */ #fa7e1e,
    /* Orange */ #d62976,
    /* Pink */ #962fbf,
    /* Purple-ish pink */ #4f5bd5 /* Blue */
  ) !important; /* Gunakan !important jika perlu menimpa kelas Quasar */
  color: white !important; /* Ubah warna ikon menjadi putih agar terlihat */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Opsional: tambahkan bayangan */
  transition: all 0.3s ease-in-out; /* Animasi transisi */
}

/* Mengatur state default agar ikon hitam */
.instagram-btn-hover {
  color: black;
  transition: all 0.3s ease-in-out;
}

.tabb-hover {
  color: #5c5252; /* Default color */
  cursor: pointer;
  transition: color 0.3s ease;
}
.tabb-hover:hover {
  color: #082f6d; /* Change to your desired hover color */
  text-decoration: underline; /* Optional: underline on hover */
}
</style>
