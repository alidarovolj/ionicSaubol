<script setup>
import {IonCol, IonGrid, IonImg, IonRow, IonText} from "@ionic/vue";

const props = defineProps({
  dataRes: Object
})
</script>

<template>
  <ion-grid
      v-if="props.dataRes"
      class="ion-padding ion-margin-bottom">
    <ion-row class="ion-align-items-center">
      <ion-col size="4">
        <ion-img
            src="./assets/img/services/female_doctor.png"
            alt="Logo">
        </ion-img>
      </ion-col>
      <ion-col
          size="8"
          class="flex-column">
        <ion-text class="ion-margin-bottom">
          {{ props.dataRes.data.name }}
        </ion-text>
        <ion-text class="text-with-bg ion-padding">
          {{ props.dataRes.data.role.description }}
        </ion-text>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>