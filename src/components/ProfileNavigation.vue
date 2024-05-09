<script setup lang="ts">
import {
  IonButton,
  IonGrid,
  IonRow
} from "@ionic/vue";
import {ref} from "vue";
import {useRoute} from "vue-router";

const links = ref([
  {
    title: 'Мои данные',
    url: '/my-profile/data'
  },
  {
    title: 'Мои профиль',
    url: '/my-profile/profile'
  },
  {
    title: 'Документы',
    url: '/my-profile/documents'
  }
])

const route = useRoute()
</script>

<template>
  <ion-grid class="ion-padding">
    <ion-row scrollX="true" class="scroll-items">
      <ion-button
          v-for="(item, index) of links"
          :key="index"
          :router-link="item.url"
          :fill="route.fullPath === item.url ? 'solid' : 'clear'"
      >
        {{ item.title }}
      </ion-button>
    </ion-row>
  </ion-grid>
</template>

<style scoped>

.scroll-items {
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow-x: scroll !important;
  overflow-y: hidden;
}

.scroll-items ion-button {
  white-space: nowrap;
}
</style>