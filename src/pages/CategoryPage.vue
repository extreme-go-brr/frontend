<template>
  <q-page class="category-page q-pa-md" style="max-width: 1400px; margin: 0 auto;">
    <div class="row items-center q-gutter-xl q-pb-xl">
        <!-- LEFT: Full Banner Image -->
        <div class="col-12 col-md-6">
          <q-img
            src="/carousel/rectangle.png"
            alt="SiPEED M1S Dock Series"
            style="border-radius: 12px; width: 100%"
            fit="cover"
          />
        </div>

        <!-- RIGHT: Electronic Component Cards -->
        <div class="col-12 col-md-5">
          <div class="text-h6 text-primary q-mb-md">Electronic Component</div>
          <div class="row q-gutter-md no-wrap">
            <q-card
              v-for="(item, index) in sampleComponents"
              :key="index"
              flat
              bordered
              class="component-card"
            >
              <q-img :src="item.image" alt="Component" ratio="1" style="border-radius: 6px" />
              <q-card-section class="text-center text-bold text-primary">
                {{ item.title }}
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card class="filter-card q-pa-md">
          <q-list separator>
            <q-item-label header class="text-h6 text-weight-bold">Filter</q-item-label>

            <q-expansion-item
              label="Categories"
              default-opened
              header-class="text-weight-bold"
              v-if="categories.length > 0"
            >
              <q-item
                clickable
                v-ripple
                :active="selectedCategoryId === null"
                @click="selectCategory(null)"
              >
                <q-item-section>All Products</q-item-section>
              </q-item>
              <q-item
                v-for="category in categories"
                :key="category.id"
                clickable
                v-ripple
                :active="selectedCategoryId === category.id"
                @click="selectCategory(category.id)"
              >
                <q-item-section>{{ category.name }}</q-item-section>
              </q-item>
            </q-expansion-item>
            <div v-else-if="loadingCategories" class="q-pa-md text-center">
              <q-spinner-dots color="primary" size="2em" />
              <p class="text-grey-6">Loading categories...</p>
            </div>
            <div v-else class="q-pa-md text-grey-6">No categories found.</div>

            <q-separator />

            <q-item-label header class="text-h6 text-weight-bold q-mt-md">Sort by</q-item-label>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="sortBy" val="latest" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Latest Products</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="sortBy" val="highest_price" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Highest price</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="sortBy" val="lowest_price" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Lowest price</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item-label header class="text-h6 text-weight-bold q-mt-md">Price</q-item-label>
            <q-item>
              <q-item-section>
                <q-input
                  v-model.number="minPrice"
                  type="number"
                  label="Minimum Price"
                  filled
                  dense
                  class="q-mb-sm"
                  clearable
                  @clear="minPrice = null"
                >
                  <template v-slot:prepend>
                    Rp
                  </template>
                </q-input>
                <q-input
                  v-model.number="maxPrice"
                  type="number"
                  label="Maximum Price"
                  filled
                  dense
                  clearable
                  @clear="maxPrice = null"
                >
                  <template v-slot:prepend>
                    Rp
                  </template>
                </q-input>
                <q-btn label="Apply" color="primary" class="q-mt-md" @click="applyFilters" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-9">
        <ProductAll
          :category-id-prop="selectedCategoryId"
          :sort-by-prop="sortBy"
          :min-price-prop="appliedMinPrice"
          :max-price-prop="appliedMaxPrice"
          :search-term-prop="searchTerm"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useQuasar } from 'quasar';

import ProductAll from 'src/components/ProductAll.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const baseUrl = import.meta.env.VITE_STRAPI_API_URL;

interface Category {
  id: number;
  name: string;
}

const selectedCategoryId = ref<number | null>(null);
const sortBy = ref<string | null>('latest');
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const appliedMinPrice = ref<number | null>(null); // This is what ProductAll uses
const appliedMaxPrice = ref<number | null>(null); // This is what ProductAll uses
const searchTerm = ref<string | null>(null);

const categories = ref<Category[]>([]);
const loadingCategories = ref(false);
const sampleComponents = [
  { title: 'STM32F407V Dev Board', image: '/statics/sample/stm32f407.jpg' },
  { title: 'STM32F401', image: '/statics/sample/stm32f401.jpg' },
  { title: 'SiPEED M1S Dock', image: '/statics/sample/sipeed.jpg' },
  { title: 'MICROBIT', image: '/statics/sample/microbit.jpg' },
];
async function fetchCategories() {
  loadingCategories.value = true;
  try {
    const response = await axios.get(`${baseUrl}/api/categories`);
    console.log("[CategoryPage] Strapi Categories API Response:", response.data.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.value = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name, // Corrected access to name
    }));
  } catch (error) {
    console.error('[CategoryPage] Error fetching categories:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load categories.',
      position: 'top',
    });
  } finally {
    loadingCategories.value = false;
  }
}

const selectCategory = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId;
  void router.replace({
    query: {
      ...route.query,
      categoryId: categoryId !== null ? String(categoryId) : undefined,
    }
  });
};

const applyFilters = () => {
  // If minPrice or maxPrice is null/empty/0, treat it as undefined
  // to remove the filter from the query parameters,
  // which will make ProductAll treat it as 'no minimum' or 'no maximum'.
  appliedMinPrice.value = minPrice.value === null || minPrice.value === 0 ? null : minPrice.value;
  appliedMaxPrice.value = maxPrice.value === null || maxPrice.value === 0 ? null : maxPrice.value;

  void router.replace({
    query: {
      ...route.query,
      minPrice: appliedMinPrice.value !== null ? String(appliedMinPrice.value) : undefined,
      maxPrice: appliedMaxPrice.value !== null ? String(appliedMaxPrice.value) : undefined,
    }
  });
};

// Watch route query parameters to initialize filter states correctly
watch(() => route.query.categoryId, (newId) => {
  selectedCategoryId.value = newId ? Number(newId) : null;
}, { immediate: true });

watch(sortBy, (newSortBy) => {
  void router.replace({
    query: {
      ...route.query,
      sortBy: newSortBy || undefined,
    }
  });
});

onMounted(() => {
  void fetchCategories();
  if (route.query.sortBy) {
    sortBy.value = route.query.sortBy as string;
  }
  if (route.query.minPrice) {
    minPrice.value = Number(route.query.minPrice) || null;
    appliedMinPrice.value = Number(route.query.minPrice) || null;
  } else {
    minPrice.value = null;
    appliedMinPrice.value = null;
  }
  if (route.query.maxPrice) {
    maxPrice.value = Number(route.query.maxPrice) || null;
    appliedMaxPrice.value = Number(route.query.maxPrice) || null;
  } else {
    maxPrice.value = null;
    appliedMaxPrice.value = null;
  }
  if (route.query.searchTerm) {
    searchTerm.value = route.query.searchTerm as string;
  }
});
</script>

<style scoped>
.category-page {
  max-width: 1440px;
  margin: 0 auto;
}

.filter-card {
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.q-expansion-item {
  margin-bottom: 8px;
}

.q-item-label.header {
  padding-bottom: 8px;
}

/* Style for active category item */
.q-item--active {
  background-color: #e0f2f7; /* Light blue background for active category */
  color: #082f6d; /* Dark blue text for active category */
  font-weight: bold;
}

/* Ensure the ProductAll component takes full width of its column */
.col-md-9 {
  display: flex;
  flex-direction: column;
}
</style>
