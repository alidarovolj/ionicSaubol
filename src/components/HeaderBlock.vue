<script setup>
import {
  IonHeader,
  IonImg,
  // IonProgressBar,
  IonRow,
  IonToolbar
} from "@ionic/vue";
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
import {onMounted, nextTick} from "vue";

const user = useUserStore();
const { result } = storeToRefs(user)

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
        <ion-img
            style="width: 30%"
            src="./assets/img/main-color-logo.png"
            alt="Logo"
        ></ion-img>
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
