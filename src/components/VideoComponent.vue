<template>
  <div class="product-grid-container">
    <!-- Tombol Show More / Show Less -->
    <div class="text-center q-mt-lg q-mb-md text-primary">
      <q-btn
        v-if="hasMoreProducts"
        :label="showAll ? 'Show Less' : 'Show More'"
        @click="toggleShowAll"
        style="height: 50px; width: 300px; border: 4px solid #082f6d; border-radius: 10px"
      />
    </div>

    <!-- Dialog Detail Produk -->
    <q-dialog v-model="dialogVisible">
      <q-card class="dialog-card">
        <div align="right">
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="close-button"
            style="margin-right: 10px"
          />
        </div>

        <q-card-section class="dialog-main-content">
          <div class="row q-col-gutter-md dialog-content-wrapper">
            <!-- Kolom Kiri -->
            <div class="col-12 col-md-10 dialog-left-col">
              <q-scroll-area class="left-col-scroll-area">
                <!-- Media Utama -->
                <div class="main-media-container q-mb-md">
                  <template v-if="isImage(selectedMediaUrl)">
                    <q-img :src="selectedMediaUrl" class="carousel-image" />
                  </template>
                  <template v-else-if="isVideo(selectedMediaUrl)">
                    <video
                      :src="selectedMediaUrl"
                      class="carousel-video"
                      controls
                      autoplay
                      muted
                    ></video>
                  </template>
                  <template v-else>
                    <q-img src="fallback.jpg" class="carousel-image" />
                  </template>
                </div>

                <!-- Judul Produk -->
                <div
                  class="text-h3 text-weight-medium q-pa-lg"
                  style="background-color: var(--q-input-background)"
                >
                  {{ selectedProduct?.title }}
                </div>

                <!-- Tabs -->
                <q-tabs v-model="activeTab" dense align="left">
                  <q-tab name="description" label="Description" class="q-pa-md" />
                </q-tabs>
                <q-tab-panels v-model="activeTab" animated>
                  <q-tab-panel name="description">
                    <div class="q-mt-md product-description-area">
                      <div
                        class="text-subtitle2 q-mb-sm text-weight-bold"
                        v-html="parsedContent"
                      ></div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-scroll-area>
            </div>

            <!-- Kolom Kanan (Thumbnail) -->
            <div class="col-12 col-md-2 dialog-right-col">
              <div class="full-height">
                <div
                  class="vertical-thumbnail-container"
                  v-if="selectedProduct?.media && selectedProduct.media.length > 1"
                >
                  <div
                    v-for="(mediaUrl, idx) in selectedProduct?.media"
                    :key="idx"
                    class="thumbnail-item"
                    :class="{ 'selected-thumbnail': idx === selectedImageIndex }"
                    @click="selectedImageIndex = idx"
                  >
                    <q-img v-if="isImage(mediaUrl)" :src="mediaUrl" class="thumbnail-image" />
                    <div v-else-if="isVideo(mediaUrl)" class="thumbnail-video-placeholder">
                      <q-icon name="videocam" size="32px" color="white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Grid Produk -->
    <div class="row q-col-gutter-lg justify-start">
      <div class="col-12 col-sm-6 col-md-4" v-for="product in displayedProducts" :key="product.id">
        <q-card flat bordered class="tutorial-card" @click="openDialog(product)">
          <q-img
            :src="product.media[0] || 'fallback.jpg'"
            :ratio="16 / 9"
            class="tutorial-image"
            style="min-height: 160px; max-height: 180px"
          >
            <q-chip
              dense
              color="primary"
              text-color="white"
              icon="star"
              class="absolute-top-right q-ma-sm"
              v-if="product.isFeatured"
            >
              Featured
            </q-chip>
          </q-img>

          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-xs">{{ product.title }}</div>
            <div class="text-caption text-grey-7">{{ getShortDesc(product) }}</div>
            <q-linear-progress
              :value="product.progress"
              color="primary"
              class="q-my-sm"
              rounded
              size="8px"
              v-if="product.progress !== undefined && product.progress > 0"
            />
            <div class="text-caption text-grey-7">{{ getShortDesc(product) }}</div>
          </q-card-section>

          <q-card-actions align="right" class="q-ml-sm q-pa-md card-actions">
  <q-btn flat dense color="primary" class="read-more-btn">
    <div class="row items-center no-wrap">
      <span class="q-mr-xs">Read More</span>
      <q-icon name="launch" size="18px" />
    </div>
  </q-btn>
</q-card-actions>



        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  documentId: string;
  title: string;
  content: string;
  media: string[];
  category?: string;
  progress?: number;
  shortDesc?: string;
  isFeatured?: boolean;
}

const route = useRoute();
const baseUrl = import.meta.env.VITE_STRAPI_API_URL;
const props = defineProps<{ limit?: number }>();

const products = ref<Product[]>([]);
const searchTerm = ref((route.query.search as string) || '');
const dialogVisible = ref(false);
const selectedProduct = ref<Product | null>(null);
const selectedImageIndex = ref(0);
const activeTab = ref('description');

const productsPerLoad = 4;
const showAll = ref(false);

// Computed
const displayedProducts = computed(() => {
  if (props.limit) {
    return products.value.slice(0, props.limit);
  }
  return products.value;
});

