<template style>
  <q-page class="q-pa-md cart-page-container">
    <div class="text-left q-mb-md">
      <h2 class="text-h6 text-weight-bold">Your Shopping Cart</h2>
    </div>

    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md">Memuat cart items...</div>
    </div>

    <div v-else-if="carts.length === 0">
      <div class="text-center q-pa-lg empty-cart-section">
  <img
    src="/emptycart.png"
    alt="Empty Cart"
    style="max-width: 180px; margin-bottom: 20px;"
  />
  <div class="text-h6">Your cart is empty!</div>
  <div class="q-mt-sm">Start shopping now to add items to your cart.</div>
  <q-btn
    label="Browse Products"
    color="primary"
    class="q-mt-md"
    to="/products"
  />
</div>

    </div>

    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
      <q-card v-for="cartItem in carts" :key="cartItem.documentId || cartItem.id" class="q-mb-md cart-items-card">
        <q-card-section>
          <div class="q-px-md q-mb-md cart-item">
            <div class="row q-col-gutter-md">
              <div class="col-auto">
                <q-img
                  :src="getImageUrl(cartItem.product?.imageUrl)"
                  class="q-mr-md product-image"
                  style="width: 160px; height: 160px; object-fit: contain; "
                />
              </div>
              <div class="col q-mt-lg">
                <div class="text-h6 text-weight-bold">{{ cartItem.product?.name || 'Product Not Available' }}</div>
                <div class="text-subtitle1 text-primary q-mt-xs">
                  Rp{{ formatPrice(cartItem.product?.price || 0) }}
                </div>

              </div>
              <div class="col-auto q-mt-lg column justify-between">
                <div class="text-h5  q-mb-lg" align="right">
                  Rp{{ formatPrice((cartItem.product?.price || 0) * cartItem.quantity) }}
                </div>
            <div class="row">
                <q-btn flat round icon="delete" color="negative" @click="deleteCartItem(cartItem.documentId)" />
                <div class="row items-center quantity-control" style="border: 3px gray solid; border-radius: 30px; ">
                  <q-btn flat dense round icon="remove" @click="updateCartItemQuantity(cartItem, 'decrease')" />
                  <q-input
                    v-model.number="cartItem.quantity"
                    type="number"
                    flat
                    dense
                    hide-spin-buttons
                    class="q-mx-sm "
                    style="width: 30px;"
                    :min="1"
                    @update:model-value="updateCartItem(cartItem)"
                  />
                  <q-btn flat dense round icon="add" @click="updateCartItemQuantity(cartItem, 'increase')" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
      </div>
      <div class="col-12 col-md-4">
      <q-card class=" total-summary-card">
        <h6 class="q-mx-md">SHOPPING SUMMARY</h6>
        <q-separator />
        <q-card-section class="row justify-between items-center text-h6">
          <div class="text-weight-bold">Total Cart:</div>
          <div class="text-primary text-weight-bold">Rp{{ formatPrice(totalAll) }}</div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            color="primary"
            label="Checkout"
            icon="shopping_cart_checkout"
            to="checkout"
            class="checkout-btn"
            style="width: 100%;"
          />
        </q-card-actions>

      </q-card>
    </div>
    </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from 'stores/user-stores';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

const baseUrl = import.meta.env.VITE_STRAPI_API_URL ;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
const totalAll = ref<number>(0);
const loading = ref(true);
function formatPrice(value: number) {
  return value.toLocaleString('id-ID');
}

function getImageUrl(path?: string) {
  if (!path) return 'https://via.placeholder.com/120?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path}`;
}

// ✅ Fungsi untuk memformat alamat menjadi string tampilan

function updateTotal() {
  totalAll.value = carts.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + item.quantity * price;
  }, 0);
}

async function fetchCart() {
  loading.value = true;
  const user = userStore.user;
  const token = userStore.token;

  if (!user || !user.id || !token) {
    $q.notify({ message: 'Please log in to view your cart.', type: 'info' });
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

    updateTotal();
  } catch (err: unknown) {
    console.error('Failed to fetch cart:', (err as Error).message || err);
    $q.notify({ message: 'Failed to load cart items.', type: 'negative' });
  } finally {
    loading.value = false;
  }
}


async function updateCartItemQuantity(cartItem: CartItemFrontend, action: 'increase' | 'decrease') {
  let newQuantity = cartItem.quantity;
  if (action === 'increase') {
    newQuantity++;
  } else if (action === 'decrease') {
    newQuantity = Math.max(1, newQuantity - 1);
  }

  cartItem.quantity = newQuantity;
  updateTotal();

  await updateCartItem(cartItem);
}

