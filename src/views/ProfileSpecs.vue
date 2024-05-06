<script setup>
import {nextTick, onMounted, ref} from 'vue';
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {
  IonPage,
  IonContent,
  IonRow,
  IonInput,
  IonCol,
  IonGrid,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonText,
  toastController,
  IonIcon,
  IonRefresherContent,
  IonRefresher
} from '@ionic/vue';
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
import axios from "@/utils/axios";
import HeaderBlock from "@/components/HeaderBlock.vue";
import ProfileNavigation from "@/components/ProfileNavigation.vue";
import {add} from "ionicons/icons";
import ProfileData from "@/components/ProfileData.vue";

const user = useUserStore()
const {result} = storeToRefs(user)

const pending = ref(true)

const form = ref({
  specialization_details: null,
})

const v$ = useVuelidate({
  specialization_details: {required},
}, form)

const handleRefresh = (event) => {
  setTimeout(async () => {
    pending.value = true
    await nextTick()
    await user.getProfile()
    form.value.specialization_details = result.value.data.staff.specialization_details
    pending.value = false
    await event.target.complete();
  }, 2000);
};

const sendForm = async () => {
  v$.value.$touch()
  if (v$.value.$error) return

  axios.put("/doctors/specialization-details", form.value)
      .then(async response => {
        console.log(response);

        if (response.status === 200) {
          await user.getProfile()
          setOpen(true, "Ваши данные успешно отредактированы");
        }
      })
      .catch(error => {
        console.log(error.message);
      });
}

const setOpen = async (state, text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: 'bottom',
  });

  await toast.present();
};

onMounted(async () => {
  await nextTick()
  await user.getProfile()
  form.value.specialization_details = result.value.data.staff.specialization_details
  pending.value = false
})
</script>

<template>
  <ion-page>
    <HeaderBlock/>
    <ion-content
        color="light"
        v-if="!pending">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ProfileData :dataRes="result"/>
      <ion-card>
        <ProfileNavigation/>
        <ion-card-header>
          <ion-card-title class="text-xl ion-margin-top">
            Мои данные
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-col
              v-for="(item, index) of form.specialization_details"
              :key="index"
              class="ion-no-padding ion-margin-bottom">
            <ion-input
                v-model="form.specialization_details[index]"
                label="Название"
                label-placement="stacked"
                placeholder="Введите название">
            </ion-input>
          </ion-col>
          <ion-grid @click="form.specialization_details.push('')">
            <ion-row style="color: #fe2c39">
              <ion-icon
                  size="small"
                  :icon="add"
                  style="margin-right: 10px"
              />
              <ion-text>
                Добавить новое поле
              </ion-text>
            </ion-row>
          </ion-grid>
          <ion-button
              @click="sendForm"
              class="ion-margin-top"
              expand="block">
            Сохранить
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>