const hasMoreProducts = computed(() => {
  return (
    products.value.filter((p) => p.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
      .length > productsPerLoad
  );
});

const parsedContent = computed(() => marked(selectedProduct.value?.content || ''));
const selectedMediaUrl = computed(
  () => selectedProduct.value?.media[selectedImageIndex.value] || 'fallback.jpg',
);

// Utils
function isImage(url?: string): boolean {
  return !!url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function isVideo(url?: string): boolean {
  return !!url && /\.(mp4|webm|ogg|mov)$/i.test(url);
}

function toggleShowAll() {
  showAll.value = !showAll.value;
}

function openDialog(product: Product) {
  selectedProduct.value = product;
  selectedImageIndex.value = 0;
  activeTab.value = 'description';
  dialogVisible.value = true;
}

async function fetchProducts() {
  try {
    const res = await axios.get(`${baseUrl}/api/documentations?populate=media`);
    interface ApiMediaItem {
      url: string;
    }
    interface ApiProductItem {
      id: number;
      documentId: string;
      title: string;
      content: string;
      media?: ApiMediaItem[];
      category?: string;
      shortDesc?: string;
      progress?: number;
      isFeatured?: boolean;
    }

    products.value = res.data.data.map((item: ApiProductItem) => {
      const allMedia: string[] = (item.media || []).map((mediaItem: ApiMediaItem) =>
        getImageUrl(mediaItem.url),
      );
      return {
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        content: item.content,
        media: allMedia.length ? allMedia : ['fallback.jpg'],
        category: item.category || 'General',
        shortDesc: item.shortDesc || '',
        progress: item.progress || 0,
        isFeatured: item.isFeatured || false,
      };
    });
  } catch (err) {
    console.error('Fetch Error:', err);
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Failed to load products',
      showConfirmButton: false,
      timer: 3000,
    });
  }
}

onMounted(fetchProducts);

watch(
  () => route.query.search,
  (val) => {
    searchTerm.value = (val as string) || '';
    showAll.value = false;
  },
);

const getImageUrl = (url?: string) => (url?.startsWith('http') ? url : `${baseUrl}${url}`);

// function untu mengambil beberapa kata depan
function getShortDesc(product: Product): string {
  if (product.category === 'General' && product.content) {
    // Ambil 10 kata pertama dari content
    const words = product.content.split(/\s+/).slice(0, 10).join(' ');
    return words + ' ...';
  }
  return product.shortDesc || '';
}
</script>

<style scoped>
/* --- SCROLLBAR HIDE --- */
.container::-webkit-scrollbar,
.left-col-scroll-area::-webkit-scrollbar {
  display: none;
}
.left-col-scroll-area {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* --- GRID CONTAINER --- */
.product-grid-container {
  margin: auto;
  max-width: 1340px;
  min-width: 900px;
}

/* --- CARD TUTORIAL --- */
.tutorial-card {
  border-radius: 16px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  box-shadow: 0 2px 12px rgba(74, 144, 226, 0.08);
  min-height: 320px;
  max-height: 340px;
  display: flex;
  flex-direction: column;
}
.tutorial-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 32px rgba(74, 144, 226, 0.18);
}
.tutorial-image {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
  width: 100%;
  min-height: 160px;
  max-height: 180px;
  display: block;
}
.absolute-top-right {
  position: absolute;
  top: 0;
  right: 0;
}

/* --- DIALOG --- */
.dialog-card {
  width: 80%;
  max-width: 1440px;
  border-radius: 8px;
}
.close-button {
  z-index: 10;
}
.dialog-main-content {
  padding: 10px;
}
.dialog-content-wrapper {
  display: flex;
  flex-wrap: nowrap;
}
.left-col-scroll-area {
  height: calc(90vh - 120px);
}
.dialog-right-col {
  position: sticky;
  top: 10px;
  align-self: flex-start;
  z-index: 1;
}
.main-media-container {
  width: 100%;
  position: relative;
  height: 650px;
}
.carousel-image,
.carousel-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.vertical-thumbnail-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 10px 0;
  align-items: center;
}
.thumbnail-item {
  position: relative;
  width: 100%;
  max-width: 250px;
  height: 200px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.2s ease;
}
.thumbnail-item.selected-thumbnail {
  border-color: #082f6d;
}
.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.thumbnail-video-placeholder {
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.product-description-area {
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

/* --- RESPONSIVE --- */
@media (min-width: 1340px) {
  .product-card {
    height: 450px;
  }
}
@media (min-width: 700px) and (max-width: 950px) {
  .product-grid-container {
    max-width: 699px;
    min-width: 710px;
  }
}
@media (max-width: 699px) {
  .product-grid-container {
    max-width: 699px;
    min-width: 100px;
  }
}
@media (max-width: 599px) {
  .product-grid-container .row {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px;
  }
  .product-grid-container .col-12,
  .product-grid-container .col-sm-6,
  .product-grid-container .col-md-4 {
    grid-column: span 1 !important;
    width: 100% !important;
    max-width: 100% !important;
    flex: unset !important;
  }
  .tutorial-image {
    min-height: 120px;
    max-height: 140px;
  }
  .tutorial-card {
    min-height: 240px;
    max-height: 260px;
  }
}
/* Tambahan agar tombol Read More tetap di dalam card */
.card-actions {
  margin-top: auto; /* dorong tombol ke bawah dalam card */
  width: 100%;
  box-sizing: border-box;
}

/* Mobile fix */
@media (max-width: 599px) {
  .tutorial-card {
    min-height: 240px;
    /* hilangkan max-height agar isi + tombol tidak overflow */
    max-height: none;
    display: flex;
    flex-direction: column;
  }

  .tutorial-image {
    min-height: 120px;
    max-height: 140px;
  }

  .card-actions {
    padding: 8px; /* lebih rapat di mobile */
  }
}
.read-more-btn {
  text-transform: none;   /* tetap huruf biasa, bukan uppercase */
  white-space: nowrap;    /* cegah teks pecah baris */
  font-weight: 500;
}


</style>
