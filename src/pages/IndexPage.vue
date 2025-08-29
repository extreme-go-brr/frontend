
<template>
<div class=" content-wrapper" >
  <div style=" margin: auto; max-width: 1400px;" ><CarouselComponent /></div>
  <div class="full-divider"></div>
  <div  style="width: 100%; margin: auto;">
<ProductComponent />
  </div>
<div class="full-divider"></div>
<div><RecomComponent/></div></div>
<div class="faq-wrapper" style="background-color: var(--q-body-background);">
  <div class="q-mx-auto" style="max-width: 1400px; ">
    <FaqComponent />
  </div>
</div>
</template>
<script setup lang="ts">
import ProductComponent from 'components/ProductComponent.vue';
import CarouselComponent from 'src/components/CarouselComponent.vue';
import FaqComponent from 'src/components/FaqComponent.vue';
import RecomComponent from 'src/components/RecomComponent.vue';
</script>
<style scoped>
/* Tambah jarak antar komponen */
.section-spacing {
  margin-bottom: 32px;
}

/* Jarak antara kategori dan FAQ */
.section-spacing-bottom {
  margin-bottom: 48px;
}

/* Padding luar semua komponen utama */
.q-mx-auto {
  padding-left: 24px;
  padding-right: 24px;
}

/* FAQ section tetap seperti sebelumnya */
.faq-wrapper {
  width: 100%;
  padding: 56px 0;
}

/* Optional: responsif tambahan */
@media (min-width: 1024px) {
  .q-mx-auto {
    padding-left: 80px;
    padding-right: 80px;
  }
}

.content-wrapper {
  background-color: var(--q-dark-page);
  padding-top: 40px;
}

.full-divider {
  width: 98.4vw;
  height: 15px; /* sebelumnya 1px → sekarang lebih tebal */
  background-color: var(--q-body-background);
  margin: 32px 0;
  position: relative;
  left: 50%;
  transform: translateX(-49.6%);
}
/* Tambahkan padding kiri-kanan pada .content-wrapper untuk laptop ke atas */
@media (min-width: 1024px) {
  .content-wrapper {
    padding-left: 100px;
    padding-right: 100px;
  }
}
</style>
