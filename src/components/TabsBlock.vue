<script setup lang="ts">
import {calendar, clipboard, person, settings} from "ionicons/icons";
import {IonIcon, IonRouterOutlet, IonPage, IonLabel, IonTabBar, IonTabButton, IonTabs} from "@ionic/vue";

import {useRoute} from "vue-router";

const route = useRoute();
</script>

<template>
  <ion-page>
    <ion-tabs
        v-if="route.fullPath !== '/'">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button
            tab="home"
            href="/orders">
          <ion-icon
              style="margin-bottom: 5px"
              :icon="clipboard"
          />
          <ion-label>
            Заказы
          </ion-label>
        </ion-tab-button>

        <ion-tab-button
            tab="radio"
            href="/my-profile/data">
          <ion-icon
              style="margin-bottom: 5px"
              :icon="person"
          />
          <ion-label>
            Профиль
          </ion-label>
        </ion-tab-button>

        <!--        <ion-tab-button tab="image" href="/">-->
        <!--          <ion-img-->
        <!--              src="./assets/img/logo.png"-->
        <!--              style="margin-bottom: 5px; height: 28px"-->
        <!--          />-->
        <!--        </ion-tab-button>-->

        <ion-tab-button
            tab="schedule"
            href="/schedule">
          <ion-icon
              style="margin-bottom: 5px"
              :icon="calendar"
          />
          <ion-label>
            График работы
          </ion-label>
        </ion-tab-button>

        <!-- <ion-tab-button
            tab="library"
            href="/settings">
          <ion-icon
              size="small"
              style="margin-bottom: 5px"
              :icon="settings"
          />
          <ion-label>
            Настройки
          </ion-label>
        </ion-tab-button> -->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>