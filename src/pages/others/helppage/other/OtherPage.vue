<template>
  <q-page >
    <div class="q-px-xl q-pt-xl row q-col-gutter-xl q-mb-xl">
      <!-- Sidebar -->
      <div class="col-12 col-md-3">
        <div class="row items-center q-mb-md">
          <q-avatar size="40px">
            <q-icon name="account_circle" size="md" />
          </q-avatar>
          <div class="q-ml-sm">
            <div class="text-subtitle1 text-weight-bold">Personal account</div>
            <q-btn flat dense no-caps class="text-primary q-pa-none">
              see all topics
            </q-btn>
          </div>
        </div>
        <div class="topic-wrapper">
          <div
            v-for="(topic, index) in topics"
            :key="index"
            @click="selectTopic(topic)"
            class="topic-item q-py-sm cursor-pointer"
            :class="{ 'selected-topic': topic.title === activeTopicTitle }"
          >
            {{ topic.title }}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-12 col-md-9">
        <div class="q-mb-sm text-caption text-grey">
          Helps & Support &gt;
          <span class="text-bold text-black">Personal account</span>
          <template v-if="activeTopicTitle">
            &nbsp;&gt;
            <span class="text-bold">{{ activeTopicTitle }}</span>
          </template>
         <!-- Removed selectedFaq breadcrumb as requested -->
        </div>

        <!-- FAQ List -->
        <!-- FAQ List -->
<div v-if="!selectedFaq">
  <h5 class="q-mb-md">Frequently asked</h5>
  <div v-for="(topic, ti) in topics" :key="ti">
    <div v-for="(faq, fi) in topic.questions" :key="fi">
      <div
        class="faq-item q-py-md cursor-pointer"
        @click="handleFaqClick(faq)"
      >
        {{ faq }}
      </div>
      <q-separator />
    </div>
  </div>
</div>


        <!-- FAQ Detail -->
        <div v-else-if="selectedFaq">
          <h5 class="q-mb-md">{{ selectedFaq }}</h5>

          <div v-if="selectedFaq === 'How do I create an account?'">
            <p>Creating an account on Maker.id is quick and easy:</p>
            <ol class="q-pl-md q-mt-md">
              <li class="q-mb-md">Click the <strong>"Sign Up"</strong> button at the top-right.</li>
              <li class="q-mb-md">Fill in your email, name, and password.</li>
              <li class="q-mb-md">Or sign up with your Google account.</li>
              <li class="q-mb-md">Click <strong>"Register"</strong>.</li>
              <li class="q-mb-md">Verify your account via confirmation email.</li>
            </ol>
            <p>Once registered, you can track orders, manage address, and access exclusive features.</p>
          </div>

          <div v-else>
            <p>This FAQ answer is not available yet. Please check back later.</p>
          </div>

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

type Topic = {
  title: string
  questions: string[]
}

const topics = ref<Topic[]>([
  {
    title: 'Creating an account',
    questions: ['How do I create an account?']
  },
  {
    title: 'Account & Data Protection',
    questions: ['Is my personal data safe on Maker.id?']
  },
  {
    title: 'Update Profile Information',
    questions: ['How do I update my personal information?']
  },
  {
    title: 'Resetting Your Password',
    questions: ['What should I do if I forget my password?']
  },
  {
    title: 'Order History',
    questions: [
      'Where can I view my order history?',
      'How do I manage my saved addresses?'
    ]
  }
])

const selectedTopic = ref<Topic | null>(topics.value[0] || null)
const selectedFaq = ref<string | null>(null)

// Dynamic computed title for highlighting
const activeTopicTitle = computed(() => {
  if (selectedFaq.value) {
    const topic = topics.value.find(t => t.questions.includes(selectedFaq.value!))
    return topic?.title ?? ''
  }
  return ''
})


// Saat klik FAQ
function handleFaqClick(faq: string) {
  const topic = topics.value.find(t => t.questions.includes(faq))
  if (topic) {
    selectedTopic.value = topic
  }
  selectedFaq.value = faq
}



// Saat klik topik dari sidebar
function selectTopic(topic: Topic) {
  selectedTopic.value = topic
  selectedFaq.value = topic.questions.length > 0 ? topic.questions[0] as string : null
}


</script>

<style scoped>
.topic-wrapper {
  border-left: 3px solid #ccc;
  padding-left: 10px;
}
.topic-item {
  font-size: 15px;
  color: #444;
  padding-left: 4px;
  transition: all 0.2s ease;
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
}
</style>
