<script setup lang="ts">
import {IonHeader, IonImg, IonProgressBar, IonRow, IonToolbar} from "@ionic/vue";
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-row class="ion-justify-content-center ion-align-items-center ion-padding-vertical">
        <ion-img
            style="width: 30%"
            src="./assets/img/main-color-logo.png"
            alt="Logo"
        ></ion-img>
      </ion-row>
    </ion-toolbar>
    <ion-progress-bar type="indeterminate"></ion-progress-bar>
  </ion-header>
</template>
