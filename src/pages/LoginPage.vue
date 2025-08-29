<template>
  <q-page class="row no-wrap font-lato full-height">
     <div class="image-section">
      <img :src="logoSrc" alt="Login Illustration" class="login-image"
         :style="{ transform: `translateY(${imageOffsetY}px)` }"/>
    </div>
    <div class="login-section q-pa-xl column justify-center items-center">

    <q-form @submit.prevent="submitLogin" class="q-gutter-md column justify-between " style="width: 100%; height: 500px; max-width: 500px; ">
 <h1 class="text-h4 text-center ">Login to Your Account</h1>
 <section>
  <p class="text-subtitle3 text-weight-medium">Email or Username</p>
 <q-input
        filled
        v-model="form.credential"
        label="Email"
        required
        lazy-rules
      /></section>
      <section>
        <p class="text-subtitle3 text-weight-medium">Password</p>
      <q-input
        filled
        v-model="form.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        required
        :rules="passwordRules"
          ref="passwordRef"
          autocomplete="current-password"
          class="rounded-borders"

      ><template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="togglePassword"
            />
          </template></q-input></section>
 <div class="row justify-between items-center"  align="center">
          <q-checkbox v-model="rememberMe" label="Remember me"  size="sm" class="text-grey-8" />
          <a href="#" class="text-primary text-body2 text-weight-medium" @click.prevent="showForgotPasswordDialog = true">
            Forgot password?
          </a>
        <q-btn
          label="Login"
          color="primary"
          type="submit"
          text-color="white"
          unelevated
          class="full-width"
          :loading="loading"
        />
        <!-- <div class="q-py-md" style="width: 100%;">Or Sign in With</div>
        <q-btn outline color="grey-8" no-caps class="full-width">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            class="google-logo"
          />
          Login with Google
        </q-btn> -->
 </div>
 <div class="text-center flex justify-center items-center" style="gap: 8px;">
          <span class="text-body2">Don't have an account yet?</span>
          <span class="text-primary cursor-pointer text-body2" @click="register">
            Register now
          </span>
        </div>
    </q-form>
      </div>
    <q-dialog v-model="successDialog">
      <q-card>
        <q-card-section class="text-h6">Login Successful</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="handleSuccessOK" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar,QInput } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-stores' // <-- Import Pinia store Anda

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore() // <-- Inisialisasi Pinia store
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
const form = ref({
  credential: '',
  password: '',
})
const imageOffsetY = ref(0);
const passwordRules = [(val: string) => !!val || 'Password is required'];
const showPassword = ref(false);
const successDialog = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const showForgotPasswordDialog = ref(false);
const baseUrl = import.meta.env.VITE_STRAPI_API_URL
const logoSrc = computed(() => {
  return $q.dark.isActive ?  '/signD.png':'/login-removebg-preview.png';
});
async function submitLogin() {
  try {
    const response = await fetch(`${baseUrl}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: form.value.credential,
        password: form.value.password,
      }),
    })

    if (!response.ok) {
        // Coba baca respons error dari Strapi jika ada
        const errorData = await response.json().catch(() => ({})); // Pastikan bisa parse JSON
        console.error('Login API error response:', errorData);
        throw new Error(errorData.error?.message || 'Login gagal'); // Gunakan pesan error dari Strapi
    }

    const result = await response.json()

    // =========================================================
    // PERBAIKAN DI SINI: Gunakan Pinia store untuk menyimpan token dan user
    // =========================================================
    userStore.setToken(result.jwt); // Simpan token ke store
    await userStore.fetchUser();    // Panggil fetchUser untuk mendapatkan detail user dan menyimpannya ke store
                                    // Ini juga akan menyimpan user ke localStorage melalui Pinia persistedstate
    // Hapus baris ini: localStorage.setItem('token', result.jwt)
    // Hapus baris ini: localStorage.setItem('user', JSON.stringify(result.user))
    // =========================================================

    successDialog.value = true
    $q.notify({
      type: 'positive',
      message: 'Login successful! Redirecting to homepage...',
      timeout: 1000,
    })

    setTimeout(() => {
      void router.push('/home').catch(console.error) // Arahkan ke /transaksi
    }, 1000)

    resetForm()
  } catch (err: unknown) { // Menangani tipe error lebih baik
    console.error('Login error:', (err as Error).message || err);
    $q.notify({
      type: 'negative',
      message: (err as Error).message || 'Email/Username or Password is incorrect', // Tampilkan pesan error dari Strapi jika ada
    })
  }
}
const register = () => {
  void router.push('/second/create-akun');
};
function handleSuccessOK() {
  successDialog.value = false
  void router.push('/home').catch((err) => {
    console.error('Navigation failed:', err)
  })
}
function resetForm() {
  form.value = {
    credential: '',
    password: '',
  }
}
</script>

<style scoped>
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
  margin-left: 30px;
}

.login-section {
  flex: 1;
  min-width: 300px;
  padding-top: 0;
  padding-bottom: 0;
}

.rounded-borders {
  border-radius: 10px;
}

.full-width {
  border-radius: 7px;
  height: 48px;
  width: 96%;
}

.google-logo {
  height: 18px;
  margin-right: 8px;
}

@media (max-width: 1024px) {
  .image-section {
    display: none;
  }

  .login-section {
    width: 100%;
    padding: 24px;
  }

  .column {
    width: 100%;
  }

  .q-gutter-md .q-btn {
    width: 100% !important;
  }
}
</style>
