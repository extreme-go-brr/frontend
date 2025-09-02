<template>
  <div class="row justify-between" style="width: 80%;">
    <!-- Foto Profil -->
    <q-card class="my-card q-mt-lg iwak" style="max-width: 275px; height: 400px" align="center">
      <q-card-section>
        <img
          :src="preview || (user?.profile?.url ? baseUrl + user.profile.url : '/img/default-profile.png')"
          style="width: 235px; height: 227px; border-radius: 10px"
        />
      </q-card-section>
      <q-file
        ref="fileRef"
        v-model="form.profile"
        accept="image/*"
        style="display: none"
        @update:model-value="onFileAutoSubmit"
      />
      <q-card-actions align="center">
        <div @click="fileRef?.pickFiles()" class="text-grey-7 cursor-pointer text-h6 q-py-sm text-weight-bold" style="border: 1px solid grey; border-radius: 10px; width: 85%;">Select a Photo</div>
        <div class="q-mt-sm text-weight-medium text-grey-7" align="left" style="width: 85%;">File size: maximum 10,000,000 bytes (10 Megabytes). Allowed file extensions: .PNG</div>
      </q-card-actions>
    </q-card>

    <!-- Data Personal -->
    <q-card flat class="q-mt-lg iwak" style="width: 248px">
      <div class="text-h6 text-grey q-mb-md">Change your personal data</div>
      <div v-if="user" style="gap: 30px" class="column justify-start">
        <div class="row q-mb-sm justify-between text-subtitle1">
          <strong>Name:</strong> {{ user.username }}
          <span class="change-link" @click="openEdit('username', user.username)">Change</span>
        </div>
        <!-- <div class="row q-mb-sm justify-between text-subtitle1">
          <strong>Birth date:</strong> {{ user.birthdate || '-' }}
          <span class="change-link" @click="openEdit('birthdate', user.birthdate)">Change</span>
        </div>
        <div class="row q-mb-sm justify-between text-subtitle1">
          <strong>Gender:</strong> {{ user.gender || '-' }}
          <span class="change-link" @click="openEdit('gender', user.gender)">Change</span>
        </div> -->
        <div class="text-h6 text-grey q-mb-md">Change Contacts</div>
        <div class="row q-mb-sm justify-between text-subtitle1">
          <strong>Email:</strong> {{ user.email }}
          <span class="change-link" @click="openEdit('email', user.email)">Change</span>
        </div>
        <div class="row q-mb-sm justify-between text-subtitle1">
          <strong>Phone:</strong> +62{{ user.no_telp }}
          <span class="change-link" @click="openEdit('no_telp', user.no_telp)">Change</span>
        </div>
      </div>
      <div v-else class="text-grey">Loading user data...</div>
    </q-card>

    <!-- Dialog Edit Data -->
    <q-dialog v-model="showDialog">
      <q-card style="width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Change {{ fieldLabelMap[currentField] }}</div>
          <div class="text-caption text-grey">
            Please ensure the new {{ fieldLabelMap[currentField] }} is correct.
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="updatedValue"
            filled
            dense
            :label="fieldLabelMap[currentField]"
            :type="currentField === 'email' ? 'email' : currentField === 'birthdate' ? 'date' : 'text'"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn label="Save" color="primary" @click="submitFieldUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import type { QFile } from 'quasar';
import { useUserStore } from 'stores/user-stores';
import { storeToRefs } from 'pinia';

const baseUrl = import.meta.env.VITE_STRAPI_API_URL;
const fileRef = ref<InstanceType<typeof QFile> | null>(null);
const isDarkMode = ref(false);
const $q = useQuasar();
const form = ref<{ profile: File | null }>({ profile: null });
const preview = ref<string | null>(null);

const userStore = useUserStore();
const { user, token } = storeToRefs(userStore);

// Dialog state
const showDialog = ref(false);
const currentField = ref('');
const updatedValue = ref('');
const fieldLabelMap: Record<string, string> = {
  username: 'Name',
  email: 'Email',
  no_telp: 'Phone',
  gender: 'Gender',
  birthdate: 'Birth Date',
};

function openEdit(field: string, value: string) {
  currentField.value = field;
  updatedValue.value = value || '';
  showDialog.value = true;
}

