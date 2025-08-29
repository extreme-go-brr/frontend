<template>
  <q-page :class="['q-pa-xl', pageBgClass, 'responsive-shift']">
    <div class="row q-col-gutter-xl">
      <!-- Sidebar -->
      <div :class="['col-12 col-md-3', sidebarBgClass]">
        <div class="row items-center q-mb-md">
          <q-avatar size="40px">
            <img src="/public/helpicon/profile.png" />
          </q-avatar>
          <div class="q-ml-sm">
            <!-- Mengubah 'text-subtittle1' menjadi 'text-subtitle1' -->
            <div class="text-subtitle1 text-weight-bold">Personal account</div>
            <q-btn
              flat
              dense
              no-caps
              class="text-primary q-pa-none"
              @click="$router.push({ name: 'help-support' })"
            >
              see all topics
            </q-btn>
          </div>
        </div>
        <div class="topic-wrapper scroll">
          <div
            v-for="(topic, index) in topics"
            :key="index"
            @click="selectTopic(topic)"
            class="topic-item q-py-sm cursor-pointer"
            :class="[{ 'selected-topic': topic.tittle === activeTopicTitle }, topicItemClass]"
          >
            <!-- Menampilkan topic.tittle -->
            {{ topic.tittle }}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div :class="['col-12 col-md-9', contentBgClass]">
        <!-- Breadcrumb -->
        <div :class="['q-mb-sm text-caption', breadcrumbClass]">
          <span class="cursor-pointer" :class="breadcrumbLinkClass" @click="$router.push({ name: 'help-support' })">
            Helps & Support
          </span>
          &nbsp;&gt;
          <span class="cursor-pointer" :class="breadcrumbLinkClass" @click="selectedFaq = null">
            Personal account
          </span>
          <!-- Menggunakan activeTopicTitle -->
          <template v-if="activeTopicTitle">
            &nbsp;&gt;
            <span class="text-bold">{{ activeTopicTitle }}</span>
          </template>
        </div>

        <!-- FAQ List -->
        <div v-if="!selectedFaq">
          <h5 class="q-mb-md">Frequently asked</h5>
          <div v-for="(topic, ti) in topics" :key="ti">
            <div v-for="(faq, fi) in topic.questions" :key="fi">
              <div
                class="faq-item q-py-md cursor-pointer"
                :class="faqItemClass"
                @click="handleFaqClick(topic, faq)"
              >
                {{ faq }}
              </div>
              <q-separator />
            </div>
          </div>
        </div>

        <!-- FAQ Answer -->
        <div v-else>
          <h5 class="q-mb-md text-primary">{{ selectedFaq }}</h5>
          <!-- MENGGUNAKAN: computed property untuk menampilkan HTML yang sudah di-parse -->
          <div v-if="rawFaqMarkdown" v-html="parsedFaqAnswer" :class="['q-mb-lg text-body1', answerClass, 'markdown-content']" />
          <div v-else class="text-grey">Loading answer ...</div>
          <q-btn
            flat
            icon="arrow_back"
            label="Back to FAQ"
            class="q-mt-lg text-primary"
            @click="selectedFaq = null"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const baseUrl = import.meta.env.VITE_STRAPI_API_URL || 'http://192.168.0.245:1337'

type Topic = {
  tittle: string
  questions: string[]
}

const topics = ref<Topic[]>([
  { tittle: 'Creating An Account', questions: ['How do I create an account?'] },
  { tittle: 'Account & Data Protection', questions: ['Is my personal data safe on Maker.id?'] },
  { tittle: 'Update Profile Information', questions: ['How do I update my personal information?'] },
  { tittle: 'Resetting Your Password', questions: ['What should I do if I forget my password?'] },
  { tittle: 'Order History', questions: ['Where can I view my order history?'] },
  { tittle: 'Manage Saved Addresses', questions: ['How do I manage my saved addresses?'] }
])

const selectedTopic = ref<Topic | null>(null)
const selectedFaq = ref<string | null>(null)

// MENGUBAH: Menggunakan ref untuk menyimpan teks Markdown mentah
const rawFaqMarkdown = ref<string>('')

// MENGUBAH: Menggunakan computed property untuk mem-parse Markdown
const parsedFaqAnswer = computed(() => {
  if (!rawFaqMarkdown.value) {
    return '';
  }
  return marked(rawFaqMarkdown.value);
});


const activeTopicTitle = computed(() => selectedTopic.value?.tittle ?? '')

