<script setup>
import {
  IonCol,
  IonGrid,
  IonImg,
  IonRow,
  IonCard,
  IonCardContent,
  IonChip,
  IonText
} from "@ionic/vue";

const props = defineProps({
  dataRes: Object
})
</script>

<template>
  <ion-card
      color="light"
      class="ion-margin-bottom">
    <ion-card-content>
      <ion-grid v-if="props.dataRes">
        <ion-row class="ion-align-items-center">
          <ion-col size="4">
            <ion-img
                v-if="!props.dataRes.data.img"
                style="width: 100px; height: 100px; border-radius: 100%; object-fit: cover"
                src="./assets/img/services/female_doctor.png"
                alt="Logo">
            </ion-img>
            <ion-img
                v-else
                style="width: 100px; height: 100px; border-radius: 100%; object-fit: cover"
                :src="props.dataRes.data.img"
                alt="Logo">
            </ion-img>
          </ion-col>
          <ion-col
              size="8"
              class="flex-column">
            <ion-text class="ion-margin-bottom text-xl">
              {{ props.dataRes.data.name }}
            </ion-text>
            <ion-chip
                class="ion-no-margin"
                style="width: max-content">
              {{ props.dataRes.data.role.description }}
            </ion-chip>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>