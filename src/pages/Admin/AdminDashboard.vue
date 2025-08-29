<template>
  <div class="admin-dashboard">
    <main class="content">
      <section class="stats">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>{{ totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Active Sessions</h3>
          <p>15</p>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <p>$2,500</p>
        </div>
      </section>

      <section class="main-section">
        <h2>Recent Activity</h2>
        <ul>
          <li>User John registered</li>
          <li>User Jane updated profile</li>
          <li>Payment received from Alice</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalUsers = ref(0)

onMounted(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_STRAPI_API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
      }
    })
    totalUsers.value = res.data.length
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
})
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--q-body-background);
}
.content {
  flex: 1;
  padding: 2rem;
}
.stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.stat-card {
  background: var(--q-card-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 1;
  text-align: center;
  min-width: 250px;
}
.stat-card h3 {
  margin-bottom: 0.5rem;
  color: var(--q-text-color);
  font-size: clamp(1rem, 2vw, 1.25rem);
}
.stat-card p {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: bold;
  color: var(--q-primary);
}
.main-section {
  background: var(--q-card-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.main-section h2 {
  margin-bottom: 1rem;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
}
.main-section ul {
  list-style: disc;
  padding-left: 1.5rem;
}
@media screen and (max-width: 768px) {
  .stats {
    gap: 1rem;
  }
  .stat-card {
    min-width: 100%;
  }
  .content {
    padding: 1rem;
  }
}
@media screen and (max-width: 480px) {
  .stat-card {
    padding: 1rem;
  }
  .main-section {
    padding: 1rem;
  }
}
</style>
