<template>
  <q-page class="career-page bg-grey-1">
    <!-- Hero Section -->
    <div class="hero-section q-pa-xl text-center">
      <div class="container">
        <q-icon name="work_outline" size="64px" color="primary" class="q-mb-md hero-icon" />
        <h1 class="text-h3 text-weight-bold text-primary q-mb-md">Join Our Team at Maker.id</h1>
        <p class="text-subtitle1 text-grey-8 q-mb-lg">
          Explore exciting career opportunities and help us build the future of making. We're
          looking for passionate individuals to grow with us.
        </p>
        <q-btn
          color="primary"
          label="View Open Positions"
          icon-right="arrow_downward"
          unelevated
          rounded
          size="lg"
          class="q-px-xl"
          @click="scrollToOpenings"
        />
      </div>
    </div>

    <!-- Open Positions Section -->
    <div class="open-positions-section q-pa-xl bg-white" ref="openingsSection">
      <div class="container">
        <h2 class="text-h4 text-weight-bold text-primary text-center q-mb-xl">Current Openings</h2>
        <div v-if="jobOpenings.length > 0" class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-sm-6 col-md-4" v-for="job in jobOpenings" :key="job.id">
            <q-card flat bordered class="job-card" @click="navigateToJob(job.id)">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-xs">{{ job.title }}</div>
                <div class="text-caption text-grey-7 q-mb-sm">
                  <q-icon name="location_on" class="q-mr-xs" /> {{ job.location }}
                  <span class="q-mx-xs">|</span>
                  <q-icon name="work_history" class="q-mr-xs" /> {{ job.type }}
                </div>
                <div class="text-caption text-primary text-weight-medium q-mb-sm">
                  {{ job.department }}
                </div>
                <div class="text-body2 text-grey-8 ellipsis-3-lines">{{ job.shortDesc }}</div>
              </q-card-section>
              <q-card-actions align="right" class="q-pa-md">
                <q-btn flat dense color="primary" label="View Details" icon-right="launch" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <div v-else class="text-center text-subtitle1 text-grey-7">
          <q-icon name="info" size="24px" color="grey-7" class="q-mr-sm" />
          There are currently no open positions. Please check back later!
        </div>
      </div>
    </div>

    <!-- Maker.id Career Invitation Section -->
    <section class="career-invite-section q-mt-xl q-mb-xl">
      <q-card class="career-invite-card">
        <q-card-section>
          <div class="text-h5 text-weight-bold text-primary q-mb-sm">
            Bergabunglah dengan Tim Maker.id dan Bangun Karier di Industri Teknologi! 🚀✨
          </div>
          <div class="text-body1 text-grey-8 q-mb-md">
            Maker.id adalah platform teknologi yang terus berkembang dan berkomitmen menghadirkan
            solusi inovatif untuk para maker, pelajar, dan profesional di bidang elektronik dan
            teknologi. Kami percaya bahwa tim yang solid, kreatif, dan penuh semangat adalah kunci
            kesuksesan. Jika kamu ingin berkembang di dunia teknologi, inilah kesempatan emas untuk
            bergabung bersama kami!
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">
              Kami membuka peluang untuk posisi berikut:
            </div>
            <ul class="career-list">
              <li>
                <span class="career-role">🔹 Content Creator</span>
                <span class="career-desc"
                  >Buat konten edukatif dan inspiratif seputar elektronik, pemrograman, dan DIY.
                  Cocok untuk kamu yang suka berbagi ilmu, editing video, dan punya ide
                  kreatif!</span
                >
              </li>
              <li>
                <span class="career-role">🔹 Community Host / Live Streamer</span>
                <span class="career-desc"
                  >Bangun komunitas, interaksi dengan audiens, dan edukasi lewat live streaming.
                  Cocok untuk kamu yang komunikatif, percaya diri, dan paham tren digital.</span
                >
              </li>
              <li>
                <span class="career-role">🔹 Product Specialist</span>
                <span class="career-desc"
                  >Kelola katalog produk, bantu pengguna memahami fitur produk, dan berikan solusi
                  terbaik. Cocok untuk kamu yang detail, suka belajar hal baru, dan paham dunia
                  elektronik.</span
                >
              </li>
              <li>
                <span class="career-role">🔹 Developer / Programmer</span>
                <span class="career-desc"
                  >Kembangkan fitur baru, integrasi API, dan tingkatkan pengalaman pengguna di
                  platform Maker.id. Cocok untuk kamu yang passionate di coding dan ingin membangun
                  produk berdampak.</span
                >
              </li>
            </ul>
          </div>
          <div class="q-mb-md">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">
              🌟 Kenapa Bergabung dengan Maker.id?
            </div>
            <ul class="benefit-list">
              <li>✅ Lingkungan kerja dinamis, kolaboratif, dan penuh kreativitas</li>
              <li>✅ Kesempatan berkembang di industri teknologi yang kompetitif</li>
              <li>✅ Ruang untuk menyalurkan ide-ide inovatif dan kreatif</li>
              <li>✅ Tim yang suportif dan saling mendukung</li>
            </ul>
          </div>
          <div class="q-mb-md text-center">
            <q-btn
              color="primary"
              class="q-px-xl q-py-sm"
              style="border-radius: 8px; font-size: 1.1rem"
              target="_blank"
              href="https://wa.me/6285735146647"
              icon="send"
              label="Daftar Sekarang via WhatsApp"
            />
          </div>
          <div class="text-center text-grey-7 q-mt-sm">
            Jangan lewatkan kesempatan ini! Jadilah bagian dari perjalanan sukses Maker.id dan
            kembangkan kariermu di dunia teknologi bersama kami!
          </div>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const openingsSection = ref<HTMLElement | null>(null);

