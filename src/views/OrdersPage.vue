<script setup>
import {onMounted, ref} from 'vue';
import {
  IonPage,
  IonContent,
  IonRow,
  IonGrid,
  IonButton,
} from '@ionic/vue';
import {useUserStore} from "@/stores/user";
import {useOrdersStore} from "@/stores/orders.js";
import HeaderBlock from "@/components/HeaderBlock.vue";

const user = useUserStore()
const orders = useOrdersStore()

const links = ref([
  {
    title: 'Новые',
    type: 'created'
  },
  {
    title: 'Принятые',
    type: 'accepted'
  },
  {
    title: 'Завершенные',
    type: 'completed'
  }
])

const tab = ref('created');

onMounted(async () => {
  await user.getProfile()
  await orders.listOrders({type: tab.value})
})
</script>

<template>
  <ion-page>
    <HeaderBlock/>
    <ion-content
        color="light"
                 v-if="orders.result">
      <ion-grid class="ion-padding">
        <ion-row>
          <ion-button
              v-for="(item, index) of links"
              @click="tab = item.type; orders.listOrders({type: tab})"
              :key="index"
              :fill="tab === item.type ? 'solid' : 'clear'"
              size="small"
          >
            {{ item.title }}
          </ion-button>
        </ion-row>
      </ion-grid>
      <ion-grid class="ion-padding">
        <ion-row>
          <ion-col>
            <ion-card
                v-for="(order, index) of orders.result.data"
                :key="index"
                class="ion-margin-bottom ion-no-margin"
            >

              <ion-card-header>
                <ion-card-title>
                  №{{ order.order_number }}
                </ion-card-title>
                <ion-card-subtitle class="text-with-bg">
                  {{ order.status }}
                </ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <ion-grid class="ion-no-padding ion-margin-bottom">
                  <ion-row class="ion-margin-bottom">
                    <ion-col class="ion-no-padding">
                      <ion-col class="flex-column">
                        <ion-text>Дата создания:</ion-text>
                        <ion-text>{{ order.date.day }}</ion-text>
                      </ion-col>
                    </ion-col>
                    <ion-col class="ion-no-padding">
                      <ion-col class="flex-column">
                        <ion-text>Время:</ion-text>
                        <ion-text>{{ order.date.start }} - {{ order.date.end }}</ion-text>
                      </ion-col>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col class="ion-no-padding">
                      <ion-col class="flex-column">
                        <ion-text>Цена:</ion-text>
                        <ion-text>{{ order.price }}</ion-text>
                      </ion-col>
                    </ion-col>
                    <ion-col class="ion-no-padding">
                      <ion-col class="flex-column">
                        <ion-text>Тип:</ion-text>
                        <ion-text>{{ order.name }}</ion-text>
                      </ion-col>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                <ion-button
                    :router-link="'/orders/' + order.id"
                    class="text-sm">
                  Перейти к заказу
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
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