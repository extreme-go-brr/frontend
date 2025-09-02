<template>
  <div class="q-pa-xl section-bg">
    <div class="text-center text-h5 q-mb-md text-weight-bold text-primary">
      Popular Category
    </div>
    <q-separator
      color="primary"
      size="2px"
      class="q-mb-md"
      style="border-radius: 5px; width: 200px; position: relative; left: 50%; transform: translateX(-50%);"
    />
    <p class="text-subtitle2 text-grey-7 q-mb-md q-mt-md text-center">
      Explore our diverse range of product categories, each carefully curated to meet your specific needs and requirements.
    </p>

    <!-- Desktop view -->
    <div v-if="$q.screen.gt.sm" class="row justify-center items-end q-gutter-xl">
      <q-card
        v-for="(category, index) in categories"
        :key="index"
        flat
        bordered
        class="my-card overflow-hidden"
        style="cursor: pointer;"
        :class="getPodiumClass(index)"
      >
        <q-img
          :src="category.image"
          :alt="category.name"
          class="full-image"
        />
      </q-card>
    </div>

    <!-- Mobile carousel view -->
    <div v-else class="row justify-center">
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
          height="300px"
          class="rounded-borders"
        >
          <q-carousel-slide
            v-for="(category, index) in categories"
            :key="index"
            :name="index + 1"
            :img-src="category.image"
          />
        </q-carousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const categories = [
  {
    name: 'Second Place',
    image: '/category/category2.png',
  },
  {
    name: 'First Place',
    image: '/category/category1.png',
  },
  {
    name: 'Third Place',
    image: '/category/category3.png',
  },
];

const slide = ref(1);
const autoplay = ref(true);

// Menentukan tinggi masing-masing podium
function getPodiumClass(index: number) {
  if (index === 0) return 'podium-second';
  if (index === 1) return 'podium-first';
  if (index === 2) return 'podium-third';
  return '';
}
</script>

<style scoped>
.section-bg {
  margin-top: 40px;
  border-radius: 10px;
}

.my-card {
  width: 100%;
  max-width: 280px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.my-card:hover {
  transform: translateY(-5px);
}

.full-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* Tinggi podium */
.podium-first {
  height: 360px;
}
.podium-second {
  height: 300px;
}
.podium-third {
  height: 260px;
}

/* Responsive: gunakan tinggi tetap di carousel */
@media (max-width: 600px) {
  .section-bg {
    padding: 16px;
  }
}
</style>
