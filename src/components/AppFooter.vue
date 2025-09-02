<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />
  <div
    v-if="$route.path !== '/second/login-akun' && $route.path !== '/second/create-akun'"
    class="custom-footer shadow-up-2"
  >
    <div class="footer-wrapper row q-col-gutter-sm q-pa-xl q-mx-auto q-mx-md q-mt-lg">
      <div class="col-12 col-md-1"></div>

      <div class="col-12 col-md-4">
        <div class="row items-center q-mb-md" style="margin-top: -20px;">
          <img :src="logoSrc" alt="maker.id" class="footer-logo" />
        </div>
        <div class="text-body2 text-grey-7 footer-description">
          Maker.id is an e-commerce website offering a variety of electronic components,
          support tools for students, and professionals working on electronics and
          technology projects. The platform is designed to help makers, engineers,
          and DIY enthusiasts easily find high-quality components with fast and reliable service.
        </div>
      </div>

      <div class="col-12 col-md-2">
        <div class="text-subtitle1 text-weight-bold">Maker.id</div>
        <span class="text-body2 text-grey-7 footer-hover" @click="$router.push('/about')">About Us</span><br />
        <span class="text-body2 text-grey-7 footer-hover" @click="$router.push('/documentation')">Documentation</span><br />
        <span class="text-body2 text-grey-7 footer-hover" @click="$router.push('/videos')">Video</span><br />
        <span class="text-body2 text-grey-7 footer-hover" @click="$router.push('/support')">Learn More</span>
      </div>

      <div class="col-12 col-md-3">
        <div class="text-subtitle1 text-weight-bold">Our Contacts</div>
        <div class="text-body2 row items-center footer-contact-item text-grey-7">
          <q-avatar size="28px" class="q-mr-xs">
            <q-icon name="email" size="18px" />
          </q-avatar>
          <a
            href="mailto:makerid25@gmail.com"
            class="footer-hover text-grey-7"
            target="_blank"
            rel="noopener"
          >makerid25@gmail.com</a>
        </div>

        <div class="text-body2 row items-center footer-contact-item text-grey-7">
          <q-avatar size="28px" class="q-mr-xs">
            <q-icon name="message" size="18px" />
          </q-avatar>
          <a
            href="https://wa.me/6285735146647"
            target="_blank"
            class="footer-hover text-grey-7"
            rel="noopener"
          >+62 857-3514-6647</a>
        </div>

        <div class="text-body2 row items-start footer-address-item text-grey-7">
          <q-avatar size="28px" class="q-mr-xs q-mt-xs">
            <q-icon name="place" size="18px" />
          </q-avatar>
          <div style="flex: 1">
            <a
              href="https://maps.app.goo.gl/v3PYgfVpMpEJDT4LA"
              target="_blank"
              rel="noopener"
              class="footer-hover text-grey-7"
            >
              Bumi Jabon Estate Housing Complex, Jl. Raya Gayaman No. G-17, Mojoanyar District, Mojokerto Regency, East Java 61364
            </a>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-2">
        <div class="text-subtitle1 text-weight-bold">Follow Us</div>

        <div class="row items-center q-mt-xs" style="gap: 8px;">
          <q-btn
            round
            flat
            icon="fa-brands fa-instagram"
            class="instagram-btn-hover"
            href="https://www.instagram.com/innodrive.ai/"
            target="_blank"
          />
          <span class="text-body2 text-grey-7">innodrive.ai</span>
        </div>

        <div class="row items-center q-mt-sm" style="gap: 8px;">
          <q-btn
            round
            flat
            icon="fa-brands fa-github"
            class="github-btn-hover"
            href="https://github.com/maker-id/lgt8f328p_nano"
            target="_blank"
          />
          <span class="text-body2 text-grey-7">GitHub</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const logoSrc = computed(() => {
  return $q.dark.isActive
    ? '/icons/Logo fix-dark.svg'
    : '/icons/Logo fix.svg';
});
</script>

<style scoped>
.footer-hover {
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none;
}
.footer-hover:hover {
  text-decoration: underline;
}
.custom-footer {
  background-color: var(--q-card-background);
  z-index: 10;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
}
body.body--dark .custom-footer {
  box-shadow: 0 -4px 10px rgba(255, 255, 255, 0.1);
}

.footer-wrapper {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
}
@media (max-width: 1023px) {
  .footer-wrapper {
    margin-left: 10px !important;
  }
}

.footer-logo {
  width: 170px;
  height: auto;
  margin-right: 16px;
}

.footer-contact-item,
.footer-address-item {
  gap: 8px;
}
.footer-address-item .q-avatar {
  margin-top: 4px;
}

.instagram-btn-hover,
.github-btn-hover {
  transition: all 0.3s ease-in-out;
}
.instagram-btn-hover >>> .q-icon,
.github-btn-hover >>> .q-icon {
  transition: color 0.3s ease;
}
.instagram-btn-hover:hover >>> .q-icon {
  color: white !important;
}
.instagram-btn-hover:hover {
  background: linear-gradient(
    45deg,
    #feda75,
    #fa7e1e,
    #d62976,
    #962fbf,
    #4f5bd5
  ) !important;
  box-shadow: 0 4px 8px rgba(204, 90, 90, 0.9);
}
.github-btn-hover:hover >>> .q-icon {
  color: #fff !important;
}
.github-btn-hover:hover {
  background: linear-gradient(135deg, #333 60%, #6e5494 100%) !important;
  box-shadow: 0 4px 8px rgba(51, 51, 51, 0.5);
}
</style>
