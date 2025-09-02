<template>
  <div>
    <div class="row justify-between q-mx-md q-my-lg">
      <q-input
      style="width: 60%;"
      outlined
      dense
      v-model="SearchAddress"
      type="text"
      label="write delivery destination" />
    <q-btn
      label="+Add new Address"
      color="primary"
      @click="addNewAddress"
    /></div>
    <div class="text-h6 text-primary q-mb-md q-mx-md">All your Address</div>
    <div v-if="displayedAddresses.length > 0" class="q-mx-md">
      <q-card v-for="address in displayedAddresses" :key="address.documentId || address.id" class="q-my-md address-cart" >
        <q-item-section>
          <q-item-label class="text-weight-bold row items-center" style="font-size: 15px;">
            <div style="width: 6px; height: 25px;flex-shrink: 0;border-radius:
            0px 10px 10px 0px;background: var(--primary-500-utama, linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #082F6D);" class="q-mr-md"></div>
            {{address.nama_alamat || 'Alamat Utama'}}
          </q-item-label>
          <q-item-label class="q-ml-lg q-my-sm">
            <div class="text-h6">{{ address.penerima }}</div>
            <div>+62{{ address.telepon }}</div> <!-- Mengembalikan tampilan nomor telepon -->
          </q-item-label>
          <q-item-label class="q-ml-lg " style="font-size: 14px;">
            {{ address.jalan }}
            </q-item-label>
            <q-item-label class="q-ml-lg " style="font-size: 14px;">
            {{ address.provinsi }}
            </q-item-label>
            <q-item-label class="q-ml-lg " style="font-size: 14px;">
            {{ address.kota }}
            </q-item-label>
            <q-item-section class="q-mt-lg q-ml-lg">
              <div class="row q-gutter-xs">
                <q-btn
                  flat
                  round
                  label="Change Address"
                  color="primary"
                  @click="editAddress(address)"
                />
                <q-separator spaced inset vertical dark  />
                <q-btn
                  flat
                  round
                  label="Delete Address"
                  color="negative"
                  @click="deleteAddress(address.id)"
                />
              </div>
            </q-item-section>
        </q-item-section>
      </q-card>
    </div>
    <div v-else class="text-grey-7 q-pt-md">
      No addresses found. Add your first address.
    </div>

    <q-dialog v-model="isAddressFormOpen" persistent>
      <q-card style="width: 650px; max-width: 90vw;">
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between">
            <q-btn v-if="currentStep > 1" icon="arrow_back" flat round dense @click="prevStep" />
            <div class="text-h6 q-ml-md">{{ isEditMode ? 'Edit Address' : 'Add New Address' }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="resetFormAndClose" />
          </div>

          <!-- Step Indicators -->
          <div class="q-mt-md row justify-center q-gutter-x-md">
            <div class="col-auto text-center">
              <q-icon
                :name="currentStep >= 1 ? 'check_circle' : 'radio_button_unchecked'"
                :color="currentStep >= 1 ? 'primary' : 'grey'"
                size="24px"
              />
              <div :class="{'text-primary': currentStep >= 1}">Set Location</div>
            </div>
            <div class="col-auto text-center step-line-container">
              <div class="step-line"></div>
              <q-icon
                :name="currentStep >= 2 ? 'check_circle' : 'radio_button_unchecked'"
                :color="currentStep >= 2 ? 'primary' : 'grey'"
                size="24px"
              />
              <div :class="{'text-primary': currentStep >= 2}">Complete details</div>
            </div>
          </div>

          <q-separator class="q-my-md full-width" />

          <!-- Step 1: Address Label and Geographic Dropdowns -->
          <div v-if="currentStep === 1">
            <div class="text-h6 q-mb-md">Set your address location</div>
            <q-form @submit.prevent="nextStep" class="q-gutter-md">
              <q-input
                filled
                v-model="addressForm.nama_alamat"
                label="Name Address (example: Home, Office)"
                lazy-rules
                :rules="[val => !!val || 'Address must be filled in']"
              />
               <q-input
                filled
                v-model="addressForm.penerima"
                label="Recipient's name"
                lazy-rules
              />
              <q-select
                filled
                v-model="selectedProvince"
                :options="provinces"
                option-label="name"
                label="Province"
                :loading="loadingProvinces"
                lazy-rules
                :rules="[val => !!val || 'Province must be filled in']"
              />
              <div class="row justify-between" >
                <q-select
                  style="width: 49%;"
                  filled
                  v-model="selectedRegency"
                  :options="regencies"
                  option-label="name"
                  label="City/Regency"
                  :disable="!selectedProvince"
                  :loading="loadingRegencies"
                  lazy-rules
                  :rules="[val => !!val || 'City/District must be filled in']"
                />
                <q-select
                  style="width: 49%;"
                  filled
                  v-model="selectedDistrict"
                  :options="districts"
                  option-label="name"
                  label="Subdistrict"
                  :disable="!selectedRegency"
                  :loading="loadingDistricts"
                  lazy-rules
                  :rules="[val => !!val || 'District must be filled in']"
                />
              </div>
              <q-card-actions align="right" class="q-mt-lg">
                <q-btn label="Continue" color="primary" type="submit" />
              </q-card-actions>
            </q-form>
          </div>

          <!-- Step 2: Remaining Address Details -->
          <div v-if="currentStep === 2">
            <div class="text-h6 q-mb-md">Complete the address details</div>
            <q-form @submit="saveAddress" class="q-gutter-md">
              <q-input
                filled
                v-model="addressForm.jalan"
                label="Street name"
                lazy-rules
                :rules="[val => !!val || 'Street name must be filled in']"
              />
              <div class="row justify-between">
              <q-input
                filled
                v-model="addressForm.no_rumah"
                label="House/Building Number (Optional)"
                style="width: 48%;"
              />
              <q-input
                filled
                v-model="addressForm.rt_rw"
                label="RT/RW (Optional)"
                style="width: 48%;"
              /></div>
              <q-input
                filled
                v-model="addressForm.kode_pos"
                label="Postal code"
                lazy-rules
                :rules="[
                  val => !!val || 'Postal code must be filled in',
                  val => val.length === 5 || 'Postal Code must be 5 digits'
                ]"
              />
               <q-input
                filled
                v-model="addressForm.telepon"
                label="Recipient's telephone number"
                lazy-rules
                type="tel" pattern="[0-9]*" inputmode="numeric" maxlength="11"
              />
              <q-card-actions align="right" class="q-mt-lg">
                <q-btn label="Save Address" color="primary" type="submit" />
              </q-card-actions>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user-stores';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';

const baseUrl = import.meta.env.VITE_STRAPI_API_URL;
const isDarkMode = ref(false);
const $q = useQuasar();
const preview = ref<string | null>(null);
const isAddressFormOpen = ref(false);
const isEditMode = ref(false);
const currentAddress = ref<Address | null>(null);
const SearchAddress = ref('');
// Multi-step form state
const currentStep = ref(1); // Start at step 1
// `agreeToTerms` ref dihapus

const userStore = useUserStore();
const { user, token } = storeToRefs(userStore);

// --- Type Definitions ---
interface GeoItem {
  code: string;
  name: string;
}

interface Address {
  id: number;
  documentId?: string;
  nama_alamat: string;
  jalan: string;
  no_rumah: string;
  rt_rw: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  penerima: string;
  telepon: string;
  // `recipient_name` dan `recipient_phone` dihapus dari interface Address
}

// --- State for geographic data ---
const provinces = ref<GeoItem[]>([]);
const regencies = ref<GeoItem[]>([]);
const districts = ref<GeoItem[]>([]);
const selectedProvince = ref<GeoItem | null>(null);
const selectedRegency = ref<GeoItem | null>(null);
const selectedDistrict = ref<GeoItem | null>(null);

const loadingProvinces = ref(false);
const loadingRegencies = ref(false);
const loadingDistricts = ref(false);

const addressForm = ref({ // Inisialisasi dengan Address type
  nama_alamat: '',
  jalan: '',
  no_rumah: '',
  rt_rw: '',
  kecamatan: '',
  kota: '',
  provinsi: '',
  kode_pos: '',
  penerima: '',
  telepon: '',
  // `recipient_name` dan `recipient_phone` dihapus dari inisialisasi
});

onMounted(async () => {
  await userStore.fetchUser();

  if (user?.value) { // Check if user.value is defined
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

function nextStep() {
  // Validate Step 1 fields before moving to Step 2
  if (!addressForm.value.nama_alamat || !selectedProvince.value || !selectedRegency.value || !selectedDistrict.value) {
    void Swal.fire({ toast: true,
      icon: 'warning',
      title: 'Complete step 1 first',
      showConfirmButton: false,
      timer: 3000 });
    return;
  }
  if (currentStep.value < 2) { // Only 2 steps now
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function resetFormAndClose() {
  isAddressFormOpen.value = false;
  currentStep.value = 1; // Reset step
  addressForm.value = { // Reset to initial state with all fields
    nama_alamat: '',
    jalan: '',
    no_rumah: '',
    rt_rw: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
  penerima: '',
  telepon: '',
    // `recipient_name` dan `recipient_phone` dihapus dari reset
  };
  // `agreeToTerms` reset dihapus
  selectedProvince.value = null;
  selectedRegency.value = null;
  selectedDistrict.value = null;
  provinces.value = [];
  regencies.value = [];
  districts.value = [];
}

async function fetchProvinces() {
  loadingProvinces.value = true;
  try {
    const response = await axios.get(`${baseUrl}/api/regions/provinces`);
    provinces.value = response.data as GeoItem[]; // Cast to GeoItem[]
  } finally {
    loadingProvinces.value = false;
  }
}

async function fetchRegencies(provinceCode: string) {
  loadingRegencies.value = true;
  regencies.value = [];
  districts.value = [];
  selectedRegency.value = null;
  selectedDistrict.value = null;
  if (!provinceCode) {
    loadingRegencies.value = false;
    return;
  }
  try {
    const response = await axios.get(`${baseUrl}/api/regions/regencies/${provinceCode}`);
    regencies.value = response.data as GeoItem[]; // Cast to GeoItem[]
  }  finally {
    loadingRegencies.value = false;
  }
}

async function fetchDistricts(regencyCode: string) {
  loadingDistricts.value = true;
  districts.value = [];
  selectedDistrict.value = null;
  if (!regencyCode) {
    loadingDistricts.value = false;
    return;
  }
  try {
    const response = await axios.get(`${baseUrl}/api/regions/districts/${regencyCode}`);
    districts.value = response.data as GeoItem[]; // Cast to GeoItem[]
  }finally {
    loadingDistricts.value = false;
  }
}

watch(selectedProvince, (newVal) => {
  if (newVal) {
    addressForm.value.provinsi = newVal.name;
    void fetchRegencies(newVal.code);
  } else {
    addressForm.value.provinsi = '';
    regencies.value = [];
    districts.value = [];
    selectedRegency.value = null;
    selectedDistrict.value = null;
  }
});

watch(selectedRegency, (newVal) => {
  if (newVal) {
    addressForm.value.kota = newVal.name;
    void fetchDistricts(newVal.code);
  } else {
    addressForm.value.kota = '';
    districts.value = [];
    selectedDistrict.value = null;
  }
});

watch(selectedDistrict, (newVal) => {
  if (newVal) {
    addressForm.value.kecamatan = newVal.name;
  } else {
    addressForm.value.kecamatan = '';
  }
});

function addNewAddress() {
  isEditMode.value = false;
  currentAddress.value = null;
  resetFormAndClose(); // Reset form and close first, then open with step 1
  isAddressFormOpen.value = true;
  currentStep.value = 1; // Ensure it starts at step 1
  // Fetch provinces when opening the form for a new address
  void fetchProvinces();
}

async function editAddress(address: Address) {
  isEditMode.value = true;
  currentAddress.value = { ...address };
  addressForm.value = {
    nama_alamat: address.nama_alamat || '',
    jalan: address.jalan || '',
    no_rumah: address.no_rumah || '',
    rt_rw: address.rt_rw || '',
    kecamatan: address.kecamatan || '',
    kota: address.kota || '',
    provinsi: address.provinsi || '',
    kode_pos: address.kode_pos || '',
    penerima: address.penerima||'',
    telepon: address.telepon||'',
    // `recipient_name` dan `recipient_phone` dihapus dari populasi
  };

  // Set the dialog directly to step 1 for editing existing address
  currentStep.value = 1;
  isAddressFormOpen.value = true;

  // Re-populate geographic dropdowns for editing
  if (address.provinsi) {
    await fetchProvinces();
    const foundProvince = provinces.value.find(p => p.name === address.provinsi);
    if (foundProvince) {
      selectedProvince.value = foundProvince;
      await fetchRegencies(foundProvince.code);
      const foundRegency = regencies.value.find(r => r.name === address.kota);
      if (foundRegency) {
        selectedRegency.value = foundRegency;
        await fetchDistricts(foundRegency.code);
        const foundDistrict = districts.value.find(d => d.name === address.kecamatan);
        if (foundDistrict) {
          selectedDistrict.value = foundDistrict;
        }
      }
    }
  }
}

async function saveAddress() {
  const currentUser = user?.value;
  const currentToken = token?.value;

  if (!currentUser || !currentToken) {
    void Swal.fire({ toast: true,
      icon: 'warning',
      title: 'Authentication required',
      showConfirmButton: false,
      timer: 3000 });
    return;
  }

  if (!addressForm.value.jalan || !addressForm.value.kode_pos) { // Validasi disesuaikan
      void Swal.fire({ toast: true,
        icon: 'warning',
        title: 'Complete step 2',
        showConfirmButton: false,
        timer: 3000 });
    return;
  }

  try {
    const payload = {
      nama_alamat: addressForm.value.nama_alamat,
      jalan: addressForm.value.jalan,
      no_rumah: addressForm.value.no_rumah,
      rt_rw: addressForm.value.rt_rw,
      kecamatan: selectedDistrict.value?.name || '',
      kota: selectedRegency.value?.name || '',
      provinsi: selectedProvince.value?.name || '',
      kode_pos: addressForm.value.kode_pos,
      penerima: addressForm.value.penerima,
      telepon: addressForm.value.telepon,
      users_permissions_user: currentUser.documentId
    };

    if (isEditMode.value && currentAddress.value?.documentId) {
      await axios.put(`${baseUrl}/api/addresses/${currentAddress.value.documentId}`, { data: payload }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      void Swal.fire({ toast: true,
      icon: 'success',
      title: 'Address updated successfully!',
      showConfirmButton: false,
      timer: 3000 });
    } else {
      await axios.post(`${baseUrl}/api/addresses`, { data: payload }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      void Swal.fire({ toast: true,
      icon: 'success',
      title: 'Address added successfully!',
      showConfirmButton: false,
      timer: 3000 });
    }

    resetFormAndClose();
    await userStore.fetchUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to save address:', error.response?.data || error.message);
    void Swal.fire({ toast: true,
      icon: 'error',
      title: 'Failed to save address: ' + (error.response?.data?.error?.message || error.message),
      showConfirmButton: false,
      timer: 3000 });
  }
}

async function deleteAddress(addressId: number) {
  try {
    const confirm = $q.dialog({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this address?',
      cancel: true,
      persistent: true,
    });

    if (confirm) {
      const currentUser = user?.value;
      const currentToken = token?.value;

      if (!currentUser || !currentToken) {
        $q.notify({ type: 'negative', message: 'Authentication or user data is not available to delete the address.' });
        return;
      }
      const addressToDelete = currentUser.addresses?.find((addr: { id: number; }) => addr.id === addressId);
      if (!addressToDelete?.documentId) {
        $q.notify({ type: 'negative', message: 'Address DocumentId not found.' });
        return;
      }

      await axios.delete(`${baseUrl}/api/addresses/${addressToDelete.documentId}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      await userStore.fetchUser();
      void Swal.fire({ toast: true,
      icon: 'success',
      title: 'Address deleted successfully!',
      showConfirmButton: false,
      timer: 3000 });
    } else {
      void Swal.fire({ toast: true,
      icon: 'error',
      title: 'Address deletion cancelled!',
      showConfirmButton: false,
      timer: 3000 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('An error occurred while deleting the address:', error.response?.data || error.message);
      $q.notify({ type: 'negative', message: `Failed to delete address: ${error.response?.data?.error?.message || error.message}` });
    } else {
      console.error('An error occurred while deleting the address:', error);
      $q.notify({ type: 'negative', message: 'Failed to delete address.' });
    }
  }
}

watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

const displayedAddresses = computed(() => {
  if (!user?.value?.addresses) {
    return [];
  }
  const uniqueAddresses: Address[] = [];
  const seenKeys = new Set<string>();
  user.value.addresses.forEach((address: Address) => {
    // Kunci unik hanya menggunakan bidang yang ada di Address interface
    const uniqueKey = `${address.nama_alamat}-${address.jalan}-${address.no_rumah || ''}-${address.rt_rw || ''}-${address.kecamatan}-${address.kota}-${address.provinsi}-${address.kode_pos}`;
    if (!seenKeys.has(uniqueKey)) {
      uniqueAddresses.push(address);
      seenKeys.add(uniqueKey);
    }
  });
  return uniqueAddresses;
});

// Fungsi `openTerms` dan `openPrivacy` dihapus
</script>

<style>
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

/* Styling for the step line */
.step-line-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-line {
  position: absolute;
  top: 12px; /* Half of icon size */
  left: -50%; /* Extend to the left of the current icon */
  width: 100%; /* Cover the space between icons */
  height: 2px;
  background-color: #e0e0e0; /* Grey line for inactive */
  z-index: -1; /* Send behind icons */
}

/* This will make the line between the first and second step primary */
.step-line-container:nth-child(2) .step-line {
  background-color: var(--q-primary);
}

/* For responsiveness of step indicators on smaller screens */
@media (max-width: 600px) {
  .q-gutter-x-md > * {
    margin-left: 8px !important; /* Adjust gutter for smaller screens */
    margin-right: 8px !important;
  }
  .step-line {
    /* Hide or reduce line length on very small screens if it breaks layout */
    display: none;
  }
}
</style>
