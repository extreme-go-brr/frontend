<template>
  <q-page class="row justify-center q-pb-lg">
    <div class="notif-content-wrapper">
      <q-card
        flat
        bordered
        class="notif-content-card"
        style="border-radius: 10px; min-height: 600px;"
      >
        <div class="notif-header row items-center justify-between q-pa-md">
          <div class="text-h5 text-primary">System Notifications</div>
          <q-btn
            icon="refresh"
            color="primary"
            flat
            round
            @click="fetchNotifications"
            :loading="loading"
            size="md"
            class="q-ml-sm"
            aria-label="Refresh"
          />
        </div>
        <q-separator />

        <div v-if="notifications.length === 0" class="row justify-center items-center q-pa-xl">
          <q-icon name="notifications_off" size="64px" color="grey-5" />
          <div class="text-subtitle2 text-grey-6 q-ml-md">
            No notifications found.
          </div>
        </div>

        <q-list v-else class="notif-list q-pa-md">
          <q-slide-item
            v-for="notif in notifications"
            :key="notif.id"
            @right="removeNotification(notif.id)"
            right-color="negative"
            right-icon="delete"
          >
            <q-item clickable class="notif-item" :class="{ unread: !notif.read }" @click="showDetail(notif)">
              <q-item-section avatar>
                <q-icon :name="notif.icon || 'notifications'" color="primary" size="32px" />
              </q-item-section>
              <q-item-section>
                <div class="text-bold">{{ notif.title }}</div>
                <div class="text-caption text-grey-7">{{ notif.message }}</div>
              </q-item-section>
              <q-item-section side>
                <div class="text-caption text-grey-5">{{ formatDate(notif.date) }}</div>
                <q-badge class="q-mr-sm" v-if="!notif.read" color="primary" label="New"/>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
      </q-card>
    </div>
    <!-- Detail Dialog -->
    <q-dialog v-model="detailDialog">
      <q-card style="min-width:350px;max-width:90vw;">
        <q-card-section class="row items-center">
          <q-icon :name="selectedNotif?.icon || 'notifications'" color="primary" size="40px" class="q-mr-md" />
          <div>
            <div class="text-h6">{{ selectedNotif?.title }}</div>
            <div class="text-caption text-grey-7">{{ formatDate(selectedNotif?.date || '') }}</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-body1">{{ selectedNotif?.message }}</div>
          <!-- Tambahkan detail lain di sini jika ada -->
          <div v-if="selectedNotif && selectedNotif.extra" class="q-mt-md">
            <div class="text-caption text-grey-6">Details:</div>
            <div class="text-body2">{{ selectedNotif.extra }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const loading = ref(false);

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon?: string;
  extra?: string; // Untuk detail tambahan jika ada
}

const notifications = ref<Notification[]>([]);
const detailDialog = ref(false);
const selectedNotif = ref<Notification | null>(null);

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString();
}

function fetchNotifications() {
  loading.value = true;
  setTimeout(() => {
    notifications.value = [
      {
        id: 1,
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
        date: new Date().toISOString(),
        read: false,
        icon: 'check_circle',
        extra: 'You can now access all features.'
      },
      {
        id: 2,
        title: 'System Update',
        message: 'The system will be updated tonight at 12:00 AM.',
        date: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        icon: 'system_update',
        extra: 'Expected downtime: 30 minutes.'
      },
      {
        id: 3,
        title: 'Password Changed',
        message: 'Your password was changed successfully.',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        icon: 'lock'
      }
    ];
    loading.value = false;
  }, 800);
}

function removeNotification(id: number) {
  notifications.value = notifications.value.filter(n => n.id !== id);
  $q.notify({ type: 'positive', message: 'Notification removed.' });
}

function showDetail(notif: Notification) {
  selectedNotif.value = notif;
  detailDialog.value = true;
  // Tandai sebagai sudah dibaca jika belum
  if (!notif.read) {
    notif.read = true;
  }
}

onMounted(() => {
  fetchNotifications();
});
</script>