async function submitFieldUpdate() {
  if (user?.value == null || token?.value == null) return;

  try {
    const payload: Record<string, any> = {};
    payload[currentField.value] = updatedValue.value;
    await axios.put(
      `${baseUrl}/api/users/${user.value?.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token.value ?? ''}`,
        },
      }
    );
    await userStore.fetchUser();
    showDialog.value = false;
    $q.notify({
      color: 'positive',
      message: `${fieldLabelMap[currentField.value]} updated successfully`,
      icon: 'check_circle',
    });
  } catch (err: any) {
    $q.notify({
      color: 'negative',
      message: err?.response?.data?.error?.message || 'Failed to update data',
      icon: 'warning',
    });
  }
}

onMounted(async () => {
  await userStore.fetchUser();

  if (user?.value) {
    if (user.value.profile?.url) {
      preview.value = baseUrl + user.value.profile.url;
    } else {
      preview.value = '/img/default-profile.png';
    }
  } else {
    console.log('User data not available after fetchUser.');
  }

  const storedTheme = localStorage.getItem('theme');
  isDarkMode.value = storedTheme === 'dark';
  $q.dark.set(isDarkMode.value);
});

async function onFileAutoSubmit(file: File | null) {
  preview.value = file ? URL.createObjectURL(file) : null;

  if (file) {
    await submitProfileUpdate();
  }
}

async function submitProfileUpdate() {
  const currentUser = user?.value;
  const currentToken = token?.value;

  if (!currentUser || !currentToken) {
    $q.notify({ type: 'negative', message: 'User data or token not available.' });
    return;
  }

  try {
    const formData = new FormData();
    const userId = currentUser.id.toString();
    if (form.value.profile) {
      formData.append('files', form.value.profile);
      formData.append('ref', 'plugin::users-permissions.user');
      formData.append('refId', userId);
      formData.append('field', 'profile');
    } else {
      $q.notify({ type: 'info', message: 'Tidak ada file profil baru yang dipilih.' });
      return;
    }

    const response = await axios.post(
      `${baseUrl}/api/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentToken}`,
        },
      },
    );

    if (response.data && response.data.length > 0) {
      await userStore.fetchUser();
      $q.notify({ type: 'positive', message: 'Foto profil berhasil diperbarui.' });
    } else {
      $q.notify({
        type: 'warning',
        message: 'Foto profil berhasil diupload, tetapi URL tidak ditemukan.',
      });
    }

    preview.value = null;
    form.value.profile = null;
  } catch (err) {
    console.error('Gagal update profil:', err);
    $q.notify({ type: 'negative', message: 'Gagal update foto profil.' });
  }
}

watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

</script>

<style scoped>
.primary-label {
  color: var(--q-primary);
}
.change-link {
  color: var(--q-primary);
  margin-left: 12px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 700;
  transition: color 0.2s;
}
.change-link:hover {
  color: #1976d2;
}

.iwak{
background-color: var(--q-item-background);
}
.q-avatar > img {
  border-radius: 50%;
  object-fit: cover;
}


.profile-sidebar-card {
  border-radius: 50%;
  object-fit: cover;
}

.profile-sidebar-card {
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.profile-header-item {
  padding: 16px;
}

.profile-menu-list .q-item,
.sub-menu-list .q-item {
  min-height: 48px;
}

.profile-menu-item.active-menu-item {
  background-color: #e3f2fd; /* Warna latar belakang untuk item menu aktif */
  color: #1976d2; /* Warna teks untuk item menu aktif */
}

.profile-tab-panels {
  background: none;
}

.profile-content-card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Penyesuaian untuk tampilan mobile */
@media (max-width: 1023px) {
  .profile-content-wrapper {
    flex-direction: column;
    padding: 16px;
  }
  .col-md-3,
  .col-md-8 {
    width: 100%;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .q-ml-xl,
  .q-pr-xl,
  .q-pl-xl {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .profile-content-card {
    height: auto !important; /* Biarkan tinggi menyesuaikan konten di mobile */
  }
  .q-tab-panel.row {
    flex-direction: column;
    gap: 20px !important;
  }
  .my-card {
    width: 100% !important;
  }
}
</style>
