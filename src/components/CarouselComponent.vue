<template>
  <div class="q-pa-md">
    <div class="text-h6  text-center"></div>
    <div class="row justify-between">
      <!-- Carousel Besar: Selalu tampil -->
      <div class="col-12 col-md-8">
        <q-carousel
          animated
          v-model="slide"
          navigation
          infinite
          arrows
          :autoplay="autoplay"
          transition-prev="slide-right"
          transition-next="slide-left"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
          class="rounded-borders"
          style="max-height: 445px; max-width: 896px;"
        >
          <q-carousel-slide :name="1" img-src="/carousel/Promo/5.png" />
          <q-carousel-slide :name="2" img-src="/carousel/Promo/6.png" />
          <q-carousel-slide :name="3" img-src="/carousel/Promo/3.png" />
          <q-carousel-slide :name="4" img-src="/carousel/Promo/4.png" />
          <q-carousel-slide :name="5" img-src="/carousel/rectangle.png" />
        </q-carousel>
      </div>

      <!-- Gambar Samping: hanya tampil di desktop -->
      <div class="col-12 col-md-4 column q-gutter-md gambar-samping">
        <q-img
          src="/carousel/rectangle.png"
          style="max-height: 193px"
          class="rounded-borders"
        />
        <q-img
          src="/carousel/Promo/4.png"
          style="max-height: 193px"
          class="rounded-borders"
          name="2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const slide = ref(1)
const autoplay = ref(true)

let interval: ReturnType<typeof setInterval> | undefined

function startAutoplay() {
  clearInterval(interval)
  interval = setInterval(() => {
    if (autoplay.value) {
      slide.value = (slide.value % 5) + 1 // Ganti 3 menjadi 4
    }
  }, 3000)
}

watch(autoplay, (val) => {
  if (val) {
    startAutoplay()
  } else {
    clearInterval(interval)
  }
})

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>



<style scoped>
.rounded-borders {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.column {
  display: flex;
  flex-direction: column;
}

/* Tambahkan ini untuk mengatur lebar gambar samping */
.gambar-samping {
  display: flex;
  flex-direction: column;
}

/* Sembunyikan gambar samping di tablet dan mobile */
 .gambar-samping {
  display: flex;
}
@media (max-width: 1023px) {
  .gambar-samping {
    display: none !important;
  }
}
</style>
