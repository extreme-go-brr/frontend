<template>
  <div>
    <div v-if="showPreloader" class="preloader flex flex-center">
      <q-circular-progress
        show-value
        font-size="16px"
        :value="progressValue"
        size="84px" :thickness="0.22"
        color="primary" track-color="grey-3"
        class="q-ma-md"
      >
        {{ progressValue }}%
      </q-circular-progress>
    </div>

    <q-layout view="hHh LpR lff" v-if="!showPreloader">
      <q-header elevated class="text-primary" style="height: 64px;">
        <q-toolbar class="q-toolbar-admin" style="padding: 16px;">
          <q-btn flat round dense icon="menu" @click="toggleDrawer" aria-label="Toggle Navigation" />

          <div class="text-h6 text-weight-bold q-ml-sm" src="icons/logomaker.svg">
            Admin Panel
          </div>
          <q-space />

          <q-btn flat round dense icon="account_circle" class="q-mr-sm">
            <q-menu anchor="bottom right" self="top right" transition-show="jump-down" transition-hide="jump-up">
              <q-card style="width: 200px; max-width: 90vw">
                <q-card-section class="text-subtitle2 text-bold">Admin User</q-card-section>
                <q-separator />
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section @click="router.push('/admin/profile')" style="cursor: pointer;">Profile</q-item-section>
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
                  <q-item clickable v-ripple @click="logoutAdmin">
                    <q-item-section avatar>
                      <q-icon name="logout" />
                    </q-item-section>
                    <q-item-section>Logout</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawerOpen" show-if-above bordered :width="250">
        <q-list>
          <q-item-label header class="text-h6 text-weight-bold">Navigation</q-item-label>

          <q-item clickable v-ripple to="/admin/dashboard">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/products">
            <q-item-section avatar>
              <q-icon name="inventory_2" />
            </q-item-section>
            <q-item-section>Manage Products</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/category">
            <q-item-section avatar>
              <q-icon name="category" />
            </q-item-section>
            <q-item-section>Categories</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/orders">
            <q-item-section avatar>
              <q-icon name="receipt_long" />
            </q-item-section>
            <q-item-section>Orders</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/users">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>Users</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/adminchat">
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>Admin Chat</q-item-section>
          </q-item>
          <q-separator />

          <q-item clickable v-ripple to="/admin/settings">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Back to Main Site</q-item-section>
          </q-item>
          </q-list>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>


    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const isDarkMode = ref(false);

/** === Preloader (for initial app load only) === */
const showPreloader = ref(true);
const progressValue = ref(0); // Reactive variable for circular progress value
let interval: ReturnType<typeof setInterval> | null = null; // To store the interval ID

  onMounted(() => {
  // Simulate progress
  interval = setInterval(() => {
    if (progressValue.value < 100) {
      progressValue.value += 10; // Increment value
    } else {
      clearInterval(interval as ReturnType<typeof setInterval>); // Stop when 100
      setTimeout(() => {
        showPreloader.value = false; // Hide preloader after reaching 100% and a small delay
      }, 300); // Small delay to let the 100% show
    }
  }, 100); // Update every 100ms

  // Fallback to hide preloader after a fixed time, in case progress simulation fails
  setTimeout(() => {
    if (showPreloader.value) { // Only hide if it's still showing
      showPreloader.value = false;
      if (interval) {
        clearInterval(interval);
      }
    }
  }, 1500); // Your original 1.5 seconds fallback

  // Load theme from localStorage
  const storedTheme = localStorage.getItem('theme');
  isDarkMode.value = storedTheme === 'dark';
  $q.dark.set(isDarkMode.value);
});

watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

/** === Admin Drawer Control === */
const drawerOpen = ref(true); // Default: drawer terbuka di layout admin
const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

/** === Admin Logout Functionality === */
const logoutAdmin = () => {
  // Lakukan logika logout di sini
  // Contoh: Hapus token autentikasi dari localStorage/sessionStorage
  // localStorage.removeItem('adminToken');
  $q.notify({
    message: 'Logged out successfully!',
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
  });
  // Redirect ke halaman login admin atau halaman utama
  void router.push('/login'); // Atau '/admin/login' jika ada halaman login khusus admin
};
</script>

<style scoped>
/* Preloader */
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
.ytp-spinner {
  width: 64px;
  height: 64px;
  animation: spin 1s linear infinite;
}
.ytp-spinner-container,
.ytp-spinner-rotator,
.ytp-spinner-left,
.ytp-spinner-right {
  position: relative;
}
.ytp-spinner-circle {
  width: 100%;
  height: 100%;
  border: 6px solid #082f6d;
  border-top-color: #e0f2f1;
  border-radius: 50%;
  box-sizing: border-box;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ANIMASI MASUK: jatuh dari atas (untuk menu dropdown) */
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

/* ANIMASI KELUAR: dilempar ke atas (untuk menu dropdown) */
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

/* Header Admin */
.q-header {
  background: var(--q-item-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.q-toolbar-admin {
  padding: 0 16px; /* Padding standar untuk toolbar admin */
}

/* Footer Admin Minimalis */
.q-footer {
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
}
</style>
