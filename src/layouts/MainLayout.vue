<template>
  <div>
    <div v-if="showPreloader" class="preloader flex flex-center">
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
        <div >{{ progressValue }}%</div>
      </q-circular-progress>
    </div>

    <q-layout view="hHh lpR lff" v-if="!showPreloader" style="background-color: var(--q-body-background);">
      <!-- Header -->
      <div class="app-header-wrapper">
        <AppHeader />
      </div>

      <!-- Content -->
      <q-page-container class="page-container-with-margin">
        <router-view />
      </q-page-container>

      <!-- Footer -->
      <AppFooter />
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/AppHeader.vue';
import AppFooter from 'src/components/AppFooter.vue';

const $q = useQuasar();

// Preloader
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
  }, 1500);
});

// Dark Mode
const isDarkMode = ref(false);
onMounted(() => {
  const storedTheme = localStorage.getItem('theme');
  isDarkMode.value = storedTheme === 'dark';
  $q.dark.set(isDarkMode.value);
});

watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});
</script>

<style scoped>
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

/* Default: Mobile & Tablet */
.page-container-with-margin {
  margin-top: 50px;
}

/* Laptop & Desktop */
@media (min-width: 1024px) {
  .page-container-with-margin {
    margin-top: 100px;
  }
}

body {
  font-family: "Lato", sans-serif;
  font-weight: 900;
  font-style: bold;
}
</style>

