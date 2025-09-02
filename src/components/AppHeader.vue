<template>
  <div class="header q-px-lg" :class="hideHeader ? 'hide-header' : 'show-header'">
    <q-toolbar class="q-toolbar-custom">
      <div class="row items-center q-gutter-x-md">
        <router-link to="/" class="logo-link">
  <img
    :src="$q.screen.lt.md ? mobileLogoSrc : logoSrc"
    alt="maker.id logo"
    :style="{ width: $q.screen.lt.md ? '56px' : '180px', height: 'auto' }"
  />
</router-link>

        <div
          v-if="$q.screen.gt.xs"
          class="product-link product-hover text-weight-medium"
          @click="$router.push('/products')"
        >
          Products
        </div>
      </div>

      <template v-if="$q.screen.gt.sm">
        <q-input
          v-model="searchTerm"
          outlined
          dense
          class="q-mx-md q-mt-md desktop-search-input"
          placeholder="What do you want to buy?"
          @keyup.enter="performSearch"
        >
          <template v-slot:prepend>
            <q-icon name="img:iconasli/search-normal.png" />
          </template>
        </q-input>

        <div class="row items-center q-gutter-x-sm action-group-desktop">
          <!-- Cart Button & Menu -->
            <q-btn flat round dense :icon="cartIconSrc">
            <q-menu
              anchor="bottom right"
              self="top right"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <div style="display: flex; flex-direction: column; height: 350px; position: relative; width: 305px;">
              <div style="flex: 1 1 auto; overflow-y: auto;">
              <q-card-section class="text-subtitle2 text-bold">Shopping Cart</q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm cart-items-section">
              <div v-if="!isLoggedIn" class="text-caption text-grey text-center q-py-md">
                You must login first to see your cart.
              </div>
              <div
                v-else-if="cartItems.length === 0"
                class="text-caption text-grey text-center q-py-md"
              >
                Your cart is empty
              </div>
              <q-item v-else v-for="(item, index) in cartItems" :key="index" clickable>
                <q-item-section avatar>
                <q-avatar rounded>
                <img :src="item.image" />
                </q-avatar>
                </q-item-section>
                <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>
                {{ formatPrice(item.price) }} <span v-if="item.qty">x{{ item.qty }}</span>
                </q-item-label>
                </q-item-section>
              </q-item>
              </q-card-section>
              <q-separator />
              </div>
              <q-card-actions
              align="right"
              class="action-buttons-card"
              style="margin-top: auto; position: sticky; bottom: 0; background: inherit; z-index: 2;"
              >
              <q-btn
              flat
              :label="isLoggedIn ? 'See Cart' : 'Login'"
              class="card-action-btn"
              @click="isLoggedIn ? $router.push('/cart') : promptLogin()"
              />
              </q-card-actions>
              </div>
            </q-menu>
            </q-btn>

          <!-- Notification Button & Menu -->
            <q-btn flat round dense :icon="notifIconSrc">
            <q-menu
              anchor="bottom right"
              self="top right"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <div style="display: flex; flex-direction: column; height: 350px; position: relative;">
              <div style="flex: 1 1 auto; overflow-y: auto;">
                <q-card-section class="text-subtitle2 text-bold">Notifications</q-card-section>
                <q-separator />
                <q-card-section class="q-pa-sm notification-items-section">
                <div v-if="!isLoggedIn" class="text-caption text-grey text-center q-py-md">
                  You must login first to see notifications.
                </div>
                <div
                  v-else-if="notifications.length === 0"
                  class="text-caption text-grey text-center q-py-md"
                >
                  You have no notifications
                </div>
                <q-item v-else v-for="(notif, index) in notifications" :key="index" clickable>
                  <q-item-section>
                  <q-item-label>{{ notif.message }}</q-item-label>
                  <q-item-label caption class="text-grey-6">{{ notif.time }}</q-item-label>
                  </q-item-section>
                </q-item>
                </q-card-section>
                <q-separator />
              </div>
              <q-card-actions
                align="right"
                class="action-buttons-card"
                style="margin-top: auto; position: sticky; bottom: 0; background: inherit; z-index: 2;"
              >
                <q-btn
                flat
                :label="isLoggedIn ? 'See All Notifications' : 'Login'"
                class="card-action-btn"
                @click="isLoggedIn ? $router.push('/profile/Data') : promptLogin()"
                />
              </q-card-actions>
              </div>
            </q-menu>
            </q-btn>

          <div class="header-separator" />

          <div class="user-auth-section">
            <div v-if="!isLoggedIn">
                <q-btn
                flat
                label="Login"
                class="login-btn q-px-sm"
                to="/second/login-akun"
                :style="$q.dark.isActive ? 'color: white' : ''"
                />
              <q-btn
                label="Register"
                class="signup-btn q-ml-sm q-px-sm"
                to="/second/create-akun"
                unelevated
              />
            </div>
            <div v-else>
              <q-btn flat round dense class="user-profile-btn">
                <q-avatar size="32px">
                  <img :src="userAvatarUrl" alt="Avatar Pengguna" />
                </q-avatar>
                <span class="q-ml-sm text-weight-medium user-display-name">{{
                  user?.username || 'Pengguna'
                }}</span>
                <q-menu
                  anchor="bottom right"
                  self="top right"
                  transition-show="jump-down"
                  transition-hide="jump-up"
                >
                  <q-list class="user-menu-list">
                    <q-item>
                      <q-item-section>
                        <div class="text-weight-bold">{{ user?.username || 'Pengguna' }}</div>
                        <div class="text-caption text-grey-7">
                          {{ user?.email || 'Tidak ada email' }}
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-ripple to="profile/Data">
                      <q-item-section avatar>
                        <q-icon name="person" />
                      </q-item-section>
                      <q-item-section>Profile</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple to="profile/Transaksi">
                      <q-item-section avatar>
                        <q-icon name="shopping_basket" />
                      </q-item-section>
                      <q-item-section>Your Orders</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section top avatar>
                        <q-toggle
                          v-model="isDarkMode"
                          checked-icon="dark_mode"
                          unchecked-icon="light_mode"
                          color="primary"
                          keep-color
                          size="md"
                          dense
                          class="q-mr-sm q-mt-sm"
                        />
                      </q-item-section>
                      <q-item-section>{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</q-item-section>
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
              </q-btn>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="row q-gutter-x-sm items-center action-buttons-mobile">
          <q-btn
            flat
            round
            dense
            icon="search"
            @click="isMobileSearchActive = !isMobileSearchActive"
          />
          <q-btn flat round dense :icon="cartIconSrc">
            <q-menu
              anchor="bottom right"
              self="top right"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <q-card class="cart-menu-card">
                <q-card-section class="text-subtitle2 text-bold">Shopping Cart</q-card-section>
                <q-separator />
                <q-card-section class="q-pa-sm cart-items-section">
                  <div v-if="!isLoggedIn" class="text-caption text-grey text-center q-py-md">
                    You must login first to view your shopping cart list.
                  </div>
                  <div
                    v-else-if="cartItems.length === 0"
                    class="text-caption text-grey text-center q-py-md"
                  >
                    Your cart is Empty
                  </div>
                  <q-item v-else v-for="(item, index) in cartItems" :key="index" clickable>
                    <q-item-section avatar>
                      <q-avatar rounded>
                        <img :src="item.image" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ item.name }}</q-item-label>
                      <q-item-label caption>
                        {{ formatPrice(item.price) }} <span v-if="item.qty">x{{ item.qty }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn
                    flat
                    :label="isLoggedIn ? 'Lihat Keranjang' : 'Login'"
                    @click="isLoggedIn ? $router.push('/cart') : promptLogin()"
                  />
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>
          <q-btn flat round dense icon="menu" @click="toggleDrawer" />
        </div>
      </template>
    </q-toolbar>

    <div v-if="$q.screen.gt.sm" class="desktop-main-nav text-grey-7">
      <span class="tab-hover" @click="$router.push('/')"> Shop </span>
      <span class="tab-hover" @click="$router.push('/documentation')"> Documentation </span>
      <!-- <span class="tab-hover" @click="$router.push('/blog')"> Blog </span> -->
      <span class="tab-hover" @click="$router.push('/videos')"> Video </span>
      <span class="tab-hover" @click="$router.push('/support')"> Help & Support </span>
    </div>

    <div v-if="$q.screen.lt.md && isMobileSearchActive" class="mobile-search-container">
      <q-input
        v-model="searchTerm"
        outlined
        dense
        class="mobile-search-input"
        placeholder="What do you want to buy today?"
        @keyup.enter="performSearch"
        ref="mobileSearchInput"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-btn flat round dense icon="close" @click="isMobileSearchActive = false" />
        </template>
      </q-input>
    </div>
  </div>

  <q-drawer v-model="drawerOpen" side="right" overlay bordered :width="250" class="custom-drawer">
    <q-list>
      <q-item-label header class="text-h6 text-weight-bold custom-header">Menu</q-item-label>
      <div v-if="isLoggedIn && user">
        <q-item clickable v-ripple to="/profile/Data" class="custom-item">
          <q-item-section>
            <div class="row items-center">
              <q-avatar size="32px" class="q-mr-md custom-avatar">
                <img :src="userAvatarUrl" alt="Avatar Pengguna" />
              </q-avatar>
              <div>
                <div class="text-weight-bold custom-text">{{ user.username || 'Pengguna' }}</div>
                <div class="text-caption text-grey-7 custom-subtext">{{ user.email || 'No email' }}</div>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </div>
      <q-item clickable v-ripple to="/products" class="custom-item">
        <q-item-section avatar>
          <q-icon name="category" class="custom-icon" />
        </q-item-section>
        <q-item-section class="custom-text">Categories</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="isLoggedIn ? $router.push('/cart') : promptLogin()" class="custom-item">
        <q-item-section avatar>
          <q-icon name="shopping_cart" class="custom-icon" />
        </q-item-section>
        <q-item-section class="custom-text">Shopping Cart</q-item-section>
        <q-item-section side v-if="cartItems.length > 0">
          <q-badge color="red" rounded floating :label="cartItems.length" />
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="isLoggedIn ? $router.push('/profile/Data') : promptLogin()" class="custom-item">
        <q-item-section avatar>
          <q-icon name="notifications_none" class="custom-icon" />
        </q-item-section>
        <q-item-section class="custom-text">Notifications</q-item-section>
        <q-item-section side v-if="notifications.length > 0">
          <q-badge color="red" rounded floating />
        </q-item-section>
      </q-item>
      <q-separator class="custom-separator" />
      <div>
        <q-item clickable v-ripple @click="$router.push('/')" class="custom-item">
          <q-item-section avatar>
            <q-icon name="shop" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Shop</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push('/documentation')" class="custom-item">
          <q-item-section avatar>
            <q-icon name="work" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Documentation</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push('/videos')" class="custom-item">
          <q-item-section avatar>
            <q-icon name="school" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Video</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push('/support')" class="custom-item">
          <q-item-section avatar>
            <q-icon name="help" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Help & Support</q-item-section>
        </q-item>
        <q-item>
          <q-item-section top avatar>
            <q-toggle
              v-model="isDarkMode"
              checked-icon="dark_mode"
              unchecked-icon="light_mode"
              color="primary"
              keep-color
              size="md"
              dense
              class="q-mr-sm q-mt-sm custom-toggle"
            />
          </q-item-section>
          <q-item-section class="custom-text">{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</q-item-section>
        </q-item>
      </div>
      <q-separator class="custom-separator" />
      <div v-if="!isLoggedIn">
        <q-item clickable v-ripple @click="promptLogin" class="custom-item">
          <q-item-section avatar>
            <q-icon name="login" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Login</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/second/create-akun" class="custom-item">
          <q-item-section avatar>
            <q-icon name="person_add" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Register</q-item-section>
        </q-item>
      </div>
      <div v-else>
        <q-item clickable v-ripple @click="logout" class="custom-item">
          <q-item-section avatar>
            <q-icon name="logout" class="custom-icon" />
          </q-item-section>
          <q-item-section class="custom-text">Logout</q-item-section>
        </q-item>
      </div>
      <q-separator class="custom-separator" />
    </q-list>
  </q-drawer>
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
import { useRouter, useRoute } from 'vue-router';
import { useQuasar, QInput } from 'quasar';
import { useUserStore } from 'stores/user-stores';
import { storeToRefs } from 'pinia';
// import MiniCart from './MiniCart.vue';
import Swal from 'sweetalert2';
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty?: number;
}

interface NotificationItem {
  id: number;
  message: string;
  time: string;
}

// --- Composable / Store Usage ---
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const userStore = useUserStore();
// Pastikan user bisa null/undefined dari storeToRefs
const { user, isLoggedIn } = storeToRefs(userStore);

// --- Constants ---
const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// --- Reactive State ---
const isDarkMode = ref(false);
const hideHeader = ref(false);
let lastScroll = 0;
const drawerOpen = ref(false);
const cartItems = ref<CartItem[]>([]);
const notifications = ref<NotificationItem[]>([
  { id: 1, message: 'Your order #123 has been shipped!', time: '2 hours ago' },
  { id: 2, message: 'New discounts available on electronics!', time: '1 day ago' },
]);
const searchTerm = inject('searchTerm', ref(''));
provide('searchTerm', searchTerm);
const isMobileSearchActive = ref(false);
const mobileSearchInput = ref<QInput | null>(null);

// --- Computed Properties ---
const userAvatarUrl = computed(() => {
  // Pastikan user.value tidak null/undefined sebelum mengakses propertinya
  const nameForAvatar = user?.value?.username || 'Pengguna';
  if (user?.value?.profile?.url) {
    return user.value.profile.url.startsWith('http')
      ? user.value.profile.url
      : `${baseUrl}${user.value.profile.url}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=082f6d&color=fff`;
});

const logoSrc = computed(() => {
  return $q.dark.isActive ? '/icons/Logo fix-dark.svg' : '/icons/Logo fix.svg';
});

// --- Functions ---
const handleScroll = () => {
  const currentScroll = window.scrollY;
  // Sembunyikan header hanya saat menggulir ke bawah melewati ambang batas tertentu
  if (currentScroll > lastScroll && currentScroll > 50) {
    hideHeader.value = true;
  } else {
    // Tampilkan header saat menggulir ke atas atau di paling atas
    hideHeader.value = false;
  }
  lastScroll = currentScroll;
};

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

function loadCart() {
  const storedCart = localStorage.getItem('cart');
  cartItems.value = storedCart ? JSON.parse(storedCart) : [];
}

const performSearch = () => {
  if (searchTerm.value.trim()) {
    if (route.path === '/products') {
      void router.replace({ path: '/products', query: { q: searchTerm.value.trim() } });
    } else {
      void router.push({ path: '/products', query: { q: searchTerm.value.trim() } });
    }
  } else {
    // Jika istilah pencarian kosong, hapus parameter query
    if (route.path !== '/products') {
      void router.push({ path: '/products' });
    } else {
      void router.replace({ path: '/products', query: {} });
    }
  }
  isMobileSearchActive.value = false; // Tutup pencarian mobile setelah melakukan pencarian
  drawerOpen.value = false; // Tutup drawer setelah melakukan pencarian
};

const promptLogin = () => {
  void Swal.fire({
    toast: true,
    icon: 'info',
    title: 'You must login first',
    showConfirmButton: false,
    timer: 3000,
  });
  drawerOpen.value = false; // Tutup drawer jika meminta login
  void router.push('/second/login-akun');
};

const logout = () => {
  userStore.logout();
  void Swal.fire({
    toast: true,
    icon: 'success',
    title: 'Berhasil Log Out',
    showConfirmButton: false,
    timer: 3000,
  });
  void router.push('/');
};

function formatPrice(price: number): string {
  return 'Rp ' + price.toLocaleString('id-ID');
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  // Pemuatan awal keranjang dan tema
  loadCart();
  const storedTheme = localStorage.getItem('theme');
  isDarkMode.value = storedTheme === 'dark';
  $q.dark.set(isDarkMode.value);

  // Ambil data pengguna
  await userStore.fetchUser();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// --- Watchers ---
// Perhatikan perubahan pada kunci 'cart' di localStorage
watchEffect(() => {
  loadCart();
});

// Perhatikan aktivasi pencarian mobile untuk memfokuskan input
watch(isMobileSearchActive, async (newVal) => {
  if (newVal) {
    await nextTick(() => {
      mobileSearchInput.value?.focus();
    });
  }
});

// Perhatikan toggle mode gelap
watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

const cartIconSrc = computed(() =>
  $q.dark.isActive ? 'img:iconasli/shopping-cart-light.png' : 'img:iconasli/shopping-cart.png',
);
const notifIconSrc = computed(() =>
  $q.dark.isActive ? 'img:iconasli/notifications-light.png' : 'img:iconasli/notification.png',
);

// Logo M
const mobileLogoSrc = computed(() => {
  return $q.dark.isActive ? '/icons/Logo_M_white.svg' : '/icons/Logo_M.svg';
});
</script>

<style scoped>
/* Base Header Styling */
.header {
  position: fixed; /* Header tetap di posisi atas */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Pastikan header di atas konten lain */
  background-color: var(--q-item-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Bayangan default mode terang */
  height: 110px; /* Tinggi default */
}

/* Dark mode specific shadow */
body.body--dark .header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6); /* Bayangan lebih gelap untuk mode gelap */
}

/* Header hide/show animation */
.hide-header {
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
}

.show-header {
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
}

/* Custom Toolbar Layout */
.q-toolbar-custom {
  max-width: 1700px; /* Lebar maksimal toolbar */
  width: 100%; /* Ambil lebar penuh container */
  margin: 0 auto; /* Tengah di layar besar */
  padding-top: 15px; /* Padding atas asli */
  transform: translateY(-5px); /* Geser seluruh toolbar ke atas 5px */
  display: flex; /* Gunakan flexbox untuk distribusi */
  align-items: center; /* Sejajarkan item secara vertikal */
  justify-content: space-between; /* Distribusikan ruang antar bagian */
  flex-wrap: nowrap; /* Cegah wrapping di toolbar itu sendiri */
}

/* Logo Link */
.logo-link {
  display: flex; /* Pastikan gambar dan teks sejajar */
  align-items: center;
  min-height: 0;
  min-width: 0;
  margin-left: 30px; /* Margin awal untuk desktop */
}

/* Product Link Styling */
.product-link {
  font-size: 22px; /* Ukuran font lebih besar */
  margin-top: 14px; /* Sejajarkan dengan logo */
  margin-left: 20px; /* Jarak dari logo */
  transform: translateY(-5px); /* Geser ke atas 5px */
}

.product-hover,
.tab-hover {
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none;
  color: inherit; /* Pastikan warna teks default kecuali saat di-hover */
}

.product-hover:hover,
.tab-hover:hover {
  color: var(--q-primary); /* Gunakan warna primer saat di-hover */
}

/* Desktop Search Input */
.desktop-search-input {
  flex-grow: 1; /* Izinkan input mengambil ruang yang tersedia */
  max-width: 953px; /* Lebar maksimal untuk layar sangat besar */
  min-width: 300px; /* Lebar minimum untuk input */
  transform: translateY(-5px); /* Geser ke atas 5px */
  margin-right: 20px; /* Kurangi margin kanan agar lebih dekat ke grup aksi */
}

/* Adjustments for specific desktop screen sizes */
@media (min-width: 1024px) and (max-width: 1439px) {
  .desktop-search-input {
    max-width: 2000px; /* Sesuaikan lebar maksimal untuk desktop/tablet landscape yang lebih kecil */
  }
}

@media (min-width: 1440px) and (max-width: 1920px) {
  .desktop-search-input {
    max-width: 2000px; /* Lebih lebar untuk layar besar standar */
  }
}

@media (min-width: 1921px) {
  .desktop-search-input {
    max-width: 2000px; /* Lebih lebar untuk layar besar standar */
  }
}

/* Grup Aksi dan Otentikasi Pengguna di Desktop */
.action-group-desktop {
  /* Mengganti .action-buttons-desktop dan .user-auth-section menjadi satu container */
  gap: 15px; /* Jarak antar elemen dalam grup (termasuk tombol dan separator) */
  margin-right: 30px; /* Atur margin kanan untuk keseluruhan grup */
  transform: translateY(4px); /* Geser ke atas 4px */
}

/* Header Separator */
.header-separator {
  width: 1px;
  height: 54px;
  background: #ccc;
  margin: 0 5px; /* Kurangi margin di sekitar separator */
  transform: translateY(5px); /* Geser ke atas 5px */
}

/* Dark mode separator */
body.body--dark .header-separator {
  background: #555;
}

/* Login/Signup Buttons dan User Profile */
/* Hapus user-auth-section transform karena sudah diatur di action-group-desktop */
/* Hapus q-pl-md dan q-mr-xl-desktop dari user-auth-section di template */

/* User Avatar and Name Display */
.user-display-name {
  white-space: nowrap; /* Cegah nama membungkus */
  overflow: hidden;
  text-overflow: ellipsis; /* Tambahkan elipsis jika terlalu panjang */
  max-width: 100px; /* Batasi lebar untuk mencegah peregangan berlebihan */
}

/* User Menu List */
.user-menu-list {
  min-width: 180px;
}

/* Dropdown Menu Cards (Cart & Notification) */
.cart-menu-card,
.notification-menu-card {
  width: 300px;
  height: 450px;
}

.cart-items-section,
.notification-items-section {
  max-height: 250px;
  overflow-y: auto;
}

/* Desktop Main Navigation (below main toolbar) */
.desktop-main-nav {
  display: flex;
  justify-content: center; /* Tengahkan tautan navigasi */
  gap: 20px; /* Jarak antar tautan */
  align-items: center;
  margin-top: 0px; /* Sesuaikan margin-top agar lebih ke atas dan menyatu dengan toolbar utama */
  width: 100%; /* Ambil lebar penuh */
  font-size: 16px;
  padding-bottom: 5px; /* Tambahkan padding di bagian bawah */
}

/* Mobile Search Container */
.mobile-search-container {
  width: 105vw;
  right: 28px;
  padding: 0;
  margin-right: 0;
  position: relative;
}

body.body--dark .mobile-search-container {
  background: #222; /* Warna gelap untuk dark mode */
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.05);
}

.mobile-search-input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: #fff;
  margin-top: 3px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  color: #222;
}

