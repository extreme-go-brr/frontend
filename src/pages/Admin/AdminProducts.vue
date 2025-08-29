<template>
  <q-page padding class="row justify-evenly q-gutter-md">
    <!-- Product Form Section -->
    <q-section class="col-3">
      <div class="q-mb-lg text-left">
        <h1 class="text-h5">{{ editingDocumentId === null ? 'Tambah Produk Baru' : 'Edit Produk' }}</h1>
      </div>

      <q-form @submit.prevent="submitProduct" class="q-gutter-md" style="max-width: 500px">
        <q-input filled v-model="form.name" label="Nama Produk" required />
        <q-input filled v-model="form.description" label="Deskripsi" type="textarea" />
        <q-input filled v-model="form.technical_details" label="Spesifikasi Teknis" type="textarea" />
        <q-input filled v-model.number="form.stock" label="Stok" type="number" min="0" required />
        <q-input filled v-model.number="form.price" label="Harga" type="number" min="0" required />

        <!-- Category Selection -->
        <q-select
          filled
          v-model="form.category"
          :options="availableCategories"
          label="Pilih Kategori"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          clearable
        />

        <!-- Media Library Selection -->
        <div class="q-gutter-y-md">
          <q-btn label="Pilih Gambar dari Media Library" color="primary" @click="openMediaLibrary" class="full-width" />
        </div>

        <div class="row q-gutter-sm q-mt-sm">
          <!-- Display selected media library images -->
          <q-img
            v-for="(imgUrl, index) in form.images"
            :key="index"
            :src="imgUrl"
            style="width: 100px; height: 100px; object-fit: cover;"
            class="rounded-borders"
          />
          <span v-if="!form.images || form.images.length === 0" class="text-grey-7 q-ml-sm">Tidak ada gambar dipilih</span>
        </div>

        <div>
          <q-btn :label="editingDocumentId === null ? 'Tambah' : 'Simpan'" type="submit" :color="editingDocumentId === null ? 'primary' : 'orange'" />
          <q-btn label="Reset" flat @click="resetForm" color="grey-7" />
        </div>
      </q-form>
    </q-section>

    <q-section class="col-8">
      <h2 class="text-h6 text-center q-mb-md">Daftar Produk</h2>

      <q-table :rows="products" :columns="columns" row-key="documentId" flat bordered>
        <template v-slot:body-cell-image="props">
          <q-td align="center">
            <!-- Display first image for table thumbnail -->
            <q-img v-if="props.row.images && props.row.images.length > 0" :src="props.row.images[0]" style="width: 70px; height: 70px; object-fit: cover;" />
            <span v-else>N/A</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn size="sm" color="primary" flat icon="edit" @click="editProduct(props.row)" aria-label="Edit Product" />
            <q-btn size="sm" color="negative" flat icon="delete" @click="confirmDelete(props.row.documentId!)" aria-label="Delete Product" />
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-8 q-py-md">
            Tidak ada produk ditemukan.
          </div>
        </template>
      </q-table>
    </q-section>

    <q-dialog v-model="showDialog" persistent>
      <q-card class="rounded-borders shadow-3">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          {{ dialogMessage }}
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn flat label="OK" color="primary" v-if="!isConfirmationDialog" @click="showDialog = false" />
          <q-btn flat label="Batal" color="grey" v-if="isConfirmationDialog" @click="cancelDelete" />
          <q-btn flat label="Hapus" color="negative" v-if="isConfirmationDialog" @click="proceedDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Media Library Selection Dialog -->
    <q-dialog v-model="showMediaLibraryDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;" class="rounded-borders shadow-3">
        <q-card-section class="bg-secondary text-white q-py-sm">
          <div class="text-h6">Pilih Gambar dari Media Library</div>
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 60vh;">
          <div v-if="mediaLibraryImages.length > 0" class="row q-gutter-sm justify-center">
            <q-img
              v-for="img in mediaLibraryImages"
              :key="img.id"
              :src="getImageUrl(img.url)"
              style="width: 120px; height: 120px; object-fit: cover; cursor: pointer;"
              class="rounded-borders shadow-1"
              :class="{ 'selected-media-image': isMediaImageSelected(img) }"
              @click="toggleMediaImageSelection(img)"
            >
              <q-tooltip>{{ img.name }}</q-tooltip>
            </q-img>
          </div>
          <div v-else class="text-center q-py-md text-grey-7">
            Tidak ada gambar di Media Library.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn flat label="Batal" color="grey" @click="showMediaLibraryDialog = false" />
          <q-btn flat label="Pilih" color="primary" :disable="tempSelectedMediaImages.length === 0" @click="confirmMediaSelection" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
      import { ref, onMounted } from 'vue';
      import type { QTableColumn } from 'quasar';

      // Interface for Category
      interface Category {
        id: number;
        documentId: string;
        name: string;
        slug: string;
      }

      // Define the Product interface to match Strapi 5's flattened data structure
      interface Product {
        id?: number; // Numerical ID, still present but documentId is used for URL queries
        documentId?: string; // String identifier used for single document API calls (GET, PUT, DELETE)
        name: string;
        description: string;
        technical_details: string;
        stock: number;
        price: number;
        images: string[]; // UPDATED: Array of URLs for display
        imageId?: number[]; // ID(s) of the image(s) in Strapi's media library (for linking existing images)
        category?: number | null; // Now holds the numerical ID of the category for form binding
        categoryObject?: Category | null; // To hold the full category object for display in table
      }

      // Interface for Media Library Image
      interface MediaImage {
        id: number;
        name: string;
        url: string;
        // Add other properties if needed, e.g., mime, size, etc.
      }

      // Reactive reference for the product form data
      const form = ref<Product>({
        name: '',
        description: '',
        technical_details: '',
        stock: 0,
        price: 0,
        images: [], // UPDATED: Initialize with empty array
        imageId: [], // Initialize as empty array
        category: null, // Initialize category to null (will hold ID)
        categoryObject: null, // Initialize category object to null
      });

      const products = ref<Product[]>([]);
      const editingDocumentId = ref<string | null>(null);
      const showDialog = ref(false);
      const dialogTitle = ref('');
      const dialogMessage = ref('');
      const isConfirmationDialog = ref(false);
      let deleteDocumentId: string | null = null; // Temporary storage for product documentId during delete confirmation

      // Reactive variable for available categories
      const availableCategories = ref<Category[]>([]);

      // State for Media Library Dialog
      const showMediaLibraryDialog = ref(false);
      const mediaLibraryImages = ref<MediaImage[]>([]);
      const tempSelectedMediaImages = ref<MediaImage[]>([]); // NEW: Holds multiple selected images in dialog

      // Define columns for the Quasar Q-Table
      const columns: QTableColumn<Product>[] = [
        { name: 'name', label: 'Nama', field: 'name', align: 'left', sortable: true },
        { name: 'category', label: 'Kategori', field: (row: Product) => row.categoryObject?.name || 'N/A', align: 'left', sortable: true },
        { name: 'stock', label: 'Stok', field: 'stock', align: 'right', sortable: true },
        { name: 'price', label: 'Harga', field: 'price', align: 'right', sortable: true },
        { name: 'image', label: 'Gambar', field: 'images', align: 'center' }, // Field points to images array
        {
          name: 'actions',
          label: 'Aksi',
          field: () => '',
          align: 'center'
        },
      ];

      const getImageUrl = (url?: string): string => {
        if (!url) return 'https://placehold.co/70x70/E0E0E0/000000?text=No+Image';
        return url.startsWith('http') ? url : `${import.meta.env.VITE_STRAPI_API_URL}${url}`;
      };

      async function fetchAvailableCategories(): Promise<void> {
        try {
          const apiUrl = `${import.meta.env.VITE_STRAPI_API_URL}/api/categories`;
          const res = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
            }
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, Message: ${errorText}`);
          }

          const data = await res.json();
          availableCategories.value = (data.data ?? []).map((item: { id: number; documentId: string; name: string; slug: string; }) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            slug: item.slug,
          }));
          console.log('Available Categories:', availableCategories.value);
        } catch (err: unknown) {
          let errorMessage = 'Terjadi kesalahan tidak dikenal.';
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'string') {
            errorMessage = err;
          }
          console.error('Gagal memuat kategori yang tersedia:', err);
          showAlertDialog('Error', `Gagal memuat kategori yang tersedia: ${errorMessage}.`);
        }
      }

      async function fetchProducts(): Promise<void> {
        try {
          const apiUrl = `${import.meta.env.VITE_STRAPI_API_URL}/api/products?populate[0]=image&populate[1]=category`;
          const res = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
            }
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, Message: ${errorText}`);
          }
          const data = await res.json();

          products.value = (data.data ?? []).map((item: {
            id: number;
            documentId: string;
            name: string;
            description: string;
            technical_details: string;
            stock: number;
            price: number;
            image?: { id: number; url: string; }[]; // Strapi returns array of image objects
            category?: { id: number; documentId: string; name: string; slug: string; };
          }) => {
            let productImages: string[] = []; // UPDATED: Array for URLs
            let mainImageIds: number[] = [];

            if (Array.isArray(item.image) && item.image.length > 0) {
              productImages = item.image.map((img: { id: number; url: string; }) => getImageUrl(img.url)); // Collect all URLs
              mainImageIds = item.image.map((img: { id: number; url: string; }) => img.id); // Collect all IDs
            }

            let productCategoryObject: Category | null = null;
            if (item.category && item.category.id && item.category.documentId) {
              productCategoryObject = {
                id: item.category.id,
                documentId: item.category.documentId,
                name: item.category.name,
                slug: item.category.slug,
              };
            }

            return {
              id: item.id,
              documentId: item.documentId,
              name: item.name,
              description: item.description,
              technical_details: item.technical_details,
              stock: item.stock,
              price: item.price,
              images: productImages, // UPDATED: Assign array of URLs
              imageId: mainImageIds,
              category: productCategoryObject ? productCategoryObject.id : null,
              categoryObject: productCategoryObject,
            };
          });
        } catch (err: unknown) {
          let errorMessage = 'Terjadi kesalahan tidak dikenal.';
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'string') {
            errorMessage = err;
          }
          console.error('Gagal memuat produk:', err);
          showAlertDialog('Error', `Gagal memuat produk: ${errorMessage}. Silakan coba lagi.`);
        }
      }

      async function submitProduct(): Promise<void> {
        try {
          const productData: {
            name: string;
            description: string;
            technical_details: string;
            stock: number;
            price: number;
            image?: number[]; // Strapi expects array of IDs for multiple media
            category?: number | null;
          } = {
            name: form.value.name,
            description: form.value.description,
            technical_details: form.value.technical_details,
            stock: form.value.stock,
            price: form.value.price,
          };

          // --- Image Handling Logic ---
          // form.value.imageId already contains the array of IDs selected from media library
          if (form.value.imageId && form.value.imageId.length > 0) {
            productData.image = form.value.imageId;
            console.log("Scenario: Linking existing images by ID(s). productData.image =", productData.image);
          } else {
            productData.image = []; // Send empty array to clear images
            console.log("Scenario: No images selected. productData.image = [].");
          }

          // --- Category Handling Logic ---
          productData.category = form.value.category ?? null;
          console.log("Scenario: Linking category by ID. productData.category =", productData.category);

          console.log('Product Data JSON payload for API:', JSON.stringify(productData));

          const url = editingDocumentId.value
            ? `${import.meta.env.VITE_STRAPI_API_URL}/api/products/${editingDocumentId.value}`
            : `${import.meta.env.VITE_STRAPI_API_URL}/api/products`;

          const method = editingDocumentId.value ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
            },
            body: JSON.stringify({ data: productData }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(errorData.error?.message || errorData.error?.details?.errors?.[0]?.message || 'Gagal menyimpan produk. Respon API tidak OK.');
          }

          resetForm();
          await fetchProducts();
          showAlertDialog('Sukses', `Produk berhasil ${method === 'POST' ? 'ditambahkan' : 'diperbarui'}.`);
        } catch (err: unknown) {
          let errorMessage = 'Terjadi kesalahan tidak dikenal.';
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'string') {
            errorMessage = err;
          }
          console.error('Error submitting product:', err);
          showAlertDialog('Error', `Gagal menyimpan produk: ${errorMessage}.`);
        }
      }

      function editProduct(product: Product): void {
        form.value = {
          ...product,
          category: product.categoryObject ? product.categoryObject.id : null,
        };
        // Initialize tempSelectedMediaImages with the images from the product for editing
        if (product.imageId && product.images) {
          tempSelectedMediaImages.value = product.imageId.map((id, index) => ({
            id: id,
            name: `Image ${id}`, // Placeholder name
            url: product.images[index] || 'https://placehold.co/120x120/E0E0E0/000000?text=Missing' // Use the URL for display
          }));
        } else {
          tempSelectedMediaImages.value = [];
        }
        editingDocumentId.value = product.documentId ?? null;
        // selectedMediaImage.value = null; // No longer needed with tempSelectedMediaImages
      }

      function confirmDelete(documentId: string): void {
        deleteDocumentId = documentId;
        showDialog.value = true;
        dialogTitle.value = 'Konfirmasi Hapus';
        dialogMessage.value = 'Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.';
        isConfirmationDialog.value = true;
      }

      function cancelDelete(): void {
        showDialog.value = false;
        deleteDocumentId = null;
      }
      async function proceedDelete(): Promise<void> {
        showDialog.value = false;
        if (deleteDocumentId === null) return;

        try {
          const response = await fetch(`${import.meta.env.VITE_STRAPI_API_URL}/api/products/${deleteDocumentId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.error?.message || 'Gagal menghapus produk. Respon API tidak OK.');
          }

          await fetchProducts();
          showAlertDialog('Sukses', 'Produk berhasil dihapus.');
        } catch (err: unknown) {
          let errorMessage = 'Terjadi kesalahan tidak dikenal.';
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'string') {
            errorMessage = err;
          }
          console.error('Error deleting product:', err);
          showAlertDialog('Error', `Gagal menghapus produk: ${errorMessage}.`);
        } finally {
          deleteDocumentId = null;
        }
      }

      /**
       * Resets the product form to its initial empty state.
       */
      function resetForm(): void {
        form.value = {
          name: '',
          description: '',
          technical_details: '',
          stock: 0,
          price: 0,
          images: [], // UPDATED: Reset to empty array
          imageId: [],
          category: null,
          categoryObject: null,
        };
        tempSelectedMediaImages.value = []; // Clear temporary selection
        editingDocumentId.value = null;
      }

      /**
       * Displays a generic alert dialog to the user.
       * @param title - The title of the alert dialog.
       * @param message - The message content of the alert dialog.
       */
      function showAlertDialog(title: string, message: string): void {
        dialogTitle.value = title;
        dialogMessage.value = message;
        isConfirmationDialog.value = false;
        showDialog.value = true;
      }

      /**
       * Checks if a media image is currently selected in the dialog.
       * @param img - The MediaImage object to check.
       * @returns True if selected, false otherwise.
       */
      function isMediaImageSelected(img: MediaImage): boolean {
        return tempSelectedMediaImages.value.some(selected => selected.id === img.id);
      }

      /**
       * Toggles the selection of a media image in the dialog.
       * @param img - The MediaImage object to toggle.
       */
      function toggleMediaImageSelection(img: MediaImage): void {
        const index = tempSelectedMediaImages.value.findIndex(selected => selected.id === img.id);
        if (index > -1) {
          // Image is already selected, remove it
          tempSelectedMediaImages.value.splice(index, 1);
        } else {
          // Image is not selected, add it
          tempSelectedMediaImages.value.push(img);
        }
      }

      /**
       * Opens the media library dialog and fetches images.
       */
      async function openMediaLibrary(): Promise<void> {
        try {
          const res = await fetch(`${import.meta.env.VITE_STRAPI_API_URL}/api/upload/files`, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
            }
          });
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, Message: ${errorText}`);
          }
          const data = await res.json();
          mediaLibraryImages.value = (data as MediaImage[]).map((item: MediaImage) => ({
            id: item.id,
            name: item.name,
            url: item.url,
          }));
          // Initialize tempSelectedMediaImages with current form images when opening
          tempSelectedMediaImages.value = form.value.imageId?.map(id => {
            const found = mediaLibraryImages.value.find(img => img.id === id);
            return found || { id: id, name: `Unknown Image ${id}`, url: 'https://placehold.co/120x120/E0E0E0/000000?text=Missing' };
          }).filter(Boolean) as MediaImage[]; // Filter out undefined/null and assert type
          showMediaLibraryDialog.value = true;
        } catch (err: unknown) {
          let errorMessage = 'Terjadi kesalahan tidak dikenal.';
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (typeof err === 'string') {
            errorMessage = err;
          }
          console.error('Gagal memuat Media Library:', err);
          showAlertDialog('Error', `Gagal memuat Media Library: ${errorMessage}.`);
        }
      }

      /**
       * Confirms the media library selection and updates the form.
       */
      function confirmMediaSelection(): void {
        form.value.images = tempSelectedMediaImages.value.map(img => getImageUrl(img.url));
        form.value.imageId = tempSelectedMediaImages.value.map(img => img.id);
        // selectedMediaImage.value = null; // No longer needed
        showMediaLibraryDialog.value = false;
      }

      // Lifecycle hook: Fetch products and categories when the component is mounted to the DOM
      onMounted(() => {
        void fetchProducts();
        void fetchAvailableCategories(); // Fetch categories on mount
      });
</script>

<style>
/* Add some basic styling for responsiveness and aesthetics */
.q-page {
  padding: 16px; /* Added padding */
}

.q-section {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Reverted layout classes */
.col-3 {
  width: 25%; /* Approx 3/12 */
  max-width: 500px; /* Max width for form */
}

.col-8 {
  width: 66.66%; /* Approx 8/12 */
}

/* Basic styling for form and table elements */
.q-form {
  max-width: 500px;
}

.q-table {
  border: 1px solid #e0e0e0;
}

.q-img {
  object-fit: cover;
}

.q-btn.full-width {
  width: 100%;
}

/* Styling for selected media image in dialog */
.selected-media-image {
  border: 4px solid #082F6D; /* Highlight color */
  box-shadow: 0 0 8px rgba(8, 47, 109, 0.5);
}
</style>
