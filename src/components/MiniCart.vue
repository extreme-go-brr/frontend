
<template>
<div v-for="cartItem in carts" :key="cartItem.documentId || cartItem.id" class="q-mb-md cart-item">
            <div class="row items-center q-col-gutter-md q-pa-sm">
              <div class="col-auto">
                <q-img
                  :src="getImageUrl(cartItem.product?.imageUrl)"
                  class="q-mr-md product-image"
                  style="width: 80px; height: 80px; object-fit: contain; background-color: #f0f0f0;"
                />
              </div>
              <div class="col">
                <div class="text-subtitle3 text-weight-medium">{{ cartItem.product?.name || 'Product Not Available' }}</div>
                <div class="text-subtitle1 q-mt-xs">
                  Rp{{ formatPrice(cartItem.product?.price || 0) }}
                </div>
              </div>
            </div>
          </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from 'stores/user-stores';
import Swal from 'sweetalert2';
const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

const baseUrl = import.meta.env.VITE_STRAPI_API_URL;

interface ActualStrapiImageItem {
  id: number;
  documentId?: string;
  name: string;
  url: string;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  } | null;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  previewUrl: string | null;
  provider: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  provider_metadata?: any | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface ActualStrapiProductItem {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  stock?: number;
  price: number;
  technical_details?: string | null;
  rating?: number | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  image: ActualStrapiImageItem[];
}

interface ActualStrapiCartItem {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  quantity: number;
  price_at_purchase: number;
  selected?: boolean;
  product: ActualStrapiProductItem | null;
  cart: {
    id: number;
    documentId: string;
    total_price: number;
    statuses: string;
    users_permissions_user?: any;
  } | null;
}

interface ActualStrapiApiResponse {
  data: ActualStrapiCartItem[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartItemFrontend {
  id: number;
  documentId: string;
  quantity: number;
  product: Product | null;
  cartDocumentId: string;
  cartId: number;
}



const carts = ref<CartItemFrontend[]>([]);
const loading = ref(true);

function formatPrice(value: number) {
  return value.toLocaleString('id-ID');
}

function getImageUrl(path?: string) {
  if (!path) return 'https://via.placeholder.com/120?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path}`;
}


async function fetchCart() {
  loading.value = true;
  const user = userStore.user;
  const token = userStore.token;

  if (!user || !user.id || !token) {
    void Swal.fire({ toast: true,
      icon: 'info',
      title: 'Please login first to view your cart',
      showConfirmButton: false,
      timer: 3000 });
    void router.push('/second/login-akun');
    loading.value = false;
    return;
  }

  try {
    const res = await axios.get<ActualStrapiApiResponse>(
      `${baseUrl}/api/cart-items?filters[cart][users_permissions_user][id][$eq]=${user.id}&populate=product.image&populate=cart`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    carts.value = res.data.data.map((item: ActualStrapiCartItem) => {
      console.log('Fetched raw Cart Item from API (full object):', item);
      const productItem = item.product;
      const productImage = productItem?.image?.[0];
      const cartData = item.cart;

      if (!cartData?.documentId) {
        console.warn(`CartItem ${item.id} (documentId: ${item.documentId}) is missing cart.documentId. Full item:`, item);
      }

      return {
        id: item.id,
        documentId: item.documentId,
        quantity: item.quantity,
        // ✅ Perbaikan: price_at_purchase harus diambil dari item, bukan product
        price: item.price_at_purchase,
        product: productItem
          ? {
              id: productItem.id,
              documentId: productItem.documentId,
              name: productItem.name,
              price: productItem.price,
              imageUrl: productImage?.url || '',
            }
          : null,
        cartDocumentId: cartData?.documentId || '',
        cartId: cartData?.id || 0,
      };
    }).filter((cartItem: CartItemFrontend) => cartItem.product !== null);


  } catch (err: unknown) {
    console.error('Failed to fetch cart:', (err as Error).message || err);
    $q.notify({ message: 'Failed to load cart items.', type: 'negative' });
  } finally {
    loading.value = false;
  }
}
onMounted(fetchCart);
</script>
