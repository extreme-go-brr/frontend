<template>
  <q-page class="learn-page">
    <!-- Hero Section -->
    <div class="hero-section q-pa-xl text-center">
      <div class="container">
        <q-icon name="school" size="64px" color="primary" class="q-mb-md hero-icon" />
        <h1 class="text-h3 text-weight-bold text-primary q-mb-md">Learn with Maker.id</h1>
        <p class="text-subtitle1 text-grey-8 q-mb-lg">
          Dive into the world of electronics and programming with our curated tutorials, guides, and
          project ideas.
        </p>
        <q-btn
          color="primary"
          label="Start Learning"
          icon-right="arrow_forward"
          unelevated
          rounded
          size="lg"
          class="q-px-xl"
          @click="goToAllTutorials"
        />
      </div>
    </div>

    <!-- Featured Tutorials Section -->
    <div class="featured-tutorials-section q-pa-xl" ref="tutorialsSection">
      <div class="container">
        <h2 class="text-h4 text-weight-bold text-primary text-center q-mb-xl">
          Most viewed documentation
        </h2>
        <!-- Gunakan VideoComponent untuk menampilkan card tutorial -->
        <VideoComponent :limit="3" />
      </div>
    </div>

    <!-- Categories Section -->
    <!-- <div class="categories-section q-pa-xl">
      <div class="container">
      <h2 class="text-h4 text-weight-bold text-primary text-center q-mb-xl">
        Explore by Category
      </h2>
      <div class="row q-col-gutter-md justify-center">
        <div
        class="col-6 col-sm-4 col-md-3"
        v-for="category in learningCategories"
        :key="category.name"
        >
        <q-card
          flat
          bordered
          class="category-card text-center"
          @click="filterByCategory(category.name)"
        >
          <q-card-section>
                <q-icon :name="category.icon" size="48px" color="primary" class="q-mb-md" />
                <div class="text-h6 text-weight-medium">{{ category.name }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div> -->
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VideoComponent from 'src/components/VideoComponent.vue'

const router = useRouter();
const tutorialsSection = ref<HTMLElement | null>(null);


function goToAllTutorials() {
  // Replace with actual navigation logic, e.g., router.push('/learn/all-tutorials')
  console.log('Navigate to all tutorials');
  void router.push({ name: 'AllTutorials' }); // Placeholder navigation
}



// const learningCategories = ref([
//   { name: 'Arduino', icon: 'memory' },
//   { name: 'Raspberry Pi', icon: 'developer_board' },
//   { name: 'ESP32/ESP8266', icon: 'wifi' },
//   { name: 'Programming', icon: 'code' },
//   { name: 'Robotics', icon: 'smart_toy' },
//   { name: 'IoT', icon: 'cloud_queue' },
// ]);


// function filterByCategory(categoryName: string) {
//   // Replace with actual filtering logic
//   console.log(`Filter by category: ${categoryName}`);
//   void router.push({ name: 'ComingSoon', query: { category: categoryName } }); // Placeholder navigation
// }
</script>

<style lang="scss" scoped>
.learn-page {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .hero-section {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--q-card-background);

    .hero-icon {
      animation: float 3s ease-in-out infinite;
    }
  }

  .tutorial-card {
    border-radius: 12px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;
    height: 100%; // Ensure cards in a row have same height
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 25px rgba($primary, 0.2);
    }
    .tutorial-image {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    q-card-section {
      flex-grow: 1;
    }
  }

  .category-card {
    border-radius: 12px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px) scale(1.03);
      box-shadow: 0 6px 20px rgba($primary, 0.15);
      .q-icon {
        color: $accent !important; // Example: change icon color on hover
      }
    }
    .q-icon {
      transition: color 0.3s ease;
    }
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

// Responsive adjustments
@media (max-width: 1023px) {
  .learn-page {
    .hero-section {
      background-color: var(--q-card-background);
      min-height: auto;
      padding: 48px 24px;
    }
  }
}

@media (max-width: 599px) {
  .learn-page {
    .hero-section {
      background-color: var(--q-card-background);
      padding: 32px 16px;
    }
    .text-h3 {
      font-size: 2rem;
    }
    .text-h4 {
      font-size: 1.75rem;
    }
  }
}

</style>
