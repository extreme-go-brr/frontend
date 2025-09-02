<template>
  <q-page class="q-pa-md main-wrapper" style="min-height: unset;">
    <div v-if="bankAccounts.length === 0" class="column items-center justify-center text-center q-gutter-md q-mt-xl">
      <q-img
        src="/bankaccount.png"
        style="max-width: 300px"
        fit="contain"
        alt="No bank account"
      />
      <div class="text-h6">There is no saved account yet</div>
      <div class="text-subtitle2 text-grey-7">
        Add your bank account to make transactions on Maker.id easier.
      </div>
      <q-btn label="Add account" color="primary" unelevated />
    </div>

    <!-- Tambahan untuk kondisi jika ada akun bank -->
    <!-- <div v-else> ... </div> -->
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dummy array sementara
const bankAccounts = ref([]) // ganti ke isi array jika ingin testing kondisi "if"
</script>