body.body--dark .mobile-search-input {
  background: #222; /* Warna gelap untuk input di dark mode */
  color: #fff;      /* Tulisan putih */
}

body.body--dark .mobile-search-input .q-field__prepend .q-icon,
body.body--dark .mobile-search-input .q-field__append .q-icon {
  color: #fff !important; /* Ikon putih di dark mode */
}

/* --- Responsive Adjustments --- */

/* Untuk layar lebih kecil (di bawah md, yaitu tablet landscape dan mobile) */
@media (max-width: 1023px) {
  .header {
    height: 64px; /* Tinggi default untuk mobile/tablet */
  }

  .q-toolbar-custom {
    padding-top: 20px; /* Reset padding untuk mobile/tablet */
    transform: translateY(-5px); /* Tetap geser ke atas 5px di mobile/tablet */
    justify-content: space-between;
    padding-left: 36px; /* Tambahkan padding konsisten untuk mobile */
    padding-right: 16px;
  }

  .logo-link {
    margin-left: 0; /* Hapus margin ekstra di mobile */
  }

  .product-link {
    margin-left: 15px; /* Margin lebih kecil untuk tautan produk mobile */
    font-size: 16px; /* Ukuran font lebih kecil di mobile */
    margin-top: 0; /* Hapus margin atas */
    transform: translateY(-5px); /* Geser ke atas 5px */
  }

  /* Sembunyikan grup aksi desktop di bawah sm */
  .action-group-desktop {
    display: none;
  }

  /* Tampilkan hanya action-buttons-mobile di bawah sm */
  .action-buttons-mobile {
    display: flex !important; /* Pastikan terlihat */
  }
}

