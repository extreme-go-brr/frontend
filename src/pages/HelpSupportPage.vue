<template>
  <div class="help-page-container">
    <!-- Hero Section -->
    <div :class="['section-white', { 'dark-bg': $q.dark.isActive }]">
      <div class="help-content-wrapper">
        <div class="hero-section">
          <div class="hero-text">
            <h1>
              Hello, <span class="text-primary text-weight-bold">{{ user?.username || 'Customer' }}</span>
            </h1>
            <h2>How can I help?</h2>
            <div class="search-bar">
              <input type="text" placeholder="Have any questions? (example: can I track my order?)" />
              <img src="/public/iconasli/search-normal.png" alt="Search Icon" class="search-icon" />
            </div>
          </div>
          <div class="hero-image">
            <img src="/public/others/helps/helpgelapp.png" alt="Help Illustration" />
          </div>
        </div>
      </div>
    </div>

    <div class="full-divider"></div>

    <!-- Topic Grid -->
    <div :class="['section-white', { 'dark-bg': $q.dark.isActive }]">
      <div class="help-content-wrapper">
        <h3 class="section-title">Select a topic according to your purchasing problem</h3>
        <div class="topic-grid">
          <div class="topic-card" @click="$router.push({ name: 'PersonalAccount' })">
            <img src="/public/helpicon/profile.png" alt="Personal Account Icon" class="topic-img-blue" />
            <span>Personal account</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'OrderedItem' })">
            <img src="/public/helpicon/box.png" alt="Ordered Item Icon" class="topic-img-blue" />
            <span>Ordered item</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'PaymentPage' })">
            <img src="/public/helpicon/dollar-circle.png" alt="Payment Icon" class="topic-img-blue" />
            <span>Payment</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'DeliveryPage' })">
            <img src="/public/helpicon/truck-fast.png" alt="Delivery Icon" class="topic-img-blue" />
            <span>Delivery</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'RefundPage' })">
            <img src="/public/helpicon/empty-wallet-change.png" alt="Refund Icon" class="topic-img-blue" />
            <span>Refund</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'OrderComplaint' })">
            <img src="/public/helpicon/box-remove.png" alt="Order Complaint Icon" class="topic-img-blue" />
            <span>Order complaint</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'HowToMake' })">
            <img src="/public/helpicon/task-square.png" alt="How to Make Icon" class="topic-img-blue" />
            <span>How to make</span>
          </div>
          <div class="topic-card" @click="$router.push({ name: 'OtherPage' })">
            <img src="/public/helpicon/category.png" alt="Other Icon" class="topic-img-blue" />
            <span>Other</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div :class="['section-grey', { 'dark-bg-grey': $q.dark.isActive }]">
      <div class="help-content-wrapper">
        <h3 class="section-title">Frequently asked questions</h3>
        <div class="faq-right">
          <q-expansion-item
            v-for="(faq, index) in faqs"
            :key="index"
            expand-separator
            :label="faq.question"
            :default-opened="expanded === index"
            @click="toggle(index)"
            class="faq-item"
            expand-icon="keyboard_arrow_down"
            dense
            header-class="text-weight-medium"
          >
            <transition name="faq-fade">
              <div v-show="expanded === index" class="faq-answer text-body2 q-pb-sm">
                <template v-if="faq.linkText">
                  {{ faq.answerPrefix }}
                  <span
                    @click="goToChatAI"
                    class="text-primary cursor-pointer"
                    style="text-decoration: underline;"
                  >{{ faq.linkText }}</span>
                </template>
                <template v-else>
                  {{ faq.answer }}
                </template>
              </div>
            </transition>
          </q-expansion-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const user = ref<{ username?: string } | null>(null);
const router = useRouter();

if (typeof window !== 'undefined') {
  const userData = localStorage.getItem('user');
  try {
    user.value = userData ? JSON.parse(userData) : null;
  } catch {
    user.value = null;
  }
}

