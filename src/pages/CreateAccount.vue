<template>
  <q-page class="row no-wrap font-lato full-height">
    <div class="image-section">
      <img
        src="/signUD.png"
        alt="Login Illustration"
        class="login-image"
         :style="{ transform: `translateY(${imageOffsetY}px)` }"
      />
    </div>
<div
      ref="signupScrollContainerRef"
      class="signup-section q-pa-xl column justify-center items-center"
      @scroll="handleScroll"
    >
    <q-form @submit.prevent="submitAkun" class="q-gutter-md " style="width: 100%; max-width: 500px; margin: auto">
      <h1 class="text-h4  text-center q-mb-lg">Create Your Account</h1>
      <q-input filled v-model="form.username" label="Username" required />
      <q-input
           filled v-model="form.password" label="Password" :type="showPassword ? 'text' : 'password'" required > <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template></q-input>
      <q-input filled v-model="form.confirmPassword" label="Confirm Password" :type="showConfirmPassword ? 'text' : 'password'" required > <template #append>
            <q-icon
              :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template></q-input>
      <q-input filled v-model="form.email" label="Enter Email" type="email" required />

      <q-input filled v-model="form.no_telp" label="Phone Number (without the '0' at the beginning)" type="tel" pattern="[0-9]*" inputmode="numeric" maxlength="11" required />

       <div class="q-gutter-y-md q-mt-md">
<q-btn icon="check"
label="Create Account"
        type="submit"
        color="primary"
        class="q-mt-md full-width"
        :loading="loading" />
         <q-btn outline color="grey-8" no-caps class="full-width">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            class="google-logo"
          />
          Register with Google
        </q-btn>
        </div>

        <div class="text-center q-mt-md flex justify-center items-center" style="gap: 8px;">
          <span class="text-body2">Already have an account?</span>
          <span class="cursor-pointer text-body2 text-primary" @click="() => router.push('/second/login-akun')">
            Login now
          </span>
        </div>

    </q-form>

    <q-dialog v-model="successDialog">
      <q-card>
        <q-card-section class="text-h6">Succeed</q-card-section>
        <q-card-section>Account created successfully!</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="redirectToLogin" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
  </q-page>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/user-stores';
import axios from 'axios';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  no_telp: '',
  profile: null as File | null,
});

const preview = ref<string | null>(null);
const successDialog = ref(false);
const loading = ref(false);
const imageOffsetY = ref(0);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const signupScrollContainerRef = ref<HTMLElement | null>(null);
const PARALLAX_FACTOR = 0.3;
const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

function redirectToLogin() {
  void router.push('/second/login-akun');
}
function handleScroll() {
  if (signupScrollContainerRef.value) {
    imageOffsetY.value = signupScrollContainerRef.value.scrollTop * PARALLAX_FACTOR;
  }
}
async function submitAkun() {
  loading.value = true;
  try {
    if (form.value.password !== form.value.confirmPassword) {
      $q.notify({ type: 'negative', message: 'Kata sandi tidak cocok.' });
      loading.value = false;
      return;
    }



    // 2. Registrasi user baru
    const registerPayload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };

    const registerRes = await axios.post(`${baseUrl}/api/auth/local/register`, registerPayload);
    const jwt = registerRes.data.jwt;
    const userId = registerRes.data.user.id; // userId sekarang akan digunakan

    // Simpan token ke store
    userStore.setToken(jwt);

    // 3. Update User dengan Foto Profil dan No. Telp
    const updatePayload: { profile?: number; no_telp?: string } = {};
    if (form.value.no_telp) {
      // ✅ PERBAIKAN: Pastikan no_telp dikirim sebagai string tanpa +62 jika field di Strapi tidak mengharapkannya
      // Jika no_telp di Strapi adalah 'Text' biasa, kirim string biasa
      updatePayload.no_telp = form.value.no_telp;
      // Jika Strapi Anda mengharapkan +62: updatePayload.no_telp = '+62' + form.value.no_telp;
    }

    if (Object.keys(updatePayload).length > 0) {
      try {
        // ✅ PERBAIKAN: Gunakan userId (ID numerik) untuk update user
        const userUpdateRes = await axios.put(`${baseUrl}/api/users/${userId}`, updatePayload, { // ✅ Hapus `data:` wrapper
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ User profile and phone updated successfully. Response:', userUpdateRes.data);
      } catch (userUpdateError: any) {
        console.error('❌ Error updating user profile/phone:', userUpdateError.response?.data || userUpdateError);
        $q.notify({ type: 'warning', message: `Gagal update profil/no.telp user: ${userUpdateError.response?.data?.error?.message || 'Terjadi kesalahan.'}` });
      }
    }
    await userStore.fetchUser();

    successDialog.value = true;
    resetForm();

  } catch (err: any) {
    console.error('🛑 General Error during account creation:', err.message || err);
    $q.notify({ type: 'negative', message: err.response?.data?.error?.message || 'Terjadi kesalahan saat membuat akun.' });
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    no_telp: '',
    profile: null,
  };
  preview.value = null;
}


</script>

<style scoped>
/* Ensure Lato font is available in your project's index.html or quasar.config.js */
.font-lato {
  font-family: 'Lato', sans-serif;
}

.full-height {
  height: 100vh;
}

.image-section {
  width: 50vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.login-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  align-self: center;
  transition: transform 0.1s ease-out; /* Smooth transition for image movement */
  margin: 0 auto;
  margin-left: 30px;
}

.signup-section {
  flex: 1;
  min-width: 300px;
  padding-top: 0px;
  overflow-y: auto; /* Ensure this section is scrollable if content is long */
}

/* Ensure consistent rounded corners */
.q-input.rounded-borders .q-field__control {
  border-radius: 10px;
}

/* Override Quasar's default filled input border-radius if needed */
.q-field--filled .q-field__control,
.q-field--filled .q-field__marginal {
  border-radius: 10px !important; /* Apply to all filled inputs */
}

.full-width {
  border-radius: 7px;
  height: 48px;
  width: 96%; /* Adjusted to match your template's visual width */
}

.google-logo {
  height: 18px;
  margin-right: 8px;
}

/* Responsive: hide image on tablets and phones */
@media (max-width: 1024px) {
  .image-section {
    display: none;
  }

  .signup-section {
    width: 100%;
    padding: 24px;
  }
  .column {
    width: 100%;
  }
  .q-gutter-md .q-btn {
    width: 100% !important; /* Ensure buttons take full width on small screens */
  }
}
</style>