interface JobOpening {
  id: number;
  title: string;
  location: string;
  type: string; // e.g., Full-time, Part-time
  department: string;
  shortDesc: string;
}

const jobOpenings = ref<JobOpening[]>([
  {
    id: 1,
    title: 'Frontend Developer (Vue.js)',
    location: 'Remote',
    type: 'Full-time',
    department: 'Engineering',
    shortDesc:
      'Join our dynamic team to build and enhance user-facing features for Maker.id using Vue.js and Quasar Framework. Strong understanding of modern JavaScript, HTML, and CSS is required.',
  },
  {
    id: 2,
    title: 'Backend Developer (Node.js/Strapi)',
    location: 'Work from Office',
    type: 'Full-time',
    department: 'Engineering',
    shortDesc:
      'We are looking for a skilled Backend Developer to manage our Strapi CMS, develop custom APIs, and ensure the scalability and performance of our platform.',
  },
  {
    id: 3,
    title: 'Digital Marketing Specialist',
    location: 'Remote',
    type: 'Part-time',
    department: 'Marketing',
    shortDesc:
      'Drive our online presence! Develop and implement digital marketing strategies, manage SEO/SEM, and create engaging content for our community.',
  },
  {
    id: 4,
    title: 'Customer Support Engineer',
    location: 'Work from Office',
    type: 'Full-time',
    department: 'Operations',
    shortDesc:
      'Provide top-notch technical support to our users, troubleshoot issues, and contribute to our knowledge base. Excellent communication skills are a must.',
  },
  {
    id: 5,
    title: 'IOT Product Designer',
    location: 'Work from Office',
    type: 'Internship',
    department: 'Product Design',
    shortDesc:
      'Assist in designing innovative IOT products, create prototypes, and collaborate with the engineering team to bring ideas to life. Ideal for students or recent graduates in design or engineering.',
  },
]);

function scrollToOpenings() {
  openingsSection.value?.scrollIntoView({ behavior: 'smooth' });
}

function navigateToJob(jobId: number) {
  // Replace with actual navigation logic, e.g., router.push(`/careers/job/${jobId}`)
  console.log(`Navigate to job details for ${jobId}`);
  void router.push({ name: 'ComingSoon', query: { job: jobId } }); // Placeholder navigation
}
</script>

<style lang="scss" scoped>
.career-page {
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
    background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($primary, 0.15) 100%);

    .hero-icon {
      animation: float 3s ease-in-out infinite;
    }
  }

  .job-card {
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
    q-card-section {
      flex-grow: 1;
    }
    .ellipsis-3-lines {
      display: -webkit-box;
      // -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.5em; /* Adjust based on font size */
      max-height: 4.5em; /* line-height * number of lines */
    }
  }

  .career-invite-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
  }

  .career-invite-card {
    max-width: 800px;
    width: 100%;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(8, 47, 109, 0.08);
    background: #f8fafc;
    margin: 0 auto;
  }

  .career-list,
  .benefit-list {
    padding-left: 1.2em;
    margin-bottom: 0.5em;
  }

  .career-list li,
  .benefit-list li {
    margin-bottom: 0.5em;
    font-size: 1rem;
    line-height: 1.5;
  }

  .career-role {
    font-weight: 600;
    color: #1976d2;
    margin-right: 0.5em;
  }

  .career-desc {
    color: #444;
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
  .career-page {
    .hero-section {
      min-height: auto;
      padding: 48px 24px;
    }
  }
}

@media (max-width: 599px) {
  .career-page {
    .hero-section {
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
