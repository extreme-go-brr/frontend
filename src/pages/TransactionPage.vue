<template>
  <q-page padding flat bordered style="background-color: var(--q-item-background); border-radius: 12px;">
    <div class="text-h5 q-mb-md">Your transactions</div>

    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-md">Loading transactions...</div>
    </div>

    <div v-else-if="transactions.length === 0" class="text-center q-mt-xl">
      <q-banner class=" text-center q-pa-lg rounded-borders">
        <img
    src="/emptycart.png"
    alt="Your Transactions"
    class="q-mb-md"
    style="max-width: 180px; margin-bottom: 20px;"
  />
        <div class="text-h6">You have no transactions yet.</div>
        <div class="q-mt-sm">Start shopping now!</div>
        <q-btn
          label="View Products"
          color="primary"
          class="q-mt-md"
          to="/products"
        />
      </q-banner>
    </div>
<div class=" q-pa-md" style="border-radius: 9px; width: 855px;" >
  <div class="row justify-between q-mb-md">
  <q-input
            v-model="searchTransaction"
            outlined
            dense
            placeholder="Search Transaction"
            style="width: 440px; "
          >
            <template v-slot:append >
              <q-icon name="search" class="q-mr-lg text-grey" />

            </template>
          </q-input>
          <q-select
        v-model="selectedProduct"
        :options="productOptions"
        outlined
        dense
        option-value="documentId"
        option-label="name"
        label="All Product"
        emit-value
        map-options
        :loading="loadingProducts"
        :disable="loadingProducts"
        style="width: 370px;"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No products found
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- ✅ Perbaikan: Menampilkan nama produk dan tanggal dibuat -->
      <div v-if="selectedProduct" class="q-mt-md">
        You choose the product: <strong>{{ selectedProduct.name }}</strong><br>
        Created at: {{ formatDateTime(selectedProduct.createdAt) }}
      </div>
        </div>
    <q-card
      v-for="trx in transactions"
      :key="trx.order_id"
      class="q-mb-md transaction-card"
      bordered
      flat
    >

      <q-card-section class="transaction-header">
        <div class="text-subtitle1">
          <b>Order ID:</b> {{ trx.order_id }}
        </div>
        <div class="text-subtitle2 q-mt-sm">
          <b>Name:</b> {{ trx.user_name }}<br />
          <b>Address:</b> {{ trx.user_address }}<br />
          <b>Status Pesanan:</b> {{ trx.transaction_status }}<br/>
          <b>Status Pengiriman:</b> {{ trx.shipping_status }}<br/>
          <template v-if="trx.tracking_number">
            <b>Nomor Resi:</b> {{ trx.tracking_number }}<br/>
            <b>Penyedia Pengiriman:</b> {{ trx.shipping_provider }}<br/>
            <b>Dikirim Pada:</b> <template v-if="trx.shipped_at">{{ new Date(trx.shipped_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</template><template v-else>N/A</template>
          </template>
        </div>
      </q-card-section>
<div class="row justify-between" >
      <q-card-section>
        <div v-for="item in trx.items" :key="item.product_document_id || item.product_id" class="row q-mb-md transaction-item-row">
          <q-img
            :src="getImageUrl(item.image)"
            class="q-mr-md product-image"
            style="width: 80px; height: 80px; object-fit: contain; background-color: #f0f0f0;"
          />
          <div class="col product-details">
            <div class="text-subtitle1 text-weight-medium">{{ item.product_name }}</div>
            <div class="text-caption text-grey-7">
              Rp {{ (item.price || 0).toLocaleString('id-ID') }} x {{ item.quantity }} =
              <b>
                Rp {{ ((item.price || 0) * item.quantity).toLocaleString('id-ID') }}
              </b>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="column text-right transaction-footer justify-center" style="height:100px; border-left: black 1px solid; padding-left: 10px; margin: auto; margin-right: 0px;">
        <div class="column text-subtitle1 text-weight-light" align="right">
          Total Purchases
          <span class="text-h6 text-weight-bold" align="left">Rp {{ (trx.total_amount || 0).toLocaleString('id-ID') }}</span>
        </div>
 </q-card-section>
</div>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          color="primary"
          icon="payment"
          label="Pembayaran"
          :to="`/second/pembayaran`"
          :disable="trx.transaction_status !== 'pending'"
        />
      </q-card-actions>

    </q-card>
  </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify,useQuasar } from 'quasar';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user-stores'; // Impor store Pinia
import { storeToRefs } from 'pinia'; // Impor storeToRefs
// import qs from 'qs'; // ✅ qs tidak lagi dibutuhkan jika populate string dibangun manual


const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const userStore = useUserStore(); // Gunakan store Pinia
const searchTransaction = ref<string | null>(null);
const { user, token } = storeToRefs(userStore);
interface StrapiImageItem {
  id: number;
  documentId?: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string; // URL utama gambar
  previewUrl: string | null;
  provider: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  provider_metadata: any | null; // `any` bisa tetap ada jika Anda tidak tahu strukturnya
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
interface ProductOption {
  id: number;
  documentId: string;
  name: string;
  createdAt: string; // ✅ Tambahkan createdAt
  price: number; // ✅ Tambahkan price
}
// Product item (langsung dari `transaction_item.product`)
interface StrapiProductItem {
  id: number;
  documentId?: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  technical_details: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: StrapiImageItem[]; // Relasi gambar adalah array objek gambar langsung
}

// Transaction Item (langsung dari `transaction.transaction_items`)
interface StrapiTransactionItem {
  id: number;
  documentId?: string;
  quantity: number;
  price: number; // Harga saat transaksi (unit price)
  subtotal?: number; // Menambahkan subtotal sesuai field di Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  product: StrapiProductItem | null; // Product langsung, bisa null jika produk tidak ditemukan
}

// User Address (jika dipopulate dari user.addresses, akan terlihat seperti ini)
interface StrapiUserAddressItem {
  id: number;
  documentId?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// User (langsung dari `transaction.users_permissions_user` atau user fetch)
interface StrapiUserItem {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  no_telp?: string | null; // Field kustom dari user response
  profile?: StrapiUserItem | null; // Relasi profile adalah objek langsung (oneToOne)
  addresses?: StrapiUserAddressItem[]; // Relasi alamat adalah array langsung, jika dipopulate
}

// Transaction utama (langsung dari array `data` di respons API /api/transactions)
interface StrapiTransactionItemRaw {
  id: number;
  documentId?: string;
  orderId: string;
  totalAmount: number;
  order_status: string; // Menggunakan string untuk fleksibilitas
  shippingAddress: string;
  notes: string | null;
  trackingNumber: string | null;
  shippingProvider: string | null;
  shippedAt: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null; // PublishedAt bisa null jika belum publish
  users_permissions_user: StrapiUserItem | null; // User langsung, bisa null
  transaction_items: StrapiTransactionItem[]; // Transaction items adalah array langsung
}

// Interface untuk keseluruhan respons API (sesuai format respons Anda: { data: [...] })
interface StrapiApiResponse {
  data: StrapiTransactionItemRaw[]; // Array dari item Transaction mentah
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface TransactionItemFrontend {
  product_id: number;
  product_document_id: string; // Menambahkan documentId produk
  product_name: string;
  image: string; // URL gambar lengkap
  price: number;
  quantity: number;
  subtotal: number; // Menambahkan subtotal
}

interface TransactionFrontend {
  transaction_id: number;
  document_id: string; // Menambahkan documentId transaksi
  order_id: string;
  user_name: string;
  user_address: string;
  transaction_status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'unknown';
  shipping_status: string; // derived shipping status
  total_amount: number;
  items: TransactionItemFrontend[];
  tracking_number: string | null;
  shipping_provider: string | null;
  shipped_at: string | null;
}

const productOptions = ref<ProductOption[]>([]);
const selectedProduct = ref<ProductOption | null>(null); // ✅ Mengubah tipe menjadi ProductOption | null
const loadingProducts = ref(false);
const transactions = ref<TransactionFrontend[]>([]);
const loading = ref(true);

function getImageUrl(path: string) {
  if (!path) return 'https://via.placeholder.com/80?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path}`;
}

// ✅ Fungsi baru untuk memformat tanggal dan waktu
function formatDateTime(isoString: string | null): string {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}


async function fetchTransactions() {
  loading.value = true;
  const currentUser = user?.value;
  const currentToken = token?.value;

  if (!currentUser || !currentUser.id || !currentToken) {
    Notify.create({ message: 'You must be logged in to view transactions.', type: 'info' });
    void router.push('/second/login-akun');
    loading.value = false;
    return; // Keluar dari fungsi jika tidak valid
  }

  console.log('--- Fetch Transactions Initiated ---');
  console.log('User data from Pinia store:', currentUser);
  console.log('User ID for transaction filter:', currentUser.id);
  console.log('Auth Token (first 10 chars from store):', currentToken.substring(0, 10) + '...'); // currentToken dijamin tidak null di sini

  try {
    const populateQuery = 'populate[users_permissions_user]=true&populate[transaction_items][populate][product][populate][0]=image';

    const filterQuery = `filters[users_permissions_user]=${currentUser.id}`;

    const requestUrl = `${baseUrl}/api/transactions?${filterQuery}&${populateQuery}`;
    console.log('API Request URL for Transactions:', requestUrl);

    const res = await axios.get<StrapiApiResponse>(
      requestUrl,
      {
        headers: { Authorization: `Bearer ${currentToken}` }, // currentToken dijamin tidak null di sini
      }
    );

    console.log('API Response (raw data from transactions endpoint):', res.data);

    transactions.value = res.data.data.map((rawTrx: StrapiTransactionItemRaw): TransactionFrontend => {
      const userItem = rawTrx.users_permissions_user;

      let displayShippingStatus = rawTrx.order_status || 'Menunggu Pengiriman';
      if (rawTrx.trackingNumber && rawTrx.shippingProvider) {
        displayShippingStatus = `Dikirim (${rawTrx.shippingProvider}, No. Resi: ${rawTrx.trackingNumber})`;
        if (rawTrx.shippedAt) {
          displayShippingStatus += ` pada ${new Date(rawTrx.shippedAt).toLocaleDateString('id-ID')}`;
        }
      } else if (rawTrx.order_status === 'completed') {
        displayShippingStatus = 'Telah Selesai';
      } else if (rawTrx.order_status === 'cancelled') {
        displayShippingStatus = 'Dibatalkan';
      } else if (rawTrx.order_status === 'pending') {
        displayShippingStatus = 'Menunggu Konfirmasi';
      }


      return {
        transaction_id: rawTrx.id,
        document_id: rawTrx.documentId || '',
        order_id: rawTrx.orderId,
        user_name: userItem?.username || 'N/A', // user_name sekarang seharusnya terisi jika populate user berhasil
        user_address: rawTrx.shippingAddress || 'Address Not Available',
        transaction_status: (rawTrx.order_status as 'pending' | 'paid' | 'completed' | 'cancelled') || 'unknown',
        shipping_status: displayShippingStatus,
        total_amount: rawTrx.totalAmount,
        tracking_number: rawTrx.trackingNumber || null,
        shipping_provider: rawTrx.shippingProvider || null,
        shipped_at: rawTrx.shippedAt || null,
        items: rawTrx.transaction_items?.map((itemDetail: StrapiTransactionItem): TransactionItemFrontend => {
          const product = itemDetail.product;
          const productImage = product?.image?.[0]?.url;

          return {
            product_id: product?.id || 0,
            product_document_id: product?.documentId || '',
            product_name: product?.name || 'Product Not Available',
            image: productImage || '', // Gambar produk sekarang harus tersedia
            price: itemDetail.price,
            quantity: itemDetail.quantity,
            subtotal: itemDetail.subtotal || (itemDetail.price * itemDetail.quantity) || 0,
          };
        }).filter(item => item.product_id !== 0) || [],
      };
    });
    console.log('Processed Transactions (for display):', transactions.value);

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Gagal fetch transaksi:', error.response?.data || error.message);
      const strapiError = error.response?.data?.error;
      const errorMessage = strapiError?.message || error.message;
      const errorDetails = strapiError?.details;
      console.error('Strapi Error Message:', errorMessage);
      console.error('Strapi Error Details:', errorDetails);
      Notify.create({ message: `Gagal mengambil transaksi: ${errorMessage}`, type: 'negative' });
    } else {
      console.error('Gagal fetch transaksi:', (error as Error).message || error);
      Notify.create({ message: 'Gagal mengambil transaksi', type: 'negative' });
    }
  } finally {
    loading.value = false;
  }
}
async function fetchProductsForDropdown() {
  loadingProducts.value = true;
  try {
    // Mempopulasi hanya field yang diperlukan untuk dropdown
    const response = await axios.get(`${baseUrl}/api/products?fields[0]=name&fields[1]=price&fields[2]=createdAt`); // ✅ Meminta createdAt
    // Data Strapi 5 sudah flattened, jadi langsung akses item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productOptions.value = response.data.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId, // Ambil documentId
      name: item.name,
      price: item.price,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    $q.notify({ type: 'negative', message: 'Failed to load product list.' });
  } finally {
    loadingProducts.value = false;
  }
}
onMounted(async () => {
  // Panggil initUser() hanya jika user data belum ada
  if (!user?.value || !user.value.id || !token?.value) { // Menggunakan user.value dan token.value langsung
     userStore.initUser();
  }
  if (route.query.searchTransaction) {
    searchTransaction.value = route.query.searchTransaction as string;
  }
  await fetchTransactions();
  await fetchProductsForDropdown();
});
</script>

<style scoped>
.transaction-card {
  border-radius: 8px;
  background-color: var(--q-dark-page);
}

.transaction-header {
  padding-bottom: 16px;
}

.transaction-item-row {
  align-items: center;
  margin-bottom: 16px;
}

.product-image {
  border-radius: 8px;
}

.product-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.transaction-footer {
  padding-top: 16px;
}

.rounded-borders {
  border-radius: 8px;
}

/* Responsiveness */
@media (max-width: 600px) {
  .transaction-card {
    margin: 0;
  }
}
</style>
