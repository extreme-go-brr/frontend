<template>
  <q-page class="about-page">
    <!-- Hero Section -->
    <div :class="['hero-section', 'q-pa-xl', { 'hero-section--dark': $q.dark.isActive }]">
      <div class="container">
        <div class="row items-center justify-between">
          <div class="col-12 col-md-6 q-pr-lg-md">
            <h1 class="text-h3 text-weight-bold text-primary q-mb-md">About Maker.id</h1>
            <p class="text-subtitle1 text-body-color q-mb-lg">
              Empowering creators and innovators with cutting-edge technology solutions. We're
              building a community where ideas come to life.
            </p>
            <div class="row q-gutter-md">
              <q-btn
                color="primary"
                label="Explore Products"
                icon="shopping_cart"
                unelevated
                rounded
                class="q-px-xl"
                to="/products"
              />
              <q-btn
                outline
                color="primary"
                label="Contact Us"
                icon="mail"
                rounded
                class="q-px-xl"
                to="/contact"
              />
            </div>
          </div>
          <div class="col-12 col-md-6 q-mt-lg q-mt-md-none">
            <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              class="hero-image"
              :ratio="16 / 9"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div :class="['stats-section', 'q-pa-xl', { 'bg-dark-section': $q.dark.isActive }]">
      <div class="container">
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-sm-4 text-center">
            <q-icon name="shopping_cart" size="48px" color="primary" class="q-mb-sm" />
            <div class="text-h4 text-weight-bold text-primary q-mb-xs">1000+</div>
            <div class="text-subtitle1 text-body-color-light">Products Sold</div>
          </div>
          <div class="col-12 col-sm-4 text-center">
            <q-icon name="people" size="48px" color="primary" class="q-mb-sm" />
            <div class="text-h4 text-weight-bold text-primary q-mb-xs">5000+</div>
            <div class="text-subtitle1 text-body-color-light">Happy Customers</div>
          </div>
          <div class="col-12 col-sm-4 text-center">
            <q-icon name="verified" size="48px" color="primary" class="q-mb-sm" />
            <div class="text-h4 text-weight-bold text-primary q-mb-xs">100%</div>
            <div class="text-subtitle1 text-body-color-light">Quality Guaranteed</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission Section -->
    <div class="mission-section q-pa-xl">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6 q-mb-lg q-mb-md-none">
            <q-img
              src="https://cdn.quasar.dev/img/mountains.jpg"
              class="mission-image"
              :ratio="4 / 3"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="mission-content q-pa-md">
              <h2 class="text-h4 text-weight-bold text-primary q-mb-md">Our Mission</h2>
              <p class="text-subtitle1 text-body-color q-mb-lg">
                At Maker.id, we're dedicated to providing high-quality electronic components and
                development boards to makers, hobbyists, and professionals. Our goal is to make
                technology accessible to everyone and support innovation in the maker community.
              </p>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-card flat bordered :class="['mission-card', { 'card--dark': $q.dark.isActive }]">
                    <q-card-section>
                      <q-icon name="rocket_launch" size="32px" color="primary" class="q-mb-sm" />
                      <div class="text-h6 text-weight-bold q-mb-xs">Innovation</div>
                      <div class="text-caption text-body-color-light">
                        Pushing boundaries with cutting-edge technology
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6">
                  <q-card flat bordered :class="['mission-card', { 'card--dark': $q.dark.isActive }]">
                    <q-card-section>
                      <q-icon name="support_agent" size="32px" color="primary" class="q-mb-sm" />
                      <div class="text-h6 text-weight-bold q-mb-xs">Support</div>
                      <div class="text-caption text-body-color-light">
                        Dedicated customer service and technical support
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div :class="['team-section', 'q-pa-xl', { 'bg-dark-section': $q.dark.isActive }]">
      <div class="container">
        <h2 class="text-h4 text-weight-bold text-primary text-center q-mb-xl">Our Team</h2>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-sm-6 col-md-4" v-for="member in teamMembers" :key="member.name">
            <q-card flat bordered :class="['team-card', { 'card--dark': $q.dark.isActive }]">
              <q-img :src="member.image" :ratio="1" class="team-image" />
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-xs">{{ member.name }}</div>
                <div class="text-subtitle2 text-primary q-mb-sm">{{ member.role }}</div>
                <div class="text-caption text-body-color-light">{{ member.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const teamMembers = ref([
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    description:
      'Passionate about technology and innovation with over 10 years of experience in the industry.',
    image: 'https://cdn.quasar.dev/img/avatar.png',
  },
  {
    name: 'Jane Smith',
    role: 'Technical Lead',
    description:
      'Expert in embedded systems and hardware development with a focus on quality and reliability.',
    image: 'https://cdn.quasar.dev/img/avatar2.jpg',
  },
  {
    name: 'Mike Johnson',
    role: 'Customer Support',
    description: 'Dedicated to providing exceptional customer service and technical assistance.',
    image: 'https://cdn.quasar.dev/img/avatar3.jpg',
  },
]);

const $q = useQuasar();
</script>

<style lang="scss" scoped>
    .about-page {
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .hero-section {
        min-height: 80vh;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);

        &.hero-section--dark {
          background: linear-gradient(135deg, #1e2a3a 0%, #121828 100%);
        }

        .hero-image {
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-5px);
          }
        }
      }

      .stats-section {
        background-color: white;
        &.bg-dark-section {
          background-color: #1d1d1d;
        }

        .q-icon {
          transition: transform 0.3s ease;
        }

        .col:hover {
          .q-icon {
            transform: scale(1.1);
          }
        }
      }

      .mission-section {
        .mission-image {
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .mission-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mission-card {
          border-radius: 12px;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
          height: 100%;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
        }
      }

      .team-section {
        background-color: white;
        &.bg-dark-section {
          background-color: #1d1d1d;
        }

        .team-card {
          border-radius: 12px;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
          overflow: hidden;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .team-image {
            transition: transform 0.3s ease;
          }

          &:hover .team-image {
            transform: scale(1.05);
          }
        }
      }

      // Generic card dark mode style
      .card--dark {
        background-color: #2a2a2a;
        border-color: #444;
      }

      // Generic text color classes
      .text-body-color {
        color: $grey-8;
      }
      .text-body-color-light {
        color: $grey-7;
      }
      .body--dark .text-body-color,
      .body--dark .text-body-color-light {
        color: $grey-4;
      }
    }

    // Responsive adjustments
    @media (max-width: 1023px) {
      .about-page {
        .hero-section {
          min-height: auto;
          padding: 48px 24px;
        }

        .mission-section {
          .q-pl-lg-md {
            padding-left: 0;
          }
        }
      }
    }

    @media (max-width: 599px) {
      .about-page {
        .hero-section {
          padding: 32px 16px;
        }

        .text-h3 {
          font-size: 2rem;
        }

        .text-h4 {
          font-size: 1.5rem;
        }
      }
    }
</style>
