
<template>
  <div class="product-grid-container">
    <!-- Header -->
    <div class="text-start q-mb-md">
      <h2 class="text-h5 text-weight-bold">Featured Products</h2>
    </div>

    <!-- Product Grid -->
    <div class="product-grid">
      <div
        v-for="product in displayedProducts"
        :key="product.documentId || product.id"
        class="product-card-wrapper q-pa-sm"
      >
        <q-card class="product-card q-hoverable q-pa-sm ">
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
              <div class="text-h5 text-weight-bold product-price q-my-sm text-primary">Rp{{ formatPrice(product.price) }}</div>
            </div>
          </q-card-section>
          <q-btn
            label="Add to Cart"
            class="add-to-cart-btn"
            style="background-color: #082F6D; border-radius: 8px;"
            @click="handleAddToCart(product.id)" />
        </q-card>
      </div>
    </div>

    <!-- Show More/Less Button -->
    <div class="text-center q-mt-lg q-mb-md text-primary">
      <q-btn
        v-if="hasMoreProducts"
        :label="showAll ? 'Show Less Products' : 'Show More Products'"
        @click="toggleShowAll"
        style="height: 50px; width: 300px; border: 4px solid #082F6D; border-radius: 10px;"
      />
    </div>

    <!-- Product Details Dialog -->
    <q-dialog v-model="dialogVisible">
      <q-card class="dialog-card">
        <div align="right">
          <q-btn icon="close" flat round dense v-close-popup class="close-button" style="margin-right: 10px;"/>
        </div>

        <q-card-section class="dialog-main-content">
          <div class="row q-col-gutter-md justify-end dialog-content-wrapper">
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
                      <div class="text-subtitle2 q-mb-sm text-weight-bold" v-html="parsedDescription"></div>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="Technical_Details">
                    <div class="q-mt-md product-description-area">
                      <div class="text-subtitle2 q-mb-sm text-weight-bold" v-html="parsedTechnicalDetails"></div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-scroll-area>
            </div>

            <div class="col-12 col-md-4 dialog-right-col">
              <div class="text-h4 text-weight-medium">{{ selectedProduct?.name }}</div>
              <div class="row items-center q-mb-sm" v-if="selectedProduct?.rating">
                <q-icon name="star" color="yellow-8" size="20px" />
                <span class="q-ml-xs text-body1 text-bold">{{ selectedProduct?.rating }}</span>
              </div>
              <div class="text-h4 text-weight-bold q-mt-xl">
                Price: Rp{{ formatPrice(selectedProduct?.price || 0) }}
              </div>
              <div class="text-h6 text-grey-7 q-mt-sm">
                Stock: {{ selectedProduct?.stock }}
              </div>
              <div class="column">
                <div class="text-h6 text-primary"><q-icon name="local_shipping"/> Set Quantity and order now</div>
                <div class="row">
                  <div class="row q-mb-md q-mt-md justify-between" style="border: 2px solid gray; border-radius: 5px 0px 0px 5px; padding: 5px; height: 44px; width: 26%;">
                    <q-btn flat dense icon="remove" @click="decreaseQuantity" />
                    <div class="text-h6">{{ quantity }}</div>
                    <q-btn flat dense icon="add" @click="increaseQuantity" />
                  </div>
                  <q-btn
                    label="Add to Cart"
                    @click="selectedProduct?.id && addToCart(selectedProduct.id, quantity)" class="q-mt-md"
                    style="height: 44px; margin-left: -2px; border: 4px solid #082F6D; width: 60%;"
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
    import { useRoute, useRouter } from 'vue-router';
    import { useUserStore } from 'stores/user-stores';
    import Swal from 'sweetalert2';

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

    interface StrapiCartItemAttributes {
      quantity: number;
      price_at_purchase: number;
      product: {
        data: {
          id: number;
          documentId: string;
          attributes: {
            name: string;
            price: number;
          }
        }
      };
      cart: {
        data: {
          id: number;
          documentId: string;
        }
      };
    }

    interface StrapiCartItemRaw {
      id: number;
      documentId?: string;
      price_at_purchase: number;
      quantity: number;
      attributes: StrapiCartItemAttributes;
    }

    interface StrapiCartItemsApiResponse {
      data: StrapiCartItemRaw[];
      meta?: {
        pagination?: {
          page: number;
          pageSize: number;
          pageCount: number;
          total: number;
        }
      };
    }

    // State dan Ref
    const $q = useQuasar();
    const route = useRoute();
    const userStore = useUserStore();
    const router = useRouter();
    const baseUrl = import.meta.env.VITE_STRAPI_API_URL;

    const products = ref<Product[]>([]);
    const searchTerm = ref((route.query.search as string) || '');
    const dialogVisible = ref(false);
    const selectedProduct = ref<Product | null>(null);
    const selectedImageIndex = ref(0);
    const quantity = ref(1);
    const activeTab = ref('description');

    const productsPerLoad = 4;
    const showAll = ref(false);

    // Computed Properties
    const displayedProducts = computed(() => {
      const filtered = products.value.filter(p => p.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
      if (showAll.value) {
        return filtered;
      }
      return filtered.slice(0, productsPerLoad);
    });

    const hasMoreProducts = computed(() => {
      const filtered = products.value.filter(p => p.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
      return filtered.length > productsPerLoad;
    });

    const parsedDescription = computed(() => marked(selectedProduct.value?.description || ''));
    const parsedTechnicalDetails = computed(() => marked(selectedProduct.value?.technical_details || ''));
    const selectedImage = computed(() => selectedProduct.value?.images[selectedImageIndex.value] || 'fallback.jpg');

    // Functions
    function toggleShowAll() {
      showAll.value = !showAll.value;
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

    async function fetchProducts() {
      try {
        const res = await axios.get(`${baseUrl}/api/products?populate=image`);
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
      } catch (err) {
        console.error('Fetch Error:', err);
        void Swal.fire({ toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed Load products',
          showConfirmButton: false,
          timer: 3000 });
      }
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
        void Swal.fire({ toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'You are not logged in or the user ID was not found.',
          showConfirmButton: false,
          timer: 3000 });
        return;
      }

      const product = products.value.find(p => p.id === productId);
      if (!product) {
        void Swal.fire({ toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Product not found.',
          showConfirmButton: false,
          timer: 3000 });
        return;
      }

      const productPrice = product.price;

      try {
        let cart: Cart;

        const cartRes = await axios.get(`${baseUrl}/api/carts?filters[users_permissions_user][documentId][$eq]=${userDocumentId}&filters[statuses][$eq]=active&populate=cart_items&populate=users_permissions_user`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (cartRes.data.data.length > 0) {
          cart = cartRes.data.data[0];
        } else {
          console.debug('[DEBUG] Membuat cart baru untuk user:', userDocumentId);
          const newCartRes = await axios.post(`${baseUrl}/api/carts`, {
            data: {
              total_price: 0,
              statuses: 'active',
              users_permissions_user: userDocumentId
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          cart = newCartRes.data.data;
        }

        console.log(`[DEBUG] Mencari cart-item yang sudah ada untuk cart.id: ${cart.id}, productId: ${productId}`);
        const cartItemRes = await axios.get(`${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cart.id}&filters[product][id][$eq]=${productId}&populate=product&populate=cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('[DEBUG] Respon GET cart-items:', cartItemRes.data);

        const existingItem = cartItemRes.data.data?.[0];

        if (existingItem) {
          const newQty = existingItem.quantity + qty;
          console.debug('[DEBUG] Update cart-item quantity', {
            id: existingItem.id,
            newQty
          });

          await axios.put(`${baseUrl}/api/cart-items/${existingItem.documentId}`, {
            data: {
              quantity: newQty,
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('[DEBUG] Cart item berhasil diupdate:', existingItem.documentId);
        } else {
          console.debug('[DEBUG] Tambah cart-item baru', {
            cart: cart.documentId,
            product: product.documentId,
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

        await updateCartTotalPrice(cart.id, cart.documentId, token);

        dialogVisible.value = false;
        void Swal.fire({ toast: true,
          icon: 'success',
          title: 'Product added to cart',
          showConfirmButton: false,
          timer: 3000 });
      } catch (err: any) {
        console.error('[AddToCart Error]', err.response?.data || err.message);
        const strapiError = err.response?.data?.error;
        const errorMessage = strapiError?.message || err.message;
        const errorDetails = strapiError?.details;
        console.error('Strapi Error Message (addToCart):', errorMessage);
        console.error('Strapi Error Details (addToCart):', errorDetails);
        void Swal.fire({ toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Gagal menambah ke keranjang',
          showConfirmButton: false,
          timer: 3000 });
      }
    }

    async function updateCartTotalPrice(cartId: number, cartDocumentId: string, token: string) {
      try {
        const cartItemsRes = await axios.get<StrapiCartItemsApiResponse>(
          `${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cartId}&populate=product&populate=cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let calculatedTotalPrice = 0;
        for (const item of cartItemsRes.data.data) {
          calculatedTotalPrice += item.quantity * item.price_at_purchase;
        }

        console.debug('[DEBUG] Total price dihitung ulang:', calculatedTotalPrice);

        await axios.put(`${baseUrl}/api/carts/${cartDocumentId}`, {
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

    onMounted(fetchProducts);

    watch(() => route.query.search, val => {
      searchTerm.value = (val as string) || '';
      showAll.value = false;
    });

    const getImageUrl = (url?: string) => url?.startsWith('http') ? url : `${baseUrl}${url}`;
</script>

<style scoped>
      .container::-webkit-scrollbar {
        display: none;
      }
      .container::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
      .product-grid-container {
        margin: auto;
        max-width: 1340px;
        min-width: 900px;
      }

      /* --- New Styles for 5 Products Per Row --- */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);

      }

      .product-card-wrapper {
        display: flex;
        justify-content: center;
      }

      /* Adjust for smaller screens if necessary, e.g., on sm (small) screens, perhaps 3 items per row */

      .product-card {

        width: 100%;
        height: 400px;
        border-radius: 10px;
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
        height: 300px; /* Create a 1:1 aspect ratio box */
        overflow: hidden;
        cursor: pointer;
      }

      .product-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensure the image fills the container well */
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
        border-radius: 0 0 8px 8px; /* Rounded corners at the bottom */
        font-weight: bold;
        text-transform: uppercase;
      }

      .dialog-card {
        width: 80%;
        max-width: 1440px;
        border-radius: 8px;
      }

      .dialog-scroll-content {
        height: 90vh; /* Limit scroll area height */
      }

      .close-button {
        z-index: 10;
      }

      .dialog-main-content {
        padding: 10px;
      }

      /* New styles for fixed right column */
      .dialog-content-wrapper {
        display: flex;
        flex-wrap: nowrap;
      }

      .left-col-scroll-area {
        height: calc(90vh - 120px);  }


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
        border-color: #082F6D;
      }

      .product-description-area {
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
      }
      .left-col-scroll-area::-webkit-scrollbar {
        display: none; /* Hide scrollbar completely */
        width: 0px; /* Or set width to 0 */
        background: transparent; /* Make it transparent */
      }

      /* For Firefox */
      .left-col-scroll-area {
        scrollbar-width: none; /* Hide scrollbar for Firefox */
      }

      /* Optional: For older IE/Edge */
      .left-col-scroll-area {
        -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
      }

      @media (min-width: 1340px) {
        .product-card {
          height: 450px;
        }
        .product-image-container {
          height: 350px;
        }
      }

      @media (min-width:700px) and (max-width: 950px) {
            .product-grid-container {
            margin: auto;
            max-width: 699px;
            min-width: 710px;

          }
            .product-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);

            }

            .product-card-wrapper {
              display: flex;
              justify-content: center;
            }
            .product-card {
            width: 100%;
            max-width: 190px;
            border-radius: 22px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
            .product-title {
              font-size: 14px;
              line-height: 1.2em;
              min-height: 2.4em; /* Sesuaikan tinggi untuk 2 baris */
            }

            .product-price {
              font-size: 16px;
            }

            .add-to-cart-btn {
              font-size: 12px;
              padding: 6px 0;
            }
            .dialog-left-col, .dialog-right-col {
              max-height: none;
              overflow-y: visible;
              position: static;
              padding-right: 0;
              padding-left: 0;
            }
      }

      @media (max-width: 699px) {
            .product-grid-container {
            margin: auto;
            max-width: 699px;
            min-width: 100px;

          }
            .product-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);

            }

            .product-card-wrapper {
              display: flex;
              justify-content: center;
            }
            .product-card {
            width: 100%;
            height: 280px;
            max-width: 190px;
            border-radius: 22px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
            .product-title {
              font-size: 14px;
              line-height: 1.2em;
              min-height: 2.4em; /* Sesuaikan tinggi untuk 2 baris */
            }

            .product-price {
              font-size: 16px;
            }

            .add-to-cart-btn {
              font-size: 12px;
              padding: 6px 0;
            }
            .dialog-left-col, .dialog-right-col {
              max-height: none;
              overflow-y: visible;
              position: static;
              padding-right: 0;
              padding-left: 0;
            }
      }

</style>
