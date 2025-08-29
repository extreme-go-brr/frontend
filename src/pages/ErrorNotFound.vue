<template>
  <div class="flex flex-center bg-grey-2" style="min-height: 99vh;">
    <div class="text-center">
      <q-icon name="report_problem" size="64px" color="primary" class="q-mb-md" />
      <div class="text-h4 text-primary text-weight-bold q-mb-sm">
        404
      </div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg">
        Opps! Nothing here.
      </div>
      <q-btn
        color="primary"
        label="Return to Previous Page"
        icon="arrow_back"
        @click="goBack"
        unelevated
        rounded
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goBack() {
  router.back()
}
</script>
