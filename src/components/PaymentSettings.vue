<template>
  <q-page class="q-pa-md main-wrapper" style="min-height: unset;">
    <div class="row q-col-gutter-xl justify-center">
      <!-- Sidebar -->
      <div class="col-12 col-md-6">
        <div class="text-h6 q-mb-sm">Welcome to the</div>
        <div class="text-h5 text-bold q-mb-sm">Payment Settings</div>
        <div class="text-caption text-grey q-mb-md">
          Improve your shopping experience at Maker.id with better payment management.
        </div>

        <q-list bordered class="rounded-borders">
          <q-item
            v-for="method in paymentMethods"
            :key="method.name"
            clickable
            :active="selectedMethod === method.name"
            @click="selectedMethod = method.name"
            active-class=" text-primary"
          >
            <q-item-section>{{ method.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Main Content -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-lg q-mb-md">
          <div class="text-h6 text-bold q-mb-md">
            {{ selectedMethodLabel }}
          </div>

          <div v-if="!hasSaved[selectedMethod  as keyof typeof hasSaved]" class="column items-center q-gutter-sm">
            <img
              :src="placeholderImage"
              alt="placeholder"
              style="max-width: 180px; max-height: 180px"
            />

            <div class="text-subtitle1 text-bold q-mt-md">
              {{ placeholderTitle }}
            </div>
            <div class="text-caption text-center q-mb-md" style="max-width: 350px">
              {{ placeholderSubtitle }}
            </div>

            <q-btn
              label="Activate"
              color="primary"
              class="q-mt-sm"
              unelevated
              style="min-width: 180px"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedMethod = ref('creditcard')

const paymentMethods = [
  { name: 'creditcard', label: 'Credit/Debit Card' },
  { name: 'paypal', label: 'PayPal' },
  { name: 'dana', label: 'DANA' }
]

const hasSaved = {
  creditcard: false,
  paypal: false,
  dana: false
}

const selectedMethodLabel = computed(() => {
  return paymentMethods.find(method => method.name === selectedMethod.value)?.label || ''
})

const placeholderImage = computed(() => {
  if (selectedMethod.value === 'paypal') {
    return '/paypal.png'
  } else if (selectedMethod.value === 'creditcard') {
    return '/creditdebit.png'
  } else if (selectedMethod.value === 'dana') {
    return '/Vektor DANA.png'
  }
  return ''
})

const placeholderTitle = computed(() => {
  if (selectedMethod.value === 'paypal') {
    return 'Activate PayPal Now'
  } else if (selectedMethod.value === 'creditcard') {
    return 'No Credit/Debit cards saved yet'
  } else if (selectedMethod.value === 'dana') {
    return 'No DANA account connected yet'
  }
  return ''
})

const placeholderSubtitle = computed(() => {
  if (selectedMethod.value === 'paypal') {
    return 'You haven’t connected your PayPal account. Set it up now to use it.'
  } else if (selectedMethod.value === 'creditcard') {
    return 'Save your credit or debit card info to simplify the payment process.'
  } else if (selectedMethod.value === 'dana') {
    return 'Connect your DANA wallet to make fast, secure transactions on Maker.id.'
  }
  return ''
})
</script>
<style scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  height: auto; /* biar sesuai konten */
  max-width: 1200px;
  margin: 0 auto; /* center di tengah */
}

.inner-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
  height: auto; /* mengikuti isi */
}
</style>

