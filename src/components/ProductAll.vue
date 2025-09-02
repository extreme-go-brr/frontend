
<template>
  <div class="product-grid-container">

    <div class="product-grid">
      <div
        v-for="product in products"
        :key="product.documentId || product.id"
        class="product-card-wrapper q-py-sm"
      >
        <q-card class="product-card q-hoverable q-pa-sm">
          <div class="product-image-container" @click="openDialog(product)">
            <img
              :src="product.images[0] || 'fallback.jpg'"
              :alt="product.name"
              class="product-img"
            />
          </div>
          <q-card-section class="product-details-section">
            <div class="text-subtitle2 text-weight-bold">
              {{ product.name }}
              <div class="text-h5 text-weight-bold product-price q-my-sm">
                Rp{{ formatPrice(product.price) }}
              </div>
            </div>
          </q-card-section>
          <q-btn
            label="Add to Cart"
            class="add-to-cart-btn"
            style="background-color: #082f6d; border-radius: 8px"
            @click="handleAddToCart(product.id)"
          />
        </q-card>
      </div>
    </div>

    <!-- Optional: Show loading spinner or message -->
    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner-dots color="primary" size="3em" />
      <p class="text-grey-6">Loading products...</p>
    </div>
    <div v-else-if="products.length === 0 && !loading" class="text-center q-mt-xl">
      <p class="text-grey-6">No products found matching your criteria.</p>
    </div>

    <!-- Product Details Dialog -->
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
          <div class="row q-col-gutter-md row justify-end dialog-content-wrapper">
            <div class="col-12 col-md-8 dialog-left-col">
              <q-scroll-area class="left-col-scroll-area">
                <q-img :src="selectedImage || 'fallback.jpg'" class="carousel-image" />
                <div
                  class="row thumbnail-container q-pa-sm"
                  v-if="selectedProduct?.images && selectedProduct.images.length > 1"
                >
                  <q-img
                    v-for="(img, idx) in selectedProduct?.images"
                    :key="idx"
                    :src="img"
                    class="thumbnail-image"
                    :class="{ 'selected-thumbnail': idx === selectedImageIndex }"
                    @click="selectedImageIndex = idx"
                  />
                </div>
                <q-tabs v-model="activeTab" dense align="left">
                  <q-tab name="description" label="Description" />
                  <q-tab name="Technical_Details" label="Technical Details" />
                </q-tabs>
                <q-tab-panels v-model="activeTab" animated>
                  <q-tab-panel name="description">
                    <div class="q-mt-md product-description-area">
                      <div
                        class="text-subtitle2 q-mb-sm text-weight-bold"
                        v-html="parsedDescription"
                      ></div>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="Technical_Details">
                    <div class="q-mt-md product-description-area">
                      <div
                        class="text-subtitle2 q-mb-sm text-weight-bold"
                        v-html="parsedTechnicalDetails"
                      ></div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-scroll-area>
            </div>

            <div class="col-12 col-md-4 dialog-right-col">
              <div class="text-h4 text-weight-medium">
                {{ selectedProduct?.name }}
              </div>
              <div class="row items-center q-mb-sm" v-if="selectedProduct?.rating">
                <q-icon name="star" color="yellow-8" size="20px" />
                <span class="q-ml-xs text-body1 text-bold">{{
                  selectedProduct?.rating
                }}</span>
              </div>
              <div class="text-h4 text-weight-bold q-mt-xl">
                Price: Rp{{ formatPrice(selectedProduct?.price || 0) }}
              </div>
              <div class="text-h6 text-grey-7 q-mt-sm">
                Stock: {{ selectedProduct?.stock }}
              </div>
              <div class="column">
                <div class="text-h6 text-primary">
                  <q-icon name="local_shipping" /> Set Quantity and order now
                </div>
                <div class="row">
                  <div
                    class="row q-mb-md q-mt-md justify-between"
                    style="
                      border: 2px solid gray;
                      border-radius: 5px 0px 0px 5px;
                      padding: 5px;
                      height: 44px;
                      width: 26%;
                    "
                  >
                    <q-btn flat dense icon="remove" @click="decreaseQuantity" />
                    <div class="text-h6">{{ quantity }}</div>
                    <q-btn flat dense icon="add" @click="increaseQuantity" />
                  </div>
                  <q-btn
                    label="Add to Cart"
                    @click="selectedProduct?.id && addToCart(selectedProduct.id, quantity)"
                    class="q-mt-md"
                    style="
                      height: 44px;
                      margin-left: -2px;
                      border: 4px solid #082f6d;
                      width: 60%;
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { marked } from 'marked';
import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/user-stores'; // Adjust path as needed

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const baseUrl = import.meta.env.VITE_STRAPI_API_URL;

interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  imageUrl: string;
  rating: number | null;
  technical_details: string | null;
}

interface Cart {
  id: number;
  documentId: string;
  total_price: number;
  statuses: string;
  cart_items?: any[];
  users_permissions_user?: any;
}

interface StrapiCartItemRaw {
  id: number;
  documentId?: string;
  quantity: number;
  price_at_purchase: number;
  // Jika product dan cart di-populate langsung (tanpa 'data' atau 'attributes'):
  product?: { id: number; documentId: string; name: string; price: number; };
  cart?: { id: number; documentId: string; total_price: number; statuses: string; };
}

interface StrapiCartItemsApiResponse {
  data: StrapiCartItemRaw[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// DEFINE PROPS for receiving filters from parent (CategoryPage.vue)
const props = defineProps<{
  categoryIdProp?: number | null; // Numeric ID dari CategoryPage
  sortByProp?: string | null;
  minPriceProp?: number | null;
  maxPriceProp?: number | null;
  searchTermProp?: string | null;
}>();

const products = ref<Product[]>([]);
const loading = ref(false); // Add loading state

const dialogVisible = ref(false);
const selectedProduct = ref<Product | null>(null);
const selectedImageIndex = ref(0);
const quantity = ref(1);
const activeTab = ref('description');

const parsedDescription = computed(() => marked(selectedProduct.value?.description || ''));
const parsedTechnicalDetails = computed(() => marked(selectedProduct.value?.technical_details || ''));
const selectedImage = computed(() => selectedProduct.value?.images[selectedImageIndex.value] || 'fallback.jpg');

async function fetchProducts() {
  loading.value = true;
  try {
    let url = `${baseUrl}/api/products?populate=image`;

    const queryParams = [];

    // Terapkan filter kategori dari props
    if (props.categoryIdProp !== null && props.categoryIdProp !== undefined) {
      // Menggunakan filters[categories][id][$eq] karena ini lebih handal untuk ID numerik
      queryParams.push(`filters[category][id][$eq]=${props.categoryIdProp}`);
    }

    // Terapkan filter pencarian dari props
    if (props.searchTermProp) {
      queryParams.push(`filters[name][$containsi]=${props.searchTermProp}`);
    }

    // Terapkan filter harga dari props
    if (props.minPriceProp !== null && props.minPriceProp !== undefined) {
      queryParams.push(`filters[price][$gte]=${props.minPriceProp}`);
    }
    if (props.maxPriceProp !== null && props.maxPriceProp !== undefined) {
      queryParams.push(`filters[price][$lte]=${props.maxPriceProp}`);
    }

    // Terapkan sorting dari props
    if (props.sortByProp) {
      if (props.sortByProp === 'latest') {
        queryParams.push(`sort=createdAt:desc`); // Sintaks Strapi v4/v5 (bukan _sort)
      } else if (props.sortByProp === 'highest_price') {
        queryParams.push(`sort=price:desc`);
      } else if (props.sortByProp === 'lowest_price') {
        queryParams.push(`sort=price:asc`);
      }
    }

    if (queryParams.length > 0) {
      url += `&${queryParams.join('&')}`;
    }

    console.log("[ProductAll] Fetching products with URL:", url);

    const res = await axios.get(url);
    console.log("[ProductAll] Strapi Products API Response:", res.data.data);

    products.value = res.data.data.map((item: any) => {
      const allImages: string[] = (item.image || []).map((img: any) => getImageUrl(img.url));

      return {
        id: item.id,
        documentId: item.documentId,
        name: item.name,
        price: item.price,
        description: item.description,
        stock: item.stock,
        images: allImages.length ? allImages : ['fallback.jpg'],
        imageUrl: allImages[0] || 'fallback.jpg',
        rating: item.rating || null,
        technical_details: item.technical_details || null,
      };
    });
    // END: Logic dari kode ProductComponent Anda yang berfungsi
    console.log(`[ProductAll] Fetched ${products.value.length} products with filters.`);
  } catch (err) {
    console.error('[ProductAll] Fetch Products Error:', err);
    $q.notify({ type: 'negative', message: 'Failed to load products.' });
  } finally {
    loading.value = false;
  }
}

function openDialog(product: Product) {
  selectedProduct.value = product;
  selectedImageIndex.value = 0;
  quantity.value = 1;
  activeTab.value = 'description';
  dialogVisible.value = true;
}

function increaseQuantity() {
  quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--;
}

async function handleAddToCart(productId: number) {
  if (!userStore.isLoggedIn) {
    $q.dialog({
      title: 'Login Required',
      message: 'You must login to add items to cart.',
      ok: 'Login',
      cancel: 'Cancel',
    }).onOk(() => {
      void router.push('/second/login-akun');
    });
    return;
  }
  await addToCart(productId, 1);
}

async function addToCart(productId: number, qty: number) {
  const token = userStore.token;
  const userDocumentId = userStore.user?.documentId;

  if (!userStore.isLoggedIn || !token || !userDocumentId) {
    $q.notify({ type: 'negative', message: 'You are not logged in or the user ID was not found.' });
    return;
  }

  const product = products.value.find(p => p.id === productId);
  if (!product) {
    $q.notify({ type: 'negative', message: 'Product not found.' });
    return;
  }

  const productPrice = product.price;

  try {
    let cart: Cart;

    // 1. Cari cart aktif user (mengikuti asumsi flat dari ProductComponent Anda)
    const cartRes = await axios.get(`${baseUrl}/api/carts?filters[users_permissions_user][documentId][$eq]=${userDocumentId}&filters[statuses][$eq]=active&populate=cart_items&populate=users_permissions_user`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (cartRes.data.data.length > 0) {
      cart = cartRes.data.data[0]; // Akses langsung
    } else {
      console.debug('[DEBUG] Membuat cart baru untuk user:', userDocumentId);
      const newCartRes = await axios.post(`${baseUrl}/api/carts`, {
        data: { // Data wrapper untuk Strapi
          total_price: 0,
          statuses: 'active',
          users_permissions_user: userDocumentId
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cart = newCartRes.data.data; // Akses langsung
    }

    console.log(`[DEBUG] Mencari cart-item yang sudah ada untuk cart.id: ${cart.id}, productId: ${productId}`);
    const cartItemRes = await axios.get(`${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cart.id}&filters[product][id][$eq]=${productId}&populate=product&populate=cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('[DEBUG] Respon GET cart-items:', cartItemRes.data);

    const existingItem = cartItemRes.data.data?.[0];

    if (existingItem) {
      const newQty = existingItem.quantity + qty; // Akses langsung
      console.debug('[DEBUG] Update cart-item quantity', {
        id: existingItem.id,
        newQty
      });

      await axios.put(`${baseUrl}/api/cart-items/${existingItem.documentId}`, { // documentId untuk PUT
        data: {
          quantity: newQty,
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[DEBUG] Cart item berhasil diupdate:', existingItem.documentId);
    } else {
      console.debug('[DEBUG] Tambah cart-item baru', {
        cart: cart.documentId, // documentId untuk POST
        product: product.documentId, // documentId untuk POST
        quantity: qty,
        price_at_purchase: productPrice
      });

      await axios.post(`${baseUrl}/api/cart-items`, {
        data: {
          quantity: qty,
          price_at_purchase: productPrice,
          cart: cart.documentId,
          product: product.documentId
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[DEBUG] Cart item baru berhasil dibuat.');
    }

    await updateCartTotalPrice(cart.id, cart.documentId, token); // Menggunakan documentId

    dialogVisible.value = false;
    $q.notify({ type: 'positive', message: 'Produk ditambahkan ke keranjang!' });
  } catch (err: any) {
    console.error('[AddToCart Error]', err.response?.data || err.message);
    const strapiError = err.response?.data?.error;
    const errorMessage = strapiError?.message || err.message;
    const errorDetails = strapiError?.details;
    console.error('Strapi Error Message (addToCart):', errorMessage);
    console.error('Strapi Error Details (addToCart):', errorDetails);
    $q.notify({ type: 'negative', message: `Gagal menambahkan ke keranjang: ${errorMessage}` });
  }
}

async function updateCartTotalPrice(cartId: number, cartDocumentId: string, token: string) {
  if (!cartDocumentId) {
    console.error('updateCartTotalPrice: cartDocumentId is missing, cannot update parent cart. Cart ID:', cartId);
    $q.notify({ message: 'Error: Cannot update cart total. Cart ID is missing.', type: 'negative' });
    return;
  }

  try {
    const cartItemsRes = await axios.get<StrapiCartItemsApiResponse>(
      `${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cartId}&populate=product&populate=cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });

    let calculatedTotalPrice = 0;
    for (const item of cartItemsRes.data.data) {
      calculatedTotalPrice += item.quantity * item.price_at_purchase; // Akses langsung
    }

    console.debug('[DEBUG] Total price dihitung ulang:', calculatedTotalPrice);

    await axios.put(`${baseUrl}/api/carts/${cartDocumentId}`, { // documentId untuk PUT
      data: { total_price: calculatedTotalPrice }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`Cart ${cartId} total_price updated to: ${calculatedTotalPrice} using documentId: ${cartDocumentId}`);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Failed to update parent cart total price:', err.response?.data || err.message);
      const strapiError = err.response?.data?.error;
      const errorMessage = strapiError?.message || err.message;
      const errorDetails = strapiError?.details;
      console.error('Strapi Error Message (updateCartTotalPrice):', errorMessage);
      console.error('Strapi Error Details (updateCartTotalPrice):', errorDetails);
    } else {
      console.error('Failed to update parent cart total price:', err);
    }
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID').format(price);
}

// Watch props for changes and re-fetch products
// This component does not manage its own route parameters directly,
// it reacts to changes in props from its parent (CategoryPage.vue)
watch(
  () => [props.categoryIdProp, props.sortByProp, props.minPriceProp, props.maxPriceProp, props.searchTermProp],
  () => {
    void fetchProducts();
  },
  { deep: true }
);

onMounted(() => {
  // Initial fetch when component mounts
  void fetchProducts();
});

const getImageUrl = (url?: string) => url?.startsWith('http') ? url : `${baseUrl}${url}`;
</script>

<style scoped>
/* ProductAll specific styles when used as a child component */
.product-grid-container {
  /* No specific max/min width here, let parent control it */
  width: 100%; /* Take full width of parent */
  margin: 0;
  padding: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.product-card-wrapper {
  display: flex;
  justify-content: center;
}

.product-card {
  width: 100%;
  max-width: 230px;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  cursor: pointer;
}

.product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-details-section {
  padding: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.add-to-cart-btn {
  width: 100%;
  color: white;
  padding: 10px 0;
  border-radius: 0 0 8px 8px;
  font-weight: bold;
  text-transform: uppercase;
}

/* Dialog styles (can remain in child as they are related to product display) */
.dialog-card {
  width: 80%;
  max-width: 1440px;
  border-radius: 8px;
}

.dialog-scroll-content {
  height: 90vh;
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
  padding-left: 15px;
}

.carousel-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
}

.thumbnail-container {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
  justify-content: center;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.2s ease;
}

.thumbnail-image.selected-thumbnail {
  border-color: #082f6d;
}

.product-description-area {
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}
.left-col-scroll-area::-webkit-scrollbar {
  display: none;
  width: 0px;
  background: transparent;
}

.left-col-scroll-area {
  scrollbar-width: none;
}

.left-col-scroll-area {
  -ms-overflow-style: none;
}

@media (max-width: 699px) {
  .product-grid-container {
    max-width: 699px;
    min-width: unset; /* Allow it to shrink on mobile */
  }
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-card {
    max-width: 190px;
  }
  .product-title {
    font-size: 14px;
    line-height: 1.2em;
    min-height: 2.4em;
  }

  .product-price {
    font-size: 16px;
  }

  .add-to-cart-btn {
    font-size: 12px;
    padding: 6px 0;
  }
  .dialog-left-col,
  .dialog-right-col {
    max-height: none;
    overflow-y: visible;
    position: static;
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
