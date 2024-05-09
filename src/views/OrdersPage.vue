<script setup>
import {nextTick, onMounted, ref} from 'vue';
import {
  IonPage,
  IonContent,
  IonRow,
  IonGrid,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonNavLink,
  IonSpinner,
  IonText,
  IonCardTitle,
  IonChip,
  IonCol, IonRefresherContent, IonRefresher
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

const handleRefresh = (event) => {
  setTimeout(async () => {
    await nextTick()
    await user.getProfile()
    await orders.listOrders({type: tab.value})
  }, 2000);
};

onMounted(async () => {
  await nextTick()
  await user.getProfile()
  await orders.listOrders({type: tab.value})
})
</script>

<template>
  <ion-page>
    <HeaderBlock/>
    <ion-content
        ref="content"
        fullscreen>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-col v-if="orders.result">
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
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-card
                  v-for="(order, index) of orders.result.data"
                  :key="index"
                  color="light"
                  class="ion-margin-bottom ion-no-margin"
              >

                <ion-card-header>
                  <ion-grid style="width: 100%">
                    <ion-row
                        style="width: 100%"
                        class="ion-align-items-center ion-justify-content-between">
                      <ion-card-title>
                        №{{ order.order_number }}
                      </ion-card-title>
                      <ion-chip
                          class="ion-no-margin"
                          style="width: max-content">
                        {{ order.status }}
                      </ion-chip>
                    </ion-row>
                  </ion-grid>
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
                  <ion-nav-link
                      :router-link="'/orders/' + order.id"
                      router-direction="forward">
                    <ion-button>
                      Перейти к заказу
                    </ion-button>
                  </ion-nav-link>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-col>
      <ion-spinner v-else></ion-spinner>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>