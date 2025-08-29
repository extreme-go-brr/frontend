<template>
  <q-page class="" style="min-height: 80vh;">
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg">
        <q-icon name="movie" size="48px" color="primary" class="q-mr-md" />
        <div>
          <div class="text-h4 text-primary text-weight-bold">Video Maker.id</div>
          <div class="text-subtitle2 text-grey-7">A collection of videos from the company Maker.id</div>
        </div>
      </div>
      <q-separator spaced />
      <div v-if="videos.length === 0" class="flex flex-center q-my-xl">
        <div class="text-center">
          <q-icon name="hourglass_empty" size="64px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-grey-7">There is no video available at the moment</div>
        </div>
      </div>
      <div v-else class="row q-col-gutter-lg">
        <div v-for="video in videos" :key="video.id" class="col-xs-12 col-sm-6 col-md-4">
          <q-card class="q-hoverable">
            <q-img :src="video.thumbnail" :alt="video.title" ratio="16/9" />
            <q-card-section>
              <div class="text-h6 text-primary">{{ video.title }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">{{ video.description }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                icon="play_arrow"
                label="Watch Video"
                @click="playVideo(video.url)"
                rounded
                unelevated
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <q-btn
        color="primary"
        label="Back"
        icon="arrow_back"
        @click="goBack"
        unelevated
        rounded
        class="q-mt-xl"
      />
    </div>
    <q-dialog v-model="showPlayer" persistent>
      <q-card style="max-width: 800px; width: 100%;">
        <q-card-section>
          <div class="text-h6">{{ currentVideoTitle }}</div>
        </q-card-section>
        <q-card-section>
          <video
            v-if="currentVideoUrl"
            :src="currentVideoUrl"
            controls
            style="width: 100%; border-radius: 8px;"
          ></video>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function goBack() {
  router.back()
}

// Dummy data, ganti dengan API jika sudah tersedia
const videos = ref([
  {
    id: 1,
    title: 'Maker.id Company Profile',
    description: 'Company profile video of Maker.id.',
    thumbnail: '/public/carousel/Promo/1.png',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 2,
    title: 'New Innovations from Maker.id',
    description: 'Latest innovations and updates from Maker.id.',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
    url: 'https://www.w3schools.com/html/movie.mp4'
  }
])

const showPlayer = ref(false)
const currentVideoUrl = ref('')
const currentVideoTitle = ref('')

function playVideo(url: string) {
  currentVideoUrl.value = url
  const video = videos.value.find(v => v.url === url)
  currentVideoTitle.value = video ? video.title : ''
  showPlayer.value = true
}
</script>
