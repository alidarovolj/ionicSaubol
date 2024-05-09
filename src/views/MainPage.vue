<script setup>
import {onMounted, ref, nextTick} from 'vue';
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {
  IonPage,
  IonContent,
  IonCol,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonRouterOutlet
} from '@ionic/vue';
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
import {useJobsStore} from "@/stores/jobs.js";
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

const handleRefresh = (event) => {
  setTimeout(async () => {
    pending.value = true
    await nextTick()
    await user.getProfile()
    await jobs.jobsList()
    form.value.iin = result.value.data.iin
    form.value.email = result.value.data.email
    form.value.phone_number = result.value.data.phone_number
    form.value.specialization_id = result.value.data.staff.specialization.id
    pending.value = false
    await event.target.complete();
  }, 2000);
};

onMounted(async () => {
  await nextTick()
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
    <ion-content ref="content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-col
          v-if="result"
          class="ion-no-padding ion-no-margin"
      >
        <ProfileData :dataRes="result"/>
        <ion-card
            color="light"
            style="margin-bottom: 0">
          <ProfileNavigation/>
        </ion-card>
        <ion-card
            color="light"
            class="ion-no-padding ion-no-margin"
            style="height: 100%">
          <ion-router-outlet></ion-router-outlet>
        </ion-card>
      </ion-col>
      <ion-spinner v-else></ion-spinner>
    </ion-content>
  </ion-page>
</template>