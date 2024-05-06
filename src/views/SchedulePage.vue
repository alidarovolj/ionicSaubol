<script setup>
import {useUserStore} from "@/stores/user.js";
import {ref, nextTick, onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/stores/staff.js";
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonSelect,
  IonSelectOption,
  toastController,
  IonItem,
  IonGrid,
  IonCardContent,
  IonList,
  IonListHeader,
  IonSpinner, IonRefresherContent, IonRefresher
} from '@ionic/vue';
import HeaderBlock from "@/components/HeaderBlock.vue";

const pending = ref(false);
const loading = ref(false);

const user = useUserStore()
const {result} = storeToRefs(user)

const staff = useStaffStore()

const times = ref([])

const days = ref([
  {
    title: "Понедельник",
    value: 1
  },
  {
    title: "Вторник",
    value: 2
  },
  {
    title: "Среда",
    value: 3
  },
  {
    title: "Четверг",
    value: 4
  },
  {
    title: "Пятница",
    value: 5
  },
  {
    title: "Суббота",
    value: 6
  },
  {
    title: "Воскресенье",
    value: 7
  }
])

function generateTimes(duration) {
  const times = [];
  let hours = 0;
  let minutes = 0;

  while (hours < 24) {
    const start = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    minutes += duration;
    if (minutes >= 60) {
      hours += 1;
      minutes = 0;
    }
    const end = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    times.push({start, end});
  }

  return times;
}

const periods = ref([]);

const addDay = (val) => {
  if (isWeekdayNumberIncluded(val.value)) {
    form.value.schedule.days = form.value.schedule.days.filter(day => day.weekday_number !== val.value);
  } else {
    form.value.schedule.days.push({
      weekday_number: val.value,
      times: []
    });
  }
};

const isWeekdayNumberIncluded = (val) => {
  return form.value.schedule.days.some(day => day.weekday_number === val);
};

onMounted(async () => {
  await nextTick()
  await user.getProfile()
  form.value.schedule.duration = result.value.data.staff.schedule[0].duration
  periods.value = generateTimes(form.value.schedule.duration)
  pending.value = false

  result.value.data.staff.schedule.forEach(schedule => {
    const day = days.value.find(day => day.value === schedule.weekday_number);
    if (day) {
      addDay(day);
    }
  });

  times.value = result.value.data.staff.schedule[0].times
})

const form = ref({
  schedule: {
    duration: 15,
    days: [],
    times: [],
  },
});

const setDuration = () => {
  times.value = [];
  periods.value = [];
  periods.value = [...generateTimes(form.value.schedule.duration)];
  form.value.schedule.days = []
};

const setOpen = async (state, text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: 'bottom',
  });

  await toast.present();
};

const sendForm = async () => {
  loading.value = true
  form.value.schedule.days = form.value.schedule.days.map(day => {
    return {
      ...day,
      times: times.value.filter(time => time.start && time.end)
    }
  });
  await staff.updateSchedule(result.value.data.staff.id, form.value)
  if (staff.resultUpdatedSchedule.value !== false) {
    await user.getProfile()
    loading.value = false
    setOpen(true, "График успешно обновлен");
  } else {
    loading.value = false
    setOpen(true, "Произошла ошибка");
  }
}

const checkTime = (item) => {
  if (times.value.some(time => time.start === item.start && time.end === item.end)) {
    times.value = times.value.filter(time => time.start !== item.start || time.end !== item.end);
  } else {
    times.value.push(item);
  }
};

const handleRefresh = (event) => {
  setTimeout(async () => {
    await nextTick()
    await user.getProfile()
    form.value.schedule.duration = result.value.data.staff.schedule[0].duration
    periods.value = generateTimes(form.value.schedule.duration)
    pending.value = false

    result.value.data.staff.schedule.forEach(schedule => {
      const day = days.value.find(day => day.value === schedule.weekday_number);
      if (day) {
        addDay(day);
      }
    });

    times.value = result.value.data.staff.schedule[0].times
  }, 2000);
};

// watch(() => form.value.schedule.duration, () => {
//   times.value = [];
//   periods.value = [];
//   periods.value = [...generateTimes(form.value.schedule.duration)];
//   form.value.schedule.days = []
// }, {deep: true});
</script>

<template>
  <ion-page>
    <HeaderBlock/>
    <ion-content color="light">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list-header class="text-xl ion-margin-top">
        График работы
      </ion-list-header>
      <ion-card v-if="!pending">
        <ion-card-content>
          <ion-item class="text-sm">
            <ion-select
                label="Продолжительность"
                v-model="form.schedule.duration"
                @ionChange="setDuration">
              <ion-select-option :value="15">15 мин</ion-select-option>
              <ion-select-option :value="30">30 мин</ion-select-option>
              <ion-select-option :value="45">45 мин</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>
      <ion-list-header class="text-xl">
        Дни приема
      </ion-list-header>
      <ion-card>
        <ion-card-content>
          <ion-list class=" no-border">
            <ion-item
                v-for="(day, index) of days"
                :key="index"
                class="text-sm"
                :class="[{ 'rounded-t' : index === 0 }, { 'rounded-b' : index === days.length - 1 }]"
                @click="addDay(day)"
                :color="form.schedule.days.some(scheduleDay => scheduleDay.weekday_number === day.value) ? 'primary' : ''">
              {{ day.title }}
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <ion-list-header class="text-xl">
        Время приема
      </ion-list-header>
      <ion-card>
        <ion-card-content>
          <ion-list class="text-sm">
            <ion-item
                v-for="(item, index) of periods"
                :key="index"
                class="text-sm"
                @click="checkTime(item)"
                :color="times.some(time => time.start === item.start && time.end === item.end) ? 'primary' : ''">
              {{ item.start }} - {{ item.end }}
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <ion-grid class="ion-padding">
        <ion-button
            v-if="!loading"
            @click="sendForm"
            expand="full"
            color="primary">
          Сохранить
        </ion-button>
        <ion-button
            v-else
            expand="full"
            color="primary">
          <ion-spinner name="dots"></ion-spinner>
        </ion-button>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.rounded-t {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.rounded-b {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.no-border .ion-native {
  border: none !important;
  border-color: transparent !important;
}
</style>