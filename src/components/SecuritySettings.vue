<template>
  <!-- Security Settings Page -->
  <q-page class="flex flex-center" style="min-height: 80vh;">
    <div class="text-center">
      <q-icon name="security" size="64px" color="primary" class="q-mb-md" />
      <div class="text-h4 text-primary text-weight-bold q-mb-sm">
        Security Settings
      </div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg">
        Manage your security settings here.
      </div>
      <q-btn
        color="primary"
        label="Return to Profile"
        icon="arrow_back"
        @click="$router.push('/profile')"
        unelevated
        rounded
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
//
</script>
