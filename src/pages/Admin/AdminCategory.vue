<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 q-gutter-md">
      <h2 class="text-h5">{{ editingDocumentId === null ? 'Tambah Kategori Baru' : 'Edit Kategori' }}</h2>

      <q-form @submit.prevent="submitCategory" class="q-gutter-md">
        <q-input
          v-model="form.name"
          label="Nama Kategori"
          filled
          required
          autocomplete="off"
        />
        <q-input
          v-model="form.slug"
          label="Slug Kategori"
          filled
          required
          autocomplete="off"
        />
        <div>
          <q-btn :label="editingDocumentId === null ? 'Tambah Kategori' : 'Simpan Perubahan'" type="submit" :color="editingDocumentId === null ? 'primary' : 'orange'" />
          <q-btn v-if="editingDocumentId !== null" label="Batal Edit" flat @click="resetForm" color="grey-7" class="q-ml-sm" />
        </div>
        <q-btn class="q-ml-xl" label="Product" to="/admin/products" />
        <q-btn class="q-ml-xl" label="Subkategori" to="/admin/subkategori" />
      </q-form>

      <q-separator class="q-my-md" />

      <h2 class="text-h6">Daftar Kategori</h2>

      <q-table
        :rows="categories"
        :columns="columns"
        row-key="documentId"
        flat
        bordered
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn
              size="sm"
              icon="edit"
              color="primary"
              flat
              @click="editCategory(props.row)"
              aria-label="Edit Category"
            />
            <q-btn
              size="sm"
              icon="delete"
              color="negative"
              flat
              @click="confirmDelete(props.row.documentId!)"
              aria-label="Delete Category"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Custom Message/Confirmation Dialog -->
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
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { QTableColumn } from 'quasar';

interface Category {
  id?: number; // Numerical ID from Strapi
  documentId?: string; // String documentId from Strapi, used for API calls
  name: string;
  slug: string;
}

const form = ref<Category>({
  name: '',
  slug: '',
});

const categories = ref<Category[]>([]);
const editingDocumentId = ref<string | null>(null); // Stores the documentId of the category being edited

const baseUrl = import.meta.env.VITE_STRAPI_API_URL;

// State for the custom dialog (for alerts and confirmations)
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const isConfirmationDialog = ref(false);
let deleteDocumentId: string | null = null; // Temporary storage for category documentId during delete confirmation

const columns: QTableColumn<Category>[] = [
  { name: 'name', label: 'Nama Kategori', field: 'name', align: 'left', sortable: true },
  { name: 'slug', label: 'Slug', field: 'slug', align: 'left', sortable: true },
  { name: 'actions', label: 'Aksi', field: () => '', align: 'center' },
];

/**
 * Generates a URL-friendly slug from a given text.
 * @param text - The input text to convert into a slug.
 * @returns The generated slug string.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

watch(
  () => form.value.name,
  (newName: string) => {
    form.value.slug = generateSlug(newName);
  }
);
async function fetchCategories(): Promise<void> {
  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, Message: ${errorText}`);
    }

    const data = await res.json();
    console.log('DATA STRAPI Categories:', data);

    // Map Strapi 5 response to local Category interface (flattened attributes)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.value = (data.data ?? []).map((item: Record<string, any>) => ({
      id: item.id,
      documentId: item.documentId, // Use documentId from Strapi 5 response
      name: item.name, // Directly accessible
      slug: item.slug, // Directly accessible
    }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Gagal memuat kategori:', err);
    showAlertDialog('Error', `Gagal memuat kategori: ${err.message}. Silakan coba lagi.`);
  }
}

async function submitCategory(): Promise<void> {
  try {
    const categoryData = {
      name: form.value.name,
      slug: form.value.slug,
    };

    const url = editingDocumentId.value
      ? `${baseUrl}/api/categories/${editingDocumentId.value}` // Use documentId for PUT
      : `${baseUrl}/api/categories`; // Use plural API ID for POST

    const method = editingDocumentId.value ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({ data: categoryData }), // Wrap payload in 'data' for Strapi 5
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(errorData.error?.message || errorData.error?.details?.errors?.[0]?.message || 'Gagal menyimpan kategori. Respon API tidak OK.');
    }

    showAlertDialog('Sukses', `Kategori berhasil ${method === 'POST' ? 'ditambahkan' : 'diperbarui'}!`);
    resetForm();
    await fetchCategories();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error submitting category:', err);
    showAlertDialog('Error', `Terjadi kesalahan saat menyimpan kategori: ${err.message}.`);
  }
}

/**
 * Populates the form with data from a selected category for editing.
 * @param category - The category object to be edited.
 */
function editCategory(category: Category): void {
  form.value = { ...category };
  editingDocumentId.value = category.documentId ?? null;
}

/**
 * Initiates the category deletion process by showing a confirmation dialog.
 * @param documentId - The `documentId` (Strapi 5's string identifier) of the category to be deleted.
 */
function confirmDelete(documentId: string): void {
  deleteDocumentId = documentId;
  showDialog.value = true;
  dialogTitle.value = 'Konfirmasi Hapus';
  dialogMessage.value = 'Yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.';
  isConfirmationDialog.value = true;
}

/**
 * Cancels the delete operation and closes the confirmation dialog.
 */
function cancelDelete(): void {
  showDialog.value = false;
  deleteDocumentId = null;
}

/**
 * Proceeds with the category deletion after user confirmation.
 */
async function proceedDelete(): Promise<void> {
  showDialog.value = false;
  if (deleteDocumentId === null) return;

  try {
    const response = await fetch(`${baseUrl}/api/categories/${deleteDocumentId}`, { // Use documentId for DELETE
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Gagal menghapus kategori. Respon API tidak OK.');
    }

    showAlertDialog('Sukses', 'Kategori berhasil dihapus!');
    await fetchCategories();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error deleting category:', err);
    showAlertDialog('Error', `Gagal menghapus kategori: ${err.message}.`);
  } finally {
    deleteDocumentId = null;
  }
}

/**
 * Resets the form to its initial empty state and clears editing state.
 */
function resetForm(): void {
  form.value = {
    name: '',
    slug: '',
  };
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

// Lifecycle hook: Fetch categories when the component is mounted
onMounted(fetchCategories);
</script>

<style scoped>
/* Scoped styles to keep them specific to this component */
.q-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.col-6 {
  width: 50%; /* Adjust for col-6 */
  max-width: 600px; /* Example max-width for content area */
}

.q-form {
  max-width: none; /* Override previous max-width if any */
}

.q-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.q-table thead tr {
  background-color: #f5f5f5;
}

.q-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.q-table tbody tr:hover {
  background-color: #e0f2f7; /* Light blue on hover */
}

.q-btn {
  border-radius: 6px;
  font-weight: 500;
  text-transform: none;
}

/* Custom dialog styling for consistency */
.rounded-borders {
  border-radius: 8px;
}
.shadow-3 {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