async function updateCartItem(cartItem: CartItemFrontend) {
  const token = userStore.token;

  if (!token) {
    $q.notify({ message: 'Token tidak ditemukan. Silakan login ulang.', type: 'negative' });
    void router.push('/second/login-akun');
    return;
  }

  try {
    const res = await axios.put(`${baseUrl}/api/cart-items/${cartItem.documentId}`, {
      data: {
        quantity: cartItem.quantity,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      $q.notify({ message: 'Cart item updated.', type: 'positive', timeout: 1000 });
      await updateParentCartTotalPrice(cartItem.cartId, cartItem.cartDocumentId, token);
    } else {
      $q.notify({ message: 'Failed to update cart item.', type: 'negative' });
    }
  } catch (err: unknown) {
    console.error('Update cart item failed:', (err as Error).message || err);
    $q.notify({ message: 'Error updating cart item.', type: 'negative' });
  }
}

function deleteCartItem(cartItemDocumentId: string) {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to remove this item from your cart?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      const token = userStore.token;
      if (!token) {
        $q.notify({ message: 'Token tidak ditemukan. Silakan login ulang.', type: 'negative' });
        void router.push('/second/login-akun');
        return;
      }

      const itemToDelete = carts.value.find(item => item.documentId === cartItemDocumentId);
      if (!itemToDelete) {
        $q.notify({ message: 'Item to delete not found in local cart.', type: 'negative' });
        return;
      }

      try {
        console.log(`Attempting to delete cart-item with documentId: ${cartItemDocumentId}`);
        const res = await axios.delete(`${baseUrl}/api/cart-items/${cartItemDocumentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 204 || res.status === 200) {
          console.log(`Successfully deleted cart-item with documentId: ${cartItemDocumentId}`);
          carts.value = carts.value.filter((item) => item.documentId !== cartItemDocumentId);
          updateTotal();
          $q.notify({ message: 'Item removed from cart.', type: 'warning' });

          await updateParentCartTotalPrice(itemToDelete.cartId, itemToDelete.cartDocumentId, token);

        } else {
          console.error(`Failed to delete cart-item ${cartItemDocumentId}. Status: ${res.status}, Response:`, res.data);
          $q.notify({ message: `Gagal menghapus item: ${res.statusText || 'Unknown error'}`, type: 'negative' });
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(`Delete cart item failed for ${cartItemDocumentId}:`, err.response?.data || err.message);
          $q.notify({ message: `Error menghapus item: ${err.response?.data?.error?.message || err.message}`, type: 'negative' });
        } else {
          console.error(`Delete cart item failed for ${cartItemDocumentId}:`, err);
          $q.notify({ message: `Error menghapus item: ${ (err as Error).message || 'Unknown error' }`, type: 'negative' });
        }
      }
    })();
  });
}

async function updateParentCartTotalPrice(cartId: number, cartDocumentId: string, token: string) {
  if (!cartDocumentId) {
    console.error('updateParentCartTotalPrice: cartDocumentId is missing, cannot update parent cart. Cart ID:', cartId);
    $q.notify({ message: 'Error: Cannot update cart total. Cart ID is missing.', type: 'negative' });
    return;
  }

  try {
    const cartItemsRes = await axios.get<ActualStrapiApiResponse>(
      `${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cartId}&populate=product&populate=cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let calculatedTotalPrice = 0;
    for (const item of cartItemsRes.data.data) {
      // ✅ Perbaikan: Menggunakan price_at_purchase dari item
      calculatedTotalPrice += item.quantity * item.price_at_purchase;
    }

    console.debug('[DEBUG] Total price dihitung ulang:', calculatedTotalPrice);

    await axios.put(`${baseUrl}/api/carts/${cartDocumentId}`, {
      data: { total_price: calculatedTotalPrice, statuses: 'completed' }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`Cart ${cartDocumentId} status updated to 'completed'. Total Price: ${calculatedTotalPrice}`);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Failed to update parent cart total price:', err.response?.data || err.message);
      const strapiError = err.response?.data?.error;
      const errorMessage = strapiError?.message || err.message;
      const errorDetails = strapiError?.details;
      console.error('Strapi Error Message (clearActiveCart):', errorMessage);
      console.error('Strapi Error Details (clearActiveCart):', errorDetails);
      $q.notify({ message: `Terjadi masalah saat membersihkan keranjang: ${errorMessage}`, type: 'warning' });
    } else {
      $q.notify({ message: 'Terjadi masalah saat membersihkan keranjang setelah checkout.', type: 'warning' });
    }
  }
}





onMounted(fetchCart);
</script>

<style scoped>

/* (Styling Anda tetap sama) */
.cart-page-container {
  background-color: var(--q-body-background);
  max-width: 1300px;
  margin: 0 auto;
}

.cart-items-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}


.total-summary-card {
  border-radius: 8px;
  padding: 3px 0px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.checkout-btn {
  padding: 12px 24px;
  font-size: 1.1rem;
}

.rounded-borders {
  border-radius: 8px;
}

/* Responsiveness */
@media (max-width: 600px) {
  .cart-item .row {
    flex-direction: column;
    align-items: flex-start;
  }
  .cart-item .col-auto:first-child {
    margin-bottom: 12px;
  }
  .cart-item .col-auto:last-child {
    width: 100%;
    text-align: right;
  }
  .quantity-control {
    width: 100%;
    justify-content: flex-start;
  }
}
.empty-cart-section {
  background-color: transparent;
}

</style>
