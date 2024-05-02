<template>
  <HeaderBlock/>

  <ion-content color="light">
    <ion-list-header class="text-xl">Appearance</ion-list-header>
    <ion-list :inset="true">
      <ion-item>
        <ion-toggle :checked="paletteToggle" @ionChange="toggleChange($event)" justify="space-between"
        >Dark Mode
        </ion-toggle
        >
      </ion-item>
    </ion-list>

    <ion-list :inset="true">
      <ion-item :button="true">Text Size</ion-item>
      <ion-item>
        <ion-toggle justify="space-between">Bold Text</ion-toggle>
      </ion-item>
    </ion-list>

    <ion-list-header class="text-xl">Brightness</ion-list-header>
    <ion-list :inset="true">
      <ion-item>
        <ion-range value="40">
          <ion-icon :icon="sunnyOutline" slot="start"></ion-icon>
          <ion-icon :icon="sunny" slot="end"></ion-icon>
        </ion-range>
      </ion-item>
      <ion-item>
        <ion-toggle justify="space-between" checked>True Tone</ion-toggle>
      </ion-item>
    </ion-list>

    <ion-list :inset="true">
      <ion-item :button="true">
        <ion-label>Night Shift</ion-label>
        <ion-text slot="end" color="medium">9:00 PM to 8:00 AM</ion-text>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRange,
  IonText,
  IonToggle,
} from '@ionic/vue';
import type {ToggleCustomEvent} from '@ionic/vue';
import {personCircle, personCircleOutline, sunnyOutline, sunny} from 'ionicons/icons';
import {defineComponent, ref} from 'vue';
import HeaderBlock from "@/components/HeaderBlock.vue";

export default defineComponent({
  components: {
    HeaderBlock,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRange,
    IonText,
    IonToggle,
  },
  setup() {
    const paletteToggle = ref(false);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const toggleDarkPalette = (shouldAdd: boolean) => {
      document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    };

    const initializeDarkPalette = (isDark: boolean) => {
      paletteToggle.value = isDark;
      toggleDarkPalette(isDark);
    };

    initializeDarkPalette(prefersDark.matches);

    prefersDark.addEventListener('change', (mediaQuery) => initializeDarkPalette(mediaQuery.matches));

    const toggleChange = (ev: ToggleCustomEvent) => {
      toggleDarkPalette(ev.detail.checked);
    };

    return {
      personCircle,
      personCircleOutline,
      sunnyOutline,
      sunny,
      initializeDarkPalette,
      toggleChange,
      toggleDarkPalette,
      paletteToggle,
    };
  },
});
</script>

<style>
/* (Optional) This is added to prevent the flashing that happens when toggling between palettes */
ion-item {
  --transition: none;
}
</style>