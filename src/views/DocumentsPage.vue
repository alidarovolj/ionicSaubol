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
  IonSpinner,
  IonText,
  IonCol,
  IonCardTitle,
  IonCardHeader, IonImg, toastController
} from '@ionic/vue';
import {onMounted, nextTick, ref} from "vue";
import {storeToRefs} from "pinia";
import {download, trash, attach, add} from "ionicons/icons";
import {useStaffStore} from "@/stores/staff";

const user = useUserStore()
const {result} = storeToRefs(user)

const currentType = ref(null)

const staff = useStaffStore()

const importDoc = useStaffStore()

const fileInput = ref(null);

const form = ref({
  type: "diploma", // or "diploma",
  documents: []
})

const formCert = ref({
  type: "certificate", // or "diploma",
  documents: []
})

const modal = ref();
const input = ref();

const message = ref('This modal example uses triggers to automatically open a modal when the button is clicked.');

const cancel = () => modal.value.$el.dismiss(null, 'cancel');

const confirm = () => {
  const name = input.value.$el.value;
  modal.value.$el.dismiss(name, 'confirm');
};

const setOpen = async (state, text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: 'bottom',
  });

  await toast.present();
};

const onFileChange = async (e) => {
  await importDoc.importDoc(e.target.files[0])
  await nextTick()
  form.value.documents.push(importDoc.resultDoc.filename)
}

const onFileChangeCert = async (e) => {
  await importDoc.importDoc(e.target.files[0])
  await nextTick()
  formCert.value.documents.push(importDoc.resultDoc.filename)
}

const sendForm = async (type) => {
  await nextTick()
  if(type === 'diplomas') {
    await staff.uploadFiles(form.value)
  } else {
    await staff.uploadFiles(formCert.value)
  }
  await user.getProfile()
  cancel()
  setOpen(true, "Документ успешно загружен");
}

onMounted(async () => {
  await nextTick()
  await user.getProfile()
})
</script>

<template>
  <ion-page>
    <ion-content
        scroll-y="false"
        ref="content"
        fullscreen>
      <ion-col v-if="result">
        <ion-card color="light">
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
                  color="light"
                  class="ion-align-items-center ion-no-padding">
                <ion-icon
                    color="light"
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
                  @click="currentType = 'diplomas'"
                  id="open-modal"
                  class="ion-no-margin"
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
                  color="light"
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
                  @click="currentType = 'cert'"
                  id="open-modal"
                  class="ion-no-margin"
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
            trigger="open-modal">
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
          <ion-content class="ion-no-padding ion-margin-top">
            <ion-text class="ion-padding flex-column text-xl ion-margin-top">
              Загрука диплома
            </ion-text>
            <ion-list>
              <ion-item>
                <input
                    @change="onFileChange"
                    ref="fileInput"
                    type="file"
                />
              </ion-item>
            </ion-list>
            <ion-grid class="ion-padding">
              <ion-row v-if="currentType === 'diplomas'">
                <ion-img
                    v-for="(item, index) of form.documents"
                    :key="index"
                    style="width: 100px; height: 100px; border-radius: 100%; object-fit: cover"
                    :src="item"
                ></ion-img>
              </ion-row>
              <ion-row v-if="currentType === 'cert'">
                <ion-img
                    v-for="(item, index) of form.documents"
                    :key="index"
                    style="width: 100px; height: 100px; border-radius: 100%; object-fit: cover"
                    :src="item"
                ></ion-img>
              </ion-row>
            </ion-grid>

            <ion-button
                @click="sendForm('diplomas')"
                class="ion-margin-top ion-no-margin ion-padding"
                expand="block">
              Сохранить
            </ion-button>
          </ion-content>
        </ion-modal>
      </ion-col>
      <ion-spinner v-else></ion-spinner>
    </ion-content>
  </ion-page>
</template>