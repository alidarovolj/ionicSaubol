<script setup>
import {onMounted, ref} from 'vue';
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {
  IonPage,
  IonContent,
  IonImg,
  IonRow,
  IonInput,
  IonCol,
  IonGrid,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSelect,
  IonSelectOption,
  IonText,
  toastController, IonListHeader
} from '@ionic/vue';
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
import {useJobsStore} from "@/stores/jobs.js";
import axios from "@/utils/axios";
import HeaderBlock from "@/components/HeaderBlock.vue";
import ProfileNavigation from "@/components/ProfileNavigation.vue";
import ProfileData from "@/components/ProfileData.vue";

const user = useUserStore()
const {result} = storeToRefs(user)
const jobs = useJobsStore()

const pending = ref(true)

const form = ref({
  specialization_id: null,
  phone_number: '',
  iin: '',
  email: ''
})

const v$ = useVuelidate({
  specialization_id: {required},
  phone_number: {required},
  iin: {required},
  email: {required}
}, form)

const sendForm = async () => {
  v$.value.$touch()
  if (v$.value.$error) return

  axios.put("/doctors/", form.value)
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
  await user.getProfile()
  await jobs.jobsList()
  form.value.iin = result.value.data.iin
  form.value.email = result.value.data.email
  form.value.phone_number = result.value.data.phone_number
  form.value.specialization_id = result.value.data.staff.specialization.id
  pending.value = false
})
</script>

<template>
  <ion-page>
    <HeaderBlock/>
    <ion-content
        color="light"
        v-if="result && !pending">
      <ProfileData :dataRes="result"/>
      <ProfileNavigation/>
      <ion-list-header class="text-xl ion-margin-top">
        Мои данные
      </ion-list-header>
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>
            Редактирование общих данных
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-col class="ion-no-padding ion-margin-bottom">
            <ion-select
                v-model="form.specialization_id"
                label="Профиль работы"
                label-placement="stacked">
              <ion-select-option :value="null">
                Выберите профиль работы
              </ion-select-option>
              <ion-select-option
                  v-for="(item, index) of jobs.result"
                  :key="index"
                  :value="item.id">
                {{ item.full_name }}
              </ion-select-option>
            </ion-select>
          </ion-col>

          <ion-col class="ion-no-padding ion-margin-bottom">
            <ion-input
                v-model="form.phone_number"
                label="Номер телефона"
                label-placement="stacked"
                type="number"
                placeholder="+7 (747) 777-77-77">
            </ion-input>
          </ion-col>

          <ion-col class="ion-no-padding ion-margin-bottom">
            <ion-input
                v-model="form.iin"
                label="ИИН"
                label-placement="stacked"
                type="number"
                required
                placeholder="123456789012">
            </ion-input>
          </ion-col>

          <ion-col class="ion-no-padding ion-margin-bottom">
            <ion-input
                v-model="form.email"
                label="Email"
                type="email"
                label-placement="stacked"
                placeholder="email@domain.com">
            </ion-input>
          </ion-col>

          <ion-col
              style="display:block;"
              class="ion-no-padding">
            <ion-col>
              <ion-text style="font-size: 12px">
                Места работы
              </ion-text>
            </ion-col>
            <ion-col>
              <ion-text
                  v-for="(item, index) of result.data.staff.job_places"
                  :key="index"
              >
                {{ item.job_place }}
              </ion-text>
            </ion-col>
          </ion-col>
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