const isDark = computed(() => $q.dark.isActive)
const pageBgClass = computed(() => isDark.value ? 'bg-dark' : 'bg-white')
const sidebarBgClass = computed(() => isDark.value ? 'bg-dark' : '')
const contentBgClass = computed(() => isDark.value ? 'bg-dark' : '')
const topicItemClass = computed(() => isDark.value ? 'topic-item-dark' : '')
const faqItemClass = computed(() => isDark.value ? 'faq-item-dark' : '')
const breadcrumbClass = computed(() => isDark.value ? 'text-grey-4' : 'text-grey')
const breadcrumbLinkClass = computed(() => isDark.value ? 'text-grey-4' : 'text-grey')
const answerClass = computed(() => isDark.value ? 'text-grey-2' : '')

async function fetchAnswer(topicTittle: string) {
  rawFaqMarkdown.value = ''; // Reset konten saat fetching dimulai
  try {
    const res = await axios.get(
      `${baseUrl}/api/supports?filters[tittle][$eq]=${encodeURIComponent(topicTittle)}`
    )
    const data = res.data?.data?.[0]

    if (data) {
      // MENGUBAH: Menyimpan teks Markdown mentah dari Strapi
      const markdown = data.subcontent || 'No answer available.';
      rawFaqMarkdown.value = markdown;
    } else {
      rawFaqMarkdown.value = 'The answer will be available soon.';
    }
  } catch (err) {
    console.error('Error loading FAQ:', err)
    rawFaqMarkdown.value = 'Failed to load answer.';
    $q.notify({ type: 'negative', message: 'Failed to load answer.' })
  }
}

function selectTopic(topic: Topic) {
  selectedTopic.value = topic
  selectedFaq.value = topic.questions[0] ?? topic.tittle
  void fetchAnswer(topic.tittle)
}

function handleFaqClick(topic: Topic, question: string) {
  selectedTopic.value = topic
  selectedFaq.value = question
  void fetchAnswer(topic.tittle)
}
</script>

<style scoped>
    .topic-wrapper {
      border-left: 3px solid #ccc;
      padding-left: 10px;
      max-height: 400px;
      overflow-y: auto;
    }
    .topic-item {
      font-size: 15px;
      color: #444;
      padding-left: 4px;
      transition: 0.2s;
    }
    .topic-item-dark {
      color: #bbb;
    }
    .topic-item:hover {
      color: var(--q-primary);
    }
    .selected-topic {
      color: var(--q-primary);
      font-weight: bold;
    }
    .text-caption {
      font-size: 13px;
    }
    .faq-item {
      font-size: 16px;
      color: #222;
    }
    .faq-item-dark {
      color: #eee;
    }
    .bg-dark {
      background: #181818 !important;
    }

    /* Shift 3px to left for mobile */
    @media (max-width: 600px) {
      .responsive-shift {
        margin-left: -20px;
      }
    }

    /* Styles for content rendered from Markdown */
    .markdown-content img {
      max-width: 100%; /* Ensures images don't overflow their container */
      height: auto; /* Maintains aspect ratio */
      display: block; /* Removes extra space below images */
      margin: 1rem 0; /* Adds some vertical spacing */
      border-radius: 8px; /* Rounded corners for images */
    }

    .markdown-content table {
      width: 100%; /* Makes tables fill their container */
      border-collapse: collapse; /* Collapses table borders */
      margin: 1rem 0; /* Adds some vertical spacing */
    }

    .markdown-content th,
    .markdown-content td {
      border: 1px solid #ddd; /* Adds borders to table cells */
      padding: 8px; /* Adds padding inside cells */
      text-align: left; /* Aligns text to the left */
    }

    .markdown-content th {
      background-color: #f2f2f2; /* Light background for table headers */
      color: #333;
    }

    .markdown-content pre {
      background-color: #2d2d2d; /* Dark background for code blocks */
      color: #f8f8f2; /* Light text color */
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto; /* Allows horizontal scrolling for long code lines */
      font-family: 'Fira Code', 'Cascadia Code', monospace; /* Monospace font for code */
      font-size: 0.9em;
    }

    .markdown-content code {
      background-color: #e0e0e0; /* Light background for inline code */
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.9em;
    }

    .markdown-content blockquote {
      border-left: 4px solid var(--q-primary); /* Left border for blockquotes */
      padding-left: 1rem;
      margin: 1rem 0;
      color: #666;
      font-style: italic;
    }

    /* Dark mode adjustments for markdown content */
    .bg-dark .markdown-content th {
      background-color: #333;
      color: #eee;
    }

    .bg-dark .markdown-content td {
      border-color: #555;
    }

    .bg-dark .markdown-content code {
      background-color: #444;
      color: #f8f8f2;
    }

    .bg-dark .markdown-content blockquote {
      color: #ccc;
    }
</style>
