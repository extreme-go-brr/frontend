<template>
  <q-page class="row no-wrap bg-white font-lato full-height">
    <div class="image-section">
      <img src="/loginregister/login.png" alt="Login Illustration" class="login-image" />
    </div>

    <div class="login-section q-pa-xl column justify-center items-center">
      <h1 class="text-h4 text-black text-center q-mb-lg">Login to Your Account</h1>

      <q-form @submit.prevent="onLogin" class="q-gutter-md" style="width: 100%; max-width: 400px;">
        <q-input
          v-model="email"
          filled
          dense
          type="email"
          label="Email"
          :rules="emailRules"
          ref="emailRef"
          lazy-rules
          autocomplete="email"
        />

        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          filled
          dense
          label="Password"
          :rules="passwordRules"
          ref="passwordRef"
          autocomplete="current-password"
          class="rounded-borders"
        >
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="togglePassword"
            />
          </template>
        </q-input>

        <div class="row justify-between items-center q-mb-sm">
          <q-checkbox v-model="rememberMe" label="Remember me" dense size="sm" class="text-grey-8" />
          <a href="#" class="text-primary text-body2 text-weight-medium" @click.prevent="showForgotPasswordDialog = true">
            Forgot password?
          </a>
        </div>

        <q-btn
          label="Login"
          color="primary"
          type="submit"
          text-color="white"
          unelevated
          class="full-width"
          :loading="loading"
        />

        <q-btn outline color="grey-8" no-caps class="full-width" @click="handleGoogleSignIn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            class="google-logo"
          />
          Login with Google
        </q-btn>

        <div class="text-center q-mt-md flex justify-center items-center" style="gap: 8px;">
          <span class="text-body2">Don't have an account yet?</span>
          <span class="text-warning cursor-pointer text-body2" @click="redirectToSignup">
            Register now
          </span>
        </div>
      </q-form>
    </div>

    <q-dialog v-model="showForgotPasswordDialog">
      <q-card style="width: 400px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Reset Password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="resetEmail"
            filled
            dense
            type="email"
            label="Enter your email"
            :rules="emailRules"
            ref="resetEmailRef"
            @keyup.enter="sendResetEmail"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" @click="showForgotPasswordDialog = false" />
          <q-btn label="Send Reset Link" color="primary" @click="sendResetEmail" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useQuasar, QInput } from 'quasar';

const $q = useQuasar();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const resetEmail = ref('');
const loading = ref(false);
const showForgotPasswordDialog = ref(false);

const emailRef = ref<InstanceType<typeof QInput> | null>(null);
const passwordRef = ref<InstanceType<typeof QInput> | null>(null);
const resetEmailRef = ref<InstanceType<typeof QInput> | null>(null);

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format'
];

const passwordRules = [(val: string) => !!val || 'Password is required'];

onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    email.value = rememberedEmail;
    rememberMe.value = true;
  }

  if (!document.getElementById('google-oauth')) {
    const script = document.createElement('script');
    script.id = 'google-oauth';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const onLogin = async () => {
  const validEmail = await emailRef.value?.validate?.();
  const validPassword = await passwordRef.value?.validate?.();

  if (!validEmail || !validPassword) return;

  loading.value = true;
  try {
    const { data } = await axios.post('http://192.168.0.192:1337/api/auth/local', {
      identifier: email.value,
      password: password.value
    });

    const { jwt, user } = data;
    localStorage.setItem('token', jwt);
    localStorage.setItem('user_email', user.email || '');
    localStorage.setItem('user_fullName', user.fullName || user.username || user.name || '');

    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    $q.notify({ color: 'positive', message: 'Login successful!', icon: 'check_circle' });
    setTimeout(() => {
      void router.push('/');
    }, 1500);
  } catch (err) {
    let msg = 'Login failed. Please try again.';
    if (axios.isAxiosError(err) && err.response) {
      msg = err.response.data?.error?.message || msg;
    }
    $q.notify({ color: 'negative', message: msg, icon: 'warning' });
  } finally {
    loading.value = false;
  }
};

const redirectToSignup = () => {
  void router.push('/signup');
};

const sendResetEmail = async () => {
  const valid = await resetEmailRef.value?.validate?.();
  if (!valid) return;

  try {
    await axios.post('http://192.168.0.192:1337/api/auth/forgot-password', {
      email: resetEmail.value
    });

    $q.notify({ color: 'positive', message: 'Reset link sent!', icon: 'check_circle' });
    showForgotPasswordDialog.value = false;
    resetEmail.value = '';
  } catch (err) {
    let msg = 'Failed to send reset email.';
    if (axios.isAxiosError(err) && err.response) {
      msg = err.response.data?.error?.message || msg;
    }
    $q.notify({ color: 'negative', message: msg, icon: 'warning' });
  }
};

const GOOGLE_CLIENT_ID = '200162469870-3pipmrnl0j054drv0kk8u8iuiovkumk2.apps.googleusercontent.com';
const baseUrl = 'http://192.168.0.192:1337/api';

const handleGoogleSignIn = () => {
  // @ts-expect-error: Google SDK global
  const client = window.google?.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'openid profile email',
    callback: ({ access_token }: { access_token: string }) => {
      void fetchGoogleUser(access_token);
    }
  });

  client?.requestAccessToken();
};

const fetchGoogleUser = async (accessToken: string) => {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const data = await res.json();

    const result = await axios.post(`${baseUrl}/auth/google`, {
      email: data.email,
      name: data.name,
      picture: data.picture,
      google_id: data.sub
    });

    const { jwt, user } = result.data;

    localStorage.setItem('token', jwt);
    localStorage.setItem('user_email', user.email || '');
    localStorage.setItem('user_fullName', user.fullName || user.username || user.name || '');

    $q.notify({
      color: 'positive',
      message: 'Google login successful!',
      icon: 'check_circle',
      timeout: 1000
    });

    await router.push('/');
  } catch (err) {
    console.error('Google login failed:', err);
    $q.notify({ color: 'negative', message: 'Google login failed.', icon: 'warning' });
  }
};

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
