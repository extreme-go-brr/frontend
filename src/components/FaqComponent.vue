<template>
  <div class="faq-container q-pa-md" :class="{ 'faq-dark': $q.dark.isActive }">
    <div class="faq-left">
      <h5 class=" text-weight-bold q-mb-md">Frequently Asked Questions (FAQ)</h5>
      <p class="text-body1 text-grey-5">
        We have collected some frequently asked questions from our users. If you have any other questions, please feel free to contact us.
      </p>
    </div>

    <div class="faq-right">
      <q-expansion-item
        v-for="(faq, index) in faqs"
        :key="index"
        :label="faq.question"
        :default-opened="expanded === index"
        @click="toggle(index)"
        class="faq-item"
        expand-icon="keyboard_arrow_down"
        dense
        header-class="text-weight-medium"
      >
        <q-separator />
        <!-- Modifikasi untuk menampilkan jawaban dengan tautan atau teks biasa -->
        <transition name="faq-fade">
          <div v-show="expanded === index" class="faq-answer text-body2">
            <template v-if="faq.linkText">
              {{ faq.answerPrefix }}
              <span
                @click="goToChatAI(faq)"
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

// Definisikan tipe untuk item FAQ agar lebih jelas
interface FaqItem {
  question: string;
  answer?: string;        // Untuk jawaban teks biasa
  answerPrefix?: string;  // Teks sebelum tautan (jika ada tautan)
  linkText?: string;      // Teks tautan (jika ada tautan)
  linkRoute?: string;     // Rute tautan (jika ada tautan)
}
const faqs = ref<FaqItem[]>([
  {
    question: 'What is maker.id?',
    answer:
      'Maker.id is a platform that connects product creators with buyers, facilitating transactions and collaborations in the world of creation, innovation, and technology.',
  },
  {
    question: 'How do I register?',
    answer:
      'To register, visit our registration page, fill out the registration form with the required information, and follow the verification steps provided.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept various payment methods including credit cards, bank transfers, and digital wallets. Please check our payment options page for more details.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach our customer support via email at innodrive.ai@gmail.com or contact us by phone at +62 857-3514-6647.',
  },
  {
    question: 'How can I read the FAQ in more detail?',
    answerPrefix: 'To read the FAQ in more detail, please ',
    linkText: 'Click me',
    answer: '',
    linkRoute: '/support',
  },
  // {
  //   question: 'Need more questions?',
  //   answerPrefix:
  //     'If you have any other questions or need further assistance, feel free to ask our AI Chat! Our AI is ready to assist you 24/7. ',
  //   linkText: 'Click me',
  // },
]);

const expanded = ref<number | null>(); // Membuka item pertama secara default

function goToChatAI(faq: FaqItem) {
  if (faq.linkRoute) {
    void router.push(faq.linkRoute);
    return;
  }

  // Cek status login. Anda mungkin menggunakan 'token' atau 'user'
  // Sesuaikan 'token' dengan key yang Anda gunakan di localStorage untuk menandakan login
  const isAuthenticated = !!localStorage.getItem('token');

  if (isAuthenticated) {
    void router.push({ name: 'DashboardChatAI' });
  } else {
    void router.push({ name: 'PublicChatAI' });
  }
}
function toggle(index: number) {
  // Jika item yang sama diklik, tutup. Jika tidak, buka item yang baru.
  expanded.value = expanded.value === index ? null : index;
}
</script>

<style scoped>
.faq-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem; /* Ruang antar kolom */
  background-color: var(--q_body_background); /* Warna latar belakang lebih terang */
  padding: 2.5rem; /* Padding sedikit lebih besar */
  border-radius: 12px; /* Sudut lebih membulat */
}

.faq-left {
  flex: 1 1 40%;
  padding-right: 1rem; /* Sedikit padding di kanan untuk teks kiri */
}

.faq-left p {
  line-height: 1.6; /* Keterbacaan yang lebih baik */
}

.faq-right {
  flex: 1 1 55%;
}

.faq-item {
  margin-bottom: 1rem; /* Jarak antar item FAQ */
  border-radius: 10px; /* Sudut item FAQ */
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); /* Bayangan item lebih jelas */
  overflow: hidden; /* Memastikan konten tidak keluar dari border-radius */
  /* Default text color for header */
  color: #1d1d1d;
  padding: 15px;
}

/* Penyesuaian padding untuk jawaban FAQ */
.faq-answer {
  padding: 16px; /* Padding seragam di semua sisi untuk memberi ruang dari separator */
  line-height: 1.5; /* Keterbacaan yang lebih baik */
  color: #555; /* Warna teks jawaban sedikit lebih gelap */
}

/* Dark Mode Styles */
.faq-dark .faq-item {
  background: #232323;
  color: #eee;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
}

.faq-dark .faq-answer {
  color: #ccc;
}

/* Transisi untuk animasi buka/tutup */
.faq-fade-enter-active,
.faq-fade-leave-active {
  transition: all 0.3s ease-out; /* Transisi yang lebih halus */
}

.faq-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px); /* Bergerak sedikit ke atas saat muncul */
}

.faq-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.faq-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Bergerak sedikit ke atas saat menghilang */
}

</style>
