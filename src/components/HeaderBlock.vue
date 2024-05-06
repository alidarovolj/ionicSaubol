<script setup>
import {
  IonHeader,
  IonImg,
  IonRow,
  IonText,
  IonGrid,
  IonToolbar
} from "@ionic/vue";
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
import {onMounted, nextTick} from "vue";

const user = useUserStore();
const {result} = storeToRefs(user)

onMounted(async () => {
  await nextTick()
  await user.getProfile();
});
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-row
          v-if="result"
          class="ion-justify-content-between ion-align-items-center ion-padding-vertical ion-padding-horizontal">
        <ion-grid>
          <ion-row
              style="gap: 10px"
              class="ion-align-items-center">
            <ion-img
                style="width: 15%"
                src="./assets/img/logo.png"
                alt="Logo"
            ></ion-img>
            <ion-text style="font-size: 20px; font-weight: 600">
              Saubol
            </ion-text>
          </ion-row>
        </ion-grid>
        <ion-text
            style="font-size: 14px"
            class="ion-text-center">
          {{ result.data.email }}
        </ion-text>
      </ion-row>
    </ion-toolbar>
    <!--    <ion-progress-bar type="indeterminate"></ion-progress-bar>-->
  </ion-header>
</template>
