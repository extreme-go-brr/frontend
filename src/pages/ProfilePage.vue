
<template>
  <q-page class="row justify-center q-pb-lg" >
    <div
      class="profile-content-wrapper"
    >
      <div >
        <q-card
          flat
          bordered
          class="profile-content-card"
          style="border-radius: 10px; min-height: 600px;"
        >
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey-7  q-pt-sm q-pb-sm q-ml-sm"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="personal_data" label="Personal data" />
            <q-tab name="address_list" label="Address list" />
            <q-tab name="payment" label="Payment" />
            <q-tab name="bank_account" label="Bank account" />
            <q-tab name="security" label="Security" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated class="profile-tab-panels">
            <q-tab-panel name="personal_data" class="row" style="gap: 100px">
                <PersonalData/>
            </q-tab-panel>

            <q-tab-panel name="address_list">
              <AddressList/>
            </q-tab-panel>

            <q-tab-panel name="payment" >
              <PaymentSettings />
            </q-tab-panel>

            <q-tab-panel name="bank_account">
              <BankAccount />
            </q-tab-panel>



            <q-tab-panel name="security">
              <SecuritySettings />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

  </q-page>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, watch} from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'stores/user-stores';
import { storeToRefs } from 'pinia';
import PersonalData from 'src/components/PersonalData.vue';
import AddressList from 'src/components/AddressList.vue';
import BankAccount from 'src/components/BankAccount.vue';
import PaymentSettings from 'src/components/PaymentSettings.vue';
import SecuritySettings from 'src/components/SecuritySettings.vue';

const baseUrl = import.meta.env.VITE_STRAPI_API_URL;

const $q = useQuasar();
const activeTab = ref('personal_data');
const preview = ref<string | null>(null);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isDarkMode = ref(false);
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


watch(isDarkMode, (val) => {
  $q.dark.set(val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

</script>

<style scoped>
.q-avatar > img {
  border-radius: 50%;
  object-fit: cover;
}

.profile-content-wrapper {
height: 600px;
  width: 851px;
  margin: 0 auto;
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
  background-color: var(--q-item-background);
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
