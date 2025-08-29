<template>
  <q-page class="q-pa-md cart-page-container">
    <div class="text-left q-mb-md">
      <h4 class=" text-primary text-weight-bold">Checkout</h4>
    </div>

    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md">Memuat item transaksi...</div>
    </div>

    <div v-else-if="carts.length === 0">
      <q-banner class=" text-black text-center q-pa-lg rounded-borders">
        <q-icon name="receipt_long" size="xl" class="q-mb-md" />
        <div class="text-h6">Your transaction is empty!</div>
        <div class="q-mt-sm">Start checkout items from your cart.</div>
        <q-btn
          label="Browse Products"
          color="primary"
          class="q-mt-md"
          to="/"
        />
      </q-banner>
    </div>

    <div v-else>
      <div class="q-mb-lg">
        <q-card class="q-mt-lg">
          <q-card-section>
            <div class="text-h6 ">Pilih Alamat Pengiriman</div>

            <div v-if="selectedAddress" class="q-py-md rounded-borders ">
              <div class="row items-start no-wrap">
                <div class="col-auto q-mr-md">
                  <q-icon name="place" color="primary" size="md" />
                </div>
                <div class="col">
                  <div class="text-h6 text-weight-bold">
                    {{ selectedAddress.nama_alamat }} <span class="text-grey-7">&bull;</span> {{ selectedUserName }}
                  </div>
                  <div class="text-h6 text-grey-8 q-mt-xs">
                    {{ formatAddressWithDetails(selectedAddress) }}
                  </div>
                  <div v-if="selectedUserPhone" class="text-caption text-grey-8">
                    +{{ selectedUserPhone }}
                  </div>
                </div>
                <div class="col-auto q-ml-md">
                  <q-btn
                    label="Change"
                    rounded
                    outline
                    color="grey-7"
                    no-caps
                    @click="openAddressSelectionDialog"
                  />
                </div>
              </div>
            </div>

            <q-btn
              v-else
              label="Pilih Alamat Tersimpan"
              color="primary"
              outline
              class="full-width q-mb-md"
              @click="openAddressSelectionDialog"
            />

            <div v-if="!userAddresses.length && !loadingAddresses" class="q-mt-sm text-red-5">
              You don't have any saved addresses yet. Please add one to your profile.
            </div>
            <q-spinner v-if="loadingAddresses" color="primary" size="1.5em" class="q-ml-sm" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 ">
        <q-card class="q-mb-md cart-items-card">
          <q-card-section>
            <div v-for="cartItem in carts" :key="cartItem.documentId || cartItem.id" class="q-mb-md cart-item">
              <div class="row items-center q-col-gutter-md">
                <div class="col-auto">
                  <q-img
                    :src="getImageUrl(cartItem.product?.imageUrl)"
                    class="q-mr-md product-image"
                    style="width: 120px; height: 120px; object-fit: contain;"
                  />
                </div>
                <div class="col">
                  <div class="text-h6 text-weight-bold">{{ cartItem.product?.name || 'Product Not Available' }}</div>
                  <div class="text-subtitle1 text-primary q-mt-xs">
                    Rp{{ formatPrice(cartItem.product?.price || 0) }}
                  </div>

                  <div class="row items-center q-mt-md quantity-control">
                    <div>Quantity: {{ cartItem.quantity }}</div>
                  </div>
                  <div class="text-subtitle1 q-mt-sm text-grey-8">
                    Subtotal: Rp{{ formatPrice((cartItem.product?.price || 0) * cartItem.quantity) }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-mt-lg shipping-selection-card">
            <div class="text-h6 q-mb-md">Pilih Metode Pengiriman</div>
            <q-select
              filled
              v-model="selectedShippingProvider"
              :options="shippingOptions"
              label="Pilih Jasa Pengiriman"
              emit-value
              map-options
              :rules="[val => !!val || 'Mohon pilih metode pengiriman']"
            />
          </q-card-section>
        </q-card>

      </div>
      <div class="col-12">
        <q-card class="justify-end total-summary-card ">
          <div class="row justify-end">
          <q-card-section  class="row justify-between items-center text-h6" style="width: 400px;">
            <div class="text-weight-bold">Total Cart:</div>
            <div class="text-primary text-weight-bold">Rp{{ formatPrice(totalAll) }}</div>
          </q-card-section>
          </div>
          <q-separator  />
          <div class="row justify-end">
            <q-card-actions  class="row justify-center q-pa-md" style="width: 400px;">
              <q-btn
                color="primary"
                label="Make an Order"
                @click="checkout"
                :disable="checkingOut || !selectedAddress || !selectedShippingProvider"
                :loading="checkingOut"
                class="checkout-btn"
                style="width: 300px;"
              />
            </q-card-actions>
</div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="addressSelectionDialog" persistent>
      <q-card style="min-width: 850px; min-height: 200px;" >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Pilih Alamat Pengiriman</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md" >

            <q-card
              v-for="address in userAddresses"
              :key="address.documentId"
              clickable
              v-ripple
              :active="selectedAddress && selectedAddress.documentId === address.documentId"
              active-class=" text-primary"
              class="address-cart q-my-md"
              style="height: 180px;"
            >
            <div class="row justify-between full-width">
            <q-item-section >
                <q-item-label class="text-weight-bold text-h6 row items-center"> <div style="width: 6px; height: 25px;flex-shrink: 0;border-radius:
                0px 10px 10px 0px;background: var(--primary-500-utama, linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #082F6D);" class="q-mr-md"></div>
            {{ address.nama_alamat }}</q-item-label>
            <div class="q-mx-lg text-subtitle1">
                <q-item-label>{{ selectedUserName }}</q-item-label>
                <q-item-label >
                  {{ formatAddress(address) }}
                </q-item-label>
                </div>
              </q-item-section>
              <q-item-section >
                <div class="row justify-end q-mr-md">
                <q-btn color="primary" label="Chose" @click="selectAddressFromDialog(address)" style="width: 40%;" />
                </div>
              </q-item-section>
              </div>
            </q-card>
          <div v-if="!userAddresses.length" class="text-center q-py-md text-grey">
            Belum ada alamat tersimpan.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Tambah Alamat Baru" color="primary" @click="goToAddAddress" />
          <q-btn flat label="Tutup" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from 'stores/user-stores';
import Swal from 'sweetalert2';

const router = useRouter();
const userStore = useUserStore();
const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// ... (Interface yang sudah ada, tidak ada perubahan di sini) ...
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

interface TransactionItemPayload {
  product: string; // documentId produk
  quantity: number;
  price: number;
  subtotal: number;
  transaction?: { connect: [{ documentId: string }] } | string; // Bisa objek connect atau string documentId
}

interface TransactionPayloadData {
  users_permissions_user: string;
  orderId: string;
  totalAmount: number;
  order_status: string;
  shippingAddress: string; // ✅ Ini akan menjadi string alamat terformat
  notes: string;
  trackingNumber?: string;
  shippingProvider?: string;
  shippedAt?: string | null;
  transaction_items?: {
    create: TransactionItemPayload[];
  };
}

interface StrapiAddress {
  id: number;
  documentId: string;
  nama_alamat: string;
  jalan: string;
  no_rumah: string;
  rt_rw: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  users_permissions_user?: any; // Relasi ke user
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // ✅ Tambahkan field untuk nama penerima dan nomor telepon jika ada di Strapi Address model
  username?: string;
  nomor_telepon?: string;
}


const carts = ref<CartItemFrontend[]>([]);
const totalAll = ref<number>(0);
const loading = ref(true);
const checkingOut = ref(false);
const userAddresses = ref<StrapiAddress[]>([]);
const selectedAddress = ref<StrapiAddress | null | undefined>(undefined);
const loadingAddresses = ref(false);

const addressSelectionDialog = ref(false);

const shippingOptions = ref([
  { label: 'JNE Reguler', value: 'JNE Reguler' },
  { label: 'TIKI Kilat', value: 'TIKI Kilat' },
  { label: 'Pos Indonesia', value: 'Pos Indonesia' },
  { label: 'Gojek Same Day', value: 'Gojek Same Day' },
  { label: 'Grab Express', value: 'Grab Express' },
]);
const selectedShippingProvider = ref<string | null>(null);

// ✅ Computed property untuk menampilkan nama pengguna dari alamat terpilih
const selectedUserName = computed(() => {
  return selectedAddress.value?.username || userStore.user?.username || 'Penerima'; // Fallback ke username jika tidak ada nama_penerima di alamat
});

// ✅ Computed property untuk menampilkan nomor telepon dari alamat terpilih
const selectedUserPhone = computed(() => {
  return selectedAddress.value?.nomor_telepon || userStore.user?.phone || ''; // Fallback ke phone userStore jika tidak ada di alamat
});

function formatPrice(value: number) {
  return value.toLocaleString('id-ID');
}

function getImageUrl(path?: string) {
  if (!path) return 'https://via.placeholder.com/120?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path}`;
}

// ✅ Fungsi yang lebih detail untuk format alamat
function formatAddressWithDetails(address: StrapiAddress): string {
  if (!address) return '';
  const parts = [];
  if (address.jalan) parts.push(address.jalan);
  if (address.no_rumah) parts.push(`No. ${address.no_rumah}`);
  if (address.rt_rw) parts.push(`RT/RW ${address.rt_rw}`);
  if (address.kecamatan) parts.push(address.kecamatan);
  if (address.kota) parts.push(address.kota);
  if (address.provinsi) parts.push(address.provinsi);
  if (address.kode_pos) parts.push(address.kode_pos);

  return parts.join(', ');
}

// Fungsi formatAddress asli (digunakan di dialog)
function formatAddress(address: StrapiAddress): string {
  if (!address) return '';
  return `${address.jalan}, No. ${address.no_rumah || '-'}, RT/RW ${address.rt_rw || '-'}, ${address.kecamatan}, ${address.kota}, ${address.provinsi}, ${address.kode_pos}`;
}


function updateTotal() {
  totalAll.value = carts.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + item.quantity * price;
  }, 0);
}

