<script lang="ts" setup>
import {useUserStore} from "@/stores/user.js";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonInput, IonCardHeader, IonRefresherContent, IonRefresher
} from '@ionic/vue';
import {onMounted, nextTick, ref} from "vue";
import {storeToRefs} from "pinia";
import {download, trash, attach, add} from "ionicons/icons";
import ProfileNavigation from "@/components/ProfileNavigation.vue";
import HeaderBlock from "@/components/HeaderBlock.vue";
import ProfileData from "@/components/ProfileData.vue";

const user = useUserStore()
const {result} = storeToRefs(user)

const modal = ref();
const input = ref();

const message = ref('This modal example uses triggers to automatically open a modal when the button is clicked.');

const cancel = () => modal.value.$el.dismiss(null, 'cancel');

const confirm = () => {
  const name = input.value.$el.value;
  modal.value.$el.dismiss(name, 'confirm');
};

const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
  if (ev.detail.role === 'confirm') {
    message.value = `Hello, ${ev.detail.data}!`;
  }
};

const handleRefresh = (event: CustomEvent) => {
  setTimeout(async () => {
    await nextTick()
    await user.getProfile()
  }, 2000);
};

onMounted(async () => {
  await nextTick()
  await user.getProfile()
})
</script>

<template>
  <ion-page>
    <HeaderBlock/>
    <ion-content
        color="light"
        v-if="result">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ProfileData :data-res="result"/>
      <ion-card>
        <ProfileNavigation/>
        <ion-card-header>
          <ion-card-title class="text-xl ion-margin-top">
            Дипломы
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item
                v-for="(item, index) of result.diploma"
                :key="index"
                class="ion-align-items-center ion-no-padding">
              <ion-icon
                  style="margin-bottom: 5px"
                  :icon="attach"
              />
              <ion-label>
                {{ item.filename }}
              </ion-label>
              <ion-button
                  slot="end"
                  fill="clear"
                  :href="item.path"
                  target="_blank">
                <ion-icon
                    style="margin-bottom: 5px"
                    :icon="download"
                />
              </ion-button>
              <ion-button
                  slot="end"
                  fill="clear"
                  color="danger">
                <ion-icon
                    style="margin-bottom: 5px"
                    :icon="trash"
                />
              </ion-button>
            </ion-item>
            <ion-button
                id="open-modal"
                expand="block">
              <ion-icon
                  slot="start"
                  :icon="add"
              />
              <ion-label>
                Добавить диплом
              </ion-label>
            </ion-button>
          </ion-list>
        </ion-card-content>

        <ion-card-header>
          <ion-card-title class="text-xl ion-margin-top">
            Сертификаты
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item
                v-for="(item, index) of result.certificates"
                :key="index"
                class="ion-align-items-center ion-no-padding">
              <ion-icon
                  style="margin-bottom: 5px"
                  :icon="attach"
              />
              <ion-label>
                {{ item.filename }}
              </ion-label>
              <ion-button
                  slot="end"
                  fill="clear"
                  :href="item.path"
                  target="_blank">
                <ion-icon
                    style="margin-bottom: 5px"
                    :icon="download"
                />
              </ion-button>
              <ion-button
                  slot="end"
                  fill="clear"
                  color="danger">
                <ion-icon
                    style="margin-bottom: 5px"
                    :icon="trash"
                />
              </ion-button>
            </ion-item>
            <ion-button
                id="open-modal"
                expand="block">
              <ion-icon
                  slot="start"
                  :icon="add"
              />
              <ion-label>Добавить сертификат</ion-label>
            </ion-button>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <ion-modal
          ref="modal"
          trigger="open-modal"
          @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">
                Отменить
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button
                  :strong="true"
                  @click="confirm()">
                Сохранить
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-input
                label="Enter your name"
                label-placement="stacked"
                ref="input"
                type="text"
                placeholder="Your name"
            ></ion-input>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>