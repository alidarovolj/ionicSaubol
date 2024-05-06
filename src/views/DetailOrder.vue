<script setup>
import {nextTick, onMounted} from 'vue';
import {
  IonPage,
  IonContent,
  IonRow,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonBackButton,
  IonCardContent,
  IonCol,
  IonButton,
  IonText,
  IonChip,
  IonHeader,
  IonToolbar,
  IonTitle,
  toastController, IonRefresherContent, IonRefresher
} from '@ionic/vue';
import {useOrdersStore} from "@/stores/orders.js";
import {useRoute} from "vue-router";

const orders = useOrdersStore()
const route = useRoute()

const setOpen = async (state, text) => {
  const toast = await toastController.create({
    message: text,
    duration: 1500,
    position: 'bottom',
  });

  await toast.present();
};

const acceptOrderLocal = async () => {
  await orders.acceptOrder(orders.resultDetails.id)
  if (orders.resultAccept !== false) {
    setOpen(true, "Заказ принят");
    await orders.orderDetails(route.params.id)
  } else {
    setOpen(true, "Произошла ошибка");
  }
}

const completeOrderLocal = async () => {
  await orders.completeOrder(orders.resultDetails.id)
  if (orders.resultComplete !== false) {
    setOpen(true, "Заказ завершен");
    await orders.orderDetails(route.params.id)
  } else {
    setOpen(true, "Произошла ошибка");
  }
}

const handleRefresh = (event) => {
  setTimeout(async () => {
    await nextTick()
    await orders.orderDetails(route.params.id)
  }, 2000);
};

onMounted(async () => {
  await nextTick()
  await orders.orderDetails(route.params.id)
})
</script>

<template>
  <ion-page>

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title v-if="orders.resultDetails">
          Заказ №{{ orders.resultDetails.user_order.order_number }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-grid
          v-if="orders.resultDetails"
          class="ion-padding">
        <ion-col>
          <ion-card class="ion-margin-bottom ion-no-margin">

            <ion-card-header>
              <ion-card-title class="ion-margin-bottom">
                Данные заказчика
              </ion-card-title>
              <ion-chip
                  style="width: max-content"
                  class="ion-no-margin">
                ИИН:
                <ion-text>{{ orders.resultDetails.user.iin }}</ion-text>
              </ion-chip>
            </ion-card-header>

            <ion-card-content>
              <ion-grid class="ion-no-padding ion-margin-bottom">
                <ion-row class="ion-margin-bottom">
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>ФИО:</ion-text>
                      <ion-text>{{ orders.resultDetails.user.name }}</ion-text>
                    </ion-col>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-margin-bottom">
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Email:</ion-text>
                      <ion-text>{{ orders.resultDetails.user.email }}</ion-text>
                    </ion-col>
                  </ion-col>
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Телефон:</ion-text>
                      <ion-text>{{ orders.resultDetails.user.phone_number }}</ion-text>
                    </ion-col>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
          <ion-card
              v-if="orders.resultDetails"
              class="ion-no-margin">

            <ion-card-header>
              <ion-card-title class="ion-margin-bottom">
                Данные заказа
              </ion-card-title>
              <ion-chip
                  class="ion-no-margin"
                  style="width: max-content">
                Оплачен:
                <ion-text v-if="orders.resultDetails.user_order.is_paid">Да</ion-text>
                <ion-text v-else>Нет</ion-text>
              </ion-chip>
            </ion-card-header>

            <ion-card-content>
              <ion-grid class="ion-no-padding ion-margin-bottom">
                <ion-row class="ion-margin-bottom">
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Дата создания:</ion-text>
                      <ion-text>{{ orders.resultDetails.day }}</ion-text>
                    </ion-col>
                  </ion-col>
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Время:</ion-text>
                      <ion-text>{{ orders.resultDetails.start }} - {{ orders.resultDetails.end }}</ion-text>
                    </ion-col>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-margin-bottom">
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Цена:</ion-text>
                      <ion-text>{{ orders.resultDetails.price }}</ion-text>
                    </ion-col>
                  </ion-col>
                </ion-row>
                <ion-row class="ion-margin-bottom">
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Тип:</ion-text>
                      <ion-text>{{ orders.resultDetails.service.name }}</ion-text>
                    </ion-col>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col class="ion-no-padding">
                    <ion-col class="flex-column">
                      <ion-text>Адрес:</ion-text>
                      <ion-text>{{ orders.resultDetails.address.title }}</ion-text>
                    </ion-col>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
        <ion-button
            v-if="orders.resultDetails.status === 'created'"
            @click="acceptOrderLocal"
            style="color: #fff"
            fill="solid"
            shape="round"
            expand="full">
          Принять заказ
        </ion-button>
        <ion-button
            v-if="orders.resultDetails.status === 'in_process'"
            @click="completeOrderLocal"
            style="color: #fff"
            fill="solid"
            shape="round"
            expand="full">
          Завершить заказ
        </ion-button>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>