function openAddressSelectionDialog() {
  addressSelectionDialog.value = true;
}

function selectAddressFromDialog(address: StrapiAddress) {
  selectedAddress.value = address;
  addressSelectionDialog.value = false;
}

function goToAddAddress() {
  addressSelectionDialog.value = false;
  void router.push('/profile/address/add');
}

async function fetchUserAddresses() {
  loadingAddresses.value = true;
  const user = userStore.user;
  const token = userStore.token;

  if (!user || !user.id || !token) {
    userAddresses.value = [];
    selectedAddress.value = undefined;
    loadingAddresses.value = false;
    return;
  }

  try {
    const res = await axios.get(`${baseUrl}/api/addresses?filters[users_permissions_user][id][$eq]=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userAddresses.value = res.data.data;

    userAddresses.value.forEach(addr => {
        addr.username = userStore.user?.username; // Atau dari field userStore yang lebih spesifik jika ada
        addr.nomor_telepon = userStore.user?.phone; // Atau dari field userStore yang lebih spesifik jika ada
    });


    if (selectedAddress.value && userAddresses.value.length > 0) {
      const found = userAddresses.value.find(
        (addr) => addr.documentId === selectedAddress.value?.documentId
      );
      if (found) {
        selectedAddress.value = found;
      } else {
        selectedAddress.value = userAddresses.value[0] || undefined;
      }
    } else if (userAddresses.value.length > 0) {
      selectedAddress.value = userAddresses.value[0];
    } else {
      selectedAddress.value = undefined;
    }
  } catch (err) {
    console.error('Failed to fetch user addresses:', err);
    await Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'gagal memuat alamat',
      showConfirmButton: false,
      timer: 3000 });
    selectedAddress.value = undefined;
  } finally {
    loadingAddresses.value = false;
  }
}


async function fetchCart() {
  loading.value = true;
  const user = userStore.user;
  const token = userStore.token;

  if (!user || !user.id || !token) {
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Login to view your cart',
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
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'failed load cart',
      showConfirmButton: false,
      timer: 3000 });
  } finally {
    loading.value = false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'cart item updated successfully',
      showConfirmButton: false,
      timer: 3000 });
      await updateParentCartTotalPrice(cartItem.cartId, cartItem.cartDocumentId, token);
    } else {
      void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'failed update cart item',
      showConfirmButton: false,
      timer: 3000 });
    }
  } catch (err: unknown) {
    console.error('Update cart item failed:', (err as Error).message || err);
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'error update cart item',
      showConfirmButton: false,
      timer: 3000 });
  }
}

async function updateParentCartTotalPrice(cartId: number, cartDocumentId: string, token: string) {
  if (!cartDocumentId) {
    console.error('updateParentCartTotalPrice: cartDocumentId is missing, cannot update parent cart. Cart ID:', cartId);
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'cannot update cart total',
      showConfirmButton: false,
      timer: 3000 });
    return;
  }

  try {
    const cartItemsRes = await axios.get<ActualStrapiApiResponse>(
      `${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cartId}&populate=product&populate=cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let calculatedTotalPrice = 0;
    for (const item of cartItemsRes.data.data) {
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
    }
  }
}

async function checkout() {
  const user = userStore.user;
  const token = userStore.token;

  if (!user || !user.documentId || !token) {
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'User not loggin',
      showConfirmButton: false,
      timer: 3000 });
    void router.push('/second/login-akun');
    return;
  }

  if (carts.value.length === 0) {
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Cart empty please add item/product',
      showConfirmButton: false,
      timer: 3000 });
    return;
  }
  if (!selectedAddress.value) {
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Mohon pilih Alamat',
      showConfirmButton: false,
      timer: 3000 });
    return;
  }
  if (!selectedShippingProvider.value) {
    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Pilih metode pengiriman',
      showConfirmButton: false,
      timer: 3000 });
    return;
  }

  checkingOut.value = true;
  const orderId = `ORD-${Date.now()}`;

  const transactionPayloadData: TransactionPayloadData = {
    users_permissions_user: user.documentId,
    orderId,
    totalAmount: 0, // Akan dihitung setelah item dibuat
    order_status: 'pending',
    shippingAddress: formatAddressWithDetails(selectedAddress.value), // Menggunakan fungsi format yang lebih detail
    notes: '',
    trackingNumber: '',
    shippingProvider: selectedShippingProvider.value,
    shippedAt: null,
    transaction_items: {
      create: []
    }
  };

  try {
    const resTransaction = await axios.post(`${baseUrl}/api/transactions`, { data: transactionPayloadData }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (resTransaction.status !== 200 && resTransaction.status !== 201) {
      const errorData = resTransaction.data;
      console.error('Initial Transaction creation failed:', errorData);
      checkingOut.value = false;
      return;
    }

    const newTransactionId = resTransaction.data.data.id;
    const newTransactionDocumentId = resTransaction.data.data.documentId;
    console.log('New Transaction created:', { id: newTransactionId, documentId: newTransactionDocumentId });

    let calculatedTotalAmount = 0;
    for (const cartItem of carts.value.filter(item => item.product !== null)) {
      const transactionItemPayload: TransactionItemPayload = {
        product: cartItem.product!.documentId,
        quantity: cartItem.quantity,
        price: cartItem.product!.price,
        subtotal: cartItem.quantity * cartItem.product!.price,
        transaction: {
          connect: [
            {
              documentId: newTransactionDocumentId,
            }
          ]
        }
      };

      try {
        const resTransactionItem = await axios.post(`${baseUrl}/api/transaction-items`, { data: transactionItemPayload }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (resTransactionItem.status === 200 || resTransactionItem.status === 201) {
          calculatedTotalAmount += transactionItemPayload.subtotal;
          console.log('TransactionItem created:', resTransactionItem.data.data.documentId);
        } else {
          console.error('Failed to create TransactionItem:', resTransactionItem.data);
          void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'gagal memuat item transaksi',
      showConfirmButton: false,
      timer: 3000 });
        }
      } catch (itemError: any) {
        console.error('Error creating TransactionItem:', itemError.response?.data || itemError.message);
        void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error memuat item transaksi',
      showConfirmButton: false,
      timer: 3000 });
      }
    }

    await axios.put(`${baseUrl}/api/transactions/${newTransactionDocumentId}`, {
      data: { totalAmount: calculatedTotalAmount }
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Updated Transaction ${newTransactionDocumentId} with totalAmount: ${calculatedTotalAmount}`);


    void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Checkout successful',
      showConfirmButton: false,
      timer: 3000 });

    await clearActiveCart(user.id, token);

    carts.value = [];
    updateTotal();
    void router.push('/profile/transaksi');
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('Checkout error:', err.response?.data || err.message);
      void Swal.fire({ toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error during checkout',
      showConfirmButton: false,
      timer: 3000 });
    } else {
      console.error('Checkout error:', err);
    }
  } finally {
    checkingOut.value = false;
  }
}

async function clearActiveCart(userId: number, token: string) {
  try {
    const cartRes = await axios.get(`${baseUrl}/api/carts?filters[users_permissions_user][id][$eq]=${userId}&filters[statuses][$eq]=active`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const activeCart = cartRes.data.data?.[0];

    if (activeCart) {
      const cartId = activeCart.id;
      const cartDocumentId = activeCart.documentId;

      const cartItemsRes = await axios.get(`${baseUrl}/api/cart-items?filters[cart][id][$eq]=${cartId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const itemsToDelete = cartItemsRes.data.data;

      for (const item of itemsToDelete) {
        try {
          await axios.delete(`${baseUrl}/api/cart-items/${item.documentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`Deleted cart-item: ${item.documentId}`);
        } catch (deleteError) {
          console.error(`Failed to delete individual cart-item ${item.documentId}:`, deleteError);
        }
      }

      await axios.put(`${baseUrl}/api/carts/${cartDocumentId}`, {
        data: { total_price: 0, statuses: 'completed' }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Cart ${cartDocumentId} status updated to 'completed'.`);

    } else {
      console.log('No active cart found to clear for user:', userId);
    }
  } catch (err) {
    console.error('Error clearing active cart after checkout:', err);
    if (axios.isAxiosError(err)) {
      console.error('Strapi error response (clearActiveCart):', err.response?.data);
      const strapiError = err.response?.data?.error;
      const errorMessage = strapiError?.message || err.message;
      const errorDetails = strapiError?.details;
      console.error('Strapi Error Message (clearActiveCart):', errorMessage);
      console.error('Strapi Error Details (clearActiveCart):', errorDetails);
    }
  }
}


onMounted(fetchCart);
onMounted(fetchUserAddresses);
</script>

<style scoped>
/* (Styling Anda tetap sama) */
.address-cart {
  display: flex;
  width: 782px; /* Mengembalikan lebar awal */
  height: 237px; /* Mengembalikan tinggi awal */
  padding: 18px 0px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid var(--primary-500-utama, #082F6D);
  background: rgba(10, 83, 199, 0.15);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
.cart-page-container {
  max-width: 1300px;
  margin: 0 auto;
}

.cart-items-card {
  border-radius: 8px;

}

.cart-item {
  padding: 16px 0;
}

.total-summary-card {
  border-radius: 8px;
  padding: 43px 0px;
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
</style>