/* Untuk layar sangat kecil (di bawah xs, biasanya ponsel) */
@media (max-width: 599px) {
  .header {
    height: 64px;
  }
}

.main-content-wrapper {
  padding-top: 110px; /* Sesuaikan dengan tinggi header Anda */
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
}
.login-btn {
  border-radius: 5px;
  font-weight: 500;
  border: 1.5px solid #082f6d;
  color: #082f6d;
}
body.body--dark .login-btn {
  border-color: #3D98EF; /* Biru cerah untuk dark mode */
  color: #3D98EF;
}
.signup-btn {
  border-radius: 5px;
  font-weight: 500;
  background-color: #082f6d;
  color: white;
  border: 1.5px solid #082f6d;
}
body.body--dark .signup-btn {
  border-color: #3D98EF;
  background-color: #3D98EF;
}
/* Footer card untuk konsistensi */
.action-buttons-card {
  background: linear-gradient(135deg, #f8f9fa, #eef2f7);
  padding: 10px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

body.body--dark .action-buttons-card {
  background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Tombol aksi umum */
.card-action-btn {
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  padding: 6px 14px;
  color: white !important;
  background-color: #082f6d;
  transition: all 0.2s ease-in-out;
}

.card-action-btn:hover {
  background-color: #0a3b8d;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

body.body--dark .card-action-btn {
  background-color: #0d4ab5;
}

body.body--dark .card-action-btn:hover {
  background-color: #155ed9;
}

/* Tombol logout */
.logout-btn {
  background-color: #c62828;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

body.body--dark .logout-btn {
  background-color: #e53935;
}

body.body--dark .logout-btn:hover {
  background-color: #f44336;
}
@media (max-width: 1023px) {
  .logo-link img {
    width: 46px !important;
    height: auto !important;
    transform: translateY(-2px);
  }
}

/* Tambahan style untuk action-buttons-mobile */
.action-buttons-mobile q-btn {
  background-color: #f8f9fa; /* Warna latar belakang lembut */
  color: #082f6d; /* Warna teks serasi */
  border-radius: 50%; /* Bentuk bulat */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* Bayangan lembut */
  transition: all 0.3s ease-in-out; /* Animasi halus */
}

.action-buttons-mobile q-btn:hover {
  background-color: #eef2f7; /* Warna hover lebih terang */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Bayangan lebih besar saat hover */
}

.action-buttons-mobile q-btn:active {
  background-color: #dce4ec; /* Warna saat ditekan */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bayangan lebih kecil saat ditekan */
}

/* Custom drawer styles */
.custom-drawer {
  /* Tambahkan bayangan dan radius pada drawer */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px 0 0 8px; /* Radius hanya di sisi kiri */
}

.custom-header {
  /* Gaya khusus untuk header drawer */

  color: white;
  padding: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.custom-item {
  /* Gaya untuk item menu di drawer */
  padding: 12px 16px;
  transition: background 0.3s;
}

.custom-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.custom-icon {
  /* Ukuran dan warna ikon di drawer */
  font-size: 20px;
  color: #082f6d;
}

.custom-separator {
  /* Gaya untuk separator di drawer */
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 0;
}

.custom-toggle {
  /* Gaya untuk toggle dark mode di drawer */
  color: #082f6d;
}

body.body--dark .custom-icon {
  color: #3D98EF !important; /* Biru cerah untuk dark mode */
}

body.body--dark .custom-text {
  color: #fff !important; /* Warna teks putih untuk dark mode */
}

body.body--dark .custom-toggle {
  background-color: #3D98EF !important; /* Warna toggle biru cerah untuk dark mode */
}

/* Tambahan untuk background body di dark mode */
body.body--dark {
  background-image: url('https://web.whatsapp.com/img/bg-chat-tile-light_7edb3f3a.png'); /* Motif seperti WhatsApp */
  background-repeat: repeat; /* Ulangi motif */
  background-size: auto; /* Ukuran asli motif */
}

/* Gaya untuk separator kustom */
.custom-separator {
  background-color: #ccc; /* Default separator color */
}

body:not(.body--dark) .custom-separator {
  background-color: #fff; /* White mode separator color */
}
</style>