interface Faq {
  question: string;
  answer?: string;
  answerPrefix?: string;
  linkText?: string;
}

const faqs = ref<Faq[]>([
  {
    question: 'How do I track my order?',
    answer: 'You can track your order in your order history section.'
  },
  {
    question: 'How do I contact support?',
    answerPrefix: 'Need assistance? ',
    linkText: 'Chat with AI'
  },
  {
    question: 'How do I request a refund?',
    answer: 'You can request a refund through your order detail page.'
  }
]);

const expanded = ref<number | null>(null);

function toggle(index: number) {
  expanded.value = expanded.value === index ? null : index;
}

function goToChatAI() {
  void router.push('/chatai');
}
</script>

<style scoped>
.help-page-container {
  width: 100%;
}

/* Sections */
.section-white {
  width: 100%;
  background-color: white;
}

.section-grey {
  width: 100%;
  background-color: #f4f4f4;
}

/* Dark mode overrides */
.dark-bg {
  background-color: #181818 !important;
}
.dark-bg-grey {
  background-color: #232323 !important;
}

/* Divider */
.full-divider {
  height: 15px;
  background-color: var(--q-body-background);

}
.dark-bg .full-divider,
.dark-bg-grey .full-divider {
  background-color: #232323 !important;
}

/* Wrapper */
.help-content-wrapper {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding: 40px 0;
}

/* Hero */
.hero-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-top: -30px;
}

.hero-text {
  flex: 1 1 400px;
}

.hero-text h1 {
  font-size: 2.8em;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
  line-height: 0;
}
.dark-bg .hero-text h1 {
  color: #fff;
}

.hero-text h2 {
  font-size: 1.6em;
  color: #555;
  margin-bottom: 30px;
  font-weight: bold;
}
.dark-bg .hero-text h2 {
  color: #ccc;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-bar input {
  width: 100%;
  padding: 15px 20px 15px 20px;
  padding-right: 50px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1em;
  color: #666;
  background: #fff;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.dark-bg .search-bar input {
  background: #232323;
  color: #eee;
  border: 1px solid #444;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  filter: none;
}
.dark-bg .search-icon {
  filter: brightness(0) invert(1);
}

.hero-image {
  flex: 1 1 300px;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

/* Topics */
.section-title {
  font-size: 1.6em;
  color: #333;
  margin: 30px 0;
  text-align: center;
}
.dark-bg .section-title,
.dark-bg-grey .section-title {
  color: #fff;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}
@media (min-width: 1024px) {
  .topic-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.topic-card {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}
.dark-bg .topic-card {
  background-color: #232323;
  border: 1px solid #333;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}
.topic-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.dark-bg .topic-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

.topic-card img {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  filter: none;
}
.dark-bg .topic-card img {
  filter: brightness(0.8) invert(0.85);
}

.topic-card span {
  font-size: 1em;
  color: #555;
  font-weight: 500;
}
.dark-bg .topic-card span {
  color: #eee;
}

/* FAQ */
.faq-item {
  margin-bottom: 1rem;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background 0.2s, color 0.2s;
}
.dark-bg-grey .faq-item,
.dark-bg .faq-item {
  background: #232323;
  color: #eee;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
}

.faq-answer {
  padding: 0 16px 16px 16px;
  line-height: 1.5;
  color: #555;
}
.dark-bg-grey .faq-answer,
.dark-bg .faq-answer {
  color: #eee;
}

.topic-card img.topic-img-blue {
  /* Hapus filter di light mode agar warna asli biru tetap */
  filter: none;
}
.dark-bg .topic-card img.topic-img-blue {
  /* Tetap gunakan filter biru #4A90E2 di dark mode */
  filter: brightness(0) saturate(100%) invert(48%) sepia(77%) saturate(747%) hue-rotate(181deg) brightness(97%) contrast(93%);
}

@media (max-width: 599px) {
  .topic-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
