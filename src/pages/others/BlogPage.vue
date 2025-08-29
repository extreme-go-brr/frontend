<template>
  <q-page :class="['q-pa-lg', { 'bg-grey-1': !$q.dark.isActive }]">
    <!-- Filter Bar -->
    <div class="row items-center q-mb-md">
      <div class="col-auto q-mr-sm">
        <div class="text-subtitle1">Type</div>
        <q-select dense outlined v-model="selectedType" :options="typeOptions" class="filter-select" />
      </div>
      <div class="col-auto q-mr-sm">
        <div class="text-subtitle1">Difficulty</div>
        <q-select dense outlined v-model="selectedDifficulty" :options="difficultyOptions" class="filter-select" />
      </div>
      <q-space />
      <q-btn color="primary" label="Upload your project" flat rounded class="q-ml-auto" />
    </div>

    <!-- Tutorials Grid -->
    <div class="row q-col-gutter-md">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="(tutorial, index) in filteredTutorials"
        :key="index"
      >
        <q-card flat bordered class="tutorial-card">
          <div class="q-pa-sm">
            <q-skeleton height="140px" square class="q-mb-sm" />
            <div class="text-subtitle2 text-weight-bold q-mb-xs">
              {{ tutorial.title }}
            </div>
            <div class="text-caption text-grey-7 q-mb-sm">
              {{ tutorial.description }}
            </div>
            <div class="row items-center justify-between">
              <div class="text-caption text-blue-8">by {{ tutorial.author }}</div>
              <q-chip
                dense
                :color="difficultyColor(tutorial.difficulty ?? '')"
                text-color="white"
                class="q-ml-sm"
              >
                {{ tutorial.difficulty }}
              </q-chip>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Pagination -->
    <div class="row justify-center q-mt-lg">
      <q-pagination v-model="currentPage" :max="totalPages" max-pages="6" direction-links flat color="primary" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const tutorialsPerPage = 12;
const currentPage = ref(1);
const selectedType = ref('All');
const selectedDifficulty = ref('All');

const typeOptions = ['All', 'Guide', 'Project'];
const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

const allTutorials = ref(
  Array.from({ length: 48 }, () => ({
    title: 'How To Write Your First C++ Program On The Raspberry Pi Pico',
    description: 'Setup the C++ SDK and write your first program on the Raspberry Pi Pico W',
    author: 'Maker.id',
    difficulty: randomDifficulty(),
  }))
);

function randomDifficulty() {
  const options = ['Easy', 'Medium', 'Hard', 'Expert'];
  return options[Math.floor(Math.random() * options.length)];
}

const filteredTutorials = computed(() => {
  let result = allTutorials.value;

  if (selectedDifficulty.value !== 'All') {
    result = result.filter(t => t.difficulty === selectedDifficulty.value);
  }

  // Type filter can be applied when types are defined in data

  const start = (currentPage.value - 1) * tutorialsPerPage;
  return result.slice(start, start + tutorialsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(allTutorials.value.length / tutorialsPerPage);
});

function difficultyColor(level: string) {
  switch (level) {
    case 'Easy': return 'green';
    case 'Medium': return 'orange';
    case 'Hard': return 'red';
    case 'Expert': return 'purple';
    default: return 'grey';
  }
}
</script>

<style scoped>
.tutorial-card {
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.tutorial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}
.filter-select {
  min-width: 140px;
}
</style>
