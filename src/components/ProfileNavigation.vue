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
    url: '/data'
  },
  {
    title: 'Мои профиль',
    url: '/profile'
  },
  {
    title: 'Документы',
    url: '/documents'
  }
])

const route = useRoute()
</script>

<template>
  <ion-grid
      style="padding-bottom: 0; margin-bottom: 0"
      class="ion-padding">
    <ion-row>
      <ion-button
          v-for="(item, index) of links"
          :key="index"
          :router-link="item.url"
          :fill="route.fullPath === item.url ? 'solid' : 'clear'"
          size="small"
      >
        {{ item.title }}
      </ion-button>
    </ion-row>
  </ion-grid>
</template>